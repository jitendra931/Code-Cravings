import axios from "axios";
import {
  UPDATE_ORDER_STATUS_REQ,
  GET_RESTAURANTS_ORDER_REQ,
  UPDATE_ORDER_STATUS_SUCCESS,
  UPDATE_ORDER_STATUS_FAILURE,
  GET_RESTAURANTS_ORDER_SUCCESS,
  GET_RESTAURANTS_ORDER_FAILURE,
} from "./ActionTypes";

import { api } from "../../config/api";

export const updateOrderStatus = ({
  orderId,
  orderStatus,
  jwt,
  restaurantId,
  currentFilter,
}) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_ORDER_STATUS_REQ });

    try {
      const { data } = await api.put(
        `/api/admin/order/${orderId}/${orderStatus}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );

      // console.log("updated order:", data);

      dispatch({
        type: UPDATE_ORDER_STATUS_SUCCESS,
        payload: data,
      });

      // Refresh orders after status update
      dispatch(
        fetchRestaurantsOrder({
          restaurantId,
          orderStatus: currentFilter === "ALL" ? undefined : currentFilter,
          jwt,
        }),
      );
    } catch (error) {
      // console.log("update order status error:", error);

      dispatch({
        type: UPDATE_ORDER_STATUS_FAILURE,
        payload: error,
      });
    }
  };
};

export const fetchRestaurantsOrder = ({ restaurantId, orderStatus, jwt }) => {
  return async (dispatch) => {
    dispatch({
      type: GET_RESTAURANTS_ORDER_REQ,
    });

    try {
      const { data } = await api.get(
        `/api/admin/order/restaurant/${restaurantId}`,
        {
          params: {
            order_status: orderStatus,
          },
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );

      const orders = Array.isArray(data) ? data : [];

      // console.log("restaurants order count:", orders.length);

      // orders.forEach((order) => {
      //   console.log(
      //     "Order:",
      //     order.Id ?? order.id,
      //     "Items:",
      //     order.items?.length ?? 0,
      //     order,
      //   );
      // });

      dispatch({
        type: GET_RESTAURANTS_ORDER_SUCCESS,
        payload: orders,
      });
    } catch (error) {
      // console.log("fetch restaurant orders error:", error);

      dispatch({
        type: GET_RESTAURANTS_ORDER_FAILURE,
        payload: error,
      });
    }
  };
};
