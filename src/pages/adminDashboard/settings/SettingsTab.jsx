import { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { profileService } from '../../../services/profileService';
import Card from '../../../components/ui/Card';
import { notification } from 'antd';

const SettingsTab = () => {
  const { userProfile, syncUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Profile state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Notifications state
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSMS, setNotifSMS] = useState(false);

  // Add dedicated loading and error state for profile fetch
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [profileLoadError, setProfileLoadError] = useState('');

  // Security state
  const [securityEmail, setSecurityEmail] = useState('');
  const [securityPassword, setSecurityPassword] = useState('');
  const [securityConfirmPassword, setSecurityConfirmPassword] = useState('');
  const [securityLoading, setSecurityLoading] = useState(false);

  // Load user data when component mounts or userProfile changes
  useEffect(() => {
    const fetchProfile = async () => {
      setIsProfileLoading(true);
      setProfileLoadError('');
      try {
        await syncUserProfile();
      } catch (err) {
        setProfileLoadError(err?.response?.data?.error || err?.message || 'Erreur lors du chargement du profil.');
      } finally {
        setIsProfileLoading(false);
      }
    };
    if (!userProfile) {
      fetchProfile();
    } else {
      setName(userProfile.fullName || '');
      setEmail(userProfile.email || '');
      setPhoneNumber(userProfile.phoneNumber || '');
      setIsProfileLoading(false);
      setSecurityEmail(userProfile?.email || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: 'topRight',
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare profile update data (only fullName and phoneNumber are supported by backend)
      const profileUpdateData = {
        fullName: name,
        phoneNumber: phoneNumber,
      };

      // Update profile via API
      await profileService.updateUserProfile(profileUpdateData);
      
      // Refresh user profile
      await syncUserProfile();
      
      openNotification('success', 'Succès', 'Profil mis à jour avec succès !');
      setActiveTab("profile")
    } catch (error) {
      openNotification('error', 'Erreur', error.response?.data?.error || error.message || 'Erreur lors de la mise à jour du profil.');
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || error.message || 'Erreur lors de la mise à jour du profil.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotifSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: 'success', text: 'Préférences de notifications sauvegardées !' });
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    setSecurityLoading(true);
    try {
      if (securityPassword !== securityConfirmPassword) {
        openNotification('error', 'Erreur', 'Les mots de passe ne correspondent pas.');
        setSecurityLoading(false);
        return;
      }
      if (securityPassword.length < 6) {
        openNotification('error', 'Erreur', 'Le mot de passe doit contenir au moins 6 caractères.');
        setSecurityLoading(false);
        return;
      }
      await profileService.changePassword(securityPassword);
      openNotification('success', 'Succès', 'Mot de passe mis à jour avec succès !');
      setSecurityPassword('');
      setSecurityConfirmPassword('');
    } catch (error) {
      openNotification('error', 'Erreur', error.response?.data?.error || error.message || 'Erreur lors de la mise à jour du mot de passe.');
    } finally {
      setSecurityLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non disponible';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  console.log(userProfile);
  

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
          <button
            className={`pb-2 px-2 font-medium ${activeTab === 'security' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('security')}
          >
            Sécurité
          </button>
        </div>

        

        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* User Information Display */}
            {isProfileLoading ? (
              <div className="flex flex-col justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Chargement du profil...</span>
                {profileLoadError && (
                  <div className="mt-4 text-red-600 text-center">
                    <p>{profileLoadError}</p>
                    <button
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={() => {
                        setProfileLoadError('');
                        setIsProfileLoading(true);
                        syncUserProfile().catch(err => {
                          setProfileLoadError(err?.response?.data?.error || err?.message || 'Erreur lors du chargement du profil.');
                        }).finally(() => setIsProfileLoading(false));
                      }}
                    >
                      Réessayer
                    </button>
                  </div>
                )}
              </div>
            ) : userProfile && (
              <div className="bg-gray-50 p-4 rounded-lg">
                {/* Profile Picture */}
                {userProfile.profilePictureUrl && (
                  <div className="mb-6 pb-4 border-b">
                    <h4 className="text-md font-semibold mb-3 text-gray-800">Photo de profil</h4>
                    <img 
                      src={userProfile.profilePictureUrl} 
                      alt="Photo de profil" 
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                    />
                  </div>
                )}
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Informations du compte</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">ID Utilisateur</label>
                    <p className="text-sm text-gray-800 font-mono">{userProfile.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Rôle</label>
                    <p className="text-sm text-gray-800 capitalize">{userProfile.role}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Email vérifié</label>
                    <p className="text-sm text-gray-800">
                      {userProfile.emailVerified ? '✅ Oui' : '❌ Non'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Téléphone</label>
                    <p className="text-sm text-gray-800">
                      {userProfile.phoneNumber || 'Non renseigné'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Date de création</label>
                    <p className="text-sm text-gray-800">{formatDate(userProfile.createdAt)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Dernière mise à jour</label>
                    <p className="text-sm text-gray-800">{formatDate(userProfile.updatedAt)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Update Form */}
            {!isProfileLoading && userProfile && (
              <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Modifier le profil</h3>
                <div>
                  <label className="block text-gray-700 mb-1">Nom complet</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Votre numéro de téléphone"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full px-6 py-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isLoading 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isLoading ? 'Mise à jour...' : 'Sauvegarder'}
                </button>
              </form>
            )}
          </div>
        )}
        
        {activeTab === 'notifications' && (
          <form onSubmit={handleNotifSubmit} className="space-y-4 max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Préférences de notifications</h3>
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

        {activeTab === 'security' && (
          <form onSubmit={handleSecuritySubmit} className="space-y-4 max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Sécurité du compte</h3>
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={securityEmail}
                className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                disabled
                title="L'email ne peut pas être modifié depuis cette interface"
              />
              <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié depuis cette interface</p>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Nouveau mot de passe</label>
              <input
                type="password"
                value={securityPassword}
                onChange={e => setSecurityPassword(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nouveau mot de passe"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Confirmer le mot de passe</label>
              <input
                type="password"
                value={securityConfirmPassword}
                onChange={e => setSecurityConfirmPassword(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirmer le mot de passe"
              />
            </div>
            <button
              type="submit"
              disabled={securityLoading}
              className={`w-full px-6 py-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                securityLoading 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {securityLoading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
            </button>
          </form>
        )}
      </div>
    </Card>
  );
};

export default SettingsTab; 