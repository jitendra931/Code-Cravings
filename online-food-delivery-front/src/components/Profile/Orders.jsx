import React, { useEffect } from "react";
import "./Others.css";
import OrderCard from "./OrderCard";
import { useDispatch, useSelector } from "react-redux";
import { getUsersOrders } from "../State/order/Action";

const Orders = () => {
  const dispatch = useDispatch();

  const orderState = useSelector((state) => state.order);

  const jwt = localStorage.getItem("jwt");

  const orders = Array.isArray(orderState?.orders) ? orderState.orders : [];

  useEffect(() => {
    if (!jwt) return;

    dispatch(getUsersOrders(jwt));
  }, [dispatch, jwt]);

  return (
    <div className="orders-page">
      <h1 className="orders-title">My Orders</h1>

      <div className="orders-wrapper">
        {orders.length > 0 ? (
          orders.map((order) =>
            (order.items || []).map((item) => (
              <OrderCard
                key={`${order.Id ?? order.id}-${item.id}`}
                item={item}
                order={order}
              />
            )),
          )
        ) : (
          <p className="no-orders">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default Orders;
