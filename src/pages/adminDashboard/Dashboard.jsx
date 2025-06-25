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

import OverviewTab from './OverviewTab';
import BookingsTab from './BookingsTab';
import SettingsTab from './SettingsTab';
import EventsManager from './EventsManager';
import ActivitiesManager from './ActivitiesManager';
import RestaurantsManager from './restaurants/Restaurants';
import Header from './layout/Header';
import Sidebar from './layout/Sidebar';

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

  const handleLogout = () => {
    // TODO: Add real logout logic here (e.g., clear auth, redirect)
    window.location.href = "/auth/login";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLogout={handleLogout} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <OverviewTab stats={stats} recentBookings={recentBookings} />
            )}
            {activeTab === 'bookings' && <BookingsTab />}
            {activeTab === 'events' && <EventsManager />}
            {activeTab === 'activities' && <ActivitiesManager />}
            {activeTab === 'restaurants' && <RestaurantsManager />}
            {activeTab === 'settings' && <SettingsTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 