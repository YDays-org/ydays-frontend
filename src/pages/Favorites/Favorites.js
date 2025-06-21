import React from 'react';
import './Favorites.css';

const Favorites = () => {
  return (
    <div className="favorites-page">
      <div className="favorites-container">
        <h1>Mes Favoris</h1>
        <p>Page des favoris en cours de développement...</p>
        
        <div className="favorites-placeholder">
          <h2>Fonctionnalités prévues :</h2>
          <ul>
            <li>Liste des activités favorites</li>
            <li>Liste des événements favorites</li>
            <li>Liste des restaurants favorites</li>
            <li>Organisation par catégories</li>
            <li>Partage de favoris</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Favorites; 