import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user starts typing
  };

  const validateForm = () => {
    if (!formData.email) {
      setError('L\'email est requis');
      return false;
    } 
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('L\'email n\'est pas valide');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await resetPassword(formData.email);

      if (response && response.success) {
        setMessage(response.message);
        setIsSubmitted(true);
      } else {
        setError(response?.error || 'Une erreur est survenue lors de la demande de réinitialisation');
      }
    } catch (error) {
      console.error('Password reset request error:', error);
      
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Une erreur est survenue lors de la demande de réinitialisation');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mot de passe oublié</h1>
          <p className="mt-2 text-gray-600">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>
        </div>

        <Card>
          <div className="p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            
            {message && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-600">{message}</p>
              </div>
            )}
            
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                      error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                    }`}
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Envoi...' : 'Envoyer le lien de réinitialisation'}
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Retour à la{' '}
                    <Link to="/auth/login" className="font-medium text-primary-600 hover:text-primary-500">
                      connexion
                    </Link>
                  </p>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-gray-700">
                  Si un compte est associé à cet email, vous recevrez un lien de réinitialisation de mot de passe.
                </p>
                <p className="text-gray-700">
                  Veuillez consulter votre boîte de réception et suivre les instructions.
                </p>
                <Button
                  type="button"
                  className="mt-4"
                  onClick={() => window.location.href = '/auth/login'}
                >
                  Retour à la connexion
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
