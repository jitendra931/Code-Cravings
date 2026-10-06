import React from "react";
import RestaurantCart from "../Restaurant/RestaurantCart";
import "./Others.css";
import { useSelector } from "react-redux";

const Favorites = () => {
  const { auth } = useSelector((store) => store);
  return (
    <div className="favorites-page">
      <h1 className="favorites-title">My Favorites</h1>

      <div className="favorites-grid">
        {auth.favorite.map((item, index) => (
          <RestaurantCart item={item} key={index} />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
