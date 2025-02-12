import React,{useContext} from 'react'
import { tokens } from '../theme';

import { Card, CardContent, Typography, Grid, Box, CircularProgress,useTheme,Paper } from '@mui/material';
import chargerIcon from '../enums/portable-charger.png';

import PowerIcon from "@mui/icons-material/Power"; // Voltage icon
import BoltIcon from "@mui/icons-material/Bolt"; // Current icon
import ThermostatIcon from "@mui/icons-material/Thermostat"; // Temperature icon
import BatteryFullIcon from "@mui/icons-material/BatteryFull"; // Energy icon

import BatteryState from './BatteryState'
import VoltageVisualizations from './SineWave';
import Energycard from './EnergyCard';
import Charger from './Charger';
import { AppContext } from '../services/AppContext';

const InstantNCharger = () => {

   const {

      data,

      charger,

    }=useContext(AppContext)
  const device = data[0];
  if (!device || !charger[0]) return <div></div>;
const{instantaneousCurrent, stringvoltage,ambientTemperature,  bmsalarms,socLatestValueForEveryCycle}=device

 const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const{acVoltage,acCurrent ,frequency ,energy}=charger[0];
  const {
    stringVoltageLHN, 
    stringCurrentHN, ambientTemperatureHN, socLN// String Current
  } = bmsalarms;

      const [voltages, setVoltages] = React.useState({
        ac: {
          value: acVoltage,
          min: 220,
          max: 280,
          frequency: frequency,
          current: acCurrent
        },
      
      });
      // Create sine wave points for AC visualization
      // const createSineWave = () => {
      //   const points = [];
      //   const steps = 200; // Increase steps for a smoother wave
      //   const amplitude = 40;
      //   const wavelength = 75; // Set wavelength equal to the animation offset
        
      //   for (let i = 0; i <= steps; i++) {
      //     const x = (i / steps) * 400; // Extend beyond 300 for seamless animation
      //     const y = 50 + amplitude * Math.sin((i / steps) * Math.PI * 4);
      //     points.push(`${x},${y}`);
      //   }
      
      //   return points.join(' ');
      // };

      // const getSineWaveColor=()=>{
      //   return acVoltage/100<200 ? "blue": voltage/100>260? "red" :"green"
      // }
      const [Idata, setIdata] = React.useState({
        voltage: {
          value: stringvoltage,
          unit: "V",
          threshold: {
            normal: { min: 220, max: 240 },
            warning: { min: 210, max: 250 },
            critical: { min: 0, max: 210 },
          },
        },
        current: {
          value: instantaneousCurrent,
          unit: "A",
          threshold: {
            normal: { min: 8, max: 12 },
            warning: { min: 6, max: 14 },
            critical: { min: 0, max: 6 },
          },
        },
        temperature: {
          value: ambientTemperature,
          unit: "°C",
          threshold: {
            normal: { min: 20, max: 50 },
            warning: { min: 10, max: 60 },
            critical: { min: 0, max: 10 },
          },
        },
      });
    
      // Function to determine icon color based on thresholds
      const getIconColor = (value) => {
        if (value) {
          return  colors.redAccent[500]; // Normal range
        } else {
          return colors.greenAccent[500];
        }
      };
  
      const getColorForDCV=(value)=>{
        if(value===0){
          return colors.redAccent[500]
        }else if(value===1){
          return colors.greenAccent[500];
        }else{
          return colors.redAccent[500]
        }
      }
      return (
        <Box sx={{ p: 0 }}>
            <Grid container spacing={1}>
              {/* Battery State Paper */}
              <Grid item xs={12} sm={6} md={2.5}>
                <Paper elevation={8} sx={{ height: "150px", display: "flex", flexDirection: "column", justifyContent: "space-between", p: 1 }}>
                <Box display="flex" justifyContent="space-between">
                  <Box>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }} >
                      State of Charge
                    </Typography>
                    <Box display="flex" justifyContent="center" pt={2}>
                      <BatteryState
                        socValue={socLatestValueForEveryCycle}
                        socState={socLN}
                      />
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
                      Charger : {energy}kWh
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                      pt={2}
                    >
                      <img src={chargerIcon} style={{  width: "50px",height: "70px",}}/>
                     
                    </Box>
                  </Box>
                </Box>
                </Paper>
              </Grid>
              {/* String Paper */}
              <Grid item xs={12} sm={6} md={2}>
                <Paper elevation={8} sx={{ height: "150px",  display: "flex", flexDirection: "column", justifyContent: "space-between", p: 1 }}>
                  <Box>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
                      Instantaneous Data
                    </Typography>
                    <Grid container spacing={1} alignItems="center" justifyContent="center">
                      {/* Voltage Section */}
                      <Grid item xs={4}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                            pt: 2
                          }}
                        >
                          <PowerIcon
                            sx={{
                              fontSize: "2rem",
                              color: getColorForDCV(stringVoltageLHN)
                            }}
                          />
                          <Typography variant="h5" sx={{ mt: 1 }}>
                            {Idata.voltage.value} {Idata.voltage.unit}
                          </Typography>
                        </Box>
                      </Grid>

                      {/* Current Section */}
                      <Grid item xs={4}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                            pt: 2
                          }}
                        >
                          <BoltIcon
                            sx={{
                              fontSize: "2rem",
                              color: getIconColor(stringCurrentHN)
                            }}
                          />
                          <Typography variant="h5" sx={{ mt: 1 }}>
                            {Idata.current.value} {Idata.current.unit}
                          </Typography>
                        </Box>
                      </Grid>

                      {/* Temperature Section */}
                      <Grid item xs={4}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                            pt: 2
                          }}
                        >
                          <ThermostatIcon
                            sx={{
                              fontSize: "2rem",
                              color: getIconColor(ambientTemperatureHN)
                            }}
                          />
                          <Typography variant="h5" sx={{ mt: 1 }}>
                            {Idata.temperature.value} {Idata.temperature.unit}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Grid>
              
              {/* Energy Paper */}
              <Grid item xs={12} sm={6} md={2.5}>
               
                  <Box><VoltageVisualizations 
     
                  /></Box>    
              </Grid>
          
                <Grid item  xs={12} sm={6} md={2.5}>
               
                    <Energycard 
  
                    />
                
                </Grid>
                {/* AC Voltage Paper */}
              <Grid item xs={12} sm={6} md={2.5}>
                <Paper elevation={8} sx={{ height: "150px",  display: "flex", flexDirection: "column", justifyContent: "space-between", p: 1 }}>
                 
                 <Charger charger={ charger}/>
                </Paper>
              </Grid>
                {/* Add more grid items as needed */}
            </Grid>

            <style>
              {`
                @keyframes translateWave {
                  0% {
                    transform: translateX(0);
                  }
                  100% {
                    transform: translateX(-75px);
                  }
                }
              `}
            </style>
        </Box>
      );
}

export default InstantNCharger