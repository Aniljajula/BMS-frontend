import { Grid,Box, Paper, Typography, Button, Modal,useTheme, Container} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { tokens } from "../../theme";
import ManufacturerDetails from "../../LiveDataComponents/ManufacturerDetails";
import DischargeCycleWise from "../../LiveDataComponents/DischargeCycleWise";
import Cummulative from "../../LiveDataComponents/Cummulative";
import ChargeCycleWise from "../../LiveDataComponents/ChargeCycleWise";
import MapWithMarker from "../../LiveDataComponents/MapWithMarker";
import Topbar from "../global/Topbar";
import { AppContext } from "../../services/AppContext";
import CellsData from "../../LiveDataComponents/CellsData";
import Alerts from "../../LiveDataComponents/Alerts";
import Legends from "../../LiveDataComponents/Legends";
import Charger from "../../LiveDataComponents/Charger";
import InstantNCharger from "../../LiveDataComponents/InstantNCharger";

const Bar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const {
    Mdata,
    data,
    location,
    charger,
    siteId
  }=useContext(AppContext)
 
  // if (!Mdata) return <div> <Topbar /></div>;
  // if (data.length === 0) return <div> <Topbar /></div>;
  const {packetDateTime}=data || "";
  const device = data[0];
  if (!device || !charger) return <div> <Topbar /></div>;

  const {
    id,
    firstUsedDate,
    batterySerialNumber,
    batteryBankType,
    ahCapacity,
    manifactureName,
    designVoltage,
    individualCellVoltage,
  } = Mdata;
  const {
    locationName = "Unknown Location", // Default value if locationName is falsy
    latitude = 0,                     // Default latitude (could use a fallback like 0 or a center point)
    longitude = 0,                    // Default longitude
    vendorName = "Unknown Vendor",    // Default vendor name
    batteryAHCapacity = "Not Specified", // Default battery capacity
    area
  } = location || {}; // Handle case where location itself might be undefined
  
     
  const {
    deviceId, 
    bmsManufacturerID, 
    serialNumber, 
    installationDate, 
    cellsConnectedCount, 
    problemCells, 
    cellVoltageTemperatureData, 
    stringvoltage, 
    systemPeakCurrentInChargeOneCycle, 
    averageDischargingCurrent, 
    averageChargingCurrent, 
    ahInForOneChargeCycle, 
    ahOutForOneDischargeCycle, 
    cumulativeAHIn, 
    cumulativeAHOut, 
    chargeTimeCycle, 
    dischargeTimeCycle, 
    totalChargingEnergy, 
    totalDischargingEnergy, 
    everyHourAvgTemp, 
    cumulativeTotalAvgTempEveryHour, 
    chargeOrDischargeCycle, 
    socLatestValueForEveryCycle, 
    dodLatestValueForEveryCycle, 
    systemPeakCurrentInDischargeOneCycle, 
    instantaneousCurrent, 
    ambientTemperature, 
    batteryRunHours, 
    bmsalarms,
    serverTime
  } = device;


  return (
    <Box
    sx={{
      display: "grid",
      gridTemplateRows: "min-content auto", // Topbar row is fixed, content row scrolls
      height: "100vh", // Full height of viewport
      overflow: "hidden", // Prevent grid overflow
    }}
  >
    {/* Topbar */}
    <Box
      sx={{
        gridRow: "1",
      }}
    ><Paper elevation={8}>
      <Topbar vendorName={vendorName} locationName={area}/>
      </Paper>
    </Box>
  
    {/* Scrollable Content */}
    <Grid
      container
      spacing={2}
      sx={{
        overflowY: 'auto',
        padding: '10px 10px 100px 10px',
        marginBottom: '30px',
      }}
    >
      {/* Legends */}
      <Grid item xs={12}>
        <Paper elevation={8}>
          <Legends cellVoltageTemperatureData={cellVoltageTemperatureData} />
        </Paper>
      </Grid>

      {/* CellsData and MapWithMarker */}
      <Grid item container spacing={1}>
        <Grid item xs={7}>
          <Paper elevation={8} sx={{ height: '200px', overflow: 'auto' }}>
            <CellsData
              data={cellVoltageTemperatureData}
              siteId={siteId}
              serialNumber={serialNumber}
              bmsalarms={bmsalarms}
            />
          </Paper>
        </Grid>
        <Grid item xs={5}>
          <Paper elevation={8}>
            <MapWithMarker
              locationName={locationName}
              latitude={latitude}
              longitude={longitude}
              vendorName={vendorName}
              batteryAHCapacity={batteryAHCapacity}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* InstantNCharger */}
      <Grid item xs={12}>
        <InstantNCharger
          voltage={stringvoltage}
          current={instantaneousCurrent}
          soc={socLatestValueForEveryCycle}
          dod={dodLatestValueForEveryCycle}
          ambientTemperature={ambientTemperature}
          charger={charger}
          bmsalarms={bmsalarms}
        />
      </Grid>

      {/* Alerts, ManufacturerDetails, and Cummulative */}
      <Grid item container spacing={1}>
        <Grid item xs={5}>
          <Paper elevation={8}>
            <Alerts charger={charger} bmsalarms={bmsalarms} />
          </Paper>
        </Grid>
        <Grid item xs={3.5}>
          <Grid item container  direction="column" spacing={0.1}>
            <Grid item xs={4}>
              <Paper elevation={8}>
              <DischargeCycleWise  peakDischargeCurrent={systemPeakCurrentInDischargeOneCycle}
               totalSeconds={dischargeTimeCycle}
              />
              </Paper>
            </Grid>
            <Grid item xs={8}>
              <Paper elevation={8}>
                <ManufacturerDetails
                  firstUsedDate={firstUsedDate}
                  batterySerialNumber={batterySerialNumber}
                  batteryBankType={batteryBankType}
                  serialNumber={serialNumber}
                  ahCapacity={ahCapacity}
                  manifactureName={manifactureName}
                  individualCellVoltage={individualCellVoltage}
                  designVoltage={designVoltage}
                />
              </Paper>
            </Grid>
          </Grid>  
        </Grid>
        <Grid item xs={3.5}>
          <Grid item container  direction="column" spacing={0.1}>
            <Grid item xs={4}>
              <Paper elevation={8}>
              < ChargeCycleWise  PeakChargeCurrent={systemPeakCurrentInChargeOneCycle}
               totalSeconds={chargeTimeCycle}
              />
              </Paper>
            </Grid>
            <Grid item xs={8}>
            <Paper elevation={8}>
              <Cummulative
                chargeDischargeCycles={chargeOrDischargeCycle}
                ampereHourIn={cumulativeAHIn}
                ampereHourOut={cumulativeAHOut}
                chargingEnergy={totalChargingEnergy}
                dischargingEnergy={totalDischargingEnergy}
                time={batteryRunHours}
              />
            </Paper>
            </Grid>
          </Grid>  
        </Grid>
      </Grid>
    </Grid>
  </Box>
  
  );
};

export default Bar;








