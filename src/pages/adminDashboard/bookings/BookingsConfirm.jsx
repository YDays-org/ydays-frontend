import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Example data (should be synced with BookingsTab in a real app)
const initialBookings = [
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
];

// Simple Modal component
const Modal = ({ open, onClose, onConfirm, title, message, confirmLabel, confirmVariant }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Annuler</Button>
          <Button variant={confirmVariant} onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
};

const BookingsConfirm = () => {
  const [bookings, setBookings] = useState(initialBookings);
  const [modal, setModal] = useState({ open: false, action: null, bookingId: null });
  const navigate = useNavigate();

  const openModal = (action, bookingId) => {
    setModal({ open: true, action, bookingId });
  };

  const closeModal = () => {
    setModal({ open: false, action: null, bookingId: null });
  };

  const handleAction = () => {
    if (modal.action && modal.bookingId != null) {
      setBookings(prev => prev.filter(b => b.id !== modal.bookingId));
    }
    closeModal();
  };

  const getModalContent = () => {
    switch (modal.action) {
      case 'confirm':
        return {
          title: 'Confirmer la réservation',
          message: 'Êtes-vous sûr de vouloir confirmer cette réservation ?',
          confirmLabel: 'Confirmer',
          confirmVariant: 'success',
        };
      case 'refuse':
        return {
          title: 'Refuser la réservation',
          message: 'Êtes-vous sûr de vouloir refuser cette réservation ?',
          confirmLabel: 'Refuser',
          confirmVariant: 'danger',
        };
      default:
        return {};
    }
  };

  const modalContent = getModalContent();

  return (
    <Card>
      <div className="p-6 bg-gray-50 min-h-[60vh] rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Réservations à confirmer</h2>
          <Button onClick={() => navigate(-1)} variant="secondary">← Retour</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-t">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-2 font-medium">Nom</th>
                <th className="py-3 px-2 font-medium">Catégorie</th>
                <th className="py-3 px-2 font-medium">Contact</th>
                <th className="py-3 px-2 font-medium">Payé</th>
                <th className="py-3 px-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? bookings.map((booking) => (
                <tr key={booking.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-2 font-medium">{booking.name}</td>
                  <td className="py-3 px-2 text-sm capitalize">{booking.category}</td>
                  <td className="py-3 px-2 text-sm">
                    {booking.phone} <br />
                    {booking.email}
                  </td>
                  <td className="py-3 px-2 text-sm">
                    {booking.paid ? (
                      <span className="text-green-600 font-semibold">Oui</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Non</span>
                    )}
                  </td>
                  <td className="py-3 px-2 flex gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      className="font-bold shadow"
                      onClick={() => openModal('confirm', booking.id)}
                    >
                      Confirmer
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => openModal('refuse', booking.id)}
                    >
                      Refuser
                    </Button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-500">Aucune réservation à confirmer.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Modal
          open={modal.open}
          onClose={closeModal}
          onConfirm={handleAction}
          title={modalContent.title}
          message={modalContent.message}
          confirmLabel={modalContent.confirmLabel}
          confirmVariant={modalContent.confirmVariant}
        />
      </div>
    </Card>
  );
};

export default BookingsConfirm; 