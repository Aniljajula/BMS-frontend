

import React from 'react';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';
import greenIcon from '../assets/images/marker/greenMarker3232.png'


const MapWithMarker = ({ locationName, latitude, longitude, vendorName, batteryAHCapacity }) => {
  const [selectedMarker, setSelectedMarker] = React.useState(false);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDRsvO4B8wU4AtMjhgRkjRx0YVdrfwouN4",
  });

  // Add a ref to track component mount status
  const isMounted = React.useRef(true);

  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleMarkerClick = () => {
    if (isMounted.current) {
      setSelectedMarker(true);
    }
  };

  const handleCloseInfoWindow = () => {
    if (isMounted.current) {
      setSelectedMarker(false);
    }
  };

  const mapStyles = {
    height: "200px",
    width: "100%",
  };

  const defaultCenter = {
    lat: 17.4065,
    lng: 78.4772
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  // Only create marker icon if Google Maps is loaded
  const markerIcon = isLoaded ? {
    url:  {greenIcon}, // Use a Google Maps icon URL
    scaledSize: new window.google.maps.Size(40, 40), // Adjust size as needed
  } : null;

  return (
    <GoogleMap center={defaultCenter} zoom={5} mapContainerStyle={mapStyles}>
      {isLoaded && (
        <Marker
        position={{ lat: parseFloat(latitude), lng: parseFloat(longitude) }}
        icon={{
          url: "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers/img/marker-icon-2x-green.png", // Ensure correct URL
          scaledSize: new window.google.maps.Size(15, 25), // Define here inside the Marker
        }}
        onClick={handleMarkerClick}
      />
      
      )}
      {selectedMarker && isLoaded && (
        <InfoWindow
          position={{ lat: parseFloat(latitude), lng: parseFloat(longitude) }}
          onCloseClick={handleCloseInfoWindow}
        >
          <div>
            <strong>{locationName || "Location"}</strong>
            <br />
            Vendor: {vendorName || "N/A"}
            <br />
            Battery Capacity: {batteryAHCapacity || "N/A"} AH
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default MapWithMarker;
