import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Clock, DollarSign } from 'lucide-react';
import './TripMap.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (color, number) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="marker-pin" style="background-color: ${color}">
        <span class="marker-number">${number}</span>
      </div>
    `,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -40]
  });
};

const TripMap = ({ tripData, onLocationUpdate }) => {
  const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]); // Default to NYC
  const [mapZoom, setMapZoom] = useState(10);
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [draggedMarker, setDraggedMarker] = useState(null);

  // Debug logging
  console.log('TripMap received tripData:', tripData);

  // Geocoding function to convert place names to coordinates
  const geocodeLocation = async (locationName) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}&limit=1`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          name: locationName,
          displayName: data[0].display_name
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  // Process trip data and geocode locations
  useEffect(() => {
    const processLocations = async () => {
      if (!tripData || !tripData.itinerary || !Array.isArray(tripData.itinerary)) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      // Extract unique locations from itinerary with day information
      const locationMap = new Map();

      // Add main destination
      if (tripData.destination && typeof tripData.destination === 'string') {
        locationMap.set(tripData.destination, {
          name: tripData.destination,
          days: ['Main Destination'],
          activities: []
        });
      }

      // Extract locations from activities with day context
      tripData.itinerary.forEach((day, dayIndex) => {
        // Check if day and day.activities exist
        if (day && day.activities && Array.isArray(day.activities)) {
          day.activities.forEach(activity => {
            // Check if activity and activity.description exist
            if (activity && activity.description && typeof activity.description === 'string') {
              // Try to extract location from activity description
              const locationMatch = activity.description.match(/at\s+([^,.\n]+)/i);
              if (locationMatch) {
                const locationName = locationMatch[1].trim();
                if (locationMap.has(locationName)) {
                  locationMap.get(locationName).days.push(`Day ${dayIndex + 1}`);
                  locationMap.get(locationName).activities.push(activity.description);
                } else {
                  locationMap.set(locationName, {
                    name: locationName,
                    days: [`Day ${dayIndex + 1}`],
                    activities: [activity.description]
                  });
                }
              }
            }
          });
        }
      });

      // Geocode all locations
      const geocodedLocations = [];
      for (const [locationName, locationInfo] of locationMap) {
        const coords = await geocodeLocation(locationName);
        if (coords) {
          geocodedLocations.push({
            ...coords,
            ...locationInfo
          });
        }
      }

      if (geocodedLocations.length > 0) {
        setLocations(geocodedLocations);

        // Set map center to first location
        setMapCenter([geocodedLocations[0].lat, geocodedLocations[0].lng]);

        // Adjust zoom based on spread of locations
        if (geocodedLocations.length > 1) {
          setMapZoom(8);
        } else {
          setMapZoom(12);
        }
      }

      setIsLoading(false);
    };

    processLocations();
  }, [tripData]);

  // Handle marker drag events
  const handleMarkerDragStart = (index) => {
    setDraggedMarker(index);
  };

  const handleMarkerDragEnd = (index, event) => {
    const marker = event.target;
    const newPosition = marker.getLatLng();

    // Update the location with new coordinates
    const updatedLocations = [...locations];
    updatedLocations[index] = {
      ...updatedLocations[index],
      lat: newPosition.lat,
      lng: newPosition.lng
    };

    setLocations(updatedLocations);
    setDraggedMarker(null);

    // Notify parent component of the change
    if (onLocationUpdate) {
      onLocationUpdate(updatedLocations);
    }
  };

  // Create polyline path between locations
  const getPolylinePath = () => {
    return locations.map(loc => [loc.lat, loc.lng]);
  };

  if (isLoading) {
    return (
      <div className="trip-map-container">
        <div className="map-loading">
          <div className="loading-spinner"></div>
          <p>Loading your trip map...</p>
        </div>
      </div>
    );
  }

  if (!tripData) {
    return (
      <div className="trip-map-container">
        <div className="map-placeholder">
          <MapPin size={48} className="text-gray-400" />
          <h3>No Trip Data</h3>
          <p>Create a trip to see it visualized on the map!</p>
        </div>
      </div>
    );
  }

  // Additional safety check for malformed data
  if (typeof tripData !== 'object') {
    console.error('TripMap: Invalid tripData type:', typeof tripData);
    return (
      <div className="trip-map-container">
        <div className="map-placeholder">
          <MapPin size={48} className="text-gray-400" />
          <h3>Invalid Trip Data</h3>
          <p>There was an issue loading the trip data for the map.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="trip-map-container">
      <div className="map-header">
        <h3 className="map-title">
          <MapPin className="map-title-icon" />
          Trip to {tripData.destination}
        </h3>
        <div className="map-stats">
          <div className="map-stat">
            <Navigation size={16} />
            <span>{locations.length} locations</span>
          </div>
          {tripData.dates && (
            <div className="map-stat">
              <Clock size={16} />
              <span>{tripData.dates.start} - {tripData.dates.end}</span>
            </div>
          )}
          {tripData.budget && (
            <div className="map-stat">
              <DollarSign size={16} />
              <span>{tripData.budget}</span>
            </div>
          )}
        </div>

        {locations.length > 0 && (
          <div className="map-instructions">
            💡 <strong>Tip:</strong> Drag markers to reorder your itinerary!
          </div>
        )}
      </div>

      <div className="map-wrapper">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          className="trip-map"
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Markers for each location */}
          {locations.map((location, index) => (
            <Marker
              key={index}
              position={[location.lat, location.lng]}
              icon={createCustomIcon(
                draggedMarker === index ? '#ef4444' : '#10b981',
                index + 1
              )}
              draggable={true}
              eventHandlers={{
                dragstart: () => handleMarkerDragStart(index),
                dragend: (e) => handleMarkerDragEnd(index, e),
              }}
            >
              <Popup>
                <div className="map-popup">
                  <h4>{location.name}</h4>
                  <p className="popup-address">{location.displayName}</p>

                  {location.days && (
                    <div className="popup-days">
                      <strong>Visit Days:</strong> {location.days.join(', ')}
                    </div>
                  )}

                  {location.activities && location.activities.length > 0 && (
                    <div className="popup-activities">
                      <strong>Activities:</strong>
                      <ul>
                        {location.activities.slice(0, 2).map((activity, idx) => (
                          <li key={idx}>{activity}</li>
                        ))}
                        {location.activities.length > 2 && (
                          <li>...and {location.activities.length - 2} more</li>
                        )}
                      </ul>
                    </div>
                  )}

                  <div className="popup-actions">
                    <button className="popup-btn">
                      View Details
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Route line between locations */}
          {locations.length > 1 && (
            <Polyline
              positions={getPolylinePath()}
              color="#10b981"
              weight={3}
              opacity={0.7}
              dashArray="10, 10"
            />
          )}
        </MapContainer>
      </div>

      {/* Location List */}
      <div className="location-list">
        <h4>Trip Locations ({locations.length})</h4>
        <div className="location-items">
          {locations.map((location, index) => (
            <div key={index} className="location-item">
              <div className="location-marker">
                <span>{index + 1}</span>
              </div>
              <div className="location-info">
                <h5>{location.name}</h5>
                <p className="location-address">{location.displayName}</p>
                {location.days && (
                  <div className="location-days">
                    <span className="days-badge">
                      {location.days.join(', ')}
                    </span>
                  </div>
                )}
                {location.activities && location.activities.length > 0 && (
                  <div className="location-activity-count">
                    📍 {location.activities.length} activities planned
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

TripMap.propTypes = {
  tripData: PropTypes.shape({
    destination: PropTypes.string,
    dates: PropTypes.shape({
      start: PropTypes.string,
      end: PropTypes.string
    }),
    budget: PropTypes.string,
    itinerary: PropTypes.array
  }),
  onLocationUpdate: PropTypes.func
};

export default TripMap;
