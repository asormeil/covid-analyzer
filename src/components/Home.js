import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";

import { formatNumber } from '../utls/helpers';
import InfoTooltip from './InfoTooltip'
import styles from "./styles.module.css";


import { fetchCovidData } from "../actions";
import { scaleQuantize } from "d3-scale";
import { geoCentroid, geoEquirectangular } from "d3-geo";

const geoUrl = process.env.REACT_APP_GEO_URL;

const projection = geoEquirectangular();

const Home = () => {
  const dispatch = useDispatch();
  const covidData = useSelector((state) => state.covidData);
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });

  useEffect(() => {
    // Fetch data only if not already fetched
    if (!covidData || covidData.length === 0) {

      dispatch(fetchCovidData());
    }
  }, [dispatch, covidData]);

  

  const handleMouseEnter = (event, data) => {
    setTooltipData(data);
    setTooltipPos({ x: event.pageX, y: event.pageY });
  };

  const handleMouseLeave = () => {
    setTooltipData(null);
  };

  const handleZoomIn = () => {
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 2 }));
  };

  const handleZoomOut = () => {
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 2 }));
  };

  const handleMoveEnd = (position) => {
    setPosition(position);
  };

  if (!covidData || covidData.length === 0) {
    return <div>Loading...</div>;
  }

  let maxCases = Math.max.apply(
    Math,
    covidData.map((country) => Number(country.total_cases))
  );
  const theme = {
    geography: {
      default: {
        outline: "none",
        stroke: "#8888",
        strokeWidth: 0.2,
      },
      hover: {
        fill: "#8888",
        transition: "all 250ms",
        strokeWidth: 1,
        outline: "none",
      },
      pressed: {
        fill: "#E42",
        outline: "none",
      },
    },
  };

  const colorScale = scaleQuantize()
    .domain([0, maxCases])
    .range(["#ffedea", "#ffadaa", "#ff6e70", "#ff4055", "#EF6262"]);



  return (
    <>
      {tooltipData && (
        <InfoTooltip locationData={{ ...tooltipData, ...tooltipPos }} />
      )}

      <h3 className={styles.title}>
        Geographical Distribution of Total COVID-19 Cases
      </h3>
      <mat-card>
        <div className={styles.legend}>
          <h4>Total Cases</h4>
          <div className={styles.legendItem}>
            <div style={{ background: colorScale(0) }}></div>
            <span>0 </span>
          </div>
          <div className={styles.legendItem}>
            <div style={{ background: colorScale(maxCases / 4) }}></div>
            <span>{formatNumber(maxCases / 4)}</span>
          </div>
          <div className={styles.legendItem}>
            <div style={{ background: colorScale(maxCases / 2) }}></div>
            <span>{formatNumber(maxCases / 2)}</span>
          </div>
          <div className={styles.legendItem}>
            <div style={{ background: colorScale((maxCases / 4) * 3) }}></div>
            <span>{formatNumber((maxCases / 4) * 3)}</span>
          </div>
          <div className={styles.legendItem}>
            <div style={{ background: colorScale(maxCases) }}></div>
            <span>{formatNumber(maxCases)}</span>
          </div>
          <div className={styles.zoomButtons}>
            <button className={styles.zoomButton} onClick={handleZoomIn}>
              +
            </button>
            <button className={styles.zoomButton} onClick={handleZoomOut}>
              -
            </button>
          </div>
        </div>

        <mat-card-content>
          <ComposableMap projection={projection} width={800} height={450}>
            <ZoomableGroup zoom={position.zoom} onMoveEnd={handleMoveEnd}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    // Find the matching country data
                    const countryData = covidData.find(
                      (country) => country.location === geo.properties.name
                    );
                    const centroid = geoCentroid(geo);
                    const cases = countryData
                      ? Number(countryData.total_cases)
                      : 0;
                    const countries = countryData
                      ? countryData.countryCode
                      : "";

                    return (
                      <>
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          style={theme.geography}
                          onMouseEnter={(event) =>
                            handleMouseEnter(event, countryData)
                          }
                          onMouseLeave={handleMouseLeave}
                          // Fill the country with a color corresponding to the number of cases
                          fill={countryData ? colorScale(cases) : "#d70022"}
                        />
                        <Marker coordinates={centroid}>
                          <text y="-10" fontSize={4} textAnchor="middle">
                            {countries}
                          </text>
                          {/* <text y="2" fontSize={2} textAnchor="middle">
                        {formatNumber(cases)}
                      </text> */}
                        </Marker>
                      </>
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </mat-card-content>
      </mat-card>
    </>
  );
};

export default Home;
