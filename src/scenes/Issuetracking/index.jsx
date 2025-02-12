import React, { useState, useEffect,useContext } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,  Tooltip,
  CircularProgress,useTheme
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';
import { AppContext } from "../../services/AppContext";
import { tokens } from "../../theme";
import SearchIcon from '@mui/icons-material/Search';


const TicketTable = () => 
  {
  const [siteId, setSiteId] = useState('CHARAN4048')
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tickets, setTickets] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
    const {
      siteOptions,
      
    } = useContext(AppContext);

      const theme = useTheme();
      const colors = tokens(theme.palette.mode);
  // Fetch tickets whenever `page` or `rowsPerPage` changes
  const last7daysTickets=async(currentPage)=>{
    try{
      const response= await axios.get(`http://122.175.45.16:51270/latest7days?page=${currentPage}&size=${rowsPerPage}`)
      setTickets(response.data.content); // Use `.content` for paginated data
      setTotalPages(response.data.totalElements); // Set the total number of records
    }
    catch(error){
      console.error("Error fetching data:", error)
    }
  };
 
  function TimeFormat(dateString) {
    // Parse the UTC date-time string into a Date object

    if(dateString==null){
      return "";
    }
    const utcDate = new Date(dateString);

    // Return the formatted date as 'YYYY-MM-DD HH:MM:SS.mmm'
    const year = utcDate.getFullYear();
    const month = String(utcDate.getMonth() + 1).padStart(2, '0');
    const day = String(utcDate.getDate()).padStart(2, '0');
    const hours = String(utcDate.getHours()).padStart(2, '0');
    const minutes = String(utcDate.getMinutes()).padStart(2, '0');
    const seconds = String(utcDate.getSeconds()).padStart(2, '0');
    const milliseconds = String(utcDate.getMilliseconds()).padStart(3, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  }
  

  const fetchTickets = async (currentPage) => {
    console.log(currentPage)
    if (!startDate || !endDate) {
      console.error("Start date or end date is missing");
      return; // Prevent the API call if dates are missing
    }
  
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
  
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
  
    const url = `http://122.175.45.16:51270/tickets?siteId=${siteId}&start=${formattedStartDate}T00:00:00&end=${formattedEndDate}T23:59:59&page=${currentPage}&size=${rowsPerPage}`;
  
    try {
      setTickets([]);
      setTotalPages(0);
      const response = await axios.get(url);
      setTickets(response.data.content); // Use `.content` for paginated data
      setTotalPages(response.data.totalElements); // Set the total number of records
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleFetchTickets = () => {
    // Only fetch tickets if startDate and endDate are selected
    if (startDate && endDate) {
      fetchTickets(page); // Call fetchTickets with the current page value
    } else {
      last7daysTickets(page);
    }
  }

  // Call fetchTickets on initial load with the correct page value
  useEffect(() => {
    handleFetchTickets(); // Use the `page` state to fetch tickets initially
  }, []); // Empty dependency array ensures this runs once on component mount

  const [hoverData, setHoverData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetchCoordinates = async (siteId) => {
    setHoverData(null);
    setLoading(true);
    try {
      const response = await axios.get(
        `http://122.175.45.16:51270/api/getCoordinates`,
        {
          params: {
            siteId,
            marginMinutes: 15,
          },
        }
      );
      setHoverData(response.data);
    } catch (error) {
      console.error("Failed to fetch coordinates:", error);
      setHoverData(null);
    } finally {
      setLoading(false);
    }
  };

  const renderHoverContent = () => {
    if (loading) {
      return <CircularProgress size={20} />;
    }
  
    if (!hoverData) {
      return (
        <Typography variant="body2" color="textSecondary">
          View site details
        </Typography>
      );
    }
  
    return
     (
      <Box
        sx={{
          textAlign: "left",
          maxWidth: 200,
          p: 1, // Adds padding inside the box
          border: "1px solid #ddd", // Border around the content
          borderRadius: "8px", // Rounded corners
          boxShadow: "0px 2px 4px rgba(0,0,0,0.1)", // Adds subtle shadow
        }}
      >
        <Typography variant="h6">
          <strong>State:</strong> {hoverData.state}
        </Typography>
        <Typography variant="h6">
          <strong>Circle:</strong> {hoverData.circle}
        </Typography>
        <Typography variant="h6">
          <strong>Area:</strong> {hoverData.area}
        </Typography>
        <Typography variant="h6">
          <strong>Vendor:</strong> {hoverData.vendorName}
        </Typography>
        <Typography variant="h6">
          <strong>Status:</strong>{" "}
          {hoverData.statusType === 0 ? "Inactive" : "Active"}
        </Typography>
      </Box>
    );
  };

  const CustomPagination = ({ totalPages, currentPage }) => {
    const handlePrevious = () => {
      const newPage = currentPage - 1;
      if (newPage >= 0) {
        setPage(0)
        setPage(newPage);
        if (startDate && endDate) {
        fetchTickets(newPage);}
        else{
          last7daysTickets(newPage)
        }
      }
    };
  
    const handleNext = () => {
      const newPage = currentPage + 1;
      if (newPage < totalPages) {
        setPage(0)
        setPage(newPage);
        if (startDate && endDate) {
        fetchTickets(newPage);
        }
        else{
          last7daysTickets(newPage)
        }
      }
    };
  
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        mt={2}
        sx={{
          ml: '700px',
          padding: '10px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          position: 'sticky',
          bottom: '10px',
          zIndex: 1000,
        }}
      >
        <Button
          onClick={handlePrevious}
          disabled={currentPage === 0}
          sx={{ 
            marginRight: 1, 
            backgroundColor: '#d82b27', 
            color: 'white', // Set text color to white
            '&:hover': {
              backgroundColor: '#a1221f', // Optional: Darken background on hover
            },
          }}
        >
          Previous
        </Button>
        <Typography
          variant="body1"
          mx={2}
          sx={{ fontWeight: 'bold', color: 'black' }}
        >
          Page {currentPage + 1} of {totalPages}
        </Typography>
        <Button
          onClick={handleNext}
          disabled={currentPage + 1 >= totalPages}
          sx={{ 
    marginRight: 1, 
    backgroundColor: '#d82b27', 
    color: 'white', // Set text color to white
    '&:hover': {
      backgroundColor: '#a1221f', // Optional: Darken background on hover
    },
  }}
        >
          Next
        </Button>
      </Box>
    );
  };
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
  <Box display="flex" flexDirection="column" alignItems="center" p={2}>
    <Box display="flex" gap={2} mb={2}>
      {/* Autocomplete for Site ID */}
      <Autocomplete
        freeSolo
        options={siteOptions.map((site) => site.siteId)}
        value={siteId}
        onChange={(event, newValue) => setSiteId(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Site ID"
            sx={{
              width: 200,
              "& .MuiInputBase-root": {
                height: "40px",
              },
            }}
          />
        )}
      />
      
      {/* Start Date Picker */}
      <DatePicker
        label="Start Date"
        value={startDate}
        onChange={(date) => setStartDate(date)}
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{
              width: 200,
              "& .MuiInputBase-root": {
                height: "40px",
                display: "flex",
                alignItems: "center", // Ensures text is aligned properly
              },
              "& input": {
                height: "40px",
                padding: "10px", // Adjust padding if needed
              },
            }}
          />
        )}
      />
      
      {/* End Date Picker */}
      <DatePicker
        label="End Date"
        value={endDate}
        onChange={(date) => setEndDate(date)}
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{
              width: 200,
              "& .MuiInputBase-root": {
                height: "40px",
                display: "flex",
                alignItems: "center",
              },
              "& input": {
                height: "40px",
                padding: "10px",
              },
            }}
          />
        )}
      />
      <IconButton
        onClick={handleFetchTickets}
        disabled={!startDate || !endDate}
        sx={{
          backgroundColor: "#d82b27",
          color: "white",
          "&:hover": {
            backgroundColor: "#a1221f",
          },
        }}
      >
  <SearchIcon />
