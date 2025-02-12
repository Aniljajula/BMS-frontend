import React, { useContext, useState } from "react";
import { useTheme } from "@mui/material";
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
import { GetApp as ExcelIcon } from "@mui/icons-material"; // Import Excel icon
import * as XLSX from "xlsx"; // Import xlsx library

const columnMappings = {
  // Your column mappings...
};

const Historical = () => {
  const theme = useTheme();
  const { data = [] } = useContext(AppContext);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("date");
  const [pageType, setPageType] = useState(0);
  const [siteId, setSiteId] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const validateInputs = (requiredFields) => {
    for (const field of requiredFields) {
      if (!field.value) {
        alert(`Please enter ${field.label}`);
        return false;
      }
    }
    return true;
  };

  const handleRequestSort = (property) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };

  const TimeFormat = (dateString) => {
    if (dateString == null) {
      return "";
    }
    const utcDate = new Date(dateString);
    const year = utcDate.getFullYear();
    const month = String(utcDate.getMonth() + 1).padStart(2, "0");
    const day = String(utcDate.getDate()).padStart(2, "0");
    const hours = String(utcDate.getHours()).padStart(2, "0");
    const minutes = String(utcDate.getMinutes()).padStart(2, "0");
    const seconds = String(utcDate.getSeconds()).padStart(2, "0");
    const milliseconds = String(utcDate.getMilliseconds()).padStart(3, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const dataArray = data.content;

  const combineAlarmsData = (dataArray) => {
    if (!dataArray || dataArray.length === 0) return [];

    const combinedData = {};

    dataArray.forEach((current) => {
      const { id, bmsalarmsString, deviceId, bmsManufacturerID, installationDate, cellsConnectedCount, problemCells, ...rest } = current;
      if (!combinedData[current.id]) {
        combinedData[current.id] = { ...rest };
      } else {
        combinedData[current.id] = { ...combinedData[current.id], ...rest };
      }
    });

    const rows = Object.values(combinedData);

    return rows.map((row) => {
      const { packetDateTime, ...rest } = row;
      return { packetDateTime, ...rest };
    });
  };

  const sortedData = (dataArray) => {
    return [...dataArray].sort((a, b) => {
      if (order === "asc") {
        return a[orderBy] > b[orderBy] ? 1 : -1;
      }
      return a[orderBy] < b[orderBy] ? 1 : -1;
    });
  };

  const formattedData = combineAlarmsData(dataArray);
  const displayedData = sortedData(formattedData);

  // Function to handle Excel download
  const handleDownloadExcel = () => {
    if (!formattedData || formattedData.length === 0) {
      alert("No data available to export!");
      return;
    }
  
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
  
    // Map data to Excel format
    const excelData = displayedData.map((row) => {
      return Object.keys(row).map((key) => {
        if (key === "packetDateTime" || key === "serverTime") {
          return TimeFormat(row[key]);
        } else if (key === "dcVoltageOLN") {
          return row[key] === 0 ? "Low" : row[key] === 1 ? "Normal" : row[key] === 2 ? "Over" : row[key];
        } else if (typeof row[key] === "boolean") {
          return row[key] ? "Fail" : "Normal";
        } else {
          return row[key] !== undefined && row[key] !== null ? row[key] : "No Data";
        }
      });
    });
  
    // Add headers only if data exists
    if (formattedData.length > 0) {
      const headers = Object.keys(formattedData[0]).map((key) => columnMappings[key] || key);
      excelData.unshift(headers);
    }
  
    // Create a worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(excelData);
  
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Historical Data");
  
    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, "Historical_Data.xlsx");
  };
  
  return (
    <div>
      {/* Header with Excel Download Icon */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <ReportsBar pageType="historical" />
        <IconButton onClick={handleDownloadExcel} color="primary" aria-label="Download Excel">
  <img src={excelIcon} alt="Download Excel" style={{ width: "24px", height: "24px" }} />
</IconButton>

      </div>
  
      {formattedData && formattedData.length > 0 ? (
        <>
          <TableContainer component={Paper} sx={{ width: "100%", overflowY: "hidden" }}>
            <Table stickyHeader aria-label="sticky table">
              {/* Table Header */}
              <TableHead>
                <TableRow>
                  {Object.keys(formattedData[0]).map((key) => (
                    <TableCell
                      key={key}
                      sx={{
                        fontWeight: "bold",
                        backgroundColor: "#d82b27",
                        color: "#ffffff",
                      }}
                    >
                      <TableSortLabel
                        active={orderBy === key}
                        direction={orderBy === key ? order : "asc"}
                        onClick={() => handleRequestSort(key)}
                        aria-label={`Sort by ${columnMappings[key] || key}`}
                      >
                        {columnMappings[key] || key}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
  
              {/* Table Body */}
              <TableBody sx={{ overflowY: "auto" }}>
                {displayedData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:hover": { backgroundColor: "#e1e2fe" },
                      }}
                    >
                      {Object.entries(row).map(([key, value], idx) => (
                        <TableCell key={idx} sx={{ border: "1px solid #ccc" }}>
                          {key === "dcVoltageOLN"
                            ? value === 0
                              ? "Low"
                              : value === 1
                              ? "Normal"
                              : value === 2
                              ? "Over"
                              : value
                            : typeof value === "boolean"
                            ? value
                              ? "Fail"
                              : "Normal"
                            : key === "packetDateTime" || key === "serverTime"
                            ? TimeFormat(value)
                            : value !== undefined && value !== null
                            ? value
                            : "No Data"}
                        </TableCell>
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

export default Historical;