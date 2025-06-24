import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Activities = lazy(() => import('./pages/Activities'));
const Events = lazy(() => import('./pages/Events'));
const Restaurants = lazy(() => import('./pages/Restaurants'));
const ActivityDetail = lazy(() => import('./pages/ActivityDetail'));
const EventDetail = lazy(() => import('./pages/EventDetail'));
const RestaurantDetail = lazy(() => import('./pages/RestaurantDetail'));
const Booking = lazy(() => import('./pages/Booking'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const PartnerDashboard = lazy(() => import('./pages/partner/Dashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="activities" element={<Activities />} />
            <Route path="events" element={<Events />} />
            <Route path="restaurants" element={<Restaurants />} />
            <Route path="activity/:id" element={<ActivityDetail />} />
            <Route path="event/:id" element={<EventDetail />} />
            <Route path="restaurant/:id" element={<RestaurantDetail />} />
            <Route path="booking/:type/:id" element={<Booking />} />
          </Route>


          {/* Auth routes */}
          <Route path="/auth">
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* Protected user routes */}
          <Route path="/profile" element={<Profile />} />

          {/* Partner routes */}
          <Route path="/partner/*" element={<PartnerDashboard />} />

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
