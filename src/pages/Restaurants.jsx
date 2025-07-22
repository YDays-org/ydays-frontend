import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, StarIcon, FunnelIcon, MagnifyingGlassIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import catalogService from '../services/catalogService';

// Constants
const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwQzIyMi4wOTEgMTAwIDI0MCA4Mi4wOTA4IDI0MCA2MEMyNDAgMzcuOTA5MiAyMjIuMDkxIDIwIDIwMCAyMEMxNzcuOTA5IDIwIDE2MCAzNy45MDkyIDE2MCA2MEMxNjAgODIuMDkwOCAxNzcuOTA5IDEwMCAyMDAgMTAwWiIgZmlsbD0iI0Q1RDlEOCIvPgo8cGF0aCBkPSJNMjI1IDI0MEgxNzVDMTcwLjAyOSAyNDAgMTY2IDI0My43NzEgMTY2IDI0OC43NTBWMjUwSDIzNFYyNDguNzUwQzIzNCAyNDMuNzcxIDIyOS45NzEgMjQwIDIyNSAyNDBaIiBmaWxsPSIjRDVEOUQ4Ii8+CjxwYXRoIGQ9Ik0xNzAgMTkwQzE3MCAyMDIuMTc4IDE3OS44MjIgMjEyIDIwMCAyMTJDMjIwLjE3OCAyMTIgMjMwIDIwMi4xNzggMjMwIDE5MEgyMzJDMjMyIDE5OS4zNzUgMjI1LjM3NSAyMDcuMzc1IDIxNyAyMDkuMzc1VjIzMEgxODNWMjA5LjM3NUMxNzQuNjI1IDIwNy4zNzUgMTY4IDE5OS4zNzUgMTY4IDE5MEgxNzBaIiBmaWxsPSIjRDVEOUQ4Ii8+CjxwYXRoIGQ9Ik0xNzAgMTkwQzE3MCAyMDIuMTc4IDE3OS44MjIgMjEyIDIwMCAyMTJDMjIwLjE3OCAyMTIgMjMwIDIwMi4xNzggMjMwIDE5MEgxNzBaIiBmaWxsPSIjQzRDOUNEIi8+CjxwYXRoIGQ9Ik0xNzUgMTc1QzE3NSAxNzUgMTc1IDE3NSAxNzUgMTc1VjE2NUMxNzUgMTU5LjQ3NyAxNzkuNDc3IDE1NSAxODUgMTU1SDE5NVYxNzVIMTc1WiIgZmlsbD0iI0Q1RDlEOCIvPgo8cGF0aCBkPSJNMjI1IDE3NUgyMDVWMTU1SDIxNUMyMjAuNTIzIDE1NSAyMjUgMTU5LjQ3NyAyMjUgMTY1VjE3NVoiIGZpbGw9IiNENUQ5RDgiLz4KPHBhdGggZD0iTTIwNSAxNzVIMTk1VjE1NUgyMDVWMTc1WiIgZmlsbD0iI0M0QzlDRCIvPgo8L3N2Zz4K';

