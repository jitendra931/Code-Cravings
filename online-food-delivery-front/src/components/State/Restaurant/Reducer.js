import * as actionTypes from "./ActionType";

const initialState = {
  restaurants: [],
  usersRestaurant: null,
  restaurant: null,

  loading: false,

  restaurantLoading: false,
  categoryLoading: false,

  error: null,

  events: [],
  restaurantsEvents: [],
  categories: [],
};

const restaurantReducer = (state = initialState, action) => {
  switch (action.type) {
    // =====================================================
    // GET RESTAURANT BY USER ID
    // =====================================================

    case actionTypes.GET_RESTAURANT_BY_USER_ID_REQ:
      return {
        ...state,
        restaurantLoading: true,
        error: null,
      };

    case actionTypes.GET_RESTAURANT_BY_USER_ID_SUCCESS:
      return {
        ...state,
        restaurantLoading: false,
        usersRestaurant: action.payload,
      };

    case actionTypes.GET_RESTAURANT_BY_USER_ID_FAILURE:
      return {
        ...state,
        restaurantLoading: false,
        error: action.payload,
      };

    // =====================================================
    // CATEGORY
    // =====================================================

    case actionTypes.CREATE_CATEGORY_REQ:
    case actionTypes.GET_RESTAURANT_CATEGORY_REQ:
      return {
        ...state,
        categoryLoading: true,
        error: null,
      };

    case actionTypes.CREATE_CATEGORY_SUCCESS:
      return {
        ...state,
        categoryLoading: false,
        categories: [...state.categories, action.payload],
      };

    case actionTypes.GET_RESTAURANT_CATEGORY_SUCCESS:
      return {
        ...state,
        categoryLoading: false,
        categories: Array.isArray(action.payload) ? action.payload : [],
      };

    case actionTypes.CREATE_CATEGORY_FAILURE:
    case actionTypes.GET_RESTAURANT_CATEGORY_FAILURE:
      return {
        ...state,
        categoryLoading: false,
        error: action.payload,
      };

    // =====================================================
    // RESTAURANT REQUESTS
    // =====================================================

    case actionTypes.CREATE_RESTAURANT_REQ:
    case actionTypes.GET_ALL_RESTAURANT_REQ:
    case actionTypes.DELETE_RESTAURANT_REQ:
    case actionTypes.UPDATE_RESTAURANT_REQ:
    case actionTypes.UPDATE_RESTAURANT_STATUS_REQ:
    case actionTypes.GET_RESTAURANT_BY_ID_REQ:
      return {
        ...state,
        loading: true,
        error: null,
      };

    // =====================================================
    // RESTAURANT SUCCESS
    // =====================================================

    case actionTypes.CREATE_RESTAURANT_SUCCESS:
      return {
        ...state,
        loading: false,
        usersRestaurant: action.payload,
      };

    case actionTypes.GET_ALL_RESTAURANT_SUCCESS:
      return {
        ...state,
        loading: false,
        restaurants: Array.isArray(action.payload) ? action.payload : [],
      };

    case actionTypes.GET_RESTAURANT_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        restaurant: action.payload,
      };

    case actionTypes.UPDATE_RESTAURANT_STATUS_SUCCESS:
    case actionTypes.UPDATE_RESTAURANT_SUCCESS:
      return {
        ...state,
        loading: false,
        usersRestaurant: action.payload,
      };

    // =====================================================
    // DELETE RESTAURANT
    // =====================================================

    case actionTypes.DELETE_RESTAURANT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,

        restaurants: state.restaurants.filter(
          (item) => item.id !== action.payload,
        ),

        usersRestaurant: null,
      };

    // =====================================================
    // EVENTS - REQUEST
    // =====================================================

    case actionTypes.CREATE_EVENTS_REQ:
    case actionTypes.GET_ALL_EVENTS_REQ:
    case actionTypes.GET_RESTAURANT_EVENTS_REQ:
    case actionTypes.DELETE_EVENTS_REQ:
      return {
        ...state,
        loading: true,
        error: null,
      };

    // =====================================================
    // CREATE EVENT
    // =====================================================

    case actionTypes.CREATE_EVENTS_SUCCESS: {
      const newEvent = action.payload;

      return {
        ...state,
        loading: false,

        events: [...state.events, newEvent],

        restaurantsEvents: [...state.restaurantsEvents, newEvent],
      };
    }

    // =====================================================
    // GET ALL EVENTS
    // =====================================================

    case actionTypes.GET_ALL_EVENTS_SUCCESS:
      return {
        ...state,
        loading: false,

        events: Array.isArray(action.payload) ? action.payload : [],
      };

    // =====================================================
    // GET RESTAURANT EVENTS
    // =====================================================

    case actionTypes.GET_RESTAURANT_EVENTS_SUCCESS:
      return {
        ...state,
        loading: false,

        restaurantsEvents: Array.isArray(action.payload) ? action.payload : [],
      };

    // =====================================================
    // DELETE EVENT
    // =====================================================

    case actionTypes.DELETE_EVENTS_SUCCESS: {
      const deletedEventId = action.payload;

      return {
        ...state,
        loading: false,

        events: state.events.filter((item) => {
          const eventId = item.Id ?? item.id;
          return eventId !== deletedEventId;
        }),

        restaurantsEvents: state.restaurantsEvents.filter((item) => {
          const eventId = item.Id ?? item.id;
          return eventId !== deletedEventId;
        }),
      };
    }

    // =====================================================
    // ALL FAILURES
    // =====================================================

    case actionTypes.CREATE_RESTAURANT_FAILURE:
    case actionTypes.GET_ALL_RESTAURANT_FAILURE:
    case actionTypes.DELETE_RESTAURANT_FAILURE:
    case actionTypes.UPDATE_RESTAURANT_FAILURE:
    case actionTypes.GET_RESTAURANT_BY_ID_FAILURE:

    case actionTypes.CREATE_EVENTS_FAILURE:
    case actionTypes.GET_ALL_EVENTS_FAILURE:
    case actionTypes.GET_RESTAURANT_EVENTS_FAILURE:
    case actionTypes.DELETE_EVENTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // =====================================================
    // DEFAULT
    // =====================================================

    default:
      return state;
  }
};

export default restaurantReducer;
