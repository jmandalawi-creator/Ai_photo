import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import ImageEnhancement from "./pages/ImageEnhancement";
import PrivateRoute from "./components/PrivateRoute";
import PaymentSetup from "./pages/PaymentSetup";
import LogoAdd from "./pages/LogoAdd"; 
import Dashboard from "./pages/Dashboard";
import BuyCredits from "./pages/BuyCredits";
import PaymentSuccess from "./pages/PaymentSuccess";

import AuthModal from "./components/AuthModal"; 

export default function App() {
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      setShowAuth(true);

      if (e.detail?.redirectTo) {
        localStorage.setItem("redirect_after_login", e.detail.redirectTo);
      }
    };

    window.addEventListener("open-login-modal", handler);
    return () => window.removeEventListener("open-login-modal", handler);
  }, []);

  const handleAuthSuccess = () => {
    setShowAuth(false);

    const redirect = localStorage.getItem("redirect_after_login");
    if (redirect) {
      localStorage.removeItem("redirect_after_login");
      window.location.href = redirect;
    }
  };

  return (
    <Router>

      <AuthModal
        open={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={handleAuthSuccess}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/payment-setup" element={<PaymentSetup />} />
        <Route path="/logo-add" element={<LogoAdd />} />
        <Route path="/ImageEnhancement" element={<ImageEnhancement />} />
        <Route path="/payments/success" element={<PaymentSuccess />} />
        <Route path="/buy-credits" element={<BuyCredits />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>

    </Router>
  );
}
