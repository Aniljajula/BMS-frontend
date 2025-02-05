import React, { useState, useEffect, useContext } from 'react';
import {fetchStatesDetails, fetchCirclesDetails, fetchAreasDetails, fetchSiteDetailsBatteryandChargerdetails, updateSiteLocation, addSiteLocation, deleteSite } from '../../../services/apiService';
import { Grid, Typography, TextField, Button,Box } from '@mui/material';
import SearchAndAddButtons from '../SearchAndAddButtons/index';
import { AppContext } from "../../../services/AppContext";
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
const BASE_URL = "http://122.175.45.16:51270";
import axios from "axios";
const columnMappingsPart1 = {
  siteId: 'Site ID',
  vendorName: 'Vendor Name',
  latitude: 'Latitude',
  longitude: 'Longitude',
  circle: 'Circle Name',
  area: 'Area Name',
  state: 'State Name',
  batteryAHCapacity: 'Battery AH Capacity',
};

const columnMappingsPart2 = {
  firstUsedDate: 'First Used Date',
  batterySerialNumber: 'Battery Serial Number',
  batteryBankType: 'Battery Bank Type',
  ahCapacity: 'AH Capacity',
  manufacturerName: 'Manufacturer Name',
  designVoltage: 'Design Voltage',
};

const columnMappingsPart3 = {
  individualCellVoltage: 'Individual Cell Voltage',
  highVoltage: 'High Voltage',
  lowVoltage: 'Low Voltage',
  batteryAboutToDie: 'Battery About To Die',
  openBattery: 'Open Battery',
  highTemperature: 'High Temperature',
  lowTemperature: 'Low Temperature',
  notCommnVoltage: 'Not Communicating Voltage',
  notCommnTemperature: 'Not Communicating Temperature',
};

