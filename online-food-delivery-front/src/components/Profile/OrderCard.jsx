import React from "react";
import "./Others.css";

import { Button } from "@mui/material";

const OrderCard = ({ item, order }) => {
  const image = item?.food?.images?.[0];

  const orderDate = order?.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <div className="order-card">
      <div className="order-left">
        <div className="order-img-wrapper">
          {image ? (
            <img
              className="order-img"
              src={image}
              alt={item?.food?.name || "Food"}
            />
          ) : (
            <div className="order-no-image">No Image</div>
          )}
        </div>

        <div className="order-info">
          <h2 className="order-food-name">
            {item?.food?.name || "Unknown Food"}
          </h2>

          <p className="order-date">Ordered on {orderDate}</p>

          <p className="order-quantity">Quantity: {item?.quantity ?? 1}</p>

          <h3 className="order-price">₹{item?.totalPrice ?? 0}</h3>
        </div>
      </div>

      <div className="order-right">
        <Button variant="contained" className="order-status-btn">
          {order?.orderStatus || "—"}
        </Button>
      </div>
    </div>
  );
};

export default OrderCard;
