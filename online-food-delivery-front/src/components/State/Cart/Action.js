import { api } from "../../config/api";

import {
  ADD_ITEM_TO_CART_FAILURE,
  ADD_ITEM_TO_CART_REQ,
  ADD_ITEM_TO_CART_SUCCESS,
  CLEAR_CART_FAILURE,
  CLEAR_CART_REQ,
  CLEAR_CART_SUCCESS,
  FIND_CART_FAILURE,
  FIND_CART_REQ,
  FIND_CART_SUCCESS,
  GET_ALL_CART_ITEMS_FAILURE,
  GET_ALL_CART_ITEMS_REQ,
  GET_ALL_CART_ITEMS_SUCCESS,
  REMOVE_CARTITEM_FAILURE,
  REMOVE_CARTITEM_REQ,
  REMOVE_CARTITEM_SUCCESS,
  UPDATE_CARTIEM_FAILURE,
  UPDATE_CARTIEM_REQ,
  UPDATE_CARTIEM_SUCCESS,
} from "./ActionTypes";

export const findCart = (token) => {
  return async (dispatch) => {
    dispatch({ type: FIND_CART_REQ });
    try {
      const res = await api.get(`/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("find cart successfully", res.data);
      dispatch({ type: FIND_CART_SUCCESS, payload: res.data });
    } catch (error) {
      // console.log("failed to find cart");
      dispatch({ type: FIND_CART_FAILURE, payload: error });
    }
  };
};

export const getAllCartItem = (reqData) => {
  return async (dispatch) => {
    dispatch({ type: GET_ALL_CART_ITEMS_REQ });
    try {
      const res = await api.get(`/api/carts/${reqData.cartId}/items`, {
        headers: {
          Authorization: `Bearer ${reqData.token}`,
        },
      });
      // console.log("get all cart items successfully");
      dispatch({ type: GET_ALL_CART_ITEMS_SUCCESS, payload: res.data });
    } catch (error) {
      // console.log("failed to get all acarts", error);

      dispatch({ type: GET_ALL_CART_ITEMS_FAILURE, payload: error });
    }
  };
};

export const addItemToCart = (reqData) => {
  return async (dispatch) => {
    dispatch({ type: ADD_ITEM_TO_CART_REQ });
    try {
      const res = await api.post(`/api/cart/add`, reqData.cartItem, {
        headers: {
          Authorization: `Bearer ${reqData.token}`,
        },
      });
      // console.log("added to cart successfully");
      dispatch({ type: ADD_ITEM_TO_CART_SUCCESS, payload: res.data });
    } catch (error) {
      // console.log("failed to add item", error);
      dispatch({ type: ADD_ITEM_TO_CART_FAILURE });
    }
  };
};

export const updateCartItem = ({ data, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_CARTIEM_REQ });

    try {
      const res = await api.put("/api/cart-item/update", data, {
        params: {
          cartItemId: data.cartItemId,
          quantity: data.quantity,
        },
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      // console.log("updated", res.data);

      dispatch({
        type: UPDATE_CARTIEM_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      // console.log(error);

      dispatch({
        type: UPDATE_CARTIEM_FAILURE,
        payload: error.message,
      });
    }
  };
};

export const removeCartItem = ({ cartItemId, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: REMOVE_CARTITEM_REQ });
    try {
      const res = await api.delete(`/api/cart-item/${cartItemId}/remove`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      // console.log("successfully to remove cart", res.data);
      dispatch({ type: REMOVE_CARTITEM_SUCCESS, payload: res.data });
    } catch (error) {
      // console.log("failed to remove cart");
      dispatch({ type: REMOVE_CARTITEM_FAILURE, payload: error });
    }
  };
};

export const clearCartAction = () => {
  return async (dispatch) => {
    dispatch({ type: CLEAR_CART_REQ });
    try {
      const res = await api.put(
        `/api/cart/clear`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        },
      );
      dispatch({ type: CLEAR_CART_SUCCESS, payload: res.data });
    } catch (error) {
      // console.log("clear cart error", error);
      dispatch({ type: CLEAR_CART_FAILURE, payload: error });
    }
  };
};
