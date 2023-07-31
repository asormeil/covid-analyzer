import { getCovidData, getMoralityData } from "../services";

export const FETCH_COVID_DATA = "FETCH_COVID_DATA";
export const FETCH_COVID_DATA_FAILED = "FETCH_COVID_DATA_FAILED";

export const SET_BASELINE = "SET_BASELINE";
export const SET_COMPARISON = "SET_COMPARISON";

export const FETCH_MORALITY_DATA_SUCCESS = "FETCH_MORALITY_DATA_SUCCESS";
export const FETCH_MORALITY_DATA_FAILED = "FETCH_MORALITY_DATA_FAILED";

export const SET_CURRENT_PAGE = "SET_CURRENT_PAGE";
export const SET_TOTAL_PAGES = "SET_TOTAL_PAGES";
export const SET_LOADING = "SET_LOADING";

export const FETCH_ALL_COUNTRIES = "FETCH_ALL_COUNTRIES";
export const FETCH_MORTALITY_DATA_BY_COUNTRY = "FETCH_MORTALITY_DATA_BY_COUNTRY";




export const fetchMortalityDataByCountry = (country) => ({
  type: FETCH_MORTALITY_DATA_BY_COUNTRY,
  payload: country,
});


export const fetchAllCountries = () => ({
  type: FETCH_ALL_COUNTRIES,
});
export const setBaseline = (data) => {
  localStorage.setItem("persistedBaseline", JSON.stringify(data));
  return {
    type: "SET_BASELINE",
    payload: data,
  };
};

export const setBaselineGraphs = (data) => {
  localStorage.setItem("persistedBaselineGraphs", JSON.stringify(data));
  return {
    type: "PERSIST_BASELINE_GRAPHS",
    payload: data,
  };
};

export const setLocations = (data) => {
  localStorage.setItem("persistedBaseline", JSON.stringify(data));
  return {
    type: "SET_LOCATION",
    payload: data,
  };
};

export const setComparison = (data) => {
  localStorage.setItem("persistedComparison", JSON.stringify(data));
  return {
    type: "SET_COMPARISON",
    payload: data,
  };
};

export function fetchCovidData() {
  return (dispatch) => {
    getCovidData()
      .then((data) => {
        dispatch({ type: FETCH_COVID_DATA, payload: data });
      })
      .catch((error) => {
        console.error("Failed to fetch covid data:", error);
        dispatch({ type: FETCH_COVID_DATA_FAILED, payload: error.message });
      });
  };
}

export const persistBaseline = () => {
  return (dispatch, getState) => {
    const baseline = getState().baselineData.baseline;
    localStorage.setItem("persistedBaseline", JSON.stringify(baseline));
    dispatch({
      type: "PERSIST_BASELINE",
    });
  };
};

export const persistBaselineGraphs = () => {
  return (dispatch, getState) => {
    const baselineGraphs = getState().baselineGraphsData.baseline;
    localStorage.setItem("persistedBaselineGraphs", JSON.stringify(baselineGraphs));
    dispatch({
      type: "PERSIST_BASELINE_GRAPHS",
    });
  };
};

export const persistComparison = () => {
  return (dispatch, getState) => {
    const comparison = getState().baselineData.comparison;
    localStorage.setItem("persistedComparison", JSON.stringify(comparison));
    dispatch({
      type: "PERSIST_COMPARISON",
    });
  };
};

export const persistAllData = () => {
  return (dispatch) => {
    dispatch(persistBaseline());
    dispatch(persistComparison());
  };
};

export const fetchMoralityData = (page, limit) => {
  return (dispatch) => {
    dispatch({ type: SET_LOADING, payload: true });

    getMoralityData(page, limit)
      .then((response) => {
        dispatch({ type: FETCH_MORALITY_DATA_SUCCESS, payload: response.data });
        dispatch({ type: SET_CURRENT_PAGE, payload: response.currentPage });
        dispatch({ type: SET_TOTAL_PAGES, payload: response.totalPages });
        dispatch({ type: SET_LOADING, payload: false });
        console.log(response);
      })
      .catch((error) => {
        console.error("Failed to fetch morality data:", error);
        dispatch({ type: FETCH_MORALITY_DATA_FAILED, payload: error.message });
        dispatch({ type: SET_LOADING, payload: false });
      });
  };
};
