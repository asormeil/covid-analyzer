import React, { useEffect, useState } from "react";
import { connect, useSelector, useDispatch } from "react-redux";

import {
  Autocomplete,
  TextField,
  Grid,
  Paper,
  Alert,
  AlertTitle,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { Line } from "react-chartjs-2";

import { getMoralityDataByCountry } from "../services";
import styles from "./styles.module.css";
import {
  persistBaselineGraphs,
  setBaselineGraphs,
  fetchMoralityData,
  fetchMortalityDataByCountry,
} from "../actions";

function Graphs({ baselineGraphs, setBaselineGraphs }) {
  const dispatch = useDispatch();
  const moralityData = useSelector((state) => state.moralityData.data);
  const currentPage = useSelector((state) => state.moralityData.currentPage);
  const [locationsGraphs, setLocationsGraphs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const covidData = useSelector((state) => state.covidData);
  const [chartData, setChartData] = useState({
    deaths2023: [],
    averageDeaths2015_2019: [],
    deathsSince2020: [],
    deaths2015: [],
    dates: [],
  });
  const persistedBaselineGraphs = useSelector(
    (state) => state.baselineData.persistedBaselineGraphs
  );

  const baselineDataGraphs = baselineGraphs || persistedBaselineGraphs || {};

  useEffect(() => {
    // Function to fetch and set data for Canada
    const fetchCanadaData = async () => {
      try {
        const country = "Canada"; // Replace with the country you want to load on first load (Canada in this case)
        setLoading(true);
        const fetchedData = await getMoralityDataByCountry(
          currentPage,
          10,
          country
        );

        if (fetchedData && fetchedData.data && fetchedData.data.length > 0) {
          const dates = fetchedData.data.map((item) => item.date);
          const deaths2023 = fetchedData.data.map(
            (item) => item.deaths_2023_all_ages
          );
          const averageDeaths2015_2019 = fetchedData.data.map(
            (item) => item.average_deaths_2015_2019_all_ages
          );
          const deathsSince2020 = fetchedData.data.map(
            (item) => item.deaths_since_2020_all_ages
          );
          const deaths2015 = fetchedData.data.map(
            (item) => item.deaths_2015_all_ages
          );

          // Set the chart data state
          setChartData({
            deaths2023,
            averageDeaths2015_2019,
            deathsSince2020,
            deaths2015,
            dates,
          });

          setBaselineGraphs(fetchedData);
          dispatch(persistBaselineGraphs());
        } else {
          console.log("No data received from the API");
          setShowWarning(true);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching country data:", error);
        setLoading(false);
      }
    };

    fetchCanadaData();
  }, []);

  useEffect(() => {
    if (persistedBaselineGraphs && persistedBaselineGraphs.location) {
      setBaselineGraphs(persistedBaselineGraphs);
    }
  }, [setBaselineGraphs, persistedBaselineGraphs]);

  useEffect(() => {
    if (covidData) {
      setLocationsGraphs(covidData.map((item) => item.location));
    }
  }, [covidData]);

  useEffect(() => {
    if (
      !moralityData ||
      moralityData.length === 0 ||
      !Array.isArray(moralityData)
    ) {
      dispatch(fetchMoralityData(currentPage, 2));
    }
  }, [dispatch, currentPage, moralityData]);

  if (!Array.isArray(moralityData) || moralityData.length === 0) {
    return <div>Loading...</div>;
  }
  
  const onChangeBaselineGraphs = async (event, value) => {
    try {
      setShowWarning(false);
      const newBaselineGraphs = {
        ...baselineDataGraphs,
        location: value || "",
      };
      setBaselineGraphs(newBaselineGraphs);

      if (baselineGraphs) {
        setLoading(true);
        await fetchAndSetCountryData(value);
        setLoading(false);
      } else {
        console.log("Baseline graphs not available.");
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const fetchAndSetCountryData = async (country) => {
    if (country) {
      try {
        const fetchedData = await getMoralityDataByCountry(
          currentPage,
          10,
          country
        );

        if (fetchedData && fetchedData.data && fetchedData.data.length > 0) {
          const dates = fetchedData.data.map((item) => item.date);

          // Extract data for each chart
          const deaths2023 = fetchedData.data.map(
            (item) => item.deaths_2023_all_ages
          );
          const averageDeaths2015_2019 = fetchedData.data.map(
            (item) => item.average_deaths_2015_2019_all_ages
          );
          const deathsSince2020 = fetchedData.data.map(
            (item) => item.deaths_since_2020_all_ages
          );
          const deaths2015 = fetchedData.data.map(
            (item) => item.deaths_2015_all_ages
          );
           document.title = `${country} Mortality Data Visualization`;
          // Set the chart data state
          setChartData({
            deaths2023,
            averageDeaths2015_2019,
            deathsSince2020,
            deaths2015,
            dates,
          });

          setBaselineGraphs(fetchedData);
          dispatch(persistBaselineGraphs());
          setShowWarning(false);
        } else {
          console.log("No data received from the API");
          setShowWarning(true);
        }
      } catch (error) {
        console.error("Error fetching country data:", error);
        setShowWarning(false);
      }
    }
  };

 

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const deaths2023ChartData = {
    labels: chartData.dates,
    datasets: [
      {
        label: "Deaths 2023",
        data: chartData.deaths2023,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.4)",
        fill: true,
      },
    ],
  };

  const averageDeaths2015_2019ChartData = {
    labels: chartData.dates,
    datasets: [
      {
        label: "Average Deaths 2015-2019",
        data: chartData.averageDeaths2015_2019,
        borderColor: "rgba(192,75,75,1)",
        backgroundColor: "rgba(192,75,75,0.4)",
        fill: true,
      },
    ],
  };

  const deathsSince2020ChartData = {
    labels: chartData.dates,
    datasets: [
      {
        label: "Deaths Since 2020",
        data: chartData.deathsSince2020,
        borderColor: "rgba(192,75,192,1)",
        backgroundColor: "rgba(192,75,192,0.4)",
        fill: true,
      },
    ],
  };

  const deaths2015ChartData = {
    labels: chartData.dates,
    datasets: [
      {
        label: "Deaths 2015",
        data: chartData.deaths2015,
        borderColor: "rgba(75,75,192,1)",
        backgroundColor: "rgba(75,75,192,0.4)",
        fill: true,
      },
    ],
  };

  return (
    <div>
      <Paper>
        <h3 className={styles.title}>Country Mortality Data Visualization</h3>

        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={1}
          style={{ textAlign: "center" }}
        >
          <Autocomplete
            style={{ width: "40%", marginBottom: 5, marginTop: 5 }}
            defaultValue={
              baselineGraphs !== null
                ? baselineGraphs.location
                : persistedBaselineGraphs !== null
                ? persistedBaselineGraphs.location
                : {}
            }
            options={locationsGraphs}
            onChange={onChangeBaselineGraphs}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Location"
                variant="outlined"
                size="small"
              />
            )}
          />
        </Grid>
      </Paper>

      <Grid container spacing={1} justifyContent="center" alignItems="center">
        <Grid item xs={12}>
          {showWarning && (
            <Alert severity="warning" style={{ margin: "20px 0" }}>
              <AlertTitle>Warning</AlertTitle>
              Country data doesn't exist. Please choose another country.
            </Alert>
          )}
        </Grid>

        {loading ? (
          <div>Loading...</div>
        ) : Object.keys(chartData).some((key) => chartData[key].length > 0) ? (
          <Paper>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={6}>
                <Item>
                  {" "}
                  <Line data={deaths2023ChartData} />
                </Item>
              </Grid>
              <Grid item xs={6}>
                <Item>
                  {" "}
                  <Line data={averageDeaths2015_2019ChartData} />
                </Item>
              </Grid>
              <Grid item xs={6}>
                <Item>
                  {" "}
                  <Line data={deathsSince2020ChartData} />
                </Item>
              </Grid>
              <Grid item xs={6}>
                <Item>
                  {" "}
                  <Line data={deaths2015ChartData} />
                </Item>
              </Grid>
            </Grid>
          </Paper>
        ) : (
          <div>Loading charts...</div>
        )}
      </Grid>
    </div>
  );
}

const mapStateToProps = (state) => ({
  baselineGraphs: state.baselineData?.baseline,
});

const mapDispatchToProps = (dispatch) => ({
  setBaselineGraphs: (data) => dispatch(setBaselineGraphs(data)),
  fetchMoralityDataByCountry: (country) =>
    dispatch(fetchMortalityDataByCountry(country)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Graphs);
