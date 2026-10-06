import React from "react";

import "./Profile.css";

import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import HomeIcon from "@mui/icons-material/Home";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import LogoutIcon from "@mui/icons-material/Logout";
import { Divider, Drawer, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";

const menu = [
  {
    title: "Orders",
    icon: <ShoppingBagIcon />,
    path: "/my-profile/orders",
  },

  {
    title: "Favorites",
    icon: <FavoriteIcon />,
    path: "/my-profile/favorites",
  },

  // {
  //   title: "Address",
  //   icon: <HomeIcon />,
  //   path: "/my-profile/address",
  // },
  {
    title: "Notification",
    icon: <NotificationsActiveIcon />,
    path: "/my-profile/notifications",
  },
  // {
  //   title: "Payment",
  //   icon: <AccountBalanceWalletIcon />,
  //   path: "/my-profile/payment",
  // },

  {
    title: "Events",
    icon: <EmojiEventsIcon />,
    path: "/my-profile/events",
  },

  {
    title: "Profile",
    icon: <AccountBalanceWalletIcon />,
    path: "/my-profile",
  },
];
const ProfileNavigation = ({ open, handleClose }) => {
  const isSmallScreen = useMediaQuery("(max-width:1080px)");

  const navigate = useNavigate();

  const handleNavigate = (item) => {
    navigate(`/my-profile/${item.title.toLowerCase()}`);
  };

  const location = useLocation();

  return (
    <div>
      <Drawer
        variant={isSmallScreen ? "temporary" : "permanent"}
        onClose={handleClose}
        open={open}
        anchor="left"
        sx={{
          zIndex: 1400,
        }}
      >
        <div className="profile-nav-container">
          {menu.map((item, i) => (
            <React.Fragment key={i}>
              <Link
                to={item.path}
                className={`profile-menu-item ${
                  location.pathname === item.path ? "active-menu" : ""
                }`}
                onClick={handleClose}
              >
                {item.icon}

                <span>{item.title}</span>
              </Link>

              {i !== menu.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </div>
      </Drawer>
    </div>
  );
};

export default ProfileNavigation;
