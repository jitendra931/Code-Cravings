import {
  GET_USERS_ORDERS_FAILURE,
  GET_USERS_ORDERS_REQ,
  GET_USERS_ORDERS_SUCCESS,
} from "./ActionTypes";

const initialState = {
  loading: false,
  orders: [],
  error: null,
};

export const orderReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_USERS_ORDERS_REQ:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_USERS_ORDERS_SUCCESS: {
      const orders = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.orders)
          ? payload.orders
          : [];

      return {
        ...state,
        loading: false,
        error: null,
        orders,
      };
    }

    case GET_USERS_ORDERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload,
        orders: [],
      };

    default:
      return state;
  }
};
