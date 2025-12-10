import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const API_URL = import.meta.env.VITE_API_URL;

function SetupForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await stripe.confirmSetup({ elements, redirect: "if_required" });
    if (!error) navigate("/ImageEnhancement");
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit">Save Payment Method</button>
    </form>
  );
}

export default function PaymentSetup() {
  const [clientSecret, setClientSecret] = useState(null);
  const userId = localStorage.getItem("user_id");
  const email = localStorage.getItem("user_email");

  useEffect(() => {
    fetch(`${API_URL}/payments/create-setup-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, email }),
    })
      .then(res => res.json())
      .then(data => setClientSecret(data.client_secret));
  }, []);

  return clientSecret ? (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <SetupForm />
    </Elements>
  ) : (
    <p>Loading...</p>
  );
}
