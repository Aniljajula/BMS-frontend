import React, { useContext, useState } from "react";
import { useTheme } from "@mui/material";
import { ColorModeContext, tokens } from "../../../theme";
import { AppContext } from "../../../services/AppContext";
import ReportsBar from "../ReportsBar/ReportsBar";
import excelIcon from "../../../assets/images/png/ExcellTrans100_98.png";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
  TableSortLabel,
  IconButton,
} from "@mui/material";
import * as XLSX from "xlsx"; // Import the xlsx library
import DownloadIcon from "@mui/icons-material/Download"; // Import the download icon from Material-UI

const columnMappings = {
  dayWiseDate: "Date",
  chargeOrDischargeCycle: "Charge/Discharge Cycle",
  cumulativeAHIn: "Cumulative AH In",
  cumulativeAHOut: "Cumulative AH Out",
  totalChargingEnergy: "Total Charging Energy",
  totalDischargingEnergy: "Total Discharging Energy",
  batteryRunHours: "Battery Run Hours",
};

const DayWise = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { data = [] } = useContext(AppContext);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("dayWiseDate");
  const [pageType, setPageType] = useState(0);

  const handleRequestSort = (property) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatData = (data) => {
    if (!data || data.length === 0) return [];

    const formatToTime = (seconds) => {
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hrs.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const formatToTwoDecimals = (value) =>
      value !== null && value !== undefined
        ? parseFloat(value).toFixed(2)
        : "-";

    const formattedData = data.map((row) => {
      const {
        dayWiseDate,
        batteryRunHours,
        chargeOrDischargeCycle,
        cumulativeAHIn,
        cumulativeAHOut,
        totalChargingEnergy,
        totalDischargingEnergy,
      } = row;

      return {
        dayWiseDate: dayWiseDate.split("T")[0], // Format `dayWiseDate` to `YYYY-MM-DD`
        batteryRunHours: formatToTime(batteryRunHours || 0), // Convert seconds to HH:MM:SS format
        chargeOrDischargeCycle: (chargeOrDischargeCycle) , // Keep as-is if integer
        cumulativeAHIn: formatToTwoDecimals(cumulativeAHIn), // Limit to 2 decimal places
        cumulativeAHOut: formatToTwoDecimals(cumulativeAHOut), // Limit to 2 decimal places
        totalChargingEnergy: formatToTwoDecimals(totalChargingEnergy), // Limit to 2 decimal places
        totalDischargingEnergy: formatToTwoDecimals(totalDischargingEnergy), // Limit to 2 decimal places
      };
    });

    return formattedData;
  };

  const sortedData = (data) => {
    return [...data].sort((a, b) => {
      if (order === "asc") {
        return a[orderBy] > b[orderBy] ? 1 : -1;
      }
      return a[orderBy] < b[orderBy] ? 1 : -1;
    });
  };

  const formattedData = formatData(data);
  const displayedData = sortedData(formattedData);

  const handleDownloadExcel = () => {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Map data to Excel format
    const excelData = displayedData.map((row) => {
      return Object.keys(row).map((key) => {
        return row[key] !== undefined && row[key] !== null ? row[key] : "No Data";
      });
    });

    // Add headers to the Excel data
    const headers = Object.keys(formattedData[0]).map((key) => columnMappings[key] || key);
    excelData.unshift(headers);

    // Create a worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(excelData);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "DayWise Data");

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, "DayWise_Data.xlsx");
  };

  return (
    <div>
      {/* Header with Excel Download Icon */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <ReportsBar pageType="daywise" />
        <IconButton onClick={handleDownloadExcel} color="primary" aria-label="Download Excel">
          <img src={excelIcon} alt="Download Excel" style={{ width: "24px", height: "24px" }} />
        </IconButton>
      </div>

      <Typography variant="h4" gutterBottom align="center">
        DayWise Reports
      </Typography>

      {formattedData && formattedData.length > 0 ? (
        <>
          <TableContainer
            component={Paper}
            sx={{ marginTop: 1, overflowX: "auto",
              border: "1px solid black", // Red border for all four sides
              borderRadius: "8px", // Optional: Adds rounded corners
             }}
          >
            <Table>
              {/* Table Header */}
              <TableHead>
                <TableRow>
                  {Object.keys(formattedData[0]).map((key) => (
                    <TableCell
                      key={key}
                      sx={{
                        fontWeight: "bold",
                        backgroundColor: "#d82b27", // Blue header
                        color: "#ffffff", // White text
                      }}
                    >
                      <TableSortLabel
                        active={orderBy === key}
                        direction={orderBy === key ? order : "asc"}
                        onClick={() => handleRequestSort(key)}
                        aria-label={`Sort by ${columnMappings[key] || key}`}
                      >
                        {columnMappings[key] || key} {/* Map column names */}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              {/* Table Body */}
              <TableBody>
                {displayedData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:hover": { backgroundColor: "#e1e2fe" }, // Hover effect
                      }}
                    >
                      {Object.values(row).map((value, idx) => (
                        <TableCell key={idx}>{value}</TableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            component="div"
            count={formattedData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      ) : (
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          No data available
        </Typography>
      )}
    </div>
  );
};

export default DayWise;