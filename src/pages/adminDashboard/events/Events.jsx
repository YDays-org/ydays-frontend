import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Modal } from 'antd';

const mockEvents = [
  { id: 1, name: 'Le Gourmet', address: '123 Rue de Paris', phone: '0123456789' },
  { id: 2, name: 'Pizza Bella', address: '456 Avenue de Lyon', phone: '0987654321' },
  { id: 3, name: 'Sushi Zen', address: '789 Boulevard de Nice', phone: '0678901234' },
];

const Events = () => {
  const navigate = useNavigate();
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleAdd = () => {
    navigate('/admin-dashboard/events/add');
  };

  const handleEdit = (id) => {
    navigate(`/admin-dashboard/events/update/${id}`);
  };

  const handleDelete = (id) => {
    // TODO: handle delete logic
    alert(`Delete event with id: ${id}`);
  };

  const handleView = (event) => {
    setSelectedEvent(event);
    setViewModalOpen(true);
  };

  const handleModalClose = () => {
    setViewModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Liste des events</h2>
          <Button onClick={handleAdd}>Ajouter un event</Button>
        </div>
        <table className="w-full text-left border-t">
          <thead>
            <tr>
              <th className="py-2">Nom</th>
              <th className="py-2">Adresse</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockEvents.map((event) => (
              <tr key={event.id} className="border-t">
                <td className="py-2">{event.name}</td>
                <td className="py-2">{event.address}</td>
                <td className="py-2 space-x-2">
                  <Button onClick={() => handleView(event)} size="sm" variant="secondary">Voir</Button>
                  <Button onClick={() => handleEdit(event.id)} size="sm">Editer</Button>
                  <Button onClick={() => handleDelete(event.id)} size="sm" variant="danger">Supprimer</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Modal
          title={selectedEvent ? selectedEvent.name : ''}
          open={viewModalOpen}
          onCancel={handleModalClose}
          footer={null}
        >
          {selectedEvent && (
            <div>
              <p><strong>Adresse:</strong> {selectedEvent.address}</p>
            </div>
          )}
        </Modal>
      </div>
    </Card>
  );
};

export default Events;
