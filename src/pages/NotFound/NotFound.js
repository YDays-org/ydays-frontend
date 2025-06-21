import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaArrowLeft } from 'react-icons/fa';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-content">
          <h1>404</h1>
          <h2>Page non trouvée</h2>
          <p>
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          
          <div className="not-found-actions">
            <Link to="/" className="action-button primary">
              <FaHome /> Retour à l'accueil
            </Link>
            <Link to="/activities" className="action-button secondary">
              <FaSearch /> Découvrir des activités
            </Link>
            <button 
              onClick={() => window.history.back()} 
              className="action-button secondary"
            >
              <FaArrowLeft /> Retour en arrière
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 