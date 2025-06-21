import React from 'react';
import { FaFire, FaMapMarkerAlt, FaStar, FaClock } from 'react-icons/fa';
import './Trending.css';

const Trending = () => {
  const trendingItems = [
    {
      id: 1,
      title: "Visite de la Mosquée Hassan II",
      type: "activity",
      category: "Culture",
      location: "Boulevard de la Corniche",
      rating: 4.8,
      views: 1250,
      image: "/images/mosque.jpg"
    },
    {
      id: 2,
      title: "Festival de Jazz de Casablanca",
      type: "event",
      category: "Musique",
      location: "Théâtre Mohammed V",
      rating: 4.7,
      views: 980,
      image: "/images/jazz-festival.jpg"
    },
    {
      id: 3,
      title: "La Sqala",
      type: "restaurant",
      category: "Marocaine",
      location: "Médina",
      rating: 4.7,
      views: 850,
      image: "/images/la-sqala.jpg"
    }
  ];

  return (
    <div className="trending-page">
      <div className="trending-header">
        <h1>
          <FaFire /> Tendances à Casablanca
        </h1>
        <p>Découvrez ce qui fait le buzz en ce moment</p>
      </div>

      <div className="trending-content">
        <div className="trending-grid">
          {trendingItems.map((item, index) => (
            <div key={item.id} className={`trending-item trending-${index + 1}`}>
              <div className="trending-image">
                <img src={item.image} alt={item.title} />
                <div className="trending-badge">
                  <FaFire /> #{index + 1}
                </div>
                <div className="trending-type">{item.type}</div>
              </div>
              <div className="trending-info">
                <h3>{item.title}</h3>
                <div className="trending-meta">
                  <span className="category">{item.category}</span>
                  <span className="location">
                    <FaMapMarkerAlt /> {item.location}
                  </span>
                  <span className="rating">
                    <FaStar /> {item.rating}
                  </span>
                </div>
                <div className="trending-stats">
                  <span className="views">{item.views} vues</span>
                </div>
                <button className="trending-btn">Découvrir</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Trending; 