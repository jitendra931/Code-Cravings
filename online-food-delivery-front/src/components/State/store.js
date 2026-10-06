import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { authReducer } from "./Authentication/Reducer";
import { thunk } from "redux-thunk";
import restaurantReducer from "./Restaurant/Reducer";
import menuItemReducer from "./Menu/Reducer";
import cartReducer from "./Cart/CardReducer";
import { orderReducer } from "./order/OrderReducer";
import restaurantOrderReducer from "./Restaurant Order/restaurantOrderReducer";
import { ingredientReducer } from "./Ingrediant/Reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  restaurant: restaurantReducer,
  menu: menuItemReducer,
  cart: cartReducer,
  order: orderReducer,
  restaurantOrder: restaurantOrderReducer,
  ingredient: ingredientReducer,
});

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));
