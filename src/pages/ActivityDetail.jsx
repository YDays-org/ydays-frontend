import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPinIcon, StarIcon, CalendarIcon, ClockIcon, PhoneIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const ActivityDetail = () => {
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState('');
  const [participants, setParticipants] = useState(1);

  // Mock data - in real app this would come from API
  const activity = {
    id: 1,
    title: 'Visite de la Médina',
    category: 'Culture',
    rating: 4.8,
    totalReviews: 127,
    price: 150,
    duration: '3 heures',
    location: 'Médina, Casablanca',
    description: 'Découvrez l\'histoire et la culture de la médina de Casablanca avec un guide local expérimenté. Cette visite vous emmènera à travers les ruelles pittoresques, les souks traditionnels et les monuments historiques de la vieille ville.',
    highlights: [
      'Guide local francophone',
      'Visite des souks traditionnels',
      'Découverte de l\'architecture historique',
      'Dégustation de thé à la menthe',
      'Photos souvenirs incluses'
    ],
    included: [
      'Guide professionnel',
      'Thé à la menthe',
      'Photos souvenirs',
      'Transport depuis le point de rencontre'
    ],
    notIncluded: [
      'Pourboires',
      'Achats personnels',
      'Transport vers le point de rencontre'
    ],
    schedule: [
      { time: '09:00', activity: 'Rendez-vous au point de rencontre' },
      { time: '09:15', activity: 'Début de la visite de la médina' },
      { time: '10:30', activity: 'Pause thé à la menthe' },
      { time: '11:00', activity: 'Visite des souks' },
      { time: '12:00', activity: 'Fin de la visite' }
    ],
    contact: {
      phone: '+212 5 22 123 456',
      email: 'contact@medina-tours.ma',
      website: 'www.medina-tours.ma'
    },
    images: ['/images/medina1.jpg', '/images/medina2.jpg', '/images/medina3.jpg']
  };

  const reviews = [
    {
      id: 1,
      user: 'Marie L.',
      rating: 5,
      date: '2024-05-15',
      comment: 'Excellente visite ! Le guide était très compétent et nous a fait découvrir des endroits magnifiques.'
    },
    {
      id: 2,
      user: 'Ahmed K.',
      rating: 4,
      date: '2024-05-10',
      comment: 'Très belle expérience, je recommande vivement pour découvrir la culture marocaine.'
    }
  ];

  const handleBooking = () => {
    if (!selectedDate) {
      alert('Veuillez sélectionner une date');
      return;
    }
    // Navigate to booking page
    window.location.href = `/booking/activity/${id}?date=${selectedDate}&participants=${participants}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link to="/" className="hover:text-primary-600">Accueil</Link></li>
            <li>/</li>
            <li><Link to="/activities" className="hover:text-primary-600">Activités</Link></li>
            <li>/</li>
            <li className="text-gray-900">{activity.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Activity Header */}
            <Card className="mb-8">
              <div className="h-64 bg-gray-200 rounded-t-xl mb-6"></div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{activity.title}</h1>
                    <div className="flex items-center space-x-4 text-gray-600">
                      <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                        {activity.category}
                      </span>
                      <div className="flex items-center">
                        <StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
                        <span className="font-medium">{activity.rating}</span>
                        <span className="text-gray-500 ml-1">({activity.totalReviews} avis)</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary-600">{activity.price} MAD</div>
                    <div className="text-gray-600">par personne</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="h-5 w-5 mr-2" />
                    <span>{activity.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <ClockIcon className="h-5 w-5 mr-2" />
                    <span>{activity.duration}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <PhoneIcon className="h-5 w-5 mr-2" />
                    <span>{activity.contact.phone}</span>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed">{activity.description}</p>
              </div>
            </Card>

            {/* Highlights */}
            <Card className="mb-8">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Points forts</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {activity.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            {/* Schedule */}
            <Card className="mb-8">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Programme</h2>
                <div className="space-y-3">
                  {activity.schedule.map((item, index) => (
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
                <h3 className="text-xl font-semibold mb-4">Réserver cette activité</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de participants
                    </label>
                    <select
                      value={participants}
                      onChange={(e) => setParticipants(parseInt(e.target.value))}
                      className="input-field"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <option key={num} value={num}>{num} personne{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span>Prix par personne</span>
                      <span>{activity.price} MAD</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Nombre de participants</span>
                      <span>{participants}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>{activity.price * participants} MAD</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleBooking}
                    className="w-full"
                    disabled={!selectedDate}
                  >
                    Réserver maintenant
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium mb-3">Inclus</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {activity.included.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium mb-3">Non inclus</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {activity.notIncluded.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail; 