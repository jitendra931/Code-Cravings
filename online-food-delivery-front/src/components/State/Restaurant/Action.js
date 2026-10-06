import { api } from "../../config/api";
import {
  CREATE_CATEGORY_FAILURE,
  CREATE_CATEGORY_REQ,
  CREATE_CATEGORY_SUCCESS,
  CREATE_ALL_RESTAURANT_REQ,
  CREATE_ALL_RESTAURANT_FAILURE,
  CREATE_ALL_RESTAURANT_SUCCESS,
  CREATE_RESTAURANT_REQ,
  CREATE_RESTAURANT_FAILURE,
  CREATE_RESTAURANT_SUCCESS,
  CREATE_EVENTS_REQ,
  CREATE_EVENTS_FAILURE,
  CREATE_EVENTS_SUCCESS,
  GET_ALL_EVENTS_REQ,
  GET_ALL_EVENTS_FAILURE,
  GET_ALL_EVENTS_SUCCESS,
  UPDATE_RESTAURANT_REQ,
  UPDATE_RESTAURANT_FAILURE,
  UPDATE_RESTAURANT_SUCCESS,
  GET_RESTAURANT_BY_ID_FAILURE,
  GET_RESTAURANT_BY_ID_REQ,
  GET_RESTAURANT_BY_ID_SUCCESS,
  GET_RESTAURANT_BY_USER_ID_FAILURE,
  GET_RESTAURANT_BY_USER_ID_REQ,
  GET_RESTAURANT_BY_USER_ID_SUCCESS,
  GET_RESTAURANT_EVENTS_FAILURE,
  GET_RESTAURANT_EVENTS_REQ,
  GET_RESTAURANT_EVENTS_SUCCESS,
  UPDATE_RESTAURANT_STATUS_REQ,
  UPDATE_RESTAURANT_STATUS_FAILURE,
  UPDATE_RESTAURANT_STATUS_SUCCESS,
  GET_ALL_RESTAURANT_REQ,
  GET_ALL_RESTAURANT_SUCCESS,
  GET_ALL_RESTAURANT_FAILURE,
  DELETE_RESTAURANT_REQ,
  DELETE_RESTAURANT_SUCCESS,
  DELETE_RESTAURANT_FAILURE,
  DELETE_EVENTS_REQ,
  DELETE_EVENTS_SUCCESS,
  DELETE_EVENTS_FAILURE,
  GET_RESTAURANT_CATEGORY_REQ,
  GET_RESTAURANT_CATEGORY_SUCCESS,
  GET_RESTAURANT_CATEGORY_FAILURE,
} from "./ActionType";

export const getAllRestaurantAction = (token) => {
  return async (dispatch) => {
    dispatch({ type: GET_ALL_RESTAURANT_REQ });

    try {
      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {};

      const { data } = await api.get("/api/restaurants", config);

      dispatch({
        type: GET_ALL_RESTAURANT_SUCCESS,
        payload: data,
      });

      // console.log("all restaurant", data);
    } catch (error) {
      console.log("catch error", error);

      dispatch({
        type: GET_ALL_RESTAURANT_FAILURE,
        payload: error,
      });
    }
  };
};

