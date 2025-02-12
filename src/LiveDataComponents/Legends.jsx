import React from 'react'
import {Box,  useTheme,Typography} from '@mui/material'
import { tokens } from '../theme';
import { CellLegends,CellThresholdValues,BatteryLowVoltage,Charging,Discharging} from '../enums/ThresholdValues';


const Legends = ({ cellVoltageTemperatureData }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const highTemperatureCount = cellVoltageTemperatureData.filter(
        (cell) => cell.cellTemperature > CellThresholdValues.HighTemperature
    ).length;

    const communicatingCount = cellVoltageTemperatureData.filter(
        (cell) =>
            cell.cellVoltage !== 65.535 &&
            cell.cellTemperature !== 65.535 &&
            cell.cellVoltage !== 65535 &&
            cell.cellTemperature !== 65535
    ).length;

    const nonCommunicatingCount = cellVoltageTemperatureData.length - communicatingCount;

    const highVoltageCount = cellVoltageTemperatureData.filter(
        (cell) => cell.cellVoltage > CellThresholdValues.HighVoltage
    ).length;

    const lowVoltageCount = cellVoltageTemperatureData.filter(
        (cell) => cell.cellVoltage < CellThresholdValues.LowVoltage
    ).length;

    return (
        <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            padding="5px"
            border="1px solid #ccc"
            borderRadius="8px"
            //backgroundColor={colors.primary[400]}
            sx={{  overflowX: 'auto' }} // Allow horizontal scrolling if needed
        >
            {[
                { label: 'High Temp', value: highTemperatureCount, color: "#db4f4a" },
                { label: 'Active', value: communicatingCount, color: "#4cceac" },
                { label: 'Not Active', value: nonCommunicatingCount, color: "#666666"},
                { label: 'High Voltage', value: highVoltageCount, color: "#db4f4a" },
                { label: 'Low Voltage', value: lowVoltageCount, color: "#6870fa" },
                { label: 'CommnFail', icon: CellLegends.CommnFail, color: 'black' },
                { label: 'Low Volt', icon: CellLegends.BatteryLowVoltage, color: '#1e88e5' },
                { label: 'About to Die', icon: CellLegends.BatteryAboutToDie, color: 'red' },
                { label: 'Open Battery', icon: CellLegends.OpenBattery, color: 'red' },
                { label: 'High Voltage', icon: CellLegends.BatteryHighVoltage, color: 'brown' },
                { label: 'High Temp', icon: CellLegends.BatteryHighTemperature, color: 'purple' },
                { label: 'Charging', icon: CellLegends.LegendCharging, color: 'green' },
                { label: 'DisCharging', icon: CellLegends.LegendDisCharging, color: 'olive' },
            ].map((item, index) => (
                <Box
                    key={index}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                   // padding="5px"
                   // margin="2px"
                   // border="1px solid #ccc"
                    borderRadius="8px"
                    //backgroundColor={colors.primary[300]}
                    sx={{ flexShrink: 0 }} // Fixed width and prevent shrinking
                >
                    {item.icon ? (
                        <>
                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                marginBottom="2px"
                            >
                                {item.icon}
                            </Box>
                            <Typography variant="body2" align="center" sx={{ color: item.color, fontWeight: 'bold' }}>
                                {item.label}
                            </Typography>
                        </>
                    ) : (
                        <>
                            <Typography variant="body2" align="center" sx={{ color: item.color, fontWeight: 'bold' }}>
                                {item.label}
                            </Typography>
                            <Typography variant="body1" align="center" sx={{ color: item.color }}>
                                {item.value}
                            </Typography>
                        </>
                    )}
                </Box>
            ))}
        </Box>
    );
};

export default Legends;