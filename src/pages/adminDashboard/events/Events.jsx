import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Modal } from 'antd';
import api from '../../../services/api';
import { showNotification } from '../../../components/ui/notification';

const Events = () => {
  const navigate = useNavigate();
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/catalog/listings');
        if (res.data && res.data.data) {
          // just how has type : 'event' in the database
          const filteredEvents = res.data.data.filter(event => event.type === 'event');
          setEvents(filteredEvents);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setEvents([]);
      }
      setLoading(false);
    };
    const fetchCategories = async () => {
      try {
        const res = await api.get('/api/catalog/categories');
        if (res.data && res.data.data) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategories([]);
      }
    };
    fetchEvents();
    fetchCategories();
  }, []);

  // Helper to get category name by id
  const getCategoryName = (id) => {
    const cat = categories.find(c => c.id === (id || Number(id)));
    return cat ? cat.name : 'N/A';
  };

  const handleAdd = () => {
    navigate('/admin-dashboard/events/add');
  };

  const handleEdit = (id) => {
    navigate(`/admin-dashboard/events/update/${id}`);
  };

  const handleDelete = (event) => {
    setEventToDelete(event);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;
    const authToken = localStorage.getItem('authToken');
    try {
      await api.delete(`/api/catalog/listings/${eventToDelete.id}`, {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });
      setEvents(prev => prev.filter(e => e.id !== eventToDelete.id));
      showNotification({
        type: 'success',
        message: 'Événement supprimé',
        description: `L'événement "${eventToDelete.title}" a été supprimé avec succès.`
      });
    } catch (err) {
      showNotification({
        type: 'error',
        message: 'Erreur',
        description: 'Erreur lors de la suppression de l\'événement.'
      });
    }
    setDeleteModalOpen(false);
    setEventToDelete(null);
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
    setEventToDelete(null);
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
                <th className="py-3 px-2 font-medium">Image</th>
                <th className="py-3 px-2 font-medium">Titre</th>
                <th className="py-3 px-2 font-medium">Catégorie</th>
                <th className="py-3 px-2 font-medium">Jour/Heure</th>
                <th className="py-3 px-2 font-medium">Lieu</th>
                <th className="py-3 px-2 font-medium">Prix</th>
                <th className="py-3 px-2 font-medium">Statut</th>
                <th className="py-3 px-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-6 text-center">Chargement des événements...</td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-6 text-center">Aucun événement trouvé.</td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-2">
                      {event.cover_image ? (
                        <img
                          src={event.cover_image.mediaUrl}
                          alt={event.title}
                          className="w-16 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                          Pas d'image
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-2 font-medium">{event.title}</td>
                    <td className="py-3 px-2 text-sm">{getCategoryName(event.categoryId || event.category_id)}</td>
                    <td className="py-3 px-2 text-sm"><b>{event.working_days?.join(', ') || 'N/A'}</b> à <b>{event.opening_hours?.start || 'N/A'}</b></td>
                    <td className="py-3 px-2 text-sm">{event.address}</td>
                    <td className="py-3 px-2 text-sm">{event.metadata?.price ? `${event.metadata.price} MAD` : 'N/A'}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded text-xs ${event.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {event.status}
                      </span>
                    </td>
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
                {selectedEvent.cover_image ? (
                  <img
                    src={selectedEvent.cover_image.mediaUrl}
                    alt={selectedEvent.title}
                    className="w-32 h-24 object-cover rounded"
                  />
                ) : (
                  <div className="w-32 h-24 bg-gray-200 rounded flex items-center justify-center text-sm text-gray-500">
                    Pas d'image
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{selectedEvent.title}</h3>
                  <p className="text-gray-600 text-sm">{getCategoryName(selectedEvent.categoryId || selectedEvent.category_id)}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-gray-700">{selectedEvent.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Jour(s)</h4>
                  <p className="text-sm text-gray-600">{selectedEvent.working_days?.join(', ') || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Heure</h4>
                  <p className="text-sm text-gray-600">{selectedEvent.opening_hours?.start || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Lieu</h4>
                  <p className="text-sm text-gray-600">{selectedEvent.address}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Téléphone</h4>
                  <p className="text-sm text-gray-600">{selectedEvent.phone_number || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Prix</h4>
                  <p className="text-sm text-gray-600">
                    {selectedEvent.metadata?.price ? `${selectedEvent.metadata.price} MAD` : 'N/A'}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Capacité</h4>
                  <p className="text-sm text-gray-600">
                    {selectedEvent.metadata?.capacity ? `${selectedEvent.metadata.capacity} personnes` : 'N/A'}
                  </p>
                </div>
                {selectedEvent.website_url && (
                  <div>
                    <h4 className="font-medium mb-1">Site web</h4>
                    <a href={selectedEvent.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">{selectedEvent.website_url}</a>
                  </div>
                )}
                <div>
                  <h4 className="font-medium mb-1">Note moyenne</h4>
                  <p className="text-sm text-gray-600">{selectedEvent.average_rating || 0}/5 ({selectedEvent.review_count || 0} avis)</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Catégorie</h4>
                  <p className="text-sm text-gray-600">Catégorie: {getCategoryName(selectedEvent.categoryId || selectedEvent.category_id)}</p>
                </div>
              </div>
              {selectedEvent.metadata?.programme && selectedEvent.metadata.programme.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Programme détaillé</h4>
                  <div className="space-y-2">
                    {selectedEvent.metadata.programme.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                        <div className="font-semibold w-16">{item.time}</div>
                        <div className="text-sm text-gray-700">{item.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
          {eventToDelete && (
            <div>
              <p>Êtes-vous sûr de vouloir supprimer l'événement <strong>"{eventToDelete.title}"</strong> ?</p>
              <p className="text-sm text-gray-600 mt-2">Cette action est irréversible.</p>
            </div>
          )}
        </Modal>
      </div>
    </Card>
  );
};

export default Events; 