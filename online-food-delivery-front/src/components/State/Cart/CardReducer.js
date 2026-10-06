import { LOGOUT } from "../Authentication/ActionType";
import * as actionTypes from "./ActionTypes";

const initialState = {
  cart: null,
  cartItems: [],
  loading: false,
  error: null,
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FIND_CART_REQ:
    case actionTypes.GET_ALL_CART_ITEMS_REQ:
    case actionTypes.UPDATE_CARTIEM_REQ:
    case actionTypes.REMOVE_CARTITEM_REQ:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case actionTypes.FIND_CART_SUCCESS:
    case actionTypes.CLEAR_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        cart: action.payload,
        cartItems: action.payload.items,
      };
    case actionTypes.ADD_ITEM_TO_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        cart: {
          ...state.cart,
          items: [...state.cart.items, action.payload],
        },
        cartItems: [...state.cartItems, action.payload],
      };
    case actionTypes.UPDATE_CARTIEM_SUCCESS: {
      const updatedItems = state.cart.items.map((item) =>
        item.Id === action.payload.Id ? action.payload : item,
      );

      const updatedTotal = updatedItems.reduce(
        (sum, item) => sum + item.totalPrice,
        0,
      );

      return {
        ...state,
        loading: false,

        cart: {
          ...state.cart,
          items: updatedItems,
          total: updatedTotal,
        },

        cartItems: updatedItems,
      };
    }
    case actionTypes.REMOVE_CARTITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        cart: action.payload,
        cartItems: state.cartItems.filter((item) => item.id !== action.payload),
      };
    case actionTypes.FIND_CART_FAILURE:
    case actionTypes.UPDATE_CARTIEM_FAILURE:
    case actionTypes.REMOVE_CARTITEM_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case LOGOUT:
      localStorage.removeItem("jwt");
      return { ...state, cartItems: [], cart: null, success: "logout success" };
    default:
      return state;
  }
};

export default cartReducer;
