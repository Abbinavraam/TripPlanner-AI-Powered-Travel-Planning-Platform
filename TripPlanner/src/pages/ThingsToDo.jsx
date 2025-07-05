import { useState } from 'react';
import { Search, MapPin, Clock, Users, Star, Heart, Filter } from 'lucide-react';
import Navbar from '../component/Navbar/Navbar';
import './ThingsToDo.css';

const ThingsToDo = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Activities', icon: '🎯' },
    { id: 'adventure', name: 'Adventure', icon: '🏔️' },
    { id: 'culture', name: 'Culture', icon: '🏛️' },
    { id: 'food', name: 'Food & Drink', icon: '🍽️' },
    { id: 'nature', name: 'Nature', icon: '🌿' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎭' }
  ];

  const activitiesData = [
    {
      id: 1,
      title: "Eiffel Tower Skip-the-Line Tour",
      location: "Paris, France",
      category: "culture",
      duration: "2 hours",
      groupSize: "Up to 15 people",
      rating: 4.8,
      price: "$45",
      image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description: "Skip the long lines and explore the iconic Eiffel Tower with an expert guide"
    },
    {
      id: 2,
      title: "Bali Volcano Hiking Adventure",
      location: "Bali, Indonesia",
      category: "adventure",
      duration: "8 hours",
      groupSize: "Up to 12 people",
      rating: 4.9,
      price: "$89",
      image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description: "Watch the sunrise from Mount Batur volcano with breakfast included"
    },
    {
      id: 3,
      title: "Tokyo Food Walking Tour",
      location: "Tokyo, Japan",
      category: "food",
      duration: "4 hours",
      groupSize: "Up to 8 people",
      rating: 4.7,
      price: "$75",
      image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description: "Discover authentic Japanese cuisine in hidden local restaurants"
    },
    {
      id: 4,
      title: "Central Park Horse Carriage Ride",
      location: "New York, USA",
      category: "nature",
      duration: "1 hour",
      groupSize: "Up to 4 people",
      rating: 4.5,
      price: "$120",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description: "Romantic horse carriage ride through Central Park's scenic routes"
    },
    {
      id: 5,
      title: "Broadway Show Experience",
      location: "New York, USA",
      category: "entertainment",
      duration: "3 hours",
      groupSize: "Any size",
      rating: 4.9,
      price: "$150",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description: "Premium seats to the hottest Broadway shows with pre-show dinner"
    },
    {
      id: 6,
      title: "Swiss Alps Paragliding",
      location: "Interlaken, Switzerland",
      category: "adventure",
      duration: "3 hours",
      groupSize: "Up to 6 people",
      rating: 4.8,
      price: "$199",
      image: "https://images.unsplash.com/photo-1551524164-6cf2ac2d8c9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description: "Soar above the Swiss Alps with professional paragliding instructors"
    }
  ];

  const filteredActivities = activitiesData.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    activity.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || activity.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="things-to-do-page">
      <Navbar />
      {/* Hero Section */}
      <div className="activities-hero" style={{ marginTop: '70px' }}>
        <div className="hero-content">
          <h1>Discover Amazing Experiences</h1>
          <p>Find unique activities and unforgettable adventures</p>
          
          {/* Search Bar */}
          <div className="search-container">
            <div className="search-bar">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search activities by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="categories-section">
        <div className="categories-container">
          <h2>Browse by Category</h2>
          <div className="categories-grid">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-card ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="activities-container">
        <div className="activities-header">
          <h2>Featured Activities ({filteredActivities.length})</h2>
          <div className="filter-options">
            <button className="filter-btn">
              <Filter size={16} />
              Filters
            </button>
          </div>
        </div>

        <div className="activities-grid">
          {filteredActivities.map(activity => (
            <div key={activity.id} className="activity-card">
              <div className="activity-image">
                <img src={activity.image} alt={activity.title} />
                <button className="favorite-btn">
                  <Heart size={20} />
                </button>
                <div className="category-badge">
                  {categories.find(cat => cat.id === activity.category)?.icon || '🎯'}
                </div>
              </div>

              <div className="activity-info">
                <div className="activity-header">
                  <h3>{activity.title}</h3>
                  <div className="activity-rating">
                    <Star className="star-icon" />
                    <span>{activity.rating}</span>
                  </div>
                </div>
                
                <div className="activity-location">
                  <MapPin size={16} />
                  <span>{activity.location}</span>
                </div>
                
                <p className="activity-description">{activity.description}</p>
                
                <div className="activity-details">
                  <div className="detail">
                    <Clock size={16} />
                    <span>{activity.duration}</span>
                  </div>
                  <div className="detail">
                    <Users size={16} />
                    <span>{activity.groupSize}</span>
                  </div>
                </div>
                
                <div className="activity-footer">
                  <div className="activity-price">
                    <span className="price">{activity.price}</span>
                    <span className="period">per person</span>
                  </div>
                  <button className="book-btn">Book Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="no-results">
            <h3>No activities found</h3>
            <p>Try adjusting your search or category filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThingsToDo;
