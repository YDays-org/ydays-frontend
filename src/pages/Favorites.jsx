import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartIcon, 
  MapPinIcon, 
  StarIcon, 
  EyeIcon,
  CalendarIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import catalogService from '../services/catalogService';

const FavoritesPage = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterType, setFilterType] = useState('');

  const fetchFavorites = async (page = 1, type = '') => {
    try {
      setLoading(true);
      const response = await catalogService.getFavorites({ 
        page, 
        limit: 12, 
        ...(type && { type }) 
      });
      
      if (response.success) {
        setFavorites(response.data);
        setTotalPages(response.pagination.totalPages);
        setCurrentPage(response.pagination.page);
      }
    } catch (err) {
      setError('Erreur lors du chargement des favoris');
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFavorites(1, filterType);
    }
  }, [user, filterType]);

  const handlePageChange = (page) => {
    fetchFavorites(page, filterType);
  };

  const handleTypeFilter = (type) => {
    setFilterType(type);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTypeLabel = (type) => {
    const labels = {
      'activity': 'Activité',
      'event': 'Événement',
      'restaurant': 'Restaurant'
    };
    return labels[type] || type;
  };

  const getTypeBadgeColor = (type) => {
    const colors = {
      'activity': 'bg-green-100 text-green-800',
      'event': 'bg-blue-100 text-blue-800',
      'restaurant': 'bg-yellow-100 text-yellow-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const removeFavorite = async (listingId) => {
    try {
      await catalogService.removeFavorite(listingId);
      // Refresh the favorites list
      fetchFavorites(currentPage, filterType);
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Erreur lors de la suppression du favori');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <HeartIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Connectez-vous pour voir vos favoris
          </h2>
          <p className="text-gray-600 mb-6">
            Sauvegardez vos activités, événements et restaurants préférés
          </p>
          <Link to="/auth/login">
            <Button>Se connecter</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <HeartIconSolid className="h-8 w-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-900">Mes Favoris</h1>
          </div>
          <p className="text-gray-600">
            Retrouvez toutes vos activités, événements et restaurants préférés
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FunnelIcon className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filtrer par type:</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => handleTypeFilter('')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filterType === '' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border`}
            >
              Tous
            </button>
            <button
              onClick={() => handleTypeFilter('activity')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filterType === 'activity' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border`}
            >
              Activités
            </button>
            <button
              onClick={() => handleTypeFilter('event')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filterType === 'event' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border`}
            >
              Événements
            </button>
            <button
              onClick={() => handleTypeFilter('restaurant')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filterType === 'restaurant' 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border`}
            >
              Restaurants
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner className="text-blue-500" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-800">{error}</p>
              <Button 
                onClick={() => fetchFavorites(1, filterType)}
                className="mt-4"
                variant="outline"
              >
                Réessayer
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && favorites.length === 0 && (
          <div className="text-center py-12">
            <HeartIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun favori trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              {filterType ? 
                `Vous n'avez pas encore ajouté de ${getTypeLabel(filterType).toLowerCase()} à vos favoris.` :
                'Vous n\'avez pas encore ajouté d\'éléments à vos favoris.'
              }
            </p>
            <Link to="/activities">
              <Button>Explorer les activités</Button>
            </Link>
          </div>
        )}

        {/* Favorites Grid */}
        {!loading && !error && favorites.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {favorites.map((favorite) => (
                <Card key={favorite.listingId} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    {/* Cover Image */}
                    <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                      {favorite.listing.media[0] ? (
                        <img
                          src={favorite.listing.media[0].mediaUrl}
                          alt={favorite.listing.title}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
                          <EyeIcon className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Remove Favorite Button */}
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => removeFavorite(favorite.listingId)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
                        title="Retirer des favoris"
                      >
                        <HeartIconSolid className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Type Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeBadgeColor(favorite.listing.type)}`}>
                        {getTypeLabel(favorite.listing.type)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {favorite.listing.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <MapPinIcon className="h-4 w-4" />
                      <span className="line-clamp-1">{favorite.listing.address}</span>
                    </div>

                    {favorite.listing.averageRating > 0 && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-gray-900">
                            {favorite.listing.averageRating.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          ({favorite.listing._count.reviews} avis)
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <CalendarIcon className="h-4 w-4" />
                      <span>Ajouté le {formatDate(favorite.createdAt)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Par {favorite.listing.partner.user.fullName}
                      </span>
                      <Link to={`/${favorite.listing.type}s/${favorite.listing.id}`}>
                        <Button size="sm">
                          Voir détails
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Précédent
                  </Button>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <Button
                      key={index + 1}
                      variant={currentPage === index + 1 ? 'default' : 'outline'}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
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
  );
};

export default FavoritesPage;
