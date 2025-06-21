import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Auth.module.css';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('/api/auth/login', formData);
      login(response.data.user);
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    }
  };

  return (
    <div className={styles['auth-page']}>
      <div className={styles['auth-container']}>
        <div className={styles['auth-header']}>
          <h1>Connexion</h1>
          <p>Connectez-vous à votre compte Casablanca Activities</p>
        </div>

        <form className={styles['auth-form']} onSubmit={handleSubmit} autoComplete="on">
          <div className={styles['form-group']}>
            <label htmlFor="email">Email</label>
            <div className={styles['input-wrapper']}>
              <FaEnvelope className={styles['input-icon']} />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votre@email.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className={styles['form-group']}>
            <label htmlFor="password">Mot de passe</label>
            <div className={styles['input-wrapper']}>
              <FaLock className={styles['input-icon']} />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Votre mot de passe"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{ background: 'none', border: 'none', marginLeft: 8, cursor: 'pointer', color: '#42AB9E' }}
                tabIndex={-1}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {error && <div style={{ color: 'red', marginBottom: '1rem', fontWeight: 600 }}>{error}</div>}
          <button type="submit" className={styles['auth-button']}>
            Se connecter
          </button>
        </form>

        <div className={styles['auth-divider']}>
          <span>ou</span>
        </div>

        <div className={styles['social-login']}>
          <button className={`${styles['social-button']} ${styles['google']}`}>
            Continuer avec Google
          </button>
          <button className={`${styles['social-button']} ${styles['facebook']}`}>
            Continuer avec Facebook
          </button>
        </div>

        <div className={styles['auth-footer']}>
          <p>
            Pas encore de compte ?{' '}
            <Link to="/register" className={styles['auth-link']}>
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;