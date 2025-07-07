import { useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { CalendarIcon, ClockIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import api from '../services/api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'fallback_publishable_key');

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
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const stripe = useStripe();
  const elements = useElements();

  // Get booking details from URL params
  const date = searchParams.get('date');
  const time = searchParams.get('time');
  const participants = searchParams.get('participants') || searchParams.get('tickets') || searchParams.get('guests');
console.log('Booking type:', type, 'ID:', id, 'Date:', date, 'Time:', time, 'Participants:', participants);
  // Mock data based on booking type
  const bookingDetails = {
    activity: {
      title: 'Visite de la Médina',
      price: 150,
      duration: '3 heures',
      location: 'Médina, Casablanca'
    },
    event: {
      title: 'Festival de Musique Gnaoua',
      price: 200,
      duration: '4 heures',
      location: 'Place Mohammed V, Casablanca'
    },
    restaurant: {
      title: 'Le Riad',
      price: 0, // Restaurant booking is usually free
      duration: '2 heures',
      location: 'Médina, Casablanca'
    }
  };

  const currentBooking = bookingDetails[type] || bookingDetails.activity;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setPaymentError('');

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Vous devez être connecté pour effectuer un paiement.');
      setIsLoading(false);
      return;
    }

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    try {
      const totalAmount = Math.round(totalPrice * 100);
      // Step 1: Create a payment intent
      const paymentResponse = await api.post('/api/booking/payment', {
        amount: totalAmount, // Amount in cents
        currency: 'mad', // Moroccan Dirham
      });

      const { clientSecret } = paymentResponse.data;

      // Step 2: Confirm payment
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (paymentResult.error) {
        console.error(paymentResult.error);
        setPaymentError('Le paiement a échoué. Veuillez vérifier vos informations de paiement.');
        setIsLoading(false);
        return;
      }

      // Step 3: Create reservation
      await api.post('/api/booking/reservations', {
        scheduleId: id,
        numParticipants: participants,
      });

      alert('Réservation créée avec succès !');
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      alert('Une erreur est survenue lors du processus de réservation.');
      setIsLoading(false);
    }
  };

  const totalPrice = currentBooking.price * parseInt(participants || 1);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Finaliser votre réservation</h1>
          <p className="text-gray-600">Remplissez vos informations pour confirmer votre réservation</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">Informations personnelles</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Demandes spéciales
                    </label>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      rows={4}
                      className="input-field"
                      placeholder="Toute demande spéciale ou information supplémentaire..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Informations de paiement *
                    </label>
                    <div className="border rounded-md p-3 bg-white shadow-sm">
                      <CardElement
                        className="input-field"
                        options={{
                          style: {
                            base: {
                              fontSize: '16px',
                              color: '#32325d',
                              fontFamily: 'Arial, sans-serif',
                              '::placeholder': {
                                color: '#aab7c4',
                              },
                            },
                            invalid: {
                              color: '#fa755a',
                              iconColor: '#fa755a',
                            },
                          },
                        }}
                      />
                    </div>
                  </div>

                  <div className="text-red-500 text-sm mt-2" id="payment-error">{paymentError}</div>

                  <div className="flex items-center justify-between pt-6 border-t">
                    <Link to={`/${type}/${id}`}>
                      <Button variant="outline" type="button">
                        Retour
                      </Button>
                    </Link>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="min-w-[150px]"
                    >
                      {isLoading ? 'Confirmation...' : 'Confirmer la réservation'}
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Résumé de la réservation</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">{currentBooking.title}</h4>
                    <p className="text-sm text-gray-600">{type === 'restaurant' ? 'Réservation de table' : type === 'event' ? 'Billets d\'événement' : 'Réservation d\'activité'}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        {date ? new Date(date).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'Date à confirmer'}
                      </span>
                    </div>
                    
                    {time && (
                      <div className="flex items-center text-gray-600">
                        <ClockIcon className="h-4 w-4 mr-2" />
                        <span className="text-sm">{time}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-gray-600">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      <span className="text-sm">{currentBooking.location}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <UserIcon className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        {participants} {type === 'restaurant' ? 'personne(s)' : type === 'event' ? 'billet(s)' : 'participant(s)'}
                      </span>
                    </div>
                  </div>

                  {currentBooking.price > 0 && (
                    <div className="border-t pt-4">
                      <div className="flex justify-between mb-2">
                        <span>Prix unitaire</span>
                        <span>{currentBooking.price} MAD</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Quantité</span>
                        <span>{participants}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total</span>
                          <span>{totalPrice} MAD</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Informations importantes</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Annulation gratuite jusqu'à 24h avant</li>
                      <li>• Confirmation par email</li>
                      <li>• Paiement sécurisé</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;