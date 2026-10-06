import "./Orderss.css";
import {
  Card,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import OrderTable from "./OrderTable";

const Orderss = () => {
  const [filterValue, setFilterValue] = useState();

  const handleFilter = (e, value) => {
    setFilterValue(value);
  };

  return (
    <div className="restau-orders-container">
      <div className="restau-orders-table-section">
        <OrderTable />
      </div>
    </div>
  );
};

export default Orderss;
