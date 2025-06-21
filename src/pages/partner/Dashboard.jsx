import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { 
  ChartBarIcon, 
  CalendarIcon, 
  UserGroupIcon, 
  StarIcon,
  PlusIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = {
    totalBookings: 156,
    totalRevenue: 24500,
    averageRating: 4.7,
    activeListings: 8
  };

  const recentBookings = [
    {
      id: 1,
      customer: 'Ahmed Benali',
      activity: 'Visite de la Médina',
      date: '2024-06-20',
      status: 'confirmed',
      amount: 150
    },
    {
      id: 2,
      customer: 'Fatima Alami',
      activity: 'Cours de Cuisine',
      date: '2024-06-22',
      status: 'pending',
      amount: 300
    }
  ];

  const tabs = [
    { id: 'overview', name: 'Vue d\'ensemble', icon: ChartBarIcon },
    { id: 'bookings', name: 'Réservations', icon: CalendarIcon },
    { id: 'listings', name: 'Mes annonces', icon: PlusIcon },
    { id: 'reviews', name: 'Avis clients', icon: StarIcon },
    { id: 'settings', name: 'Paramètres', icon: CogIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Tableau de bord partenaire</h1>
              <p className="text-sm text-gray-600">Gérez vos activités et réservations</p>
            </div>
            <Button>
              <PlusIcon className="h-5 w-5 mr-2" />
              Nouvelle annonce
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="h-5 w-5 mr-3" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <CalendarIcon className="h-8 w-8 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Réservations totales</p>
                          <p className="text-2xl font-semibold text-gray-900">{stats.totalBookings}</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card>
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <ChartBarIcon className="h-8 w-8 text-green-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Revenus totaux</p>
                          <p className="text-2xl font-semibold text-gray-900">{stats.totalRevenue} MAD</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card>
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <StarIcon className="h-8 w-8 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Note moyenne</p>
                          <p className="text-2xl font-semibold text-gray-900">{stats.averageRating}</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card>
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <PlusIcon className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Annonces actives</p>
                          <p className="text-2xl font-semibold text-gray-900">{stats.activeListings}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Recent Bookings */}
                <Card>
                  <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Réservations récentes</h2>
                    <div className="space-y-4">
                      {recentBookings.map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{booking.activity}</h3>
                            <p className="text-sm text-gray-600">{booking.customer}</p>
                            <p className="text-sm text-gray-500">{new Date(booking.date).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {booking.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                            </span>
                            <span className="font-medium text-gray-900">{booking.amount} MAD</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <Card>
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Toutes les réservations</h2>
                  <p className="text-gray-600">Gérez toutes vos réservations ici</p>
                </div>
              </Card>
            )}

            {/* Listings Tab */}
            {activeTab === 'listings' && (
              <Card>
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Mes annonces</h2>
                  <p className="text-gray-600">Gérez vos activités et événements</p>
                </div>
              </Card>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <Card>
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Avis clients</h2>
                  <p className="text-gray-600">Consultez et répondez aux avis</p>
                </div>
              </Card>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <Card>
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Paramètres</h2>
                  <p className="text-gray-600">Configurez votre compte partenaire</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 