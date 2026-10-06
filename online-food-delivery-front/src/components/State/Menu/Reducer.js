import * as actionTypes from "./ActionTypes";

const initialState = {
  menuItems: [],
  loading: false,
  error: null,
  search: [],
  message: null,
};

const menuItemReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CREATE_MENU_ITEM_REQ:
    case actionTypes.GET_MENU_ITEMS_BY_RESTAURANT_ID_REQ:
    case actionTypes.DELETE_MENU_ITEM_REQ:
    case actionTypes.SEARCH_MENU_ITEM_REQ:
    case actionTypes.UPDATE_MENU_ITEM_AVAILABILITY_REQ:
    case actionTypes.GET_GLOBAL_FOOD_REQ:
      return {
        ...state,
        loading: true,
        error: null,
        message: null,
      };

    case actionTypes.CREATE_MENU_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        menuItems: [...state.menuItems, action.payload],
        message: "Food Created Successfully",
      };

    case actionTypes.GET_MENU_ITEMS_BY_RESTAURANT_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        menuItems: action.payload,
      };

    case actionTypes.GET_GLOBAL_FOOD_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        menuItems: Array.isArray(action.payload) ? action.payload : [],
      };

    case actionTypes.DELETE_MENU_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        menuItems: state.menuItems.filter(
          (menuItem) => (menuItem.Id ?? menuItem.id) !== action.payload,
        ),
      };

    case actionTypes.UPDATE_MENU_ITEM_AVAILABILITY_SUCCESS: {
      const updatedFood = action.payload;
      const updatedFoodId = updatedFood.Id ?? updatedFood.id;

      return {
        ...state,
        loading: false,
        menuItems: state.menuItems.map((menuItem) => {
          const menuItemId = menuItem.Id ?? menuItem.id;

          return menuItemId === updatedFoodId ? updatedFood : menuItem;
        }),
      };
    }

    case actionTypes.SEARCH_MENU_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        search: action.payload,
      };

    case actionTypes.CREATE_MENU_ITEM_FAILURE:
    case actionTypes.DELETE_MENU_ITEM_FAILURE:
    case actionTypes.GET_MENU_ITEMS_BY_RESTAURANT_ID_FAILURE:
    case actionTypes.SEARCH_MENU_ITEM_FAILURE:
    case actionTypes.UPDATE_MENU_ITEM_AVAILABILITY_FAILURE:
    case actionTypes.GET_GLOBAL_FOOD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        message: null,
      };

    default:
      return state;
  }
};

export default menuItemReducer;
