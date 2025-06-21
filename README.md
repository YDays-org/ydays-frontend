# Casablanca Activities Platform

Une plateforme web moderne pour la découverte et la réservation d'activités, événements et restaurants à Casablanca.

## 🎯 Objectif

Développer une plateforme web conviviale permettant aux habitants et visiteurs de Casablanca de découvrir facilement une variété d'activités, d'événements culturels et de restaurants, et de pouvoir les réserver directement via la plateforme.

## 🚀 Fonctionnalités

### Pour les utilisateurs
- **Découverte** : Navigation intuitive avec catégories prédéfinies
- **Recherche avancée** : Filtrage par date, prix, emplacement, type
- **Géolocalisation** : Affichage des options à proximité
- **Réservation** : Système de réservation intégré avec paiement sécurisé
- **Profils utilisateurs** : Gestion des favoris et historique

### Pour les partenaires
- **Tableau de bord** : Gestion des réservations et statistiques
- **Gestion des annonces** : Création et modification d'offres
- **Outils de promotion** : Mise en avant des offres

## 🛠️ Technologies utilisées

- **Frontend** : React 19, React Router DOM
- **UI/UX** : React Icons, Styled Components, Framer Motion
- **Maps** : React Leaflet, Leaflet
- **Forms** : React Hook Form
- **HTTP Client** : Axios
- **Date handling** : Date-fns, React Datepicker
- **Notifications** : React Hot Toast
- **State Management** : React Query

## 📁 Structure du projet

```
src/
├── components/           # Composants réutilisables
│   ├── layout/          # Composants de mise en page
│   │   ├── Header.js    # En-tête avec navigation
│   │   ├── Footer.js    # Pied de page
│   │   └── Layout.js    # Layout principal
│   └── ui/              # Composants UI (à créer)
├── pages/               # Pages de l'application
│   ├── Home/            # Page d'accueil
│   ├── Activities/      # Liste des activités
│   ├── Events/          # Liste des événements
│   ├── Restaurants/     # Liste des restaurants
│   ├── Trending/        # Tendances
│   ├── New/             # Nouveautés
│   ├── Map/             # Carte interactive
│   ├── Auth/            # Authentification
│   │   ├── Login.js     # Connexion
│   │   └── Register.js  # Inscription
│   ├── Profile/         # Profil utilisateur
│   ├── Favorites/       # Favoris
│   ├── Booking/         # Réservation
│   ├── Partner/         # Espace partenaire
│   └── NotFound/        # Page 404
├── services/            # Services API (à créer)
├── hooks/               # Hooks personnalisés (à créer)
├── utils/               # Utilitaires (à créer)
├── styles/              # Styles globaux (à créer)
└── App.js               # Composant principal avec routes
```

## 🚀 Installation et démarrage

1. **Cloner le repository**
   ```bash
   git clone [url-du-repo]
   cd ydays-frontend
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Démarrer le serveur de développement**
   ```bash
   npm start
   ```

4. **Ouvrir dans le navigateur**
   ```
   http://localhost:3000
   ```

## 📋 Routes principales

- `/` - Page d'accueil
- `/activities` - Liste des activités
- `/events` - Liste des événements
- `/restaurants` - Liste des restaurants
- `/trending` - Tendances
- `/new` - Nouveautés
- `/map` - Carte interactive
- `/login` - Connexion
- `/register` - Inscription
- `/profile` - Profil utilisateur
- `/favorites` - Favoris
- `/booking/:type/:id` - Réservation
- `/partner/dashboard` - Tableau de bord partenaire

## 🎨 Design et UX

- Interface moderne et responsive
- Navigation intuitive
- Filtres avancés
- Vue liste et carte
- Système de géolocalisation
- Expérience utilisateur fluide

## 🔒 Sécurité

- Authentification sécurisée
- Protection des données sensibles
- Validation des entrées
- Sécurité des APIs

## 📱 Responsive Design

La plateforme est conçue pour être responsive et fonctionner sur :
- Desktop
- Tablette
- Mobile

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est développé dans le cadre du concours YDAYS.

## 👥 Équipe

- Développé par l'équipe YDAYS Frontend
- Année universitaire 2024/2025

---

**Note** : Ce projet est en cours de développement. Certaines fonctionnalités sont encore en phase de conception.
