import { useState } from 'react';
import { Search, MapPin, Star, Clock, DollarSign, Heart, Utensils } from 'lucide-react';
import Navbar from '../component/Navbar/Navbar';
import './Restaurants.css';

const Restaurants = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');

  const cuisines = [
    { id: 'all', name: 'All Cuisines', icon: '🍽️' },
    { id: 'italian', name: 'Italian', icon: '🍝' },
    { id: 'japanese', name: 'Japanese', icon: '🍣' },
    { id: 'french', name: 'French', icon: '🥐' },
    { id: 'indian', name: 'Indian', icon: '🍛' },
    { id: 'mexican', name: 'Mexican', icon: '🌮' },
    { id: 'chinese', name: 'Chinese', icon: '🥢' }
  ];

  const restaurantsData = [
    {
      id: 1,
      name: "Le Bernardin",
      cuisine: "french",
      location: "New York, USA",
      rating: 4.9,
      priceRange: "$$$",
      openHours: "5:30 PM - 10:30 PM",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description: "Elegant French seafood restaurant with exceptional service",
      specialties: ["Fresh Seafood", "Wine Pairing", "Fine Dining"]
    },
    {
      id: 2,
      name: "Sukiyabashi Jiro",
      cuisine: "japanese",
      location: "Tokyo, Japan",
      rating: 4.8,
      priceRange: "$$$$",
      openHours: "11:30 AM - 2:00 PM",
      image: "https://picsum.photos/400/300?random=22",
      description: "World-renowned sushi restaurant by master chef Jiro",
      specialties: ["Omakase", "Fresh Sushi", "Traditional"]
    },
    {
      id: 3,
      name: "Osteria Francescana",
      cuisine: "italian",
      location: "Modena, Italy",
      rating: 4.9,
      priceRange: "$$$",
      openHours: "7:30 PM - 11:00 PM",
      image: "https://picsum.photos/400/300?random=23",
      description: "Three Michelin star Italian restaurant with innovative cuisine",
      specialties: ["Pasta", "Local Ingredients", "Wine Selection"]
    },
    {
      id: 4,
      name: "Indian Accent",
      cuisine: "indian",
      location: "New Delhi, India",
      rating: 4.7,
      priceRange: "$$",
      openHours: "12:00 PM - 3:00 PM, 7:00 PM - 11:30 PM",
      image: "https://picsum.photos/400/300?random=24",
      description: "Contemporary Indian cuisine with traditional flavors",
      specialties: ["Spicy Curries", "Tandoor", "Vegetarian Options"]
    },
    {
      id: 5,
      name: "Pujol",
      cuisine: "mexican",
      location: "Mexico City, Mexico",
      rating: 4.8,
      priceRange: "$$$",
      openHours: "1:00 PM - 11:00 PM",
      image: "https://picsum.photos/400/300?random=25",
      description: "Modern Mexican cuisine with ancient ingredients",
      specialties: ["Mole", "Local Ingredients", "Tasting Menu"]
    },
    {
      id: 6,
      name: "Da Dong",
      cuisine: "chinese",
      location: "Beijing, China",
      rating: 4.6,
      priceRange: "$$",
      openHours: "11:00 AM - 2:00 PM, 5:00 PM - 10:00 PM",
      image: "https://picsum.photos/400/300?random=26",
      description: "Famous for the best Peking duck in Beijing",
      specialties: ["Peking Duck", "Traditional Chinese", "Roasted Meats"]
    }
  ];

  const filteredRestaurants = restaurantsData.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine = selectedCuisine === 'all' || restaurant.cuisine === selectedCuisine;
    const matchesPrice = priceFilter === 'all' || restaurant.priceRange === priceFilter;
    return matchesSearch && matchesCuisine && matchesPrice;
  });

  const getPriceColor = (price) => {
    switch(price) {
      case '$': return '#10b981';
      case '$$': return '#f59e0b';
      case '$$$': return '#ef4444';
      case '$$$$': return '#8b5cf6';
      default: return '#64748b';
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" size={16} fill="#fbbf24" color="#fbbf24" style={{ opacity: 0.5 }} />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={16} color="#d1d5db" />);
    }

    return stars;
  };

  return (
    <div className="restaurants-page">
      <Navbar />
      {/* Hero Section */}
      <div className="restaurants-hero" style={{ marginTop: '70px' }}>
        <div className="hero-content">
          <h1>Discover Amazing Restaurants</h1>
          <p>Find the perfect dining experience for every occasion</p>
          
          {/* Search Bar */}
          <div className="search-container">
            <div className="search-bar">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search restaurants by name or location..."
                value={searchQuery}
                onChange={(e) => {
                  console.log('Search query:', e.target.value);
                  setSearchQuery(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filters-container">
          {/* Cuisine Filter */}
          <div className="filter-group">
            <h3>Cuisine Type</h3>
            <div className="cuisine-filters">
              {cuisines.map(cuisine => (
                <button
                  key={cuisine.id}
                  className={`cuisine-btn ${selectedCuisine === cuisine.id ? 'active' : ''}`}
                  onClick={() => setSelectedCuisine(cuisine.id)}
                >
                  <span className="cuisine-icon">{cuisine.icon}</span>
                  <span>{cuisine.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="filter-group">
            <h3>Price Range</h3>
            <div className="price-filters">
              {['all', '$', '$$', '$$$', '$$$$'].map(price => (
                <button
                  key={price}
                  className={`price-btn ${priceFilter === price ? 'active' : ''}`}
                  onClick={() => setPriceFilter(price)}
                  style={{ color: price !== 'all' ? getPriceColor(price) : '#64748b' }}
                >
                  {price === 'all' ? 'All Prices' : price}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Restaurants Grid */}
      <div className="restaurants-container">
        <div className="restaurants-header">
          <h2>Featured Restaurants ({filteredRestaurants.length})</h2>
          <div className="sort-options">
            <select className="sort-select">
              <option>Sort by Rating</option>
              <option>Sort by Price</option>
              <option>Sort by Distance</option>
            </select>
          </div>
        </div>

        <div className="restaurants-grid">
          {filteredRestaurants.map(restaurant => (
            <div key={restaurant.id} className="restaurant-card">
              <div className="restaurant-image">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                  onLoad={(e) => {
                    e.target.style.display = 'block';
                  }}
                />
                <button className="favorite-btn">
                  <Heart size={20} />
                </button>
                <div className="cuisine-badge">
                  {cuisines.find(c => c.id === restaurant.cuisine)?.icon || ''}
                </div>
              </div>

              <div className="restaurant-info">
                <div className="restaurant-header">
                  <h3>{restaurant.name}</h3>
                  <div className="restaurant-rating">
                    <div className="stars">
                      {renderStars(restaurant.rating)}
                    </div>
                    <span className="rating-number">{restaurant.rating}</span>
                  </div>
                </div>
                
                <div className="restaurant-meta">
                  <div className="meta-item">
                    <MapPin size={16} />
                    <span>{restaurant.location}</span>
                  </div>
                  <div className="meta-item">
                    <DollarSign size={16} />
                    <span style={{ color: getPriceColor(restaurant.priceRange) }}>
                      {restaurant.priceRange}
                    </span>
                  </div>
                </div>
                
                <div className="restaurant-hours">
                  <Clock size={16} />
                  <span>{restaurant.openHours}</span>
                </div>
                
                <p className="restaurant-description">{restaurant.description}</p>
                
                <div className="restaurant-specialties">
                  {restaurant.specialties.map(specialty => (
                    <span key={specialty} className="specialty-tag">
                      {specialty}
                    </span>
                  ))}
                </div>
                
                <div className="restaurant-footer">
                  <button className="reserve-btn">
                    <Utensils size={16} />
                    Make Reservation
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRestaurants.length === 0 && (
          <div className="no-results">
            <h3>No restaurants found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurants;
