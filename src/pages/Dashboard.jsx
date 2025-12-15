import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "../styles/app.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const navigate = useNavigate();
  const user_id = localStorage.getItem("user_id");

  const [user, setUser] = useState({
    full_name: "",
    email: "",
  });

  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user_id) {
      navigate("/");
      return;
    }

    fetchUserInfo();
    fetchCredits();
  }, []);

  // ----------------------------------------
  // 🔍 FETCH USER INFO (SAFE)
  // ----------------------------------------
  const fetchUserInfo = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/user/${user_id}`);

      if (!res.ok) {
        const text = await res.text();
        console.error("❌ User info API error:", res.status, text);
        throw new Error(text);
      }

      const data = await res.json();
      setUser(data);
      setNewName(data.full_name || "");
    } catch (err) {
      console.error("User info fetch error:", err);
    }
  };

  // ----------------------------------------
  // 🔍 FETCH CREDITS (SAFE)
  // ----------------------------------------
  const fetchCredits = async () => {
    try {
      const res = await fetch(`${API_URL}/payments/credits?user_id=${user_id}`);

      if (!res.ok) {
        const text = await res.text();
        console.error("❌ Credits API error:", res.status, text);
        throw new Error(text);
      }

      const data = await res.json();
      setCredits(data.credits || 0);
    } catch (err) {
      console.error("Credits fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------
  // ✏️ UPDATE NAME
  // ----------------------------------------
  const handleNameUpdate = async () => {
    try {
      setSaving(true);

      const res = await fetch(`${API_URL}/auth/update-name`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id,
          full_name: newName,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("❌ Update name error:", res.status, text);
        throw new Error(text);
      }

      setUser((prev) => ({ ...prev, full_name: newName }));
      alert("Name updated successfully");
    } catch (err) {
      alert("Failed to update name");
    } finally {
      setSaving(false);
    }
  };

  // ----------------------------------------
  // 🔒 UPDATE PASSWORD
  // ----------------------------------------
  const handlePasswordUpdate = async () => {
    try {
      if (!newPassword) return alert("Enter a password");

      setSaving(true);

      const res = await fetch(`${API_URL}/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id,
          new_password: newPassword,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("❌ Update password error:", res.status, text);
        throw new Error(text);
      }

      setNewPassword("");
      alert("Password updated successfully");
    } catch (err) {
      alert("Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  // ----------------------------------------
  // ⏳ LOADING STATE
  // ----------------------------------------
  if (loading) {
    return (
      <>
        <Header />
        <div className="dashboard-loading">Loading your dashboard…</div>
      </>
    );
  }

  // ----------------------------------------
  // ✅ DASHBOARD UI
  // ----------------------------------------
  return (
    <>
      <Header />

      <div className="dashboard-wrapper">
        <h1 className="dashboard-title">Account Overview</h1>

        <div className="dashboard-grid">
          <div className="dashboard-left">
            <div className="dashboard-card">
              <h3 className="card-title">Profile</h3>
              <p><strong>Name:</strong> {user.full_name}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>

            <div className="dashboard-card">
              <h3 className="card-title">Credits Balance</h3>
              <div className="credits-count">{credits}</div>
              <button
                className="primary-btn"
                onClick={() => navigate("/buy-credits")}
              >
                Buy More Credits
              </button>
            </div>
          </div>

          <div className="dashboard-right">
            <div className="dashboard-card">
              <h3 className="card-title">Update Full Name</h3>
              <input
                className="input-field"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <button
                className="secondary-btn"
                onClick={handleNameUpdate}
                disabled={saving}
              >
                Save Changes
              </button>
            </div>

            <div className="dashboard-card">
              <h3 className="card-title">Change Password</h3>
              <input
                type="password"
                className="input-field"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
              />
              <button
                className="secondary-btn"
                onClick={handlePasswordUpdate}
                disabled={saving}
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
