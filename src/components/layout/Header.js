import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaSearch, FaUser, FaHeart, FaMapMarkerAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  const location = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/auth');
    } else {
      navigate('/profile');
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles['header-container']}>
        <div className={styles.logo}>
          <Link to="/">
            <h1>Casablanca Activities</h1>
          </Link>
        </div>
        
        <nav className={styles['nav-menu']}>
          <Link to="/" className={isActive('/') ? styles.active : ''}>
            Accueil
          </Link>
          <Link to="/activities" className={isActive('/activities') ? styles.active : ''}>
            Activités
          </Link>
          <Link to="/events" className={isActive('/events') ? styles.active : ''}>
            Événements
          </Link>
          <Link to="/restaurants" className={isActive('/restaurants') ? styles.active : ''}>
            Restaurants
          </Link>
          <Link to="/trending" className={isActive('/trending') ? styles.active : ''}>
            Tendances
          </Link>
          <Link to="/new" className={isActive('/new') ? styles.active : ''}>
            Nouveautés
          </Link>
        </nav>

        <div className={styles['header-actions']}>
          <button className={styles['search-btn']}>
            <FaSearch />
          </button>
          <button className={styles['location-btn']}>
            <FaMapMarkerAlt />
          </button>
          <Link to="/favorites" className={styles['favorites-btn']}>
            <FaHeart />
          </Link>
          <button
            className={styles['profile-btn']}
            onClick={handleProfileClick}
            style={{
              background: user ? '#42AB9E' : '#f6f6f6',
              color: user ? '#fff' : '#42AB9E',
              border: user ? '2px solid #42AB9E' : 'none',
              fontWeight: 600,
              width: 38,
              height: 38,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s, color 0.2s',
              fontSize: '1.2rem',
              padding: 0
            }}
            aria-label={user ? 'Mon profil' : 'Connexion'}
          >
            {user ? (
              <span style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: 1 }}>
                {user.avatar ? (
                  <img src={user.avatar} alt="avatar" style={{ width: 28, height: 28, borderRadius: '50%' }} />
                ) : (
                  (user.firstName?.[0] || user.name?.[0] || 'U').toUpperCase()
                )}
              </span>
            ) : (
              <FaUser />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;