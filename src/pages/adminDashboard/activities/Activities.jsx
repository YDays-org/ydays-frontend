import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { showNotification } from '../../../components/ui/notification';
import api from '../../../services/api';


const Activities = () => {
  const navigate = useNavigate();
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/catalog/listings');
        if (res.data && res.data.data) {
          // just how has type : 'event' in the database
          const filteredEvents = res.data.data.filter(event => event.type === 'activity');
          setActivities(filteredEvents);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setActivities([]);
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
    navigate('/admin-dashboard/activities/add');
  };

  const handleEdit = (id) => {
    navigate(`/admin-dashboard/activities/update/${id}`);
  };

  const handleDelete = (activity) => {
    setActivityToDelete(activity);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    
    if (!activityToDelete) return;
    console.log("dd");
    const authToken = localStorage.getItem('authToken');
    try {
      await api.delete(`/api/catalog/listings/${activityToDelete.id}`, {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });
      setActivities(prev => prev.filter(e => e.id !== activityToDelete.id));
      showNotification({
        type: 'success',
        message: 'Activité supprimé',
        description: `L'activité "${activityToDelete.title}" a été supprimé avec succès.`
      });
    } catch (err) {
      showNotification({
        type: 'error',
        message: 'Erreur',
        description: 'Erreur lors de la suppression de l\'activité.'
      });
    }
    setDeleteModalOpen(false);
    setActivityToDelete(null);
  };

  const handleView = (activity) => {
    setSelectedActivity(activity);
    setViewModalOpen(true);
  };

  const handleModalClose = () => {
    setViewModalOpen(false);
    setSelectedActivity(null);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setActivityToDelete(null);
  };

  const formatScheduleDisplay = (schedule) => {
    const date = new Date(schedule.date);
    const options = { month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return `${date.toLocaleDateString('fr-FR', options)}`;
  };

  const formatPrice = (price) => {
    return `${price.toFixed(2)} €`;
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Liste des activités</h2>
          <Button onClick={handleAdd}>Ajouter un activité</Button>
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
                  <td colSpan="9" className="py-6 text-center">Chargement des activités...</td>
                </tr>
              ) : activities.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-6 text-center">Aucun activité trouvé.</td>
                </tr>
              ) : (
                activities.map((activ) => (
                  <tr key={activ.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-2">
                      {activ.cover_image ? (
                        <img
                          src={activ.cover_image.mediaUrl}
                          alt={activ.title}
                          className="w-16 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                          Pas d'image
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-2 font-medium">{activ.title}</td>
                    <td className="py-3 px-2 text-sm">{getCategoryName(activ.categoryId || activ.category_id)}</td>
                    <td className="py-3 px-2 text-sm"><b>{activ.working_days?.join(', ') || 'N/A'}</b> à <b>{activ.opening_hours?.start || 'N/A'}</b></td>
                    <td className="py-3 px-2 text-sm">{activ.address}</td>
                    <td className="py-3 px-2 text-sm">{activ.metadata?.price ? `${activ.metadata.price} MAD` : 'N/A'}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded text-xs ${activ.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {activ.status}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleView(activ)}
                          size="sm"
                          variant="secondary"
                        >
                          Voir
                        </Button>
                        <Button
                          onClick={() => handleEdit(activ.id)}
                          size="sm"
                        >
                          Éditer
                        </Button>
                        <Button
                          onClick={() => handleDelete(activ)}
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
          title={selectedActivity ? selectedActivity.title : ''}
          open={viewModalOpen}
          onCancel={handleModalClose}
          footer={null}
          width={600}
        >
          {selectedActivity && (
            <div className="space-y-4">
              <div className="flex space-x-4">
                {selectedActivity.cover_image ? (
                  <img
                    src={selectedActivity.cover_image.mediaUrl}
                    alt={selectedActivity.title}
                    className="w-32 h-24 object-cover rounded"
                  />
                ) : (
                  <div className="w-32 h-24 bg-gray-200 rounded flex items-center justify-center text-sm text-gray-500">
                    Pas d'image
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{selectedActivity.title}</h3>
                  <p className="text-gray-600 text-sm">Catégorie: {getCategoryName(selectedActivity.categoryId || selectedActivity.category_id)}</p>
                  <p className="text-gray-600 text-sm">Statut: {selectedActivity.status}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-gray-700">{selectedActivity.description}</p>
              </div>
              {/* Tarifs et disponibilités Section */}
              {selectedActivity.schedules && selectedActivity.schedules.length > 0 && (
                <Card className="p-8 shadow-sm border-0 bg-white/80 backdrop-blur-sm">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <CurrencyDollarIcon className="h-6 w-6 mr-2 text-green-600" />
                    Tarifs et disponibilités
                  </h2>
                  <div className="space-y-4">
                    {selectedActivity.schedules.map((schedule) => {
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
                              Capacité: {schedule.capacity} personnes • Disponible: {schedule.capacity - (schedule.bookedSlots || 0)} places
                            </p>
                          </div>
                          <span className="font-medium text-primary-600">{formatPrice(schedule.price)}</span>
                        </button>
                      );
                    })}
                  </div>
                </Card>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Jour(s)</h4>
                  <p className="text-sm text-gray-600">{selectedActivity.working_days?.join(', ') || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Heure</h4>
                  <p className="text-sm text-gray-600">{selectedActivity.opening_hours?.start || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Lieu</h4>
                  <p className="text-sm text-gray-600">{selectedActivity.address}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Téléphone</h4>
                  <p className="text-sm text-gray-600">{selectedActivity.phone_number || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Prix</h4>
                  <p className="text-sm text-gray-600">
                    {selectedActivity.metadata?.price ? `${selectedActivity.metadata.price} MAD` : 'N/A'}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Capacité</h4>
                  <p className="text-sm text-gray-600">
                    {selectedActivity?.capacity ? `${selectedActivity.capacity} personnes` : 'N/A'}
                  </p>
                </div>
                {selectedActivity.website_url && (
                  <div>
                    <h4 className="font-medium mb-1">Site web</h4>
                    <a href={selectedActivity.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">{selectedActivity.website_url}</a>
                  </div>
                )}
              </div>
              {selectedActivity.metadata?.programme && selectedActivity.metadata.programme.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Programme détaillé</h4>
                  <div className="space-y-2">
                    {selectedActivity.metadata.programme.map((item, index) => (
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
          {activityToDelete && (
            <div>
              <p>Êtes-vous sûr de vouloir supprimer l'activité <strong>"{activityToDelete.title}"</strong> ?</p>
              <p className="text-sm text-gray-600 mt-2">Cette action est irréversible.</p>
            </div>
          )}
        </Modal>
      </div>
    </Card>
  );
};

export default Activities; 