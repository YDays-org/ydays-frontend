import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Example data
const initialBookings = [
  {
    id: 1,
    name: 'Alice Dupont',
    category: 'event',
    phone: '+33 6 12 34 56 78',
    email: 'alice@example.com',
    paid: true,
    needsConfirmation: false,
    archived: false,
  },
  {
    id: 2,
    name: 'Bob Martin',
    category: 'restaurant',
    phone: '+33 7 98 76 54 32',
    email: 'bob@example.com',
    paid: false,
    needsConfirmation: true,
    archived: false,
  },
  {
    id: 3,
    name: 'Claire Bernard',
    category: 'activity',
    phone: '+33 6 22 33 44 55',
    email: 'claire@example.com',
    paid: true,
    needsConfirmation: false,
    archived: false,
  },
];

const BookingsTab = () => {
  const [bookings, setBookings] = useState(initialBookings);
  const [selectedTab, setSelectedTab] = useState('active'); // 'active' or 'archived'
  const navigate = useNavigate();

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

  const handleGoToConfirm = () => {
    navigate('/admin-dashboard/bookings/confirm');
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Réservations</h2>
          <Button onClick={handleGoToConfirm} variant="secondary">
            Réservations à confirmer
            {needsConfirmationCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                {needsConfirmationCount}
              </span>
            )}
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-t">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-2 font-medium">Nom</th>
                <th className="py-3 px-2 font-medium">Catégorie</th>
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
                  <td className="py-3 px-2 text-sm">
                    {booking.phone}<br />{booking.email}
                  </td>
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
              {bookingsToShow.length === 0 && (
                <tr>
                  <td colSpan={selectedTab === 'active' ? 6 : 5} className="py-6 text-center text-gray-500">
                    Aucune réservation à afficher.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
};

export default BookingsTab; 