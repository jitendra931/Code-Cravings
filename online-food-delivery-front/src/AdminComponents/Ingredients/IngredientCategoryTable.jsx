import React, { useEffect, useState } from "react";
import "./Ingredientss.css";

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
} from "@mui/material";

import CreateIcon from "@mui/icons-material/Create";

import CreateIngredientsCategoryForm from "./CreateIngredientsCategoryForm";
import { useDispatch, useSelector } from "react-redux";
import { getIngredientCategory } from "../../components/State/Ingrediant/Action";

import { deleteIngredientCategory } from "../../components/State/Ingrediant/Action";

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
  bgcolor: "#111111",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "16px",
  boxShadow: 24,
  p: 2,
};

const IngredientCategoryTable = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const dispatch = useDispatch();

  const restaurant = useSelector((store) => store.restaurant);
  const ingredient = useSelector((store) => store.ingredient);
  const categories = ingredient.category || [];

  const jwt = localStorage.getItem("jwt");

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this ingredient category?",
    );

    if (!confirmed) return;

    try {
      await dispatch(
        deleteIngredientCategory({
          id,
          jwt,
        }),
      );
    } catch (error) {
      console.log("Failed to delete category", error);
    }
  };

  useEffect(() => {
    const restaurantId = restaurant.usersRestaurant?.id;

    if (!restaurantId || !jwt) return;

    dispatch(
      getIngredientCategory({
        id: restaurantId,
        jwt,
      }),
    );
  }, [dispatch, restaurant.usersRestaurant?.id, jwt]);
  return (
    <Box className="restau-ingredient-category-wrapper">
      <Card className="restau-ingredient-category-card">
        <div className="restau-ingredient-category-header">
          <h2>Ingredient Categories</h2>

          <div className="restau-ingredient-category-actions">
            <IconButton
              className="restau-ingredient-category-add-btn"
              onClick={handleOpen}
            >
              <CreateIcon />
            </IconButton>
          </div>
        </div>

        <TableContainer
          component={Paper}
          className="restau-ingredient-category-table-container"
        >
          <Table stickyHeader className="restau-ingredient-category-table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Category Name</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {categories.map((item) => (
                <TableRow key={item.Id}>
                  <TableCell>{item.Id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <button
                      type="button"
                      className="restau-ingredient-category-delete-btn"
                      sx={{ backgroundColor: "#ff6b35" }}
                      onClick={() => handleDelete(item.Id)}
                    >
                      Delete
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="create-category-modal"
      >
        <Box sx={style}>
          <CreateIngredientsCategoryForm />
        </Box>
      </Modal>
    </Box>
  );
};

export default IngredientCategoryTable;
