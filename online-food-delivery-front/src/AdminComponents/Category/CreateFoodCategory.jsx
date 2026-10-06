import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import { createCategoryAction } from "../../components/State/Restaurant/Action";

const CreateFoodCategory = ({ onSuccess }) => {
  const dispatch = useDispatch();

  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = categoryName.trim();

    if (!name) return;

    const data = {
      name,
    };

    try {
      setLoading(true);

      await dispatch(
        createCategoryAction({
          reqData: data,
          jwt: localStorage.getItem("jwt"),
        }),
      );

      setCategoryName("");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to create category:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5">
      <div className="max-w-xl mx-auto">
        <h1 className="text-gray-400 text-center text-xl pb-10">
          Create Food Category
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <TextField
            fullWidth
            id="categoryName"
            name="categoryName"
            label="Category"
            variant="outlined"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            disabled={loading}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading || !categoryName.trim()}
          >
            {loading ? "Creating..." : "Create Category"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateFoodCategory;
