import React, { useState } from 'react';
import { FaMapMarkerAlt, FaFilter, FaList, FaMap } from 'react-icons/fa';
import './Map.css';

const Map = () => {
  const [mapType, setMapType] = useState('all');
  const [viewMode, setViewMode] = useState('map');

  const mapPoints = [
    {
      id: 1,
      title: "Mosquée Hassan II",
      type: "activity",
      category: "Culture",
      location: "Boulevard de la Corniche",
      coordinates: { lat: 33.6083, lng: -7.6328 },
      image: "/images/mosque.jpg"
    },
    {
      id: 2,
      title: "La Sqala",
      type: "restaurant",
      category: "Marocaine",
      location: "Médina",
      coordinates: { lat: 33.6033, lng: -7.6328 },
      image: "/images/la-sqala.jpg"
    },
    {
      id: 3,
      title: "Théâtre Mohammed V",
      type: "event",
      category: "Culture",
      location: "Centre-ville",
      coordinates: { lat: 33.6053, lng: -7.6308 },
      image: "/images/theatre.jpg"
    }
  ];

  return (
    <div className="map-page">
      <div className="map-header">
        <h1>Carte de Casablanca</h1>
        <p>Découvrez les activités, événements et restaurants sur la carte</p>
      </div>

      <div className="map-container">
        <div className="map-sidebar">
          <div className="map-filters">
            <h3>Filtres</h3>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${mapType === 'all' ? 'active' : ''}`}
                onClick={() => setMapType('all')}
              >
                Tout
              </button>
              <button 
                className={`filter-btn ${mapType === 'activity' ? 'active' : ''}`}
                onClick={() => setMapType('activity')}
              >
                Activités
              </button>
              <button 
                className={`filter-btn ${mapType === 'event' ? 'active' : ''}`}
                onClick={() => setMapType('event')}
              >
                Événements
              </button>
              <button 
                className={`filter-btn ${mapType === 'restaurant' ? 'active' : ''}`}
                onClick={() => setMapType('restaurant')}
              >
                Restaurants
              </button>
            </div>
          </div>

          <div className="map-points-list">
            <h3>Points d'intérêt</h3>
            <div className="points-list">
              {mapPoints
                .filter(point => mapType === 'all' || point.type === mapType)
                .map(point => (
                  <div key={point.id} className="map-point-item">
                    <div className="point-image">
                      <img src={point.image} alt={point.title} />
                    </div>
                    <div className="point-info">
                      <h4>{point.title}</h4>
                      <p className="point-category">{point.category}</p>
                      <p className="point-location">
                        <FaMapMarkerAlt /> {point.location}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="map-main">
          <div className="map-toolbar">
            <div className="view-controls">
              <button 
                className={`view-btn ${viewMode === 'map' ? 'active' : ''}`}
                onClick={() => setViewMode('map')}
              >
                <FaMap /> Carte
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <FaList /> Liste
              </button>
            </div>
          </div>

          <div className="map-content">
            {viewMode === 'map' ? (
              <div className="map-view">
                <div className="map-placeholder">
                  <p>Carte interactive en cours de chargement...</p>
                  <p>Intégration Leaflet/Google Maps à venir</p>
                  <div className="map-features">
                    <h4>Fonctionnalités de la carte :</h4>
                    <ul>
                      <li>Géolocalisation de l'utilisateur</li>
                      <li>Marqueurs pour activités, événements et restaurants</li>
                      <li>Filtrage par catégorie</li>
                      <li>Calcul d'itinéraires</li>
                      <li>Recherche par proximité</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="list-view">
                <div className="points-grid">
                  {mapPoints
                    .filter(point => mapType === 'all' || point.type === mapType)
                    .map(point => (
                      <div key={point.id} className="point-card">
                        <div className="point-card-image">
                          <img src={point.image} alt={point.title} />
                          <div className="point-type">{point.type}</div>
                        </div>
                        <div className="point-card-info">
                          <h3>{point.title}</h3>
                          <p className="point-category">{point.category}</p>
                          <p className="point-location">
                            <FaMapMarkerAlt /> {point.location}
                          </p>
                          <button className="point-btn">Voir détails</button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map; 