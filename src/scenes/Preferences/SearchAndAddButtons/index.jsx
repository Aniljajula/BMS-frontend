import React, { useContext } from 'react';
import { Grid, IconButton, Tooltip, TextField, Autocomplete ,Box} from '@mui/material';
import { AppContext } from "../../../services/AppContext";
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const SearchAndAddButtons = ({ handleGetDetails, handleEdit, isEditing, handleAdd, isAdding, handleDeleteSite }) => {
  const {
    siteOptions,
    serialNumberOptions,
    siteId,
    serialNumber,
    setSiteId,
    setSerialNumber,
    setData
  } = useContext(AppContext);

  return (
    <Grid container  alignItems="center">
      {/* Text Fields: Site ID and Serial Number */}
      <Grid item xs={12} sm={2} md={3}>
        <Autocomplete
          disablePortal
          disableClearable
          options={siteOptions.map((site) => site.siteId)}
          value={siteId}
          onChange={(event, newValue) => setSiteId(newValue)}
          renderInput={(params) => (
            <Box width='200px'>
            <TextField
              {...params}
              label="SubStation ID"
              InputLabelProps={{
                sx: {
                  fontWeight: "bold",
                },
              }}
              fullWidth
              sx={{
                "& .MuiInputBase-root": {
                  fontWeight: "bold",
                  height: "40px", // Adjust the height here
                  marginTop:'5px'
                },
              }}
            />
             </Box>
          )}
        />
      </Grid>

      <Grid item xs={12} sm={2} md={3}>
        <Autocomplete
          disablePortal
          disableClearable
          options={serialNumberOptions}
          value={serialNumber}
          onChange={(event, newValue) => setSerialNumber(newValue)}
          renderInput={(params) => (
            <Box width='200px'>
            <TextField
              {...params}
              label="Serial Number"
              InputLabelProps={{
                sx: {
                  fontWeight: "bold",
                },
              }}
              fullWidth
              sx={{
                "& .MuiInputBase-root": {
                  fontWeight: "bold",
                  height: "40px", // Adjust the height here
                  marginTop:'5px'
                },
              }}
            />
            </Box>
          )}
        />
      </Grid>

      {/* Action Icons: Get, Edit, Add, Delete */}
      <Grid item xs={12} sm={3} md={3} display="flex" justifyContent="space-around" alignItems="center"
            sx={{
              gap: 2, // Add spacing between icons
            }}
          >
            {/* Get Details Icon */}
            <Tooltip title="Search Details">
  <IconButton
    color="secondary"
    onClick={handleGetDetails}
    sx={{
      "&:hover": {
        backgroundColor: "rgba(63, 81, 181, 0.1)", // Light blue background on hover
      },
    }}
  >
    <SearchIcon fontSize="small" /> {/* Change icon to SearchIcon */}
  </IconButton>
</Tooltip>

            {/* Edit Icon */}
            <Tooltip title={isEditing ? "Cancel Edit" : "Edit"}>
              <IconButton
                color="secondary"
                onClick={handleEdit}
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(76, 175, 80, 0.1)", // Light green background on hover
                  },
                }}
              >
                <EditIcon fontSize="15px" />
              </IconButton>
            </Tooltip>

            {/* Add Site Icon */}
            <Tooltip title={isAdding ? "Cancel Add" : "Add Site"}>
              <IconButton
                color="secondary"
                onClick={handleAdd}
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(255, 193, 7, 0.1)", 
                  },
                }}
              >
                <AddIcon fontSize="15px" />
              </IconButton>
            </Tooltip>

            {/* Delete Icon */}
            <Tooltip title="Delete Site">
              <IconButton
                color="error"
                onClick={handleDeleteSite}
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(244, 67, 54, 0.1)", // Light red background on hover
                  },
                }}
              >
                <DeleteIcon fontSize="15px" />
              </IconButton>
            </Tooltip>
        </Grid>

    </Grid>
  );
};

export default SearchAndAddButtons;
