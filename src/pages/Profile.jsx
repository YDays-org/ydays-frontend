import { useState, useEffect } from 'react';
import { UserIcon, PhoneIcon, EnvelopeIcon, PhotoIcon, CalendarIcon, HeartIcon, CheckCircleIcon, ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import { profileService } from '../services/profileService';
import { bookingService } from '../services/bookingService';
import { catalogService } from '../services/catalogService';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import Modal from '../components/ui/Modal';
import api from '../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [reservations, setReservations] = useState([]);
  const [reservationsLoading, setReservationsLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [removingFavorite, setRemovingFavorite] = useState(null);
  const { userProfile } = useAuth();
  
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    profilePictureUrl: '',
    role: '',
    emailVerified: false,
    phoneVerified: false
  });

  // Store original data for reset functionality
  const [originalData, setOriginalData] = useState({});

  // Fetch user favorites from server
  const fetchFavorites = async () => {
    try {
      setFavoritesLoading(true);
      const response = await catalogService.getFavorites();
      console.log('Favorites response:', response);
      console.log('Favorites data:', response.data);
      if (response.data && response.data.length > 0) {
        console.log('First favorite:', response.data[0]);
        console.log('First favorite listing:', response.data[0].listing);
        console.log('First favorite media:', response.data[0].listing?.media);
      }
      setFavorites(response.data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      showMessage('error', 'Erreur lors du chargement des favoris');
    } finally {
      setFavoritesLoading(false);
    }
  };

  // Navigate to listing details
  const handleListingClick = (listing) => {
    if (listing?.id) {
      const listingType = listing.type?.toLowerCase();
      let route = '/';
      
      switch (listingType) {
        case 'activity':
          route = `/activity/${listing.id}`;
          break;
        case 'event':
          route = `/event/${listing.id}`;
          break;
        case 'restaurant':
          route = `/restaurant/${listing.id}`;
          break;
        default:
          route = `/activity/${listing.id}`;
      }
      
      navigate(route);
    }
  };

  // Remove favorite from list
  const handleRemoveFavorite = async (listingId) => {
    try {
      setRemovingFavorite(listingId);
      await catalogService.removeFavorite(listingId);
      setFavorites(prev => prev.filter(fav => fav.listing?.id !== listingId));
      showMessage('success', 'Favori supprimé avec succès');
    } catch (error) {
      console.error('Error removing favorite:', error);
      showMessage('error', 'Erreur lors de la suppression du favori');
    } finally {
      setRemovingFavorite(null);
    }
  };

  // Fetch user reservations from server
  const fetchReservations = async () => {
    try {
      setReservationsLoading(true);
      const response = await bookingService.getUserReservations({ limit: 20 });
      setReservations(response.data || []);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      showMessage('error', 'Erreur lors du chargement des réservations');
    } finally {
      setReservationsLoading(false);
    }
  };

  // Message Display Component
  const MessageDisplay = ({ message, onClose }) => {
    if (!message.text) return null;

    const getMessageStyles = (type) => {
      switch (type) {
        case 'success':
          return 'bg-green-50 border-green-200 text-green-800';
        case 'error':
          return 'bg-red-50 border-red-200 text-red-800';
        case 'info':
          return 'bg-blue-50 border-blue-200 text-blue-800';
        default:
          return 'bg-gray-50 border-gray-200 text-gray-800';
      }
    };

    const getIcon = (type) => {
      switch (type) {
        case 'success':
          return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
        case 'error':
          return <ExclamationCircleIcon className="h-5 w-5 text-red-400" />;
        case 'info':
          return <ExclamationCircleIcon className="h-5 w-5 text-blue-400" />;
        default:
          return <ExclamationCircleIcon className="h-5 w-5 text-gray-400" />;
      }
    };

    return (
      <div className={`rounded-md border p-4 mb-6 ${getMessageStyles(message.type)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {getIcon(message.type)}
            <p className="ml-3 text-sm font-medium">{message.text}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 focus:ring-2 focus:ring-offset-2 inline-flex h-8 w-8"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  };
  
  // Load profile from server API - only once on mount
  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        // First, check if we already have profile data from AuthProvider
        if (userProfile) {
          const data = {
            fullName: userProfile.fullName || '',
            email: userProfile.email || '',
            phoneNumber: userProfile.phoneNumber || '',
            profilePictureUrl: userProfile.profilePictureUrl || '',
            role: userProfile.role || '',
            emailVerified: userProfile.emailVerified || false,
            phoneVerified: userProfile.phoneVerified || false
          };
          setProfileData(data);
          setOriginalData(data);
          setIsLoading(false);
          return;
        }

        // If no profile data from AuthProvider, fetch from server
        const serverProfile = await profileService.getUserProfile();
        if (serverProfile) {
          const data = {
            fullName: serverProfile.fullName || '',
            email: serverProfile.email || '',
            phoneNumber: serverProfile.phoneNumber || '',
            profilePictureUrl: serverProfile.profilePictureUrl || '',
            role: serverProfile.role || '',
            emailVerified: serverProfile.emailVerified || false,
            phoneVerified: serverProfile.phoneVerified || false
          };
          setProfileData(data);
          setOriginalData(data);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        showMessage('error', 'Erreur lors du chargement des données du profil');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
    fetchReservations();
    fetchFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only once

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setUpdateLoading(true);
      setMessage({ type: '', text: '' });
      
      // Prepare profile data for server - only send fields that can be updated
      const updateData = {};
      
      // Only include fields that have changed and are not empty
      if (profileData.fullName.trim() !== originalData.fullName && profileData.fullName.trim()) {
        updateData.fullName = profileData.fullName.trim();
      }
      
      if (profileData.phoneNumber.trim() !== originalData.phoneNumber && profileData.phoneNumber.trim()) {
        updateData.phoneNumber = profileData.phoneNumber.trim();
      }
      
      if (profileData.profilePictureUrl.trim() !== originalData.profilePictureUrl) {
        updateData.profilePictureUrl = profileData.profilePictureUrl.trim();
      }
      
      // Check if there are any changes to update
      if (Object.keys(updateData).length === 0) {
        showMessage('info', 'Aucune modification détectée');
        setIsEditing(false);
        return;
      }
      
      // Update profile on server
      const updatedProfile = await profileService.updateUserProfile(updateData);
      
      if (updatedProfile) {
        // Update local state with server response
        const newData = {
          fullName: updatedProfile.fullName || '',
          email: updatedProfile.email || '',
          phoneNumber: updatedProfile.phoneNumber || '',
          profilePictureUrl: updatedProfile.profilePictureUrl || '',
          role: updatedProfile.role || '',
          emailVerified: updatedProfile.emailVerified || false,
          phoneVerified: updatedProfile.phoneVerified || false
        };
        
        setProfileData(newData);
        setOriginalData(newData);
        showMessage('success', 'Profil mis à jour avec succès !');
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      
      // Handle specific error messages from server
      let errorMessage = 'Erreur lors de la mise à jour du profil';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showMessage('error', errorMessage);
    } finally {
      setUpdateLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'awaiting_payment': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Confirmé';
      case 'pending': return 'En attente';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      case 'awaiting_payment': return 'En attente de paiement';
      default: return status;
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profil', icon: UserIcon },
    { id: 'bookings', name: 'Mes réservations', icon: CalendarIcon },
    { id: 'favorites', name: 'Mes favoris', icon: HeartIcon },
  ];

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewBooking, setReviewBooking] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const openReviewModal = (booking) => {
    setReviewBooking(booking);
    setReviewRating(5);
    setReviewComment('');
    setReviewError('');
    setShowReviewModal(true);
  };
  const closeReviewModal = () => {
    setShowReviewModal(false);
    setReviewBooking(null);
    setReviewRating(5);
    setReviewComment('');
    setReviewError('');
  };
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewBooking) return;
    setReviewLoading(true);
    setReviewError('');
    try {
      await api.post('/api/reviews', {
        bookingId: reviewBooking.id,
        rating: reviewRating,
        comment: reviewComment,
      });
      showMessage('success', 'Avis ajouté avec succès !');
      closeReviewModal();
      fetchReservations();
    } catch (error) {
      setReviewError(error.response?.data?.message || 'Erreur lors de l\'envoi de l\'avis');
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
          <p className="text-gray-600">Gérez vos informations personnelles et vos réservations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="h-20 w-20 mx-auto bg-gray-300 rounded-full flex items-center justify-center mb-4">
                    {profileData.profilePictureUrl ? (
                      <img
                        src={profileData.profilePictureUrl}
                        alt="Profile"
                        className="h-20 w-20 rounded-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentNode.innerHTML = '<svg class="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>';
                        }}
                      />
                    ) : (
                      <UserIcon className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {profileData.fullName || 'Utilisateur'}
                  </h3>
                  <p className="text-sm text-gray-500">{profileData.email}</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                    {profileData.role === 'customer' ? 'Client' : profileData.role === 'partner' ? 'Partenaire' : 'Utilisateur'}
                  </span>
                </div>

                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {tab.name}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Information */}
            {activeTab === 'profile' && (
              <Card>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Informations personnelles</h2>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(!isEditing)}
                      disabled={isLoading || updateLoading}
                    >
                      {isEditing ? 'Annuler' : 'Modifier'}
                    </Button>
                  </div>

                  {/* Message Display */}
                  <MessageDisplay 
                    message={message} 
                    onClose={() => setMessage({ type: '', text: '' })} 
                  />

                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <form className="space-y-6">
                      {/* Profile Picture URL */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Photo de profil (URL)
                        </label>
                        <div className="flex items-center space-x-4">
                          {profileData.profilePictureUrl && (
                            <img
                              src={profileData.profilePictureUrl}
                              alt="Profile"
                              className="h-16 w-16 rounded-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          )}
                          <div className="flex-1">
                            <input
                              type="url"
                              name="profilePictureUrl"
                              value={profileData.profilePictureUrl}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              placeholder="https://exemple.com/photo.jpg"
                              className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${!isEditing ? 'bg-gray-50' : ''}`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Full Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom complet
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={profileData.fullName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="Votre nom complet"
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${!isEditing ? 'bg-gray-50' : ''}`}
                        />
                      </div>

                      {/* Email (Read-only) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                          {profileData.emailVerified && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              Vérifié
                            </span>
                          )}
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 cursor-not-allowed"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                          L'email ne peut pas être modifié
                        </p>
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone
                          {profileData.phoneVerified && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              Vérifié
                            </span>
                          )}
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={profileData.phoneNumber}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="+212 6 12 34 56 78"
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${!isEditing ? 'bg-gray-50' : ''}`}
                        />
                      </div>

                      {/* Role (Read-only) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rôle
                        </label>
                        <input
                          type="text"
                          value={profileData.role === 'customer' ? 'Client' : profileData.role === 'partner' ? 'Partenaire' : profileData.role}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 cursor-not-allowed"
                        />
                      </div>

                      {isEditing && (
                        <div className="flex justify-end space-x-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setProfileData(originalData);
                              setIsEditing(false);
                              setMessage({ type: '', text: '' });
                            }}
                            disabled={updateLoading}
                          >
                            Annuler
                          </Button>
                          <Button onClick={handleSave} disabled={updateLoading}>
                            {updateLoading ? 'Enregistrement...' : 'Enregistrer'}
                          </Button>
                        </div>
                      )}
                    </form>
                  )}
                </div>
              </Card>
            )}

            {/* Bookings */}
            {activeTab === 'bookings' && (
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Mes réservations</h2>
                  
                  {reservationsLoading ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner />
                    </div>
                  ) : reservations.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Aucune réservation trouvée</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {reservations.map((booking) => (
                        <div key={booking.id} className="border border-gray-200 rounded-xl p-6 bg-white/80 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-md transition-shadow">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-4 mb-2">
                              <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                                {booking.listing?.media?.[0]?.mediaUrl ? (
                                  <img src={booking.listing.media[0].mediaUrl} alt={booking.listing.title} className="h-16 w-16 object-cover rounded-lg" />
                                ) : (
                                  <PhotoIcon className="h-8 w-8 text-gray-400" />
                                )}
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-900 text-lg mb-1">{booking.listing?.title || 'Réservation'}</h3>
                                <p className="text-sm text-gray-500">{booking.listing?.address || 'Adresse non disponible'}</p>
                                <p className="text-xs text-gray-400">{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Date non disponible'}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <span>{booking.numParticipants} participant{booking.numParticipants > 1 ? 's' : ''}</span>
                              {booking.totalAmount && <span className="font-semibold">{booking.totalAmount} MAD</span>}
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>{getStatusText(booking.status)}</span>
                          </div>
                          <div className="flex flex-col items-end gap-2 min-w-[160px]">
                            {/* Add Review Button: show if completed and not reviewed */}
                            {booking.status === 'completed' && !booking.reviewed && (
                              <Button size="sm" className="bg-primary-600 hover:bg-primary-700 text-white" onClick={() => openReviewModal(booking)}>
                                Ajouter un avis
                              </Button>
                            )}
                            {/* If already reviewed, show a badge */}
                            {booking.status === 'completed' && booking.reviewed && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Avis envoyé</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* Review Modal */}
                <Modal isOpen={showReviewModal} onClose={closeReviewModal} title="Ajouter un avis">
                  <form onSubmit={handleReviewSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className={star <= reviewRating ? 'text-yellow-400' : 'text-gray-300'}
                            tabIndex={-1}
                          >
                            <StarIconSolid className="h-6 w-6" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Commentaire</label>
                      <textarea
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        rows={4}
                        value={reviewComment}
                        onChange={e => setReviewComment(e.target.value)}
                        placeholder="Partagez votre expérience..."
                        required
                      />
                    </div>
                    {reviewError && <p className="text-red-600 text-sm">{reviewError}</p>}
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={closeReviewModal} disabled={reviewLoading}>Annuler</Button>
                      <Button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white" disabled={reviewLoading}>{reviewLoading ? 'Envoi...' : 'Envoyer l\'avis'}</Button>
                    </div>
                  </form>
                </Modal>
              </Card>
            )}

            {/* Favorites */}
            {activeTab === 'favorites' && (
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Mes favoris</h2>
                  
                  {favoritesLoading ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner />
                    </div>
                  ) : favorites.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <HeartIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p>Vous n'avez pas encore de favoris</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {favorites.filter(fav => fav.listing).map((favorite) => (
                        <div key={favorite.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start space-x-4">
                            <div 
                              className="h-20 w-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden cursor-pointer"
                              onClick={() => handleListingClick(favorite.listing)}
                            >
                              {(() => {
                                const media = favorite.listing?.media;
                                const imageUrl = media?.[0]?.mediaUrl || media?.[0]?.media_url;
                                
                                console.log('Media for listing:', favorite.listing?.title, media);
                                console.log('Image URL:', imageUrl);
                                
                                if (imageUrl) {
                                  return (
                                    <img
                                      src={imageUrl}
                                      alt={favorite.listing.title}
                                      className="h-20 w-20 object-cover rounded-lg hover:opacity-90 transition-opacity"
                                      onError={(e) => {
                                        console.log('Image failed to load:', e.target.src);
                                        e.target.style.display = 'none';
                                        // Show fallback
                                        const fallback = e.target.nextSibling;
                                        if (fallback) fallback.style.display = 'flex';
                                      }}
                                    />
                                  );
                                }
                                return null;
                              })()}
                              <div className="h-20 w-20 bg-gray-200 rounded-lg flex items-center justify-center">
                                <PhotoIcon className="h-8 w-8 text-gray-400" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 
                                className="font-medium text-gray-900 truncate cursor-pointer hover:text-blue-600 transition-colors"
                                onClick={() => handleListingClick(favorite.listing)}
                              >
                                {favorite.listing?.title}
                              </h3>
                              <p className="text-sm text-gray-500 capitalize">{favorite.listing?.type?.toLowerCase()}</p>
                              {favorite.listing?.location && (
                                <p className="text-sm text-gray-400 truncate">{favorite.listing.location}</p>
                              )}
                              {favorite.listing?.category && (
                                <p className="text-xs text-blue-600 mt-1">{favorite.listing.category.name}</p>
                              )}
                              <div className="flex items-center mt-2 text-xs text-gray-500">
                                {favorite.listing?.pricePerPerson && (
                                  <span className="mr-3">{favorite.listing.pricePerPerson} MAD/pers</span>
                                )}
                                {favorite.listing?._count?.reviews > 0 && (
                                  <span className="mr-3">{favorite.listing._count.reviews} avis</span>
                                )}
                                {favorite.listing?._count?.bookings > 0 && (
                                  <span>{favorite.listing._count.bookings} réservations</span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveFavorite(favorite.listing.id)}
                              disabled={removingFavorite === favorite.listing.id}
                              className="text-red-600 hover:text-red-800 p-2 flex-shrink-0 disabled:opacity-50"
                              title="Supprimer des favoris"
                            >
                              {removingFavorite === favorite.listing.id ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                              ) : (
                                <XMarkIcon className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