const SiteLocation = () => {
  const [siteDetails, setSiteDetails] = useState([]);
  const [formData, setFormData] = useState({});
  const [stateOptions, setStateOptions] = useState([]); // Options for state
  const [circleOptions, setCircleOptions] = useState([]); // Options for circle
  const [areaOptions, setAreaOptions] = useState([]); 
  const [searchData, setSearchData] = useState({
    siteId: '',
    batterySerialNumber: '',
  });
  const {
    siteOptions,
    serialNumberOptions,
    siteId,
    serialNumber,
    setSiteId,
    setSerialNumber,
    setData
  } = useContext(AppContext);

  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSiteDetailsBatteryandChargerdetails();
        setSiteDetails(data);
      } catch (error) {
        console.error('Error fetching site details:', error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    console.log('Updated formData:', formData);
  }, [formData]); // This runs whenever formData changes
  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  const handleStateChange = (event, newValue) => {
    setState(newValue); // Set the selected state
    setCircle(""); // Clear previous circle selection
    setArea(""); // Clear previous area selection

    fetchCirclesDetails()
      .then((data) => {
        const filteredCircles = data.filter((circle) => circle.stateName === newValue.name);
        setCircleOptions(filteredCircles); // Update circles based on state
      })
      .catch((error) => console.error("Error fetching circles:", error));
  };

  const handleCircleChange = (event, newValue) => {
    setCircle(newValue); // Set the selected circle
    setArea(""); // Clear previous area selection

    fetchAreasDetails()
      .then((data) => {
        const filteredAreas = data.filter((area) => area.circleName === newValue.name);
        setAreaOptions(filteredAreas); // Update areas based on circle
      })
      .catch((error) => console.error("Error fetching areas:", error));
  };
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchData({
      ...searchData,
      [name]: value,
    });
  };

  const handleGetDetails = async () => {
    try {
      if (!siteId || !serialNumber) {
        console.error('SiteId or SerialNumber is empty!');
        return;
      }
      console.log('Fetching details for siteId:', siteId, 'and serialNumber:', serialNumber);
  
      const response = await fetchSiteDetailsBatteryandChargerdetails(siteId, serialNumber);
  
      if (response && response.data) {
        const siteData = response.data;
        console.log('Fetched site data:', siteData);
  
        const combinedData = {
          state: siteData.state || '',
          circle: siteData.circle || '',
          area: siteData.area || '',
          latitude: siteData.latitude || '',
          longitude: siteData.longitude || '',
          vendorName: siteData.vendorName || '',
          batteryAHCapacity: siteData.batteryAHCapacity || '',
          siteId: siteData.siteId || '',
          batterySerialNumber: siteData.manufacturerDTO?.batterySerialNumber || 'N/A',
          batteryBankType: siteData.manufacturerDTO?.batteryBankType || 'N/A',
          ahCapacity: siteData.manufacturerDTO?.ahCapacity || 'N/A',
          manufacturerName: siteData.manufacturerDTO?.manufacturerName || 'N/A',
          individualCellVoltage: siteData.manufacturerDTO?.individualCellVoltage || 'N/A',
          designVoltage: siteData.manufacturerDTO?.designVoltage || 'N/A',
          highVoltage: siteData.manufacturerDTO?.highVoltage || 'N/A',
          lowVoltage: siteData.manufacturerDTO?.lowVoltage || 'N/A',
          batteryAboutToDie: siteData.manufacturerDTO?.batteryAboutToDie || 'N/A',
          openBattery: siteData.manufacturerDTO?.openBattery || 'N/A',
          highTemperature: siteData.manufacturerDTO?.highTemperature || 'N/A',
          lowTemperature: siteData.manufacturerDTO?.lowTemperature || 'N/A',
          notCommnVoltage: siteData.manufacturerDTO?.notCommnVoltage || 'N/A',
          notCommnTemperature: siteData.manufacturerDTO?.notCommnTemperature || 'N/A'

        };
  
        console.log('Combined form data:', combinedData);
        setFormData(combinedData);
      } else {
        console.log('No data found for the given siteId and serialNumber.');
      }
    } catch (error) {
      console.error('Error fetching site details:', error);
    }
  };
  
  

  const handleEdit = () => setIsEditing(!isEditing);

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({});
  };

  const handleUpdate = async () => {
    try {
      console.log('Form Data before API call:', formData);

      const combinedData = {
        state: formData?.state || '',
        circle: formData?.circle || '',
        area: formData?.area || '',
        latitude: formData?.latitude || '',
        longitude: formData?.longitude || '',
        vendorName: formData?.vendorName || '',
        batteryAHCapacity: formData?.batteryAHCapacity || '',
        siteId: formData?.siteId || '',
        manufacturerDTO: {
          firstUsedDate: formData?.firstUsedDate || 'N/A',
          batterySerialNumber: formData?.batterySerialNumber || 'N/A',
          batteryBankType: formData?.batteryBankType || 'N/A',
          ahCapacity: formData?.ahCapacity || 'N/A',
          manufacturerName: formData?.manufacturerName || 'N/A',
          individualCellVoltage: formData?.individualCellVoltage || 'N/A',
          designVoltage: formData?.designVoltage || 'N/A',
          highVoltage: formData?.highVoltage || 'N/A',
          lowVoltage: formData?.lowVoltage || 'N/A',
          batteryAboutToDie: formData?.batteryAboutToDie || 'N/A',
          openBattery: formData?.openBattery || 'N/A',
          highTemperature: formData?.highTemperature || 'N/A',
          lowTemperature: formData?.lowTemperature || 'N/A',
          notCommnVoltage: formData?.notCommnVoltage || 'N/A',
          notCommnTemperature: formData?.notCommnTemperature || 'N/A',
        }
      };
  
      console.log('Payload being sent to addSiteLocation API:', combinedData);
        //const updatedData = { ...formData }; // Use formData as-is
    
        const response = await axios.put(`${BASE_URL}/api/updateSiteLocationToSiteId`, combinedData);
         // Pass siteId and payload
        alert('Site details updated successfully!');
        setIsEditing(false);
    } catch (error) {
        console.error('Error updating site details:', error);

        // Log error response if available
        if (error.response) {
            console.error('Error response:', error.response.data);
            alert(`Failed to update site details: ${error.response.data.message}`);
        } else if (error.message) {
            alert(`Failed to update site details: ${error.message}`);
        } else {
            alert('Failed to update site details. An unexpected error occurred.');
        }
    }
};



