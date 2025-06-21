import React from 'react';
import styles from './Trending.module.css';
import GlobalCard from '../../components/GlobalCard';

const trendingData = [
  {
    id: 1,
    title: 'Surf à Ain Diab',
    category: 'Sport',
    image: '/images/surf.jpg',
    description: 'Initiez-vous au surf sur les vagues de l\'océan Atlantique.',
    location: 'Ain Diab',
    rating: 4.8,
    duration: '4h',
    price: 300
  },
  {
    id: 2,
    title: 'Visite de la Mosquée Hassan II',
    category: 'Culture',
    image: '/images/mosque.jpg',
    description: 'Découvrez l\'une des plus grandes mosquées du monde avec un guide expert.',
    location: 'Boulevard de la Corniche',
    rating: 4.9,
    duration: '2h',
    price: 150
  },
  // ...add more trending items as needed
];

const Trending = () => (
  <div className={styles['trending-page']}>
    <div className={styles['trending-header']}>
      <h1>Tendances</h1>
      <p>Découvrez les activités et lieux les plus populaires à Casablanca</p>
    </div>
    <div className={styles['trending-container']}>
      <div className={styles['trending-list']}>
        {trendingData.map(item => (
          <GlobalCard key={item.id} item={item} onReserve={() => {}} />
        ))}
      </div>
    </div>
  </div>
);

export default Trending;