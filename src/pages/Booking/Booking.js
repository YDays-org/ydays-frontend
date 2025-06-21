import React from 'react';
import { useParams } from 'react-router-dom';
import './Booking.css';

const Booking = () => {
  const { type, id } = useParams();

  return (
    <div className="booking-page">
      <div className="booking-container">
        <h1>Réservation - {type} #{id}</h1>
        <p>Page de réservation en cours de développement...</p>
        
        <div className="booking-placeholder">
          <h2>Fonctionnalités prévues :</h2>
          <ul>
            <li>Calendrier de disponibilité</li>
            <li>Sélection de date et heure</li>
            <li>Nombre de participants</li>
            <li>Formulaire de réservation</li>
            <li>Paiement sécurisé</li>
            <li>Confirmation de réservation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Booking; 