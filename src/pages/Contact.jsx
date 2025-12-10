import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <div className="contact-page">
      <Header />

      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1 className="contact-title">
            Get in <br />
            <span className="gradient-text">Touch</span>
          </h1>
          <p className="contact-subtitle">
            Have questions or feedback? We'd love to hear from you.
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-form-card">
            <h2 className="form-title">Send us a message</h2>
            <form className="contact-form">
              <input type="text" placeholder="Your Name" className="form-input" />
              <input type="email" placeholder="Your Email" className="form-input" />
              <input type="text" placeholder="Subject" className="form-input" />
              <textarea placeholder="Your Message" className="form-textarea"></textarea>
              <button type="submit" className="form-btn">Send Message</button>
            </form>
          </div>

          <div className="contact-info-card">
            <h2 className="form-title">Contact Information</h2>
            <div className="contact-info-items">
              <div className="contact-info-item">
                <div className="icon-wrapper">
                  <Mail className="icon" />
                </div>
                <div className="info-wrapper">
                  <h3 className="info-title">Email</h3>
                  <p className="info-text">info@imageprocessor.com</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="icon-wrapper">
                  <Phone className="icon" />
                </div>
                <div className="info-wrapper">
                  <h3 className="info-title">Phone</h3>
                  <p className="info-text">+1 (888) 123-4567</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="icon-wrapper">
                  <MapPin className="icon" />
                </div>
                <div className="info-wrapper">
                  <h3 className="info-title">Address</h3>
                  <p className="info-text">100 N HOWARD ST STE 4079, SPOKANE WA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
