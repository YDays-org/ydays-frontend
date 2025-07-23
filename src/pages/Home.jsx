import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, MapPinIcon, CalendarIcon, StarIcon } from '@heroicons/react/24/outline';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { showNotification } from '../components/ui/notification';
import catalogService from '../services/catalogService';

const CATEGORY_ICONS = {
  activity: '🎯',
  event: '🎉',
  restaurant: '🍽️',
};

const CATEGORY_LABELS = {
  activity: 'Activités',
  event: 'Événements',
  restaurant: 'Restaurants',
};

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([
    { type: 'activity', icon: CATEGORY_ICONS.activity, name: CATEGORY_LABELS.activity, count: 0 },
    { type: 'event', icon: CATEGORY_ICONS.event, name: CATEGORY_LABELS.event, count: 0 },
    { type: 'restaurant', icon: CATEGORY_ICONS.restaurant, name: CATEGORY_LABELS.restaurant, count: 0 },
  ]);
  const [featuredActivities, setFeaturedActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories and featured activities
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch counts for each type
        const [activitiesRes, eventsRes, restaurantsRes] = await Promise.all([
          catalogService.getListings({ type: 'activity', limit: 1 }),
          catalogService.getListings({ type: 'event', limit: 1 }),
          catalogService.getListings({ type: 'restaurant', limit: 1 }),
        ]);
        setCategories([
          { type: 'activity', icon: CATEGORY_ICONS.activity, name: CATEGORY_LABELS.activity, count: activitiesRes.pagination?.total || activitiesRes.data?.length || 0 },
          { type: 'event', icon: CATEGORY_ICONS.event, name: CATEGORY_LABELS.event, count: eventsRes.pagination?.total || eventsRes.data?.length || 0 },
          { type: 'restaurant', icon: CATEGORY_ICONS.restaurant, name: CATEGORY_LABELS.restaurant, count: restaurantsRes.pagination?.total || restaurantsRes.data?.length || 0 },
        ]);

        // Fetch top 3 activities (by rating)
        const featuredRes = await catalogService.getListings({ type: 'activity', limit: 3 });
        setFeaturedActivities(featuredRes.data || []);
      } catch (err) {
        setError('Erreur lors du chargement des données.');
        showNotification({ type: 'error', message: 'Erreur', description: 'Impossible de charger les données du serveur.' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatPrice = (price) => {
    if (!price || price === 0) return 'Prix sur demande';
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numericPrice)) return 'Prix sur demande';
    return `${numericPrice.toFixed(0)} MAD`;
  };

  const getCoverImage = (listing) => {
    if (listing.cover_image && listing.cover_image.mediaUrl) {
      return listing.cover_image.mediaUrl;
    }
    if (listing.media && listing.media.length > 0) {
      const coverMedia = listing.media.find(m => m.isCover || m.is_cover);
      if (coverMedia) {
        return coverMedia.mediaUrl || coverMedia.media_url;
      }
      return listing.media[0].mediaUrl || listing.media[0].media_url;
    }
    return null;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Découvrez Casablanca
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Les meilleures activités, événements et restaurants de la ville blanche
            </p>
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une activité, événement ou restaurant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  Rechercher
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Explorez par catégorie</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link key={category.type} to={`/${category.type === 'activity' ? 'activities' : category.type === 'event' ? 'events' : 'restaurants'}`}>
                <Card className="p-8 text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-gray-600">{category.count} disponibles</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Activities */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Activités populaires</h2>
            <Link to="/activities">
              <Button variant="outline">Voir tout</Button>
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-red-800 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>
                  Réessayer
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredActivities.map((activity) => (
                <Card key={activity.id} className="overflow-hidden">
                  <div className="h-48 bg-gray-200 relative">
                    {getCoverImage(activity) ? (
                      <img
                        src={getCoverImage(activity)}
                        alt={activity.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <div className="text-center">
                          <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <span className="text-sm text-gray-500">Activité</span>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-primary-600 text-white px-2 py-1 rounded text-sm">
                      {activity.category?.name || activity.category_id || 'Catégorie'}
                    </div>
                    <div className="absolute top-4 right-4 bg-white text-gray-700 px-2 py-1 rounded text-sm font-semibold">
                      {formatPrice(activity.metadata?.price || activity.cheapest_price)}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{activity.title}</h3>
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      <span className="text-sm">{activity.address}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">
                          {activity.average_rating ? (typeof activity.average_rating === 'string' ? parseFloat(activity.average_rating).toFixed(1) : activity.average_rating.toFixed(1)) : 'N/A'}
                        </span>
                        {activity.review_count > 0 && (
                          <span className="text-sm text-gray-500 ml-1">
                            ({activity.review_count})
                          </span>
                        )}
                      </div>
                      <Link to={`/activity/${activity.id}`}>
                        <Button size="sm">Réserver</Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Pourquoi nous choisir ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPinIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Géolocalisation précise</h3>
              <p className="text-gray-600">Trouvez facilement les activités près de chez vous</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Réservation instantanée</h3>
              <p className="text-gray-600">Réservez vos activités en quelques clics</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <StarIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Avis vérifiés</h3>
              <p className="text-gray-600">Découvrez les meilleures recommandations</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 