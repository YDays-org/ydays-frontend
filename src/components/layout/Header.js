import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaSearch, FaUser, FaHeart, FaMapMarkerAlt } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <h1>Casablanca Activities</h1>
          </Link>
        </div>
        
        <nav className="nav-menu">
          <Link to="/" className={isActive('/') ? 'active' : ''}>
            Accueil
          </Link>
          <Link to="/activities" className={isActive('/activities') ? 'active' : ''}>
            Activités
          </Link>
          <Link to="/events" className={isActive('/events') ? 'active' : ''}>
            Événements
          </Link>
          <Link to="/restaurants" className={isActive('/restaurants') ? 'active' : ''}>
            Restaurants
          </Link>
          <Link to="/trending" className={isActive('/trending') ? 'active' : ''}>
            Tendances
          </Link>
          <Link to="/new" className={isActive('/new') ? 'active' : ''}>
            Nouveautés
          </Link>
        </nav>

        <div className="header-actions">
          <button className="search-btn">
            <FaSearch />
          </button>
          <button className="location-btn">
            <FaMapMarkerAlt />
          </button>
          <Link to="/favorites" className="favorites-btn">
            <FaHeart />
          </Link>
          <Link to="/profile" className="profile-btn">
            <FaUser />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header; 