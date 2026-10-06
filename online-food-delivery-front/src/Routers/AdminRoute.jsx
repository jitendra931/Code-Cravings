import React, { useEffect } from "react";
import Admin from "../AdminComponents/Admin/Admin";
import CreateRestaurantForm from "../AdminComponents/CreateRestaurantForm/CreateRestaurantForm";
import EditMenu from "../AdminComponents/Menu/EditMenu";

import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, Navigate } from "react-router-dom";

import { getRestaurantByUserId } from "../components/State/Restaurant/Action";

const AdminRoute = () => {
  const dispatch = useDispatch();

  const restaurant = useSelector((state) => state.restaurant);

  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    if (jwt) {
      dispatch(getRestaurantByUserId(jwt));
    }
  }, [dispatch, jwt]);

  // No JWT = absolutely no admin access
  if (!jwt) {
    return <Navigate to="/account/login" replace />;
  }

  return (
    <Routes>
      <Route path="/edit-menu/:foodId" element={<EditMenu />} />

      <Route
        path="/*"
        element={
          restaurant.restaurantLoading ? (
            <div>Loading restaurant...</div>
          ) : restaurant.usersRestaurant ? (
            <Admin />
          ) : (
            <CreateRestaurantForm />
          )
        }
      />
    </Routes>
  );
};

export default AdminRoute;
