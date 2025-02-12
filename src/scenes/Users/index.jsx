import React, { useState, useEffect } from "react";
import { tokens } from "../../theme";
import {Modal ,Box, Typography, Button, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import axios from "axios";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [userData, setUserData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userError, setUserError] =useState("");
  const [roles, setRoles] = useState([]); // Store roles from backend
  const [formData, setFormData] = useState({
    uname: "",
    email: "",
    phone: "",
    role: "",
    password: ""
  });
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("http://122.175.45.16:51270/getListofLoginRoles"); 
        const data = await response.json();
        setRoles(data); // Since data is an array of strings, store it directly
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        "http://122.175.45.16:51270/GetAllLoginDetailsInPlainLoginDetailFormate"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const result = await response.json();
      setUserData(result); // Store the response data in state
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData(); // Fetch the user data when the component mounts
  }, []);
  const handleOpen = (mode, row = null) => {
    if (mode === "edit" && row) {
      // Edit mode
      setIsEditing(true);
      setSelectedRow(row);
      setFormData({
        loginCredentialsId: row.loginCredentialsId,
        uname: row.userName || "",
        email: row.email || "",
        phone: row.mobile || "",
        role: row.role || "",
        password: row.password || "",
      });
    } else if (mode === "add") {
      // Add mode
      setIsEditing(false);
      setSelectedRow(null);
      setFormData({
        uname: "",
        email: "",
        phone: "",
        role: "",
        password: "",
      });
    }
    setOpen(true);
  };
  

  
 
  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
  
    // Validation checks
    if (
      !formData.uname ||
      /\s/.test(formData.uname) ||
      !formData.password ||
      /\s/.test(formData.password) ||
      !formData.email ||
      /\s/.test(formData.email) ||
      !formData.phone ||
      /\s/.test(formData.phone) ||
      !formData.role
    ) {
      return; // Prevent submission if validation fails
    }
  
    const url = isEditing
      ? "http://122.175.45.16:51270/PostUpdateLoginUser"
      : "http://122.175.45.16:51270/PostCreateNewLoginUser";
  
    const data = {
      role: formData.role,
      lstLoginCredentials: [
        {
          ...(isEditing && { id: formData.loginCredentialsId }), // Include 'id' only if editing
          userName: formData.uname,
          password: formData.password,
          mobile: formData.phone,
          email: formData.email,
          accessPermissions: {
            dashBoard: true,
            reportsHistorical: true,
          },
        },
      ],
    };
  
    try {
      setUserError("");
      const response = await axios.post(url, data);
      const result = response.data;
      //console.log("User data submitted successfully:", result.value +", "+result.message);
      if(result.value==0){
        setUserError(result.message);
      }else{
      fetchUserData(); // Refresh the data grid
      setIsSubmitted(false);
      handleClose();}
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error submitting user data";
        setUserError(errorMessage);
      //console.error("Error:", errorMessage);
      //alert(errorMessage); // Display the error message (or use a snackbar/toast for better UI)
    }
  };
  
  const handleDeleteClick = async (loginCredentialsId) => {
    const confirmation = window.confirm("Are you sure you want to delete this user?");
    if (confirmation) {
      try {
        const response = await fetch(
          `http://122.175.45.16/DeleteLoginUserByLoginCredId?loginCredId=${loginCredentialsId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete user");
        }

        const result = await response.json();
        console.log("User deleted successfully:", result);
        fetchUserData(); // Refresh the data grid after deletion
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const columns = [
    { field: "loginCredentialsId", headerName: "User ID", flex: 1 },
    { field: "userName", headerName: "User Name", flex: 1 },
    { field: "mobile", headerName: "Phone Number", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "role",
      headerName: "Access Level",
      flex: 1,
      renderCell: ({ row: { role } }) => {
        return (
          <Box
            width="100%"
            mt="5px"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              role === "ADMIN"
                ? colors.greenAccent[600]
                : role === "SUPERADMIN"
                ? colors.greenAccent[700]
                : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {role === "ADMIN" && <AdminPanelSettingsOutlinedIcon />}
            {role === "SUPERADMIN" && <SecurityOutlinedIcon />}
            {role === "USER" && <LockOpenOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {role}
            </Typography>
          </Box>
        );
      },
    },
    // Separate column for "Edit" button
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box
          display="flex"
          flexDirection="row" // Changed to row to align icons horizontally
          alignItems="center" // Align icons vertically in the center
          justifyContent="flex-start" // Align icons to the start of the cell
          gap={1} // Adds space between the icons
          width="100%"
        >
          <IconButton
            color="secondary"
            onClick={() => handleOpen("edit", params.row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => handleDeleteClick(params.row.loginCredentialsId)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
    
  ];
  

  return (
    <Box m="15px"
    >
<Button
  onClick={() => handleOpen("add")}
  color="primary"
  variant="contained"
  sx={{ 
    marginRight: 1, 
    backgroundColor: '#d82b27', 
    color: 'white', // Set text color to white
    '&:hover': {
      backgroundColor: '#a1221f', // Optional: Darken background on hover
      
    },
  }}
>
  Add User
</Button>
      <Box
        m="30px 0 0 0"
        height="70vh"
        sx={{
          border: "1px solid black", // Add a thick black border
          borderRadius: "6px", // Optional: add rounded corners
          boxShadow: "0 4px 10px rgba(19, 17, 17, 0.5)",
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": {
            
            borderBottom: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            whiteSpace: "normal", // Allow text to wrap
            wordWrap: "break-word",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#4caf50", // Green background color for column headers
            //color: "white", // White text color for column headers
            fontSize: "14px", // Adjust the font size
            fontWeight: "bold", // Bold text
            borderBottom: "none", // New background color for column headers
     // color: "#ffffff",
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.redAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid
          getRowHeight={() => 'auto'}
          checkboxSelection
          rows={userData}
          columns={columns}
          getRowId={(row) => row.loginCredentialsId}
        />
      </Box>


      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="edit-user-modal"
        aria-describedby="edit-user-description"
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: "500px",
            backgroundColor: colors.primary[500],
            margin: "auto",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            position: "absolute",
          }}
        >
          <Typography variant="h5" sx={{ marginBottom: "24px", textAlign: "center", color: colors.grey[50] }}>
            {isEditing ? "Edit User" : "Add User"}
          </Typography>
          <Typography variant="h5" sx={{ marginBottom: "24px", textAlign: "center", color: "red" }}>
            {userError}
          </Typography>
          {/* Username Field */}
          <TextField
            required
            margin="dense"
            id="uname"
            name="uname"
            label="User Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.uname}
            onChange={(e) => setFormData({ ...formData, uname: e.target.value })}
            error={isSubmitted && (!formData.uname || /\s/.test(formData.uname))}
            helperText={
              isSubmitted &&
              (!formData.uname
                ? "User Name is required"
                : /\s/.test(formData.uname)
                ? "User Name should not contain spaces"
                : "")
            }
            sx={{ marginBottom: "16px" ,
                 "& .MuiInputBase-root": {
                  "&:-webkit-autofill": {
                    WebkitBoxShadow: `0 0 0 100px ${colors.primary[500]} inset`,
                    WebkitTextFillColor: colors.grey[50], // Matches text color with the theme
                  },
                },
            }}
          />

          {/* Password Field */}
          <TextField
            required
            margin="dense"
            id="password"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={isSubmitted && (!formData.password || /\s/.test(formData.password))}
            helperText={
              isSubmitted &&
              (!formData.password
                ? "Password is required"
                : /\s/.test(formData.password)
                ? "Password should not contain spaces"
                : "")
            }
            sx={{ marginBottom: "16px" }}
          />

          {/* Email Field */}
          <TextField
            required
            margin="dense"
            id="email"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={isSubmitted && (!formData.email || /\s/.test(formData.email))}
            helperText={
              isSubmitted &&
              (!formData.email
                ? "Email Address is required"
                : /\s/.test(formData.email)
                ? "Email Address should not contain spaces"
                : "")
            }
            sx={{ marginBottom: "16px" }}
          />

          {/* Phone Field */}
          <TextField
            required
            margin="dense"
            id="phone"
            name="phone"
            label="Phone Number"
            type="tel"
            fullWidth
            variant="outlined"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            error={isSubmitted && (!formData.phone || /\s/.test(formData.phone))}
            helperText={
              isSubmitted &&
              (!formData.phone
                ? "Phone Number is required"
                : /\s/.test(formData.phone)
                ? "Phone Number should not contain spaces"
                : "")
            }
            sx={{ marginBottom: "16px" }}
          />

          {/* Role Dropdown */}
          Role
          <TextField
      select
      required
      margin="dense"
      id="access"
      name="role"
      label="Role"
      value={formData.role}
      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
      fullWidth
      variant="outlined"
      error={isSubmitted && !formData.role}
      helperText={isSubmitted && !formData.role ? "Role is required" : ""}
      sx={{ marginBottom: "24px" }}
    >
      {roles.length > 0 ? (
        roles.map((role, index) => (
          <MenuItem key={index} value={role}>
            {role}
          </MenuItem>
        ))
      ) : (
        <MenuItem disabled>Loading...</MenuItem>
      )}
    </TextField>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
            <Button
              onClick={handleClose}
              variant="outlined"
              sx={{ 
                marginRight: 1, 
                backgroundColor: '#d82b27', 
                color: 'white', // Set text color to white
                '&:hover': {
                  backgroundColor: '#a1221f', // Optional: Darken background on hover
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              sx={{ 
                marginRight: 1, 
                backgroundColor: '#d82b27', 
                color: 'white', // Set text color to white
                '&:hover': {
                  backgroundColor: '#a1221f', // Optional: Darken background on hover
                },
              }}
            >
              {isEditing ? "Save Changes" : "Add User"}
            </Button>
          </Box>
        </Box>
      </Modal>

    </Box>
  );
};

export default Team;