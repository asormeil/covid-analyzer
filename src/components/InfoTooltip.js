import { styled } from "@mui/system";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import PublicIcon from "@mui/icons-material/Public";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import UpdateIcon from "@mui/icons-material/Update";
import { TableCell } from "@mui/material";

import { formatNumber } from "../utls/helpers";
import styles from "./styles.module.css";


function InfoTooltip({ locationData }) {
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
      fontSize: "12px",
      color: "#888888",
    }));
  
    const rows = locationData;
    console.log(rows);
  
    return (
      <div
        style={{
          position: "absolute",
          backgroundColor: "#fff",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "6px",
          padding: "10px",
          zIndex: 1000,
          left: `${locationData.x || 0}px`,
          top: `${locationData.y || 0}px`,
          width: "400px",
          height: "200px",
        }}
      >
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <StyledTableCell>
                  <LocationOnIcon className={styles.icons} />
                  {locationData.location || "Unknown Location"}
                </StyledTableCell>
                <StyledTableCell align="right">
                  <PublicIcon className={styles.icons} />
                  {locationData.continent || "Unknown Continent"}
                </StyledTableCell>
                <StyledTableCell align="right">
                  <UpdateIcon className={styles.icons} />
                  {locationData.last_updated_date || "No Update Available"}
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableRow>
              <StyledTableCell>
                <Typography sx={{ fontSize: 11, color: "#EF6262" }}>
                  Total Cases
                </Typography>
                {formatNumber(locationData.total_cases || 0)}
              </StyledTableCell>
              <StyledTableCell align="right">
                <Typography sx={{ fontSize: 11, color: "#EF6262" }}>
                  Total Deaths
                </Typography>
                {formatNumber(locationData.total_deaths || 0)}
              </StyledTableCell>
              <StyledTableCell align="right">
                <Typography sx={{ fontSize: 11, color: "#EF6262" }}>
                  Population Density
                </Typography>
                {(locationData.population_density || 0).toFixed(2)}
              </StyledTableCell>
            </TableRow>
  
            <TableRow>
              <StyledTableCell>
                <Typography sx={{ fontSize: 11, color: "#468B97" }}>
                  Population
                </Typography>
                {formatNumber(locationData.population || 0)}
              </StyledTableCell>
              <StyledTableCell align="right">
                <Typography sx={{ fontSize: 11, color: "#468B97" }}>
                  Total Cases/Million
                </Typography>
                {formatNumber(locationData.total_cases_per_million || 0)}
              </StyledTableCell>
              <StyledTableCell align="right">
                <Typography sx={{ fontSize: 11, color: "#468B97" }}>
                  Life Expectancy
                </Typography>
                {locationData.life_expectancy || "N/A"}
              </StyledTableCell>
            </TableRow>
          </Table>
        </TableContainer>
      </div>
    );
  }
  
  export default InfoTooltip;
  
