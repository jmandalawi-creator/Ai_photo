// src/components/ProcessedImageCard.jsx
import React, { useState } from "react";
import { Download, Eye, Loader2 } from "lucide-react";
import "../styles/app.css";

export default function ProcessedImageCard({ image }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDownload = async () => {
    try {
      const src = image.processedUrl || image.publicUrl || image.base64;
      // if data URL, download directly
      if (src.startsWith("data:image")) {
        const link = document.createElement("a");
        link.href = src;
        link.download = image.fileName || "processed.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      // otherwise fetch blob
      const res = await fetch(src);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = image.fileName || "processed.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <>
      <div className="processed-card">
        <div className="image-wrapper">
          {image.status === "processing" ? (
            <div className="loader-wrap">
              <Loader2 className="loader-spin" />
            </div>
          ) : (
            <img src={image.processedUrl || image.publicUrl || image.base64} alt={image.fileName || "img"} />
          )}
        </div>

        <div className={`status ${image.status}`}>{(image.status || "completed").toUpperCase()}</div>

        <div className="actions">
          <button onClick={() => setIsModalOpen(true)} className="view-btn" disabled={image.status !== "completed"}>
            <Eye size={14} /> View
          </button>
          <button onClick={handleDownload} className="download-btn" disabled={image.status !== "completed"}>
            <Download size={14} /> Save
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={image.processedUrl || image.publicUrl || image.base64} alt={image.fileName} />
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
