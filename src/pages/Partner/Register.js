import React from 'react';
import styles from './Register.module.css';

const PartnerRegister = () => {
  return (
    <div className={styles['partner-register-page']}>
      <div className={styles['partner-register-container']}>
        <h1>Devenir Partenaire</h1>
        <p>Formulaire d'inscription partenaire en cours de développement...</p>
        
        <div className={styles['partner-register-placeholder']}>
          <h2>Fonctionnalités prévues :</h2>
          <ul>
            <li>Formulaire d'inscription partenaire</li>
            <li>Vérification des informations</li>
            <li>Validation du compte</li>
            <li>Accès au tableau de bord</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PartnerRegister;
