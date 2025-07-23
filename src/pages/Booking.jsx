import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon, 
  UserIcon, 
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  StarIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Toast from '../components/ui/Toast';
import ReviewModal from '../components/ui/ReviewModal';
import api from '../services/api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'fallback_publishable_key');

// Steps component
const StepIndicator = ({ currentStep, totalSteps }) => (
  <div className="flex items-center justify-center mb-8">
    {[...Array(totalSteps)].map((_, index) => (
      <div key={index} className="flex items-center">
        <div className={`
          w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
          ${index + 1 < currentStep ? 'bg-green-500 text-white' : 
            index + 1 === currentStep ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}
          transition-all duration-300
        `}>
          {index + 1 < currentStep ? (
            <CheckCircleIcon className="w-5 h-5" />
          ) : (
            index + 1
          )}
        </div>
        {index < totalSteps - 1 && (
          <div className={`
            w-16 h-1 mx-2 rounded-full
            ${index + 1 < currentStep ? 'bg-green-500' : 'bg-gray-300'}
            transition-all duration-300
          `} />
        )}
      </div>
    ))}
  </div>
);

// Step 1: Personal Information
const PersonalInfoStep = ({ formData, handleInputChange, validateStep1, nextStep }) => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Informations personnelles</h2>
      <p className="text-gray-600">Veuillez remplir vos informations de contact</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Prénom *
        </label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="Votre prénom"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Nom *
        </label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="Votre nom"
        />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Email *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="votre@email.com"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Téléphone *
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="+212 6XX XXX XXX"
        />
      </div>
    </div>

    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Demandes spéciales
      </label>
      <textarea
        name="specialRequests"
        value={formData.specialRequests}
        onChange={handleInputChange}
        rows={4}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        placeholder="Toute demande spéciale ou information supplémentaire..."
      />
    </div>

    <div className="flex justify-between pt-6">
      <Button
        variant="outline"
        type="button"
        onClick={() => window.history.back()}
        className="flex items-center gap-2"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Retour
      </Button>
      <Button
        type="button"
        onClick={nextStep}
        disabled={!validateStep1()}
        className="flex items-center gap-2"
      >
        Continuer
        <CheckCircleIcon className="w-4 h-4" />
      </Button>
    </div>
  </div>
);

// Step 2: Payment Information
const PaymentStep = ({ paymentError, isLoading, prevStep, totalPrice, schedule }) => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Paiement sécurisé</h2>
      <p className="text-gray-600">Finalisez votre réservation</p>
    </div>

    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
      <div className="flex items-center gap-3 mb-4">
        <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-blue-900">Paiement sécurisé</h3>
      </div>
      <p className="text-blue-800 text-sm">
        Vos informations de paiement sont protégées par un chiffrement SSL 256 bits. 
        Nous ne stockons pas vos données bancaires.
      </p>
    </div>

    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <CreditCardIcon className="w-4 h-4 inline mr-2" />
        Informations de paiement *
      </label>
      <div className="border-2 border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:border-blue-300 transition-colors duration-200">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#374151',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                '::placeholder': {
                  color: '#9CA3AF',
                },
              },
              invalid: {
                color: '#EF4444',
                iconColor: '#EF4444',
              },
            },
          }}
        />
      </div>
    </div>

    {paymentError && (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
        <ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
        <p className="text-red-700 text-sm">{paymentError}</p>
      </div>
    )}

    <div className="flex justify-between pt-6">
      <Button
        variant="outline"
        type="button"
        onClick={prevStep}
        className="flex items-center gap-2"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Retour
      </Button>
      <Button
        type="submit"
        disabled={isLoading || !schedule}
        className="flex items-center gap-2 min-w-[180px]"
      >
        {isLoading ? (
          <>
            <LoadingSpinner className="w-4 h-4" />
            Traitement...
          </>
        ) : (
          <>
            <CreditCardIcon className="w-4 h-4" />
            Payer {totalPrice} MAD
          </>
        )}
      </Button>
    </div>
  </div>
);

const Booking = () => {
  return (
    <Elements stripe={stripePromise}>
      <BookingContent />
    </Elements>
  );
};

