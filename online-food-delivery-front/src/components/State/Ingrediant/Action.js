import {
  CREATE_INGREDIENT_CATEGORY_SUCCESS,
  CREATE_INGREDIENT_REQ,
  CREATE_INGREDIENT_SUCCESS,
  GET_INGREDIENTS,
  GET_INGREDIENTS_CATEGORY_SUCCESS,
  UPDATE_STOCK,
  DELETE_INGREDIENT_CATEGORY_REQ,
  DELETE_INGREDIENT_CATEGORY_FAILURE,
  DELETE_INGREDIENT_CATEGORY_SUCCESS,
} from "./ActionTypes";

import { api } from "../../config/api";

export const getIngredientsOfRestaurant = ({ id, jwt }) => {
  return async (dispatch) => {
    try {
      const res = await api.get(`/api/admin/ingrediants/restaurant/${id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      // console.log("get all ingredients", res.data);

      dispatch({
        type: GET_INGREDIENTS,
        payload: res.data,
      });
    } catch (error) {
      // console.log("error", error);
    }
  };
};

export const createIngredient = ({ data, jwt }) => {
  return async (dispatch) => {
    dispatch({
      type: CREATE_INGREDIENT_REQ,
    });

    try {
      const res = await api.post(`/api/admin/ingrediants`, data, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      // console.log("create ingredients", res.data);

      dispatch({
        type: CREATE_INGREDIENT_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      // console.log("error", error);
    }
  };
};

export const createIngredientCategory = ({ data, jwt }) => {
  return async (dispatch) => {
    try {
      const res = await api.post(`/api/admin/ingrediants/category`, data, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      // console.log("create ingredients category", res.data);

      dispatch({
        type: CREATE_INGREDIENT_CATEGORY_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      // console.log("catch error", error);
    }
  };
};

export const getIngredientCategory = ({ id, jwt }) => {
  return async (dispatch) => {
    try {
      const res = await api.get(
        `/api/admin/ingrediants/restaurant/${id}/category`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );

      // console.log("GET INGREDIENT CATEGORIES:", res.data);

      dispatch({
        type: GET_INGREDIENTS_CATEGORY_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      // console.log("GET INGREDIENT CATEGORY ERROR:", error);
    }
  };
};

export const updateStockOfIngredient = ({ id, jwt }) => {
  return async (dispatch) => {
    try {
      const { data } = await api.put(
        `/api/admin/ingrediants/${id}/stoke`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );

      // console.log("update stoke of ingredients:", data);

      dispatch({
        type: UPDATE_STOCK,
        payload: data,
      });
    } catch (error) {
      // console.log("error", error);
    }
  };
};

export const deleteIngredientCategory = ({ id, jwt }) => {
  return async (dispatch) => {
    dispatch({
      type: DELETE_INGREDIENT_CATEGORY_REQ,
    });

    try {
      await api.delete(`/api/admin/ingrediants/category/${id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      dispatch({
        type: DELETE_INGREDIENT_CATEGORY_SUCCESS,
        payload: id,
      });
    } catch (error) {
      // console.log("delete ingredient category error", error);

      dispatch({
        type: DELETE_INGREDIENT_CATEGORY_FAILURE,
        payload: error,
      });

      throw error;
    }
  };
};
