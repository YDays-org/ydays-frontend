import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Casablanca Activities</h3>
          <p>Découvrez et réservez les meilleures activités, événements et restaurants de Casablanca.</p>
          <div className="social-links">
            <a href="#" aria-label="Facebook"><FaFacebook /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Découvrir</h4>
          <ul>
            <li><Link to="/activities">Activités</Link></li>
            <li><Link to="/events">Événements</Link></li>
            <li><Link to="/restaurants">Restaurants</Link></li>
            <li><Link to="/trending">Tendances</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><Link to="/help">Aide</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/terms">Conditions d'utilisation</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Partenaires</h4>
          <ul>
            <li><Link to="/partner/register">Devenir partenaire</Link></li>
            <li><Link to="/partner/dashboard">Espace partenaire</Link></li>
            <li><Link to="/partner/support">Support partenaire</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Casablanca Activities. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer; 