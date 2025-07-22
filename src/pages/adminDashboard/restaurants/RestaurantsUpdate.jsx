import Card from '../../../components/ui/Card';
import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { showNotification } from '../../../components/ui/notification';

const RestaurantsUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categorie, setCategorie] = useState('');
  const [categoriesDisponible, setCategoriesDisponible] = useState([]);
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [openAt, setOpenAt] = useState('12:00');
  const [closeAt, setCloseAt] = useState('22:00');
  const [specialite, setSpecialite] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [workingDays, setWorkingDays] = useState({
    Lundi: false,
    Mardi: false,
    Mercredi: false,
    Jeudi: false,
    Vendredi: false,
    Samedi: false,
    Dimanche: false
  });
  const [menuItems, setMenuItems] = useState([{ name: '', price: '', description: '' }]);
  const authToken = localStorage.getItem('authToken');

  // Fetch categories (same as EventsAdd)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/catalog/categories');
        if (response.data && response.data.data) {
          const filtered = response.data.data.filter(cat => cat.slug && cat.slug.includes('restaurant'));
          setCategoriesDisponible(filtered);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des catégories', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch restaurant data from API
  useEffect(() => {
    const fetchRestaurant = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/catalog/listings/${id}`);
        if (res.data && res.data.data) {
          const r = res.data.data;
          setRestaurant(r);
          setName(r.title || '');
          setDescription(r.description || '');
          setCategorie(r.categoryId ? String(r.categoryId) : '');
          setLocation(r.address || '');
          setPhone(r.phoneNumber || '');
          setOpenAt(r.openingHours?.start || r.opening_hours?.start || '12:00');
          setCloseAt(r.openingHours?.end || r.opening_hours?.end || '22:00');
          setSpecialite(r.metadata?.specialite || '');
          setImagePreview(r.coverImage?.mediaUrl || r.cover_image?.mediaUrl || null);
          // Set working days
          const daysState = {
            Lundi: false,
            Mardi: false,
            Mercredi: false,
            Jeudi: false,
            Vendredi: false,
            Samedi: false,
            Dimanche: false
          };
          (r.workingDays || r.working_days || []).forEach(day => {
            daysState[day] = true;
          });
          setWorkingDays(daysState);
          // Set menu items
          if (r.metadata?.menu && r.metadata.menu.length > 0) {
            setMenuItems(r.metadata.menu.map(item => ({
              name: item.name,
              price: item.price.toString(),
              description: item.description
            })));
          } else {
            setMenuItems([{ name: '', price: '', description: '' }]);
          }
        }
      } catch (err) {
        console.error('Erreur lors de la récupération du restaurant', err);
        showNotification({
          type: 'error',
          message: 'Erreur',
          description: 'Erreur lors de la récupération du restaurant.'
        });
      }
      setLoading(false);
    };
    fetchRestaurant();
  }, [id]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    maxSize: 5242880
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Get selected working days
    const selectedDays = Object.keys(workingDays).filter(day => workingDays[day]);
    // Compose the backend payload
    const payload = {
      title: name,
      description,
      categoryId: categorie ? Number(categorie) : undefined,
      address: location,
      phoneNumber: phone,
      openingHours: {
        openAt: openAt,
        closeAt: closeAt,
      },
      workingDays: selectedDays,
      metadata: {
        specialite: specialite,
        menu: menuItems.filter(item => item.name && item.price).map(item => ({
          name: item.name,
          price: Number(item.price),
          description: item.description
        })),
      },
    };
    try {

      console.log('updating restaurant');
      
      // Update restaurant
      const result = await api.put(`/api/catalog/listings/${id}`, payload, {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });

      console.log('result' , result);
      
      if (result.data.success) {
        // If a new image is selected, upload it
        if (imageFile) {
          const formData = new FormData();
          formData.append('listingId', id);
          formData.append('caption', 'Main photo');
          formData.append('isCover', 'true');
          formData.append('media', imageFile);
          const result_img = await api.post('/api/media/upload/single', formData, {
            headers: {
              ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
              'Content-Type': 'multipart/form-data',
            },
          });
          if (!result_img.data.success) {
            showNotification({
              type: 'warning',
              message: 'Image',
              description: 'Le restaurant a été mis à jour, mais l\'image n\'a pas pu être modifiée.'
            });
          }
        }
        showNotification({
          type: 'success',
          message: 'Succès',
          description: 'Restaurant mis à jour avec succès!'
        });
        setTimeout(() => {
          navigate('/admin-dashboard/restaurants');
        }, 1000);
      } else {
        showNotification({
          type: 'error',
          message: 'Erreur',
          description: 'Erreur lors de la mise à jour du restaurant.'
        });
      }
    } catch (err) {
      console.error(err);
      showNotification({
        type: 'error',
        message: 'Erreur',
        description: 'Erreur lors de la mise à jour du restaurant.'
      });
    }
    setLoading(false);
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
  };

  const addMenuItem = () => {
    setMenuItems([...menuItems, { name: '', price: '', description: '' }]);
  };

  const removeMenuItem = (index) => {
    if (menuItems.length > 1) {
      setMenuItems(menuItems.filter((_, i) => i !== index));
    }
  };

  const updateMenuItem = (index, field, value) => {
    const updatedItems = [...menuItems];
    updatedItems[index][field] = value;
    setMenuItems(updatedItems);
  };

  const handleWorkingDayChange = (day) => {
    setWorkingDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  if (loading) {
    return (
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Chargement...</span>
          </div>
        </div>
      </Card>
    );
  }

  if (!restaurant) {
    return (
      <Card>
        <div className="p-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-4">Restaurant non trouvé</h2>
            <button
              onClick={() => navigate('/admin-dashboard/restaurants')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Retour à la liste
            </button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Modifier le restaurant</h2>
          <button
            onClick={() => navigate('/admin-dashboard/restaurants')}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Retour
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Nom du restaurant *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Description du restaurant..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Adresse *</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Adresse complète"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Téléphone *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+33 1 23 45 67 89"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Heure d'ouverture</label>
              <input
                type="text"
                value={openAt}
                onChange={(e) => setOpenAt(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Heure de fermeture</label>
              <input
                type="text"
                value={closeAt}
                onChange={(e) => setCloseAt(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Jours d'ouverture</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.keys(workingDays).map((day) => (
                <label key={day} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={workingDays[day]}
                    onChange={() => handleWorkingDayChange(day)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">{day}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Catégorie</label>
            <select
              value={categorie}
              onChange={(e) => setCategorie(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionnez une catégorie</option>
              {categoriesDisponible.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>


          <div>
            <label className="block text-gray-700 mb-2">Menu</label>
            <div className="space-y-3">
              {menuItems.map((item, index) => (
                <div key={index} className="border rounded p-3 bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Plat {index + 1}</span>
                    {menuItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMenuItem(index)}
                        className="text-red-600 text-sm hover:text-red-800"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateMenuItem(index, 'name', e.target.value)}
                      className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nom du plat"
                    />
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => updateMenuItem(index, 'price', e.target.value)}
                      className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Prix (€)"
                      step="0.01"
                      min="0"
                    />
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateMenuItem(index, 'description', e.target.value)}
                      className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Description"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addMenuItem}
                className="text-blue-600 text-sm hover:text-blue-800"
              >
                + Ajouter un plat
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Changer l'image du restaurant</label>
            {!imagePreview ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive && !isDragReject
                  ? 'border-blue-400 bg-blue-50'
                  : isDragReject
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-300 hover:border-gray-400'
                  }`}
              >
                <input {...getInputProps()} />
                <div className="space-y-2">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="text-gray-600">
                    {isDragActive && !isDragReject ? (
                      <p>Déposez l'image ici...</p>
                    ) : isDragReject ? (
                      <p className="text-red-600">Fichier non supporté</p>
                    ) : (
                      <div>
                        <p className="font-medium">Cliquez pour sélectionner ou glissez-déposez</p>
                        <p className="text-sm">PNG, JPG, GIF jusqu'à 5MB</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Aperçu"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="mt-2 text-sm text-gray-600">
                  {imageFile?.name ? `${imageFile.name} (${(imageFile.size / 1024 / 1024).toFixed(2)} MB)` : 'Image actuelle'}
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Mettre à jour
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin-dashboard/restaurants')}
              className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default RestaurantsUpdate; 