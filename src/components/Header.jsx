import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Image, ChevronDown } from "lucide-react";
import { isLoggedIn, logout } from "../utils/auth";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn()); 
  const dropdownRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const syncAuth = () => setLoggedIn(isLoggedIn());
    window.addEventListener("auth-change", syncAuth);
    return () => window.removeEventListener("auth-change", syncAuth);
  }, []);

  const handleServiceClick = (servicePage) => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate(`/${servicePage}`);
    } else {
      const loginEvent = new CustomEvent("open-login-modal", {
        detail: { redirectTo: `/${servicePage}` }
      });

      window.dispatchEvent(loginEvent);
    }

    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-content">
          <Link to="/" className="logo-wrapper">
            <div className="logo-icon">
              <Image className="icon" />
            </div>
            <span className="logo-text">Image Processor</span>
          </Link>

          <nav className="nav">
            <Link to="/" className="nav-link">Home</Link>

            <div className="dropdown" ref={dropdownRef}>
              <button className="dropdown-btn" onClick={() => setOpen(!open)}>
                Services <ChevronDown className="chevron" />
              </button>

              {open && (
                <div className="dropdown-menu">
                  <button onClick={() => handleServiceClick("ImageEnhancement")} className="dropdown-item">
                    AI Image Enhancement
                  </button>
                  <button onClick={() => handleServiceClick("logo-add")} className="dropdown-item">
                    Logo Add
                  </button>
                  <button onClick={() => handleServiceClick("CreativeTool")} className="dropdown-item">
                    Creative Tool
                  </button>
                  <button onClick={() => handleServiceClick("ImageFromImage")} className="dropdown-item">
                    Image from Image
                  </button>
                  <button onClick={() => handleServiceClick("ImageVariations")} className="dropdown-item">
                    Image to 6 Variations
                  </button>
                </div>
              )}
            </div>

            <Link to="/contact" className="nav-link">Contact</Link>
          </nav>

          <div className="header-actions">
            {loggedIn ? (
              <>
                <button
                  className="dashboard-btn"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </button>

                <button
                  className="contact-btn"
                  onClick={() => {
                    logout();                      
                    window.dispatchEvent(new Event("auth-change")); 
                    navigate("/");
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                className="contact-btn"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent("open-login-modal", { detail: {} })
                  );
                }}
              >
                Login
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
