import { useState, useEffect } from 'react';
import { Menu, User, Globe, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../Auth/AuthModal';
import './Navbar.css';

const Navbar = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (page) => {
    if (page === 'home') {
      navigate('/');
    } else {
      navigate(`/${page.toLowerCase().replace(/\s+/g, '-')}`);
    }
    // Close mobile menu after navigation
    setIsMobileMenuOpen(false);
  };

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
    // Close mobile menu when opening auth modal
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking outside or pressing escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.mobile-menu-btn')) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when mobile menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="navbar-header">
        <div className="navbar-container">
          <div className="navbar-content">
            <div className="navbar-left">
              <button 
                onClick={() => handleNavigation('home')}
                className="navbar-logo"
              >
                Tripadvisor
              </button>
              <nav className="navbar-nav">
                <button 
                  onClick={() => handleNavigation('hotels')} 
                  className="nav-link"
                >
                  Hotels
                </button>
                <button 
                  onClick={() => handleNavigation('things-to-do')} 
                  className="nav-link"
                >
                  Things to Do
                </button>
                <button 
                  onClick={() => handleNavigation('restaurants')} 
                  className="nav-link"
                >
                  Restaurants
                </button>
                <button 
                  onClick={() => handleNavigation('travel-stories')} 
                  className="nav-link"
                >
                  Travel Stories
                </button>
              </nav>
            </div>
            
            <div className="navbar-right">
              <button className="language-btn">
                <Globe size={20} />
                <span>EN</span>
              </button>
              <button 
                onClick={() => openAuthModal('login')}
                className="signin-btn"
              >
                <User size={20} />
                <span>Sign in</span>
              </button>
              <button 
                onClick={() => openAuthModal('signup')}
                className="signup-btn"
              >
                Sign up
              </button>
              <button
                className="mobile-menu-btn"
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-menu-content" onClick={(e) => e.stopPropagation()}>
            {/* Navigation Links */}
            <div className="mobile-nav-links">
              <button
                onClick={() => handleNavigation('hotels')}
                className="mobile-nav-link"
              >
                Hotels
              </button>
              <button
                onClick={() => handleNavigation('things to do')}
                className="mobile-nav-link"
              >
                Things to do
              </button>
              <button
                onClick={() => handleNavigation('restaurants')}
                className="mobile-nav-link"
              >
                Restaurants
              </button>
              <button
                onClick={() => handleNavigation('travel stories')}
                className="mobile-nav-link"
              >
                Travel stories
              </button>
            </div>

            {/* Language and Auth */}
            <div className="mobile-menu-actions">
              <button className="mobile-language-btn">
                <Globe size={20} />
                <span>English</span>
              </button>

              <div className="mobile-auth-buttons">
                <button
                  onClick={() => openAuthModal('login')}
                  className="mobile-signin-btn"
                >
                  <User size={20} />
                  <span>Sign in</span>
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="mobile-signup-btn"
                >
                  Sign up
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
};

export default Navbar;