const BookingContent = () => {
  const { type, id } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [completedBooking, setCompletedBooking] = useState(null);
  const stripe = useStripe();
  const elements = useElements();

  // Get data from navigation state (passed from ActivityDetail)
  const { listing, schedule, bookingDetails } = location.state || {};
  
  // Get booking details from URL params (fallback)
  const date = searchParams.get('date');
  const time = searchParams.get('time');
  const participants = searchParams.get('participants') || searchParams.get('tickets') || searchParams.get('guests');

  console.log('Booking data:', { listing, schedule, bookingDetails, type, id, date, time, participants });

  // If no listing data is passed, redirect back
  useEffect(() => {
    if (!listing && !schedule) {
      console.warn('No listing data found in navigation state');
      // Optionally redirect back or fetch data based on ID
      // navigate(`/activities/${id}`, { replace: true });
    }
  }, [listing, schedule, id, navigate]);

  // Use the listing data if available, otherwise use fallback mock data
  const currentBooking = listing ? {
    id: listing.id,
    title: listing.title,
    price: schedule ? parseFloat(schedule.price) : 0,
    duration: listing.metadata?.duration || 'N/A',
    location: listing.address,
    description: listing.description,
    partner: listing.partner,
    type: listing.type,
    category: listing.category
  } : {
    title: 'Activité',
    price: 150,
    duration: 'N/A',
    location: 'Casablanca'
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateStep1 = () => {
    const { firstName, lastName, email, phone } = formData;
    return firstName && lastName && email && phone;
  };

  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setPaymentError('');

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Vous devez être connecté pour effectuer une réservation.');
      setIsLoading(false);
      return;
    }

    // Validate that we have the required booking data
    if (!schedule || !schedule.id) {
      setPaymentError('Informations de réservation manquantes. Veuillez revenir à la page précédente.');
      setIsLoading(false);
      return;
    }

    try {
      // Step 1: Create the reservation using the backend API
      const reservationData = {
        scheduleId: schedule.id,
        numParticipants: parseInt(participants || bookingDetails?.participants || 1)
      };

      console.log('Creating reservation with data:', reservationData);

      const reservationResponse = await api.post('/api/booking/reservations', reservationData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (reservationResponse.data.success) {
        const { booking, requiresPayment, totalPrice } = reservationResponse.data.data;
        
        // Step 2: Handle payment if required
        if (requiresPayment && totalPrice > 0) {
          // Create payment intent
          const paymentResponse = await api.post('/api/booking/payment', {
            amount: Math.round(totalPrice * 100), // Amount in cents
            currency: 'mad'
          }, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!paymentResponse.data.success) {
            throw new Error('Failed to create payment intent');
          }

          const { clientSecret } = paymentResponse.data;

          // Confirm payment with Stripe
          const paymentResult = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: elements.getElement(CardElement),
              billing_details: {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                phone: formData.phone
              }
            }
          });

          if (paymentResult.error) {
            console.error('Payment failed:', paymentResult.error);
            setPaymentError('Le paiement a échoué. Veuillez vérifier vos informations de paiement.');
            setIsLoading(false);
            return;
          }

          // Step 3: Complete the payment on the backend
          // Safely extract payment method details
          const charge = paymentResult.paymentIntent.charges?.data?.[0];
          const paymentMethodDetails = charge?.payment_method_details?.card ? {
            brand: charge.payment_method_details.card.brand,
            last4: charge.payment_method_details.card.last4,
            exp_month: Number(charge.payment_method_details.card.exp_month) || 12,
            exp_year: Number(charge.payment_method_details.card.exp_year) || 2025
          } : {
            brand: 'unknown',
            last4: 'xxxx',
            exp_month: 12,
            exp_year: 2025
          };

          const completionResponse = await api.post('/api/booking/payment/complete', {
            bookingId: booking.id,
            paymentIntentId: paymentResult.paymentIntent.id,
            paymentMethodDetails
          }, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!completionResponse.data.success) {
            throw new Error('Payment succeeded but booking confirmation failed');
          }

          // Success with payment!
          setPaymentSuccess(true);
          setCompletedBooking(booking);
          
          // Show review modal after a short delay
          setTimeout(() => {
            setShowReviewModal(true);
          }, 1500);

        } else {
          // Free booking - already confirmed
          setPaymentSuccess(true);
          setCompletedBooking(booking);
          
          // Show review modal after a short delay
          setTimeout(() => {
            setShowReviewModal(true);
          }, 1500);
        }

      } else {
        throw new Error(reservationResponse.data.message || 'Erreur lors de la création de la réservation');
      }

    } catch (error) {
      console.error('Booking error:', error);
      
      let errorMessage = 'Une erreur est survenue lors de la réservation.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setPaymentError(errorMessage);
      setIsLoading(false);
    }
  };

  // Review modal handlers
  const handleReviewSubmitted = (reviewData) => {
    console.log('Review submitted:', reviewData);
    // Navigate to profile with success message
    navigate('/profile', { 
      state: { 
        message: 'Votre réservation a été confirmée avec succès et votre avis a été publié!',
        bookingId: completedBooking?.id,
        type: 'success'
      } 
    });
  };

  const handleReviewModalClose = () => {
    setShowReviewModal(false);
    // Navigate to profile even if review was skipped
    navigate('/profile', { 
      state: { 
        message: completedBooking?.totalPrice > 0 
          ? 'Votre réservation a été confirmée avec succès et le paiement a été effectué!'
          : 'Votre réservation gratuite a été confirmée avec succès!',
        bookingId: completedBooking?.id,
        type: 'success'
      } 
    });
  };

  const totalPrice = bookingDetails?.totalPrice || (currentBooking.price * parseInt(participants || 1));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Toast */}
        <Toast
          isVisible={paymentSuccess}
          type="success"
          title="Réservation confirmée !"
          message="Votre réservation a été confirmée avec succès. Vous allez être redirigé vers votre profil."
          duration={3000}
          onClose={() => setPaymentSuccess(false)}
        />

        {/* Success State */}
        {paymentSuccess && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-green-900 mb-2">Réservation confirmée !</h1>
            <p className="text-green-700">Vous allez être redirigé vers votre profil...</p>
            <LoadingSpinner className="mt-4 text-green-600" />
          </div>
        )}

        {/* Normal Booking Flow */}
        {!paymentSuccess && (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Réservation</h1>
              <p className="text-gray-600 text-lg">Finalisez votre réservation en quelques étapes</p>
            </div>

            {/* Step Indicator */}
            <StepIndicator currentStep={currentStep} totalSteps={2} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Booking Form */}
              <div className="lg:col-span-2">
                <Card className="shadow-lg border-0">
                  <div className="p-8">
                    <form onSubmit={handleSubmit}>
                      {currentStep === 1 && (
                        <PersonalInfoStep 
                          formData={formData}
                          handleInputChange={handleInputChange}
                          validateStep1={validateStep1}
                          nextStep={nextStep}
                        />
                      )}
                      {currentStep === 2 && (
                        <PaymentStep 
                          paymentError={paymentError}
                          isLoading={isLoading}
                          prevStep={prevStep}
                          totalPrice={totalPrice}
                          schedule={schedule}
                        />
                      )}
                    </form>
                  </div>
                </Card>
              </div>

              {/* Enhanced Booking Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8 shadow-lg border-0">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-900">Résumé de la réservation</h3>
                    
                    {/* Activity Info */}
                    <div className="mb-6">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <StarIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{currentBooking.title}</h4>
                          <p className="text-sm text-gray-600">
                            {type === 'restaurant' ? 'Réservation de table' : 
                             type === 'event' ? 'Billets d\'événement' : 
                             'Réservation d\'activité'}
                          </p>
                          {currentBooking.category && (
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">
                              {currentBooking.category.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <CalendarIcon className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Date</p>
                          <p className="text-sm text-gray-600">
                            {date ? new Date(date).toLocaleDateString('fr-FR', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) : 'Date à confirmer'}
                          </p>
                        </div>
                      </div>
                      
                      {time && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <ClockIcon className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Heure</p>
                            <p className="text-sm text-gray-600">{time}</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <MapPinIcon className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Lieu</p>
                          <p className="text-sm text-gray-600">{currentBooking.location}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <UserIcon className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Participants</p>
                          <p className="text-sm text-gray-600">
                            {participants || bookingDetails?.participants || 1} {
                              type === 'restaurant' ? 'personne(s)' : 
                              type === 'event' ? 'billet(s)' : 
                              'participant(s)'
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Pricing */}
                    {currentBooking.price > 0 && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-6 border border-blue-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-700">Prix unitaire</span>
                          <span className="text-sm font-medium">{currentBooking.price} MAD</span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm text-gray-700">Quantité</span>
                          <span className="text-sm font-medium">{participants || bookingDetails?.participants || 1}</span>
                        </div>
                        <div className="border-t border-blue-200 pt-3">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-blue-900">Total</span>
                            <span className="text-xl font-bold text-blue-900">{totalPrice} MAD</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Security Features */}
                    <div className="bg-green-50 p-4 rounded-lg mb-6 border border-green-200">
                      <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                        <ShieldCheckIcon className="w-4 h-4" />
                        Garanties incluses
                      </h4>
                      <ul className="text-sm text-green-800 space-y-1">
                        <li className="flex items-center gap-2">
                          <CheckCircleIcon className="w-3 h-3" />
                          Annulation gratuite jusqu'à 24h avant
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircleIcon className="w-3 h-3" />
                          Confirmation immédiate par email
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircleIcon className="w-3 h-3" />
                          Paiement 100% sécurisé
                        </li>
                        {schedule && (
                          <li className="flex items-center gap-2">
                            <CheckCircleIcon className="w-3 h-3" />
                            {(schedule.capacity - schedule.bookedSlots)} places disponibles
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Partner Info */}
                    {currentBooking.partner && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Partenaire</h4>
                        <p className="text-sm text-gray-700 mb-2">{currentBooking.partner.company_name || currentBooking.partner.companyName}</p>
                        {currentBooking.partner.website_url && (
                          <a 
                            href={currentBooking.partner.website_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 underline"
                          >
                            Visiter le site web
                          </a>
                        )}
                      </div>
                    )}

                    {/* Warning if no schedule data */}
                    {!schedule && (
                      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <div className="flex items-center gap-2">
                          <ExclamationTriangleIcon className="h-5 w-5 text-orange-600" />
                          <p className="text-sm text-orange-800">
                            Données de réservation incomplètes. Veuillez revenir à la page précédente.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </>
        )}
        
        {/* Review Modal */}
        <ReviewModal
          isOpen={showReviewModal}
          onClose={handleReviewModalClose}
          booking={completedBooking}
          onReviewSubmitted={handleReviewSubmitted}
        />
      </div>
    </div>
  );
};

export default Booking;