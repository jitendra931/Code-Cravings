import React from "react";

const CarouselItems = ({ image, title }) => {
  return (
    <div className="carousel-item">
      <div className="carousel-item-card">
        <div className="carousel-image-wrapper">
          <div className="carousel-image-glow"></div>

          <div className="carousel-image-container">
            <img src={image} alt={title} className="carousel-image" />

            <div className="carousel-image-overlay"></div>

            <div className="carousel-image-ring"></div>
          </div>
        </div>

        <div className="carousel-title-wrapper">
          <span className="carousel-title">{title}</span>
          <span className="carousel-title-line"></span>
        </div>
      </div>
    </div>
  );
};

export default CarouselItems;
