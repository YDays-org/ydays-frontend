import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import {
  ChartBarIcon,
  CalendarIcon,
  UserGroupIcon,
  PlusIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import OverviewTab from './OverviewTab';
import BookingsTab from './BookingsTab';
import SettingsTab from './SettingsTab';
import EventsManager from './EventsManager';
import ActivitiesManager from './ActivitiesManager';
import RestaurantsManager from './restaurants/Restaurants';
import Events from './events/Events';

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
    { id: 'overview', name: "Vue d'ensemble", icon: ChartBarIcon },
    { id: 'bookings', name: 'Réservations', icon: CalendarIcon },
    { id: 'events', name: 'Événements', icon: UserGroupIcon },
    { id: 'activities', name: 'Activités', icon: PlusIcon },
    { id: 'restaurants', name: 'Restaurants', icon: BuildingStorefrontIcon },
    { id: 'settings', name: 'Paramètres', icon: CogIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <ChartBarIcon className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Espace Administrateur</h1>
              <p className="text-sm text-gray-500 mt-1">Gérez vos activités, réservations et annonces en toute simplicité</p>
            </div>
          </div>
          {/* Logout Button */}
          <div className="mt-4 sm:mt-0">
            <Button
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={() => {
                // TODO: Add real logout logic here (e.g., clear auth, redirect)
                window.location.href = "/auth/login";
              }}
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
              Se déconnecter
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="mb-6 text-lg font-semibold text-gray-700">
                bonjour x
              </div>
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab.id
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
              <OverviewTab stats={stats} recentBookings={recentBookings} />
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && <BookingsTab />}

            {/* Events Tab */}
            {activeTab === 'events' && <Events />}

            {/* Activities Tab */}
            {activeTab === 'activities' && <ActivitiesManager />}

            {/* Restaurants Tab */}
            {activeTab === 'restaurants' && <RestaurantsManager />}

            {/* Settings Tab */}
            {activeTab === 'settings' && <SettingsTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 