export const getRestaurantById = (reqData) => {
  return async (dispatch) => {
    dispatch({ type: GET_RESTAURANT_BY_ID_REQ });

    try {
      const response = await api.get(
        `/api/restaurants/${reqData.restaurantId}`,
        {
          headers: {
            Authorization: `Bearer ${reqData.jwt}`,
          },
        },
      );

      dispatch({
        type: GET_RESTAURANT_BY_ID_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      // console.log("Error:", error);

      dispatch({
        type: GET_RESTAURANT_BY_ID_FAILURE,
        payload: error,
      });
    }
  };
};

export const getRestaurantByUserId = (jwt) => {
  return async (dispatch) => {
    dispatch({
      type: GET_RESTAURANT_BY_USER_ID_REQ,
    });

    try {
      const { data } = await api.get("/api/admin/restaurants/user", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      // console.log("User restaurant:", data);

      dispatch({
        type: GET_RESTAURANT_BY_USER_ID_SUCCESS,
        payload: data,
      });
    } catch (error) {
      // console.log("Get restaurant error:", error);

      if (error.response?.status === 404) {
        // User doesn't have a restaurant
        dispatch({
          type: GET_RESTAURANT_BY_USER_ID_SUCCESS,
          payload: null,
        });
      } else {
        // Actual server error
        dispatch({
          type: GET_RESTAURANT_BY_USER_ID_FAILURE,
          payload: error,
        });
      }
    }
  };
};

export const createRestaurant = (reqData) => {
  // console.log("token---------- ", reqData.token);
  return async (dispatch) => {
    dispatch({ type: CREATE_RESTAURANT_REQ });
    try {
      const { data } = await api.post(`/api/admin/restaurants`, reqData.data, {
        headers: {
          Authorization: `Bearer ${reqData.token}`,
        },
      });
      dispatch({ type: CREATE_RESTAURANT_SUCCESS, payload: data });
      // console.log("created restaurant", data);
    } catch (error) {
      // console.log("catch error", error);
      dispatch({ type: CREATE_RESTAURANT_FAILURE, payload: error });
    }
  };
};

export const updateRestaurant = ({ restaurantId, restaurantData, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_RESTAURANT_REQ });
    try {
      const res = await api.put(
        `/api/admin/restaurant/${restaurantId}`,
        restaurantData,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );
      // console.log("restaurant updates successfully");
      dispatch({ type: UPDATE_RESTAURANT_SUCCESS, payload: res.data });
    } catch (error) {
      // console.log("restaurant update error", error);
      dispatch({ type: UPDATE_RESTAURANT_FAILURE, payload: error });
    }
  };
};

export const deleteRestaurant = ({ restaurantId, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: DELETE_RESTAURANT_REQ });

    try {
      const res = await api.delete(`/api/admin/restaurant/${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      // console.log("Restaurant deleted successfully");

      dispatch({
        type: DELETE_RESTAURANT_SUCCESS,
        payload: restaurantId,
      });
    } catch (error) {
      // console.log("Error:", error);

      dispatch({
        type: DELETE_RESTAURANT_FAILURE,
        payload: error,
      });
    }
  };
};

export const updateRestaurantStatus = ({ restaurantId, jwt, open }) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_RESTAURANT_STATUS_REQ });

    try {
      const res = await api.put(
        `/api/admin/restaurants/${restaurantId}/status?open=${open}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );

      dispatch({
        type: UPDATE_RESTAURANT_STATUS_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      // console.log("Restaurant status update error:", error);

      dispatch({
        type: UPDATE_RESTAURANT_STATUS_FAILURE,
        payload: error,
      });
    }
  };
};

// CREATE EVENT
export const createEventAction = ({ data, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: CREATE_EVENTS_REQ });

    try {
      const res = await api.post("/api/admin/events", data, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      // console.log("Event created successfully", res.data);

      dispatch({
        type: CREATE_EVENTS_SUCCESS,
        payload: res.data,
      });

      return res.data;
    } catch (error) {
      // console.log("Event create error", error);

      dispatch({
        type: CREATE_EVENTS_FAILURE,
        payload: error,
      });

      throw error;
    }
  };
};

// GET ALL EVENTS
// This is for customer/public event listing
export const getAllEvents = ({ jwt }) => {
  return async (dispatch) => {
    dispatch({ type: GET_ALL_EVENTS_REQ });

    try {
      const res = await api.get("/api/events", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      // console.log("Get all events successfully", res.data);

      dispatch({
        type: GET_ALL_EVENTS_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      // console.log("Get all events error", error);

      dispatch({
        type: GET_ALL_EVENTS_FAILURE,
        payload: error,
      });
    }
  };
};

// GET EVENTS OF LOGGED-IN RESTAURANT
export const getRestaurantsEvents = ({ jwt }) => {
  return async (dispatch) => {
    dispatch({ type: GET_RESTAURANT_EVENTS_REQ });

    try {
      const res = await api.get("/api/admin/events", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      // console.log("Get restaurant events", res.data);

      dispatch({
        type: GET_RESTAURANT_EVENTS_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      // console.log("Get restaurant events failed", error);

      dispatch({
        type: GET_RESTAURANT_EVENTS_FAILURE,
        payload: error,
      });
    }
  };
};

// DELETE EVENT
export const deleteEventAction = ({ eventId, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: DELETE_EVENTS_REQ });

    try {
      const res = await api.delete(`/api/admin/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      // console.log("Event deleted successfully", eventId);

      dispatch({
        type: DELETE_EVENTS_SUCCESS,
        payload: eventId,
      });

      return res.data;
    } catch (error) {
      // console.log("Event delete failed", error);

      dispatch({
        type: DELETE_EVENTS_FAILURE,
        payload: error,
      });

      throw error;
    }
  };
};

export const createCategoryAction =
  ({ reqData, jwt }) =>
  async (dispatch) => {
    dispatch({
      type: CREATE_CATEGORY_REQ,
    });

    try {
      const response = await api.post("/api/admin/category", reqData, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      dispatch({
        type: CREATE_CATEGORY_SUCCESS,
        payload: response.data,
      });

      return response.data;
    } catch (error) {
      // console.log("Create category error:", error);

      dispatch({
        type: CREATE_CATEGORY_FAILURE,
        payload: error.response?.data?.message || error.message,
      });

      throw error;
    }
  };

export const getRestaurantCategory = ({ jwt, restaurantId }) => {
  return async (dispatch) => {
    dispatch({ type: GET_RESTAURANT_CATEGORY_REQ });

    try {
      const res = await api.get(`/api/category/restaurant/${restaurantId}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      // console.log("get restaurant category", res.data);
      dispatch({ type: GET_RESTAURANT_CATEGORY_SUCCESS, payload: res.data });
    } catch (error) {
      // console.log("get restaurant category failes ");
      dispatch({ type: GET_RESTAURANT_CATEGORY_FAILURE, payload: error });
    }
  };
};
