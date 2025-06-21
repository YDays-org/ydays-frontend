import React from 'react';
import styles from './FilterSidebar.module.css';

const FilterSidebar = ({ filters, categories, onChange, onClear }) => (
  <aside className={styles['filters-sidebar']}>
    <div className={styles['filters-header']}>
      <span role="img" aria-label="Filtrer">🔎</span>
      <h3>Filtres</h3>
    </div>
    <div className={styles['filter-group']}>
      <label>Catégorie</label>
      <select value={filters.category} onChange={e => onChange('category', e.target.value)}>
        {categories.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
    </div>
    <div className={styles['filter-group']}>
      <label>Prix</label>
      <select value={filters.priceRange} onChange={e => onChange('priceRange', e.target.value)}>
        <option value="">Tous les prix</option>
        <option value="0-100">Moins de 100 MAD</option>
        <option value="100-200">100-200 MAD</option>
        <option value="200-500">200-500 MAD</option>
        <option value="500+">Plus de 500 MAD</option>
      </select>
    </div>
    <div className={styles['filter-group']}>
      <label>Durée</label>
      <select value={filters.duration} onChange={e => onChange('duration', e.target.value)}>
        <option value="">Toutes les durées</option>
        <option value="1h">1 heure</option>
        <option value="2h">2 heures</option>
        <option value="3h">3 heures</option>
        <option value="4h+">4+ heures</option>
      </select>
    </div>
    <div className={styles['filter-group']}>
      <label>Note minimum</label>
      <select value={filters.rating} onChange={e => onChange('rating', e.target.value)}>
        <option value="">Toutes les notes</option>
        <option value="4.5">4.5+ étoiles</option>
        <option value="4.0">4.0+ étoiles</option>
        <option value="3.5">3.5+ étoiles</option>
      </select>
    </div>
    <button className={styles['clear-filters']} onClick={onClear}>Effacer les filtres</button>
  </aside>
);

export default FilterSidebar;
