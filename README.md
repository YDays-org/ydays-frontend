# Casablanca Découvertes - Plateforme de Découverte et Réservation d'Activités

Une plateforme web moderne pour découvrir et réserver des activités, événements et restaurants à Casablanca.

## 🚀 Fonctionnalités

### Pour les Utilisateurs
- **Découverte d'activités** : Navigation intuitive avec catégories prédéfinies
- **Recherche avancée** : Filtrage par date, prix, localisation, type
- **Géolocalisation** : Affichage des options à proximité
- **Réservation en ligne** : Système de réservation simple et sécurisé
- **Profils utilisateurs** : Gestion des favoris et historique
- **Avis et notes** : Système d'évaluation communautaire

### Pour les Partenaires
- **Tableau de bord** : Gestion des réservations et statistiques
- **Gestion d'annonces** : Création et modification d'activités
- **Outils de promotion** : Mise en avant des offres
- **Gestion des avis** : Réponse aux commentaires clients

## 🛠️ Technologies Utilisées

- **Frontend** : React 18 + Vite
- **Styling** : Tailwind CSS
- **Routing** : React Router DOM
- **Icons** : Heroicons + Lucide React
- **Build Tool** : Vite

## 📁 Structure du Projet

```
src/
├── components/
│   ├── layout/
│   │   ├── Layout.jsx          # Layout principal
│   │   ├── Header.jsx          # Navigation et header
│   │   └── Footer.jsx          # Footer avec liens
│   └── ui/
│       ├── Button.jsx          # Composant bouton réutilisable
│       ├── Card.jsx            # Composant carte
│       └── LoadingSpinner.jsx  # Spinner de chargement
├── pages/
│   ├── Home.jsx                # Page d'accueil
│   ├── Activities.jsx          # Liste des activités
│   ├── Events.jsx              # Liste des événements
│   ├── Restaurants.jsx         # Liste des restaurants
│   ├── ActivityDetail.jsx      # Détail d'une activité
│   ├── EventDetail.jsx         # Détail d'un événement
│   ├── RestaurantDetail.jsx    # Détail d'un restaurant
│   ├── Booking.jsx             # Page de réservation
│   ├── Profile.jsx             # Profil utilisateur
│   ├── NotFound.jsx            # Page 404
│   └── auth/
│       ├── Login.jsx           # Page de connexion
│       └── Register.jsx        # Page d'inscription
├── App.jsx                     # Composant principal avec routes
└── index.css                   # Styles Tailwind et personnalisés
```

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (version 16 ou supérieure)
- npm ou yarn

### Installation

1. **Cloner le repository**
```bash
git clone <repository-url>
cd ydays-frontend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Démarrer le serveur de développement**
```bash
npm run dev
```

4. **Ouvrir dans le navigateur**
```
http://localhost:5173
```

### Scripts Disponibles

```bash
npm run dev          # Démarrer le serveur de développement
npm run build        # Construire pour la production
npm run preview      # Prévisualiser la build de production
npm run lint         # Linter le code (si configuré)
```

## 🎨 Design System

### Couleurs
- **Primary** : Bleu (#3B82F6) - Couleur principale de la marque
- **Secondary** : Gris (#64748B) - Couleurs secondaires
- **Success** : Vert (#10B981) - Actions positives
- **Warning** : Jaune (#F59E0B) - Avertissements
- **Error** : Rouge (#EF4444) - Erreurs

### Typographie
- **Font Family** : Inter (Google Fonts)
- **Weights** : 300, 400, 500, 600, 700

### Composants
- **Boutons** : Variantes primary, secondary, outline, danger
- **Cartes** : Conteneurs avec ombre et bordure
- **Formulaires** : Inputs stylisés avec validation

## 📱 Responsive Design

La plateforme est entièrement responsive avec des breakpoints :
- **Mobile** : < 768px
- **Tablet** : 768px - 1024px
- **Desktop** : > 1024px

## 🔧 Configuration

### Variables d'Environnement
Créer un fichier `.env.local` pour les variables d'environnement :

```env
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Tailwind CSS
Configuration personnalisée dans `tailwind.config.js` avec :
- Couleurs de marque
- Typographie personnalisée
- Composants utilitaires

## 🚀 Déploiement

### Build de Production
```bash
npm run build
```

### Déploiement sur Vercel
1. Connecter le repository GitHub à Vercel
2. Configurer les variables d'environnement
3. Déployer automatiquement

### Déploiement sur Netlify
1. Connecter le repository GitHub à Netlify
2. Configurer le build command : `npm run build`
3. Configurer le publish directory : `dist`

## 🤝 Contribution

### Workflow de Développement
1. Créer une branche feature : `git checkout -b feature/nom-feature`
2. Développer et tester
3. Commiter les changements : `git commit -m "feat: description"`
4. Pousser vers la branche : `git push origin feature/nom-feature`
5. Créer une Pull Request

### Standards de Code
- **ESLint** : Configuration pour React
- **Prettier** : Formatage automatique
- **Conventions** : CamelCase pour les variables, PascalCase pour les composants

## 📋 Roadmap

### Phase 1 (Actuelle)
- [x] Structure de base du projet
- [x] Pages principales (Accueil, Activités, Événements, Restaurants)
- [x] Système de navigation
- [x] Pages de détail
- [x] Système de réservation

### Phase 2
- [ ] Intégration API backend
- [ ] Système d'authentification complet
- [ ] Géolocalisation et cartes
- [ ] Système de paiement

### Phase 3
- [ ] Application mobile (React Native)
- [ ] Notifications push
- [ ] Système de recommandations
- [ ] Analytics avancés

## 📞 Support

Pour toute question ou support :
- **Email** : support@casablanca-decouvertes.ma
- **Documentation** : [Lien vers la documentation]
- **Issues** : [GitHub Issues]

## 📄 Licence

Ce projet est développé dans le cadre du concours YDAYS 2024/2025.

---

**Équipe de Développement** - YDAYS 2024/2025
