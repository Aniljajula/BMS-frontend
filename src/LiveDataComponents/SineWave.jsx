import React,{useContext} from 'react';
import { Box, Paper } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
} from "recharts";
import { AppContext } from "../services/AppContext";

const VoltageVisualizations = ({}) => {

   const {
          data,
        }=useContext(AppContext)
    
        const device = data[0];
      if (!device) return <div> 
      </div>;
      const{averageDischargingCurrent, averageChargingCurrent}=device

  const chargeData = {
    avgCurrent:  averageChargingCurrent,
  };

  const dischargeData = {
    avgCurrent: averageDischargingCurrent,
  };

  // Restructure data to group by Charging and Discharging
  const currentComparisonData = [
    {
      name: "Charging(A)",
      average: chargeData.avgCurrent,
    },
    {
      name: "Discharging(A)",
      average: dischargeData.avgCurrent,
    },
  ];

  return (
    <Paper
      elevation={8}
      sx={{ height: "150px", pt: 1, pb: 1, overflow: "hidden" }}
    >
      {/* Current Comparison Chart */}
      <Box sx={{ height: "100%", width: "100%", overflow: "hidden" , pt: 1, pb: 1}}>
        
        <BarChart
          width={230} // Adjust width to fit the Paper
          height={134} // Adjust height to fit the Paper
          data={currentComparisonData}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }} // Reduce margins
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: "bold" }} />{" "}
          {/* Smaller font size for XAxis */}
          <YAxis
            tick={{ fontSize: 10, fontWeight: "bold" }} // Smaller font size for YAxis
            label={{
              value: "Avg Current (A)",
              angle: -90,
              position: "Left",
              fontSize: 10, // Smaller font size for label
              fontWeight: "bold",
              dx: -10
            }}
          />
          <Tooltip />
          {/* <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            wrapperStyle={{ right: 25, fontSize: 10 }} // Move legend to the right
          /> */}
          <Bar dataKey="average" fill="#82ca9d" name="Avg Current">
            <LabelList dataKey="average" position="top" fontSize={10} />{" "}
            {/* Display average values on top of bars */}
          </Bar>
        </BarChart>
      </Box>
    </Paper>
  );
};

export default VoltageVisualizations;