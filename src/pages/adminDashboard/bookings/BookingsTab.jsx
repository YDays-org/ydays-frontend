import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../../../services/bookingService';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

const BookingsTab = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('active');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBookings() {
      setLoading(true);
      try {
        const { data } = await bookingService.getAllReservations();
        setBookings(
          data.map(b => ({
            id: b.id,
            name: b.user?.fullName || 'N/A',
            category: b.listing?.title || 'N/A',
            phone: b.user?.phone || '',
            email: b.user?.email || '',
            paid: b.status === 'confirmed' || b.status === 'completed',
            needsConfirmation: b.status === 'awaiting_payment',
            archived: false, // You can implement archiving logic if needed
          }))
        );
      } catch (err) {
        setBookings([]);
      }
      setLoading(false);
    }
    fetchBookings();
  }, []);

  const handleArchive = (id) => {
    setBookings(prev =>
      prev.map(b =>
        b.id === id
          ? { ...b, archived: true, needsConfirmation: false }
          : b
      )
    );
  };

  const handleUnarchive = (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, archived: false } : b));
  };

  const bookingsToShow = bookings.filter(b =>
    selectedTab === 'active'
      ? !b.archived && !b.needsConfirmation
      : b.archived
  );

  const needsConfirmationCount = bookings.filter(b => b.needsConfirmation && !b.archived).length;

  return (
    <Card>
      <div className="p-6">
        {/* Tabs */}
        <div className="flex gap-4 mb-4 border-b">
          <button
            className={`py-2 px-4 font-semibold border-b-2 transition-colors ${selectedTab === 'active' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}`}
            onClick={() => setSelectedTab('active')}
          >
            Actives
          </button>
          <button
            className={`py-2 px-4 font-semibold border-b-2 transition-colors ${selectedTab === 'archived' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}`}
            onClick={() => setSelectedTab('archived')}
          >
            Archivées
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-t">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-2 font-medium">Nom</th>
                  <th className="py-3 px-2 font-medium">Event</th>
                  <th className="py-3 px-2 font-medium">Contact</th>
                  <th className="py-3 px-2 font-medium">Payé</th>
                  {selectedTab === 'active' && <th className="py-3 px-2 font-medium">Archiver</th>}
                  {selectedTab === 'archived' && <th className="py-3 px-2 font-medium">Rendre actif</th>}
                </tr>
              </thead>
              <tbody>
                {bookingsToShow.map((booking) => (
                  <tr key={booking.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium">{booking.name}</td>
                    <td className="py-3 px-2 text-sm capitalize">{booking.category}</td>
                    <td className="py-3 px-2 text-sm">{booking.email}</td>
                    <td className="py-3 px-2 text-sm">
                      {booking.paid ? (
                        <span className="text-green-600 font-semibold">Oui</span>
                      ) : (
                        <span className="text-red-600 font-semibold">Non</span>
                      )}
                    </td>
                    {selectedTab === 'active' && (
                      <td className="py-3 px-2">
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleArchive(booking.id)}
                        >
                          Archiver
                        </Button>
                      </td>
                    )}
                    {selectedTab === 'archived' && (
                      <td className="py-3 px-2">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleUnarchive(booking.id)}
                        >
                          Rendre actif
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
                {bookingsToShow.length === 0 && !loading && (
                  <tr>
                    <td colSpan={selectedTab === 'active' ? 6 : 5} className="py-6 text-center text-gray-500">
                      Aucune réservation à afficher.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  );
};

export default BookingsTab; 