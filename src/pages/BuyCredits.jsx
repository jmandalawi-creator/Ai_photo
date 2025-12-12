import React, { useState } from "react";
import "../styles/app.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function BuyCredits() {
  const userId = localStorage.getItem("user_id");
  const email = localStorage.getItem("user_email");

  const [selectedPackage, setSelectedPackage] = useState(null);

  const creditPackages = [
    { id: "pack_small", credits: 10, price: 5.0, tag: "Starter", glow: "#7c3aed" },
    { id: "pack_medium", credits: 25, price: 10.0, tag: "Popular", glow: "#6d28d9" },
    { id: "pack_large", credits: 60, price: 20.0, tag: "Best Value", glow: "#ec4899" },
    { id: "pack_pro", credits: 100, price: 30.0, tag: "Pro Plan", glow: "#341022ff" },
  ];

  const handleCheckout = async () => {
    if (!selectedPackage) {
      alert("Please select a credit package.");
      return;
    }

    const payload = {
      user_id: userId,
      package_id: selectedPackage.id,
      email,
      cancel_url: window.location.href,
    };

    try {
      const res = await fetch(`${API_URL}/payments/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("Checkout error:", await res.text());
        alert("Payment processing failed.");
        return;
      }

      const data = await res.json();
      if (data.checkout_url) window.location.href = data.checkout_url;
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Network error while contacting payment server.");
    }
  };

  return (
    <div className="buy-credits-wrapper">
      <div className="left-panel">
        <h1 className="title">Buy Credits</h1>
        <p className="subtitle">Select a package to start creating amazing AI visuals.</p>

        <div className="card-grid">
          {creditPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`premium-card ${selectedPackage?.id === pkg.id ? "selected" : ""}`}
              style={{ "--card-glow": pkg.glow }}
              onClick={() => setSelectedPackage(pkg)}
            >
              <div className="badge">{pkg.tag}</div>

              <h3 className="credit-amount">{pkg.credits} Credits</h3>
              <p className="price">${pkg.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">
        <div className="premium-summary">
          <h2>Purchase Summary</h2>

          {selectedPackage ? (
            <>
              <div className="summary-row">
                <span>Credits</span>
                <span>{selectedPackage.credits}</span>
              </div>
              <div className="summary-row">
                <span>Price</span>
                <span>${selectedPackage.price}</span>
              </div>

              <hr className="divider" />

              <div className="summary-total">
                <span>Total</span>
                <span>${selectedPackage.price}</span>
              </div>

              <button className="checkout-btn premium-btn" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </>
          ) : (
            <p className="empty-msg">Select a credit package to continue.</p>
          )}
        </div>
      </div>

      <div className="floating-bg-circle circle1"></div>
      <div className="floating-bg-circle circle2"></div>
    </div>
  );
}
