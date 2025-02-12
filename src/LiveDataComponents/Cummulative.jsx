import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme.js"; 
import count from "../assets/images/png/cycle count.png";
import ah from "../assets/images/png/Ah capacity.png";
import chargeenergy from "../assets/images/png/charge energy.png";
import dischargeenergy from "../assets/images/png/dis charge.png";
import runhours from "../assets/images/png/run hours.png";



export default function Cummulative({
  chargeDischargeCycles,
  ampereHourIn,
  ampereHourOut,
  chargingEnergy,
  dischargingEnergy,
  time
}) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const batteryRunHours = (totalSeconds = 0) => {
    try {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const hr = hours < 10 ? "0" + hours : hours;
      const mn = minutes < 10 ? "0" + minutes : minutes;
      const sc = seconds < 10 ? "0" + seconds : seconds;

      return `${hr}:${mn}:${sc}`;
    } catch (error) {
      return "--";
    }
  };

  // Mapping labels to image paths
  const iconMap = {
     "Cycle count": count,
     "Ampere Hour In": ah,
     "Ampere Hour Out": ah,
     "Charging Energy": chargeenergy,
    "Discharging Energy":dischargeenergy,
    "Battery Run Hours": runhours,
  };

  return (
    <Box>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="flex-start"
        mt="10px"
        ml="8px"
        pb="21px"
        mr="10px"
      >
        <Typography variant="h6" mb="10px">
          <strong>Cummulative Data</strong>
        </Typography>
        <Box display="flex" flexDirection="column">
          {[
            { label: "Cycle count", value: chargeDischargeCycles },
            { label: "Ampere Hour In", value: ampereHourIn, unit: "Ah" },
            { label: "Ampere Hour Out", value: ampereHourOut, unit: "Ah" },
            { label: "Charging Energy", value: chargingEnergy, unit: "Kwh" },
            { label: "Discharging Energy", value: dischargingEnergy, unit: "Kwh" },
            { label: "Battery Run Hours", value: batteryRunHours(time) }
          ].map(({ label, value, unit }, index) => (
            <Box
              key={index}
              display="flex"
              alignItems="center"
              justifyContent="flex-start"
              gap="8px"
            
            >
              {/* Render the corresponding image */}
              <img 
                src={iconMap[label]} 
                alt={label} 
                style={{ width: "18px", height: "18px" }} 
              />

              <Typography variant="h5" style={{ minWidth: "125px" }} fontWeight="bold">
                {label}
              </Typography>
              <Typography variant="h5" style={{ color: "inherit" }}>:</Typography>
              <Typography variant="h5" style={{ color: colors.greenAccent[500] }}>
                {value}
              </Typography>
              <Typography variant="h5" style={{ color: colors.greenAccent[500], marginLeft: "1px" }}>
                {unit} {/* Display unit next to the value */}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
