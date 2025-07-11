import { ChartBarIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import Button from '../../../components/ui/Button';

const Header = ({ onLogout }) => (
  <header className="bg-white shadow-sm border-b">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <ChartBarIcon className="h-8 w-8 text-primary-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Espace Administrateur</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez vos activités, réservations et annonces en toute simplicité</p>
        </div>
      </div>
      {/* Logout Button */}
      <div className="mt-4 sm:mt-0">
        <Button
          className="bg-red-500 text-white hover:bg-red-600"
          onClick={onLogout}
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
          Se déconnecter
        </Button>
      </div>
    </div>
  </header>
);

export default Header; 