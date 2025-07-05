import { useState } from 'react';
import { Search, MapPin, Star, Wifi, Car, Coffee, Dumbbell, Heart } from 'lucide-react';
import Navbar from '../component/Navbar/Navbar';
import './Hotels.css';

const Hotels = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const hotelData = [
    {
      id: 1,
      name: "Grand Palace Hotel",
      location: "Paris, France",
      rating: 4.8,
      price: "$299",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      amenities: ["Wifi", "Parking", "Restaurant", "Gym"],
      description: "Luxury hotel in the heart of Paris with stunning city views"
    },
    {
      id: 2,
      name: "Ocean View Resort",
      location: "Maldives",
      rating: 4.9,
      price: "$599",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      amenities: ["Wifi", "Beach Access", "Spa", "Restaurant"],
      description: "Overwater bungalows with crystal clear ocean views"
    },
    {
      id: 3,
      name: "Mountain Lodge",
      location: "Swiss Alps, Switzerland",
      rating: 4.7,
      price: "$199",
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      amenities: ["Wifi", "Parking", "Restaurant", "Ski Access"],
      description: "Cozy mountain retreat perfect for winter sports"
    },
    {
      id: 4,
      name: "City Center Boutique",
      location: "New York, USA",
      rating: 4.6,
      price: "$249",
      image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      amenities: ["Wifi", "Gym", "Restaurant", "Business Center"],
      description: "Modern boutique hotel in Manhattan's business district"
    },
    {
      id: 5,
      name: "Beach Paradise Resort",
      location: "Bali, Indonesia",
      rating: 4.8,
      price: "$179",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      amenities: ["Wifi", "Beach Access", "Spa", "Pool"],
      description: "Tropical paradise with private beach and spa services"
    },
    {
      id: 6,
      name: "Historic Castle Hotel",
      location: "Edinburgh, Scotland",
      rating: 4.5,
      price: "$329",
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      amenities: ["Wifi", "Parking", "Restaurant", "Historic Tours"],
      description: "Stay in a real castle with centuries of history"
    }
  ];

  const amenityIcons = {
    "Wifi": <Wifi size={16} />,
    "Parking": <Car size={16} />,
    "Restaurant": <Coffee size={16} />,
    "Gym": <Dumbbell size={16} />,
    "Beach Access": <MapPin size={16} />,
    "Spa": <Heart size={16} />,
    "Pool": <MapPin size={16} />,
    "Ski Access": <MapPin size={16} />,
    "Business Center": <Coffee size={16} />,
    "Historic Tours": <MapPin size={16} />
  };

  const filteredHotels = hotelData.filter(hotel =>
    hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hotel.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="hotels-page">
      <Navbar />
      {/* Hero Section */}
      <div className="hotels-hero" style={{ marginTop: '70px' }}>
        <div className="hero-content">
          <h1>Find Your Perfect Stay</h1>
          <p>Discover amazing hotels around the world</p>

          {/* Search Bar */}
          <div className="search-container">
            <div className="search-bar">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search hotels by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hotels Grid */}
      <div className="hotels-container">
        <div className="hotels-header">
          <h2>Featured Hotels ({filteredHotels.length})</h2>
          <div className="view-options">
            <button className="view-btn active">Grid View</button>
            <button className="view-btn">List View</button>
          </div>
        </div>

        <div className="hotels-grid">
          {filteredHotels.map(hotel => (
            <div key={hotel.id} className="hotel-card">
              <div className="hotel-image">
                <img src={hotel.image} alt={hotel.name} />
                <button className="favorite-btn">
                  <Heart size={20} />
                </button>
              </div>

              <div className="hotel-info">
                <div className="hotel-header">
                  <h3>{hotel.name}</h3>
                  <div className="hotel-rating">
                    <Star className="star-icon" />
                    <span>{hotel.rating}</span>
                  </div>
                </div>
                
                <div className="hotel-location">
                  <MapPin size={16} />
                  <span>{hotel.location}</span>
                </div>
                
                <p className="hotel-description">{hotel.description}</p>
                
                <div className="hotel-amenities">
                  {hotel.amenities.slice(0, 4).map(amenity => (
                    <div key={amenity} className="amenity">
                      {amenityIcons[amenity] || <MapPin size={16} />}
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
                
                <div className="hotel-footer">
                  <div className="hotel-price">
                    <span className="price">{hotel.price}</span>
                    <span className="period">per night</span>
                  </div>
                  <button className="book-btn">Book Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredHotels.length === 0 && (
          <div className="no-results">
            <h3>No hotels found</h3>
            <p>Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hotels;
