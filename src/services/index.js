import axios from "axios";

export const getCovidData = async () => {
  try {
    const url = process.env.REACT_APP_API_URL + "api/covid";
    const response = await axios.get(url);

    return response.data;
  } catch (error) {
    console.error("Failed to fetch covid data", error);
    throw error;
  }
};

export const getCovidDataByLocation = async (location) => {
  try {
    const url = process.env.REACT_APP_API_URL + `api/covid/${location}`;
    const response = await axios.get(url);

    return response.data;
  } catch (error) {
    console.error("Failed to fetch covid data", error);
    throw error;
  }
};

export const getMoralityDataByCountry = async (page, limit, country) => {
  try {
    const url = process.env.REACT_APP_API_URL + `api/mortality/${country}`;

    console.log("API URL:", url);

    const response = await axios.get(url, {
      params: {
        page: page,
        limit: limit,
      },
    });

    console.log("Morality Data in service:", response.data);

    return {
      data: response.data.data,
      currentPage: response.data.currentPage,
      totalPages: response.data.totalPages,
    };
  } catch (error) {
    console.error("Failed to fetch mortality data", error);
    throw error;
  }
};

export const getMoralityData = async (page, limit) => {
  try {
    const url = process.env.REACT_APP_API_URL + "api/mortality";

    const response = await axios.get(url, {
      params: {
        page: page,
        limit: limit,
      },
    });

    console.log("Morality Data in service:", response.data);

    return {
      data: response.data.data,
      currentPage: response.data.currentPage,
      totalPages: response.data.totalPages,
    };
  } catch (error) {
    console.error("Failed to fetch morality data", error);
    throw error;
  }
};
