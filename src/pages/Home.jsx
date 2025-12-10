import React from "react";
import Header from "../components/Header";
import ServicesSection from "../components/ServicesSection";
import AboutSection from "../components/AboutSection.jsx";
import Footer from "../components/Footer";


export default function Home() {
  return (
    <div className="home-container">
      <Header />

      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text-wrapper">
            <h1 className="hero-title">
              Transform Your Images
              <br />
              <span className="hero-gradient-text">with AI Power</span>
            </h1>

            <p className="hero-subtitle">
              Powerful AI-powered image processing tools to enhance, transform,
              and create stunning visuals in seconds.
            </p>
          </div>
        </div>
      </section>

      <ServicesSection />
      <AboutSection />
      <Footer />
    </div>
  );
}
