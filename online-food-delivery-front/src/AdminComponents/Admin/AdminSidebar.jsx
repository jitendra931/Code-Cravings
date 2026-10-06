import React, { useState } from "react";
import "./AdminSidebar.css";

import {
  Dashboard,
  ShoppingBag,
  Menu as MenuIcon,
  Logout,
} from "@mui/icons-material";

import ShopTwoIcon from "@mui/icons-material/ShopTwo";
import CategoryIcon from "@mui/icons-material/Category";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import EventIcon from "@mui/icons-material/Event";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";

import { Drawer, Fab, useMediaQuery } from "@mui/material";

import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../components/State/Authentication/Action";

const menu = [
  {
    title: "Dashboard",
    icon: <Dashboard />,
    path: "/",
  },
  {
    title: "Order Items",
    icon: <ShoppingBag />,
    path: "/orders",
  },
  {
    title: "Menu",
    icon: <ShopTwoIcon />,
    path: "/menu",
  },
  {
    title: "Food Category",
    icon: <CategoryIcon />,
    path: "/category",
  },
  {
    title: "Ingredients",
    icon: <FastfoodIcon />,
    path: "/ingredients",
  },
  {
    title: "Events",
    icon: <EventIcon />,
    path: "/events",
  },
  {
    title: "Details",
    icon: <AdminPanelSettingsIcon />,
    path: "/details",
  },
  {
    title: "Logout",
    icon: <LogoutIcon />,
    path: "/logout",
  },
];

const AdminSidebar = () => {
  const isSmallScreen = useMediaQuery("(max-width:1050px)");

  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleClose = () => {
    setMobileOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());

    localStorage.removeItem("jwt");

    localStorage.removeItem("user");

    handleClose();

    navigate("/account/login", {
      replace: true,
    });
  };

  const handleNavigate = (item) => {
    if (item.title === "Logout") {
      handleLogout();
      return;
    }

    navigate(`/admin/restaurants${item.path}`);

    if (isSmallScreen) {
      handleClose();
    }
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/admin/restaurants";
    }

    return location.pathname.startsWith(`/admin/restaurants${path}`);
  };

  const sidebarContent = (
    <div className="admin-sidebar">
      {/* Logo */}
      <div
        onClick={() => {
          navigate("/admin/restaurants");

          if (isSmallScreen) {
            handleClose();
          }
        }}
        className="sidebar-logo"
      >
        <h2>🍽 Code & Cravings</h2>
        <p>Restaurant Admin</p>
      </div>

      {/* Menu */}
      <div className="sidebar-menu">
        {menu.map((item) => (
          <div
            key={item.title}
            onClick={() => handleNavigate(item)}
            className={`sidebar-item ${isActive(item.path) ? "active" : ""}`}
          >
            <span className="sidebar-icon">{item.icon}</span>

            <span className="sidebar-title">{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* ================= DESKTOP ================= */}
      {!isSmallScreen && (
        <Drawer
          variant="permanent"
          anchor="left"
          open
          PaperProps={{
            className: "admin-sidebar-paper",
          }}
        >
          {sidebarContent}
        </Drawer>
      )}

      {/* ================= MOBILE / TABLET ================= */}
      {isSmallScreen && (
        <>
          <Fab
            color="primary"
            aria-label="open sidebar"
            onClick={handleDrawerToggle}
            className="admin-sidebar-fab"
          >
            <MenuIcon />
          </Fab>

          <Drawer
            variant="temporary"
            anchor="left"
            open={mobileOpen}
            onClose={handleClose}
            ModalProps={{
              keepMounted: true,
            }}
            PaperProps={{
              className: "admin-sidebar-paper",
            }}
          >
            {sidebarContent}
          </Drawer>
        </>
      )}
    </>
  );
};

export default AdminSidebar;
