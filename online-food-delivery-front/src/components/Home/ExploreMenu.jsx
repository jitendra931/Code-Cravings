import React, { useMemo, useState } from "react";
import GlobalFoodCard from "./GlobalFoodCard";
import "./ExploreMenu.css";

const ExploreMenu = ({ menuItems = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const categories = useMemo(() => {
    const uniqueCategories = menuItems
      .map((item) => item?.foodCategory?.name || item?.category?.name)
      .filter(Boolean);

    return ["ALL", ...new Set(uniqueCategories)];
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === "ALL") {
      return menuItems;
    }

    return menuItems.filter(
      (item) =>
        (item?.foodCategory?.name || item?.category?.name) === selectedCategory,
    );
  }, [menuItems, selectedCategory]);

  return (
    <section className="explore-menu">
      <div className="explore-menu-header">
        <p className="explore-menu-subtitle">Discover Delicious Food</p>

        <h2 className="explore-menu-heading">Explore Menu</h2>

        <p className="explore-menu-description">
          Explore delicious dishes from restaurants across Code & Cravings and
          find something perfect for your cravings.
        </p>
      </div>

      <div className="explore-menu-categories">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`explore-category-button ${
              selectedCategory === category ? "explore-category-active" : ""
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category === "ALL" ? "All" : category}
          </button>
        ))}
      </div>

      <div className="explore-menu-list">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <GlobalFoodCard key={item?.Id ?? item?.id ?? index} item={item} />
          ))
        ) : (
          <div className="explore-menu-empty">
            <p>No food items available in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ExploreMenu;
