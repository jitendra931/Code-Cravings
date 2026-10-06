import React from "react";
import "./GlobalFoodCard.css";

const GlobalFoodCard = ({ item }) => {
  return (
    <div className="global-food-card">
      <img
        src={item?.images?.[0]}
        alt={item?.name || "Food"}
        className="global-food-image"
      />

      <div className="global-food-info">
        <h3 className="global-food-name">{item?.name}</h3>
        <p className="global-food-price">₹{Number(item?.price).toFixed(2)}</p>
      </div>
    </div>
  );
};

export default GlobalFoodCard;
