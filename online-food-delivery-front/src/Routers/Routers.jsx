import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminRoute from "./AdminRoute";
import CustomerRoute from "./CustomerRoute";

const Routers = () => {
  return (
    <div>
      <Routes>
        <Route path="/admin/restaurants/*" element={<AdminRoute />}></Route>
        <Route path="/*" element={<CustomerRoute />}></Route>
      </Routes>
    </div>
  );
};

export default Routers;
