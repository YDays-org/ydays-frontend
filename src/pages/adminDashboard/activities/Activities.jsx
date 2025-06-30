import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Modal } from 'antd';
import activitiesData from './activitiesData.json';

const Activities = () => {
  const navigate = useNavigate();
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activities, setActivities] = useState(activitiesData);

  const handleAdd = () => {
    navigate('/admin-dashboard/activities/add');
  };

  const handleEdit = (id) => {
    navigate(`/admin-dashboard/activities/update/${id}`);
  };

  const handleDelete = (activity) => {
    setSelectedActivity(activity);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedActivity) {
      setActivities(prev => prev.filter(a => a.id !== selectedActivity.id));
      alert(`Activité "${selectedActivity.title}" supprimée`);
    }
    setDeleteModalOpen(false);
    setSelectedActivity(null);
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
    setSelectedActivity(null);
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Liste des activités</h2>
          <Button onClick={handleAdd}>Ajouter une activité</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-t">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-2 font-medium">Titre</th>
                <th className="py-3 px-2 font-medium">Catégories</th>
                <th className="py-3 px-2 font-medium">Prix</th>
                <th className="py-3 px-2 font-medium">Durée</th>
                <th className="py-3 px-2 font-medium">Lieu</th>
                <th className="py-3 px-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-2 font-medium"><img 
                      src={activity.img} 
                      alt={activity.title}
                      className="w-16 h-12 object-cover rounded"
                    /> <br />
                    {activity.title}</td>
                  <td className="py-3 px-2 text-sm">{activity.categories.join(', ')}</td>
                  <td className="py-3 px-2 text-sm">{activity.prix.toFixed(2)} €</td>
                  <td className="py-3 px-2 text-sm">{activity.duration}</td>
                  <td className="py-3 px-2 text-sm">{activity.location}</td>
                  <td className="py-3 px-2">
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleView(activity)} 
                        size="sm" 
                        variant="secondary"
                      >
                        Voir
                      </Button>
                      <Button 
                        onClick={() => handleEdit(activity.id)} 
                        size="sm"
                      >
                        Éditer
                      </Button>
                      <Button 
                        onClick={() => handleDelete(activity)} 
                        size="sm" 
                        variant="danger"
                      >
                        Supprimer
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
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
                <img 
                  src={selectedActivity.img} 
                  alt={selectedActivity.title}
                  className="w-32 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{selectedActivity.title}</h3>
                  <p className="text-gray-600 text-sm">{selectedActivity.categories.join(', ')}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-gray-700">{selectedActivity.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Lieu</h4>
                  <p className="text-sm text-gray-600">{selectedActivity.location}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Téléphone</h4>
                  <p className="text-sm text-gray-600">{selectedActivity.phone}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Prix</h4>
                  <p className="text-sm text-gray-600">{selectedActivity.prix.toFixed(2)} €</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Durée</h4>
                  <p className="text-sm text-gray-600">{selectedActivity.duration}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Inclus</h4>
                  <ul className="list-disc ml-5 text-sm text-gray-600">
                    {selectedActivity.inclus.map((item, idx) => <li key={idx}>{item}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Non inclus</h4>
                  <ul className="list-disc ml-5 text-sm text-gray-600">
                    {selectedActivity.nonInclus.map((item, idx) => <li key={idx}>{item}</li>)}
                  </ul>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Programme</h4>
                <div className="space-y-2">
                  {selectedActivity.programme.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                      <div className="font-semibold w-16">{item.heure}</div>
                      <div className="text-sm text-gray-700">{item.activite}</div>
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
          {selectedActivity && (
            <div>
              <p>Êtes-vous sûr de vouloir supprimer l'activité <strong>"{selectedActivity.title}"</strong> ?</p>
              <p className="text-sm text-gray-600 mt-2">Cette action est irréversible.</p>
            </div>
          )}
        </Modal>
      </div>
    </Card>
  );
};

export default Activities; 