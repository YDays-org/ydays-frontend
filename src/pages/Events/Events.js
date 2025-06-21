import React, { useState } from 'react';
import { FaList, FaMap } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './Events.module.css';
import FilterSidebar from '../../components/FilterSidebar';
import GlobalCard from '../../components/GlobalCard';

const Events = () => {
  const [viewMode, setViewMode] = useState('list');
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    duration: '',
    rating: ''
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  const events = [
    {
      id: 1,
      title: "Festival de Jazz de Casablanca",
      category: "Musique",
      location: "Théâtre Mohammed V",
      date: "2024-12-15",
      time: "20:00",
      price: 200,
      image: "/images/jazz-festival.jpg",
      description: "Une soirée exceptionnelle avec les meilleurs artistes de jazz internationaux."
    },
    {
      id: 2,
      title: "Exposition d'Art Contemporain",
      category: "Art",
      location: "Villa des Arts",
      date: "2024-12-10",
      time: "10:00",
      price: 50,
      image: "/images/art-exhibition.jpg",
      description: "Découvrez les œuvres d'artistes contemporains marocains et internationaux."
    },
    {
      id: 3,
      title: "Salon du Livre",
      category: "Culture",
      location: "Palais des Congrès",
      date: "2024-12-20",
      time: "09:00",
      price: 30,
      image: "/images/book-fair.jpg",
      description: "Le plus grand salon du livre de Casablanca avec des auteurs renommés."
    },
    {
      id: 4,
      title: "Concert de Musique Arabo-Andalouse",
      category: "Musique",
      location: "Conservatoire de Musique",
      date: "2024-12-25",
      time: "19:30",
      price: 150,
      image: "/images/andalous-music.jpg",
      description: "Une soirée magique avec la musique traditionnelle arabo-andalouse."
    }
  ];
  const categories = [
    'Toutes les catégories',
    'Culture',
    'Gastronomie',
    'Découverte',
    'Sport',
    'Shopping',
    'Bien-être'
  ];

  const filteredEvents = events.filter(event => {
    let match = true;
    if (filters.category && filters.category !== 'Toutes les catégories') {
      match = match && event.category === filters.category;
    }
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-');
      if (max) {
        match = match && event.price >= parseInt(min) && event.price <= parseInt(max);
      } else if (min && min.endsWith('+')) {
        match = match && event.price >= parseInt(min);
      }
    }
    if (filters.duration) {
      if (filters.duration === '4h+') {
        match = match && parseInt(event.duration) >= 4;
      } else {
        match = match && event.duration.startsWith(filters.duration);
      }
    }
    if (filters.rating) {
      match = match && event.rating >= parseFloat(filters.rating);
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
      navigate(`/booking/event/${id}`);
    }
  };

  return (
    <div className={styles['events-page']}>
      <div className={styles['events-header']}>
        <h1>Événements</h1>
        <p>Découvrez les meilleurs événements à Casablanca</p>
      </div>
      <div className={styles['events-container']}>
        <FilterSidebar
          filters={filters}
          categories={categories}
          onChange={handleFilterChange}
          onClear={handleClearFilters}
        />
        <main className={styles['events-main']}>
          <div className={styles['events-toolbar']}>
            <div className={styles['results-count']}>
              {filteredEvents.length} événement{filteredEvents.length > 1 ? 's' : ''} trouvé{filteredEvents.length > 1 ? 's' : ''}
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
            <div className={styles['events-list']}>
              {filteredEvents.length === 0 ? (
                <div style={{ color: '#42AB9E', fontWeight: 700, fontSize: '1.2rem', padding: '2.5rem' }}>
                  Aucun événement ne correspond à vos filtres.
                </div>
              ) : (
                filteredEvents.map(event => (
                  <GlobalCard key={event.id} item={event} onReserve={handleReserve} />
                ))
              )}
            </div>
          ) : (
            <div className={styles['map-view']}>
              <div className={styles['map-placeholder']}>
                <p>Carte interactive en cours de chargement...</p>
                <p>Vue carte des événements</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Events;