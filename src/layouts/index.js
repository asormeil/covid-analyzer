import React, { useState } from "react";

import PropTypes from "prop-types";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import Home from "../components/Home";
import Graphs from "../components/Graphs";
import BaselineComponent from "../components/Baseline";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Layout() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        width: "90%",
        margin: "auto",
        mt: 4,
        mb: 4,
        backgroundColor: "#FFFFFF",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab
            label="World Map"
            {...a11yProps(0)}
            style={{
              color: value === 0 ? "#FFFFFF" : "#000000",
              backgroundColor: value === 0 ? "#EF6262" : "transparent",
            }}
          />
          <Tab
            label="Comparatives"
            {...a11yProps(1)}
            style={{
              color: value === 1 ? "#FFFFFF" : "#000000",
              backgroundColor: value === 1 ? "#EF6262" : "transparent",
            }}
          />
          <Tab
            label="Charts"
            {...a11yProps(2)}
            style={{
              color: value === 2 ? "#FFFFFF" : "#000000",
              backgroundColor: value === 2 ? "#EF6262" : "transparent",
            }}
          />
        </Tabs>
        <div style={{ marginRight: "20px", color: "#EF6262", fontWeight: 800 }}>
          Comparative
        </div>
      </Box>

      <CustomTabPanel value={value} index={0}>
        <Home />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <BaselineComponent />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Graphs />
      </CustomTabPanel>
    </Box>
  );
}
