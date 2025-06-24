import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { PlusIcon } from '@heroicons/react/24/outline';

const ListingsTab = () => (
  <Card>
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Mes annonces</h2>
          <p className="text-gray-600">Gérez vos activités et événements</p>
        </div>
        <Button variant="primary">
          <PlusIcon className="h-5 w-5 mr-2" />
          Nouvelle annonce
        </Button>
      </div>
      {/* Listings content goes here */}
    </div>
  </Card>
);

export default ListingsTab; 