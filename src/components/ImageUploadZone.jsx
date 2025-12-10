import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@supabase/supabase-js";
import AuthModal from "./AuthModal";
import CreditsModal from "./CreditsModal";
import { isLoggedIn } from "../utils/auth";
import { getCredits, spendCredits } from "../utils/api";
import { useLocation } from "react-router-dom";
import "../styles/app.css";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const CREDIT_COST = {
  ImageEnhancement: 5,
  LogoAdd: 3,
  CreativeTool: 2,
  ImageFromImage: 4,
  ImageVariations: 6,
};

export default function ImageUploadZone({ onUploadComplete }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showAuth, setShowAuth] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const fileInputRef = useRef(null);
  const tempFilesRef = useRef([]);
  const processingRef = useRef([]);

  const location = useLocation();
  const currentService =
    location.pathname.replace("/", "") || "ImageEnhancement";

  const webhookUrl =
    "https://c3d.app.n8n.cloud/webhook/7f38b752-28b9-4675-81af-f182dd5eb743";

  const addFiles = async (fileList) => {
    if (!isLoggedIn()) {
      tempFilesRef.current = Array.from(fileList);
      setShowAuth(true);
      return;
    }

    const imageFiles = Array.from(fileList).filter((f) =>
      f.type.startsWith("image/")
    );

    if (!imageFiles.length) {
      toast.error("Please select valid image files");
      return;
    }

    const mapped = imageFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      fileName: file.name,
      size: file.size,
      publicUrl: URL.createObjectURL(file),
      status: "pending",
      processedUrl: "",
    }));

    setSelectedFiles((prev) => [...prev, ...mapped]);
  };

  const handleAuthSuccess = async () => {
    setShowAuth(false);
    if (tempFilesRef.current.length > 0) {
      await addFiles(tempFilesRef.current);
      tempFilesRef.current = [];
    }
  };

  const handleFileSelect = (files) => addFiles(files);
  const handleDrop = (e) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  };
  const handleDragOver = (e) => e.preventDefault();
  const removeFile = (id) =>
    setSelectedFiles((prev) => prev.filter((f) => f.id !== id));

  const onProcessClick = async () => {
    if (!isLoggedIn()) {
      setShowAuth(true);
      return;
    }

    if (!selectedFiles.length) return;

    const userId = localStorage.getItem("user_id");
    if (!userId) {
      toast.error("User not detected. Please log in again.");
      return;
    }

    const credits = await getCredits(userId);
    const creditsPerImage = CREDIT_COST[currentService] || 1;
    const requiredCredits = selectedFiles.length * creditsPerImage;

    if (credits < requiredCredits) {
      setShowCreditModal(true);
      return;
    }

    startProcess(creditsPerImage);
  };

  const startProcess = async (creditsPerImage) => {
    processingRef.current = [...selectedFiles];

    const imagesToProcess = processingRef.current.map((s) => ({
      id: s.id,
      fileName: s.fileName,
      status: "processing",
      processedUrl: "",
    }));

    onUploadComplete(imagesToProcess);
    setSelectedFiles([]);

    for (let idx = 0; idx < processingRef.current.length; idx++) {
      const s = processingRef.current[idx];

      try {
        const safeFileName = s.fileName
          .replace(/\s+/g, "_")
          .replace(/[()]/g, "")
          .replace(/[^a-zA-Z0-9._-]/g, "");

        const uniqueName = `uploads/${Date.now()}-${safeFileName}`;

        const { error: uploadError } = await supabase.storage
          .from("AI_Photo_studio_uploaded_Images")
          .upload(uniqueName, s.file, {
            cacheControl: "3600",
            contentType: s.file.type,
            upsert: false,
          });

        if (uploadError) {
          console.error("UPLOAD ERROR:", uploadError);
          imagesToProcess[idx].status = "failed";
          onUploadComplete([...imagesToProcess]);
          continue;
        }

        const { data: publicData } = supabase.storage
          .from("AI_Photo_studio_uploaded_Images")
          .getPublicUrl(uniqueName);

        const publicUrl = publicData?.publicUrl;

        if (!publicUrl) {
          imagesToProcess[idx].status = "failed";
          onUploadComplete([...imagesToProcess]);
          continue;
        }

        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: uniqueName,
            image_url: publicUrl,
          }),
        });

        const result = await response.json();
        const resObj = Array.isArray(result) ? result[0] : result;

        let raw =
          resObj?.processed_image ||
          resObj?.processed_image_url ||
          resObj?.image_url ||
          resObj?.data?.processed_image ||
          "";

        if (raw && raw.startsWith("data:image")) {
          imagesToProcess[idx].processedUrl = raw;
        } else if (raw) {
          imagesToProcess[idx].processedUrl =
            `data:image/png;base64,${raw}`;
        } else {
          imagesToProcess[idx].processedUrl = publicUrl;
        }

        imagesToProcess[idx].status = "completed";
        onUploadComplete([...imagesToProcess]);

        const userId = localStorage.getItem("user_id");
        await spendCredits(userId, creditsPerImage);
      } catch (err) {
        console.error("PROCESS ERROR:", err);
        imagesToProcess[idx].status = "failed";
        onUploadComplete([...imagesToProcess]);
      }
    }

    processingRef.current = [];
    toast.success("Processing finished");
  };

  return (
    <div className="upload-zone-container">
      <AuthModal
        open={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={handleAuthSuccess}
      />

      <CreditsModal
        open={showCreditModal}
        onClose={() => setShowCreditModal(false)}
      />

      <div className="upload-zone" onDrop={handleDrop} onDragOver={handleDragOver}>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        <div className="upload-content">
          <div className="upload-icon">
            <Upload size={40} color="#4f46e5" />
          </div>

          <div className="upload-text">
            <h3>Drop your images here</h3>
            <p>or click below to browse your files</p>
          </div>

          <button
            className="browse-btn"
            onClick={() => {
              if (!isLoggedIn()) {
                setShowAuth(true);
                return;
              }
              fileInputRef.current?.click();
            }}
          >
            <ImageIcon size={16} style={{ marginRight: 6 }} /> Browse Files
          </button>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="preview-section">
          <h4>Selected Images ({selectedFiles.length})</h4>

          <div className="preview-grid">
            {selectedFiles.map((s) => (
              <div key={s.id} className="preview-card">
                <img src={s.publicUrl} alt={s.fileName} />

                <button className="remove-btn" onClick={() => removeFile(s.id)}>
                  <X size={16} color="#fff" />
                </button>

                <div className="preview-info">
                  <p className="name">{s.fileName}</p>
                  <p className="size">{(s.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
            ))}
          </div>

          <button className="process-btn" onClick={onProcessClick}>
            <Upload size={16} /> Process {selectedFiles.length} Image(s)
          </button>
        </div>
      )}
    </div>
  );
}
