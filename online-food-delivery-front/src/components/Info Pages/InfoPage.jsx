import React from "react";
import "./InfoPage.css";

const InfoPage = () => {
  return (
    <div className="info-page">
      <section className="info-hero">
        <p className="info-hero-subtitle">CODE & CRAVINGS</p>
        <h1>How Can We Help?</h1>
        <p>
          Learn more about us, get in touch, explore career opportunities, or
          find help with your orders.
        </p>
      </section>

      <div className="info-container">
        <section id="about-us" className="info-section">
          <div className="info-section-label">01</div>

          <div className="info-section-content">
            <p className="info-section-subtitle">WHO WE ARE</p>
            <h2>About Us</h2>

            <p>
              Code & Cravings is a food discovery and delivery platform created
              to make finding great food simple, convenient, and enjoyable.
            </p>

            <p>
              We bring restaurants and food lovers together on one platform,
              making it easier to explore restaurants, discover delicious
              dishes, and order the food you love.
            </p>

            <p>
              Whether you are looking for a quick meal, exploring something new,
              or searching for your next favorite restaurant, Code & Cravings is
              built to make your food journey easier.
            </p>
          </div>
        </section>

        <section id="contact-us" className="info-section">
          <div className="info-section-label">02</div>

          <div className="info-section-content">
            <p className="info-section-subtitle">GET IN TOUCH</p>
            <h2>Contact Us</h2>

            <p>
              Have a question, suggestion, or need assistance? Our team is here
              to help.
            </p>

            <div className="contact-grid">
              <div className="contact-card">
                <span>EMAIL</span>
                <h3>jitendraa7389@gmail.com</h3>
                <p>For general questions, orders, and customer support.</p>
              </div>

              <div className="contact-card">
                <span>BUSINESS</span>
                <h3>garvithindoliya16@gmail.com</h3>
                <p>For restaurant partnerships and business inquiries.</p>
              </div>

              <div className="contact-card">
                <span>CAREERS</span>
                <h3>careers@code&cravings.com</h3>
                <p>Interested in joining the Code & Cravings team?</p>
              </div>
            </div>

            <div className="contact-note">
              <h3>Response Time</h3>
              <p>
                Our support team generally responds to queries within 24–48
                hours.
              </p>
            </div>
          </div>
        </section>

        <section id="careers" className="info-section">
          <div className="info-section-label">03</div>

          <div className="info-section-content">
            <p className="info-section-subtitle">JOIN OUR TEAM</p>
            <h2>Careers</h2>

            <p>
              We are always looking for talented and motivated people who want
              to build meaningful products and improve the way people discover
              and enjoy food.
            </p>

            <div className="career-grid">
              <div className="career-card">
                <h3>Software Engineering</h3>
                <p>
                  Build reliable and scalable technology that powers Code &
                  Cravings.
                </p>
              </div>

              <div className="career-card">
                <h3>Product & Design</h3>
                <p>
                  Create simple, useful, and delightful experiences for our
                  customers and restaurant partners.
                </p>
              </div>

              <div className="career-card">
                <h3>Restaurant Operations</h3>
                <p>
                  Work closely with restaurant partners and help them grow on
                  our platform.
                </p>
              </div>

              <div className="career-card">
                <h3>Marketing</h3>
                <p>
                  Help people discover Code & Cravings and the restaurants they
                  love.
                </p>
              </div>
            </div>

            <div className="career-cta">
              <h3>Want to work with us?</h3>
              <p>
                Send us your resume and tell us how you can contribute to Code &
                Cravings.
              </p>

              <a href="https://mail.google.com/mail/u/0/#inbox">
                Email Your Resume
              </a>
            </div>
          </div>
        </section>

        <section id="help-support" className="info-section">
          <div className="info-section-label">04</div>

          <div className="info-section-content">
            <p className="info-section-subtitle">NEED ASSISTANCE?</p>
            <h2>Help & Support</h2>

            <p>
              Find answers to common questions or contact our support team if
              you need additional assistance.
            </p>

            <div className="support-grid">
              <div className="support-card">
                <h3>Order Issues</h3>
                <p>
                  Having trouble with your order, delivery, or missing items?
                  Contact our support team.
                </p>
              </div>

              <div className="support-card">
                <h3>Payment Issues</h3>
                <p>
                  Need help with a payment, transaction, or refund? We can help
                  resolve payment-related problems.
                </p>
              </div>

              <div className="support-card">
                <h3>Account Issues</h3>
                <p>
                  Having trouble signing in or managing your account? Reach out
                  to us for assistance.
                </p>
              </div>

              <div className="support-card">
                <h3>Restaurant Support</h3>
                <p>
                  Restaurant partners can contact us for assistance with their
                  restaurant, menu, or orders.
                </p>
              </div>
            </div>

            <div className="faq-section">
              <h3>Frequently Asked Questions</h3>

              <div className="faq-item">
                <h4>How can I track my order?</h4>
                <p>
                  You can check your order status from the Orders section of
                  your account.
                </p>
              </div>

              <div className="faq-item">
                <h4>What should I do if my order is incorrect?</h4>
                <p>
                  Contact our support team with your order details so we can
                  help resolve the issue.
                </p>
              </div>

              <div className="faq-item">
                <h4>How can I become a restaurant partner?</h4>
                <p>
                  Contact our business team to learn more about joining Code &
                  Cravings.
                </p>
              </div>

              <div className="faq-item">
                <h4>How can I contact customer support?</h4>
                <p>You can reach us at support@codeandcravings.com.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default InfoPage;
