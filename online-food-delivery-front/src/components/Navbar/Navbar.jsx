import React, { useEffect, useRef, useState } from "react";

import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import CloseIcon from "@mui/icons-material/Close";

import { Avatar, IconButton, Badge, Snackbar, Alert } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import "./Navbar.css";

const Navbar = () => {
  const { auth, cart } = useSelector((state) => ({
    auth: state.auth,
    cart: state.cart,
  }));

  const navigate = useNavigate();
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");

  useEffect(() => {
    document.documentElement.classList.add("hide-page-scrollbar");

    return () => {
      document.documentElement.classList.remove("hide-page-scrollbar");
    };
  }, []);

  const handleProfileClick = () => {
    if (auth.user?.role === "ROLE_CUSTOMER") {
      navigate("/my-profile");
    } else {
      navigate("/admin/restaurants");
    }
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleCartClick = () => {
    if (!auth.user) {
      setLoginMessage("Please login to see your cart.");
      return;
    }

    navigate("/cart");
  };

  const handleLoginClick = () => {
    navigate("/account/login");
  };

  const loadSearchData = async () => {
    if (restaurants.length > 0 || foods.length > 0) {
      return;
    }

    try {
      setLoadingSearch(true);

      const [restaurantResponse, foodResponse] = await Promise.all([
        fetch("http://localhost:5000/api/restaurants"),
        fetch("http://localhost:5000/api/food"),
      ]);

      if (!restaurantResponse.ok) {
        throw new Error("Failed to fetch restaurants");
      }

      if (!foodResponse.ok) {
        throw new Error("Failed to fetch food");
      }

      const restaurantData = await restaurantResponse.json();
      const foodData = await foodResponse.json();

      setRestaurants(Array.isArray(restaurantData) ? restaurantData : []);
      setFoods(Array.isArray(foodData) ? foodData : []);
    } catch (error) {
      console.error("Search data error:", error);
      setRestaurants([]);
      setFoods([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSearchOpen = async () => {
    if (!auth.user) {
      setLoginMessage("Please login to search restaurants and food.");
      return;
    }

    setSearchOpen(true);

    await loadSearchData();

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  const handleSearchToggle = () => {
    if (searchOpen) {
      handleSearchClose();
      return;
    }

    handleSearchOpen();
  };

  const handleRestaurantClick = (restaurant) => {
    if (!restaurant?.id) {
      return;
    }

    const city = restaurant?.address?.city || "india";

    navigate(
      `/restaurant/${encodeURIComponent(city)}/${encodeURIComponent(
        restaurant.name,
      )}/${restaurant.id}`,
    );

    handleSearchClose();
  };

  const handleFoodClick = (food) => {
    const restaurant = food?.restaurant;

    if (!restaurant?.id) {
      return;
    }

    const city = restaurant?.address?.city || "india";

    navigate(
      `/restaurant/${encodeURIComponent(city)}/${encodeURIComponent(
        restaurant.name,
      )}/${restaurant.id}`,
    );

    handleSearchClose();
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        searchOpen &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        handleSearchClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [searchOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && searchOpen) {
        handleSearchClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [searchOpen]);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredRestaurants = restaurants
    .filter((restaurant) => {
      const name = restaurant?.name?.toLowerCase() || "";
      const city = restaurant?.address?.city?.toLowerCase() || "";

      return name.includes(normalizedQuery) || city.includes(normalizedQuery);
    })
    .slice(0, 5);

  const filteredFoods = foods
    .filter((food) => {
      const name = food?.name?.toLowerCase() || "";
      const description = food?.description?.toLowerCase() || "";
      const category =
        food?.foodCategory?.name?.toLowerCase() ||
        food?.category?.name?.toLowerCase() ||
        "";

      return (
        name.includes(normalizedQuery) ||
        description.includes(normalizedQuery) ||
        category.includes(normalizedQuery)
      );
    })
    .slice(0, 5);

  const hasResults = filteredRestaurants.length > 0 || filteredFoods.length > 0;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo-wrapper" onClick={handleLogoClick}>
          <h1 className="navbar-logo">Code & Cravings</h1>
        </div>

        <div className="navbar-actions">
          <div
            ref={searchRef}
            className={`navbar-search-wrapper ${
              searchOpen ? "navbar-search-open" : ""
            }`}
          >
            {searchOpen && (
              <div className="navbar-search-input">
                <SearchIcon className="navbar-search-input-icon" />

                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search restaurants or food..."
                  autoComplete="off"
                />

                {searchQuery && (
                  <button
                    type="button"
                    className="navbar-search-clear"
                    onClick={() => {
                      setSearchQuery("");
                      inputRef.current?.focus();
                    }}
                  >
                    <CloseIcon />
                  </button>
                )}
              </div>
            )}

            <IconButton
              className="navbar-icon-button navbar-search-button"
              onClick={handleSearchToggle}
              aria-label={searchOpen ? "Close search" : "Open search"}
            >
              {searchOpen ? (
                <CloseIcon className="navbar-icon" />
              ) : (
                <SearchIcon className="navbar-icon" />
              )}
            </IconButton>

            {searchOpen && normalizedQuery && (
              <div className="navbar-search-results">
                {loadingSearch ? (
                  <div className="navbar-search-message">Searching...</div>
                ) : !hasResults ? (
                  <div className="navbar-search-message">
                    No results found for "{searchQuery}"
                  </div>
                ) : (
                  <>
                    {filteredRestaurants.length > 0 && (
                      <div className="search-result-section">
                        <p className="search-result-heading">Restaurants</p>

                        {filteredRestaurants.map((restaurant) => (
                          <button
                            type="button"
                            className="search-result-item"
                            key={`restaurant-${restaurant.id}`}
                            onClick={() => handleRestaurantClick(restaurant)}
                          >
                            <div className="search-result-image-wrapper">
                              <img
                                src={restaurant?.images?.[0]}
                                alt={restaurant?.name || "Restaurant"}
                                className="search-result-image"
                              />
                            </div>

                            <div className="search-result-content">
                              <span className="search-result-name">
                                {restaurant?.name}
                              </span>

                              <span className="search-result-type">
                                {restaurant?.address?.city || "Restaurant"}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {filteredFoods.length > 0 && (
                      <div className="search-result-section">
                        <p className="search-result-heading">Food</p>

                        {filteredFoods.map((food) => (
                          <button
                            type="button"
                            className="search-result-item"
                            key={`food-${food.Id ?? food.id}`}
                            onClick={() => handleFoodClick(food)}
                          >
                            <div className="search-result-image-wrapper">
                              <img
                                src={food?.images?.[0]}
                                alt={food?.name || "Food"}
                                className="search-result-image"
                              />
                            </div>

                            <div className="search-result-content">
                              <span className="search-result-name">
                                {food?.name}
                              </span>

                              <span className="search-result-type">
                                ₹{food?.price} · Food
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {auth.user ? (
            <Avatar onClick={handleProfileClick} className="navbar-avatar">
              {auth.user?.fullname?.charAt(0).toUpperCase()}
            </Avatar>
          ) : (
            <IconButton
              onClick={handleLoginClick}
              className="navbar-icon-button navbar-person-button"
            >
              <PersonIcon className="navbar-icon" />
            </IconButton>
          )}

          <div className="navbar-cart" onClick={handleCartClick}>
            <Badge
              badgeContent={cart.cart?.items?.length || 0}
              className="navbar-cart-badge"
            >
              <ShoppingCartIcon className="navbar-icon" />
            </Badge>
          </div>
        </div>
      </div>
      <Snackbar
        open={Boolean(loginMessage)}
        autoHideDuration={3500}
        onClose={() => setLoginMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setLoginMessage("")}
          severity="warning"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {loginMessage}
        </Alert>
      </Snackbar>
      ;
    </nav>
  );
};

export default Navbar;
