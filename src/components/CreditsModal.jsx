import React from "react";
import { XCircle, Coins } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/app.css"; 

export default function CreditsModal({ open, onClose }) {
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div className="credits-overlay">
      <div className="credits-modal">
        
        <button className="credits-close" onClick={onClose}>✕</button>

        <div className="credits-header">
          <Coins size={48} className="credits-icon" />
          <h2>Not Enough Credits</h2>
          <p>You need more credits to process your images.</p>
        </div>

        <div className="credits-body">
          <p className="credits-text">
            Purchase credits to continue using AI services instantly.
          </p>
        </div>

        <div className="credits-actions">
          <button
            className="credits-buy-btn"
            onClick={() => {
              onClose();
              navigate("/buy-credits");
            }}
          >
            Buy Credits
          </button>

          <button className="credits-cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
