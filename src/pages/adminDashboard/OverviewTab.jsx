import Card from '../../components/ui/Card';
import { CalendarIcon, ChartBarIcon, StarIcon, PlusIcon } from '@heroicons/react/24/outline';

const stats = {
  totalBookings: 120,
  totalRevenue: 35000,
  averageRating: 4.7,
  activeListings: 15,
};

const recentBookings = [
  {
    id: 1,
    activity: 'Randonnée dans l’Atlas',
    customer: 'Alice Dupont',
    date: '2024-06-01',
    status: 'confirmed',
    amount: 500,
  },
  {
    id: 2,
    activity: 'Visite guidée de Marrakech',
    customer: 'Jean Martin',
    date: '2024-06-02',
    status: 'pending',
    amount: 300,
  },
  {
    id: 3,
    activity: 'Cours de cuisine marocaine',
    customer: 'Fatima Zahra',
    date: '2024-06-03',
    status: 'confirmed',
    amount: 400,
  },
];

const OverviewTab = () => (
  <div className="space-y-6">
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <div className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Réservations totales</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalBookings || 0}</p>
            </div>
          </div>
        </div>
      </Card>
      <Card>
        <div className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenus totaux</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalRevenue || 0} MAD</p>
            </div>
          </div>
        </div>
      </Card>
      <Card>
        <div className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <StarIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Note moyenne</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.averageRating || 0}</p>
            </div>
          </div>
        </div>
      </Card>
      <Card>
        <div className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <PlusIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Annonces actives</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeListings || 0}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
    {/* Recent Bookings */}
    <Card>
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Réservations récentes</h2>
        <div className="space-y-4">
          {recentBookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{booking.activity}</h3>
                <p className="text-sm text-gray-600">{booking.customer}</p>
                <p className="text-sm text-gray-500">{new Date(booking.date).toLocaleDateString('fr-FR')}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {booking.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                </span>
                <span className="font-medium text-gray-900">{booking.amount} MAD</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  </div>
);

export default OverviewTab; 