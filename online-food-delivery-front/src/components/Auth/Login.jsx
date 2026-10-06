import React, { useState } from "react";
import { Alert, Button, Snackbar, TextField, Typography } from "@mui/material";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../State/Authentication/Action";

const initialValues = {
  email: "",
  password: "",
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const data = await dispatch(
        loginUser({
          userData: values,
        }),
      );

      // Login successful
      setSnackbar({
        open: true,
        message: "Login successful!",
        severity: "success",
      });

      // Navigate after showing success message
      setTimeout(() => {
        if (data.role === "ROLE_RESTAURANT_OWNER") {
          navigate("/admin/restaurants");
        } else {
          navigate("/");
        }
      }, 800);
    } catch (error) {
      // Login failed
      setSnackbar({
        open: true,
        message: "Email or password is incorrect.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Typography
        variant="h4"
        align="center"
        sx={{
          fontWeight: 700,
          mb: 3,
        }}
      >
        Welcome Back
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ touched, errors, isSubmitting }) => (
          <Form>
            {/* Email */}
            <Field
              as={TextField}
              fullWidth
              margin="normal"
              variant="outlined"
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
            />

            {/* Password */}
            <Field
              as={TextField}
              fullWidth
              margin="normal"
              variant="outlined"
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
            />

            {/* Forgot Password */}
            <Typography
              align="right"
              sx={{
                mt: 1,
                mb: 2,
                cursor: "pointer",
                color: "#ff6b35",
                fontSize: "0.9rem",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Forgot Password?
            </Typography>

            {/* Login Button */}
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={isSubmitting}
              sx={{
                mt: 1,
                py: 1.5,
                borderRadius: "12px",
                fontWeight: 700,
                fontSize: "1rem",
                // color: "#ff6b35",
                backgroundColor: "#ff6b35",
              }}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>

            {/* Register */}
            <Typography
              align="center"
              sx={{
                mt: 3,
                color: "#bdbdbd",
              }}
            >
              Don't have an account?
              <Button
                type="button"
                onClick={() => navigate("/account/register")}
                sx={{
                  ml: 1,
                  textTransform: "none",
                  fontWeight: 600,
                  color: "#ff6b35",
                }}
              >
                Register
              </Button>
            </Typography>
          </Form>
        )}
      </Formik>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Login;
