import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, StarIcon, ClockIcon, PhoneIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

const RestaurantDetail = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [guests, setGuests] = useState(2);
  const { isAuthenticated } = useAuth();

  // Mock data
  const restaurant = {
    id: 1,
    name: 'Le Riad',
    cuisine: 'Marocaine',
    rating: 4.8,
    totalReviews: 156,
    priceRange: '€€',
    location: 'Médina, Casablanca',
    phone: '+212 5 22 123 456',
    website: 'www.le-riad.ma',
    hours: '12:00 - 23:00',
    description: 'Restaurant traditionnel marocain avec une vue imprenable sur la médina. Découvrez les saveurs authentiques de la cuisine marocaine dans un cadre chaleureux et accueillant.',
    specialties: [
      'Couscous royal',
      'Tajine de poulet aux olives',
      'Pastilla au pigeon',
      'Thé à la menthe traditionnel'
    ],
    menu: {
      entrées: [
        { name: 'Harira', price: '25 MAD', description: 'Soupe traditionnelle marocaine' },
        { name: 'Salade marocaine', price: '30 MAD', description: 'Salade fraîche avec légumes de saison' },
        { name: 'Briouates', price: '35 MAD', description: 'Feuilles de brick farcies aux légumes' }
      ],
      plats: [
        { name: 'Couscous royal', price: '85 MAD', description: 'Couscous avec légumes et viandes variées' },
        { name: 'Tajine de poulet', price: '75 MAD', description: 'Tajine de poulet aux olives et citrons confits' },
        { name: 'Pastilla au pigeon', price: '95 MAD', description: 'Pastilla traditionnelle au pigeon et amandes' },
        { name: 'Méchoui', price: '120 MAD', description: 'Agneau rôti aux herbes et épices' }
      ],
      desserts: [
        { name: 'Baklava', price: '25 MAD', description: 'Pâtisserie aux amandes et miel' },
        { name: 'Chebakia', price: '20 MAD', description: 'Gâteau traditionnel aux épices' }
      ]
    },
    amenities: [
      'Terrasse avec vue',
      'Parking disponible',
      'Réservation en ligne',
      'Carte bancaire acceptée',
      'Wi-Fi gratuit'
    ]
  };

  const reviews = [
    {
      id: 1,
      user: 'Sarah M.',
      rating: 5,
      date: '2024-05-12',
      comment: 'Excellente cuisine marocaine ! Le couscous était délicieux et le service impeccable.'
    },
    {
      id: 2,
      user: 'Karim L.',
      rating: 4,
      date: '2024-05-08',
      comment: 'Très bon restaurant, ambiance chaleureuse et plats authentiques.'
    }
  ];

  const timeSlots = [
    '12:00', '12:30', '13:00', '13:30', '19:00', '19:30', '20:00', '20:30', '21:00'
  ];

  const handleReservationClick = () => {
    if (!isAuthenticated()) {
      alert('Vous devez être connecté pour réserver une table.');
      return;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link to="/" className="hover:text-primary-600">Accueil</Link></li>
            <li>/</li>
            <li><Link to="/restaurants" className="hover:text-primary-600">Restaurants</Link></li>
            <li>/</li>
            <li className="text-gray-900">{restaurant.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Restaurant Header */}
            <Card className="mb-8">
              <div className="h-64 bg-gray-200 rounded-t-xl mb-6"></div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
                    <div className="flex items-center space-x-4 text-gray-600">
                      <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                        {restaurant.cuisine}
                      </span>
                      <div className="flex items-center">
                        <StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
                        <span className="font-medium">{restaurant.rating}</span>
                        <span className="text-gray-500 ml-1">({restaurant.totalReviews} avis)</span>
                      </div>
                      <span className="text-gray-600">{restaurant.priceRange}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="h-5 w-5 mr-2" />
                    <span>{restaurant.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <ClockIcon className="h-5 w-5 mr-2" />
                    <span>{restaurant.hours}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <PhoneIcon className="h-5 w-5 mr-2" />
                    <span>{restaurant.phone}</span>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed">{restaurant.description}</p>
              </div>
            </Card>

            {/* Specialties */}
            <Card className="mb-8">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Spécialités</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {restaurant.specialties.map((specialty, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                      {specialty}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            {/* Menu */}
            <Card className="mb-8">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">Menu</h2>
                
                {/* Entrées */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4 text-primary-600">Entrées</h3>
                  <div className="space-y-4">
                    {restaurant.menu.entrées.map((item, index) => (
                      <div key={index} className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-gray-600 text-sm">{item.description}</p>
                        </div>
                        <span className="font-medium text-primary-600">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plats */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4 text-primary-600">Plats principaux</h3>
                  <div className="space-y-4">
                    {restaurant.menu.plats.map((item, index) => (
                      <div key={index} className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-gray-600 text-sm">{item.description}</p>
                        </div>
                        <span className="font-medium text-primary-600">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Desserts */}
                <div>
                  <h3 className="text-lg font-medium mb-4 text-primary-600">Desserts</h3>
                  <div className="space-y-4">
                    {restaurant.menu.desserts.map((item, index) => (
                      <div key={index} className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-gray-600 text-sm">{item.description}</p>
                        </div>
                        <span className="font-medium text-primary-600">{item.price}</span>
                      </div>
                    ))}
                  </div>
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

          {/* Reservation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Réserver une table</h3>
                
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
                      Heure
                    </label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="input-field"
                    >
                      <option value="">Sélectionner une heure</option>
                      {timeSlots.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de personnes
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      className="input-field"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <option key={num} value={num}>{num} personne{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  {!selectedDate || !selectedTime ? (
                    <p className="text-red-500 text-sm mb-2">Veuillez sélectionner une date et une heure.</p>
                  ) : null}
                  <Link
                    to={selectedDate && selectedTime ? `/booking/restaurant?date=${selectedDate}&time=${selectedTime}` : "#"}
                    onClick={handleReservationClick}
                    className={`w-full block text-center py-2 px-4 rounded-md ${selectedDate && selectedTime ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  >
                    Réserver une table
                  </Link>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium mb-3">Équipements</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {restaurant.amenities.map((amenity, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                        {amenity}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium mb-3">Contact</h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      <span className="text-sm">{restaurant.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <GlobeAltIcon className="h-4 w-4 mr-2" />
                      <span className="text-sm">{restaurant.website}</span>
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

export default RestaurantDetail;