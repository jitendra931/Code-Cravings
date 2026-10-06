import { api } from "../../config/api";

import {
  DELETE_MENU_ITEM_FAILURE,
  DELETE_MENU_ITEM_REQ,
  DELETE_MENU_ITEM_SUCCESS,
  SEARCH_MENU_ITEM_REQ,
  SEARCH_MENU_ITEM_FAILURE,
  SEARCH_MENU_ITEM_SUCCESS,
  UPDATE_MENU_ITEM_AVAILABILITY_REQ,
  UPDATE_MENU_ITEM_AVAILABILITY_FAILURE,
  UPDATE_MENU_ITEM_AVAILABILITY_SUCCESS,
  CREATE_MENU_ITEM_REQ,
  CREATE_MENU_ITEM_SUCCESS,
  CREATE_MENU_ITEM_FAILURE,
  GET_MENU_ITEMS_BY_RESTAURANT_ID_REQ,
  GET_MENU_ITEMS_BY_RESTAURANT_ID_SUCCESS,
  GET_MENU_ITEMS_BY_RESTAURANT_ID_FAILURE,
  GET_GLOBAL_FOOD_REQ,
  GET_GLOBAL_FOOD_FAILURE,
  GET_GLOBAL_FOOD_SUCCESS,
} from "./ActionTypes";

export const createMenuItem = ({ menu, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: CREATE_MENU_ITEM_REQ });

    try {
      const { data } = await api.post(`/api/admin/food`, menu, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      // console.log("create menu ", data);

      dispatch({
        type: CREATE_MENU_ITEM_SUCCESS,
        payload: data,
      });

      return data;
    } catch (error) {
      // console.log("STATUS:", error.response?.status);
      // console.log("BACKEND ERROR:", error.response?.data);
      // console.log("ERROR MESSAGE:", error.message);
      // console.log("FULL ERROR:", error);

      dispatch({
        type: CREATE_MENU_ITEM_FAILURE,
        payload: error,
      });

      throw error;
    }
  };
};

export const getMenuItemsByRestaurantId = (reqData) => {
  return async (dispatch) => {
    dispatch({ type: GET_MENU_ITEMS_BY_RESTAURANT_ID_REQ });

    try {
      const params = new URLSearchParams({
        vegetarian: reqData.vegetarian,
        nonveg: reqData.nonveg,
        seasonal: reqData.seasonal,
        food_category: reqData.foodCategory,
      });

      const { data } = await api.get(
        `/api/food/restaurant/${reqData.restaurantId}?${params}`,
        {
          headers: {
            Authorization: `Bearer ${reqData.jwt}`,
          },
        },
      );

      // console.log("menu item by restaurants", data);
      dispatch({
        type: GET_MENU_ITEMS_BY_RESTAURANT_ID_SUCCESS,
        payload: data,
      });
    } catch (error) {
      // console.log("get menu item by restaurant id failed");
      dispatch({
        type: GET_MENU_ITEMS_BY_RESTAURANT_ID_FAILURE,
        payload: error,
      });
    }
  };
};

export const searchMenuItem = ({ keyword, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: SEARCH_MENU_ITEM_REQ });
    try {
      const { data } = await api.get(`/api/food/search?keyword=${keyword}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      // console.log("seached item ", data);
      dispatch({ type: SEARCH_MENU_ITEM_SUCCESS, payload: data });
    } catch (error) {
      // console.log("failed to search");
      dispatch({ type: SEARCH_MENU_ITEM_FAILURE, payload: error });
    }
  };
};

// export const getAllIngredientsOfMenuItem = ({reqData}) => {
//     return async (dispatch) => {
//         dispatch()
//         try{

//         }
//     }
// }

export const updateMenuItemAvailability = ({ foodId, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_MENU_ITEM_AVAILABILITY_REQ });
    try {
      const { data } = await api.put(
        `/api/admin/food/${foodId}/availability`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );
      // console.log("update menuitems availability", data);
      dispatch({ type: UPDATE_MENU_ITEM_AVAILABILITY_SUCCESS, payload: data });
    } catch (error) {
      // console.log("failed update MenuItem Availability");
      dispatch({ type: UPDATE_MENU_ITEM_AVAILABILITY_FAILURE, payload: error });
    }
  };
};

export const deleteFoodAction = ({ foodId, jwt }) => {
  return async (dispatch) => {
    dispatch({
      type: DELETE_MENU_ITEM_REQ,
    });

    try {
      const { data } = await api.delete(`/api/admin/food/${foodId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      // console.log("delete food", data);

      dispatch({
        type: DELETE_MENU_ITEM_SUCCESS,
        payload: foodId,
      });

      return data;
    } catch (error) {
      // console.log("delete food error", error);

      dispatch({
        type: DELETE_MENU_ITEM_FAILURE,
        payload: error,
      });

      // IMPORTANT: send the error back to MenuTable.jsx
      throw error;
    }
  };
};

export const getGlobalFood = () => {
  return async (dispatch) => {
    dispatch({
      type: GET_GLOBAL_FOOD_REQ,
    });

    try {
      const { data } = await api.get("/api/food");

      dispatch({
        type: GET_GLOBAL_FOOD_SUCCESS,
        payload: Array.isArray(data) ? data : [],
      });
    } catch (error) {
      dispatch({
        type: GET_GLOBAL_FOOD_FAILURE,
        payload: error,
      });
    }
  };
};
