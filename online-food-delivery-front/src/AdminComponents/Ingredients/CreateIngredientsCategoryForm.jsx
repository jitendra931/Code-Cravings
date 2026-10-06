import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createIngredientCategory } from "../../components/State/Ingrediant/Action";

const CreateIngredientsCategoryForm = () => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const restaurant = useSelector((store) => store.restaurant);
  const restaurantId = restaurant.usersRestaurant?.id;

  const [formData, setFormData] = useState({
    name: "",
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

    const name = formData.name.trim();

    if (!name) {
      return;
    }

    const data = {
      name,
      restaurantId,
    };

    // console.log("Category Data:", data);

    dispatch(createIngredientCategory({ data, jwt }));
  };

  return (
    <div className="p-5">
      <div className="max-w-xl mx-auto">
        <h1 className="text-gray-400 text-center text-xl pb-10">
          Create Ingredient Category
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Category Name"
            variant="outlined"
            placeholder="e.g. Dairy"
            onChange={handleInputChange}
            value={formData.name}
          />

          <Button type="submit" variant="contained" size="large">
            Create Category
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateIngredientsCategoryForm;
