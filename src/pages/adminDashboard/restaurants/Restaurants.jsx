import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Modal } from 'antd';

const mockRestaurants = [
  { id: 1, name: 'Le Gourmet', address: '123 Rue de Paris', phone: '0123456789' },
  { id: 2, name: 'Pizza Bella', address: '456 Avenue de Lyon', phone: '0987654321' },
  { id: 3, name: 'Sushi Zen', address: '789 Boulevard de Nice', phone: '0678901234' },
];

const Restaurants = () => {
  const navigate = useNavigate();
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const handleAdd = () => {
    navigate('/admin-dashboard/restaurants/add');
  };

  const handleEdit = (id) => {
    navigate(`/admin-dashboard/restaurants/update/${id}`);
  };

  const handleDelete = (id) => {
    // TODO: handle delete logic
    alert(`Delete restaurant with id: ${id}`);
  };

  const handleView = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setViewModalOpen(true);
  };

  const handleModalClose = () => {
    setViewModalOpen(false);
    setSelectedRestaurant(null);
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Liste des restaurants</h2>
          <Button onClick={handleAdd}>Ajouter un restaurant</Button>
        </div>
        <table className="w-full text-left border-t">
          <thead>
            <tr>
              <th className="py-2">Nom</th>
              <th className="py-2">Adresse</th>
              <th className="py-2">Téléphone</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockRestaurants.map((restaurant) => (
              <tr key={restaurant.id} className="border-t">
                <td className="py-2">{restaurant.name}</td>
                <td className="py-2">{restaurant.address}</td>
                <td className="py-2">{restaurant.phone}</td>
                <td className="py-2 space-x-2">
                  <Button onClick={() => handleView(restaurant)} size="sm" variant="secondary">Voir</Button>
                  <Button onClick={() => handleEdit(restaurant.id)} size="sm">Éditer</Button>
                  <Button onClick={() => handleDelete(restaurant.id)} size="sm" variant="danger">Supprimer</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Modal
          title={selectedRestaurant ? selectedRestaurant.name : ''}
          open={viewModalOpen}
          onCancel={handleModalClose}
          footer={null}
        >
          {selectedRestaurant && (
            <div>
              <p><strong>Adresse:</strong> {selectedRestaurant.address}</p>
              <p><strong>Téléphone:</strong> {selectedRestaurant.phone}</p>
            </div>
          )}
        </Modal>
      </div>
    </Card>
  );
};

export default Restaurants; 