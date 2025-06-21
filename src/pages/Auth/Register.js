import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaPhone } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Auth.module.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    try {
      // Remplacez par votre véritable point de terminaison API
      const response = await axios.post('/api/auth/register', formData);
      login(response.data.user);
    } catch (err) {
      setError("Erreur lors de l'inscription");
    }
  };

  return (
    <div className={styles['auth-page']}>
      <div className={styles['auth-container']}>
        <div className={styles['auth-header']}>
          <h1>Créer un compte</h1>
          <p>Rejoignez Casablanca Activities et découvrez la ville blanche</p>
        </div>

        <form className={styles['auth-form']} onSubmit={handleSubmit} autoComplete="on">
          <div className={styles['form-row']}>
            <div className={styles['form-group']}>
              <label htmlFor="firstName">Prénom</label>
              <div className={styles['input-wrapper']}>
                <FaUser className={styles['input-icon']} />
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  autoComplete="given-name"
                />
              </div>
            </div>
            <div className={styles['form-group']}>
              <label htmlFor="lastName">Nom</label>
              <div className={styles['input-wrapper']}>
                <FaUser className={styles['input-icon']} />
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  autoComplete="family-name"
                />
              </div>
            </div>
          </div>
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
                required
                autoComplete="email"
              />
            </div>
          </div>
          <div className={styles['form-group']}>
            <label htmlFor="phone">Téléphone</label>
            <div className={styles['input-wrapper']}>
              <FaPhone className={styles['input-icon']} />
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                autoComplete="tel"
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
                required
                autoComplete="new-password"
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
          <div className={styles['form-group']}>
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <div className={styles['input-wrapper']}>
              <FaLock className={styles['input-icon']} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                style={{ background: 'none', border: 'none', marginLeft: 8, cursor: 'pointer', color: '#42AB9E' }}
                tabIndex={-1}
                aria-label={showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          {error && <div style={{ color: 'red', marginBottom: '1rem', fontWeight: 600 }}>{error}</div>}
          <div className={styles['form-options']}>
            <label className={styles['checkbox-label']}>
              <input type="checkbox" required />
              <span>
                J'accepte les{' '}
                <Link to="/terms" className={styles['auth-link']}>
                  conditions d'utilisation
                </Link>{' '}
                et la{' '}
                <Link to="/privacy" className={styles['auth-link']}>
                  politique de confidentialité
                </Link>
              </span>
            </label>
          </div>

          <button type="submit" className={styles['auth-button']}>
            Créer mon compte
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
            Déjà un compte ?{' '}
            <Link to="/login" className={styles['auth-link']}>
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;