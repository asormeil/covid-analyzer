import { FETCH_COVID_DATA } from "../actions";

const initialState = [];

export default function covidReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_COVID_DATA:
      return action.payload;
    default:
      return state;
  }
}
