import React from 'react';
import { useParams } from 'react-router-dom';
import './RestaurantDetail.css';

const RestaurantDetail = () => {
  const { id } = useParams();

  return (
    <div className="restaurant-detail-page">
      <div className="restaurant-detail-container">
        <h1>Détails du restaurant #{id}</h1>
        <p>Page de détails du restaurant en cours de développement...</p>
        
        <div className="restaurant-detail-placeholder">
          <h2>Fonctionnalités prévues :</h2>
          <ul>
            <li>Photos du restaurant</li>
            <li>Menu et spécialités</li>
            <li>Horaires d'ouverture</li>
            <li>Réservation de table</li>
            <li>Avis clients</li>
            <li>Informations pratiques</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail; 