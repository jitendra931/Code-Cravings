import React, { useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createIngredient,
  createIngredientCategory,
} from "../../components/State/Ingrediant/Action";

const CreateIngredients = () => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const ingredient = useSelector((store) => store.ingredient);
  const categories = ingredient.category || [];
  const restaurant = useSelector((store) => store.restaurant);
  const restaurantId = restaurant?.usersRestaurant?.id;

  const [formData, setFormData] = useState({
    name: "",
    ingredientCategoryId: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      name: formData.name,
      restaurantId: restaurantId,
      categoryId: formData.ingredientCategoryId,
    };

    // console.log("Ingredient Data:", data);

    dispatch(createIngredient({ data, jwt }));
  };
  return (
    <div className="p-5">
      <div className="max-w-xl mx-auto">
        <h1 className="text-gray-400 text-center text-xl pb-10">
          Create Ingredient
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Ingredient Name"
            variant="outlined"
            placeholder="e.g. Cheese"
            onChange={handleInputChange}
            value={formData.name}
          />

          {/* Ingredient Category */}
          <FormControl fullWidth>
            <InputLabel id="ingredient-category-label">Category</InputLabel>

            <Select
              labelId="ingredient-category-label"
              id="ingredientCategoryId"
              name="ingredientCategoryId"
              value={formData.ingredientCategoryId}
              label="Category"
              onChange={handleInputChange}
            >
              {categories.map((item) => (
                <MenuItem key={item.Id} value={item.Id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button type="submit" variant="contained" size="large">
            Create Ingredient
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateIngredients;
