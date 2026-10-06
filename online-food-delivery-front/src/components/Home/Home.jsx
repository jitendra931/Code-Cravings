import React, { useEffect, useState } from "react";
import "./Home.css";

import MultiItemCarousel from "./MultiItemCarousel";
import RestaurantCart from "../Restaurant/RestaurantCart";
import { getAllRestaurantAction } from "../State/Restaurant/Action";
import { useDispatch, useSelector } from "react-redux";

import ExploreMenu from "./ExploreMenu";
import { getGlobalFood } from "../State/Menu/Action";

import Footer from "../Footer/Footer";

const Home = () => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");

  const restaurants = useSelector((state) => state.restaurant.restaurants);
  const menuItems = useSelector((state) => state.menu.menuItems);

  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const heroSlides = [
    {
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=2200&q=85",
      badge: "Fresh • Fast • Delicious",
      eyebrow: "YOUR NEXT CRAVING STARTS HERE",
      title: "Code Your",
      highlight: "Cravings.",
      description:
        "Discover delicious meals from your favorite local restaurants, order effortlessly, and enjoy every bite.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=2200&q=85",
      badge: "Made For Foodies",
      eyebrow: "GOOD FOOD. GOOD MOOD.",
      title: "Taste The",
      highlight: "Difference.",
      description:
        "From comforting classics to exciting new flavors, discover something delicious for every mood.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=2200&q=85",
      badge: "Explore More",
      eyebrow: "SOMETHING DELICIOUS IS WAITING",
      title: "Find Your",
      highlight: "Next Favorite.",
      description:
        "Explore menus, discover hidden gems, and turn your next meal into something memorable.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=2200&q=85",
      badge: "Made With Love",
      eyebrow: "FOOD THAT BRINGS PEOPLE TOGETHER",
      title: "Eat More.",
      highlight: "Code More.",
      description:
        "Your favorite food and your favorite technology, brought together in one place.",
    },
  ];

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    dispatch(getAllRestaurantAction(jwt));
    dispatch(getGlobalFood());
  }, [dispatch, jwt]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, heroSlides.length]);

  const goToNextSlide = () => {
    setActiveSlide((current) => (current + 1) % heroSlides.length);
    setIsPaused(true);
  };

  const goToPreviousSlide = () => {
    setActiveSlide(
      (current) => (current - 1 + heroSlides.length) % heroSlides.length,
    );
    setIsPaused(true);
  };

  const goToSlide = (index) => {
    setActiveSlide(index);
    setIsPaused(true);
  };

  const currentSlide = heroSlides[activeSlide];

  return (
    <div className="home">
      <section
        className="hero-slider"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="hero-backgrounds">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.image}
              className={`hero-bg ${
                index === activeSlide ? "hero-bg-active" : ""
              }`}
              style={{
                backgroundImage: `url("${slide.image}")`,
              }}
            />
          ))}
        </div>

        <div className="hero-overlay"></div>

        <div className="hero-glow hero-glow-1"></div>
        <div className="hero-glow hero-glow-2"></div>

        <div className="hero-content" key={activeSlide}>
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            <span>{currentSlide.badge}</span>
          </div>

          <p className="hero-eyebrow">{currentSlide.eyebrow}</p>

          <h1 className="hero-title">
            {currentSlide.title}
            <span>{currentSlide.highlight}</span>
          </h1>

          <p className="hero-description">{currentSlide.description}</p>

          <div className="hero-buttons">
            <button
              className="primary-btn hero-btn"
              onClick={() => scrollToSection("popular-restaurants")}
            >
              <span>Order Now</span>
              <span className="btn-arrow">→</span>
            </button>

            <button
              className="secondary-btn hero-btn"
              onClick={() => scrollToSection("explore-menu")}
            >
              <span>Explore Menu</span>
              <span className="btn-arrow">↗</span>
            </button>
          </div>

          <div className="hero-features">
            <div className="hero-feature">
              <span className="hero-feature-icon">⚡</span>

              <div>
                <strong>Fast Delivery</strong>
                <small>Hot & fresh</small>
              </div>
            </div>

            <div className="hero-feature-divider"></div>

            <div className="hero-feature">
              <span className="hero-feature-icon">🍽️</span>

              <div>
                <strong>Local Favorites</strong>
                <small>Made with love</small>
              </div>
            </div>

            <div className="hero-feature-divider"></div>

            <div className="hero-feature">
              <span className="hero-feature-icon">⭐</span>

              <div>
                <strong>Top Rated</strong>
                <small>Loved by foodies</small>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-side-text">
          <div className="hero-scroll-line"></div>
        </div>

        <div className="hero-slide-controls">
          <button
            className="hero-arrow"
            onClick={goToPreviousSlide}
            aria-label="Previous slide"
          >
            ←
          </button>

          <div className="hero-dots">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                className={`hero-dot ${index === activeSlide ? "active" : ""}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            className="hero-arrow"
            onClick={goToNextSlide}
            aria-label="Next slide"
          >
            →
          </button>
        </div>

        <div className="fade-bottom"></div>
      </section>

      <section className="bg-[#050505] py-10">
        <MultiItemCarousel />
      </section>

      <section id="popular-restaurants" className="restaurant-section">
        <h2 className="restaurant-heading">Popular Restaurants</h2>

        <div className="restaurant-grid">
          {restaurants.map((item, index) => (
            <RestaurantCart key={item?.id ?? index} item={item} />
          ))}
        </div>
      </section>

      <section id="explore-menu">
        <ExploreMenu menuItems={menuItems} />
      </section>

      <Footer />
    </div>
  );
};

export default Home;
