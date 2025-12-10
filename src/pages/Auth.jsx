import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { isLoggedIn } from "../utils/auth";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  let servicePage = params.get("service") || "/ImageEnhancement";
  if (!servicePage.startsWith("/")) servicePage = "/" + servicePage;

  useEffect(() => {
    if (isLoggedIn()) {
      navigate(servicePage, { replace: true });
    }
  }, [navigate, servicePage]);

  const showAlert = (msg, type = "error") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const res = await fetch("http://localhost:8000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        console.log("LOGIN RESPONSE:", data);

        if (!res.ok || data.error) {
          showAlert("Invalid email or password.", "error");
          setIsLoading(false);
          return;
        }

        const token = data.session?.access_token;
        const user = data.session?.user || {};

        localStorage.setItem("token", token);
        localStorage.setItem("user_id", user.id || "");
        localStorage.setItem("user_email", user.email || "");
        localStorage.setItem("username", user.user_metadata?.full_name || "");

        navigate(servicePage, { replace: true });
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        showAlert("Passwords do not match.", "error");
        setIsLoading(false);
        return;
      }

      const res = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
        }),
      });

      const data = await res.json();
      console.log("SIGNUP RESPONSE:", data);

      if (!res.ok) {
        showAlert(data.error || "Signup failed.", "error");
        setIsLoading(false);
        return;
      }

      const token = data.session?.access_token;
      const user = data.user || {};

      localStorage.setItem("token", token);
      localStorage.setItem("user_id", user.id || "");
      localStorage.setItem("user_email", user.email || "");
      localStorage.setItem(
        "username",
        user.user_metadata?.full_name || fullName
      );

      navigate("/payment-setup");
    } catch (error) {
      console.error(error);
      showAlert("Backend unreachable. Check FastAPI.", "error");
    }

    setIsLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className={`auth-left ${isLogin ? "login-bg" : "signup-bg"}`}>
          <div className="auth-left-content">
            <h1>{isLogin ? "Transform Your Images" : "Welcome Aboard"}</h1>
            <p>
              {isLogin
                ? "Sign in to use powerful AI tools instantly."
                : "Create an account to unlock premium AI features."}
            </p>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-form-card">
            <h2>{isLogin ? "Sign In" : "Create Account"}</h2>

            {message && (
              <div
                className={`alert-box ${
                  messageType === "error" ? "alert-error" : "alert-success"
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              )}

              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="password-wrapper">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              {!isLogin && (
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              )}

              <Button type="submit">
                {isLoading
                  ? isLogin
                    ? "Signing in..."
                    : "Creating..."
                  : isLogin
                  ? "Sign In"
                  : "Create Account"}
              </Button>
            </form>

            <p className="toggle-text">
              {isLogin ? "New here?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="toggle-btn"
              >
                {isLogin ? "Create Account" : "Sign In"}
              </button>
            </p>

            <Link to="/" className="back-home">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
