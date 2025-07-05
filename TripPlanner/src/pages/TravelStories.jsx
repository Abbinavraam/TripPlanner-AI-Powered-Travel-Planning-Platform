import { useState } from 'react';
import { Search, MapPin, Calendar, Heart, MessageCircle, Share2, Eye } from 'lucide-react';
import Navbar from '../component/Navbar/Navbar';
import './TravelStories.css';

const TravelStories = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Stories', icon: '📖' },
    { id: 'adventure', name: 'Adventure', icon: '🏔️' },
    { id: 'culture', name: 'Culture', icon: '🏛️' },
    { id: 'food', name: 'Food', icon: '🍽️' },
    { id: 'solo', name: 'Solo Travel', icon: '🎒' },
    { id: 'family', name: 'Family', icon: '👨‍👩‍👧‍👦' }
  ];

  const storiesData = [
    {
      id: 1,
      title: "My Solo Journey Through the Swiss Alps",
      author: "Sarah Johnson",
      authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      location: "Swiss Alps, Switzerland",
      category: "solo",
      date: "March 15, 2024",
      readTime: "8 min read",
      views: 1250,
      likes: 89,
      comments: 23,
      image: "https://picsum.photos/400/300?random=31",
      excerpt: "Discovering the breathtaking beauty of the Swiss Alps on my own was a life-changing experience. From hiking through pristine valleys to staying in cozy mountain huts...",
      tags: ["Solo Travel", "Hiking", "Mountains", "Switzerland"]
    },
    {
      id: 2,
      title: "Street Food Adventures in Bangkok",
      author: "Mike Chen",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      location: "Bangkok, Thailand",
      category: "food",
      date: "March 10, 2024",
      readTime: "6 min read",
      views: 2100,
      likes: 156,
      comments: 45,
      image: "https://picsum.photos/400/300?random=32",
      excerpt: "Bangkok's street food scene is absolutely incredible! From pad thai on every corner to exotic fruits I'd never seen before, every meal was an adventure...",
      tags: ["Food", "Street Food", "Thailand", "Culture"]
    },
    {
      id: 3,
      title: "Family Fun in Tokyo: A Week with Kids",
      author: "Emma Wilson",
      authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      location: "Tokyo, Japan",
      category: "family",
      date: "March 5, 2024",
      readTime: "10 min read",
      views: 1800,
      likes: 134,
      comments: 67,
      image: "https://picsum.photos/400/300?random=33",
      excerpt: "Traveling to Tokyo with two young kids seemed daunting, but it turned out to be the most magical family vacation we've ever had. Here's how we did it...",
      tags: ["Family Travel", "Tokyo", "Kids", "Japan"]
    },
    {
      id: 4,
      title: "Exploring Ancient Temples in Cambodia",
      author: "David Rodriguez",
      authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      location: "Siem Reap, Cambodia",
      category: "culture",
      date: "February 28, 2024",
      readTime: "12 min read",
      views: 950,
      likes: 78,
      comments: 19,
      image: "https://picsum.photos/400/300?random=34",
      excerpt: "The temples of Angkor are more magnificent than any photo can capture. Walking through these ancient ruins at sunrise was a spiritual experience...",
      tags: ["Culture", "History", "Temples", "Cambodia"]
    },
    {
      id: 5,
      title: "Bungee Jumping in New Zealand",
      author: "Alex Thompson",
      authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      location: "Queenstown, New Zealand",
      category: "adventure",
      date: "February 20, 2024",
      readTime: "5 min read",
      views: 3200,
      likes: 245,
      comments: 89,
      image: "https://picsum.photos/400/300?random=35",
      excerpt: "Standing on the edge of the Kawarau Gorge Bridge, 43 meters above the river, I questioned every life decision that led me to this moment...",
      tags: ["Adventure", "Bungee Jumping", "New Zealand", "Adrenaline"]
    },
    {
      id: 6,
      title: "Art and Architecture in Barcelona",
      author: "Isabella Garcia",
      authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      location: "Barcelona, Spain",
      category: "culture",
      date: "February 15, 2024",
      readTime: "9 min read",
      views: 1650,
      likes: 112,
      comments: 34,
      image: "https://picsum.photos/400/300?random=36",
      excerpt: "Barcelona is a living museum where Gaudí's whimsical architecture meets vibrant street art. Every corner tells a story of creativity and passion...",
      tags: ["Art", "Architecture", "Barcelona", "Gaudí"]
    }
  ];

  const filteredStories = storiesData.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         story.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         story.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || story.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleWriteStory = () => {
    // For now, just show an alert. In a real app, this would open a story writing modal or navigate to a new page
    alert('Story writing feature coming soon! This would open a form to write and submit your travel story.');
  };

  return (
    <div className="travel-stories-page">
      <Navbar />
      {/* Hero Section */}
      <div className="stories-hero" style={{ marginTop: '70px' }}>
        <div className="hero-content">
          <h1>Travel Stories & Experiences</h1>
          <p>Get inspired by real travelers sharing their amazing journeys</p>
          
          {/* Search Bar */}
          <div className="search-container">
            <div className="search-bar">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search stories by title, location, or author..."
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

      {/* Stories Grid */}
      <div className="stories-container">
        <div className="stories-header">
          <h2>Latest Stories ({filteredStories.length})</h2>
          <button
            className="write-story-btn"
            onClick={handleWriteStory}
          >
            ✍️ Share Your Story
          </button>
        </div>

        <div className="stories-grid">
          {filteredStories.map(story => (
            <article key={story.id} className="story-card">
              <div className="story-image">
                <img src={story.image} alt={story.title} />
                <div className="story-category">
                  {categories.find(cat => cat.id === story.category)?.icon || '📖'}
                </div>
              </div>
              
              <div className="story-content">
                <div className="story-meta">
                  <div className="author-info">
                    <img src={story.authorAvatar} alt={story.author} className="author-avatar" />
                    <div className="author-details">
                      <span className="author-name">{story.author}</span>
                      <div className="story-date">
                        <Calendar size={12} />
                        <span>{story.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="story-location">
                    <MapPin size={14} />
                    <span>{story.location}</span>
                  </div>
                </div>
                
                <h3 className="story-title">{story.title}</h3>
                <p className="story-excerpt">{story.excerpt}</p>
                
                <div className="story-tags">
                  {story.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="story-tag">#{tag}</span>
                  ))}
                </div>
                
                <div className="story-stats">
                  <div className="stat-group">
                    <div className="stat">
                      <Eye size={14} />
                      <span>{story.views}</span>
                    </div>
                    <button className="stat like-btn">
                      <Heart size={14} />
                      <span>{story.likes}</span>
                    </button>
                    <div className="stat">
                      <MessageCircle size={14} />
                      <span>{story.comments}</span>
                    </div>
                  </div>
                  <div className="read-time">{story.readTime}</div>
                </div>
                
                <div className="story-actions">
                  <button className="read-btn">
                    Read Story
                  </button>
                  <button className="share-btn">
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredStories.length === 0 && (
          <div className="no-results">
            <h3>No stories found</h3>
            <p>Try adjusting your search or category filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelStories;
