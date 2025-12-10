import React, { useState } from "react";
import "../styles/app.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function BuyCredits() {
  const userId = localStorage.getItem("user_id");
  const email = localStorage.getItem("user_email");
  const [selectedPackage, setSelectedPackage] = useState(null);

  const creditPackages = [
    { id: "pack_small", credits: 10, price: 5.0, tag: "Starter" },
    { id: "pack_medium", credits: 25, price: 10.0, tag: "Popular" },
    { id: "pack_large", credits: 60, price: 20.0, tag: "Best Value" },
    { id: "pack_pro", credits: 100, price: 30.0, tag: "Pro Plan" },
  ];

  const handleCheckout = async () => {
    if (!selectedPackage) return;

    const payload = {
      user_id: userId,
      package_id: selectedPackage.id,
      email,
      cancel_url: window.location.href,
    };

    const res = await fetch(`${API_URL}/payments/create-checkout-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (data.checkout_url) window.location.href = data.checkout_url;
  };

  return (
    <div>
      {creditPackages.map(pkg => (
        <button key={pkg.id} onClick={() => setSelectedPackage(pkg)}>
          {pkg.credits} Credits - ${pkg.price}
        </button>
      ))}
      <button onClick={handleCheckout}>Proceed to Checkout</button>
    </div>
  );
}
