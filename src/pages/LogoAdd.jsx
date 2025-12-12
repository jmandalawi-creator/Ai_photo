import React, { useState } from "react";
import Header from "../components/Header";
import AboutSection from "../components/AboutSection";
import Footer from "../components/Footer";
import "../styles/app.css";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const N8N_WEBHOOK_URL =
  "https://c3d.app.n8n.cloud/webhook/266b3424-8a50-40cf-ab8c-74bc5335e2cb";

export default function LogoAdd() {
  // ✅ CLEAN STATE (NO SPACES IN KEYS)
  const [formData, setFormData] = useState({
    productType: "",
    uniqueFeatures: "",
    numberOfIdeas: "",
  });

  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);

  // ✅ INPUT HANDLER (FIXED)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => setLogoFile(e.target.files[0]);

  // ✅ SUPABASE UPLOAD
  const uploadLogoToSupabase = async (file) => {
    try {
      const safeName = file.name.replace(/\s+/g, "_");
      const uniqueName = `logo_uploads/${Date.now()}_${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from("Logo_Add_uploaded_logos")
        .upload(uniqueName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage
        .from("Logo_Add_uploaded_logos")
        .getPublicUrl(uniqueName);

      return publicData.publicUrl;
    } catch (err) {
      console.error("SUPABASE UPLOAD ERROR:", err);
      return null;
    }
  };

  // ✅ SUBMIT FORM → UPLOAD → SEND TO N8N
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!logoFile) return alert("Please upload a logo first.");

    setLoading(true);
    setVideoUrl(null);

    try {
      // 1️⃣ Upload logo
      const logoUrl = await uploadLogoToSupabase(logoFile);
      if (!logoUrl) throw new Error("Failed to upload logo.");

      // 2️⃣ Send CLEAN JSON to n8n (WITH BUSINESS FIELD NAMES)
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "Type of Product": formData.productType,
          "Unique Features": formData.uniqueFeatures,
          "Number of Ideas": formData.numberOfIdeas,
          logo_url: logoUrl,
        }),
      });

      const result = await response.json();

      if (result.video_url) {
        setVideoUrl(result.video_url);
      } else {
        alert("Video processing failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="page-container">
      <Header />

      <section className="logo-add-section">
        <div className="content-wrapper">
          <div className="text-center header-text">
            <h1 className="main-title">
              AI Logo <span className="gradient-text">Product Creator</span>
            </h1>
            <p className="description">
              Upload your logo and generate AI-powered product visualizations.
            </p>
          </div>

          {/* ✅ FORM */}
          <form className="logo-form" onSubmit={handleSubmit}>
            <label className="input-label">Type of Product</label>
            <input
              type="text"
              name="productType"
              value={formData.productType}
              onChange={handleChange}
              required
              className="input-field"
            />

            <label className="input-label">Unique Features</label>
            <input
              type="text"
              name="uniqueFeatures"
              value={formData.uniqueFeatures}
              onChange={handleChange}
              required
              className="input-field"
            />

            <label className="input-label">Number of Ideas</label>
            <input
              type="text"
              name="numberOfIdeas"
              placeholder="5"
              value={formData.numberOfIdeas}
              onChange={handleChange}
              required
              className="input-field"
            />

            <label className="input-label">Upload Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="input-field"
            />

            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? "Processing..." : "Generate Video"}
            </button>
          </form>

          {/* ✅ VIDEO OUTPUT */}
          {videoUrl && (
            <div className="processed-section">
              <h3>🎉 Generated Video</h3>
              <video src={videoUrl} controls className="processed-video" />
            </div>
          )}
        </div>
      </section>

      <AboutSection />
      <Footer />
    </div>
  );
}
