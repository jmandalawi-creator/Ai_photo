// src/components/ProcessedImagesGrid.jsx
import React from "react";
import ProcessedImageCard from "./ProcessedImageCard";
import { Image as ImageIcon } from "lucide-react";
import "../styles/app.css";

export default function ProcessedImagesGrid({ processedImages = [] }) {
  if (!processedImages || processedImages.length === 0) {
    return (
      <div className="no-images">
        <div className="no-images-icon"><ImageIcon size={40} color="#94a3b8" /></div>
        <h3>No processed images yet</h3>
        <p>Upload and process your images to see results appear here</p>
      </div>
    );
  }

  return (
    <div className="processed-grid">
      {processedImages.map((image) => (
        <ProcessedImageCard key={image.id} image={image} />
      ))}
    </div>
  );
}
