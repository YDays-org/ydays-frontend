import React from 'react';
import styles from './New.module.css';
import GlobalCard from '../../components/GlobalCard';

const newsData = [
  {
    id: 1,
    title: 'Ouverture d\'un nouveau musée',
    category: 'Culture',
    image: '/images/museum.jpg',
    description: 'Un nouveau musée d\'art moderne ouvre ses portes au centre-ville.',
    location: 'Centre-ville',
    rating: 4.7,
    duration: 'Permanent',
    price: 0
  },
  {
    id: 2,
    title: 'Festival de Jazz',
    category: 'Musique',
    image: '/images/jazz.jpg',
    description: 'Le festival annuel de jazz revient avec des artistes internationaux.',
    location: 'Parc de la Ligue Arabe',
    rating: 4.8,
    duration: '3 jours',
    price: 200
  },
  {
    id: 3,
    title: "Atelier de Poterie Traditionnelle",
    category: "Artisanat",
    image: "/images/pottery.jpg",
    description: "Apprenez l'art de la poterie traditionnelle marocaine avec des artisans locaux.",
    location: "Quartier des Habous",
    rating: 4.6,
    duration: "3 heures",
    price: 150
  },
  {
    id: 4,
    title: "Restaurant Fusion Maroc-Japon",
    category: "Gastronomie",
    image: "/images/fusion-restaurant.jpg",
    description: "Une expérience culinaire unique mêlant saveurs marocaines et japonaises.",
    location: "Marina",
    rating: 4.5,
    duration: "2 heures",
    price: 300
  },
  {
    id: 5,
    title: "Concert de Gnawa Moderne",
    category: "Musique",
    image: "/images/gnawa.jpg",
    description: "Découvrez la musique gnawa revisitée par des artistes contemporains.",
    location: "Complexe Culturel",
    rating: 4.7,
    duration: "2 heures",
    price: 100
  },
  {
    id: 6,
    title: "Escape Game Médina",
    category: "Loisir",
    image: "/images/escape-game.jpg",
    description: "Un escape game immersif dans les ruelles mystérieuses de la médina.",
    location: "Ancienne Médina",
    rating: 4.4,
    duration: "1 heure",
    price: 200
  }
];

const New = () => (
  <div className={styles['news-page']}>
    <div className={styles['news-header']}>
      <h1>Actualités</h1>
      <p>Les dernières nouvelles et événements à Casablanca</p>
    </div>
    <div className={styles['news-container']}>
      <div className={styles['news-list']}>
        {newsData.map(item => (
          <GlobalCard key={item.id} item={item} onReserve={() => {}} />
        ))}
      </div>
    </div>
  </div>
);

export default New;