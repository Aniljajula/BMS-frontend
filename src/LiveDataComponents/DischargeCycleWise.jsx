import React, { useEffect } from 'react'
import { Box, Typography,useTheme } from "@mui/material";
import { tokens } from "../theme.js"

export default function DischargeCycleWise({
  peakDischargeCurrent,
  averageDischargingCurrent,
  ahOutForOneDischargeCycle,
  totalSeconds,
}) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const dischargeTime = (totalSeconds = 0) => {
    try {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      // Format hours, minutes, and seconds with leading zeros
      const hr = hours < 10 ? "0" + hours : hours;
      const mn = minutes < 10 ? "0" + minutes : minutes;
      const sc = seconds < 10 ? "0" + seconds : seconds;

      return `${hr}:${mn}:${sc}`;
    } catch (error) {
      return "--";
    }
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
   >
     <Typography variant="h6" mb="10px">
       <strong>Discharge-Cycle-Wise</strong>
     </Typography>
     <Box
       display="flex"
       flexDirection="column"
     >
       {[
         { label: "Peak Discharge Current", value: peakDischargeCurrent },
         { label: "Avg Discharge Current", value: averageDischargingCurrent },
         { label: "AH Out Discharge", value: ahOutForOneDischargeCycle },
         { label: "Discharge Time", value: dischargeTime(totalSeconds)},
   
         
       ].map(({ label, value }, index) => (
         <Box
                        key={index}
                        display="flex"
                        alignItems="center"
                        justifyContent="flex-start"
                        gap="8px" // Adjust space between elements
                      >
                        <Typography
                          variant="h5"
                          fontWeight="bold"
                          style={{ minWidth: "130px" }} // Fixed width for labels
                        >
                          {label}
                        </Typography>
                        <Typography
                          variant="h5"
                          style={{ color: "inherit" }} // Ensures colon inherits label's color
                        >
                          :
                        </Typography>
                        <Typography
                          variant="h5"
                          style={{ color: colors.greenAccent[500] }}
                        >
                          {value}
                        </Typography>
                      </Box>
       ))}
     </Box>
   </Box>
   </Box>
  );
}

