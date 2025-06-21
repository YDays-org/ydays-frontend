import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, StarIcon, FilterIcon } from '@heroicons/react/24/outline';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Activities = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  const categories = [
    { id: 'all', name: 'Toutes les catégories' },
    { id: 'culture', name: 'Culture' },
    { id: 'sport', name: 'Sport' },
    { id: 'gastronomie', name: 'Gastronomie' },
    { id: 'loisirs', name: 'Loisirs' },
    { id: 'nature', name: 'Nature' },
  ];

  const activities = [
    {
      id: 1,
      title: 'Visite de la Médina',
      category: 'culture',
      rating: 4.8,
      price: 150,
      image: '/images/medina.jpg',
      location: 'Médina, Casablanca',
      description: 'Découvrez l\'histoire et la culture de la médina de Casablanca'
    },
    {
      id: 2,
      title: 'Cours de Cuisine Marocaine',
      category: 'gastronomie',
      rating: 4.9,
      price: 300,
      image: '/images/cooking.jpg',
      location: 'Centre-ville, Casablanca',
      description: 'Apprenez à cuisiner les plats traditionnels marocains'
    },
    {
      id: 3,
      title: 'Balade en Bateau',
      category: 'loisirs',
      rating: 4.7,
      price: 200,
      image: '/images/boat.jpg',
      location: 'Port de Casablanca',
      description: 'Profitez d\'une balade en mer avec vue sur la ville'
    }
  ];

  const filteredActivities = activities.filter(activity => {
    const categoryMatch = selectedCategory === 'all' || activity.category === selectedCategory;
    const priceMatch = priceRange === 'all' || 
      (priceRange === 'low' && activity.price <= 100) ||
      (priceRange === 'medium' && activity.price > 100 && activity.price <= 250) ||
      (priceRange === 'high' && activity.price > 250);
    
    return categoryMatch && priceMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Activités à Casablanca</h1>
          <p className="text-gray-600">Découvrez les meilleures activités de la ville</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <FilterIcon className="h-5 w-5 mr-2" />
                <h3 className="font-semibold">Filtres</h3>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Catégorie</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={selectedCategory === category.id}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Prix</h4>
                <div className="space-y-2">
                  {[
                    { id: 'all', name: 'Tous les prix' },
                    { id: 'low', name: 'Moins de 100 MAD' },
                    { id: 'medium', name: '100 - 250 MAD' },
                    { id: 'high', name: 'Plus de 250 MAD' },
                  ].map((price) => (
                    <label key={price.id} className="flex items-center">
                      <input
                        type="radio"
                        name="price"
                        value={price.id}
                        checked={priceRange === price.id}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">{price.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Activities Grid */}
          <div className="lg:w-3/4">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">
                {filteredActivities.length} activité{filteredActivities.length > 1 ? 's' : ''} trouvée{filteredActivities.length > 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredActivities.map((activity) => (
                <Card key={activity.id} className="overflow-hidden">
                  <div className="h-48 bg-gray-200 relative">
                    <div className="absolute top-4 left-4 bg-primary-600 text-white px-2 py-1 rounded text-sm">
                      {categories.find(c => c.id === activity.category)?.name}
                    </div>
                    <div className="absolute top-4 right-4 bg-white text-gray-700 px-2 py-1 rounded text-sm font-semibold">
                      {activity.price} MAD
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{activity.title}</h3>
                    <p className="text-gray-600 mb-3">{activity.description}</p>
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
                        <Button size="sm">Voir détails</Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredActivities.length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-gray-500">Aucune activité trouvée avec ces critères</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activities; 