const Restaurants = () => {
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState([]);
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
  const handleToggleFavorite = async (restaurantId) => {
    if (!isAuthenticated()) {
      alert('Vous devez être connecté pour ajouter aux favoris.');
      return;
    }

    try {
      setFavoritesLoading(true);
      const newFavorites = new Set(favorites);
      
      if (favorites.has(restaurantId)) {
        await catalogService.removeFavorite(restaurantId);
        newFavorites.delete(restaurantId);
      } else {
        await catalogService.addFavorite(restaurantId);
        newFavorites.add(restaurantId);
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
          { id: 1, name: 'Marocaine', slug: 'marocaine' },
          { id: 2, name: 'Française', slug: 'francaise' },
          { id: 3, name: 'Italienne', slug: 'italienne' },
          { id: 4, name: 'Japonaise', slug: 'japonaise' },
          { id: 5, name: 'Libanaise', slug: 'libanaise' },
          { id: 6, name: 'Internationale', slug: 'internationale' },
        ]);
      }
    };

    fetchCategories();
  }, []);

  // Fetch restaurants when filters change
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = {
          page: parseInt(pagination.page) || 1,
          limit: parseInt(pagination.limit) || 10,
          type: 'restaurant', // Filter for restaurants only
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
          setRestaurants(response.data || []);
          setPagination(prev => ({
            ...prev,
            total: response.pagination?.total || 0,
            totalPages: response.pagination?.totalPages || 0
          }));
        } else {
          setError('Failed to fetch restaurants');
        }
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        console.error('Error details:', error.response?.data || error.message);
        
        // More specific error messages
        if (error.response?.status === 404) {
          setError('Service non disponible. Veuillez réessayer plus tard.');
        } else if (error.response?.status >= 500) {
          setError('Erreur serveur. Veuillez réessayer plus tard.');
        } else if (error.response?.data?.message) {
          setError(error.response.data.message);
        } else {
          setError('Erreur de chargement des restaurants. Veuillez réessayer.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [selectedCategory, priceRange, searchQuery, pagination.page, pagination.limit]);

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return 'Prix sur demande';
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
    // Check cover_image first
    if (listing.cover_image?.mediaUrl && listing.cover_image.mediaUrl.trim() !== '') {
      return listing.cover_image.mediaUrl;
    }
    
    // Check for media array fallback
    if (listing.media && listing.media.length > 0) {
      const coverMedia = listing.media.find(m => m.isCover || m.is_cover);
      if (coverMedia) {
        const coverUrl = coverMedia.mediaUrl || coverMedia.media_url;
        if (coverUrl && coverUrl.trim() !== '') {
          return coverUrl;
        }
      }
      
      // Use first valid media item
      for (const media of listing.media) {
        const mediaUrl = media.mediaUrl || media.media_url;
        if (mediaUrl && mediaUrl.trim() !== '') {
          return mediaUrl;
        }
      }
    }
    
    // Fallback to a placeholder image
    return PLACEHOLDER_IMAGE;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Restaurants à Casablanca</h1>
          <p className="text-gray-600">Découvrez les meilleurs restaurants de la ville</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <FunnelIcon className="h-5 w-5 mr-2" />
                <h3 className="font-semibold">Filtres</h3>
              </div>

              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un restaurant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="mb-6 mt-6">
                <h4 className="font-medium mb-3">Type de cuisine</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value="all"
                      checked={selectedCategory === 'all'}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">Toutes les cuisines</span>
                  </label>
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category.slug}
                        checked={selectedCategory === category.slug}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Prix</h4>
                <div className="space-y-2">
                  {[
                    { id: 'all', name: 'Tous les prix' },
                    { id: 'low', name: 'Moins de 100 MAD' },
                    { id: 'medium', name: '100 - 250 MAD' },
                    { id: 'high', name: 'Plus de 250 MAD' },
                  ].map((price) => (
                    <label key={price.id} className="flex items-center">
                      <input
                        type="radio"
                        name="price"
                        value={price.id}
                        checked={priceRange === price.id}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">{price.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Restaurants Grid */}
          <div className="lg:w-3/4">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">
                {loading ? 'Chargement...' : `${pagination.total} restaurant${pagination.total > 1 ? 's' : ''} trouvé${pagination.total > 1 ? 's' : ''}`}
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <Card className="p-12 text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>Réessayer</Button>
              </Card>
            ) : restaurants.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {restaurants.map((restaurant) => (
                    <Card key={restaurant.id} className="overflow-hidden">
                      <div className="h-48 bg-gray-200 relative">
                        <img
                          src={getCoverImage(restaurant)}
                          alt={restaurant.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Prevent infinite loops by checking if we're already using the placeholder
                            if (!e.target.src.includes('data:image/svg+xml')) {
                            e.target.src = PLACEHOLDER_IMAGE;
                            }
                          }}
                        />
                        <div className="absolute top-4 left-4 bg-primary-600 text-white px-2 py-1 rounded text-sm">
                          {getCategoryName(restaurant)}
                        </div>
                        <div className="absolute top-4 right-4 bg-white text-gray-700 px-2 py-1 rounded text-sm font-semibold">
                          {formatPrice(restaurant.cheapest_price)}
                        </div>
                        {isAuthenticated() && (
                          <button
                            onClick={() => handleToggleFavorite(restaurant.id)}
                            disabled={favoritesLoading}
                            className="absolute bottom-4 right-4 flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow disabled:opacity-50"
                            title={favorites.has(restaurant.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                          >
                            {favorites.has(restaurant.id) ? (
                              <HeartIconSolid className="h-4 w-4 text-red-500" />
                            ) : (
                              <HeartIcon className="h-4 w-4 text-gray-600" />
                            )}
                          </button>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2">{restaurant.title}</h3>
                        <p className="text-gray-600 mb-3">{restaurant.description}</p>
                        <div className="flex items-center text-gray-600 mb-3">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          <span className="text-sm">{restaurant.address}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                            <span className="text-sm font-medium">
                              {restaurant.average_rating ? 
                                (typeof restaurant.average_rating === 'string' ? 
                                  parseFloat(restaurant.average_rating).toFixed(1) : 
                                  restaurant.average_rating.toFixed(1)
                                ) : 'N/A'}
                            </span>
                            {restaurant.review_count > 0 && (
                              <span className="text-sm text-gray-500 ml-1">
                                ({restaurant.review_count})
                              </span>
                            )}
                          </div>
                          <Link to={`/restaurant/${restaurant.id}`}>
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
                      
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <Button
                            key={pageNum}
                            size="sm"
                            variant={pagination.page === pageNum ? "primary" : "outline"}
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
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
            ) : (
              <Card className="p-12 text-center">
                <p className="text-gray-500">Aucun restaurant trouvé avec ces critères</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Restaurants;