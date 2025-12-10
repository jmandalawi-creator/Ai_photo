// src/pages/ImageEnhancement.jsx
import React, { useState } from "react";
import Header from "../components/Header";
import ImageUploadZone from "../components/ImageUploadZone";
import ProcessedImagesGrid from "../components/ProcessedImagesGrid";
import AboutSection from "../components/AboutSection";
import Footer from "../components/Footer";
import "../styles/app.css";

export default function ImageEnhancement() {
  const [processedImages, setProcessedImages] = useState([]);

  // onUploadComplete will be called by upload zone to set loader cards and then update them
  const handleUploadComplete = (images = []) => {
    setProcessedImages(images);
  };

  return (
    <div className="page-wrap">
      <Header />

      {/* hero + upload */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-text">
            <h1 className="hero-title">
              AI Image <br />
              <span className="title-gradient">Enhancement</span>
            </h1>
            <p className="hero-subtitle">Enhance your images with advanced AI technology for stunning results.</p>
          </div>

          <ImageUploadZone onUploadComplete={handleUploadComplete} />
        </div>
      </section>

      {/* Enhanced Images section (single place) */}
      <section className="enhanced-section">
        <div className="enhanced-container">
          <div className="enhanced-heading">
            <h2 className="enhanced-title">Enhanced Images</h2>
            <p className="enhanced-subtitle">Your enhanced images will appear here automatically</p>
          </div>

          <ProcessedImagesGrid processedImages={processedImages} />
        </div>
      </section>

      <AboutSection />
      <Footer />
    </div>
  );
}
