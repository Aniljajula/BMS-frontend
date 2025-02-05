import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";

// Table Dialog to display data in table format
const TableDialog = ({ open, handleClose, data }) => {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ backgroundColor: "#00d4ff", color: "white", fontWeight: "bold", textAlign: "center" }}>
        Data for {data.name}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f2f2f2" }}>Site ID</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f2f2f2" }}>Serial Number</th>
              </tr>
            </thead>
            <tbody>
              {data.details?.map((item, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.siteId}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.serialNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

const DataDialog = ({ openDialog, handleCloseDialog, selectedStatus, barChartData }) => {
  const [openTableDialog, setOpenTableDialog] = useState(false); // State to manage table dialog visibility
  const [tableData, setTableData] = useState(null); // State to hold selected bar data for the table

  const handleBarClick = (data) => {
    // Fetch the site ID and serial number for the selected bar
    const filteredData = barChartData.find((item) => item.name === data.name);
    if (filteredData) {
      setTableData({
        name: data.name,
        details: filteredData.details, // Pass site ID and serial number details
      });
      setOpenTableDialog(true); // Open the table dialog
    }
  };

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        sx={{ "& .MuiDialog-paper": { maxWidth: "600px", padding: "16px" } }}
      >
        <DialogTitle
          sx={{
            backgroundImage: "linear-gradient(90deg, #00d4ff 0%, #090979 35%, #00d4ff 100%)",
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            marginBottom: "16px",
          }}
        >
          Alarms for {selectedStatus}
        </DialogTitle>
        <DialogContent>
          <ResponsiveContainer width="100%" height={350}>
          <BarChart 
    data={barChartData} 
    barSize={25} 
    margin={{ bottom: 40 }} 
    barCategoryGap="20%" 
    barGap={5} 
    scale="linear"
>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" dx={-5} dy={15} />

    {/* Y-Axis is present but values are hidden */}
    <YAxis hide={true} tick={{ fontSize: 12 }} tickCount={5} domain={[1, barChartData.length]} />

    <Tooltip cursor={{ fill: "rgba(0, 0, 0, 0.1)" }} />
    <Legend />
    
    <Bar dataKey="count" fill="#8884d8" onClick={handleBarClick}>
        {/* Display count values above bars */}
        <LabelList dataKey="count" position="top" offset={5} style={{ fontSize: "12px", fontWeight: "bold" }} />
    </Bar>
</BarChart>
</ResponsiveContainer>

        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            sx={{
              backgroundColor: "red",
              color: "white",
              "&:hover": {
                backgroundColor: "#b30000",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Table Dialog */}
      <TableDialog
        open={openTableDialog}
        handleClose={() => setOpenTableDialog(false)}
        data={tableData || {}}
      />
    </>
  );
};

export default DataDialog;