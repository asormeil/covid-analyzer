import {
  FETCH_MORALITY_DATA_SUCCESS,
  SET_CURRENT_PAGE,
  SET_TOTAL_PAGES,
  SET_LOADING,
  FETCH_ALL_COUNTRIES,
} from "../actions";

const initialState = {
  data: [],
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  countries: [],
};

export default function moralityReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };
    case SET_TOTAL_PAGES:
      return {
        ...state,
        totalPages: action.payload,
      };
    case SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case FETCH_ALL_COUNTRIES:
      return state;
    case FETCH_MORALITY_DATA_SUCCESS:
      return {
        ...state,
        data: action.payload,
      };
    default:
      return state;
  }
}
