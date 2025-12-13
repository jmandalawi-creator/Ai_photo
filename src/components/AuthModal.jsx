import React, { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import { setToken } from "../utils/auth";

const API_URL = import.meta.env.VITE_API_URL;

export default function AuthModal({ open, onClose, onSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!open) return null;

  const handleLogin = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setMessage("Invalid email or password");
        setLoading(false);
        return;
      }

      const data = await res.json();

      const token = data.session?.access_token;
      const user = data.session?.user;

      if (!token || !user) {
        setMessage("Invalid email or password");
        setLoading(false);
        return;
      }

      setToken(token);
      localStorage.setItem("user_id", user.id);
      localStorage.setItem("user_email", user.email);
      localStorage.setItem("username", user.user_metadata?.full_name || "");

      setLoading(false);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setMessage("Backend not reachable");
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Signup failed");
        setLoading(false);
        return;
      }

      const token = data.session?.access_token;
      const user = data.session?.user || data.user;

      if (token) setToken(token);

      localStorage.setItem("user_id", user.id);
      localStorage.setItem("user_email", user.email);
      localStorage.setItem("username", user.user_metadata?.full_name || fullName);

      setLoading(false);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("SIGNUP ERROR:", err);
      setMessage("Cannot reach backend");
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-card animate-scaleIn">
        <button className="auth-close" onClick={onClose}>✕</button>

        <div className="auth-header">
          <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <p>{isLogin ? "Sign in to continue" : "Get started instantly"}</p>
        </div>

        {message && <div className="auth-error">{message}</div>}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            isLogin ? handleLogin() : handleSignup();
          }}
          className="auth-form"
        >
          {!isLogin && (
            <div className="auth-input-group">
              <User className="auth-input-icon" />
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          )}

          <div className="auth-input-group">
            <Mail className="auth-input-icon" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-input-group">
            <Lock className="auth-input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="auth-eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {!isLogin && (
            <div className="auth-input-group">
              <Lock className="auth-input-icon" />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}

          <button className="auth-submit" type="submit">
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="auth-footer-custom">
          <span>{isLogin ? "New here?" : "Already have an account?"}</span>
          <button
            className="auth-footer-link"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Create Account" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
