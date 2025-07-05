
import { useState, useEffect } from 'react';
import { Star, Heart, Search, MapPin, Calendar, Users, Plane, Globe, TrendingUp, Award, Clock, Zap } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import TravelBuddyChat from './component/TravelBuddy/TravelBuddyChat';
import Navbar from './component/Navbar/Navbar';
import './Home.css'

const headlines = [
  "Where will your next adventure take you?",
  "Discover amazing destinations worldwide..",
  "Plan your perfect getaway today.."
];

function Home() {
  const [typedText, setTypedText] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [stats, setStats] = useState({
    tripsPlanned: 0,
    happyTravelers: 0,
    destinations: 0,
    reviews: 0
  });

  const navigate = useNavigate();

  // Animated typing effect

  useEffect(() => {
    let currentHeadline = 0;
    let currentChar = 0;
    let isDeleting = false;
    let timeoutId;

    const typeEffect = () => {
      const headline = headlines[currentHeadline];

      if (!isDeleting && currentChar < headline.length) {
        setTypedText(headline.substring(0, currentChar + 1));
        currentChar++;
        timeoutId = setTimeout(typeEffect, 80);
      } else if (isDeleting && currentChar > 0) {
        setTypedText(headline.substring(0, currentChar - 1));
        currentChar--;
        timeoutId = setTimeout(typeEffect, 40);
      } else if (!isDeleting && currentChar === headline.length) {
        timeoutId = setTimeout(() => {
          isDeleting = true;
          typeEffect();
        }, 2500);
      } else if (isDeleting && currentChar === 0) {
        isDeleting = false;
        currentHeadline = (currentHeadline + 1) % headlines.length;
        timeoutId = setTimeout(typeEffect, 300);
      }
    };

    // Start the typing effect after a short delay
    timeoutId = setTimeout(typeEffect, 500);

    // Cleanup function to prevent memory leaks
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  // Animated stats counter
  useEffect(() => {
    const targetStats = {
      tripsPlanned: 25847,
      happyTravelers: 18392,
      destinations: 195,
      reviews: 42156
    };

    const animateStats = () => {
      Object.keys(targetStats).forEach(key => {
        let current = 0;
        const target = targetStats[key];
        const increment = target / 100;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          setStats(prev => ({ ...prev, [key]: Math.floor(current) }));
        }, 30);
      });
    };

    const timer = setTimeout(animateStats, 1000);
    return () => clearTimeout(timer);
  }, []);

  const popularDestinations = [
    {
      name: "Paris",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1000",
      rating: 4.8,
      reviews: 12453,
      weather: "22°C",
      bestTime: "Apr-Oct",
      highlights: ["Eiffel Tower", "Louvre Museum", "Seine River"]
    },
    {
      name: "Rome",
      image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=1000",
      rating: 4.7,
      reviews: 10234,
      weather: "25°C",
      bestTime: "May-Sep",
      highlights: ["Colosseum", "Vatican City", "Trevi Fountain"]
    },
    {
      name: "London",
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=1000",
      rating: 4.6,
      reviews: 15678,
      weather: "18°C",
      bestTime: "Jun-Aug",
      highlights: ["Big Ben", "London Eye", "British Museum"]
    }
  ];

  const categories = [
    {
      name: "Hotels",
      icon: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000",
      count: "50,000+",
      description: "Luxury to budget stays"
    },
    {
      name: "Restaurants",
      icon: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000",
      count: "25,000+",
      description: "Local & international cuisine"
    },
    {
      name: "Things to Do",
      icon: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1000",
      count: "100,000+",
      description: "Activities & experiences"
    },
    {
      name: "Vacation Rentals",
      icon: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1000",
      count: "15,000+",
      description: "Homes & unique stays"
    }
  ];

  const goToNextPage = () => {
    navigate("/create-trip");
  };




  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Enhanced Hero Section */}
      <div style={{ marginTop: '70px' }}>
        <div className="relative h-[600px] overflow-hidden">
          {/* Video Background */}
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src="https://videos.pexels.com/video-files/8969048/8969048-uhd_2732_1440_24fps.mp4"
            autoPlay
            loop
            muted
          ></video>

          {/* Floating Travel Icons */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="floating-icon" style={{ top: '20%', left: '10%', animationDelay: '0s' }}>
              <Plane className="text-white opacity-20" size={24} />
            </div>
            <div className="floating-icon" style={{ top: '60%', right: '15%', animationDelay: '2s' }}>
              <Globe className="text-white opacity-20" size={32} />
            </div>
            <div className="floating-icon" style={{ top: '40%', left: '80%', animationDelay: '4s' }}>
              <MapPin className="text-white opacity-20" size={28} />
            </div>
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/50"></div>

          {/* Content */}
          <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10">
            <div className="text-center max-w-4xl">
              <h1 className="text-5xl md:text-7xl text-white font-bold mb-6 leading-tight">
                {typedText}
                <span className="blinking-cursor">|</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 font-light">
                AI-powered trip planning made simple and magical
              </p>

              {/* Interactive Search Bar */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className={`search-container ${isSearchFocused ? 'focused' : ''}`}>
                  <Search className="search-icon" size={24} />
                  <input
                    type="text"
                    placeholder="Where do you want to go?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="search-input"
                  />
                  <button className="search-btn">
                    <Zap size={20} />
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={goToNextPage}
                  className="cta-primary"
                >
                  <Plane className="mr-2" size={20} />
                  Start Planning Now
                </button>
                <button className="cta-secondary">
                  <Globe className="mr-2" size={20} />
                  Explore Destinations
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Stats Section */}
      <div className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center stats-card">
              <div className="stats-icon">
                <TrendingUp className="text-green-600" size={32} />
              </div>
              <div className="stats-number">{stats.tripsPlanned.toLocaleString()}</div>
              <div className="stats-label">Trips Planned</div>
            </div>
            <div className="text-center stats-card">
              <div className="stats-icon">
                <Users className="text-blue-600" size={32} />
              </div>
              <div className="stats-number">{stats.happyTravelers.toLocaleString()}</div>
              <div className="stats-label">Happy Travelers</div>
            </div>
            <div className="text-center stats-card">
              <div className="stats-icon">
                <Globe className="text-purple-600" size={32} />
              </div>
              <div className="stats-number">{stats.destinations}</div>
              <div className="stats-label">Destinations</div>
            </div>
            <div className="text-center stats-card">
              <div className="stats-icon">
                <Star className="text-yellow-500" size={32} />
              </div>
              <div className="stats-number">{stats.reviews.toLocaleString()}</div>
              <div className="stats-label">5-Star Reviews</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Categories */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need for the perfect trip
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From luxury hotels to hidden gems, we&apos;ve got you covered
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <div key={index} className="category-img group">
                <div className="category-image-container">
                  <img
                    src={category.icon}
                    alt={category.name}
                    className="category-image"
                  />
                </div>
                <div className="category-overlay">
                  <div className="category-content">
                    <h3 className="category-title">{category.name}</h3>
                    <p className="category-count">{category.count}</p>
                    <p className="category-description">{category.description}</p>
                  </div>
                  <button className="category-explore-btn">
                    Explore Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Destinations Explorer */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trending Destinations
            </h2>
            <p className="text-xl text-gray-600">
              Discover the world&apos;s most amazing places
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularDestinations.map((destination, index) => (
              <div key={index} className="destination-card group">
                <div className="destination-image-container">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="destination-image"
                  />
                  <div className="destination-badges">
                    <span className="weather-badge">
                      <Clock size={14} />
                      {destination.weather}
                    </span>
                    <span className="trending-badge">
                      <TrendingUp size={14} />
                      Trending
                    </span>
                  </div>
                  <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 heart-btn">
                    <Heart size={20} className="text-gray-600" />
                  </button>
                  <div className="destination-overlay">
                    <button className="destination-btn">
                      Explore {destination.name}
                    </button>
                  </div>
                </div>

                <div className="destination-content">
                  <div className="destination-header">
                    <h3 className="destination-title">{destination.name}</h3>
                    <div className="destination-rating">
                      <Star className="text-yellow-400 w-4 h-4 fill-current" />
                      <span>{destination.rating}</span>
                    </div>
                  </div>

                  <div className="destination-meta">
                    <div className="meta-item">
                      <Calendar size={16} className="text-gray-400" />
                      <span>Best: {destination.bestTime}</span>
                    </div>
                    <div className="meta-item">
                      <Users size={16} className="text-gray-400" />
                      <span>{destination.reviews.toLocaleString()} reviews</span>
                    </div>
                  </div>

                  <div className="destination-highlights">
                    <h4 className="highlights-title">Top Attractions:</h4>
                    <div className="highlights-list">
                      {destination.highlights.map((highlight, idx) => (
                        <span key={idx} className="highlight-tag">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to start your adventure?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of travelers who trust us to plan their perfect trips
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={goToNextPage}
                className="cta-primary-large"
              >
                <Plane className="mr-2" size={24} />
                Plan My Trip Now
              </button>
              <div className="flex items-center text-white/80">
                <Award className="mr-2" size={20} />
                <span>Free • No Credit Card Required</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Travel Buddy Chat */}
      <TravelBuddyChat />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h5 className="font-bold mb-4">About Tripadvisor</h5>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-green-500">About Us</a></li>
                <li><a href="#" className="hover:text-green-500">Press</a></li>
                <li><a href="#" className="hover:text-green-500">Resources</a></li>
                <li><a href="#" className="hover:text-green-500">Careers</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Explore</h5>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-green-500">Write a Review</a></li>
                <li><a href="#" className="hover:text-green-500">Add a Place</a></li>
                <li><a href="#" className="hover:text-green-500">Join</a></li>
                <li><a href="#" className="hover:text-green-500">Travelers&apos; Choice</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Business</h5>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-green-500">Owners</a></li>
                <li><a href="#" className="hover:text-green-500">Business Advantage</a></li>
                <li><a href="#" className="hover:text-green-500">Sponsored Placements</a></li>
                <li><a href="#" className="hover:text-green-500">Access Center</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Get the App</h5>
              <p className="text-sm text-gray-400 mb-4">Download the app for mobile access.</p>
              <div className="space-y-2">
                <button className="bg-white text-black px-4 py-2 rounded-lg w-full hover:bg-gray-100">
                  App Store
                </button>
                <button className="bg-white text-black px-4 py-2 rounded-lg w-full hover:bg-gray-100">
                  Google Play
                </button>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Tripadvisor Clone. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* AI Travel Buddy Chat */}
      <TravelBuddyChat />
    </div>
  );
}

export default Home;