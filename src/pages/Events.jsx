import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, MapPinIcon, ClockIcon, StarIcon } from '@heroicons/react/24/outline';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Events = () => {
  const [selectedDate, setSelectedDate] = useState('all');

  const events = [
    {
      id: 1,
      title: 'Festival de Musique Gnaoua',
      date: '2024-06-15',
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
      date: '2024-06-20',
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
      date: '2024-06-25',
      time: '18:00',
      category: 'Gastronomie',
      rating: 4.9,
      price: '150 MAD',
      image: '/images/food.jpg',
      location: 'Corniche, Casablanca',
      description: 'Découvrez les saveurs de la cuisine marocaine'
    }
  ];

  const filteredEvents = selectedDate === 'all' 
    ? events 
    : events.filter(event => event.date === selectedDate);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Événements à Casablanca</h1>
          <p className="text-gray-600">Découvrez les événements culturels et festifs de la ville</p>
        </div>

        {/* Date Filter */}
        <div className="mb-8">
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <CalendarIcon className="h-5 w-5 mr-2" />
              <h3 className="font-semibold">Filtrer par date</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedDate('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedDate === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Toutes les dates
              </button>
              {events.map((event) => (
                <button
                  key={event.date}
                  onClick={() => setSelectedDate(event.date)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedDate === event.date
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {new Date(event.date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </button>
              ))}
            </div>
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
            <p className="text-gray-500">Aucun événement trouvé pour cette date</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Events; 