import React from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ImagePlus, Palette, Images, Copy, ArrowRight } from "lucide-react";

const services = [
  {
    id: "enhance",
    icon: Sparkles,
    title: "AI Image Enhancement",
    description:
      "Enhance your images with advanced AI technology for stunning, professional-quality results.",
    page: "/ImageEnhancement",
  },
  {
    id: "logo",
    icon: ImagePlus,
    title: "Logo Add",
    description:
      "Seamlessly add your logo or watermark to images with perfect placement and blending.",
    page: "/logo-add",
  },
  {
    id: "creative",
    icon: Palette,
    title: "Creative Tool",
    description:
      "Unleash your creativity with powerful editing tools and artistic filters.",
    page: "/creative-tool",
  },
  {
    id: "img2img",
    icon: Images,
    title: "Image from Image",
    description:
      "Generate new images based on your existing photos using AI transformation.",
    page: "/image-from-image",
  },
  {
    id: "variations",
    icon: Copy,
    title: "Image to 6 Variations",
    description:
      "Create 6 unique variations of your image with different styles and effects.",
    page: "/image-variations",
  },
];

export default function ServicesSection() {
  const navigate = useNavigate();

  const handleServiceClick = (servicePage) => {
    navigate(servicePage); 
  };

  return (
    <section className="services-section">
      <div className="services-container">
        <div className="services-header">
          <h2>Our Services</h2>
          <p>Powerful AI-powered image processing tools to transform your visuals</p>
        </div>

        <div className="services-grid">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div key={service.id} className="service-card">
                <div className="service-icon">
                  <Icon className="icon" />
                </div>

                <h3>{service.title}</h3>
                <p>{service.description}</p>

                <button
                  className="service-btn"
                  onClick={() => handleServiceClick(service.page)}
                >
                  Get Started
                  <ArrowRight className="arrow-icon" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
