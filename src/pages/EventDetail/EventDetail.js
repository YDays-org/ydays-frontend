import React from 'react';
import { useParams } from 'react-router-dom';
import styles from './EventDetail.module.css';

const EventDetail = () => {
  const { id } = useParams();

  return (
    <div className={styles['event-detail-page']}>
      <div className={styles['event-detail-container']}>
        <h1>Détails de l'événement #{id}</h1>
        <p>Page de détails de l'événement en cours de développement...</p>
        
        <div className={styles['event-detail-placeholder']}>
          <h2>Fonctionnalités prévues :</h2>
          <ul>
            <li>Informations sur l'événement</li>
            <li>Date et heure</li>
            <li>Lieu et accès</li>
            <li>Programme détaillé</li>
            <li>Billetterie</li>
            <li>Partage sur réseaux sociaux</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;