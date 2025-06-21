import React from 'react';
import { useParams } from 'react-router-dom';
import styles from './ActivityDetail.module.css';

const ActivityDetail = () => {
  const { id } = useParams();

  return (
    <div className={styles['activity-detail-page']}>
      <div className={styles['activity-detail-container']}>
        <h1>Détails de l'activité #{id}</h1>
        <p>Page de détails de l'activité en cours de développement...</p>
        
        <div className={styles['activity-detail-placeholder']}>
          <h2>Fonctionnalités prévues :</h2>
          <ul>
            <li>Galerie d'images et vidéos</li>
            <li>Description détaillée</li>
            <li>Informations pratiques (horaires, prix, durée)</li>
            <li>Avis et notes des utilisateurs</li>
            <li>Calendrier de réservation</li>
            <li>Formulaire de réservation</li>
            <li>Localisation sur carte</li>
            <li>Activités similaires</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail;