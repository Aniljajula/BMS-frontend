import {IconButton , Typography,useTheme,Box } from '@mui/material'
import React, { useState} from "react";

import { tokens } from '../../theme';

import { useState } from 'react'
import CellVTGraph from '../CellVTGraph';
import CloseIcon from "@mui/icons-material/Close";

import {BatteryLowVoltage,Charging,Discharging,OpenBattery,AboutToDie,HighTemperature,HighVoltage,CommunicationFailed} from '../../enums/ThresholdValues';
import { Paper, Typography, Box,useTheme } from '@mui/material';
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
const statusConfig = {
  'UT to Die': { svg: AboutToDie, color: '#C62828' },
  'Open Battery': { svg: OpenBattery, color: '#FF6D00' },
  'High Voltage': { svg: HighVoltage, color: '#F57F17' },
  'High Temperature': { svg: HighTemperature, color: '#D84315' },
  'Communication Failed': { svg: CommunicationFailed, color: '#455A64' },
  'Charging': { svg: Charging, color: '#4CAF50' },
  'Discharging': { svg: Discharging, color: '#FF5252' },
  'Low Voltage': { svg: BatteryLowVoltage, color: '#FF0000' },
};

const CellLayout = ({ cellData, thresholds, chargingStatus, siteId, serialNumber }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleClickOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  // Determine the status based on cell data and thresholds
  const determineStatus = () => {
    const { cellVoltage, cellTemperature } = cellData;
    const {
      LowVoltage,
      BatteryAboutToDie,
      OpenBattery,
      HighVoltage,
      HighTemperature,
    } = thresholds;

    console.log(cellVoltage+" v"+ LowVoltage,
      BatteryAboutToDie,
      OpenBattery,
      HighVoltage,
      HighTemperature,)
    // 1. Check for Communication Failure
    if (cellVoltage === 65.535 || cellTemperature === 65535) {
      return "Communication Failed";
    }
  
    // 2. Voltage Conditions
    if (cellVoltage >= HighVoltage) {
      return "High Voltage";
    }
    if (cellVoltage <= OpenBattery) {
      return "Open Battery";
    }
    if (cellVoltage <= BatteryAboutToDie) {
      return "UT to Die";
    }
    if (cellVoltage <= LowVoltage) {
      return "Low Voltage";
    }
  
    // 3. Temperature Condition
    if (cellTemperature >= HighTemperature) {
      return "High Temperature";
    }
  
    // 4. Charging Status
    return chargingStatus ? "Discharging" : "Charging";
  };
  

  const status = determineStatus();
  const { svg: StatusSVG, color } = statusConfig[status] || { svg: () => null, color: '#ffffff' };

  return (
    <>
      {/* Battery Cell Layout */}
      <Paper
  elevation={0}
  sx={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '65px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
    ':hover': {
      transform: 'scale(1.05)',
    },
  }}
  onClick={handleClickOpen}
>
  {/* Battery Terminal */}
  <Box
    sx={{
      display: 'flex',
      gap: '4px',
      marginBottom: '-4px', // Adjust this to remove the gap
    }}
  >
    <Box
      sx={{
        width: '12px',
        height: '10px',
        backgroundColor: 'green',
        borderRadius: '3px 3px 0 0',
      }}
    />
    <Typography variant="h7" sx={{ color: '#333' }}>
      C {cellData.cellNumber}
    </Typography>
    <Box
      sx={{
        width: '12px',
        height: '10px',
        backgroundColor: 'red',
        borderRadius: '3px 3px 0 0',
      }}
    />
  </Box>

  {/* Battery Body */}
  <Box
    sx={{
      width: '60px',
      borderTop: '0.5px solid #000',
      borderLeft: '1px solid #000',
      borderRight: '3px solid #000',
      borderBottom: '3px solid #000',
      borderRadius: '5px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      overflow: 'hidden',
      backgroundColor: '#f5f5f5',
      boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.3)',
      padding: '0px 1px 1px 1px',
      boxSizing: 'border-box',
      transition: 'box-shadow 0.2s ease',
      ':hover': {
        boxShadow: 6,
      },
    }}
  >
    {/* Status Animation */}
    <Box>
      <StatusSVG />
    </Box>

    {/* Content */}
    <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
      {cellData.cellVoltage === 65.535 || cellData.cellTemperature === 65535 ? (
        <>
          <Typography variant="h7" sx={{ color: '#555' }}>
              ⚡ N/A
            </Typography>
            <Typography variant="h7" sx={{ color: '#555' }}>
              🌡️ N/A
            </Typography>
        </>
      ) : (
        <>
          <Typography variant="h7" sx={{ color: '#555' }}>
            ⚡ <span style={{ fontWeight: 'bold', color: '#333' }}>{cellData.cellVoltage} V</span>
          </Typography>
          <Typography variant="h7" sx={{ color: '#555' }}>
            🌡️ <span style={{ fontWeight: 'bold', color: '#333' }}>{cellData.cellTemperature} °C</span>
          </Typography>
        </>
      )}
    </Box>
  </Box>
</Paper>

      {/* Full-Screen Overlay */}
      <FullScreenOverlay open={isOpen} onClose={handleClose}>
        <CellVTGraph serial={serialNumber} site={siteId} cellNumber={cellData.cellNumber} />
      </FullScreenOverlay>
    </>
  );
};

