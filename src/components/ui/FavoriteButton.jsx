import { useState, useEffect } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { isFavorite, toggleFavorite } from '../services/favoriteService';
import { useAuth } from '../hooks/useAuth';

const FavoriteButton = ({ listingId, className = '', size = 'md', showText = false }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Size configurations
  const sizeConfig = {
    sm: {
      icon: 'w-4 h-4',
      button: 'p-1.5',
      text: 'text-xs'
    },
    md: {
      icon: 'w-5 h-5',
      button: 'p-2',
      text: 'text-sm'
    },
    lg: {
      icon: 'w-6 h-6',
      button: 'p-3',
      text: 'text-base'
    }
  };

  const config = sizeConfig[size] || sizeConfig.md;

  // Check if listing is already in favorites
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user || !listingId) return;
      
      try {
        const response = await isFavorite(listingId);
        setIsLiked(response.data.isFavorite);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    checkFavoriteStatus();
  }, [user, listingId]);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      // Redirect to login or show login modal
      alert('Veuillez vous connecter pour ajouter aux favoris');
      return;
    }

    setIsLoading(true);
    try {
      await toggleFavorite(listingId);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Handle specific error cases
      if (error.response?.status === 409) {
        // Already a favorite
        setIsLiked(true);
      } else if (error.response?.status === 404) {
        // Not found in favorites
        setIsLiked(false);
      } else {
        alert('Erreur lors de la modification des favoris');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null; // Don't show favorite button if user is not logged in
  }

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`
        ${config.button}
        rounded-full
        transition-all duration-200
        ${isLiked 
          ? 'bg-red-50 text-red-600 hover:bg-red-100 border-red-200' 
          : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'
        }
        border shadow-sm
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
        ${className}
      `}
      title={isLiked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <div className="flex items-center gap-2">
        {isLiked ? (
          <HeartIconSolid className={`${config.icon} text-red-500`} />
        ) : (
          <HeartIcon className={`${config.icon}`} />
        )}
        {showText && (
          <span className={`${config.text} font-medium`}>
            {isLiked ? 'Favoris' : 'Ajouter'}
          </span>
        )}
      </div>
    </button>
  );
};

export default FavoriteButton;
