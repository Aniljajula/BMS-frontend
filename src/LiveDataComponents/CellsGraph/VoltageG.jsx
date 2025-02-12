import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme,Box } from '@mui/material';
import { tokens } from '../../theme';

const VoltageG = ({ data }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Filter out invalid voltage values (65.535)
  const filteredData = data.map(cell => ({
    ...cell,
    cellVoltage: cell.cellVoltage === 65.535 ? 0 : cell.cellVoltage
  }));

  return (
    <Box sx={{ height: '200px', width: '100%', }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="cellNumber" 
            tick={{ fill: colors.grey[100] }} 
            label={{ value: 'Cell Number', position: 'insideBottom', offset: -10, fill: colors.grey[100] }}
          />
          <YAxis 
            tick={{ fill: colors.grey[100] }} 
            label={{ value: 'Voltage (V)', angle: -90, position: 'insideLeft', fill: colors.grey[100] }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: colors.primary[400], border: 'none' }}
            formatter={(value) => [`${value} V`, 'Voltage']}
          />
          <Legend />
          <Bar 
            dataKey="cellVoltage" 
            fill={colors.greenAccent[500]} 
            name="Voltage (V)"
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default VoltageG;