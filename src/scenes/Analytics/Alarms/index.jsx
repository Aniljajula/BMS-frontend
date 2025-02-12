import React, { useContext, useState } from "react";
import { useTheme, IconButton } from "@mui/material";
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
} from "@mui/material";
import * as XLSX from "xlsx";

const columnMappings = {
  siteId: "Site ID",
  serialNumber: "Serial Number",
  bankCycle: "Bank Status",
  ambientTemperature: "Ambient Temperature",
  soc: "State Of Charge",
  stringVoltage: "String Voltage",
  stringCurrent: "String Current",
  bmsSedCommunication: "BMS Sed Communication",
  cellCommunication: "Cell Communication",
  cellVoltage: "Cell Voltage",
  cellTemperature: "Cell Temperature",
  buzzer: "Buzzer",
  ebStatus: "EB Status",
  packetDateTime: "Packet DateTime",
};

const Alarms = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { data = {} } = useContext(AppContext);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("siteId");

  const handleRequestSort = (property) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };

  const TimeFormat = (dateString) => {
    if (!dateString) return "No Data";
    const utcDate = new Date(dateString);
    return utcDate.toISOString().replace("T", " ").split(".")[0];
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const combineAlarmsData = (dataArray) => {
    if (!dataArray || dataArray.length === 0) return [];
    const combinedData = {};
    dataArray.forEach((current) => {
      if (!combinedData[current.id]) {
        combinedData[current.id] = { ...current };
      } else {
        combinedData[current.id] = { ...combinedData[current.id], ...current };
      }
    });
    return Object.values(combinedData);
  };

  const sortedData = (dataArray) => {
    return [...dataArray].sort((a, b) => {
      if (a[orderBy] === undefined || a[orderBy] === null) return 1;
      if (b[orderBy] === undefined || b[orderBy] === null) return -1;
      if (order === "asc") {
        return a[orderBy] > b[orderBy] ? 1 : -1;
      }
      return a[orderBy] < b[orderBy] ? 1 : -1;
    });
  };

  const formattedData = combineAlarmsData(data.content || []);
  const displayedData = sortedData(formattedData);

  const handleDownloadExcel = () => {
    if (formattedData.length === 0) {
      alert("No data available for download.");
      return;
    }

    const workbook = XLSX.utils.book_new();
    const excelData = displayedData.map((row) =>
      Object.keys(row).map((key) =>
        key === "packetDateTime" ? TimeFormat(row[key]) : row[key] || "No Data"
      )
    );
    const headers = Object.keys(formattedData[0]).map(
      (key) => columnMappings[key] || key
    );
    excelData.unshift(headers);
    const worksheet = XLSX.utils.aoa_to_sheet(excelData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Alarms Data");
    XLSX.writeFile(workbook, "Alarms_Report.xlsx");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <ReportsBar pageType="historical" />
        <IconButton onClick={handleDownloadExcel} color="primary" aria-label="Download Excel">
          <img src={excelIcon} alt="Download Excel" style={{ width: "24px", height: "24px" }} />
        </IconButton>
      </div>

      {formattedData.length > 0 ? (
        <>
          <TableContainer component={Paper} sx={{ marginTop: 1, overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  {formattedData.length > 0 &&
                    Object.keys(formattedData[0]).map((key) => (
                      <TableCell key={key} sx={{ fontWeight: "bold", backgroundColor: "#d82b27", color: "#ffffff" }}>
                        <TableSortLabel
                          active={orderBy === key}
                          direction={orderBy === key ? order : "asc"}
                          onClick={() => handleRequestSort(key)}
                        >
                          {columnMappings[key] || key}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                  <TableRow key={index} sx={{ "&:hover": { backgroundColor: "#e1e2fe" } }}>
                    {Object.entries(row).map(([key, value], idx) => (
                      <TableCell key={idx} sx={{ border: "1px solid #ccc" }}>
                        {key === "packetDateTime" ? TimeFormat(value) : value || "No Data"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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

export default Alarms;
