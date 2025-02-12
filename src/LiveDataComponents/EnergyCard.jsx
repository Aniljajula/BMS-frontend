import React, { useContext} from 'react'
import { tokens } from '../theme';
import { Card, CardHeader, CardContent, Typography, Box,useTheme } from "@mui/material";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import BatteryFullIcon from "@mui/icons-material/BatteryFull";
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';




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

const Energycard =()  => {
  
    const {
      data,
    }=useContext(AppContext)

    const device = data[0];
  if (!device) return <div> 
  </div>;

const {
  ahInForOneChargeCycle,ahOutForOneDischargeCycle}=device
  // Constants for Ampere-Hour values
  const ampereHourIn = ahInForOneChargeCycle;
  const ampereHourOut =  ahOutForOneDischargeCycle;

  // Data for the Ampere-Hour Comparison Chart
  const ampereHourComparisonData = [
    {
      name: "AH In",
      value: ampereHourIn,
    },
    {
      name: "AH Out",
      value: ampereHourOut,
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Ampere-Hour Comparison Chart */}
      <Paper elevation={8} sx={{ height: "150px", pt: 1, pb: 1, overflow: "hidden" }}>
        <Box sx={{ height: "100%", width: "100%", overflow: "hidden" }}>
          <BarChart
            width={230}
            height={134}
            data={ampereHourComparisonData}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: "bold" }} />
            <YAxis
              tick={{ fontSize: 10, fontWeight: "bold" }}
              label={{
                value: "Ampere-Hour (Ah)",
                angle: -90,
                position: "Left",
                fontSize: 10,
                fontWeight: "bold",
              }}
            />
            <Tooltip />
            {/* <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              wrapperStyle={{ right: 25, fontSize: 10 }}
            /> */}
            <Bar dataKey="value" fill="#8884d8" name="Ampere-Hour">
              <LabelList dataKey="value" position="top" fontSize={10} />{" "}
            </Bar>
          </BarChart>
        </Box>
      </Paper>
    </Box>
  );
};

export default Energycard;