import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";

import { Search } from "@mui/icons-material";
import {
  TextField,
  Button,
  Container,
  Box,
  Grid,
  Paper,
  Autocomplete,
} from "@mui/material";

import { Bar as BarComponent, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";

import { fetchCovidData, setBaseline, setComparison } from "../actions";

import styles from "./styles.module.css";
import { formatNumber } from "../utls/helpers";
import { getCovidDataByLocation } from "../services";
import { persistBaseline, persistComparison } from "../actions";

ChartJS.register(...registerables);

const WORLD_POPULATION = 7837000000;

function BaselineComponent({
  baseline,
  comparison,
  setBaseline,
  setComparison,
}) {
  const dispatch = useDispatch();
  const [locations, setLocations] = useState([]);
  const covidData = useSelector((state) => state.covidData);

  const persistedBaseline = useSelector(
    (state) => state.baselineData.persistedBaseline
  );
  const persistedComparison = useSelector(
    (state) => state.baselineData.persistedComparison
  );
  const baselineData = baseline || persistedBaseline || {};
  const comparisonData = comparison || persistedComparison || {};

  useEffect(() => {
    if (!covidData || covidData.length === 0) {
      dispatch(fetchCovidData());
    }
  }, [dispatch, covidData]);

  useEffect(() => {
    if (covidData) {
      setLocations(covidData.map((item) => item.location));
    }
  }, [covidData]);

  useEffect(() => {
    if (persistedBaseline && persistedBaseline.location) {
      setBaseline(persistedBaseline);
    }

    if (persistedComparison && persistedComparison.location) {
      setComparison(persistedComparison);
    }
  }, [setBaseline, setComparison, persistedBaseline, persistedComparison]);

  const handleFetchInfo = async () => {
    const fetchAndSetData = async (data, setData, persistAction) => {
      if (data && data.location) {
        const fetchedData = (await getCovidDataByLocation(data.location))[0];
        setData(fetchedData);
        dispatch(persistAction()); 
      }
    };

    fetchAndSetData(baselineData, setBaseline, persistBaseline);
    fetchAndSetData(comparisonData, setComparison, persistComparison);
  };

  const buildBarData = (baselineData, comparisonData, label) => {
    return {
      labels: [label],
      datasets: [
        {
          label: "Baseline",
          data: [baselineData],
          backgroundColor: "rgba(33, 150, 243, 0.2)",
          borderColor: "rgba(33, 150, 243, 1)",
          borderWidth: 1,
        },
        {
          label: "Comparison",
          data: [comparisonData],
          backgroundColor: "rgba(76, 175, 80, 0.2)",
          borderColor: "rgba(76, 175, 80, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  const buildDoughnutData = (locationData, worldPopulation) => {
    const locationPercent = (locationData / worldPopulation) * 100;
    const otherPercent = 100 - locationPercent;

    return {
      labels: ["Location", "Rest of the World"],
      datasets: [
        {
          data: [locationPercent, otherPercent],
          backgroundColor: [
            "rgba(33, 150, 243, 0.5)",
            "rgba(200, 200, 200, 0.5)",
          ],
          borderColor: ["rgba(33, 150, 243, 1)", "rgba(200, 200, 200, 1)"],
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <Container className={styles.container}>
      <Paper style={{ paddingBottom: 15 }}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={1}
          style={{ textAlign: "center" }}
        >
          <Grid item xs={12} sm={4}>
            <p className={styles.title}>Baseline Input Section</p>
            <Autocomplete
              defaultValue={persistedBaseline ? persistedBaseline.location : ""}
              options={locations}
              onChange={(event, value) => {
                const newBaseline = { ...baseline, location: value || "" };
                setBaseline(newBaseline);
              }}
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

          <Grid item xs={12} sm={4}>
            <p className={styles.title}> Comparison Input Section</p>
            <Autocomplete
              defaultValue={
                persistedComparison ? persistedComparison.location : ""
              }
              options={locations}
              onChange={(event, value) => {
                const newComparison = {
                  ...comparison,
                  location: value || "",
                };
                setComparison(newComparison);
              }}
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

          <Grid style={{ marginTop: 35 }} item xs={12} sm={2}>
            <Button
              onClick={handleFetchInfo}
              startIcon={<Search />}
              sx={{
                fontSize: "15px",
                marginTop: 2,
                border: "#EF6262 1px solid",
                borderRadius: "25",
                color: "#EF6262",
                "&:hover": {
                  backgroundColor: "#e3e3e3",
                  border: "#EF6262 1px solid",
                  color: "#000000",
                },
              }}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper>
        <Box className={styles.chartContainer} m={2}>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={1}
            style={{ textAlign: "center", marginBottom: 80 }}
          >
            <Grid item xs={12} sm={6}>
              <div style={{ height: "200px", width: "200px", margin: "auto" }}>
                <p className={styles.title}>
                  {baseline?.location}:{" "}
                  {formatNumber(baseline?.population ?? 0)}
                </p>
                <Doughnut
                  data={buildDoughnutData(
                    baseline?.population ?? 0,
                    WORLD_POPULATION
                  )}
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </div>
            </Grid>

            <Grid item xs={12} sm={6}>
              <div style={{ height: "200px", width: "200px", margin: "auto" }}>
                <p className={styles.title}>
                  {" "}
                  {comparison?.location}:{" "}
                  {formatNumber(comparison?.population ?? 0)}
                </p>
                <Doughnut
                  data={buildDoughnutData(
                    comparison?.population ?? 0,
                    WORLD_POPULATION
                  )}
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </div>
            </Grid>
          </Grid>

          {baseline && comparison && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <div style={{ width: "350px", margin: "auto" }}>
                      <BarComponent
                        className={styles.barChart}
                        data={buildBarData(
                          baseline.total_deaths || 0,
                          comparison.total_deaths || 0,
                          "Total Deaths"
                        )}
                        options={{ responsive: true }}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <div style={{ width: "350px", margin: "auto" }}>
                      <BarComponent
                        className={styles.barChart}
                        data={buildBarData(
                          baseline.total_deaths_per_million || 0,
                          comparison.total_deaths_per_million || 0,
                          "Total Deaths per Million"
                        )}
                        options={{ responsive: true }}
                      />
                    </div>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <div style={{ width: "350px", margin: "auto" }}>
                      <BarComponent
                        className={styles.barChart}
                        data={buildBarData(
                          baseline.new_cases || 0,
                          comparison.new_cases || 0,
                          "New Cases"
                        )}
                        options={{ responsive: true }}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <div style={{ width: "350px", margin: "auto" }}>
                      <BarComponent
                        className={styles.barChart}
                        data={buildBarData(
                          baseline.total_cases || 0,
                          comparison.total_cases || 0,
                          "Total Cases"
                        )}
                        options={{ responsive: true }}
                      />
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

const mapStateToProps = (state) => ({
  baseline: state.baselineData?.baseline,
  comparison: state.baselineData?.comparison,
});

const mapDispatchToProps = (dispatch) => ({
  setBaseline: (data) => dispatch(setBaseline(data)),
  setComparison: (data) => dispatch(setComparison(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BaselineComponent);
