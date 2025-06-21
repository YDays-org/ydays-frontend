import React, { useState } from 'react';
import { FaList, FaMap } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './Activities.module.css';
import FilterSidebar from '../../components/FilterSidebar';
import GlobalCard from '../../components/GlobalCard';

const Activities = () => {
  const [viewMode, setViewMode] = useState('list');
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    duration: '',
    rating: ''
  });
  const { user } = useAuth();
  const navigate = useNavigate();

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

  const filteredActivities = activities.filter(activity => {
    let match = true;
    if (filters.category && filters.category !== 'Toutes les catégories') {
      match = match && activity.category === filters.category;
    }
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-');
      if (max) {
        match = match && activity.price >= parseInt(min) && activity.price <= parseInt(max);
      } else if (min && min.endsWith('+')) {
        match = match && activity.price >= parseInt(min);
      }
    }
    if (filters.duration) {
      if (filters.duration === '4h+') {
        match = match && parseInt(activity.duration) >= 4;
      } else {
        match = match && activity.duration.startsWith(filters.duration);
      }
    }
    if (filters.rating) {
      match = match && activity.rating >= parseFloat(filters.rating);
    }
    return match;
  });

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({ category: '', priceRange: '', duration: '', rating: '' });
  };

  const handleReserve = (id) => {
    if (!user) {
      navigate('/auth');
    } else {
      navigate(`/booking/activity/${id}`);
    }
  };

  return (
    <div className={styles['activities-page']}>
      <div className={styles['activities-header']}>
        <h1>Activités</h1>
        <p>Découvrez les meilleures activités à Casablanca</p>
      </div>
      <div className={styles['activities-container']}>
        <FilterSidebar
          filters={filters}
          categories={categories}
          onChange={handleFilterChange}
          onClear={handleClearFilters}
        />
        <main className={styles['activities-main']}>
          <div className={styles['activities-toolbar']}>
            <div className={styles['results-count']}>
              {filteredActivities.length} activité{filteredActivities.length > 1 ? 's' : ''} trouvée{filteredActivities.length > 1 ? 's' : ''}
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
            <div className={styles['activities-list']}>
              {filteredActivities.length === 0 ? (
                <div style={{color:'#42AB9E',fontWeight:700,fontSize:'1.2rem',padding:'2.5rem'}}>Aucune activité ne correspond à vos filtres.</div>
              ) : (
                filteredActivities.map(activity => (
                  <GlobalCard key={activity.id} item={activity} onReserve={handleReserve} />
                ))
              )}
            </div>
          ) : (
            <div className={styles['map-view']}>
              <div className={styles['map-placeholder']}>
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