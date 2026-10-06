import React from "react";
import "./Others.css";
import AddressCard from "../Cart/AddressCard";

const Address = () => {
  return (
    <div className="address-page">
      <h1 className="address-title">My Addresses</h1>

      <div className="address-wrapper-profile">
        {[1, 1, 1, 1, 1, 1, 1, 1].map((item, index) => (
          <div className="address-card-profile" key={index}>
            <AddressCard />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Address;
