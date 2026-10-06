import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import { Button, Card } from "@mui/material";
import "./AddessCard.css";

const AddressCard = ({ item, showButton, handleSelectAddress }) => {
  return (
    <Card className="address-card flex gap-5 w-81 p-5">
      <HomeIcon />

      <div className="space-y-3 text-gray-500">
        <h1 className="font-semibold text-lg text-white">
          {item?.type || "Home"}
        </h1>

        <p>
          {item?.streetAddress}, {item?.city}, {item?.state}, {item?.postalCode}
          , {item?.country}
        </p>

        {showButton && (
          <Button variant="outlined" onClick={() => handleSelectAddress(item)}>
            Select
          </Button>
        )}
      </div>
    </Card>
  );
};

export default AddressCard;
