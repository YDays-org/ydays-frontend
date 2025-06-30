import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
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
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
    { id: 'overview', name: "Vue d'ensemble", icon: ChartBarIcon, path: '/admin-dashboard' },
    { id: 'bookings', name: 'Réservations', icon: CalendarIcon, path: '/admin-dashboard/bookings' },
    { id: 'events', name: 'Événements', icon: UserGroupIcon, path: '/admin-dashboard/events' },
    { id: 'activities', name: 'Activités', icon: PlusIcon, path: '/admin-dashboard/activities' },
    { id: 'restaurants', name: 'Restaurants', icon: BuildingStorefrontIcon, path: '/admin-dashboard/restaurants' },
    { id: 'settings', name: 'Paramètres', icon: CogIcon, path: '/admin-dashboard/settings' }
  ];

  // Update active tab based on current location
  useEffect(() => {
    const currentPath = location.pathname;
    
    // First try to find an exact match
    let matchingTab = tabs.find(tab => currentPath === tab.path);
    
    // If no exact match, find the longest matching path (for nested routes)
    if (!matchingTab) {
      matchingTab = tabs
        .filter(tab => currentPath.startsWith(tab.path))
        .sort((a, b) => b.path.length - a.path.length)[0];
    }
    
    if (matchingTab) {
      setActiveTab(matchingTab.id);
    }
  }, [location.pathname]);

  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
    navigate(tab.path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar 
              tabs={tabs} 
              activeTab={activeTab} 
              setActiveTab={handleTabClick} 
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 