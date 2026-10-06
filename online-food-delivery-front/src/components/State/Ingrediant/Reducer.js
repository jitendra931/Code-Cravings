import {
  CREATE_INGREDIENT_CATEGORY_SUCCESS,
  CREATE_INGREDIENT_SUCCESS,
  GET_INGREDIENTS,
  GET_INGREDIENTS_CATEGORY_SUCCESS,
  UPDATE_STOCK,
  DELETE_INGREDIENT_CATEGORY_REQ,
  DELETE_INGREDIENT_CATEGORY_FAILURE,
  DELETE_INGREDIENT_CATEGORY_SUCCESS,
} from "./ActionTypes";

const initialState = {
  ingrediants: [],
  update: null,
  category: [],
  loading: false,
  error: null,
};

export const ingredientReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_INGREDIENTS:
      return {
        ...state,
        ingrediants: action.payload,
      };

    case GET_INGREDIENTS_CATEGORY_SUCCESS:
      return {
        ...state,
        category: action.payload,
      };

    case CREATE_INGREDIENT_CATEGORY_SUCCESS:
      return {
        ...state,
        category: [...state.category, action.payload],
      };

    case CREATE_INGREDIENT_SUCCESS:
      return {
        ...state,
        ingrediants: [...state.ingrediants, action.payload],
      };

    case UPDATE_STOCK:
      return {
        ...state,
        update: action.payload,
        ingrediants: state.ingrediants.map((item) =>
          item.Id === action.payload.Id ? action.payload : item,
        ),
      };

    case DELETE_INGREDIENT_CATEGORY_REQ:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case DELETE_INGREDIENT_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        category: state.category.filter((item) => item.Id !== action.payload),
      };

    case DELETE_INGREDIENT_CATEGORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
