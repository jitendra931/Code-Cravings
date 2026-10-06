import { Button } from "@mui/material";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import { useNavigate, useParams } from "react-router-dom";
import "./PaymentSuccess.css";
import { updatePayment } from "../State/order/Action";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

function PaymentSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      updatePayment({
        orderId: id,
        jwt: localStorage.getItem("jwt"),
      }),
    );
  }, []);

  return (
    <div className="payment-success-page">
      <div className="payment-card">
        <TaskAltRoundedIcon className="success-icon" />

        <h1>Order Successful </h1>

        <p className="message">
          Thank you for choosing Code Cravings.
          <br />
          Your payment has been received successfully.
        </p>

        <div className="order-id">Order ID : #{id}</div>

        <Button
          variant="contained"
          className="home-btn"
          onClick={() => navigate("/")}
        >
          Go To Home
        </Button>
      </div>
    </div>
  );
}

export default PaymentSuccess;
