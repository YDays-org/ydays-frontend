import React from 'react';
import styles from './Profile.module.css';

const Profile = () => {
  return (
    <div className={styles['profile-page']}>
      <div className={styles['profile-container']}>
        <h1>Mon Profil</h1>
        <p>Page de profil utilisateur en cours de développement...</p>
        
        <div className={styles['profile-placeholder']}>
          <h2>Fonctionnalités prévues :</h2>
          <ul>
            <li>Informations personnelles</li>
            <li>Historique des réservations</li>
            <li>Favoris</li>
            <li>Paramètres du compte</li>
            <li>Préférences</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;