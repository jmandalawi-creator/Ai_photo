import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/app.css";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const lastService = localStorage.getItem("last_service") || "/ImageEnhancement";

    const timer = setTimeout(() => {
      navigate(lastService, { replace: true });
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="redirect-overlay">
      <div className="redirect-card">
        <div className="spinner"></div>
        <h2>Payment Successful</h2>
        <p>Redirecting you to your workspace…</p>
      </div>
    </div>
  );
}
