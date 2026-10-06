import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import React from "react";

import "./RestaurantCart.css";
import restaurantImg from "../../assets/res-2.jpg";
import { isPresentInFavorite } from "../config/logic";
import { addToFavorite } from "../State/Authentication/Action";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const RestaurantCart = ({ item }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const jwt = localStorage.getItem("jwt");

  const { auth } = useSelector((store) => store.auth);

  const handleAddToFavorite = () => {
    if (!jwt) {
      navigate("/account/login");
      return;
    }

    dispatch(addToFavorite({ restaurantId: item.id, jwt }));
  };

  const handleNavigateToRestaurant = () => {
    if (!jwt) {
      navigate("/account/login");
      return;
    }

    if (!item.open) {
      return;
    }

    navigate(`/restaurant/${item.address.city}/${item.name}/${item.id}`);
  };

  return (
    <Card className="fav-restaurant">
      <div
        className={`${
          item.open ? "cursor-pointer" : "cursor-not-allowed"
        } relative`}
        onClick={handleNavigateToRestaurant}
      >
        <img
          src={item.images?.[0] || item.images?.[1] || restaurantImg}
          alt={item.name}
        />

        <Chip
          size="medium"
          className="absolute top-2 left-2"
          color={item.open ? "success" : "error"}
          label={item.open ? "Open" : "Closed"}
        />
      </div>

      <div className="p-4 textPart lg:flex w-full justify-content">
        <div className="space-y-1">
          <p
            onClick={handleNavigateToRestaurant}
            className="RestauName cursor-pointer"
          >
            {item.name}
          </p>

          <p className="desc">{item.description}</p>
        </div>

        <div>
          <IconButton onClick={handleAddToFavorite}>
            {isPresentInFavorite(auth?.favourite || [], item) ? (
              <FavoriteIcon />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
        </div>
      </div>
    </Card>
  );
};

export default RestaurantCart;
