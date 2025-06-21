import React, { useState } from 'react';
import { FaMapMarkerAlt, FaStar, FaClock, FaFilter, FaMap, FaList, FaUtensils } from 'react-icons/fa';
import './Restaurants.css';

const Restaurants = () => {
  const [viewMode, setViewMode] = useState('list');
  const [filters, setFilters] = useState({
    cuisine: '',
    priceRange: '',
    rating: '',
    location: ''
  });

  const restaurants = [
    {
      id: 1,
      name: "La Sqala",
      cuisine: "Marocaine traditionnelle",
      location: "Médina",
      rating: 4.7,
      priceRange: "$$",
      image: "/images/la-sqala.jpg",
      description: "Restaurant historique dans une ancienne forteresse, spécialisé dans la cuisine marocaine traditionnelle.",
      openingHours: "12:00 - 23:00"
    },
    {
      id: 2,
      name: "Rick's Café",
      cuisine: "International",
      location: "Anfa",
      rating: 4.5,
      priceRange: "$$$",
      image: "/images/ricks-cafe.jpg",
      description: "Inspiré du film Casablanca, ce restaurant offre une cuisine internationale raffinée.",
      openingHours: "12:00 - 00:00"
    },
    {
      id: 3,
      name: "Le Dhow",
      cuisine: "Méditerranéenne",
      location: "Marina",
      rating: 4.6,
      priceRange: "$$",
      image: "/images/le-dhow.jpg",
      description: "Restaurant sur l'eau avec une vue imprenable sur le port et une cuisine méditerranéenne.",
      openingHours: "19:00 - 23:30"
    },
    {
      id: 4,
      name: "Al Mounia",
      cuisine: "Marocaine",
      location: "Centre-ville",
      rating: 4.4,
      priceRange: "$",
      image: "/images/al-mounia.jpg",
      description: "Restaurant familial authentique avec des spécialités marocaines traditionnelles.",
      openingHours: "12:00 - 22:00"
    }
  ];

  const cuisines = [
    "Toutes les cuisines",
    "Marocaine",
    "Marocaine traditionnelle",
    "International",
    "Méditerranéenne",
    "Italienne",
    "Française",
    "Asiatique",
    "Fast-food"
  ];

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <div className="restaurants-page">
      <div className="restaurants-header">
        <h1>Restaurants à Casablanca</h1>
        <p>Découvrez les meilleures tables de la ville blanche</p>
      </div>

      <div className="restaurants-container">
        {/* Filters Sidebar */}
        <aside className="filters-sidebar">
          <div className="filters-header">
            <FaFilter />
            <h3>Filtres</h3>
          </div>

          <div className="filter-group">
            <label>Cuisine</label>
            <select 
              value={filters.cuisine}
              onChange={(e) => handleFilterChange('cuisine', e.target.value)}
            >
              {cuisines.map(cuisine => (
                <option key={cuisine} value={cuisine}>
                  {cuisine}
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
              <option value="$">Économique ($)</option>
              <option value="$$">Modéré ($$)</option>
              <option value="$$$">Élevé ($$$)</option>
              <option value="$$$$">Luxe ($$$$)</option>
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

          <div className="filter-group">
            <label>Quartier</label>
            <select 
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            >
              <option value="">Tous les quartiers</option>
              <option value="medina">Médina</option>
              <option value="anfa">Anfa</option>
              <option value="marina">Marina</option>
              <option value="centre">Centre-ville</option>
              <option value="ain-diab">Ain Diab</option>
            </select>
          </div>

          <button className="clear-filters">Effacer les filtres</button>
        </aside>

        {/* Main Content */}
        <main className="restaurants-main">
          <div className="restaurants-toolbar">
            <div className="results-count">
              {restaurants.length} restaurants trouvés
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
            <div className="restaurants-list">
              {restaurants.map(restaurant => (
                <div key={restaurant.id} className="restaurant-item">
                  <div className="restaurant-image">
                    <img src={restaurant.image} alt={restaurant.name} />
                    <div className="restaurant-cuisine">{restaurant.cuisine}</div>
                  </div>
                  <div className="restaurant-info">
                    <h3>{restaurant.name}</h3>
                    <p className="restaurant-description">{restaurant.description}</p>
                    <div className="restaurant-meta">
                      <span className="location">
                        <FaMapMarkerAlt /> {restaurant.location}
                      </span>
                      <span className="rating">
                        <FaStar /> {restaurant.rating}
                      </span>
                      <span className="cuisine">
                        <FaUtensils /> {restaurant.cuisine}
                      </span>
                    </div>
                    <div className="restaurant-details">
                      <span className="opening-hours">
                        <FaClock /> {restaurant.openingHours}
                      </span>
                      <span className="price-range">{restaurant.priceRange}</span>
                    </div>
                    <div className="restaurant-actions">
                      <button className="menu-btn">Voir le menu</button>
                      <button className="book-btn">Réserver une table</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="map-view">
              <div className="map-placeholder">
                <p>Carte interactive en cours de chargement...</p>
                <p>Vue carte des restaurants</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Restaurants; 