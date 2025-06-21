import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import styles from './Auth.module.css';

const AuthPage = () => {
  const [tab, setTab] = useState('login');
  return (
    <div className={styles['auth-page']}>
      <div className={styles['auth-container']}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <button
            onClick={() => setTab('login')}
            style={{
              background: tab === 'login' ? 'linear-gradient(120deg, #42AB9E 60%, #e0f7f4 100%)' : '#e0f7f4',
              color: tab === 'login' ? '#fff' : '#42AB9E',
              border: 'none',
              borderRadius: 12,
              padding: '0.9rem 2.2rem',
              fontWeight: 700,
              marginRight: 12,
              fontSize: '1.1rem',
              cursor: 'pointer',
              boxShadow: tab === 'login' ? '0 2px 8px rgba(66,171,158,0.10)' : 'none',
              transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
            }}
          >
            Connexion
          </button>
          <button
            onClick={() => setTab('register')}
            style={{
              background: tab === 'register' ? 'linear-gradient(120deg, #42AB9E 60%, #e0f7f4 100%)' : '#e0f7f4',
              color: tab === 'register' ? '#fff' : '#42AB9E',
              border: 'none',
              borderRadius: 12,
              padding: '0.9rem 2.2rem',
              fontWeight: 700,
              fontSize: '1.1rem',
              cursor: 'pointer',
              boxShadow: tab === 'register' ? '0 2px 8px rgba(66,171,158,0.10)' : 'none',
              transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
            }}
          >
            Créer un compte
          </button>
        </div>
        {/* <div className={styles['social-login']}>
          <button className={styles['social-btn']} disabled style={{ opacity: 0.7 }}>
            <span role="img" aria-label="Google">🔒</span> Connexion avec Google (bientôt)
          </button>
          <button className={styles['social-btn']} disabled style={{ opacity: 0.7 }}>
            <span role="img" aria-label="Facebook">📘</span> Connexion avec Facebook (bientôt)
          </button>
        </div> */}
        <div style={{ margin: '2.2rem 0 0 0' }}>
          {tab === 'login' ? <Login /> : <Register />}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
