import Divider from "@mui/material/Divider";
import React from "react";
import "./Cart.css";

import CartItems from "./CartItems";
import { Grid, Modal, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../State/order/Action";
import Footer from "../Footer/Footer";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  outline: "none",
  boxShadow: 24,
};

const initialValues = {
  streetAddress: "",
  state: "",
  pincode: "",
  city: "",
};

const validationSchema = Yup.object().shape({
  streetAddress: Yup.string().required("Street address is required"),
  state: Yup.string().required("State is required"),
  pincode: Yup.string().required("Pincode is required"),
  city: Yup.string().required("City is required"),
});

const Cart = () => {
  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);

  const auth = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const jwt = auth.jwt || localStorage.getItem("jwt");

  const deliveryFee = 21;
  const platformFee = 10;
  const gst = 33;

  const itemTotal = cart?.total ?? 0;

  const totalPay = itemTotal + deliveryFee + platformFee + gst;

  const handleOpenAddressModal = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (value) => {
    const restaurantId = cart?.items?.[0]?.food?.restaurant?.id;

    if (!restaurantId) {
      alert("Your Cart is Empty");
      return;
    }

    const data = {
      jwt,
      order: {
        restaurantId,
        deliveryAddress: {
          street: value.streetAddress,
          city: value.city,
          state: value.state,
          zip: value.pincode,
        },
        deliveryFee,
        platformFee,
        gst,
        totalPrice: totalPay,
      },
    };

    // console.log("ORDER DATA:", data);

    dispatch(createOrder(data));
  };

  return (
    <div className="cart-page">
      <main className="cart-main">
        <section className="cart-left-section">
          <div className="glass-card cart-items-wrapper">
            <h1 className="section-title">Your Cart Items</h1>

            {cart?.items?.map((item, index) => (
              <CartItems item={item} key={index} />
            ))}
          </div>
        </section>

        <section className="cart-right-section sticky-summary">
          <div className="glass-card billDetails">
            <h1 className="summary-title">Order Summary</h1>

            <div className="summary-row">
              <p>Item Total</p>
              <p>₹{itemTotal}</p>
            </div>

            <div className="summary-row">
              <p>Delivery Fee</p>
              <p>₹{deliveryFee}</p>
            </div>

            <div className="summary-row">
              <p>Platform Fee</p>
              <p>₹{platformFee}</p>
            </div>

            <div className="summary-row">
              <p>GST & Charges</p>
              <p>₹{gst}</p>
            </div>

            <Divider sx={{ my: 2 }} />

            <div className="summary-row total-row">
              <p>Total Pay</p>
              <p className="total-price">₹{totalPay}</p>
            </div>

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 4 }}
              onClick={handleOpenAddressModal}
            >
              Proceed To Checkout
            </Button>
          </div>
        </section>
      </main>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {({ handleSubmit, handleChange, values, errors, touched }) => (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      name="streetAddress"
                      label="Street Address"
                      value={values.streetAddress}
                      onChange={handleChange}
                      error={
                        touched.streetAddress && Boolean(errors.streetAddress)
                      }
                      helperText={touched.streetAddress && errors.streetAddress}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      name="city"
                      label="City"
                      value={values.city}
                      onChange={handleChange}
                      error={touched.city && Boolean(errors.city)}
                      helperText={touched.city && errors.city}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      name="state"
                      label="State"
                      value={values.state}
                      onChange={handleChange}
                      error={touched.state && Boolean(errors.state)}
                      helperText={touched.state && errors.state}
                    />
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      fullWidth
                      name="pincode"
                      label="Pincode"
                      value={values.pincode}
                      onChange={handleChange}
                      error={touched.pincode && Boolean(errors.pincode)}
                      helperText={touched.pincode && errors.pincode}
                    />
                  </Grid>

                  <Grid size={12}>
                    <Button fullWidth type="submit" variant="contained">
                      Deliver Here
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        </Box>
      </Modal>

      <Footer />
    </div>
  );
};

export default Cart;
