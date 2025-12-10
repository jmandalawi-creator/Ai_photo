import React from 'react';
import Header from '../components/Header';
import AboutSection from '../components/AboutSection';
import Footer from '../components/Footer';
import { ImagePlus } from 'lucide-react';

export default function LogoAdd() {
  return (
    <div className="page-container">
      <Header />

      <section className="logo-add-section">
        <div className="content-wrapper">
          <div className="text-center header-text">
            <h1 className="main-title">
              Logo
              <br />
              <span className="gradient-text">Add Service</span>
            </h1>
            <p className="description">
              Seamlessly add your logo or watermark to images with perfect placement and blending.
            </p>
          </div>

          <div className="upload-box-wrapper">
            <div className="upload-box">
              <div className="icon-wrapper">
                <ImagePlus className="icon" />
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
