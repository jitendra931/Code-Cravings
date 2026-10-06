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
  Modal,
  IconButton,
  Button,
} from "@mui/material";

import "./Ingredientss.css";
import CreateIcon from "@mui/icons-material/Create";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import CreateIngredients from "./CreateIngredients";

import {
  getIngredientsOfRestaurant,
  updateStockOfIngredient,
} from "../../components/State/Ingrediant/Action";

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

const IngredientTable = () => {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const jwt = localStorage.getItem("jwt");

  // Restaurant information
  const restaurant = useSelector((store) => store.restaurant);

  // Ingredient Redux state
  const ingredientState = useSelector((store) => store.ingredient);

  const ingredients = ingredientState?.ingrediants || [];

  const restaurantId = restaurant?.usersRestaurant?.id;

  useEffect(() => {
    if (!jwt || !restaurantId) return;

    dispatch(
      getIngredientsOfRestaurant({
        id: restaurantId,
        jwt,
      }),
    );
  }, [dispatch, restaurantId, jwt]);

  const handleUpdateStoke = (id) => {
    dispatch(updateStockOfIngredient({ id, jwt }));
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box className="restau-ingredient-wrapper">
      <Card className="restau-ingredient-card">
        <div className="restau-ingredient-header">
          <h2>All Ingredient Items</h2>

          <div className="restau-ingredient-actions">
            <IconButton
              onClick={handleOpen}
              className="restau-ingredient-add-btn"
            >
              <CreateIcon />
            </IconButton>
          </div>
        </div>

        <TableContainer
          component={Paper}
          className="restau-ingredient-table-container"
        >
          <Table stickyHeader className="restau-ingredient-table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Ingredient Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="center">Availability</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {ingredients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No ingredients found
                  </TableCell>
                </TableRow>
              ) : (
                ingredients.map((item) => (
                  <TableRow key={item.Id}>
                    <TableCell>{item.Id}</TableCell>

                    <TableCell>{item.name}</TableCell>

                    <TableCell>
                      {item.ingredientCategory?.name ||
                        item.category?.name ||
                        item.category ||
                        "—"}
                    </TableCell>

                    <TableCell align="center">
                      <Button onClick={() => handleUpdateStoke(item.Id)}>
                        {item.Stoke ? "In Stock" : "Out of Stock"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="create-ingredient-modal"
      >
        <Box sx={style}>
          <CreateIngredients />
        </Box>
      </Modal>
    </Box>
  );
};

export default IngredientTable;
