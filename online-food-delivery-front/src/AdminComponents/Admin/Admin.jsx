import React, { useEffect } from "react";
import "./Admin.css";
import AdminSidebar from "./AdminSidebar";
import { Route, Routes } from "react-router-dom";

import Menu from "../Menu/Menu";
import FoodCategory from "../Category/FoodCategory";
import Ingredients from "../Ingredients/Ingredients";
import Events from "../Events/Events";
import RestaurantDetails from "./RestaurantDetails";
import RestauDashboard from "../Dashboard/RestauDashboard";
import Orderss from "../Orders/Orderss";

import CreateMenuForm from "../Menu/CreateMenuForm";

const Admin = () => {
  const handleClose = () => {};

  return (
    <div className="admin">
      <div className="admin-layout">
        <div className="admin-sidebar-container">
          <AdminSidebar handleClose={handleClose} />
        </div>

        <div className="admin-content flex-1">
          <Routes>
            <Route index element={<RestauDashboard />} />

            <Route path="orders" element={<Orderss />} />

            <Route path="menu" element={<Menu />} />

            <Route path="/add-menu" element={<CreateMenuForm />} />

            <Route path="category" element={<FoodCategory />} />

            <Route path="ingredients" element={<Ingredients />} />

            <Route path="events" element={<Events />} />

            <Route path="details" element={<RestaurantDetails />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin;
