import React from "react";

import "./Cart.css";

import IconButton from "@mui/material/IconButton";

import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

import AddCircleIcon from "@mui/icons-material/AddCircle";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";

import { Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeCartItem, updateCartItem } from "../State/Cart/Action";

const CartItems = ({ item }) => {
  const auth = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");

  const handleUpdateCartItem = (value) => {
    // console.log("Button Clicked");
    if (value === -1 && item.quantity === 1) {
      handleRemoveCartItem();
      return;
    }
    const data = { cartItemId: item.Id, quantity: item.quantity + value };
    // console.log(data);
    dispatch(updateCartItem({ data, jwt }));
  };

  const handleRemoveCartItem = () => {
    dispatch(removeCartItem({ cartItemId: item.Id, jwt: auth.jwt || jwt }));
  };

  return (
    <div className="cart-item">
      <div className="cart-item-left">
        <div className="cart-img-wrapper">
          <img className="cart-img" src={item.food.images?.[0]} alt="food" />
        </div>

        <div className="cart-food-details">
          <h2 className="food-title">{item.food?.name}</h2>

          <p className="food-desc">{item.food?.description}</p>

          <div className="quantity-controls">
            <IconButton onClick={() => handleUpdateCartItem(-1)}>
              <RemoveCircleIcon />
            </IconButton>

            <span className="quantity-number">{item?.quantity}</span>

            <IconButton onClick={() => handleUpdateCartItem(1)}>
              <AddCircleIcon />
            </IconButton>
          </div>

          <div className="chips-wrapper">
            {item.ingrediants.map((ingrediant, index) => (
              <Chip key={index} label={ingrediant} />
            ))}
          </div>
        </div>
      </div>

      <div className="cart-item-right">
        <h2 className="food-price">{item.totalPrice}</h2>

        <IconButton className="delete-btn" onClick={handleRemoveCartItem}>
          <DeleteOutlineIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default CartItems;
