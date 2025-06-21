import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Booking.module.css';

const Booking = () => {
  const { type, id } = useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'60vh'}}>
        <div style={{border:'6px solid #e0f7f4',borderTop:'6px solid #42AB9E',borderRadius:'50%',width:48,height:48,animation:'spin 1s linear infinite'}} />
        <style>{'@keyframes spin{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}'}</style>
      </div>
    );
  }

  return (
    <div className={styles['booking-page']}>
      <div className={styles['booking-container']}>
        <h1>Réservation - {type} #{id}</h1>
        <p>Page de réservation en cours de développement...</p>
        
        <div className={styles['booking-placeholder']}>
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