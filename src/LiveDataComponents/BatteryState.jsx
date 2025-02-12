import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
const Battery = ({ socValue, socState }) => {
  // Define colors based on state
  const getColor = (state) => {
    console.log(state+"state")
    switch (state) {
      case 0:
        return 'red'; // Low
      case 1:
        return 'green'; // Normal
      case 2:
        return 'green'; // High
      default:
        return 'gray'; // Default fallback
    }
  };

  // Get colors for SOC and DOD
  const socColor = socState? "red":"green"


  // Calculate heights based on values (assuming SOC and DOD are percentages)
  const socHeight = `${socValue}%`;


  return (

    <Box display="flex" gap="10px">
    <Box display="flex" flexDirection="column" alignItems="center">
      {/* Battery Terminals */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "60px",
        }}
      >
        <Box
          sx={{
            width: "15px",
            height: "8px",
            backgroundColor: "#000",
            borderRadius: "2px 2px 0 0",
          }}
        />
      </Box>

      {/* Battery Body */}
      <Box
        sx={{
          position: "relative",
          width: "30px",
          height: "60px",
          borderTop: "1px solid #000",
          borderLeft: "1px solid #000",
          borderRight: "3px solid #000",
          borderBottom: "3px solid #000",
          borderRadius: "5px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          overflow: "hidden",
          backgroundColor: "#f5f5f5",
          boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.3)", // Adds elevation effect
        }}
      >
        {/* SOC Section */}
        <Box
          sx={{
            width: "100%",
            backgroundColor: socColor,
            height: socHeight,
            transition: "height 0.3s ease, background-color 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: "white", fontWeight: "bold" }}
          >
            {socValue}%
          </Typography>
        </Box>
       
      </Box>

      {/* Labels for SOC and DOD */}
    </Box>
    
  </Box>
  );
};

export default Battery;