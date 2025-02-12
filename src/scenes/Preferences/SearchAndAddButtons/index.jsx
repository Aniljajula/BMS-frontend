import React, { useContext, useState } from 'react';
import { Grid, IconButton, Tooltip, TextField, Autocomplete, Box } from '@mui/material';
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

  // State to track if search button is clicked and fields are invalid
  const [isSearchClicked, setIsSearchClicked] = useState(false);

  // Function to handle search button click
  const handleSearchClick = () => {
    if (!siteId || !serialNumber) {
      setIsSearchClicked(true); // Set state to true if fields are empty
    } else {
      setIsSearchClicked(false); // Reset state if fields are valid
      handleGetDetails(); // Call the original handleGetDetails function
    }
  };

  return (
    <Grid container alignItems="center">
      {/* Text Fields: Site ID and Serial Number */}
      <Grid item xs={12} sm={2} md={3}>
        <Autocomplete
          disablePortal
          disableClearable
          options={siteOptions.map((site) => site.siteId)}
          value={siteId}
          onChange={(event, newValue) => {
            setSiteId(newValue);
            setIsSearchClicked(false); // Reset validation state on change
          }}
          renderInput={(params) => (
            <Box width='200px'>
              <TextField
                {...params}
                label="SubStation ID"
                error={isSearchClicked && !siteId} // Show error if search clicked and field is empty
                helperText={isSearchClicked && !siteId ? "Please enter SubStation ID" : ""} // Error message
                InputLabelProps={{
                  sx: {
                    fontWeight: "bold",
                  },
                }}
                fullWidth
                sx={{
                  "& .MuiInputBase-root": {
                    fontWeight: "bold",
                    height: "40px",
                    marginTop: '5px',
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: isSearchClicked && !siteId ? "red" : undefined, // Red border if search clicked and field is empty
                    },
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
          onChange={(event, newValue) => {
            setSerialNumber(newValue);
            setIsSearchClicked(false); // Reset validation state on change
          }}
          renderInput={(params) => (
            <Box width='200px'>
              <TextField
                {...params}
                label="Serial Number"
                error={isSearchClicked && !serialNumber} // Show error if search clicked and field is empty
                helperText={isSearchClicked && !serialNumber ? "Please enter Serial Number" : ""} // Error message
                InputLabelProps={{
                  sx: {
                    fontWeight: "bold",
                  },
                }}
                fullWidth
                sx={{
                  "& .MuiInputBase-root": {
                    fontWeight: "bold",
                    height: "40px",
                    marginTop: '5px',
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: isSearchClicked && !serialNumber ? "red" : undefined, // Red border if search clicked and field is empty
                    },
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
          gap: 2,
        }}
      >
        {/* Get Details Icon */}
        <Tooltip title="Search Details">
          <IconButton
            color="secondary"
            onClick={handleSearchClick} // Use the new handleSearchClick function
            sx={{
              "&:hover": {
                backgroundColor: "rgba(63, 81, 181, 0.1)",
              },
            }}
          >
            <SearchIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Edit Icon */}
        <Tooltip title={isEditing ? "Cancel Edit" : "Edit"}>
          <IconButton
            color="secondary"
            onClick={handleEdit}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(76, 175, 80, 0.1)",
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
                backgroundColor: "rgba(244, 67, 54, 0.1)",
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