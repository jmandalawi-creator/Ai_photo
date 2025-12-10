import React from 'react';
import { Image } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-logo">
            <div className="logo-icon">
              <Image className="icon" />
            </div>
            <span className="logo-text-footer">Image Processor</span>
          </div>

          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#contact">Contact</a>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} Image Processor. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
