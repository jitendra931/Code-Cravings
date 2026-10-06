import React, { useEffect, useState } from "react";

import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  Avatar,
} from "@mui/material";

import CreateIcon from "@mui/icons-material/Create";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  getMenuItemsByRestaurantId,
  updateMenuItemAvailability,
  deleteFoodAction,
} from "../../components/State/Menu/Action";

import "./MenuTable.css";

const Menutable = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const jwt = localStorage.getItem("jwt");

  const restaurant = useSelector((store) => store.restaurant);
  const menu = useSelector((store) => store.menu);

  const restaurantId = restaurant?.usersRestaurant?.id;
  const menuItems = menu?.menuItems || [];

  const [successMessage, setSuccessMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");

  useEffect(() => {
    if (!jwt || !restaurantId) return;

    dispatch(
      getMenuItemsByRestaurantId({
        restaurantId,
        jwt,
        vegetarian: false,
        nonveg: false,
        seasonal: false,
        foodCategory: "",
      }),
    );
  }, [dispatch, jwt, restaurantId]);

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);

      navigate(location.pathname, {
        replace: true,
        state: {},
      });
    }
  }, [location, navigate]);

  const handleAvailability = (foodId) => {
    dispatch(
      updateMenuItemAvailability({
        foodId,
        jwt,
      }),
    );
  };

  const handleDelete = async (foodId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this food item?",
    );

    if (!confirmDelete) return;

    try {
      await dispatch(
        deleteFoodAction({
          foodId,
          jwt,
        }),
      );

      setDeleteMessage("Food deleted successfully.");
    } catch (error) {
      const message =
        error?.response?.data?.message || "This food cannot be deleted.";

      setDeleteMessage(message);
    }
  };

  return (
    <Box className="restau-order-table-wrapper">
      <Card className="restau-order-card">
        <div className="restau-order-header">
          <h2>All Menu Items</h2>

          <div className="restau-header-actions">
            <IconButton
              onClick={() => navigate("/admin/restaurants/add-menu")}
              className="restau-menu-btn"
            >
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
                <TableCell>ID</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="center">Price</TableCell>
                <TableCell align="center">Availability</TableCell>
                <TableCell>Creation Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="center">Edit</TableCell>
                <TableCell align="center">Delete</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {menuItems.length > 0 ? (
                menuItems.map((item) => {
                  const foodId = item.Id ?? item.id;

                  return (
                    <TableRow key={foodId}>
                      <TableCell>{foodId}</TableCell>

                      <TableCell>
                        {item.images?.[0] ? (
                          <Avatar
                            src={item.images[0]}
                            alt={item.name}
                            className="restau-food-image"
                          />
                        ) : (
                          <div className="restau-food-no-image">No Image</div>
                        )}
                      </TableCell>

                      <TableCell>{item.name || "—"}</TableCell>

                      <TableCell>
                        {item.foodCategory?.name || item.category?.name || "—"}
                      </TableCell>

                      <TableCell align="center" className="restau-order-price">
                        ₹{item.price ?? 0}
                      </TableCell>

                      <TableCell align="center">
                        <Chip
                          label={item.available ? "Available" : "Unavailable"}
                          color={item.available ? "success" : "error"}
                          onClick={() => handleAvailability(foodId)}
                          clickable
                        />
                      </TableCell>

                      <TableCell>
                        {item.creationDate
                          ? new Date(item.creationDate).toLocaleDateString(
                              "en-IN",
                            )
                          : "—"}
                      </TableCell>

                      <TableCell>{item.description || "—"}</TableCell>

                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={() =>
                            navigate(`/admin/restaurants/edit-menu/${foodId}`)
                          }
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>

                      <TableCell align="center">
                        <IconButton
                          color="error"
                          className="restau-delete-btn"
                          onClick={() => handleDelete(foodId)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    No menu items found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage("")}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={() => setSuccessMessage("")}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(deleteMessage)}
        autoHideDuration={3000}
        onClose={() => setDeleteMessage("")}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={() => setDeleteMessage("")}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {deleteMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Menutable;
