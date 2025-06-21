import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home/Home';
import Activities from './pages/Activities/Activities';
import Events from './pages/Events/Events';
import Restaurants from './pages/Restaurants/Restaurants';
import Trending from './pages/Trending/Trending';
import New from './pages/New/New';
import ActivityDetail from './pages/ActivityDetail/ActivityDetail';
import EventDetail from './pages/EventDetail/EventDetail';
import RestaurantDetail from './pages/RestaurantDetail/RestaurantDetail';
import Profile from './pages/Profile/Profile';
import Favorites from './pages/Favorites/Favorites';
import Booking from './pages/Booking/Booking';
import Map from './pages/Map/Map';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import PartnerDashboard from './pages/Partner/Dashboard';
import PartnerRegister from './pages/Partner/Register';
import NotFound from './pages/NotFound/NotFound';
import AuthPage from './pages/Auth/AuthPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <Layout>
                <Home />
              </Layout>
            } />
            
            <Route path="/activities" element={
              <Layout>
                <Activities />
              </Layout>
            } />
            
            <Route path="/activity/:id" element={
              <Layout>
                <ActivityDetail />
              </Layout>
            } />
            
            <Route path="/events" element={
              <Layout>
                <Events />
              </Layout>
            } />
            
            <Route path="/event/:id" element={
              <Layout>
                <EventDetail />
              </Layout>
            } />
            
            <Route path="/restaurants" element={
              <Layout>
                <Restaurants />
              </Layout>
            } />
            
            <Route path="/restaurant/:id" element={
              <Layout>
                <RestaurantDetail />
              </Layout>
            } />
            
            <Route path="/trending" element={
              <Layout>
                <Trending />
              </Layout>
            } />
            
            <Route path="/new" element={
              <Layout>
                <New />
              </Layout>
            } />
            
            <Route path="/map" element={
              <Layout>
                <Map />
              </Layout>
            } />
            
            <Route path="/booking/:type/:id" element={
              <Layout>
                <Booking />
              </Layout>
            } />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth" element={<AuthPage />} />
            
            {/* User Routes */}
            <Route path="/profile" element={
              <Layout>
                <Profile />
              </Layout>
            } />
            
            <Route path="/favorites" element={
              <Layout>
                <Favorites />
              </Layout>
            } />
            
            {/* Partner Routes */}
            <Route path="/partner/register" element={<PartnerRegister />} />
            <Route path="/partner/dashboard" element={<PartnerDashboard />} />
            
            {/* 404 Route */}
            <Route path="*" element={
              <Layout>
                <NotFound />
              </Layout>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
