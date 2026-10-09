import React, { useEffect, useState } from "react";

import Grid from "@mui/material/Grid";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";

import "./RestaurantDetails.css";

import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import MenuCard from "./MenuCard";

import {
  getRestaurantById,
  getRestaurantCategory,
} from "../State/Restaurant/Action";

import { getMenuItemsByRestaurantId } from "../State/Menu/Action";
import Footer from "../Footer/Footer";

const foodTypes = [
  { label: "All", value: "all" },
  { label: "Vegetarian", value: "vegetarian" },
  { label: "Non-Vegetarian", value: "non_vegetarian" },
  { label: "Seasonal", value: "seasonal" },
];

const RestaurantDetails = () => {
  const [foodType, setFoodType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const jwt = localStorage.getItem("jwt");

  const { id } = useParams();

  const { menuItems } = useSelector((state) => state.menu);

  const { restaurant, categories } = useSelector((state) => state.restaurant);

  // console.log("restaurant:", restaurant);

  const handleFilter = (e) => {
    setFoodType(e.target.value);
  };

  const handleFilterCategory = (e) => {
    setSelectedCategory(e.target.value);
  };

  useEffect(() => {
    dispatch(
      getRestaurantById({
        jwt,
        restaurantId: id,
      }),
    );

    dispatch(
      getRestaurantCategory({
        jwt,
        restaurantId: id,
      }),
    );
  }, [dispatch, id, jwt]);

  useEffect(() => {
    if (!restaurant?.images?.length || restaurant.images.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % restaurant.images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [restaurant?.images]);

  useEffect(() => {
    dispatch(
      getMenuItemsByRestaurantId({
        jwt,
        restaurantId: id,
        vegetarian: foodType === "vegetarian",
        nonveg: foodType === "non_vegetarian",
        seasonal: foodType === "seasonal",
        foodCategory: selectedCategory,
      }),
    );
  }, [dispatch, id, jwt, foodType, selectedCategory]);

  return (
    <div className="RestaurantDetails">
      <section className="restau-imgs">
        <div className="restaurant-hero">
          <div className="restaurant-hero-image">
            {restaurant?.images?.length > 0 && (
              <img
                key={currentImage}
                src={restaurant.images[currentImage]}
                alt={restaurant?.name}
              />
            )}
          </div>

          <div className="restaurant-hero-overlay"></div>

          <div className="restaurant-hero-content">
            <div className="restaurant-hero-text">
              <h1 className="restaurant-name">{restaurant?.name}</h1>

              {/* <p className="Restau-Desc">{restaurant?.description}</p> */}
            </div>

            <div className="restaurant-details">
              <div className="restaurant-detail-card">
                <LocationOnIcon />

                <span>
                  {restaurant?.address?.street}, {restaurant?.address?.city},{" "}
                  {restaurant?.address?.state} - {restaurant?.address?.zip}
                </span>
              </div>

              <div className="restaurant-detail-card">
                <CalendarTodayIcon />

                <span>{restaurant?.openingHours} (Today)</span>
              </div>

              <div className="restaurant-detail-card">
                <EmailOutlinedIcon />

                <span>{restaurant?.contactInformation?.email}</span>
              </div>
            </div>
          </div>

          <div className="restaurant-hero-description">
            <p className="Restau-Desc">{restaurant?.description}</p>
          </div>

          {restaurant?.images?.length > 1 && (
            <>
              <button
                type="button"
                className="hero-arrow hero-arrow-left"
                onClick={() =>
                  setCurrentImage(
                    (currentImage - 1 + restaurant.images.length) %
                      restaurant.images.length,
                  )
                }
              >
                ‹
              </button>

              <button
                type="button"
                className="hero-arrow hero-arrow-right"
                onClick={() =>
                  setCurrentImage((currentImage + 1) % restaurant.images.length)
                }
              >
                ›
              </button>

              <div className="hero-indicators">
                {restaurant.images.map((_, index) => (
                  <button
                    type="button"
                    key={index}
                    className={`hero-indicator ${
                      currentImage === index ? "active" : ""
                    }`}
                    onClick={() => setCurrentImage(index)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Divider />

      <section className="restaurant-menu-section">
        <div className="mobile-filter-wrapper">
          <button
            type="button"
            className="mobile-filter-button"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <span>Filter</span>

            <span
              className={`filter-arrow ${
                filterOpen ? "filter-arrow-open" : ""
              }`}
            >
              ▼
            </span>
          </button>
        </div>

        <div className="restaurant-menu-layout">
          <aside
            className={`filter-section ${
              filterOpen ? "filter-section-open" : ""
            }`}
          >
            <div className="filter-heading">Filter</div>

            <div className="filter-box">
              <div className="filter-group">
                <Typography variant="h5" className="filter-title">
                  Food Type
                </Typography>

                <FormControl
                  component="fieldset"
                  className="filter-form-control"
                >
                  <RadioGroup
                    onChange={handleFilter}
                    name="foodType"
                    value={foodType}
                  >
                    {foodTypes.map((item) => (
                      <FormControlLabel
                        key={item.value}
                        value={item.value}
                        control={<Radio />}
                        label={item.label}
                        className="filter-radio"
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </div>

              <Divider className="filter-divider" />

              <div className="filter-group">
                <Typography variant="h5" className="filter-title">
                  Food Category
                </Typography>

                <FormControl
                  component="fieldset"
                  className="filter-form-control"
                >
                  <RadioGroup
                    onChange={handleFilterCategory}
                    name="food_category"
                    value={selectedCategory}
                  >
                    {categories?.map((item) => (
                      <FormControlLabel
                        key={item.Id}
                        value={item.name}
                        control={<Radio />}
                        label={item.name}
                        className="filter-radio"
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </div>
            </div>
          </aside>

          <main className="menu-section">
            {menuItems?.map((item) => (
              <MenuCard
                key={item.Id}
                img={item.images?.[0]}
                name={item.name}
                desc={item.description}
                price={item.price}
                item={item}
              />
            ))}
          </main>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RestaurantDetails;
