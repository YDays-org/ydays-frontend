import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, StarIcon, FunnelIcon, MagnifyingGlassIcon, HeartIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import catalogService from '../services/catalogService';

const Events = () => {
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Handle favorite toggle
  const handleToggleFavorite = async (eventId) => {
    if (!isAuthenticated()) {
      alert('Vous devez être connecté pour ajouter aux favoris.');
      return;
    }

    try {
      setFavoritesLoading(true);
      const newFavorites = new Set(favorites);
      
      if (favorites.has(eventId)) {
        await catalogService.removeFavorite(eventId);
        newFavorites.delete(eventId);
      } else {
        await catalogService.addFavorite(eventId);
        newFavorites.add(eventId);
      }
      
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Erreur lors de la mise à jour des favoris');
    } finally {
      setFavoritesLoading(false);
    }
  };

  // Fetch user's favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      if (isAuthenticated()) {
        try {
          const response = await catalogService.getFavorites();
          if (response.success && response.data) {
            const favoriteIds = new Set(response.data.map(fav => fav.listing?.id).filter(Boolean));
            setFavorites(favoriteIds);
          }
        } catch (error) {
          console.error('Error fetching favorites:', error);
        }
      }
    };

    fetchFavorites();
  }, [isAuthenticated]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await catalogService.getCategories();
        
        if (response.success && response.data) {
          setCategories(response.data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to default categories if API fails
        setCategories([
          { id: 1, name: 'Musique', slug: 'musique' },
          { id: 2, name: 'Art', slug: 'art' },
          { id: 3, name: 'Sport', slug: 'sport' },
          { id: 4, name: 'Gastronomie', slug: 'gastronomie' },
          { id: 5, name: 'Culture', slug: 'culture' },
          { id: 6, name: 'Technologie', slug: 'technologie' },
        ]);
      }
    };

    fetchCategories();
  }, []);

  // Fetch events when filters change
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = {
          page: parseInt(pagination.page) || 1,
          limit: parseInt(pagination.limit) || 10,
          type: 'event', // Filter for events only
        };

        // Add optional filters only if they have values
        if (searchQuery && searchQuery.trim()) {
          params.q = searchQuery.trim();
        }
        
        if (selectedCategory && selectedCategory !== 'all') {
          params.category = selectedCategory;
        }

        // Add price filters if selected
        if (priceRange !== 'all') {
          switch (priceRange) {
            case 'low':
              params.priceMax = 100;
              break;
            case 'medium':
              params.priceMin = 100;
              params.priceMax = 250;
              break;
            case 'high':
              params.priceMin = 250;
              break;
            default:
              break;
          }
        }

        const response = await catalogService.getListings(params);
        
        if (response.success) {
          setEvents(response.data || []);
          setPagination(prev => ({
            ...prev,
            total: response.pagination?.total || 0,
            totalPages: response.pagination?.totalPages || 0
          }));
        } else {
          setError('Failed to fetch events');
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        console.error('Error details:', error.response?.data || error.message);
        
        // More specific error messages
        if (error.response?.status === 404) {
          setError('Service non disponible. Veuillez réessayer plus tard.');
        } else if (error.response?.status >= 500) {
          setError('Erreur serveur. Veuillez réessayer plus tard.');
        } else if (error.response?.data?.message) {
          setError(error.response.data.message);
        } else {
          setError('Erreur de chargement des événements. Veuillez réessayer.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [selectedCategory, priceRange, searchQuery, pagination.page, pagination.limit]);

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return 'Gratuit';
    // Handle both string and number types
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numericPrice)) return 'Prix sur demande';
    return `${numericPrice.toFixed(0)} MAD`;
  };

  const getCategoryName = (listing) => {
    // Handle both category object and category_id
    if (listing.category?.name) {
      return listing.category.name;
    }
    if (listing.category?.slug) {
      const category = categories.find(cat => cat.slug === listing.category.slug);
      return category ? category.name : listing.category.slug;
    }
    if (listing.category_id) {
      const category = categories.find(cat => cat.id === listing.category_id);
      return category ? category.name : 'Catégorie inconnue';
    }
    return 'Non catégorisé';
  };

  const getCoverImage = (listing) => {
    if (listing.cover_image && listing.cover_image.mediaUrl) {
      return listing.cover_image.mediaUrl;
    }
    // Check for media array fallback
    if (listing.media && listing.media.length > 0) {
      const coverMedia = listing.media.find(m => m.isCover || m.is_cover);
      if (coverMedia) {
        return coverMedia.mediaUrl || coverMedia.media_url;
      }
      // Return first media if no cover is specified
      return listing.media[0].mediaUrl || listing.media[0].media_url;
    }
    // Return null to use CSS background instead of placeholder URL
    return null;
  };

  const formatEventDate = (listing) => {
    // Check if there's schedule information
    if (listing.schedules && listing.schedules.length > 0) {
      const schedule = listing.schedules[0];
      if (schedule.start_date) {
        return new Date(schedule.start_date).toLocaleDateString('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
    }
    // Fallback to created date
    if (listing.created_at) {
      return new Date(listing.created_at).toLocaleDateString('fr-FR');
    }
    return 'Date à définir';
  };

  const formatEventTime = (listing) => {
    // Check if there's schedule information
    if (listing.schedules && listing.schedules.length > 0) {
      const schedule = listing.schedules[0];
      if (schedule.start_time) {
        return schedule.start_time;
      }
    }
    return 'Horaire à définir';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Événements à Casablanca</h1>
          <p className="text-gray-600">Découvrez les événements culturels et festifs de la ville</p>
        </div>

        {/* Filters Bar - Top Section */}
        <Card className="p-6 mb-8">
          <div className="flex items-center mb-6">
            <FunnelIcon className="h-5 w-5 mr-2" />
            <h3 className="font-semibold">Filtres</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div>
              <h4 className="font-medium mb-3">Recherche</h4>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                <input
                  type="text"
                  placeholder="Rechercher un événement..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="font-medium mb-3">Catégorie</h4>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <h4 className="font-medium mb-3">Prix</h4>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Tous les prix</option>
                <option value="low">Moins de 100 MAD</option>
                <option value="medium">100 - 250 MAD</option>
                <option value="high">Plus de 250 MAD</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-end">
              <div>
                <h4 className="font-medium mb-3">Résultats</h4>
                <p className="text-gray-600 py-3">
                  {pagination.total} événement{pagination.total > 1 ? 's' : ''} trouvé{pagination.total > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Events Grid */}
        <div>
            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner />
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <p className="text-red-800 mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()}>
                    Réessayer
                  </Button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && events.length === 0 && (
              <Card className="p-12 text-center">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun événement trouvé</h3>
                <p className="text-gray-600">Essayez de modifier vos filtres de recherche</p>
              </Card>
            )}

            {/* Events Grid */}
            {!loading && !error && events.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <Card key={event.id} className="overflow-hidden">
                      <div className="h-48 bg-gray-200 relative">
                        {getCoverImage(event) ? (
                          <img
                            src={getCoverImage(event)}
                            alt={event.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            <div className="text-center">
                              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                              <span className="text-sm text-gray-500">Événement</span>
                            </div>
                          </div>
                        )}
                        <div className="absolute top-4 left-4 bg-primary-600 text-white px-2 py-1 rounded text-sm">
                          {getCategoryName(event)}
                        </div>
                        <div className="absolute top-4 right-4 bg-white text-gray-700 px-2 py-1 rounded text-sm font-semibold">
                          {formatPrice(event.cheapest_price)}
                        </div>
                        {isAuthenticated() && (
                          <button
                            onClick={() => handleToggleFavorite(event.id)}
                            disabled={favoritesLoading}
                            className="absolute bottom-4 right-4 flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow disabled:opacity-50"
                            title={favorites.has(event.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                          >
                            {favorites.has(event.id) ? (
                              <HeartIconSolid className="h-4 w-4 text-red-500" />
                            ) : (
                              <HeartIcon className="h-4 w-4 text-gray-600" />
                            )}
                          </button>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                        <p className="text-gray-600 mb-3">{event.description}</p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-gray-600">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            <span className="text-sm">{formatEventDate(event)}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <ClockIcon className="h-4 w-4 mr-2" />
                            <span className="text-sm">{formatEventTime(event)}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <MapPinIcon className="h-4 w-4 mr-2" />
                            <span className="text-sm">{event.address}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                            <span className="text-sm font-medium">
                              {event.average_rating ? 
                                (typeof event.average_rating === 'string' ? 
                                  parseFloat(event.average_rating).toFixed(1) : 
                                  event.average_rating.toFixed(1)
                                ) : 'N/A'}
                            </span>
                            {event.review_count > 0 && (
                              <span className="text-sm text-gray-500 ml-1">
                                ({event.review_count})
                              </span>
                            )}
                          </div>
                          <Link to={`/event/${event.id}`}>
                            <Button size="sm">Voir détails</Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={pagination.page === 1}
                        onClick={() => handlePageChange(pagination.page - 1)}
                      >
                        Précédent
                      </Button>
                      
                      {[...Array(Math.min(pagination.totalPages, 5))].map((_, index) => {
                        const pageNumber = index + 1;
                        return (
                          <Button
                            key={pageNumber}
                            size="sm"
                            variant={pagination.page === pageNumber ? 'default' : 'outline'}
                            onClick={() => handlePageChange(pageNumber)}
                          >
                            {pageNumber}
                          </Button>
                        );
                      })}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={pagination.page === pagination.totalPages}
                        onClick={() => handlePageChange(pagination.page + 1)}
                      >
                        Suivant
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
        </div>
      </div>
    </div>
  );
};

export default Events; 