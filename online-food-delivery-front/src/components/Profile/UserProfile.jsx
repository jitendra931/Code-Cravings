import React from "react";
import "./Profile.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Button from "@mui/material/Button";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { logout } from "../State/Authentication/Action";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { auth } = useSelector((store) => store);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="user-profile-page">
      <div className="user-profile-card">
        <div className="profile-avatar-wrapper">
          <AccountCircleIcon className="profile-avatar-icon" />
        </div>

        <h1 className="profile-user-name">{auth.user?.fullname}</h1>

        <p className="profile-user-email">{auth.user?.email}</p>

        <Button
          variant="contained"
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default UserProfile;
