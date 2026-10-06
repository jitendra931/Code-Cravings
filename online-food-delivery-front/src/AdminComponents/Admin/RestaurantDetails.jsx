import { Button, Card, CardContent, CardHeader, Grid } from "@mui/material";
import React from "react";
import "./RestaurantDetails.css";

import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";

import { useDispatch, useSelector } from "react-redux";
import { updateRestaurantStatus } from "../../components/State/Restaurant/Action";

const link = "https://www.linkedin.com/in/jitendra-ahirwar-6564b730/";

const RestaurantDetails = () => {
  const dispatch = useDispatch();
  const restaurant = useSelector((store) => store.restaurant);

  const jwt = localStorage.getItem("jwt");
  const usersRestaurant = restaurant.usersRestaurant;

  // console.log("Restaurant Details : ", restaurant);

  const handleRestaurantStatus = () => {
    if (!usersRestaurant) return;

    dispatch(
      updateRestaurantStatus({
        restaurantId: usersRestaurant.id,
        jwt: jwt,
        open: !usersRestaurant.open,
      }),
    );
  };
  return (
    <div className="restau-details-page pb-10">
      <div className="restau-title-section">
        <h1 className="restau-title">{restaurant.usersRestaurant?.name}</h1>

        <Button
          variant="contained"
          color="error"
          size="large"
          className="restau-status-btn"
          onClick={handleRestaurantStatus}
        >
          {restaurant.usersRestaurant?.open ? "close" : "open"}
        </Button>
      </div>

      <Grid container spacing={3}>
        <Grid size={12}>
          <Card className="restau-details-card">
            <CardHeader title="Restaurant" className="restau-card-header" />

            <CardContent>
              <div className="restau-info">
                <div className="restau-row">
                  <span className="restau-label">Owner</span>
                  <span className="restau-dash">-</span>

                  <span className="restau-value">
                    {restaurant.usersRestaurant?.owner?.fullname}
                  </span>
                </div>

                <div className="restau-row">
                  <span className="restau-label">Restaurant Name</span>

                  <span className="restau-dash">-</span>

                  <span className="restau-value">
                    {restaurant.usersRestaurant?.name}
                  </span>
                </div>

                <div className="restau-row">
                  <span className="restau-label">Cuisine Type</span>

                  <span className="restau-dash">-</span>

                  <span className="restau-value">
                    {restaurant.usersRestaurant?.cuisinetype}
                  </span>
                </div>

                <div className="restau-row">
                  <span className="restau-label">Opening Hours</span>

                  <span className="restau-dash">-</span>

                  <span className="restau-value">
                    {restaurant.usersRestaurant?.openingHours}
                  </span>
                </div>

                <div className="restau-row">
                  <span className="restau-label">Status</span>

                  <span className="restau-dash">-</span>

                  <span
                    className={
                      restaurant.usersRestaurant?.open
                        ? "restau-open-chip"
                        : "restau-close-chip"
                    }
                  >
                    {restaurant.usersRestaurant?.open ? "Opened" : "Closed"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Address */}

        <Grid size={{ xs: 12, md: 6 }}>
          <Card className="restau-details-card">
            <CardHeader title="Address" className="restau-card-header" />

            <CardContent>
              <div className="restau-info">
                <div className="restau-row">
                  <span className="restau-label">Street</span>

                  <span className="restau-dash">-</span>

                  <span className="restau-value">
                    {restaurant.usersRestaurant?.address?.street}
                  </span>
                </div>

                <div className="restau-row">
                  <span className="restau-label">City</span>

                  <span className="restau-dash">-</span>

                  <span className="restau-value">
                    {restaurant.usersRestaurant?.address?.city}
                  </span>
                </div>

                <div className="restau-row">
                  <span className="restau-label">State</span>

                  <span className="restau-dash">-</span>

                  <span className="restau-value">
                    {restaurant.usersRestaurant?.address?.state}
                  </span>
                </div>

                <div className="restau-row">
                  <span className="restau-label">Postal Code</span>

                  <span className="restau-dash">-</span>

                  <span className="restau-value">
                    {restaurant.usersRestaurant?.address?.zip}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card className="restau-details-card">
            <CardHeader
              title="Contact Information"
              className="restau-card-header"
            />

            <CardContent>
              <div className="restau-info">
                <div className="restau-row">
                  <span className="restau-label">Email</span>

                  <span className="restau-dash">-</span>

                  <span className="restau-value">
                    {restaurant.usersRestaurant?.contactInformation?.email}
                  </span>
                </div>

                <div className="restau-row">
                  <span className="restau-label">Mobile</span>

                  <span className="restau-dash">-</span>

                  <span className="restau-value">
                    {restaurant.usersRestaurant?.contactInformation?.mobile}
                  </span>
                </div>

                <div className="restau-row">
                  <span className="restau-label">Social</span>

                  <div className="restau-social-container">
                    <div className="restau-social-links flex text-gray-400 items-center gap-2">
                      <a
                        href={
                          restaurant?.usersRestaurant?.contactInformation
                            ?.instagram
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <InstagramIcon />
                      </a>

                      <a
                        href={
                          restaurant?.usersRestaurant?.contactInformation
                            ?.twitter
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <TwitterIcon />
                      </a>

                      <a href={link} target="_blank" rel="noopener noreferrer">
                        <FacebookIcon />
                      </a>

                      <a href={link} target="_blank" rel="noopener noreferrer">
                        <LinkedInIcon />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default RestaurantDetails;
