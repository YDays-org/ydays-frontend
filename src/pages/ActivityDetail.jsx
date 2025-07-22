import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPinIcon, 
  StarIcon, 
  CalendarIcon, 
  ClockIcon, 
  PhoneIcon, 
  GlobeAltIcon,
  CheckIcon,
  XMarkIcon,
  UserIcon,
  ShareIcon,
  HeartIcon,
  PlayIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  InformationCircleIcon,
  WifiIcon,
  TruckIcon,
  AcademicCapIcon,
  CameraIcon,
  ArrowLeftIcon,
  TagIcon,
  UsersIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  ChatBubbleBottomCenterTextIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { 
  HeartIcon as HeartIconSolid, 
  StarIcon as StarIconSolid,
  CheckBadgeIcon
} from '@heroicons/react/24/solid';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import catalogService from '../services/catalogService';

// Constants
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/1200x800?text=Beautiful+Activity';

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [participants, setParticipants] = useState(1);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [, setIsGalleryOpen] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        const response = await catalogService.getListingById(id);
        
        if (response.success) {
          setActivity(response.data);
          // Set default schedule if available
          if (response.data.schedules && response.data.schedules.length > 0) {
            setSelectedSchedule(response.data.schedules[0]);
          }
        } else {
          setError('Activité introuvable');
        }
      } catch (err) {
        console.error('Error fetching activity:', err);
        setError('Erreur lors du chargement de l\'activité');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchActivity();
    }
  }, [id]);

  // Check if listing is in favorites
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!isAuthenticated || !id) return;
      
      try {
        const response = await catalogService.checkFavorite(id);
        if (response.success) {
          setIsFavorite(response.data.isFavorite);
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    checkFavoriteStatus();
  }, [isAuthenticated, id]);

  const toggleFavorite = async () => {
    console.log('user', isAuthenticated);
    if (!isAuthenticated) {
      alert('Veuillez vous connecter pour ajouter aux favoris');
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await catalogService.removeFavorite(id);
        setIsFavorite(false);
      } else {
        await catalogService.addFavorite(id);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      if (error.response?.status === 409) {
        // Already a favorite
        setIsFavorite(true);
      } else if (error.response?.status === 404) {
        // Not found in favorites
        setIsFavorite(false);
      } else {
        alert('Erreur lors de la modification des favoris');
      }
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleBooking = () => {
    if (!selectedSchedule) {
      alert('Veuillez sélectionner un horaire');
      return;
    }
    
    // Format the date and time from the selected schedule
    const formatBookingDateTime = (schedule) => {
      try {
        const startDate = new Date(schedule.startTime || schedule.start_time);
        const endDate = new Date(schedule.endTime || schedule.end_time);
        
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          return {
            date: new Date().toISOString().split('T')[0],
            time: '09:00'
          };
        }
        
        return {
          date: startDate.toISOString().split('T')[0],
          time: startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        };
      } catch (error) {
        return {
          date: new Date().toISOString().split('T')[0],
          time: '09:00'
        };
      }
    };

    const { date, time } = formatBookingDateTime(selectedSchedule);
    
    // Navigate to booking page with query parameters and state
    const bookingUrl = `/booking/activity/${id}?date=${date}&time=${time}&participants=${participants}`;
    
    navigate(bookingUrl, {
      state: {
        // Pass the complete listing data
        listing: {
          id: activity.id,
          title: activity.title,
          description: activity.description,
          address: activity.address,
          type: activity.type,
          category: activity.category,
          partner: activity.partner,
          media: activity.media,
          metadata: parseMetadata(activity.metadata)
        },
        // Pass the selected schedule details
        schedule: {
          id: selectedSchedule.id,
          startTime: selectedSchedule.startTime || selectedSchedule.start_time,
          endTime: selectedSchedule.endTime || selectedSchedule.end_time,
          price: selectedSchedule.price,
          capacity: selectedSchedule.capacity,
          bookedSlots: selectedSchedule.bookedSlots || selectedSchedule.booked_slots || 0
        },
        // Pass booking configuration
        bookingDetails: {
          participants: participants,
          totalPrice: calculateTotal(),
          pricePerParticipant: parseFloat(selectedSchedule.price),
          date: date,
          time: time,
          duration: parseMetadata(activity.metadata).duration || 'N/A'
        }
      }
    });
  };

  const calculateTotal = () => {
    if (!selectedSchedule) return 0;
    return parseFloat(selectedSchedule.price) * participants;
  };

  const shareActivity = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: activity.title,
          text: activity.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers !');
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'Prix sur demande';
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `${numericPrice.toFixed(0)} MAD`;
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Date invalide';
      }
      return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Date invalide';
    }
  };

  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Heure invalide';
      }
      return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Heure invalide';
    }
  };

  const formatScheduleDisplay = (schedule) => {
    try {
      const startDate = new Date(schedule.startTime || schedule.start_time);
      const endDate = new Date(schedule.endTime || schedule.end_time);
      
      // Check if dates are valid
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return `Horaire disponible - ${formatPrice(schedule.price)}`;
      }
      
      // Check if it's the same day
      const isSameDay = startDate.toDateString() === endDate.toDateString();
      
      if (isSameDay) {
        return `${formatDate(schedule.startTime || schedule.start_time)} de ${formatTime(schedule.startTime || schedule.start_time)} à ${formatTime(schedule.endTime || schedule.end_time)}`;
      } else {
        // For date ranges, show a more user-friendly format
        const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        if (daysDiff > 30) {
          return `Disponible jusqu'au ${formatDate(schedule.endTime || schedule.end_time)} - ${formatPrice(schedule.price)}`;
        } else {
          return `Du ${formatDate(schedule.startTime || schedule.start_time)} au ${formatDate(schedule.endTime || schedule.end_time)}`;
        }
      }
    } catch (error) {
      return `Horaire disponible - ${formatPrice(schedule.price)}`;
    }
  };

  const getAllImages = () => {
    if (!activity.media || activity.media.length === 0) {
      return [PLACEHOLDER_IMAGE];
    }
    
    return activity.media.map(m => m.media_url || m.mediaUrl);
  };

  const nextImage = () => {
    const images = getAllImages();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    const images = getAllImages();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const parseMetadata = (metadata) => {
    if (!metadata) return {};
    if (typeof metadata === 'string') {
      try {
        return JSON.parse(metadata);
      } catch {
        return {};
      }
    }
    return metadata;
  };

  const getAmenityIcon = (amenityName) => {
    // Enhanced amenity icon mappings
    const iconMap = {
      'wifi': WifiIcon,
      'parking': TruckIcon,
      'guide': AcademicCapIcon,
      'photos': CameraIcon,
      'restaurant': CurrencyDollarIcon,
      'access': ShieldCheckIcon,
      'group': UsersIcon,
      'default': CheckIcon
    };
    
    const normalizedName = amenityName.toLowerCase();
    for (const [key, Icon] of Object.entries(iconMap)) {
      if (normalizedName.includes(key)) {
        return Icon;
      }
    }
    return iconMap.default;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <InformationCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Activité introuvable</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => navigate('/activities')}>
            Retour aux activités
          </Button>
        </Card>
      </div>
    );
  }

  const metadata = parseMetadata(activity.metadata);
  const images = getAllImages();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Hero Section */}
      <div className="relative h-screen bg-gray-900 overflow-hidden">
        {/* Full-screen image */}
        <div className="absolute inset-0">
          <img
            src={images[currentImageIndex]}
            alt={activity.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              e.target.src = PLACEHOLDER_IMAGE;
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        </div>
        
        {/* Navigation controls */}
        <div className="absolute top-6 left-6 z-20">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 px-4 py-2 rounded-full shadow-lg transition-all duration-200"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span className="font-medium">Retour</span>
          </button>
        </div>

        {/* Image Navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full shadow-lg transition-all duration-200 z-20"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full shadow-lg transition-all duration-200 z-20"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Action buttons */}
        <div className="absolute top-6 right-6 flex space-x-3 z-20">
          <button
            onClick={() => setIsGalleryOpen(true)}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full shadow-lg transition-all duration-200"
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>
          <button
            onClick={shareActivity}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full shadow-lg transition-all duration-200"
          >
            <ShareIcon className="h-5 w-5" />
          </button>
          <button
            onClick={toggleFavorite}
            disabled={favoriteLoading}
            className={`
              bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full shadow-lg transition-all duration-200
              ${favoriteLoading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            {isFavorite ? (
              <HeartIconSolid className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-20">
          <div className="max-w-4xl">
            <div className="flex items-center space-x-3 mb-4">
              {activity.category && (
                <span className="bg-primary-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                  {activity.category.name}
                </span>
              )}
              <span className="bg-blue-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium capitalize">
                {activity.type}
              </span>
              {activity.average_rating && (
                <div className="flex items-center bg-yellow-500/90 backdrop-blur-sm px-4 py-2 rounded-full">
                  <StarIconSolid className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">
                    {typeof activity.average_rating === 'string' ? 
                      parseFloat(activity.average_rating).toFixed(1) : 
                      Number(activity.average_rating).toFixed(1)}
                  </span>
                </div>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {activity.title}
            </h1>
            
            <div className="flex items-center space-x-6 text-lg">
              <div className="flex items-center">
                <MapPinIcon className="h-5 w-5 mr-2" />
                <span>{activity.address}</span>
              </div>
              {metadata.duration && (
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  <span>{metadata.duration}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Image indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link to="/" className="hover:text-primary-600 transition-colors">Accueil</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link to="/activities" className="hover:text-primary-600 transition-colors">Activités</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">{activity.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-8">
            {/* Description Section */}
            <Card className="p-8 shadow-sm border-0 bg-white/80 backdrop-blur-sm">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">À propos de cette activité</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <UsersIcon className="h-4 w-4 mr-1" />
                      <span>{activity.review_count || 0} avis</span>
                    </div>
                    <div className="flex items-center">
                      <CheckBadgeIcon className="h-4 w-4 mr-1 text-green-500" />
                      <span>Vérifié</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {showFullDescription || activity.description.length <= 300 
                    ? activity.description 
                    : `${activity.description.substring(0, 300)}...`}
                </p>
                {activity.description.length > 300 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-primary-600 hover:text-primary-700 font-medium mt-4"
                  >
                    {showFullDescription ? 'Voir moins' : 'Voir plus'}
                  </button>
                )}
              </div>
            </Card>

            {/* Tarifs et disponibilités Section */}
            {activity.schedules && activity.schedules.length > 0 && (
              <Card className="p-8 shadow-sm border-0 bg-white/80 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <CurrencyDollarIcon className="h-6 w-6 mr-2 text-green-600" />
                  Tarifs et disponibilités
                </h2>
                <div className="space-y-4">
                  {activity.schedules.map((schedule) => {
                    const isSelected = selectedSchedule && selectedSchedule.id === schedule.id;
                    return (
                      <button
                        key={schedule.id}
                        type="button"
                        onClick={() => setSelectedSchedule(schedule)}
                        className={`flex justify-between items-center w-full p-4 rounded-lg transition-colors border-2 ${isSelected ? 'border-primary-600 bg-primary-50' : 'border-transparent bg-gray-50 hover:bg-gray-100'}`}
                      >
                        <div className="flex-1 text-left">
                          <h4 className="font-medium">{formatScheduleDisplay(schedule)}</h4>
                          <p className="text-gray-600 text-sm">
                            Capacité: {schedule.capacity} personnes • Disponible: {schedule.capacity - (schedule.bookedSlots || schedule.booked_slots || 0)} places
                          </p>
                        </div>
                        <span className="font-medium text-primary-600">{formatPrice(schedule.price)}</span>
                      </button>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedSchedule && (
                <Card className="p-6 text-center shadow-sm border-0 bg-gradient-to-br from-primary-50 to-primary-100">
                  <CurrencyDollarIcon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">À partir de</p>
                  <p className="text-2xl font-bold text-primary-600">{formatPrice(selectedSchedule.price)}</p>
                  <p className="text-xs text-gray-500">par personne</p>
                </Card>
              )}
              
              {metadata.duration && (
                <Card className="p-6 text-center shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100">
                  <ClockIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">Durée</p>
                  <p className="text-xl font-bold text-blue-600">{metadata.duration}</p>
                </Card>
              )}
              
              {selectedSchedule && (
                <Card className="p-6 text-center shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100">
                  <UsersIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">Disponible</p>
                  <p className="text-xl font-bold text-green-600">
                    {(selectedSchedule.capacity || 0) - (selectedSchedule.bookedSlots || selectedSchedule.booked_slots || 0)} places
                  </p>
                </Card>
              )}
            </div>

            {/* Program/Schedule Section */}
            {metadata.programme && Array.isArray(metadata.programme) && (
              <Card className="p-8 shadow-sm border-0 bg-white/80 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <CalendarIcon className="h-6 w-6 mr-2 text-primary-600" />
                  Programme détaillé
                </h2>
                <div className="space-y-6">
                  {metadata.programme.map((item, index) => (
                    <div key={index} className="relative flex items-start group">
                      <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {item.heure}
                      </div>
                      <div className="ml-6 flex-1">
                        <div className="bg-gray-50 rounded-lg p-4 group-hover:bg-gray-100 transition-colors">
                          <p className="text-gray-800 font-medium leading-relaxed">
                            {item.detail || item.activite}
                          </p>
                        </div>
                      </div>
                      {index < metadata.programme.length - 1 && (
                        <div className="absolute left-10 top-20 w-0.5 h-6 bg-gray-300"></div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Enhanced Amenities Section */}
            {activity.amenities && activity.amenities.length > 0 && (
              <Card className="p-8 shadow-sm border-0 bg-white/80 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <CheckIcon className="h-6 w-6 mr-2 text-green-600" />
                  Équipements et services
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activity.amenities.map((amenityItem) => {
                    const IconComponent = getAmenityIcon(amenityItem.amenity.name);
                    return (
                      <div key={amenityItem.amenity.id} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                        <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                          <IconComponent className="h-5 w-5 text-green-600" />
                        </div>
                        <span className="ml-3 text-gray-700 font-medium">{amenityItem.amenity.name}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* Enhanced Inclusions/Exclusions */}
            {(metadata.inclusions || metadata.nonInclus) && (
              <Card className="p-8 shadow-sm border-0 bg-white/80 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <TagIcon className="h-6 w-6 mr-2 text-blue-600" />
                  Ce qui est inclus
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {metadata.inclusions && (
                    <div>
                      <h3 className="font-bold text-lg mb-4 text-green-700 flex items-center">
                        <CheckIcon className="h-5 w-5 mr-2" />
                        Inclus dans le prix
                      </h3>
                      <ul className="space-y-3">
                        {metadata.inclusions.map((item, index) => (
                          <li key={index} className="flex items-start group">
                            <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5 group-hover:bg-green-200 transition-colors">
                              <CheckIcon className="h-4 w-4 text-green-600" />
                            </div>
                            <span className="ml-3 text-gray-700 leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {metadata.nonInclus && (
                    <div>
                      <h3 className="font-bold text-lg mb-4 text-red-700 flex items-center">
                        <XMarkIcon className="h-5 w-5 mr-2" />
                        Non inclus
                      </h3>
                      <ul className="space-y-3">
                        {metadata.nonInclus.map((item, index) => (
                          <li key={index} className="flex items-start group">
                            <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-0.5 group-hover:bg-red-200 transition-colors">
                              <XMarkIcon className="h-4 w-4 text-red-600" />
                            </div>
                            <span className="ml-3 text-gray-700 leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Enhanced Cancellation Policy */}
            {activity.cancellation_policy && (
              <Card className="p-8 shadow-sm border-0 bg-gradient-to-br from-orange-50 to-orange-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <ExclamationTriangleIcon className="h-6 w-6 mr-2 text-orange-600" />
                  Politique d'annulation
                </h2>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <p className="text-gray-700 leading-relaxed">{activity.cancellation_policy}</p>
                </div>
              </Card>
            )}

            {/* Enhanced Reviews Section */}
            {activity.reviews && activity.reviews.length > 0 && (
              <Card className="p-8 shadow-sm border-0 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <ChatBubbleBottomCenterTextIcon className="h-6 w-6 mr-2 text-blue-600" />
                    Avis de nos clients
                  </h2>
                  <div className="flex items-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">
                        {activity.average_rating ? (
                          typeof activity.average_rating === 'string' ? 
                            parseFloat(activity.average_rating).toFixed(1) : 
                            Number(activity.average_rating).toFixed(1)
                        ) : '0.0'}
                      </div>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <StarIconSolid
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(activity.average_rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{activity.review_count || 0} avis</p>
                    </div>
                    {activity.reviews.length > 3 && (
                      <button
                        onClick={() => setShowAllReviews(!showAllReviews)}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        {showAllReviews ? 'Voir moins' : 'Voir tous les avis'}
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-6">
                  {(showAllReviews ? activity.reviews : activity.reviews.slice(0, 3)).map((review) => (
                    <div key={review.id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {review.user?.profile_picture_url ? (
                            <img
                              src={review.user.profile_picture_url}
                              alt={review.user.full_name}
                              className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-lg"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                              <UserIcon className="h-6 w-6 text-white" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-bold text-gray-900">
                                {review.user?.full_name || 'Utilisateur anonyme'}
                              </h4>
                              <div className="flex items-center mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <StarIconSolid
                                    key={i}
                                    className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">
                              {formatDate(review.created_at || review.createdAt)}
                            </span>
                          </div>
                          
                          <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>
                          
                          {review.partner_reply && (
                            <div className="bg-white rounded-lg p-4 border-l-4 border-primary-500">
                              <p className="text-sm font-bold text-gray-900 mb-2 flex items-center">
                                <CheckBadgeIcon className="h-4 w-4 mr-1 text-primary-600" />
                                Réponse du partenaire
                              </p>
                              <p className="text-sm text-gray-700">{review.partner_reply}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Enhanced Booking Sidebar */}
          <div className="xl:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Main Booking Card */}
              <Card className="p-8 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Réservez votre expérience</h3>
                  <p className="text-gray-600">Sélectionnez vos options et réservez maintenant</p>
                </div>
                
                {activity.schedules && activity.schedules.length > 0 ? (
                  <div className="space-y-6">
                    {/* Schedule Selection */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        <CalendarIcon className="h-4 w-4 inline mr-2" />
                        Choisir un horaire
                      </label>
                      <select
                        value={selectedSchedule?.id || ''}
                        onChange={(e) => {
                          const schedule = activity.schedules.find(s => s.id === e.target.value);
                          setSelectedSchedule(schedule);
                        }}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white"
                      >
                        <option value="">Sélectionner un horaire</option>
                        {activity.schedules.map((schedule) => (
                          <option key={schedule.id} value={schedule.id}>
                            {formatScheduleDisplay(schedule)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Participants Selection */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        <UsersIcon className="h-4 w-4 inline mr-2" />
                        Nombre de participants
                      </label>
                      <select
                        value={participants}
                        onChange={(e) => setParticipants(parseInt(e.target.value))}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white"
                      >
                        {[...Array(Math.min(selectedSchedule?.capacity || 10, 10))].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} personne{i + 1 > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Price Breakdown */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 space-y-4">
                      <h4 className="font-bold text-gray-900">Récapitulatif du prix</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Prix unitaire</span>
                          <span className="font-semibold">
                            {selectedSchedule ? formatPrice(selectedSchedule.price) : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Participants</span>
                          <span className="font-semibold">× {participants}</span>
                        </div>
                        <div className="border-t pt-3">
                          <div className="flex justify-between items-center text-xl font-bold">
                            <span>Total</span>
                            <span className="text-primary-600">
                              {formatPrice(calculateTotal())}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Availability Info */}
                    {selectedSchedule && (
                      <div className="bg-green-50 rounded-xl p-4 text-center">
                        <div className="flex items-center justify-center mb-2">
                          <CheckBadgeIcon className="h-5 w-5 text-green-600 mr-2" />
                          <span className="text-sm font-medium text-green-800">
                            {(selectedSchedule.capacity || 0) - (selectedSchedule.bookedSlots || selectedSchedule.booked_slots || 0)} place(s) disponible(s)
                          </span>
                        </div>
                        <p className="text-xs text-green-600">Réservation confirmée instantanément</p>
                      </div>
                    )}

                    {/* Booking Button */}
                    <Button
                      onClick={handleBooking}
                      className="w-full py-4 text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all duration-200"
                      disabled={!selectedSchedule}
                    >
                      {!selectedSchedule ? 'Sélectionner un horaire' : 'Réserver maintenant'}
                    </Button>

                    {/* Trust Indicators */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <ShieldCheckIcon className="h-6 w-6 text-green-600 mx-auto mb-1" />
                        <p className="text-xs text-gray-600">Sécurisé</p>
                      </div>
                      <div className="text-center">
                        <CheckBadgeIcon className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                        <p className="text-xs text-gray-600">Vérifié</p>
                      </div>
                      <div className="text-center">
                        <CurrencyDollarIcon className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                        <p className="text-xs text-gray-600">Remboursable</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Aucun horaire disponible</h4>
                    <p className="text-gray-600 mb-6">Contactez le partenaire pour plus d'informations</p>
                    <Button
                      onClick={() => {
                        const phone = activity.partner?.user?.phoneNumber || activity.phoneNumber;
                        if (phone) {
                          window.location.href = `tel:${phone}`;
                        } else {
                          alert('Aucun numéro de téléphone disponible');
                        }
                      }}
                      className="bg-gray-600 hover:bg-gray-700"
                      disabled={!activity.partner?.user?.phoneNumber && !activity.phoneNumber}
                    >
                      Contacter le partenaire
                    </Button>
                  </div>
                )}
              </Card>

              {/* Partner Contact Card */}
              <Card className="p-6 shadow-lg border-0 bg-gradient-to-br from-primary-50 to-primary-100">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                  <UserIcon className="h-5 w-5 mr-2 text-primary-600" />
                  Votre partenaire
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mr-3">
                      <UserIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{activity.partner?.company_name || 'Partenaire'}</p>
                      <p className="text-sm text-gray-600">Partenaire vérifié</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    {(activity.partner?.user?.phoneNumber || activity.phoneNumber) && (
                      <div className="flex items-center">
                        <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <a 
                          href={`tel:${activity.partner?.user?.phoneNumber || activity.phoneNumber}`}
                          className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                          {activity.partner?.user?.phoneNumber || activity.phoneNumber}
                        </a>
                      </div>
                    )}
                    {activity.partner?.website_url && (
                      <div className="flex items-center">
                        <GlobeAltIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <a 
                          href={activity.partner.website_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Visiter le site
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={shareActivity}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-0 py-3"
                >
                  <ShareIcon className="h-4 w-4 mr-2" />
                  Partager
                </Button>
                <Button
                  onClick={toggleFavorite}
                  disabled={favoriteLoading}
                  className={`py-3 border-0 transition-all ${
                    isFavorite 
                      ? 'bg-red-100 hover:bg-red-200 text-red-700' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  } ${favoriteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isFavorite ? (
                    <HeartIconSolid className="h-4 w-4 mr-2" />
                  ) : (
                    <HeartIcon className="h-4 w-4 mr-2" />
                  )}
                  {isFavorite ? 'Favoris' : 'Ajouter'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail; 