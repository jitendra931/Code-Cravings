import React, { useState } from "react";
import "./Profile.css";

import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";

import ProfileNavigation from "./ProfileNavigation";

import { Route, Routes } from "react-router-dom";

import UserProfile from "./UserProfile.jsx";
import Favorites from "./Favorites.jsx";
import Events from "./Events.jsx";
import Address from "./Address.jsx";
import Orders from "./Orders.jsx";

const Profile = () => {
  const [openSideBar, setOpenSideBar] = useState(false);

  const handleOpenSidebar = () => {
    setOpenSideBar(true);
  };

  const handleCloseSidebar = () => {
    setOpenSideBar(false);
  };

  return (
    <div className="profile-page">
      {/* MOBILE MENU BUTTON */}

      <div className="mobile-menu-btn">
        <IconButton onClick={handleOpenSidebar}>
          <MenuIcon />
        </IconButton>
      </div>

      <div className="profile-layout">
        <div className="profile-sidebar">
          <ProfileNavigation
            open={openSideBar}
            handleClose={handleCloseSidebar}
          />
        </div>

        {/* CONTENT */}

        <div className="profile-content">
          <div className="profile-content-wrapper">
            <Routes>
              <Route index element={<UserProfile />} />

              <Route path="orders" element={<Orders />} />

              <Route path="address" element={<Address />} />

              <Route path="favorites" element={<Favorites />} />

              <Route path="events" element={<Events />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
