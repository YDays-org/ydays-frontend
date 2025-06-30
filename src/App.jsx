import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/ui/LoadingSpinner';
import OverviewTab from './pages/adminDashboard/OverviewTab';

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
const PartnerDashboard = lazy(() => import('./pages/adminDashboard/Dashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));
const SettingsTab = lazy(() => import('./pages/adminDashboard/settings/SettingsTab'));

// restaurant
const RestaurantsManager = lazy(() => import('./pages/adminDashboard/restaurants/Restaurants'));
const AddRestaurant = lazy(() => import('./pages/adminDashboard/restaurants/RestaurantsAdd'));
const RestaurantsUpdate = lazy(() => import('./pages/adminDashboard/restaurants/RestaurantsUpdate'));

// activities
const ActivitiesManager = lazy(() => import('./pages/adminDashboard/activities/Activities'));
const AddActivity = lazy(() => import('./pages/adminDashboard/activities/ActivitiesAdd'));
const ActivitiesUpdate = lazy(() => import('./pages/adminDashboard/activities/ActivitiesUpdate'));

// events
const EventsManager = lazy(() => import('./pages/adminDashboard/events/Events'));
const AddEvent = lazy(() => import('./pages/adminDashboard/events/EventsAdd'));
const EventsUpdate = lazy(() => import('./pages/adminDashboard/events/EventsUpdate'));

// bookings
const BookingsTab = lazy(() => import('./pages/adminDashboard/bookings/BookingsTab'));
const BookingDetail = lazy(() => import('./pages/adminDashboard/bookings/BookingsConfirm'));

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
          <Route path="/admin-dashboard" element={<PartnerDashboard />}>
            <Route index element={<OverviewTab />} />

            {/* booking */}
            <Route path="bookings" element={<BookingsTab />} />
            <Route path="bookings/confirm" element={<BookingDetail />} />



            {/* restaurants */}
            <Route path="restaurants" element={<RestaurantsManager />} />
            <Route path="restaurants/add" element={<AddRestaurant />} />
            <Route path="restaurants/update/:id" element={<RestaurantsUpdate />} />

            {/* activites */}
            <Route path="activities" element={<ActivitiesManager />} />
            <Route path="activities/add" element={<AddActivity />} />
            <Route path="activities/update/:id" element={<ActivitiesUpdate />} />

            {/* events */}
            <Route path="events" element={<EventsManager />} />
            <Route path="events/add" element={<AddEvent />} />
            <Route path="events/update/:id" element={<EventsUpdate />} />

            {/* settings */}
            <Route path="settings" element={<SettingsTab />} />
          </Route>

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
