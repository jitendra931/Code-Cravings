import React, { useEffect, useState } from "react";

import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

import CloseIcon from "@mui/icons-material/Close";

import {
  CircularProgress,
  FormControlLabel,
  Grid,
  Switch,
} from "@mui/material";

import { useFormik } from "formik";

import "./CreateMenuForm.css";

import { uploadImageToCloudaniry } from "../utils/UploadToCloudaniry";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import { createMenuItem } from "../../components/State/Menu/Action";

import { getIngredientsOfRestaurant } from "../../components/State/Ingrediant/Action";

import { getRestaurantCategory } from "../../components/State/Restaurant/Action";

const initialValues = {
  name: "",
  description: "",
  price: "",
  category: "",
  vegetarian: true,
  seasonal: false,
  ingredients: [],
  images: [],
};

const CreateMenuForm = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const jwt = localStorage.getItem("jwt");

  const restaurant = useSelector((store) => store.restaurant);

  const ingredient = useSelector((store) => store.ingredient);

  const ingredientsList = ingredient?.ingredients || [];

  const categoriesList = restaurant?.categories || [];

  const restaurantId = restaurant?.usersRestaurant?.id;

  const [uploadImage, setUploadImage] = useState(false);

  const [ingredientInput, setIngredientInput] = useState("");

  const formik = useFormik({
    initialValues,

    onSubmit: async (values) => {
      const data = {
        name: values.name,

        description: values.description,

        price: Number(values.price),

        category: {
          name: values.category,
        },

        restaurantId: restaurantId,

        vegetarian: values.vegetarian,

        seasonal: values.seasonal,

        ingrediants: values.ingredients,

        images: values.images,
      };

      // console.log("MENU DATA:", JSON.stringify(data, null, 2));
      try {
        await dispatch(createMenuItem({ menu: data, jwt }));

        navigate("/admin/restaurants/menu", {
          state: {
            successMessage: "Food Created Successfully!",
          },
        });
      } catch (error) {
        console.log("Failed to create food:", error);
      }
    },
  });

  const handleImageChange = async (event) => {
    const files = Array.from(event.target.files);

    if (!files.length) return;

    setUploadImage(true);

    try {
      const uploadedImages = [];

      for (const file of files) {
        const image = await uploadImageToCloudaniry(file);

        uploadedImages.push(image);
      }

      formik.setFieldValue("images", [
        ...formik.values.images,
        ...uploadedImages,
      ]);
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setUploadImage(false);
    }

    event.target.value = "";
  };

  const handleRemoveImage = (index) => {
    const updatedImages = formik.values.images.filter(
      (_, imageIndex) => imageIndex !== index,
    );

    formik.setFieldValue("images", updatedImages);
  };

  const handleAddIngredient = () => {
    if (!ingredientInput) return;

    const selectedIngredient = ingredientsList.find(
      (item) => String(item.Id) === String(ingredientInput),
    );

    if (!selectedIngredient) return;

    const alreadyAdded = formik.values.ingredients.some(
      (item) => item.Id === selectedIngredient.Id,
    );

    if (alreadyAdded) {
      setIngredientInput("");
      return;
    }

    formik.setFieldValue("ingredients", [
      ...formik.values.ingredients,
      selectedIngredient,
    ]);

    setIngredientInput("");
  };

  const handleRemoveIngredient = (index) => {
    const updatedIngredients = formik.values.ingredients.filter(
      (_, ingredientIndex) => ingredientIndex !== index,
    );

    formik.setFieldValue("ingredients", updatedIngredients);
  };

  useEffect(() => {
    if (!jwt || !restaurantId) return;

    dispatch(
      getIngredientsOfRestaurant({
        id: restaurantId,
        jwt,
      }),
    );

    dispatch(
      getRestaurantCategory({
        restaurantId,
        jwt,
      }),
    );
  }, [dispatch, jwt, restaurantId]);

  return (
    <div className="restau-menu-create-page">
      <div className="restau-menu-create-container">
        <div className="restau-menu-create-header">
          <h1>Add New Menu Item</h1>

          <p>
            Create a new food item and provide all the necessary information.
          </p>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className="restau-menu-create-form"
        >
          {/* Images */}

          <div className="restau-menu-form-section">
            <div className="restau-menu-section-title">
              <h2>Food Images</h2>

              <p>Add one or more images of your food item.</p>
            </div>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div className="restau-menu-image-upload-wrapper">
                  <div className="restau-menu-upload-box">
                    <input
                      type="file"
                      accept="image/*"
                      id="restau-menu-file-input"
                      multiple
                      onChange={handleImageChange}
                    />

                    <label htmlFor="restau-menu-file-input">
                      <div className="restau-menu-upload-content">
                        {uploadImage ? (
                          <CircularProgress size={28} />
                        ) : (
                          <>
                            <AddPhotoAlternateIcon />

                            <span>Add Food Images</span>
                          </>
                        )}
                      </div>
                    </label>
                  </div>

                  <div className="restau-menu-image-preview-container">
                    {formik.values.images.map((image, index) => (
                      <div className="restau-menu-image-preview" key={index}>
                        <img src={image} alt={`Food ${index + 1}`} />

                        <button
                          type="button"
                          className="restau-menu-remove-image"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <CloseIcon fontSize="small" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>

          {/* Basic Information */}

          <div className="restau-menu-form-section">
            <div className="restau-menu-section-title">
              <h2>Basic Information</h2>

              <p>Enter the basic information about your food item.</p>
            </div>

            <Grid container spacing={2.5}>
              <Grid item xs={12} md={6}>
                <div className="restau-menu-input-group">
                  <label>Food Name</label>

                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Margherita Pizza"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                  />
                </div>
              </Grid>

              <Grid item xs={12} md={6}>
                <div className="restau-menu-input-group">
                  <label>Price</label>

                  <input
                    type="number"
                    name="price"
                    placeholder="e.g. 399"
                    min="0"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                  />
                </div>
              </Grid>

              <Grid item xs={12} md={6}>
                <div className="restau-menu-input-group">
                  <label>Category</label>

                  <select
                    name="category"
                    value={formik.values.category}
                    onChange={formik.handleChange}
                  >
                    <option value="">Select a category</option>

                    {categoriesList.map((item) => (
                      <option key={item.id ?? item.Id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </Grid>

              <Grid item xs={12}>
                <div className="restau-menu-input-group">
                  <label>Description</label>

                  <textarea
                    name="description"
                    rows={4}
                    placeholder="Describe your food item..."
                    value={formik.values.description}
                    onChange={formik.handleChange}
                  />
                </div>
              </Grid>
            </Grid>
          </div>

          {/* Ingredients */}

          <div className="restau-menu-form-section">
            <div className="restau-menu-section-title">
              <h2>Ingredients</h2>

              <p>Add the ingredients used in this food item.</p>
            </div>

            <div className="restau-menu-ingredient-input">
              <select
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
              >
                <option value="">Select an ingredient</option>

                {ingredientsList.map((item) => (
                  <option key={item.Id} value={item.Id}>
                    {item.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleAddIngredient}
                className="restau-menu-add-ingredient-btn"
              >
                Add
              </button>
            </div>

            <div className="restau-menu-ingredients-list">
              {formik.values.ingredients.map((ingredient, index) => (
                <div
                  className="restau-menu-ingredient-chip"
                  key={ingredient.Id}
                >
                  <span>{ingredient.name}</span>

                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(index)}
                  >
                    <CloseIcon fontSize="small" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Food Options */}

          <div className="restau-menu-form-section">
            <div className="restau-menu-section-title">
              <h2>Food Options</h2>

              <p>Specify the type and availability of the food.</p>
            </div>

            <div className="restau-menu-switch-container">
              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.vegetarian}
                    onChange={(e) =>
                      formik.setFieldValue("vegetarian", e.target.checked)
                    }
                  />
                }
                label="Vegetarian"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.seasonal}
                    onChange={(e) =>
                      formik.setFieldValue("seasonal", e.target.checked)
                    }
                  />
                }
                label="Seasonal"
              />
            </div>
          </div>

          {/* Submit */}

          <div className="restau-menu-submit-section">
            <button type="submit" className="restau-menu-submit-btn">
              Create Menu Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMenuForm;
