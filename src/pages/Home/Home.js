import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaClock } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Home.module.css';

const Home = () => {
  const featuredActivities = [
    {
      id: 1,
      title: "Visite de la Mosquée Hassan II",
      category: "Culture",
      location: "Boulevard de la Corniche",
      rating: 4.8,
      price: "150 MAD",
      image: "/images/mosque.jpg",
      duration: "2h"
    },
    {
      id: 2,
      title: "Dégustation de Cuisine Marocaine",
      category: "Gastronomie",
      location: "Médina",
      rating: 4.6,
      price: "200 MAD",
      image: "/images/food.jpg",
      duration: "3h"
    },
    {
      id: 3,
      title: "Balade en Médina",
      category: "Découverte",
      location: "Ancienne Médina",
      rating: 4.7,
      price: "100 MAD",
      image: "/images/medina.jpg",
      duration: "1h30"
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Festival de Jazz de Casablanca",
      date: "15-20 Déc 2024",
      location: "Théâtre Mohammed V",
      image: "/images/jazz-festival.jpg"
    },
    {
      id: 2,
      title: "Exposition d'Art Contemporain",
      date: "10-25 Déc 2024",
      location: "Villa des Arts",
      image: "/images/art-exhibition.jpg"
    }
  ];

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleReserve = (id) => {
    if (!user) {
      navigate('/auth');
    } else {
      navigate(`/activity/${id}`);
    }
  };

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles['hero-content']}>
          <h1>Découvrez Casablanca</h1>
          <p>Les meilleures activités, événements et restaurants de la ville blanche</p>
          <div className={styles['hero-search']}>
            <input 
              type="text" 
              placeholder="Que cherchez-vous à Casablanca ?"
              className={styles['search-input']}
            />
            <button className={styles['search-button']}>Rechercher</button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className={styles.categories}>
        <h2>Explorez par catégorie</h2>
        <div className={styles['categories-grid']}>
          <Link to="/activities" className={styles['category-card']}>
            <div className={styles['category-icon']}>🎯</div>
            <h3>Activités</h3>
            <p>Découvrez des expériences uniques</p>
          </Link>
          <Link to="/events" className={styles['category-card']}>
            <div className={styles['category-icon']}>🎪</div>
            <h3>Événements</h3>
            <p>Ne manquez aucun événement</p>
          </Link>
          <Link to="/restaurants" className={styles['category-card']}>
            <div className={styles['category-icon']}>🍽️</div>
            <h3>Restaurants</h3>
            <p>Goûtez aux saveurs locales</p>
          </Link>
          <Link to="/trending" className={styles['category-card']}>
            <div className={styles['category-icon']}>🔥</div>
            <h3>Tendances</h3>
            <p>Ce qui fait le buzz</p>
          </Link>
        </div>
      </section>

      {/* Featured Activities */}
      <section className={styles['featured-activities']}>
        <h2>Activités populaires</h2>
        <div className={styles['activities-grid']}>
          {featuredActivities.map(activity => (
            <div key={activity.id} className={styles['activity-card']}>
              <div className={styles['activity-image']}>
                <img src={activity.image} alt={activity.title} />
                <div className={styles['activity-category']}>{activity.category}</div>
              </div>
              <div className={styles['activity-content']}>
                <h3>{activity.title}</h3>
                <div className={styles['activity-meta']}>
                  <span className={styles.location}>
                    <FaMapMarkerAlt /> {activity.location}
                  </span>
                  <span className={styles.rating}>
                    <FaStar /> {activity.rating}
                  </span>
                </div>
                <div className={styles['activity-details']}>
                  <span className={styles.duration}>
                    <FaClock /> {activity.duration}
                  </span>
                  <span className={styles.price}>{activity.price}</span>
                </div>
                <Link
                  to="#"
                  className={styles['book-button']}
                  onClick={e => {
                    e.preventDefault();
                    handleReserve(activity.id);
                  }}
                >
                  Réserver
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className={styles['view-all']}>
          <Link to="/activities" className={styles['view-all-button']}>
            Voir toutes les activités
          </Link>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className={styles['upcoming-events']}>
        <h2>Événements à venir</h2>
        <div className={styles['events-grid']}>
          {upcomingEvents.map(event => (
            <div key={event.id} className={styles['event-card']}>
              <div className={styles['event-image']}>
                <img src={event.image} alt={event.title} />
              </div>
              <div className={styles['event-content']}>
                <h3>{event.title}</h3>
                <div className={styles['event-meta']}>
                  <span className={styles.date}>{event.date}</span>
                  <span className={styles.location}>
                    <FaMapMarkerAlt /> {event.location}
                  </span>
                </div>
                <Link to={`/event/${event.id}`} className={styles['event-button']}>
                  En savoir plus
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Map Section */}
      <section className={styles['map-section']}>
        <h2>Découvrez Casablanca sur la carte</h2>
        <div className={styles['map-container']}>
          <div className={styles['map-placeholder']}>
            <p>Carte interactive en cours de chargement...</p>
            <Link to="/map" className={styles['map-button']}>
              Voir la carte complète
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;