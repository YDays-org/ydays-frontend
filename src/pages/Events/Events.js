import React, { useState } from 'react';
import { FaMapMarkerAlt, FaCalendar, FaClock, FaFilter, FaMap, FaList } from 'react-icons/fa';
import './Events.css';

const Events = () => {
  const [viewMode, setViewMode] = useState('list');
  const [filters, setFilters] = useState({
    category: '',
    date: '',
    location: '',
    price: ''
  });

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
    "Toutes les catégories",
    "Musique",
    "Art",
    "Culture",
    "Théâtre",
    "Cinéma",
    "Sport",
    "Gastronomie"
  ];

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <div className="events-page">
      <div className="events-header">
        <h1>Événements à Casablanca</h1>
        <p>Ne manquez aucun événement dans la ville blanche</p>
      </div>

      <div className="events-container">
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
            <label>Date</label>
            <select 
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
            >
              <option value="">Toutes les dates</option>
              <option value="today">Aujourd'hui</option>
              <option value="tomorrow">Demain</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Lieu</label>
            <select 
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            >
              <option value="">Tous les lieux</option>
              <option value="theatre">Théâtre Mohammed V</option>
              <option value="villa">Villa des Arts</option>
              <option value="palais">Palais des Congrès</option>
              <option value="conservatoire">Conservatoire</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Prix</label>
            <select 
              value={filters.price}
              onChange={(e) => handleFilterChange('price', e.target.value)}
            >
              <option value="">Tous les prix</option>
              <option value="free">Gratuit</option>
              <option value="0-50">Moins de 50 MAD</option>
              <option value="50-150">50-150 MAD</option>
              <option value="150+">Plus de 150 MAD</option>
            </select>
          </div>

          <button className="clear-filters">Effacer les filtres</button>
        </aside>

        {/* Main Content */}
        <main className="events-main">
          <div className="events-toolbar">
            <div className="results-count">
              {events.length} événements trouvés
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
            <div className="events-list">
              {events.map(event => (
                <div key={event.id} className="event-item">
                  <div className="event-image">
                    <img src={event.image} alt={event.title} />
                    <div className="event-category">{event.category}</div>
                  </div>
                  <div className="event-info">
                    <h3>{event.title}</h3>
                    <p className="event-description">{event.description}</p>
                    <div className="event-meta">
                      <span className="date">
                        <FaCalendar /> {new Date(event.date).toLocaleDateString('fr-FR')}
                      </span>
                      <span className="time">
                        <FaClock /> {event.time}
                      </span>
                      <span className="location">
                        <FaMapMarkerAlt /> {event.location}
                      </span>
                    </div>
                    <div className="event-price">
                      <span className="price">{event.price} MAD</span>
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