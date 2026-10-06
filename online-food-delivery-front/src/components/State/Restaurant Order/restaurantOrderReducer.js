import {
  UPDATE_ORDER_STATUS_REQ,
  UPDATE_ORDER_STATUS_FAILURE,
  GET_RESTAURANTS_ORDER_REQ,
  GET_RESTAURANTS_ORDER_SUCCESS,
  UPDATE_ORDER_STATUS_SUCCESS,
  GET_RESTAURANTS_ORDER_FAILURE,
} from "./ActionTypes";

const initialState = {
  loading: false,
  error: null,
  orders: [],
};

const restaurantOrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_RESTAURANTS_ORDER_REQ:
    case UPDATE_ORDER_STATUS_REQ:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_RESTAURANTS_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: action.payload,
      };

    case UPDATE_ORDER_STATUS_SUCCESS: {
      const updatedOrders = state.orders.map((order) =>
        (order.Id ?? order.id) === (action.payload.Id ?? action.payload.id)
          ? action.payload
          : order,
      );

      return {
        ...state,
        loading: false,
        orders: updatedOrders,
      };
    }

    case GET_RESTAURANTS_ORDER_FAILURE:
    case UPDATE_ORDER_STATUS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default restaurantOrderReducer;
