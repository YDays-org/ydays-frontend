import React from 'react';
import styles from './GlobalCard.module.css';
import { FaMapMarkerAlt, FaStar, FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const GlobalCard = ({ item, onReserve }) => (
  <div className={styles['global-card']} tabIndex={0} aria-label={item.title}>
    <div className={styles['global-card-image']}>
      <img src={item.image} alt={item.title} />
      <div className={styles['global-card-category']}>{item.category}</div>
    </div>
    <div className={styles['global-card-info']}>
      <h3>{item.title}</h3>
      <p className={styles['global-card-description']}>{item.description}</p>
      <div className={styles['global-card-meta']}>
        <span className={styles['location']}>
          <FaMapMarkerAlt /> {item.location}
        </span>
        <span className={styles['rating']}>
          <FaStar /> {item.rating}
        </span>
        <span className={styles['duration']}>
          <FaClock /> {item.duration}
        </span>
      </div>
      <div className={styles['global-card-price']}>
        <span className={styles['global-card-price-value']}>{item.price} MAD</span>
        <Link
          to="#"
          className={styles['global-card-button']}
          onClick={e => {
            e.preventDefault();
            onReserve(item.id);
          }}
        >
          Réserver
        </Link>
      </div>
    </div>
  </div>
);

export default GlobalCard;
