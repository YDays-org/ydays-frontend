import React from 'react';
import { useParams } from 'react-router-dom';
import styles from './RestaurantDetail.module.css';

const RestaurantDetail = () => {
  const { id } = useParams();

  return (
    <div className={styles['restaurant-detail-page']}>
      <div className={styles['restaurant-detail-container']}>
        <h1>Détails du restaurant #{id}</h1>
        <p>Page de détails du restaurant en cours de développement...</p>
        
        <div className={styles['restaurant-detail-placeholder']}>
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