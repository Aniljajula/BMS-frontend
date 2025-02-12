import React from 'react'
import { Box, Typography,useTheme } from "@mui/material";
import { tokens } from "../theme.js"
import Acvoltage from "../assets/images/png/battery.png"
import Accurrent from "../assets/images/png/Ah capacity.png"
import frequenc from "../assets/images/png/frequency.png"

export const Charger = ({charger}) => {
    
    const theme =useTheme();
    const colors=tokens(theme.palette.mode);
    const{deviceId,acVoltage,acCurrent ,frequency ,energy}=charger[0];


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
            <strong>Charger Data</strong>
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
          >
            {[
        
              { label: "AC Voltage", value: acVoltage, unit: "V" ,icon:Acvoltage},
              { label: "AC Current", value: acCurrent, unit: "A",icon:Accurrent },
              { label: "Frequency", value: frequency, unit: "Hz",icon:frequenc },
      
              
            ].map(({ label, value,unit,icon }, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                justifyContent="flex-start"
                gap="8px" // Adjust space between elements
              >
                {icon && (
                <img
                  src={icon}
                  alt={label}
                  style={{ width: "18px", height: "18px" }}
                />
              )}
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  style={{ minWidth: "100px" }} // Fixed width for labels
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
                  {value}{" "}{unit}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
        </Box>
      );
}

export default Charger;