import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 3,
};

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage =
    location.pathname === "/account/register" ||
    location.pathname === "/account/login";

  const handleOnClose = () => {
    navigate("/");
  };
  return (
    <>
      <Modal open={isAuthPage} onClose={handleOnClose}>
        <Box sx={style}>
          {location.pathname === "/account/register" ? <Register /> : <Login />}
        </Box>
      </Modal>
    </>
  );
};

export default Auth;
