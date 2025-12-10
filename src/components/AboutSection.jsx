import React from 'react';
import { Zap, Shield, Star } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Fast Processing',
    description: 'Lightning-fast image processing powered by advanced AI technology for instant results.'
  },
  {
    icon: Shield,
    title: 'Secure Uploads',
    description: 'Your images are encrypted and processed securely. We prioritize your privacy and data safety.'
  },
  {
    icon: Star,
    title: 'High-Quality Results',
    description: 'Get professional-grade processed images with exceptional quality and detail preservation.'
  }
];

export default function AboutSection() {
  return (
    <section className="about-section">
      <div className="about-container">
        <div className="about-header">
          <h2>About This Project</h2>
          <p>
            Our image processing dashboard leverages cutting-edge AI technology to transform your images with precision and speed. Simply upload, process, and download your enhanced images in seconds.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <Icon className="icon" />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            );
          })}
        </div>

        <div className="how-it-works">
          <h3>How It Works</h3>
          <ol className="steps-list">
            <li>
              <span className="step-number">1</span>
              <span>Upload one or multiple images through our intuitive drag-and-drop interface</span>
            </li>
            <li>
              <span className="step-number">2</span>
              <span>Your images are securely sent through our processing database pipeline</span>
            </li>
            <li>
              <span className="step-number">3</span>
              <span>AI processes your images with advanced algorithms</span>
            </li>
            <li>
              <span className="step-number">4</span>
              <span>Processed results are displayed instantly in your dashboard for download</span>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
