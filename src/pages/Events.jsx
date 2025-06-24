import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, MapPinIcon, ClockIcon, StarIcon } from '@heroicons/react/24/outline';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Events = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const events = [
    {
      id: 1,
      title: 'Festival de Musique Gnaoua',
      date: '2025-06-15',
      time: '20:00',
      category: 'Musique',
      rating: 4.8,
      price: '200 MAD',
      image: '/images/gnaoua.jpg',
      location: 'Place Mohammed V, Casablanca',
      description: 'Festival traditionnel de musique Gnaoua avec des artistes internationaux'
    },
    {
      id: 2,
      title: 'Exposition d\'Art Contemporain',
      date: '2025-06-20',
      time: '10:00',
      category: 'Art',
      rating: 4.6,
      price: 'Gratuit',
      image: '/images/art.jpg',
      location: 'Musée d\'Art Contemporain, Casablanca',
      description: 'Exposition d\'artistes marocains contemporains'
    },
    {
      id: 3,
      title: 'Food Festival',
      date: '2025-06-25',
      time: '18:00',
      category: 'Gastronomie',
      rating: 4.9,
      price: '150 MAD',
      image: '/images/food.jpg',
      location: 'Corniche, Casablanca',
      description: 'Découvrez les saveurs de la cuisine marocaine'
    }
  ];

  // Get unique categories
  const categories = ['all', ...new Set(events.map(event => event.category))];

  const filteredEvents = events.filter(event => {
    const categoryMatch = selectedCategory === 'all' || event.category === selectedCategory;
    
    // Search filtering logic
    const searchMatch = searchQuery === '' || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Date filtering logic
    let dateMatch = true;
    if (dateFrom && dateTo) {
      const eventDate = new Date(event.date);
      const fromDate = new Date(dateFrom);
      const toDate = new Date(dateTo);
      dateMatch = eventDate >= fromDate && eventDate <= toDate;
    } else if (dateFrom) {
      const eventDate = new Date(event.date);
      const fromDate = new Date(dateFrom);
      dateMatch = eventDate >= fromDate;
    } else if (dateTo) {
      const eventDate = new Date(event.date);
      const toDate = new Date(dateTo);
      dateMatch = eventDate <= toDate;
    }
    
    return categoryMatch && dateMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Événements à Casablanca</h1>
          <p className="text-gray-600">Découvrez les événements culturels et festifs de la ville</p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <Card className="p-6">
            {/* Header with Reset Button */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2 text-primary-600" />
                <h3 className="font-semibold text-gray-900">Filtres</h3>
              </div>
              <button
                onClick={() => {
                  setDateFrom('');
                  setDateTo('');
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors border border-gray-300"
              >
                Réinitialiser
              </button>
            </div>

            {/* Search Input */}
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <svg className="h-4 w-4 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h4 className="font-medium text-gray-900">Recherche</h4>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par titre, description ou lieu..."
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
              />
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Date Range Filter */}
              <div>
                <div className="flex items-center mb-3">
                  <CalendarIcon className="h-4 w-4 mr-2 text-primary-600" />
                  <h4 className="font-medium text-gray-900">Période</h4>
                </div>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                    placeholder="Date de début"
                  />
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                    placeholder="Date de fin"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <div className="flex items-center mb-3">
                  <StarIcon className="h-4 w-4 mr-2 text-primary-600" />
                  <h4 className="font-medium text-gray-900">Catégorie</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedCategory === category
                          ? 'bg-primary-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
                      }`}
                    >
                      {category === 'all' ? 'Toutes' : category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Date Range Feedback */}
            {dateFrom && dateTo && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  Affichage des événements entre le {new Date(dateFrom).toLocaleDateString('fr-FR')} et le {new Date(dateTo).toLocaleDateString('fr-FR')}
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Events Grid */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-gray-600">
            {filteredEvents.length} événement{filteredEvents.length > 1 ? 's' : ''} trouvé{filteredEvents.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <div className="h-48 bg-gray-200 relative">
                <div className="absolute top-4 left-4 bg-primary-600 text-white px-2 py-1 rounded text-sm">
                  {event.category}
                </div>
                <div className="absolute top-4 right-4 bg-white text-gray-700 px-2 py-1 rounded text-sm font-semibold">
                  {event.price}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-3">{event.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      {new Date(event.date).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">{event.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{event.rating}</span>
                  </div>
                  <Link to={`/event/${event.id}`}>
                    <Button size="sm">Voir détails</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-gray-500">Aucun événement trouvé pour ces critères</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Events; 