import React from 'react';
import { FaNewspaper, FaMapMarkerAlt, FaStar, FaCalendar } from 'react-icons/fa';
import './New.css';

const New = () => {
  const newItems = [
    {
      id: 1,
      title: "Atelier de Poterie Traditionnelle",
      type: "activity",
      category: "Artisanat",
      location: "Quartier des Habous",
      rating: 4.6,
      dateAdded: "2024-12-01",
      image: "/images/pottery.jpg",
      description: "Apprenez l'art de la poterie traditionnelle marocaine avec des artisans locaux."
    },
    {
      id: 2,
      title: "Restaurant Fusion Maroc-Japon",
      type: "restaurant",
      category: "Fusion",
      location: "Marina",
      rating: 4.5,
      dateAdded: "2024-11-28",
      image: "/images/fusion-restaurant.jpg",
      description: "Une expérience culinaire unique mêlant saveurs marocaines et japonaises."
    },
    {
      id: 3,
      title: "Concert de Gnawa Moderne",
      type: "event",
      category: "Musique",
      location: "Complexe Culturel",
      rating: 4.7,
      dateAdded: "2024-11-30",
      image: "/images/gnawa.jpg",
      description: "Découvrez la musique gnawa revisitée par des artistes contemporains."
    },
    {
      id: 4,
      title: "Escape Game Médina",
      type: "activity",
      category: "Loisir",
      location: "Ancienne Médina",
      rating: 4.4,
      dateAdded: "2024-11-25",
      image: "/images/escape-game.jpg",
      description: "Un escape game immersif dans les ruelles mystérieuses de la médina."
    }
  ];

  return (
    <div className="new-page">
      <div className="new-header">
        <h1>
          <FaNewspaper /> Nouveautés à Casablanca
        </h1>
        <p>Découvrez les dernières nouveautés ajoutées à notre plateforme</p>
      </div>

      <div className="new-content">
        <div className="new-grid">
          {newItems.map((item, index) => (
            <div key={item.id} className="new-item">
              <div className="new-image">
                <img src={item.image} alt={item.title} />
                <div className="new-badge">Nouveau</div>
                <div className="new-type">{item.type}</div>
              </div>
              <div className="new-info">
                <h3>{item.title}</h3>
                <p className="new-description">{item.description}</p>
                <div className="new-meta">
                  <span className="category">{item.category}</span>
                  <span className="location">
                    <FaMapMarkerAlt /> {item.location}
                  </span>
                  <span className="rating">
                    <FaStar /> {item.rating}
                  </span>
                </div>
                <div className="new-date">
                  <FaCalendar /> Ajouté le {new Date(item.dateAdded).toLocaleDateString('fr-FR')}
                </div>
                <button className="new-btn">Découvrir</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default New; 