const handleAddSite = async () => {
  try {
    // Ensure that formData contains all required fields
    console.log('Form Data before API call:', formData);

    const combinedData = {
      state: formData?.state || '',
      circle: formData?.circle || '',
      area: formData?.area || '',
      latitude: formData?.latitude || '',
      longitude: formData?.longitude || '',
      vendorName: formData?.vendorName || '',
      batteryAHCapacity: formData?.batteryAHCapacity || '',
      siteId: formData?.siteId || '',
      manufacturerDTO: {
        firstUsedDate: formData?.firstUsedDate || 'N/A',
        batterySerialNumber: formData?.batterySerialNumber || 'N/A',
        batteryBankType: formData?.batteryBankType || 'N/A',
        ahCapacity: formData?.ahCapacity || 'N/A',
        manufacturerName: formData?.manufacturerName || 'N/A',
        individualCellVoltage: formData?.individualCellVoltage || 'N/A',
        designVoltage: formData?.designVoltage || 'N/A',
        highVoltage: formData?.highVoltage || 'N/A',
        lowVoltage: formData?.lowVoltage || 'N/A',
        batteryAboutToDie: formData?.batteryAboutToDie || 'N/A',
        openBattery: formData?.openBattery || 'N/A',
        highTemperature: formData?.highTemperature || 'N/A',
        lowTemperature: formData?.lowTemperature || 'N/A',
        notCommnVoltage: formData?.notCommnVoltage || 'N/A',
        notCommnTemperature: formData?.notCommnTemperature || 'N/A',
      }
    };

    console.log('Payload being sent to addSiteLocation API:', combinedData);

   

    const response = await axios.post(
      `${BASE_URL}/api/postAddNewLocationToSiteId`,
      combinedData, // Use plain object
      { headers: { 'Content-Type': 'application/json' } }
    );

    // Optionally, handle success after API call
    alert('Site added successfully!');
  } catch (error) {
    // Handle any error from the API call
    if (error.response) {
      console.error('Server response error:', error.response.data);
      alert(`Error: ${error.response.data.message || 'Unknown server error'}`);
    } else {
      console.error('Unexpected error:', error.message);
      alert('Unexpected error occurred while adding the site.');
    }
  }
};


  const handleDeleteSite = async () => {
    try {
      await deleteSite(siteId);
      alert('Site deleted successfully!');
      setFormData({});
    } catch (error) {
      console.error('Error deleting site:', error);
    }
  };
  useEffect(() => {
    console.log('Updated formData:', formData); // This will log each time formData updates
  }, [formData]);

 const renderFormFields = (columns) => (
  <Grid container spacing={2}>
    {Object.keys(columns).map((key) => {
      if (key === 'siteId') {
        return (
          <Grid item xs={12} sm={8} md={4} lg={3} key={key}>
            <Typography variant="body1" sx={{ fontWeight: 800, fontSize: '12px' }}>
              {columns[key]}
            </Typography>
            <Box width="200px">
  <FormControl fullWidth margin="dense"> {/* Use margin="dense" for a compact layout */}
    <InputLabel sx={{ fontSize: '12px' }}>Site ID</InputLabel> {/* Reduce label font size */}
    <Select
      label="Site ID"
      name="siteId"
      value={formData[key] || ''}
      onChange={handleInputChange}
      disabled={!isEditing && !isAdding}
      sx={{
        height: '40px', // Set the height of the Select field
        fontSize: '12px', // Adjust font size of the text
        '& .MuiInputBase-root': {
          height: '40px', // Override height of the root input container
        },
        '& .MuiInputBase-input': {
          padding: '5px 10px', // Adjust padding inside the input box
          fontSize: '12px', // Reduce font size for the input text
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#d3d3d3', // Optional: Set a custom border color
        },
      }}
    >
      {siteOptions.map((site) => (
        <MenuItem
          key={site.siteId}
          value={site.siteId}
          sx={{ fontSize: '12px', padding: '5px 10px' }} // Reduce font size and padding in the dropdown options
        >
          {site.siteId}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</Box>

          </Grid>
        );
      }

      if (key === 'batterySerialNumber') {
        const filteredSerialNumbers = React.useMemo(() => {
          if (!formData.siteId) return [];
          return serialNumberOptions.filter(
            (serialNumber) => serialNumber.siteId === formData.siteId
          );
        }, [formData.siteId, serialNumberOptions]);

        return (
          <Grid item xs={12} sm={8} md={4} lg={3} key={key}>
            <Typography variant="body1" sx={{ fontWeight: 800, fontSize: '12px' }}>
              {columns[key]}
            </Typography>
            <Box width="200px" > {/* Adjust the marginTop of the Box */}
            <FormControl 
              fullWidth 
              sx={{ 
                marginTop: '8px', // Reduce the space between the heading and the Select field
              }}
            >
              <InputLabel sx={{ fontSize: '12px' }}>Battery Serial Number</InputLabel>
              <Select
                label="Battery Serial Number"
                name="batterySerialNumber"
                value={formData[key] || ''}
                onChange={handleInputChange}
                disabled={!isEditing && !isAdding}
                sx={{
                  height: '40px', // Set the height of the Select field
                  fontSize: '12px', // Adjust font size of the text
                  '& .MuiInputBase-root': {
                    height: '40px',
                  },
                  '& .MuiInputBase-input': {
                    padding: '5px 10px', // Adjust padding inside the input box
                    fontSize: '12px',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#d3d3d3', // Optional: Set a custom border color
                  },
                }}
              >
                {filteredSerialNumbers.map((serialNumber) => (
                  <MenuItem 
                    key={serialNumber.serialNumber} 
                    value={serialNumber.serialNumber}
                  >
                    {serialNumber.serialNumber}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          </Grid>
        );
      }

      return (
        <Grid item xs={12} sm={8} md={4} lg={3} key={key}>
          <Typography variant="body1" sx={{ fontWeight: 800, fontSize: '12px' }}>
            {columns[key]}
          </Typography>
          <Box width="200px" sx={{ marginTop: '1.5px' }}> 
            <TextField
              label={columns[key]}
              name={key}
              value={formData[key] || ''}
              onChange={handleInputChange}
              fullWidth
              margin="dense" 
              disabled={!isEditing && !isAdding}
              sx={{
                '& .MuiInputBase-root': {
                  height: '40px', 
                },
                '& .MuiInputBase-input': {
                  padding: '5px 10px', 
                  fontSize: '12px', 
                },
                '& .MuiFormLabel-root': {
                  fontSize: '12px', 
                },
              }}
            />
          </Box>


        </Grid>
      );
    })}
  </Grid>
);
return (
  <div style={{ padding: '20px', fontSize: '18px' }}> {/* Set the base font size here */}
    <SearchAndAddButtons
      searchData={searchData}
      handleSearchChange={handleSearchChange}
      handleGetDetails={handleGetDetails}
      handleEdit={handleEdit}
      isEditing={isEditing}
      handleAdd={handleAdd}
      isAdding={isAdding}
      handleDeleteSite={handleDeleteSite}
    />
    <Box 
      sx={{ 
        marginTop: 1, 
        overflowY: 'auto', 
        maxHeight: 'calc(100vh - 200px)',  // Adjust this value as needed
      }}
    >
      <Typography variant="h5" sx={{ marginTop: '20px', color: '#d82b27', fontSize: '15px' ,fontWeight:'800'}}>
        Site Location
      </Typography>
      {renderFormFields(columnMappingsPart1)}

      <Typography variant="h5" sx={{ marginTop: '20px', color: '#d82b27', fontSize: '15px' ,fontWeight:'800'}}>
        Manufacturer Details
      </Typography>
      {renderFormFields(columnMappingsPart2)}

      <Typography variant="h5" sx={{ marginTop: '20px', color: '#d82b27', fontSize: '15px' ,fontWeight:'800'}}>
        Threshold Values
      </Typography>
      {renderFormFields(columnMappingsPart3)}

      {(isEditing || isAdding) && (
        <Button
          variant="contained"
          color="#d82b27"
          onClick={isAdding ? handleAddSite : handleUpdate}
          sx={{ marginTop: '20px', fontSize: '13px',background:'#d82b27' ,color:'#ffff'}}  // Adjust button font size
        >
          {isAdding ? 'Add Site' : 'Save Changes'}
        </Button>
      )}
    </Box>
  </div>
);


};

export default SiteLocation;
 