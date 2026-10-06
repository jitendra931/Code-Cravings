import { api } from "../../config/api";
import {
  CREATE_ORDER_FAILURE,
  CREATE_ORDER_REQ,
  CREATE_ORDER_SUCCESS,
  GET_USERS_NOTIFICATION_FAILURE,
  GET_USERS_NOTIFICATION_REQ,
  GET_USERS_ORDERS_FAILURE,
  GET_USERS_ORDERS_REQ,
  GET_USERS_ORDERS_SUCCESS,
} from "./ActionTypes";

export const createOrder = (reqData) => {
  return async (dispatch) => {
    dispatch({ type: CREATE_ORDER_REQ });
    try {
      const { data } = await api.post(`/api/order`, reqData.order, {
        headers: {
          Authorization: `Bearer ${reqData.jwt}`,
        },
      });
      if (data.payment_url) {
        window.location.href = data.payment_url;
      }
      // console.log("order success", data);
      dispatch({ type: CREATE_ORDER_SUCCESS, payload: data });
    } catch (error) {
      // console.log("order failed");
      dispatch({ type: CREATE_ORDER_FAILURE, payload: error });
    }
  };
};

export const updatePayment = ({ orderId, jwt }) => {
  return async (dispatch) => {
    try {
      const { data } = await api.put(
        `/api/payment/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );

      dispatch(findCart(jwt));

      dispatch(getUsersOrders(jwt));

      // console.log("Payment Updated", data);
    } catch (error) {
      console.log(error);
    }
  };
};

export const getUsersOrders = (jwt) => {
  return async (dispatch) => {
    dispatch({
      type: GET_USERS_ORDERS_REQ,
    });

    try {
      const { data } = await api.get(`/api/order/user`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const orders = Array.isArray(data)
        ? data
        : Array.isArray(data?.orders)
          ? data.orders
          : [];

      // console.log("users order count:", orders.length);
      // console.log("users orders:", orders);

      dispatch({
        type: GET_USERS_ORDERS_SUCCESS,
        payload: orders,
      });
    } catch (error) {
      // console.log("users orders failed", error);

      dispatch({
        type: GET_USERS_ORDERS_FAILURE,
        payload: error,
      });
    }
  };
};

// export const getUsersNotificationAction = () => {
//   return async (dispatch) => {
//     dispatch({ type: GET_USERS_NOTIFICATION_REQ });
//     try {
//       const { data } = await api.get(`/api/notifications`);
//       console.log("get user notification", data);
//       dispatch({ type: GET_USERS_ORDERS_SUCCESS, payload: data });
//     } catch (error) {
//       console.log("error", error);
//       dispatch({ type: GET_USERS_NOTIFICATION_FAILURE, payload: error });
//     }
//   };
// };
