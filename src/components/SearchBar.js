import React, { useState, useRef } from 'react';
import styles from './SearchBar.module.css';
import { FaSearch, FaTimes } from 'react-icons/fa';

/**
 * SearchBar component
 * @param {Array} data - The data array to search in
 * @param {Function} onSearch - Callback with filtered results
 * @param {string} [placeholder] - Placeholder text
 */
const SearchBar = ({ data = [], onSearch, placeholder = 'Rechercher...' }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef();

  const handleChange = e => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) {
      const lower = value.toLowerCase();
      const filtered = data.filter(item =>
        Object.values(item).some(
          v => typeof v === 'string' && v.toLowerCase().includes(lower)
        )
      );
      onSearch(filtered);
    }
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
    if (onSearch) onSearch(data);
  };

  return (
    <div className={styles['search-bar-container']}>
      <FaSearch className={styles['search-icon']} />
      <input
        ref={inputRef}
        className={styles['search-input']}
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="Recherche"
      />
      {query && (
        <button className={styles['clear-btn']} onClick={handleClear} aria-label="Effacer">
          <FaTimes />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
