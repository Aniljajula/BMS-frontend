import { Box, IconButton, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import deadline from "../../data/icons/deadline.png";
import { AppContext } from "../../services/AppContext";
import { fetchManufacturerDetails, fetchDeviceDetails } from "../../services/apiService";

const Topbar = ({ onLogout, vendorName, locationName = "" }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();

  const {
    siteOptions,
    serialNumberOptions,
    siteId,
    serialNumber,
    setSiteId,
    setSerialNumber,
    setData,
    setMdata,
    setCharger,
    liveTime,
    setLiveTime,
  } = useContext(AppContext);

  const [errors, setErrors] = useState({
    siteId: false,
    serialNumber: false,
  });

  const handleSearch = async () => {
    // Check for empty fields and update errors state
    const newErrors = {
      siteId: !siteId,
      serialNumber: !serialNumber,
    };
    setErrors(newErrors);

    // Stop execution if any field is empty
    if (!siteId || !serialNumber) {
      return;
    }

    try {
      setMdata(null); // Clear previous manufacturer details
      setData([]); // Clear previous device data
      setCharger(null);

      // Fetch details
      const result = await fetchManufacturerDetails(siteId, serialNumber);
      const deviceResponse = await fetchDeviceDetails(siteId, serialNumber);

      setMdata(result); // Store manufacturer details
      setData(deviceResponse.deviceData); // Store device data
      setCharger(deviceResponse.chargerMonitoringData);

      // Return the fetched data for further usage
      return deviceResponse.deviceData;
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate("/");
  };

  function convertOwlDatetimeToCustomDate(dateString) {
    if (dateString == null || dateString == "") {
      return "";
    }
    const utcDate = new Date(dateString);

    const year = utcDate.getFullYear();
    const month = String(utcDate.getMonth() + 1).padStart(2, '0');
    const day = String(utcDate.getDate()).padStart(2, '0');
    const hours = String(utcDate.getHours()).padStart(2, '0');
    const minutes = String(utcDate.getMinutes()).padStart(2, '0');
    const seconds = String(utcDate.getSeconds()).padStart(2, '0');
    const milliseconds = String(utcDate.getMilliseconds()).padStart(3, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(3,auto)"
      gridTemplateRows="auto "
    >
      {/* Search Options */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(3, auto)"
        gap={2}
        sx={{ marginRight: 2 }}
      >
        <Autocomplete
          disablePortal
          disableClearable
          options={siteOptions.map((site) => site.siteId)}
          value={siteId}
          onChange={(event, newValue) => setSiteId(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Site ID"
              error={errors.siteId}
              helperText={errors.siteId ? "Please enter Site ID" : ""}
            />
          )}
          sx={{ width: 200 }}
        />

        <Autocomplete
          disablePortal
          disableClearable
          options={serialNumberOptions}
          value={serialNumber}
          onChange={(event, newValue) => setSerialNumber(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Serial Number"
              error={errors.serialNumber}
              helperText={errors.serialNumber ? "Please enter Serial Number" : ""}
            />
          )}
          sx={{ width: 200 }}
        />

        <IconButton onClick={handleSearch}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* Location and Time */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(3, auto)"
        gap="10px"
        paddingTop="5px"
        marginLeft="0px"
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            border: "1px solid",
            borderColor: colors.grey[500],
            borderRadius: "4px",
            height: "40px",
            width: "150px",
          }}
        >
          {locationName.name}
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            border: "1px solid",
            borderColor: colors.grey[500],
            borderRadius: "4px",
            height: "40px",
            width: "150px",
          }}
        >
          {convertOwlDatetimeToCustomDate(liveTime)}
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            border: "1px solid",
            borderColor: colors.grey[500],
            borderRadius: "4px",
            height: "40px",
            width: "150px",
          }}
        >
          <IconButton>
            <PersonOutlinedIcon />
          </IconButton>
          {vendorName}
        </Box>
      </Box>

      {/* Icons */}
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        marginLeft="10px"
      >
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton onClick={handleLogout}>
          <LogoutOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;