</IconButton>

        </Box>
        
        <TableContainer
        
  component={Paper}
  sx={{
    
    
    maxHeight: 390,
    border: "1px solid black", // Set border width and color (adjust color as needed)
    borderRadius: '8px',
    marginTop: '0px' // Optional: rounded corners
  }}
>
              <Table stickyHeader>
              <TableHead>
  <TableRow>
    <TableCell sx={{ fontSize: 14, fontFamily: "Source Sans Pro", backgroundColor: "#d82b27", color: "white" }}>ID</TableCell>
    <TableCell sx={{ fontSize: 14, fontFamily: "Source Sans Pro", backgroundColor: "#d82b27", color: "white" }}>Message</TableCell>
    <TableCell sx={{ fontSize: 14, fontFamily: "Source Sans Pro", backgroundColor: "#d82b27", color: "white" }}>Raise Time</TableCell>
    <TableCell sx={{ fontSize: 14, fontFamily: "Source Sans Pro", backgroundColor: "#d82b27", color: "white" }}>Close Time</TableCell>
    <TableCell sx={{ fontSize: 14, fontFamily: "Source Sans Pro", backgroundColor: "#d82b27", color: "white" }}>Status</TableCell>
    <TableCell sx={{ fontSize: 14, fontFamily: "Source Sans Pro", backgroundColor: "#d82b27", color: "white" }}>Site ID</TableCell>
    <TableCell sx={{ fontSize: 14, fontFamily: "Source Sans Pro", backgroundColor: "#d82b27", color: "white" }}>Serial Number</TableCell>
  </TableRow>
</TableHead>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id} sx={{fontSize: 10}}>
                      <TableCell sx={{fontSize: 14, fontFamily:"Source Sans Pro"}}>{ticket.id}</TableCell>
                      <TableCell sx={{fontSize: 14, fontFamily:"Source Sans Pro"}}>{ticket.message}</TableCell>
                      <TableCell sx={{fontSize: 14, fontFamily:"Source Sans Pro"}}>{TimeFormat(ticket.raiseTime)}</TableCell>
                      <TableCell sx={{fontSize: 14, fontFamily:"Source Sans Pro"}}>{TimeFormat(ticket.closeTime)}</TableCell>
                      <TableCell sx={{fontSize: 14, fontFamily:"Source Sans Pro"}}>{ticket.status}</TableCell>
                      <TableCell sx={{fontSize: 14, fontFamily:"Source Sans Pro"}}>
                        <Tooltip title={renderHoverContent()} arrow interactive>
                          <span
                            style={{
                              color: "#1976d2",
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                            onClick={() => handleFetchCoordinates(ticket.siteId)}
                          >
                            {ticket.siteId}
                          </span>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{fontSize: 14, fontFamily:"Source Sans Pro"}}>{ticket.serialNumber}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
         </TableContainer>
        <CustomPagination sx={{mt:"20px"}}
            totalPages={Math.ceil(totalPages / rowsPerPage)}
            currentPage={page}
          />
      </Box>
    </LocalizationProvider>
  );
};

export default TicketTable;