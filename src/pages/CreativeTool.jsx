import React from 'react';
import Header from '../components/Header';
import AboutSection from '../components/AboutSection';
import Footer from '../components/Footer';
import { Palette } from 'lucide-react';

export default function CreativeTool() {
  return (
    <div className="page-container">
      <Header />

      <section className="creative-tool-section">
        <div className="content-wrapper">
          <div className="text-center header-text">
            <h1 className="main-title">
              Creative
              <br />
              <span className="gradient-text">Tool</span>
            </h1>
            <p className="description">
              Unleash your creativity with powerful editing tools and artistic filters.
            </p>
          </div>

          <div className="upload-box-wrapper">
            <div className="upload-box">
              <div className="icon-wrapper">
                <Palette className="icon" />
              </div>
              <h3 className="upload-title">Coming Soon</h3>
              <p className="upload-description">
                This service is currently under development. Stay tuned!
              </p>
            </div>
          </div>
        </div>
      </section>

      <AboutSection />
      <Footer />
    </div>
  );
}
