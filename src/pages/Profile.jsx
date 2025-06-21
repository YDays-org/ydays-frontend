import { useState } from 'react';
import { UserIcon, CalendarIcon, MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  
  const [profileData, setProfileData] = useState({
    firstName: 'Ahmed',
    lastName: 'Benali',
    email: 'ahmed.benali@email.com',
    phone: '+212 6 12 34 56 78',
    dateOfBirth: '1990-05-15',
    address: '123 Rue Hassan II, Casablanca',
    preferences: {
      activities: true,
      events: true,
      restaurants: true,
      notifications: true
    }
  });

  const bookings = [
    {
      id: 1,
      type: 'activity',
      title: 'Visite de la Médina',
      date: '2024-06-20',
      status: 'confirmed',
      price: 150
    },
    {
      id: 2,
      type: 'event',
      title: 'Festival de Musique Gnaoua',
      date: '2024-06-25',
      status: 'pending',
      price: 200
    },
    {
      id: 3,
      type: 'restaurant',
      title: 'Le Riad',
      date: '2024-06-18',
      status: 'completed',
      price: 0
    }
  ];

  const favorites = [
    {
      id: 1,
      type: 'activity',
      title: 'Cours de Cuisine Marocaine',
      image: '/images/cooking.jpg'
    },
    {
      id: 2,
      type: 'restaurant',
      title: 'La Brasserie',
      image: '/images/brasserie.jpg'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // In real app, this would save to backend
    console.log('Profile updated:', profileData);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Confirmé';
      case 'pending': return 'En attente';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
          <p className="text-gray-600">Gérez vos informations personnelles et vos réservations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserIcon className="h-10 w-10 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold">{profileData.firstName} {profileData.lastName}</h3>
                <p className="text-gray-600 text-sm">{profileData.email}</p>
              </div>

              <nav className="space-y-2">
                {[
                  { id: 'profile', name: 'Informations personnelles', icon: UserIcon },
                  { id: 'bookings', name: 'Mes réservations', icon: CalendarIcon },
                  { id: 'favorites', name: 'Mes favoris', icon: '❤️' },
                  { id: 'settings', name: 'Paramètres', icon: '⚙️' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {typeof tab.icon === 'string' ? (
                      <span className="mr-3">{tab.icon}</span>
                    ) : (
                      <tab.icon className="h-5 w-5 mr-3" />
                    )}
                    {tab.name}
                  </button>
                ))}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Information */}
            {activeTab === 'profile' && (
              <Card>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Informations personnelles</h2>
                    <Button
                      onClick={() => setIsEditing(!isEditing)}
                      variant={isEditing ? 'outline' : 'primary'}
                    >
                      {isEditing ? 'Annuler' : 'Modifier'}
                    </Button>
                  </div>

                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Prénom
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={profileData.firstName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={profileData.lastName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date de naissance
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={profileData.dateOfBirth}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={profileData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                      />
                    </div>

                    {isEditing && (
                      <div className="flex justify-end">
                        <Button onClick={handleSave}>
                          Enregistrer les modifications
                        </Button>
                      </div>
                    )}
                  </form>
                </div>
              </Card>
            )}

            {/* Bookings */}
            {activeTab === 'bookings' && (
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Mes réservations</h2>
                  
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{booking.title}</h3>
                            <div className="flex items-center text-gray-600 text-sm mt-1">
                              <CalendarIcon className="h-4 w-4 mr-1" />
                              <span>{new Date(booking.date).toLocaleDateString('fr-FR')}</span>
                              <span className="mx-2">•</span>
                              <span className="capitalize">{booking.type}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                              {getStatusText(booking.status)}
                            </span>
                            {booking.price > 0 && (
                              <span className="font-medium text-gray-900">{booking.price} MAD</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Favorites */}
            {activeTab === 'favorites' && (
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Mes favoris</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {favorites.map((favorite) => (
                      <div key={favorite.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="h-32 bg-gray-200 rounded mb-3"></div>
                        <h3 className="font-medium text-gray-900">{favorite.title}</h3>
                        <p className="text-gray-600 text-sm capitalize">{favorite.type}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Settings */}
            {activeTab === 'settings' && (
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Paramètres</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Notifications</h3>
                      <div className="space-y-3">
                        {Object.entries(profileData.preferences).map(([key, value]) => (
                          <label key={key} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => setProfileData(prev => ({
                                ...prev,
                                preferences: {
                                  ...prev.preferences,
                                  [key]: e.target.checked
                                }
                              }))}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <span className="ml-3 text-sm text-gray-700 capitalize">
                              {key === 'notifications' ? 'Notifications générales' : key}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium mb-4">Sécurité</h3>
                      <Button variant="outline">
                        Changer le mot de passe
                      </Button>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium mb-4 text-red-600">Zone dangereuse</h3>
                      <Button variant="danger">
                        Supprimer mon compte
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 