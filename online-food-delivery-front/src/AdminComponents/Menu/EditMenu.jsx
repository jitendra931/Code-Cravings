import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Card,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Typography,
  IconButton,
  Chip,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../../components/config/api";
import { getRestaurantCategory } from "../../components/State/Restaurant/Action";

import { uploadImageToCloudaniry } from "../utils/UploadToCloudaniry";
import "./EditMenu.css";

const EditMenu = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { foodId } = useParams();
  const fileInputRef = useRef(null);

  const jwt = localStorage.getItem("jwt");

  const restaurantState = useSelector((state) => state.restaurant);

  const restaurant = restaurantState?.usersRestaurant;
  const categories = restaurantState?.categories || [];

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    images: [],
    vegetarian: false,
    seasonal: false,
    ingrediants: [],
  });

  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedCategory = useMemo(
    () =>
      categories.find(
        (item) => String(item?.Id ?? item?.id) === String(form.category),
      ),
    [categories, form.category],
  );

  useEffect(() => {
    if (!jwt || !restaurant?.id || categories.length > 0) {
      return;
    }

    dispatch(
      getRestaurantCategory({
        jwt,
        restaurantId: restaurant.id,
      }),
    );
  }, [dispatch, jwt, restaurant?.id, categories.length]);

  useEffect(() => {
    let cancelled = false;

    const fetchFood = async () => {
      if (!foodId || !jwt) {
        setError("Authentication or food ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        setSuccess("");

        const { data } = await api.get(`/api/food/${foodId}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (cancelled) {
          return;
        }

        const foodCategory = data?.foodCategory || data?.category;

        setForm({
          name: data?.name || "",
          description: data?.description || "",
          price: data?.price ?? "",
          category: foodCategory
            ? String(foodCategory.Id ?? foodCategory.id ?? "")
            : "",
          images: Array.isArray(data?.images) ? data.images : [],
          vegetarian: Boolean(data?.vegetarian),
          seasonal: Boolean(data?.seasonal),
          ingrediants: Array.isArray(data?.ingrediants) ? data.ingrediants : [],
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error("Failed to fetch food:", error);

        setError(error?.response?.data?.message || "Failed to load food item.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchFood();

    return () => {
      cancelled = true;
    };
  }, [foodId, jwt]);

  const handleFieldChange = (field) => (event) => {
    const value = event.target.value;

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleLocalImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a JPG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    try {
      setUploadingImage(true);
      setError("");
      setSuccess("");

      const uploadedImageUrl = await uploadImageToCloudaniry(file);

      if (!uploadedImageUrl) {
        throw new Error("Image URL was not returned by Cloudinary.");
      }

      setForm((prev) => ({
        ...prev,
        images: prev.images.includes(uploadedImageUrl)
          ? prev.images
          : [...prev.images, uploadedImageUrl],
      }));

      setSuccess("Image uploaded successfully.");
    } catch (error) {
      console.error("Image upload failed:", error);

      setError(error?.message || "Failed to upload image.");
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  const handleBooleanChange = (field) => (event) => {
    setForm((prev) => ({
      ...prev,
      [field]: event.target.checked,
    }));

    setError("");
    setSuccess("");
  };

  const handleAddImage = () => {
    const value = imageUrl.trim();

    if (!value) {
      return;
    }

    if (form.images.includes(value)) {
      setError("This image URL has already been added.");
      return;
    }

    setForm((prev) => ({
      ...prev,
      images: [...prev.images, value],
    }));

    setImageUrl("");
    setError("");
    setSuccess("");
  };

  const handleImageKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddImage();
    }
  };

  const handleRemoveImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

    setError("");
    setSuccess("");
  };

  const handleIngredientChange = (index, value) => {
    setForm((prev) => ({
      ...prev,
      ingrediants: prev.ingrediants.map((ingredient, i) =>
        i === index
          ? {
              ...ingredient,
              name: value,
            }
          : ingredient,
      ),
    }));

    setError("");
    setSuccess("");
  };

  const handleRemoveIngredient = (index) => {
    setForm((prev) => ({
      ...prev,
      ingrediants: prev.ingrediants.filter((_, i) => i !== index),
    }));

    setError("");
    setSuccess("");
  };

  const validateForm = () => {
    const trimmedName = form.name.trim();
    const numericPrice = Number(form.price);

    if (!trimmedName) {
      return "Food name is required.";
    }

    if (
      form.price === "" ||
      !Number.isFinite(numericPrice) ||
      numericPrice < 0
    ) {
      return "Please enter a valid price.";
    }

    if (!form.category) {
      return "Please select a category.";
    }

    if (!selectedCategory) {
      return "Selected category is not available.";
    }

    const invalidImage = form.images.some((image) => !image || !image.trim());

    if (invalidImage) {
      return "Please remove invalid image URLs.";
    }

    return "";
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (saving || uploadingImage) {
      return;
    }

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    if (!jwt) {
      setError("Authentication is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const menu = {
        id: Number(foodId),
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: selectedCategory,
        images: form.images,
        vegetarian: form.vegetarian,
        seasonal: form.seasonal,
        ingrediants: form.ingrediants,
      };

      const { data } = await api.put(`/api/admin/food/${foodId}`, menu, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      // console.log("Updated food:", data);

      navigate("/admin/restaurants/menu", {
        replace: true,
        state: {
          successMessage: "Food updated successfully.",
        },
      });
    } catch (error) {
      console.error("Failed to update food:", error);

      setError(error?.response?.data?.message || "Failed to update food item.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (saving || uploadingImage) {
      return;
    }

    navigate("/admin/restaurants/menu");
  };

  if (loading) {
    return (
      <Box className="edit-menu-loading">
        <CircularProgress size={34} />
        <Typography>Loading food item...</Typography>
      </Box>
    );
  }

  return (
    <Box className="edit-menu-page">
      <Card className="edit-menu-card">
        <div className="edit-menu-header">
          <div>
            <Typography className="edit-menu-title">Edit Menu Item</Typography>

            <Typography className="edit-menu-subtitle">
              Update your food item details
            </Typography>
          </div>

          <Button
            type="button"
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleCancel}
            disabled={saving || uploadingImage}
            className="edit-menu-back-button"
          >
            Back
          </Button>
        </div>

        {error && (
          <Box className="edit-menu-message edit-menu-error">
            <Typography>{error}</Typography>
          </Box>
        )}

        {success && (
          <Box className="edit-menu-message edit-menu-success">
            <Typography>{success}</Typography>
          </Box>
        )}

        <Box
          component="form"
          onSubmit={handleUpdate}
          className="edit-menu-form"
        >
          <div className="edit-menu-basic-grid">
            <TextField
              label="Food Name"
              value={form.name}
              onChange={handleFieldChange("name")}
              fullWidth
              required
            />

            <TextField
              label="Price"
              type="number"
              value={form.price}
              onChange={handleFieldChange("price")}
              fullWidth
              required
              inputProps={{
                min: 0,
                step: "0.01",
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
              }}
            />
          </div>

          <TextField
            label="Description"
            value={form.description}
            onChange={handleFieldChange("description")}
            fullWidth
            multiline
            rows={4}
          />

          <FormControl fullWidth required>
            <InputLabel>Category</InputLabel>

            <Select
              value={form.category}
              label="Category"
              onChange={handleFieldChange("category")}
            >
              {categories.length > 0 ? (
                categories.map((item) => {
                  const id = item?.Id ?? item?.id;

                  return (
                    <MenuItem key={id} value={String(id)}>
                      {item?.name}
                    </MenuItem>
                  );
                })
              ) : (
                <MenuItem disabled>No categories available</MenuItem>
              )}
            </Select>
          </FormControl>

          <Box className="edit-menu-image-section">
            <Typography className="edit-menu-section-title">
              Food Images
            </Typography>

            <Box className="edit-menu-image-input">
              <TextField
                label="Image URL"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                onKeyDown={handleImageKeyDown}
                fullWidth
              />

              <Button
                type="button"
                variant="outlined"
                onClick={handleAddImage}
                disabled={!imageUrl.trim() || uploadingImage}
              >
                Add URL
              </Button>

              <IconButton
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="edit-menu-add-image-button"
              >
                {uploadingImage ? (
                  <CircularProgress size={24} />
                ) : (
                  <CloudUploadIcon />
                )}
              </IconButton>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                hidden
                onChange={handleLocalImageUpload}
              />
            </Box>

            {form.images.length > 0 ? (
              <Box className="edit-menu-image-list">
                {form.images.map((image, index) => (
                  <Box
                    key={`${image}-${index}`}
                    className="edit-menu-image-preview"
                  >
                    <img src={image} alt={`Food ${index + 1}`} />

                    <IconButton
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="edit-menu-image-delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography className="edit-menu-empty">
                No images added.
              </Typography>
            )}
          </Box>

          <Box className="edit-menu-options">
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.vegetarian}
                  onChange={handleBooleanChange("vegetarian")}
                />
              }
              label="Vegetarian"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={form.seasonal}
                  onChange={handleBooleanChange("seasonal")}
                />
              }
              label="Seasonal"
            />
          </Box>

          <Box className="edit-menu-ingredients">
            <div className="edit-menu-section-header">
              <div>
                <Typography className="edit-menu-section-title">
                  Ingredients
                </Typography>

                <Typography className="edit-menu-section-description">
                  Manage the ingredients included with this food item.
                </Typography>
              </div>

              <Chip
                label={`${form.ingrediants.length} ${
                  form.ingrediants.length === 1 ? "Ingredient" : "Ingredients"
                }`}
                className="edit-menu-count-chip"
              />
            </div>

            {form.ingrediants.length > 0 ? (
              <Box className="edit-menu-ingredients-list">
                {form.ingrediants.map((ingredient, index) => (
                  <Box
                    key={
                      ingredient?.Id ?? ingredient?.id ?? `ingredient-${index}`
                    }
                    className="edit-menu-ingredient-row"
                  >
                    <TextField
                      label={`Ingredient ${index + 1}`}
                      value={ingredient?.name || ""}
                      onChange={(event) =>
                        handleIngredientChange(index, event.target.value)
                      }
                      fullWidth
                    />

                    <IconButton
                      type="button"
                      onClick={() => handleRemoveIngredient(index)}
                      className="edit-menu-delete-ingredient"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography className="edit-menu-empty">
                No ingredients available for this food item.
              </Typography>
            )}
          </Box>

          <Box className="edit-menu-actions">
            <Button
              type="button"
              variant="outlined"
              onClick={handleCancel}
              disabled={saving || uploadingImage}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={saving || uploadingImage}
              startIcon={
                saving ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <SaveIcon />
                )
              }
            >
              {saving ? "Updating..." : "Update Food"}
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default EditMenu;
