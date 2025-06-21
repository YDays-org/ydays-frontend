import { Link } from 'react-router-dom';
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-6xl font-bold text-primary-600 mb-4">404</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Page non trouvée</h1>
          <p className="text-gray-600 mb-8">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>

        <div className="space-y-4">
          <Link to="/">
            <Button className="w-full">
              <HomeIcon className="h-5 w-5 mr-2" />
              Retour à l'accueil
            </Button>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Page précédente
          </button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Si vous pensez qu'il s'agit d'une erreur, contactez-nous à</p>
          <a href="mailto:support@casablanca-decouvertes.ma" className="text-primary-600 hover:text-primary-500">
            support@casablanca-decouvertes.ma
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 