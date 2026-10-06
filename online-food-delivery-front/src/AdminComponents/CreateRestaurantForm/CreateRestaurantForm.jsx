import React, { useState } from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import { CircularProgress } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import { useFormik } from "formik";
import "./CreateRestaurantForm.css";

import imageCompression from "browser-image-compression";

import { uploadImageToCloudaniry } from "../utils/UploadToCloudaniry";
import { useDispatch } from "react-redux";
import { createRestaurant } from "../../components/State/Restaurant/Action";

const initialValues = {
  name: "",
  owner: "",
  description: "",
  cuisinetype: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  email: "",
  mobile: "",
  twitter: "",
  instagram: "",
  openingHours: "Mon-Sun : 9:00 AM - 11:00 PM",
  images: [],
};

const CreateRestaurantForm = () => {
  const [uploadImage, setUploadImage] = useState(false);

  const dispatch = useDispatch();

  const jwt = localStorage.getItem("jwt");

  const formik = useFormik({
    initialValues,

    onSubmit: (values) => {
      const restaurantData = {
        name: values.name,
        description: values.description,

        // Frontend field -> Backend field
        cousineType: values.cuisinetype,

        openingHours: values.openingHours,

        images: values.images,

        address: {
          street: values.street,
          city: values.city,
          state: values.state,
          zip: values.zip,
          country: values.country,
        },

        contactInformation: {
          email: values.email,
          mobile: values.mobile,
          twitter: values.twitter,
          instagram: values.instagram,
        },
      };

      // console.log("Restaurant Data:", restaurantData);

      dispatch(
        createRestaurant({
          data: restaurantData,
          token: jwt,
        }),
      );
    },
  });

  const handleImageChange = async (event) => {
    const files = Array.from(event.target.files);

    if (!files.length) return;

    setUploadImage(true);

    try {
      const uploadedImages = [];

      for (const file of files) {
        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1200,
          useWebWorker: true,
        };

        // console.log(
        //   `Original image size: ${(file.size / 1024 / 1024).toFixed(2)} MB`,
        // );

        const compressedFile = await imageCompression(file, options);

        // console.log(
        //   `Compressed image size: ${(compressedFile.size / 1024 / 1024).toFixed(
        //     2,
        //   )} MB`,
        // );

        const image = await uploadImageToCloudaniry(compressedFile);

        uploadedImages.push(image);
      }

      formik.setFieldValue("images", [
        ...formik.values.images,
        ...uploadedImages,
      ]);
    } catch (error) {
      // console.error("Image upload failed:", error);
    } finally {
      setUploadImage(false);

      event.target.value = "";
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = formik.values.images.filter(
      (_, imageIndex) => imageIndex !== index,
    );

    formik.setFieldValue("images", updatedImages);
  };

  return (
    <div className="restau-create-page">
      <div className="restau-create-container">
        {/* Header */}
        <div className="restau-create-header">
          <h1>Add New Restaurant</h1>

          <p>
            Create your restaurant profile and provide all the necessary
            information.
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="restau-create-form">
          {/* ==================== IMAGES ==================== */}

          <div className="restau-form-section">
            <div className="restau-section-title">
              <h2>Restaurant Images</h2>

              <p>Add one or more images of your restaurant.</p>
            </div>

            <Grid container spacing={2}>
              <Grid size={12}>
                <div className="restau-image-upload-wrapper">
                  <div className="restau-upload-box">
                    <input
                      type="file"
                      accept="image/*"
                      id="restau-file-input"
                      multiple
                      onChange={handleImageChange}
                    />

                    <label htmlFor="restau-file-input">
                      <div className="restau-upload-content">
                        {uploadImage ? (
                          <>
                            <CircularProgress size={28} />

                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <AddPhotoAlternateIcon />

                            <span>Add Images</span>
                          </>
                        )}
                      </div>
                    </label>
                  </div>

                  <div className="restau-image-preview-container">
                    {formik.values.images.map((image, index) => (
                      <div
                        className="restau-image-preview"
                        key={`${image}-${index}`}
                      >
                        <img src={image} alt={`Restaurant ${index + 1}`} />

                        <IconButton
                          size="small"
                          className="restau-remove-image"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </div>
                    ))}
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>

          {/* ==================== BASIC INFORMATION ==================== */}

          <div className="restau-form-section">
            <div className="restau-section-title">
              <h2>Basic Information</h2>

              <p>Enter your restaurant's basic details.</p>
            </div>

            <Grid container spacing={2.5}>
              {/* Restaurant Name */}
              <Grid size={{ xs: 12, md: 6 }}>
                <div className="restau-input-group">
                  <label>Restaurant Name</label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter restaurant name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                  />
                </div>
              </Grid>

              {/* Cuisine Type */}
              <Grid size={{ xs: 12, md: 6 }}>
                <div className="restau-input-group">
                  <label>Cuisine Type</label>

                  <input
                    type="text"
                    name="cuisinetype"
                    placeholder="e.g. Indian, Chinese"
                    value={formik.values.cuisinetype}
                    onChange={formik.handleChange}
                  />
                </div>
              </Grid>

              {/* Description */}
              <Grid size={12}>
                <div className="restau-input-group">
                  <label>Description</label>

                  <textarea
                    name="description"
                    rows={4}
                    placeholder="Describe your restaurant..."
                    value={formik.values.description}
                    onChange={formik.handleChange}
                  />
                </div>
              </Grid>
            </Grid>
          </div>

          {/* ==================== ADDRESS ==================== */}

          <div className="restau-form-section">
            <div className="restau-section-title">
              <h2>Address</h2>

              <p>Provide the complete restaurant address.</p>
            </div>

            <Grid container spacing={2.5}>
              {/* Street */}
              <Grid size={{ xs: 12, md: 6 }}>
                <div className="restau-input-group">
                  <label>Street Address</label>

                  <input
                    type="text"
                    name="street"
                    placeholder="56 MG Road"
                    value={formik.values.street}
                    onChange={formik.handleChange}
                  />
                </div>
              </Grid>

              {/* City */}
              <Grid size={{ xs: 12, md: 6 }}>
                <div className="restau-input-group">
                  <label>City</label>

                  <input
                    type="text"
                    name="city"
                    placeholder="Indore"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                  />
                </div>
              </Grid>

              {/* State */}
              <Grid size={{ xs: 12, md: 6 }}>
                <div className="restau-input-group">
                  <label>State / Province</label>

                  <input
                    type="text"
                    name="state"
                    placeholder="Madhya Pradesh"
                    value={formik.values.state}
                    onChange={formik.handleChange}
                  />
                </div>
              </Grid>

              {/* Zip */}
              <Grid size={{ xs: 12, md: 6 }}>
                <div className="restau-input-group">
                  <label>Postal Code</label>

                  <input
                    type="text"
                    name="zip"
                    placeholder="452001"
                    value={formik.values.zip}
                    onChange={formik.handleChange}
                  />
                </div>
              </Grid>

              {/* Country */}
              <Grid size={{ xs: 12, md: 6 }}>
                <div className="restau-input-group">
                  <label>Country</label>

                  <input
                    type="text"
                    name="country"
                    placeholder="India"
                    value={formik.values.country}
                    onChange={formik.handleChange}
                  />
                </div>
              </Grid>

              {/* Opening Hours */}
              <Grid size={{ xs: 12, md: 6 }}>
                <div className="restau-input-group">
                  <label>Opening Hours</label>

                  <input
                    type="text"
                    name="openingHours"
                    placeholder="Mon-Sun : 9:00 AM - 11:00 PM"
                    value={formik.values.openingHours}
                    onChange={formik.handleChange}
                  />
                </div>
              </Grid>
            </Grid>
          </div>

          {/* ==================== CONTACT INFORMATION ==================== */}

          <div className="restau-form-section">
            <div className="restau-section-title">
              <h2>Contact Information</h2>

              <p>Add contact details and social media links.</p>
            </div>

            <Grid container spacing={2.5}>
              {/* Email */}
              <Grid size={{ xs: 12, md: 6 }}>
                <div className="restau-input-group">
                  <label>Email</label>

                  <input
                    type="email"
                    name="email"
                    placeholder="restaurant@gmail.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                  />
                </div>
              </Grid>

              {/* Mobile */}
              <Grid size={{ xs: 12, md: 6 }}>
                <div className="restau-input-group">
                  <label>Mobile</label>

                  <input
                    type="text"
                    name="mobile"
                    placeholder="9876543210"
                    value={formik.values.mobile}
                    onChange={formik.handleChange}
                  />
                </div>
              </Grid>

              {/* Twitter */}
              <Grid size={{ xs: 12, md: 6 }}>
                <div className="restau-input-group">
                  <label>Twitter / X</label>

                  <input
                    type="text"
                    name="twitter"
                    placeholder="https://x.com/restaurant"
                    value={formik.values.twitter}
                    onChange={formik.handleChange}
                  />
                </div>
              </Grid>

              {/* Instagram */}
              <Grid size={{ xs: 12, md: 6 }}>
                <div className="restau-input-group">
                  <label>Instagram</label>

                  <input
                    type="text"
                    name="instagram"
                    placeholder="https://instagram.com/restaurant"
                    value={formik.values.instagram}
                    onChange={formik.handleChange}
                  />
                </div>
              </Grid>
            </Grid>
          </div>

          {/* ==================== SUBMIT ==================== */}

          <div className="restau-submit-section">
            <button
              type="submit"
              className="restau-submit-btn"
              disabled={uploadImage}
            >
              {uploadImage ? "Uploading Images..." : "Create Restaurant"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRestaurantForm;
