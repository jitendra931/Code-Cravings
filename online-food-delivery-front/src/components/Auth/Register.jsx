import React, { useState } from "react";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  Button,
  MenuItem,
  TextField,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";

import GoogleIcon from "@mui/icons-material/Google";

import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebase";

import { registerUser } from "../State/Authentication/Action";

const initialValues = {
  fullname: "",
  email: "",
  password: "",
  role: "",
};

const validationSchema = Yup.object({
  fullname: Yup.string()
    .min(3, "Full name must be at least 3 characters")
    .required("Full name is required"),

  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  role: Yup.string().required("Please select a role"),
});

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState("");

  const handleSubmit = (values, { setSubmitting }) => {
    dispatch(
      registerUser({
        userData: values,
        navigate,
      }),
    );

    setSubmitting(false);
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      setGoogleError("");

      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      // console.log("Google User:", user);
      // console.log("Name:", user.displayName);
      // console.log("Email:", user.email);
      // console.log("Photo:", user.photoURL);

      const token = await user.getIdToken();

      // console.log("Firebase Token:", token);
    } catch (error) {
      console.error("Google Login Error:", error);

      setGoogleError("Unable to continue with Google. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          Create Account
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#9e9e9e",
          }}
        >
          Join Code & Cravings today
        </Typography>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ touched, errors, isSubmitting }) => (
          <Form>
            {/* FULL NAME */}

            <Field
              as={TextField}
              fullWidth
              margin="normal"
              variant="outlined"
              label="Full Name"
              name="fullname"
              autoComplete="name"
              error={touched.fullname && Boolean(errors.fullname)}
              helperText={touched.fullname && errors.fullname}
            />

            {/* EMAIL */}

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

            <Field
              as={TextField}
              fullWidth
              margin="normal"
              variant="outlined"
              label="Password"
              name="password"
              type="password"
              autoComplete="new-password"
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
            />

            <FormControl
              fullWidth
              margin="normal"
              error={touched.role && Boolean(errors.role)}
            >
              <InputLabel id="role-label">Role</InputLabel>

              <Field
                as={Select}
                labelId="role-label"
                id="role"
                name="role"
                label="Role"
              >
                <MenuItem value="ROLE_CUSTOMER">Customer</MenuItem>

                <MenuItem value="ROLE_RESTAURANT_OWNER">
                  Restaurant Owner
                </MenuItem>
              </Field>

              {touched.role && errors.role && (
                <Typography
                  variant="caption"
                  sx={{
                    color: "#d32f2f",
                    mt: 0.5,
                    ml: 1.5,
                  }}
                >
                  {errors.role}
                </Typography>
              )}
            </FormControl>

            {/* GOOGLE ERROR */}

            {googleError && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {googleError}
              </Alert>
            )}

            <div className="flex items-center gap-2 my-3">
              <Divider sx={{ flex: 1 }} />

              <Typography
                variant="caption"
                sx={{
                  color: "#777",
                }}
              >
                OR
              </Typography>

              <Divider sx={{ flex: 1 }} />
            </div>

            <Button
              fullWidth
              variant="outlined"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              startIcon={
                googleLoading ? <CircularProgress size={20} /> : <GoogleIcon />
              }
              sx={{
                mb: 2,
                py: 1.5,
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
              }}
            >
              {googleLoading ? "Connecting..." : "Continue with Google"}
            </Button>

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={isSubmitting}
              sx={{
                py: 1.5,
                borderRadius: "12px",
                fontWeight: 700,
                fontSize: "1rem",
                textTransform: "none",
                background: "linear-gradient(135deg, #ff6b35, #f97316)",

                "&:hover": {
                  background: "linear-gradient(135deg, #f97316, #ea580c)",
                },
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Create Account"
              )}
            </Button>

            {/* LOGIN */}

            <Typography
              align="center"
              sx={{
                mt: 3,
                color: "#bdbdbd",
              }}
            >
              Already have an account?
              <Button
                onClick={() => navigate("/account/login")}
                sx={{
                  ml: 1,
                  textTransform: "none",
                  fontWeight: 600,
                  color: "#ff6b35",
                }}
              >
                Login
              </Button>
            </Typography>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;
