import React, { useState } from 'react';
import { FaMapMarkerAlt, FaStar, FaClock, FaFilter, FaMap, FaList } from 'react-icons/fa';
import './Activities.css';

const Activities = () => {
  const [viewMode, setViewMode] = useState('list');
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    duration: '',
    rating: ''
  });

  const activities = [
    {
      id: 1,
      title: "Visite de la Mosquée Hassan II",
      category: "Culture",
      location: "Boulevard de la Corniche",
      rating: 4.8,
      price: 150,
      duration: "2h",
      image: "/images/mosque.jpg",
      description: "Découvrez l'une des plus grandes mosquées du monde avec un guide expert."
    },
    {
      id: 2,
      title: "Dégustation de Cuisine Marocaine",
      category: "Gastronomie",
      location: "Médina",
      rating: 4.6,
      price: 200,
      duration: "3h",
      image: "/images/food.jpg",
      description: "Apprenez à cuisiner les plats traditionnels marocains avec un chef local."
    },
    {
      id: 3,
      title: "Balade en Médina",
      category: "Découverte",
      location: "Ancienne Médina",
      rating: 4.7,
      price: 100,
      duration: "1h30",
      image: "/images/medina.jpg",
      description: "Explorez les ruelles historiques de l'ancienne médina de Casablanca."
    },
    {
      id: 4,
      title: "Surf à Ain Diab",
      category: "Sport",
      location: "Ain Diab",
      rating: 4.5,
      price: 300,
      duration: "4h",
      image: "/images/surf.jpg",
      description: "Initiez-vous au surf sur les vagues de l'océan Atlantique."
    }
  ];

  const categories = [
    "Toutes les catégories",
    "Culture",
    "Gastronomie", 
    "Découverte",
    "Sport",
    "Shopping",
    "Bien-être"
  ];

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <div className="activities-page">
      <div className="activities-header">
        <h1>Activités à Casablanca</h1>
        <p>Découvrez des expériences uniques dans la ville blanche</p>
      </div>

      <div className="activities-container">
        {/* Filters Sidebar */}
        <aside className="filters-sidebar">
          <div className="filters-header">
            <FaFilter />
            <h3>Filtres</h3>
          </div>

          <div className="filter-group">
            <label>Catégorie</label>
            <select 
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Prix</label>
            <select 
              value={filters.priceRange}
              onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            >
              <option value="">Tous les prix</option>
              <option value="0-100">Moins de 100 MAD</option>
              <option value="100-200">100-200 MAD</option>
              <option value="200-500">200-500 MAD</option>
              <option value="500+">Plus de 500 MAD</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Durée</label>
            <select 
              value={filters.duration}
              onChange={(e) => handleFilterChange('duration', e.target.value)}
            >
              <option value="">Toutes les durées</option>
              <option value="1h">1 heure</option>
              <option value="2h">2 heures</option>
              <option value="3h">3 heures</option>
              <option value="4h+">4+ heures</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Note minimum</label>
            <select 
              value={filters.rating}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
            >
              <option value="">Toutes les notes</option>
              <option value="4.5">4.5+ étoiles</option>
              <option value="4.0">4.0+ étoiles</option>
              <option value="3.5">3.5+ étoiles</option>
            </select>
          </div>

          <button className="clear-filters">Effacer les filtres</button>
        </aside>

        {/* Main Content */}
        <main className="activities-main">
          <div className="activities-toolbar">
            <div className="results-count">
              {activities.length} activités trouvées
            </div>
            <div className="view-controls">
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <FaList /> Liste
              </button>
              <button 
                className={`view-btn ${viewMode === 'map' ? 'active' : ''}`}
                onClick={() => setViewMode('map')}
              >
                <FaMap /> Carte
              </button>
            </div>
          </div>

          {viewMode === 'list' ? (
            <div className="activities-list">
              {activities.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-image">
                    <img src={activity.image} alt={activity.title} />
                    <div className="activity-category">{activity.category}</div>
                  </div>
                  <div className="activity-info">
                    <h3>{activity.title}</h3>
                    <p className="activity-description">{activity.description}</p>
                    <div className="activity-meta">
                      <span className="location">
                        <FaMapMarkerAlt /> {activity.location}
                      </span>
                      <span className="rating">
                        <FaStar /> {activity.rating}
                      </span>
                      <span className="duration">
                        <FaClock /> {activity.duration}
                      </span>
                    </div>
                    <div className="activity-price">
                      <span className="price">{activity.price} MAD</span>
                      <button className="book-btn">Réserver</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="map-view">
              <div className="map-placeholder">
                <p>Carte interactive en cours de chargement...</p>
                <p>Vue carte des activités</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Activities; 