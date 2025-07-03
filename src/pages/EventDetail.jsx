import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPinIcon, StarIcon, CalendarIcon, ClockIcon, PhoneIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const EventDetail = () => {
  const { id } = useParams();
  const [tickets, setTickets] = useState(1);

  // Mock data
  const event = {
    id: 1,
    title: 'Festival de Musique Gnaoua',
    date: '2024-06-15',
    time: '20:00',
    category: 'Musique',
    rating: 4.8,
    totalReviews: 89,
    price: 200,
    location: 'Place Mohammed V, Casablanca',
    organizer: 'Association Gnaoua',
    description: 'Festival traditionnel de musique Gnaoua avec des artistes internationaux. Une soirée magique pour découvrir les rythmes ancestraux du Maroc.',
    highlights: [
      'Artistes Gnaoua internationaux',
      'Spectacle de danse traditionnelle',
      'Exposition d\'instruments',
      'Dégustation de cuisine locale',
      'Ateliers de musique'
    ],
    program: [
      { time: '18:00', activity: 'Ouverture des portes' },
      { time: '19:00', activity: 'Exposition d\'instruments' },
      { time: '20:00', activity: 'Spectacle principal' },
      { time: '22:00', activity: 'Ateliers participatifs' },
      { time: '23:30', activity: 'Clôture' }
    ],
    contact: {
      phone: '+212 5 22 123 456',
      email: 'contact@festival-gnaoua.ma',
      website: 'www.festival-gnaoua.ma'
    }
  };

  const reviews = [
    {
      id: 1,
      user: 'Fatima A.',
      rating: 5,
      date: '2024-05-10',
      comment: 'Spectacle incroyable ! La musique Gnaoua est vraiment magique.'
    },
    {
      id: 2,
      user: 'Mohammed B.',
      rating: 4,
      date: '2024-05-08',
      comment: 'Très belle soirée, je recommande vivement.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link to="/" className="hover:text-primary-600">Accueil</Link></li>
            <li>/</li>
            <li><Link to="/events" className="hover:text-primary-600">Événements</Link></li>
            <li>/</li>
            <li className="text-gray-900">{event.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Event Header */}
            <Card className="mb-8">
              <div className="h-64 bg-gray-200 rounded-t-xl mb-6"></div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
                    <div className="flex items-center space-x-4 text-gray-600">
                      <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                        {event.category}
                      </span>
                      <div className="flex items-center">
                        <StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
                        <span className="font-medium">{event.rating}</span>
                        <span className="text-gray-500 ml-1">({event.totalReviews} avis)</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary-600">{event.price} MAD</div>
                    <div className="text-gray-600">par billet</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    <span>
                      {new Date(event.date).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <ClockIcon className="h-5 w-5 mr-2" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="h-5 w-5 mr-2" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed">{event.description}</p>
              </div>
            </Card>

            {/* Highlights */}
            <Card className="mb-8">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Au programme</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {event.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            {/* Program */}
            <Card className="mb-8">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Programme détaillé</h2>
                <div className="space-y-3">
                  {event.program.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-16 text-sm font-medium text-primary-600">{item.time}</div>
                      <div className="flex-1 text-gray-700">{item.activity}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Reviews */}
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Avis clients</h2>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="font-medium">{review.user}</span>
                          <div className="flex items-center ml-2">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Réserver des billets</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de billets
                    </label>
                    <select
                      value={tickets}
                      onChange={(e) => setTickets(parseInt(e.target.value))}
                      className="input-field"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <option key={num} value={num}>{num} billet{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span>Prix par billet</span>
                      <span>{event.price} MAD</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Nombre de billets</span>
                      <span>{tickets}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>{event.price * tickets} MAD</span>
                      </div>
                    </div>
                  </div>

                  <Link to={`/booking/event/${id}?tickets=${tickets}`} className="w-full block text-center bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700">
                    Réserver maintenant
                  </Link>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium mb-3">Organisateur</h4>
                  <p className="text-gray-600 mb-3">{event.organizer}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      <span className="text-sm">{event.contact.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <GlobeAltIcon className="h-4 w-4 mr-2" />
                      <span className="text-sm">{event.contact.website}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;