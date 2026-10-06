import React, { useEffect, useState } from "react";

import Grid from "@mui/material/Grid";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
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
        <div className="restaurant-images">
          <Grid container spacing={2}>
            <Grid size={12}>
              <img src={restaurant?.images?.[0]} alt="" />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <img src={restaurant?.images?.[1]} alt="" />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <img src={restaurant?.images?.[2]} alt="" />
            </Grid>
          </Grid>
        </div>

        <div className="restaurant-information">
          <h1 className="restaurant-name">{restaurant?.name}</h1>

          <p className="Restau-Desc">{restaurant?.description}</p>

          <div className="loc-time">
            <p className="restaurant-location">
              <LocationOnIcon />

              <span>
                {restaurant?.address?.street},{restaurant?.address?.city},
                {restaurant?.address?.state} -{restaurant?.address?.zip}
              </span>
            </p>

            <p className="restaurant-hours">
              <CalendarTodayIcon />

              <span>{restaurant?.openingHours}(Today)</span>

              <span>{restaurant?.contactInformation?.email}</span>
            </p>

            <p className="restaurant-hours">
              <CalendarTodayIcon />

              <span>{restaurant?.contactInformation?.email}</span>
            </p>
          </div>
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
