import { useState } from 'react';
import Card from '../../../components/ui/Card';

const SettingsTab = () => {
  const [activeTab, setActiveTab] = useState('profile');
  // Profile state
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@email.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  // Notifications state
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSMS, setNotifSMS] = useState(false);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    alert(`Profil mis à jour !\nNom: ${name}\nEmail: ${email}${password ? '\nMot de passe changé.' : ''}`);
    setPassword('');
  };

  const handleNotifSubmit = (e) => {
    e.preventDefault();
    alert(`Préférences de notifications sauvegardées !\nEmail: ${notifEmail ? 'Oui' : 'Non'}\nSMS: ${notifSMS ? 'Oui' : 'Non'}`);
  };

  return (
    <Card>
      <div className="p-6">
        <div className="mb-6 border-b flex space-x-6">
          <button
            className={`pb-2 px-2 font-medium ${activeTab === 'profile' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('profile')}
          >
            Profil
          </button>
          <button
            className={`pb-2 px-2 font-medium ${activeTab === 'notifications' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </button>
        </div>
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-md">
            <div>
              <label className="block text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Nouveau mot de passe</label>
              <div className="flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Laisser vide pour ne pas changer"
                />
                <button
                  type="button"
                  className="ml-2 text-sm text-blue-600 hover:underline"
                  onClick={() => setShowPassword(v => !v)}
                >
                  {showPassword ? 'Cacher' : 'Afficher'}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sauvegarder
            </button>
          </form>
        )}
        {activeTab === 'notifications' && (
          <form onSubmit={handleNotifSubmit} className="space-y-4 max-w-md">
            <div>
              <label className="block text-gray-700 mb-2">Préférences de notifications</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={notifEmail}
                    onChange={() => setNotifEmail(v => !v)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Email</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={notifSMS}
                    onChange={() => setNotifSMS(v => !v)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>SMS</span>
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sauvegarder
            </button>
          </form>
        )}
      </div>
    </Card>
  );
};

export default SettingsTab; 