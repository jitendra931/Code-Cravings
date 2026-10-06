import React, { useRef, useState } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import "./MenuCard.css";

import { useDispatch } from "react-redux";
import { addItemToCart } from "../State/Cart/Action";
import { CategrizeIngredients } from "../utils/CategrizeIngredients";

const MenuCard = ({ item }) => {
  const dispatch = useDispatch();

  const [selectedIngrediants, setSelectedIngrediants] = useState([]);

  const [cartAdded, setCartAdded] = useState(false);

  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const addToCartLock = useRef(false);

  const foodId = item?.Id ?? item?.id;

  const isAvailable = item?.available !== false;

  const ingredients = Array.isArray(item?.ingrediants) ? item.ingrediants : [];

  const categorizedIngredients =
    ingredients.length > 0 ? CategrizeIngredients(ingredients) : {};

  const handleCheckBoxChange = (ingredientName) => {
    setSelectedIngrediants((previousIngredients) => {
      if (previousIngredients.includes(ingredientName)) {
        return previousIngredients.filter((name) => name !== ingredientName);
      }

      return [...previousIngredients, ingredientName];
    });
  };

  const handleAddItemToCart = async (e) => {
    e.preventDefault();

    if (addToCartLock.current) {
      return;
    }

    if (!isAvailable) {
      return;
    }

    if (!foodId) {
      console.error("Food ID is missing:", item);
      return;
    }

    const token = localStorage.getItem("jwt");

    if (!token) {
      console.error("JWT token not found. Please login first.");
      return;
    }

    addToCartLock.current = true;

    setIsAddingToCart(true);

    const reqData = {
      token,

      cartItem: {
        foodId: foodId,
        quantity: 1,
        ingrediants: selectedIngrediants,
      },
    };

    // console.log("Adding item to cart:", reqData);

    try {
      await dispatch(addItemToCart(reqData));

      setSelectedIngrediants([]);

      setCartAdded(true);

      setTimeout(() => {
        addToCartLock.current = false;
        setIsAddingToCart(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to add item to cart:", error);

      addToCartLock.current = false;

      setIsAddingToCart(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setCartAdded(false);
  };

  const foodImage =
    Array.isArray(item?.images) && item.images.length > 0
      ? item.images[0]
      : "https://via.placeholder.com/150?text=Food";

  const foodPrice = Number(item?.price ?? 0);

  return (
    <>
      <Accordion className="menu-card">
        <AccordionSummary
          className="menu-card-summary"
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`food-${foodId}-content`}
          id={`food-${foodId}-header`}
        >
          <div className="menu-card-content">
            <div className="menu-card-food">
              {/* Food Image */}
              <img
                className="menu-card-image"
                src={foodImage}
                alt={item?.name || "Food"}
              />

              {/* Food Information */}
              <div className="menu-card-info">
                {/* Food Name */}
                <Typography
                  variant="h6"
                  component="p"
                  className="menu-card-name"
                >
                  {item?.name || "Unnamed Food"}
                </Typography>

                {/* Price */}
                <Typography component="p" className="menu-card-price">
                  ₹{foodPrice.toFixed(2)}
                </Typography>

                {/* Description */}
                {item?.description && (
                  <Typography component="p" className="menu-card-description">
                    {item.description}
                  </Typography>
                )}

                {!isAvailable && (
                  <Typography component="p" className="menu-card-unavailable">
                    Currently unavailable
                  </Typography>
                )}
              </div>
            </div>
          </div>
        </AccordionSummary>

        <AccordionDetails className="menu-card-details">
          <form onSubmit={handleAddItemToCart}>
            {ingredients.length > 0 ? (
              <div className="ingredients-container">
                {Object.entries(categorizedIngredients).map(
                  ([category, categoryIngredients]) => (
                    <div key={category} className="ingredient-box">
                      {/* Category */}
                      <p className="ingredient-category">{category}</p>

                      <FormGroup className="ingredient-group">
                        {categoryIngredients.map((ingredient) => {
                          const ingredientId = ingredient?.Id ?? ingredient?.id;

                          const ingredientName = ingredient?.name;

                          const isChecked =
                            selectedIngrediants.includes(ingredientName);

                          return (
                            <FormControlLabel
                              key={ingredientId ?? ingredientName}
                              className="ingredient-label"
                              control={
                                <Checkbox
                                  className="ingredient-checkbox"
                                  checked={isChecked}
                                  disabled={!isAvailable || isAddingToCart}
                                  onChange={() =>
                                    handleCheckBoxChange(ingredientName)
                                  }
                                />
                              }
                              label={ingredientName}
                            />
                          );
                        })}
                      </FormGroup>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <Typography component="p" className="no-ingredients">
                No additional ingredients available.
              </Typography>
            )}

            <div className="add-to-cart-container">
              <Button
                type="submit"
                variant="contained"
                className="add-to-cart-button"
                disabled={!isAvailable || !foodId || isAddingToCart}
              >
                {isAddingToCart
                  ? "Added to Cart ✓"
                  : isAvailable
                    ? "Add to Cart"
                    : "Out of Stock"}
              </Button>
            </div>
          </form>
        </AccordionDetails>
      </Accordion>

      <Snackbar
        open={cartAdded}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          variant="filled"
          sx={{
            width: "100%",
            fontSize: "15px",
            fontWeight: 600,
          }}
        >
          {item?.name || "Item"} added successfully to your cart!
        </Alert>
      </Snackbar>
    </>
  );
};

export default MenuCard;
