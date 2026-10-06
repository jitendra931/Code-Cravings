import React, { useEffect, useState } from "react";
import "../Orders/OrderTable.css";

import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Modal,
  Typography,
  CircularProgress,
} from "@mui/material";

import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";

import CreateFoodCategory from "./CreateFoodCategory";

import { useDispatch, useSelector } from "react-redux";
import { getRestaurantCategory } from "../../components/State/Restaurant/Action";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",

  width: {
    xs: "90%",
    sm: 500,
  },

  maxHeight: "90vh",
  overflowY: "auto",

  bgcolor: "#151515",
  color: "#fff",

  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "16px",

  boxShadow: 24,

  p: 3,
};

const FoodCategoryTable = () => {
  const dispatch = useDispatch();

  const restaurant = useSelector((store) => store.restaurant);

  const [open, setOpen] = useState(false);

  const usersRestaurant = restaurant.usersRestaurant;
  const categories = restaurant.categories || [];

  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    const restaurantId = usersRestaurant?.id;

    if (!restaurantId || !jwt) return;

    dispatch(
      getRestaurantCategory({
        jwt,
        restaurantId,
      }),
    );
  }, [dispatch, usersRestaurant?.id, jwt]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCategoryCreated = () => {
    setOpen(false);
  };

  return (
    <Box className="restau-order-table-wrapper">
      <Card className="restau-order-card">
        <div className="restau-order-header">
          <h2>All Food Category</h2>

          <div className="restau-header-actions">
            <IconButton className="restau-menu-btn" onClick={handleOpen}>
              <CreateIcon />
            </IconButton>
          </div>
        </div>

        <TableContainer
          component={Paper}
          className="restau-order-table-container"
        >
          <Table stickyHeader className="restau-order-table">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="center">Delete</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {restaurant.loading ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No food categories found
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.id}</TableCell>

                    <TableCell>{category.name}</TableCell>

                    <TableCell align="center">
                      <IconButton color="error" className="restau-delete-btn">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* CREATE CATEGORY MODAL */}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="create-category-modal"
      >
        <Box sx={style}>
          <Typography
            id="create-category-modal"
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 600,
            }}
          >
            Create Food Category
          </Typography>

          <CreateFoodCategory onSuccess={handleCategoryCreated} />
        </Box>
      </Modal>
    </Box>
  );
};

export default FoodCategoryTable;
