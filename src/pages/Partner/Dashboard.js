import React from 'react';
import styles from './Dashboard.module.css';

const PartnerDashboard = () => {
  return (
    <div className={styles['partner-dashboard-page']}>
      <div className={styles['partner-dashboard-container']}>
        <h1>Tableau de bord Partenaire</h1>
        <p>Espace partenaire en cours de développement...</p>
        
        <div className={styles['partner-dashboard-placeholder']}>
          <h2>Fonctionnalités prévues :</h2>
          <ul>
            <li>Vue d'ensemble des réservations</li>
            <li>Statistiques de performance</li>
            <li>Gestion des annonces</li>
            <li>Gestion des disponibilités</li>
            <li>Gestion des réservations</li>
            <li>Outils de promotion</li>
            <li>Gestion des avis</li>
            <li>Rapports et analyses</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;