import React from "react";
import "./Footer.css";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-brand">
            <h2 className="footer-logo">Code & Cravings</h2>

            <p className="footer-description">
              Delicious food, amazing restaurants, and fast delivery — all in
              one place.
            </p>

            <div className="footer-socials">
              <a
                href="https://www.instagram.com/jeet_a7389/"
                aria-label="Instagram"
              >
                Instagram
              </a>

              <a href="https://github.com/jitendra931" aria-label="Facebook">
                GitHub
              </a>

              <a href="#" aria-label="Twitter">
                Twitter
              </a>

              <a
                href="https://www.linkedin.com/in/jitendra-ahirwar-6564b7305/?isSelfProfile=true"
                aria-label="LinkedIn"
              >
                LinkedIn
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h3>Explore</h3>

            <button onClick={() => scrollToSection("popular-restaurants")}>
              Restaurants
            </button>

            <button onClick={() => scrollToSection("explore-menu")}>
              Explore Menu
            </button>

            <button onClick={() => scrollToSection("explore-menu")}>
              Popular Food
            </button>
          </div>

          <div className="footer-column">
            <h3>Company</h3>

            <button onClick={() => navigate("/info#about-us")}>About Us</button>
            <button onClick={() => navigate("/info#contact-us")}>
              Contact Us
            </button>
            <button onClick={() => navigate("/info#careers")}>Careers</button>
            <button onClick={() => navigate("/info#help-support")}>
              Help & Support
            </button>
          </div>

          <div className="footer-column">
            <h3>Legal</h3>

            <a href="/legal#privacy-policy">Privacy Policy</a>
            <a href="/legal#terms-conditions">Terms & Conditions</a>
            <a href="/legal#refund-policy">Refund Policy</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} Code & Cravings. All rights reserved.
          </p>

          <p>Made with ❤️ for food lovers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
