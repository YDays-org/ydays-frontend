import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Modal } from 'antd';
import api from '../../../services/api';

const Events = () => {
  const navigate = useNavigate();
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await api.get('/listings?type=EVENT&limit=100');
        if (res.data && res.data.data) {
          setEvents(res.data.data);
        }
      } catch (err) {
        setEvents([]);
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  const handleAdd = () => {
    navigate('/admin-dashboard/events/add');
  };

  const handleEdit = (id) => {
    navigate(`/admin-dashboard/events/update/${id}`);
  };

  const handleDelete = (event) => {
    setSelectedEvent(event);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedEvent) {
      setEvents(prev => prev.filter(e => e.id !== selectedEvent.id));
      alert(`Événement "${selectedEvent.title}" supprimé`);
    }
    setDeleteModalOpen(false);
    setSelectedEvent(null);
  };

  const handleView = (event) => {
    setSelectedEvent(event);
    setViewModalOpen(true);
  };

  const handleModalClose = () => {
    setViewModalOpen(false);
    setSelectedEvent(null);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Liste des événements</h2>
          <Button onClick={handleAdd}>Ajouter un événement</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-t">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-2 font-medium">Titre</th>
                <th className="py-3 px-2 font-medium">Catégories</th>
                <th className="py-3 px-2 font-medium">Jour</th>
                <th className="py-3 px-2 font-medium">Heure</th>
                <th className="py-3 px-2 font-medium">Lieu</th>
                <th className="py-3 px-2 font-medium">Prix</th>
                <th className="py-3 px-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-6 text-center">Chargement des événements...</td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-6 text-center">Aucun événement trouvé.</td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium"><img 
                        src={event.img} 
                        alt={event.title}
                        className="w-16 h-12 object-cover rounded"
                      /> <br />
                      {event.title}</td>
                    <td className="py-3 px-2 text-sm">{event.categories.join(', ')}</td>
                    <td className="py-3 px-2 text-sm">{event.day}</td>
                    <td className="py-3 px-2 text-sm">{event.time}</td>
                    <td className="py-3 px-2 text-sm">{event.location}</td>
                    <td className="py-3 px-2 text-sm">{event.price.toFixed(2)} €</td>
                    <td className="py-3 px-2">
                      <div className="flex space-x-2">
                        <Button 
                          onClick={() => handleView(event)} 
                          size="sm" 
                          variant="secondary"
                        >
                          Voir
                        </Button>
                        <Button 
                          onClick={() => handleEdit(event.id)} 
                          size="sm"
                        >
                          Éditer
                        </Button>
                        <Button 
                          onClick={() => handleDelete(event)} 
                          size="sm" 
                          variant="danger"
                        >
                          Supprimer
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* View Modal */}
        <Modal
          title={selectedEvent ? selectedEvent.title : ''}
          open={viewModalOpen}
          onCancel={handleModalClose}
          footer={null}
          width={600}
        >
          {selectedEvent && (
            <div className="space-y-4">
              <div className="flex space-x-4">
                <img 
                  src={selectedEvent.img} 
                  alt={selectedEvent.title}
                  className="w-32 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{selectedEvent.title}</h3>
                  <p className="text-gray-600 text-sm">{selectedEvent.categories.join(', ')}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-gray-700">{selectedEvent.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Jour</h4>
                  <p className="text-sm text-gray-600">{selectedEvent.day}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Heure</h4>
                  <p className="text-sm text-gray-600">{selectedEvent.time}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Lieu</h4>
                  <p className="text-sm text-gray-600">{selectedEvent.location}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Téléphone</h4>
                  <p className="text-sm text-gray-600">{selectedEvent.phone}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Prix</h4>
                  <p className="text-sm text-gray-600">{selectedEvent.price.toFixed(2)} €</p>
                </div>
                {selectedEvent.website && (
                  <div>
                    <h4 className="font-medium mb-1">Site web</h4>
                    <a href={selectedEvent.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">{selectedEvent.website}</a>
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-medium mb-2">Programme détaillé</h4>
                <div className="space-y-2">
                  {selectedEvent.programme.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                      <div className="font-semibold w-16">{item.heure}</div>
                      <div className="text-sm text-gray-700">{item.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Modal>
        {/* Delete Confirmation Modal */}
        <Modal
          title="Confirmer la suppression"
          open={deleteModalOpen}
          onCancel={handleDeleteModalClose}
          footer={[
            <Button key="cancel" onClick={handleDeleteModalClose}>
              Annuler
            </Button>,
            <Button key="delete" variant="danger" onClick={confirmDelete}>
              Supprimer
            </Button>
          ]}
        >
          {selectedEvent && (
            <div>
              <p>Êtes-vous sûr de vouloir supprimer l'événement <strong>"{selectedEvent.title}"</strong> ?</p>
              <p className="text-sm text-gray-600 mt-2">Cette action est irréversible.</p>
            </div>
          )}
        </Modal>
      </div>
    </Card>
  );
};

export default Events; 