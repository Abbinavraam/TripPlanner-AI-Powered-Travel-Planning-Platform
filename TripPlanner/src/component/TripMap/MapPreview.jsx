import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Loader } from 'lucide-react';
import './TripMap.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapPreview = ({ destination }) => {
  const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]); // Default to NYC
  const [isLoading, setIsLoading] = useState(false);
  const [locationFound, setLocationFound] = useState(false);

  // Geocoding function to convert place names to coordinates
  const geocodeLocation = async (locationName) => {
    if (!locationName || locationName.trim() === '') return;
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}&limit=1`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setMapCenter([lat, lng]);
        setLocationFound(true);
      } else {
        setLocationFound(false);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setLocationFound(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (destination) {
      geocodeLocation(destination);
    } else {
      setLocationFound(false);
    }
  }, [destination]);

  if (!destination) {
    return (
      <div className="map-preview-container">
        <div className="map-preview-placeholder">
          <MapPin size={32} className="text-gray-400" />
          <p>Enter a destination to see map preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="map-preview-container">
      <div className="map-preview-header">
        <h4>Destination Preview</h4>
        {isLoading && (
          <div className="preview-loading">
            <Loader size={16} className="spinning" />
            <span>Finding location...</span>
          </div>
        )}
      </div>
      
      <div className="map-preview-wrapper">
        {isLoading ? (
          <div className="map-preview-loading">
            <div className="loading-spinner-small"></div>
            <p>Loading map...</p>
          </div>
        ) : (
          <MapContainer
            center={mapCenter}
            zoom={locationFound ? 10 : 2}
            className="map-preview"
            scrollWheelZoom={false}
            zoomControl={false}
            dragging={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {locationFound && (
              <Marker position={mapCenter}>
                <Popup>
                  <div className="preview-popup">
                    <h5>{destination}</h5>
                    <p>Your destination</p>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        )}
      </div>
      
      {!isLoading && !locationFound && destination && (
        <div className="map-preview-error">
          <p>📍 Location not found. Try a more specific destination name.</p>
        </div>
      )}
    </div>
  );
};

MapPreview.propTypes = {
  destination: PropTypes.string.isRequired
};

export default MapPreview;
