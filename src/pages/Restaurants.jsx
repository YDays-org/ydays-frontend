import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, StarIcon, ClockIcon, PhoneIcon } from '@heroicons/react/24/outline';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Restaurants = () => {
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  const cuisines = [
    { id: 'all', name: 'Toutes les cuisines' },
    { id: 'marocaine', name: 'Marocaine' },
    { id: 'francaise', name: 'Française' },
    { id: 'italienne', name: 'Italienne' },
    { id: 'japonaise', name: 'Japonaise' },
    { id: 'libanaise', name: 'Libanaise' },
  ];

  const restaurants = [
    {
      id: 1,
      name: 'Le Riad',
      cuisine: 'marocaine',
      rating: 4.8,
      priceRange: '€€',
      image: '/images/riad.jpg',
      location: 'Médina, Casablanca',
      phone: '+212 5 22 123 456',
      hours: '12:00 - 23:00',
      description: 'Restaurant traditionnel marocain avec une vue imprenable'
    },
    {
      id: 2,
      name: 'La Brasserie',
      cuisine: 'francaise',
      rating: 4.6,
      priceRange: '€€€',
      image: '/images/brasserie.jpg',
      location: 'Centre-ville, Casablanca',
      phone: '+212 5 22 234 567',
      hours: '11:30 - 00:00',
      description: 'Brasserie française authentique au cœur de la ville'
    },
    {
      id: 3,
      name: 'Sushi Bar',
      cuisine: 'japonaise',
      rating: 4.7,
      priceRange: '€€',
      image: '/images/sushi.jpg',
      location: 'Corniche, Casablanca',
      phone: '+212 5 22 345 678',
      hours: '18:00 - 23:30',
      description: 'Sushi frais et cuisine japonaise traditionnelle'
    }
  ];

  const filteredRestaurants = restaurants.filter(restaurant => {
    const cuisineMatch = selectedCuisine === 'all' || restaurant.cuisine === selectedCuisine;
    const priceMatch = priceRange === 'all' || restaurant.priceRange === priceRange;
    return cuisineMatch && priceMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Restaurants à Casablanca</h1>
          <p className="text-gray-600">Découvrez les meilleurs restaurants de la ville</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Filtres</h3>

              {/* Cuisine Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Type de cuisine</h4>
                <div className="space-y-2">
                  {cuisines.map((cuisine) => (
                    <label key={cuisine.id} className="flex items-center">
                      <input
                        type="radio"
                        name="cuisine"
                        value={cuisine.id}
                        checked={selectedCuisine === cuisine.id}
                        onChange={(e) => setSelectedCuisine(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">{cuisine.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Fourchette de prix</h4>
                <div className="space-y-2">
                  {[
                    { id: 'all', name: 'Tous les prix' },
                    { id: '€', name: 'Économique' },
                    { id: '€€', name: 'Modéré' },
                    { id: '€€€', name: 'Élevé' },
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

          {/* Restaurants Grid */}
          <div className="lg:w-3/4">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">
                {filteredRestaurants.length} restaurant{filteredRestaurants.length > 1 ? 's' : ''} trouvé{filteredRestaurants.length > 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <Card key={restaurant.id} className="overflow-hidden">
                  <div className="h-48 bg-gray-200 relative">
                    <div className="absolute top-4 left-4 bg-primary-600 text-white px-2 py-1 rounded text-sm">
                      {cuisines.find(c => c.id === restaurant.cuisine)?.name}
                    </div>
                    <div className="absolute top-4 right-4 bg-white text-gray-700 px-2 py-1 rounded text-sm font-semibold">
                      {restaurant.priceRange}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{restaurant.name}</h3>
                    <p className="text-gray-600 mb-3">{restaurant.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600">
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        <span className="text-sm">{restaurant.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <ClockIcon className="h-4 w-4 mr-2" />
                        <span className="text-sm">{restaurant.hours}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <PhoneIcon className="h-4 w-4 mr-2" />
                        <span className="text-sm">{restaurant.phone}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">{restaurant.rating}</span>
                      </div>
                      <Link to={`/restaurant/${restaurant.id}`}>
                        <Button size="sm">Voir détails</Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredRestaurants.length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-gray-500">Aucun restaurant trouvé avec ces critères</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Restaurants; 