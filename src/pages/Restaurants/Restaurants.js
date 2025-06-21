import React, { useState } from 'react';
import { FaList, FaMap } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './Restaurants.module.css';
import FilterSidebar from '../../components/FilterSidebar';
import GlobalCard from '../../components/GlobalCard';
import SearchBar from '../../components/SearchBar';

const Restaurants = () => {
  const [viewMode, setViewMode] = useState('list');
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    duration: '',
    rating: ''
  });
  const [searchResults, setSearchResults] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

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
  const categories = [
    'Toutes les catégories',
    'Gastronomie',
    'Marocaine',
    'Internationale',
    'Asiatique',
    'Italienne',
    'Fast Food',
    'Café',
    'Autre'
  ];

  const filteredRestaurants = restaurants.filter(restaurant => {
    let match = true;
    if (filters.category && filters.category !== 'Toutes les catégories') {
      match = match && restaurant.category === filters.category;
    }
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-');
      if (max) {
        match = match && restaurant.price >= parseInt(min) && restaurant.price <= parseInt(max);
      } else if (min && min.endsWith('+')) {
        match = match && restaurant.price >= parseInt(min);
      }
    }
    if (filters.duration) {
      if (filters.duration === '4h+') {
        match = match && parseInt(restaurant.duration) >= 4;
      } else {
        match = match && restaurant.duration.startsWith(filters.duration);
      }
    }
    if (filters.rating) {
      match = match && restaurant.rating >= parseFloat(filters.rating);
    }
    return match;
  });

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };
  const handleClearFilters = () => {
    setFilters({ category: '', priceRange: '', duration: '', rating: '' });
  };
  const handleReserve = (id) => {
    if (!user) {
      navigate('/auth');
    } else {
      navigate(`/booking/restaurant/${id}`);
    }
  };

  return (
    <div className={styles['restaurants-page']}>
      <div className={styles['restaurants-header']}>
        <h1>Restaurants</h1>
        <p>Découvrez les meilleurs restaurants à Casablanca</p>
      </div>
      <div className={styles['restaurants-container']}>
        <FilterSidebar
          filters={filters}
          categories={categories}
          onChange={handleFilterChange}
          onClear={handleClearFilters}
        />
        <main className={styles['restaurants-main']}>
          <SearchBar
            data={filteredRestaurants}
            onSearch={setSearchResults}
            placeholder="Rechercher un restaurant, une cuisine, un lieu..."
          />
          <div className={styles['restaurants-toolbar']}>
            <div className={styles['results-count']}>
              {(searchResults ? searchResults.length : filteredRestaurants.length)} restaurant{(searchResults ? searchResults.length : filteredRestaurants.length) > 1 ? 's' : ''} trouvé{(searchResults ? searchResults.length : filteredRestaurants.length) > 1 ? 's' : ''}
            </div>
            <div className={styles['view-controls']}>
              <button
                className={`${styles['view-btn']} ${viewMode === 'list' ? styles['active'] : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="Vue liste"
              >
                <FaList /> Liste
              </button>
              <button
                className={`${styles['view-btn']} ${viewMode === 'map' ? styles['active'] : ''}`}
                onClick={() => setViewMode('map')}
                aria-label="Vue carte"
              >
                <FaMap /> Carte
              </button>
            </div>
          </div>
          {viewMode === 'list' ? (
            <div className={styles['restaurants-list']}>
              {(searchResults || filteredRestaurants).length === 0 ? (
                <div style={{ color: '#42AB9E', fontWeight: 700, fontSize: '1.2rem', padding: '2.5rem' }}>
                  Aucun restaurant ne correspond à vos filtres.
                </div>
              ) : (
                (searchResults || filteredRestaurants).map(restaurant => (
                  <GlobalCard key={restaurant.id} item={restaurant} onReserve={handleReserve} />
                ))
              )}
            </div>
          ) : (
            <div className={styles['map-view']}>
              <div className={styles['map-placeholder']}>
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