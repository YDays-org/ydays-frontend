import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaClock, FaUsers } from 'react-icons/fa';
import './Home.css';

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

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Découvrez Casablanca</h1>
          <p>Les meilleures activités, événements et restaurants de la ville blanche</p>
          <div className="hero-search">
            <input 
              type="text" 
              placeholder="Que cherchez-vous à Casablanca ?"
              className="search-input"
            />
            <button className="search-button">Rechercher</button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <h2>Explorez par catégorie</h2>
        <div className="categories-grid">
          <Link to="/activities" className="category-card">
            <div className="category-icon">🎯</div>
            <h3>Activités</h3>
            <p>Découvrez des expériences uniques</p>
          </Link>
          <Link to="/events" className="category-card">
            <div className="category-icon">🎪</div>
            <h3>Événements</h3>
            <p>Ne manquez aucun événement</p>
          </Link>
          <Link to="/restaurants" className="category-card">
            <div className="category-icon">🍽️</div>
            <h3>Restaurants</h3>
            <p>Goûtez aux saveurs locales</p>
          </Link>
          <Link to="/trending" className="category-card">
            <div className="category-icon">🔥</div>
            <h3>Tendances</h3>
            <p>Ce qui fait le buzz</p>
          </Link>
        </div>
      </section>

      {/* Featured Activities */}
      <section className="featured-activities">
        <h2>Activités populaires</h2>
        <div className="activities-grid">
          {featuredActivities.map(activity => (
            <div key={activity.id} className="activity-card">
              <div className="activity-image">
                <img src={activity.image} alt={activity.title} />
                <div className="activity-category">{activity.category}</div>
              </div>
              <div className="activity-content">
                <h3>{activity.title}</h3>
                <div className="activity-meta">
                  <span className="location">
                    <FaMapMarkerAlt /> {activity.location}
                  </span>
                  <span className="rating">
                    <FaStar /> {activity.rating}
                  </span>
                </div>
                <div className="activity-details">
                  <span className="duration">
                    <FaClock /> {activity.duration}
                  </span>
                  <span className="price">{activity.price}</span>
                </div>
                <Link to={`/activity/${activity.id}`} className="book-button">
                  Réserver
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="view-all">
          <Link to="/activities" className="view-all-button">
            Voir toutes les activités
          </Link>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="upcoming-events">
        <h2>Événements à venir</h2>
        <div className="events-grid">
          {upcomingEvents.map(event => (
            <div key={event.id} className="event-card">
              <div className="event-image">
                <img src={event.image} alt={event.title} />
              </div>
              <div className="event-content">
                <h3>{event.title}</h3>
                <div className="event-meta">
                  <span className="date">{event.date}</span>
                  <span className="location">
                    <FaMapMarkerAlt /> {event.location}
                  </span>
                </div>
                <Link to={`/event/${event.id}`} className="event-button">
                  En savoir plus
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <h2>Découvrez Casablanca sur la carte</h2>
        <div className="map-container">
          <div className="map-placeholder">
            <p>Carte interactive en cours de chargement...</p>
            <Link to="/map" className="map-button">
              Voir la carte complète
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 