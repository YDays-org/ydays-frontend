import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Modal } from 'antd';
import api from '../../../services/api';
import { showNotification } from '../../../components/ui/notification';

const Restaurants = () => {
  const navigate = useNavigate();
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [restaurantToDelete, setRestaurantToDelete] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/catalog/listings');
        if (res.data && res.data.data) {
          const filtered = res.data.data.filter(r => r.type === 'restaurant');
          setRestaurants(filtered);
        }
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        setRestaurants([]);
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
    fetchRestaurants();
    fetchCategories();
  }, []);

  // Helper to get category name by id
  const getCategoryName = (id) => {
    const cat = categories.find(c => c.id === (id || Number(id)));
    return cat ? cat.name : 'N/A';
  };

  const handleAdd = () => {
    navigate('/admin-dashboard/restaurants/add');
  };

  const handleEdit = (id) => {
    navigate(`/admin-dashboard/restaurants/update/${id}`);
  };

  const handleDelete = (restaurant) => {
    setRestaurantToDelete(restaurant);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!restaurantToDelete) return;
    const authToken = localStorage.getItem('authToken');
    try {
      await api.delete(`/api/catalog/listings/${restaurantToDelete.id}`, {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });
      setRestaurants(prev => prev.filter(r => r.id !== restaurantToDelete.id));
      showNotification({
        type: 'success',
        message: 'Restaurant supprimé',
        description: `Le restaurant "${restaurantToDelete.title || restaurantToDelete.name}" a été supprimé avec succès.`
      });
    } catch (err) {
      showNotification({
        type: 'error',
        message: 'Erreur',
        description: 'Erreur lors de la suppression du restaurant.'
      });
    }
    setDeleteModalOpen(false);
    setRestaurantToDelete(null);
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
    setRestaurantToDelete(null);
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
                <th className="py-3 px-2 font-medium">Image</th>
                <th className="py-3 px-2 font-medium">Nom</th>
                <th className="py-3 px-2 font-medium">Adresse</th>
                <th className="py-3 px-2 font-medium">Téléphone</th>
                <th className="py-3 px-2 font-medium">Horaires</th>
                <th className="py-3 px-2 font-medium">Spécialité</th>
                <th className="py-3 px-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-6 text-center">Chargement des restaurants...</td>
                </tr>
              ) : restaurants.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-6 text-center">Aucun restaurant trouvé.</td>
                </tr>
              ) : (
                restaurants.map((restaurant) => (
                  <tr key={restaurant.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium">
                      {restaurant.cover_image ? (
                        <img
                          src={restaurant.cover_image.mediaUrl}
                          alt={restaurant.title}
                          className="w-16 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                          Pas d'image
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-2 font-medium">{restaurant.title}</td>
                    <td className="py-3 px-2 text-sm">{restaurant.address}</td>
                    <td className="py-3 px-2 text-sm">{restaurant.phoneNumber || restaurant.phone_number || 'N/A'}</td>
                    <td className="py-3 px-2 text-sm">
                      <div>{restaurant.openingHours?.start || restaurant.opening_hours?.start || 'N/A'} - {restaurant.openingHours?.end || restaurant.opening_hours?.end || 'N/A'}</div>
                      <div className="text-xs text-gray-500">
                        {Array.isArray(restaurant.workingDays || restaurant.working_days) && (restaurant.workingDays || restaurant.working_days).length === 7 ? 'Toute la semaine' : (restaurant.workingDays || restaurant.working_days)?.join(', ')}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm">
                      {getCategoryName(restaurant.categoryId || restaurant.category_id)}
                    </td>
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* View Modal */}
        <Modal
          title={selectedRestaurant ? selectedRestaurant.title : ''}
          open={viewModalOpen}
          onCancel={handleModalClose}
          footer={null}
          width={600}
        >
          {selectedRestaurant && (
            <div className="space-y-4">
              <div className="flex space-x-4">
                {selectedRestaurant.cover_image ? (
                  <img
                    src={selectedRestaurant.cover_image.mediaUrl}
                    alt={selectedRestaurant.title}
                    className="w-32 h-24 object-cover rounded"
                  />
                ) : (
                  <div className="w-32 h-24 bg-gray-200 rounded flex items-center justify-center text-sm text-gray-500">
                    Pas d'image
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{selectedRestaurant.title}</h3>
                  <p className="text-gray-600 text-sm">{getCategoryName(selectedRestaurant.categoryId || selectedRestaurant.category_id)}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-gray-700">{selectedRestaurant.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Adresse</h4>
                  <p className="text-sm text-gray-600">{selectedRestaurant.address}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Téléphone</h4>
                  <p className="text-sm text-gray-600">{selectedRestaurant.phoneNumber || selectedRestaurant.phone_number || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Horaires</h4>
                  <p className="text-sm text-gray-600">
                    {selectedRestaurant.openingHours?.start || selectedRestaurant.opening_hours?.start || 'N/A'} - {selectedRestaurant.openingHours?.end || selectedRestaurant.opening_hours?.end || 'N/A'}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Jours d'ouverture</h4>
                  <p className="text-sm text-gray-600">
                    {(selectedRestaurant.workingDays || selectedRestaurant.working_days)?.join(', ') || 'N/A'}
                  </p>
                </div>
              </div>
              {selectedRestaurant.metadata?.menu && selectedRestaurant.metadata.menu.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Menu</h4>
                  <div className="space-y-2">
                    {selectedRestaurant.metadata.menu.map((item, index) => (
                      <div key={index} className="flex justify-between items-start p-2 bg-gray-50 rounded">
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-600">{item.description}</div>
                        </div>
                        <div className="font-semibold text-green-600">
                          {item.price} MAD
                        </div>
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
          {restaurantToDelete && (
            <div>
              <p>Êtes-vous sûr de vouloir supprimer le restaurant <strong>"{restaurantToDelete.title || restaurantToDelete.name}"</strong> ?</p>
              <p className="text-sm text-gray-600 mt-2">Cette action est irréversible.</p>
            </div>
          )}
        </Modal>
      </div>
    </Card>
  );
};

export default Restaurants; 