export default CellLayout;




const FullScreenOverlay = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        // backgroundColor: 'white',
        zIndex: 1300,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: '90%',
          height: '90%',
          // backgroundColor: 'white',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {children}
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: 'black',
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </Box>
  );
};




























// const CellLayout = ({ cellData, thresholds, chargingStatus,siteId,serialNumber }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const handleClickOpen = () => {
//     setIsOpen(true);  
//   };

//   const handleClose = () => {
//     setIsOpen(false);
//   };
//   // console.log(cellData.cellNumber+" "+siteId +" "+serialNumber)
 
//     const theme = useTheme();
//     const colors = tokens(theme.palette.mode);
//     // 
    
//     const determineLegend = () => {
//       if (cellData.cellVoltage===65.535  || cellData.cellTemperature === 65535) {
//         return CellLegends.CommnFail;
//       } else if (
//         cellData.cellVoltage <= thresholds.LowVoltage &&
//         cellData.cellVoltage > thresholds.BatteryAboutToDie
//       ) {
//         return CellLegends.BatteryLowVoltage;
//       } else if (
//         cellData.cellVoltage <= thresholds.BatteryAboutToDie &&
//         cellData.cellVoltage > thresholds.OpenBattery
//       ) {
//         return CellLegends.BatteryAboutToDie;
//       } else if (cellData.cellVoltage <= thresholds.OpenBattery) {
//         return CellLegends.OpenBattery;
//       } else if (cellData.cellVoltage >= thresholds.HighVoltage) {
//         return CellLegends.BatteryHighVoltage;
//       } else if (cellData.cellTemperature >= thresholds.HighTemperature) {
//         return CellLegends.BatteryHighTemperature;
//       } else {
//         return chargingStatus
//           ? CellLegends. LegendCharging
//           : CellLegends.LegendDisCharging;
//       }
//     };
  
//     const legend = determineLegend();
//     //const classes = useStyles();
//     return (
    
//     <>
//       {/* Cell Layout */}
//       <div
//       style={{
//         marginTop:"2px",
//         display: "block",
//         width: "61px",
//         overflow: "hidden",
//         boxShadow: "2px 2px 2px 2px white",
//         cursor: "pointer",
//       }}
//     >
//       {/* Legend */}
//       <div
//         style={{
//           paddingTop:"1px",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           background: colors.primary[400],
         
//         }}
//       >
//         <img
//           style={{ width: "40px", height: "20px" }}
//           src={legend}
//           alt="Cell Legend"
//         />
//       </div>

//       {/* Cell Information */}
//       <div style={{ padding: "8px" }}>
//         <div
//           style={{
//             fontSize: "12px",
//             textAlign: "center",
//             border: "0.1px solid ",
//             borderRadius: "25px",
//             // padding: "4px 0",
//           borderColor: colors.greenAccent[300],
//           }}
//         >
//           Cell{" "}
//           <span style={{ fontWeight: "bolder", marginLeft: "3px" }}>
//             {cellData.cellNumber}
//           </span>
//         </div>

//         <div
//           style={{
//             display: "flex",
//             justifyContent: "flex-start",
//             alignItems: "center",
//             color: "white",
//             // padding: "4px 0",
//           }}
//         >
//           <img
//             style={{ width: "12px", height: "12px", marginRight: "4px" }}
//             src={thunder}
//             alt="Voltage Icon"
//           />
//           <span
//             style={{
//               fontSize: "12px",
//               fontWeight: "bold",
//               color: colors.greenAccent[500],
//             }}
//           >
//             {cellData.cellVoltage}V
//           </span>
//         </div>

//         <div
//           style={{
//             display: "flex",
//             justifyContent: "flex-start",
//             alignItems: "center",
//             color: "white",
//             // padding: "4px 0",
//           }}
//         >
//           <img
//             style={{ width: "12px", height: "12px", marginRight: "4px" }}
//             src={TemperatureWhite}
//             alt="Temperature Icon"
//           />
//           <span
//             style={{
//               fontSize: "12px",
//               fontWeight: "bold",
//               color: colors.greenAccent[500],
//             }}
//           >
//             {cellData.cellTemperature}°C
//           </span>
//         </div>
//       </div>
//     </div>

//       {/* Dialog Box */}
//       <FullScreenOverlay open={isOpen} onClose={() => setIsOpen(false)}>
//       <CellVTGraph serial={serialNumber} site={siteId} cellNumber={cellData.cellNumber} />
//     </FullScreenOverlay>

//     </>
//   );
// };

// export default CellLayout;

// const FullScreenOverlay = ({ open, onClose, children }) => {
//   if (!open) return null;

//   return (
//     <Box
//       sx={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         width: "100%",
//         height: "100%",
//         backgroundColor: "rgba(0, 0, 0, 0.8)",
//         zIndex: 1300,
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Box
//         sx={{
//           width: "90%",
//           height: "90%",
//           backgroundColor: "black",
//           borderRadius: "12px",
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         <Box
//           sx={{
//             flex: 1,
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           {children}
//         </Box>
//         <IconButton
//           onClick={onClose}
//           sx={{
//             position: "absolute",
//             top: 16,
//             right: 16,
//             color: "white",
//           }}
//         >
//           <CloseIcon />
//         </IconButton>
//       </Box>
//     </Box>
//   );
// };
