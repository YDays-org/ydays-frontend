import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, MapPinIcon, CalendarIcon, StarIcon } from '@heroicons/react/24/outline';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const featuredActivities = [
    {
      id: 1,
      title: 'Visite de la Médina',
      category: 'Culture',
      rating: 4.8,
      price: '150 MAD',
      image: '/images/medina.jpg',
      location: 'Médina, Casablanca'
    },
    {
      id: 2,
      title: 'Cours de Cuisine Marocaine',
      category: 'Gastronomie',
      rating: 4.9,
      price: '300 MAD',
      image: '/images/cooking.jpg',
      location: 'Centre-ville, Casablanca'
    },
    {
      id: 3,
      title: 'Balade en Bateau',
      category: 'Loisirs',
      rating: 4.7,
      price: '200 MAD',
      image: '/images/boat.jpg',
      location: 'Port de Casablanca'
    }
  ];

  const categories = [
    { name: 'Activités', href: '/activities', icon: '🎯', count: '150+' },
    { name: 'Événements', href: '/events', icon: '🎉', count: '25+' },
    { name: 'Restaurants', href: '/restaurants', icon: '🍽️', count: '80+' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Découvrez Casablanca
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Les meilleures activités, événements et restaurants de la ville blanche
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une activité, événement ou restaurant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  Rechercher
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Explorez par catégorie</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link key={category.name} to={category.href}>
                <Card className="p-8 text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-gray-600">{category.count} disponibles</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Activities */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Activités populaires</h2>
            <Link to="/activities">
              <Button variant="outline">Voir tout</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredActivities.map((activity) => (
              <Card key={activity.id} className="overflow-hidden">
                <div className="h-48 bg-gray-200 relative">
                  <div className="absolute top-4 left-4 bg-primary-600 text-white px-2 py-1 rounded text-sm">
                    {activity.category}
                  </div>
                  <div className="absolute top-4 right-4 bg-white text-gray-700 px-2 py-1 rounded text-sm font-semibold">
                    {activity.price}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{activity.title}</h3>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    <span className="text-sm">{activity.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{activity.rating}</span>
                    </div>
                    <Link to={`/activity/${activity.id}`}>
                      <Button size="sm">Réserver</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Pourquoi nous choisir ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPinIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Géolocalisation précise</h3>
              <p className="text-gray-600">Trouvez facilement les activités près de chez vous</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Réservation instantanée</h3>
              <p className="text-gray-600">Réservez vos activités en quelques clics</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <StarIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Avis vérifiés</h3>
              <p className="text-gray-600">Découvrez les meilleures recommandations</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 