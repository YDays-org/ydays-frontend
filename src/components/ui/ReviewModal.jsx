import { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import LoadingSpinner from './LoadingSpinner';
import reviewService from '../../services/reviewService';

const ReviewModal = ({ 
  isOpen, 
  onClose, 
  booking, 
  onReviewSubmitted 
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!booking) {
      setError('Aucune réservation trouvée');
      return;
    }

    if (rating === 0) {
      setError('Veuillez sélectionner une note');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const reviewData = await reviewService.submitReview({
        bookingId: booking.id,
        rating: rating,
        comment: comment.trim()
      });

      // Call callback to notify parent component
      if (onReviewSubmitted) {
        onReviewSubmitted(reviewData);
      }
      
      // Reset form
      setRating(5);
      setComment('');
      setError('');
      
      // Close modal
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      setError(error.response?.data?.message || error.message || 'Erreur lors de la soumission de l\'avis');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Reset form and close modal
    setRating(5);
    setComment('');
    setError('');
    onClose();
  };

  if (!booking) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleSkip}
      title="Évaluez votre expérience"
    >
      <div className="space-y-6">
        {/* Booking Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">
            {booking.listing?.title || booking.title || 'Votre réservation'}
          </h4>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{booking.numParticipants} participant{booking.numParticipants > 1 ? 's' : ''}</span>
            {booking.totalPrice && (
              <span className="font-semibold">{booking.totalPrice} MAD</span>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Votre note *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
                  aria-label={`Noter ${star} étoile${star > 1 ? 's' : ''}`}
                >
                  {star <= (hoveredRating || rating) ? (
                    <StarIconSolid className="h-8 w-8 text-yellow-400" />
                  ) : (
                    <StarIcon className="h-8 w-8 text-gray-300 hover:text-yellow-300" />
                  )}
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                ({rating} étoile{rating > 1 ? 's' : ''})
              </span>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Votre commentaire (optionnel)
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Partagez votre expérience avec les autres utilisateurs..."
              maxLength={500}
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {comment.length}/500 caractères
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleSkip}
              disabled={loading}
              className="flex-1 sm:flex-none"
            >
              Passer pour l'instant
            </Button>
            <Button
              type="submit"
              disabled={loading || rating === 0}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner className="w-4 h-4" />
                  Envoi...
                </>
              ) : (
                'Publier l\'avis'
              )}
            </Button>
          </div>
        </form>

        {/* Motivational text */}
        <div className="text-center pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Votre avis aide les autres utilisateurs à faire leur choix
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ReviewModal;
