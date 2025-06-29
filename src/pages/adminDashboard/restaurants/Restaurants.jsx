import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Modal } from 'antd';
import restaurantsData from './restaurantsData.json';

const Restaurants = () => {
  const navigate = useNavigate();
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [restaurants, setRestaurants] = useState(restaurantsData);

  const handleAdd = () => {
    navigate('/admin-dashboard/restaurants/add');
  };

  const handleEdit = (id) => {
    navigate(`/admin-dashboard/restaurants/update/${id}`);
  };

  const handleDelete = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedRestaurant) {
      // Remove from local state
      setRestaurants(prev => prev.filter(r => r.id !== selectedRestaurant.id));
      
      // TODO: Send delete request to API
      console.log('Deleting restaurant:', selectedRestaurant.id);
      alert(`Restaurant "${selectedRestaurant.name}" supprimé`);
    }
    setDeleteModalOpen(false);
    setSelectedRestaurant(null);
  };

  const handleView = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setViewModalOpen(true);
  };

  const handleModalClose = () => {
    setViewModalOpen(false);
    setSelectedRestaurant(null);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setSelectedRestaurant(null);
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Liste des restaurants</h2>
          <Button onClick={handleAdd}>Ajouter un restaurant</Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-t">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-2 font-medium">Nom</th>
                <th className="py-3 px-2 font-medium">Adresse</th>
                <th className="py-3 px-2 font-medium">Téléphone</th>
                <th className="py-3 px-2 font-medium">Horaires</th>
                <th className="py-3 px-2 font-medium">Spécialité</th>
                <th className="py-3 px-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((restaurant) => (
                <tr key={restaurant.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-2 font-medium"><img 
                      src={restaurant.img} 
                      alt={restaurant.name}
                      className="w-16 h-12 object-cover rounded"
                    /> <br />
                    {restaurant.name}</td>
                  <td className="py-3 px-2 text-sm">{restaurant.location}</td>
                  <td className="py-3 px-2 text-sm">{restaurant.phone}</td>
                  <td className="py-3 px-2 text-sm">
                    <div>{restaurant.openAt} - {restaurant.closeAt}</div>
                    <div className="text-xs text-gray-500">
                      {restaurant.workingDays.length === 7 ? 'Toute la semaine' : restaurant.workingDays.join(', ')}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-sm">{restaurant.specialite}</td>
                  <td className="py-3 px-2">
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleView(restaurant)} 
                        size="sm" 
                        variant="secondary"
                      >
                        Voir
                      </Button>
                      <Button 
                        onClick={() => handleEdit(restaurant.id)} 
                        size="sm"
                      >
                        Éditer
                      </Button>
                      <Button 
                        onClick={() => handleDelete(restaurant)} 
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
          title={selectedRestaurant ? selectedRestaurant.name : ''}
          open={viewModalOpen}
          onCancel={handleModalClose}
          footer={null}
          width={600}
        >
          {selectedRestaurant && (
            <div className="space-y-4">
              <div className="flex space-x-4">
                <img 
                  src={selectedRestaurant.img} 
                  alt={selectedRestaurant.name}
                  className="w-32 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{selectedRestaurant.name}</h3>
                  <p className="text-gray-600 text-sm">{selectedRestaurant.specialite}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-gray-700">{selectedRestaurant.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Adresse</h4>
                  <p className="text-sm text-gray-600">{selectedRestaurant.location}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Téléphone</h4>
                  <p className="text-sm text-gray-600">{selectedRestaurant.phone}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Horaires</h4>
                  <p className="text-sm text-gray-600">
                    {selectedRestaurant.openAt} - {selectedRestaurant.closeAt}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Jours d'ouverture</h4>
                  <p className="text-sm text-gray-600">
                    {selectedRestaurant.workingDays.join(', ')}
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Menu</h4>
                <div className="space-y-2">
                  {selectedRestaurant.menu.map((item, index) => (
                    <div key={index} className="flex justify-between items-start p-2 bg-gray-50 rounded">
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-600">{item.description}</div>
                      </div>
                      <div className="font-semibold text-green-600">
                        {item.price.toFixed(2)} €
                      </div>
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
          {selectedRestaurant && (
            <div>
              <p>Êtes-vous sûr de vouloir supprimer le restaurant <strong>"{selectedRestaurant.name}"</strong> ?</p>
              <p className="text-sm text-gray-600 mt-2">Cette action est irréversible.</p>
            </div>
          )}
        </Modal>
      </div>
    </Card>
  );
};

export default Restaurants; 