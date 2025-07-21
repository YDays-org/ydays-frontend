import Card from '../../../components/ui/Card';
import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { showNotification } from '../../../components/ui/notification';

const RestaurantsAdd = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [openAt, setOpenAt] = useState('12:00');
  const [closeAt, setCloseAt] = useState('22:00');
  // Category states
  const [categoriesDisponible, setCategoriesDisponible] = useState([]);
  const [categorie, setCategorie] = useState('');
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
  const navigate = useNavigate();
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch categories from backend using api service
        const response = await api.get('/api/catalog/categories');
        if (response.data && response.data.data) {
          // Filter for restaurant categories (slug includes 'restaurant')
          const filtered = response.data.data.filter(cat => cat.slug && cat.slug.includes('restaurant'));
          setCategoriesDisponible(filtered);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des catégories', err);
      }
    };
    fetchCategories();
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setImageFile(file);
      // Create preview URL
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
    maxSize: 5242880 // 5MB
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation: check all required fields
    if (!name || !description || !location || !phone || !openAt || !closeAt || !categorie || !imageFile) {
      showNotification({
        type: 'error',
        message: 'Champs manquants',
        description: 'Veuillez remplir tous les champs obligatoires, y compris l\'image.',
      });
      return;
    }
    // At least one working day
    const selectedDays = Object.keys(workingDays).filter(day => workingDays[day]);
    if (selectedDays.length === 0) {
      showNotification({
        type: 'error',
        message: 'Jours d\'ouverture',
        description: 'Veuillez sélectionner au moins un jour d\'ouverture.',
      });
      return;
    }
    // At least one menu item with name and price
    if (!menuItems.some(item => item.name && item.price)) {
      showNotification({
        type: 'error',
        message: 'Menu',
        description: 'Veuillez ajouter au moins un plat avec un nom et un prix.',
      });
      return;
    }
    // Compose the backend payload
    const payload = {
      title: name,
      description,
      categoryId: categorie ? Number(categorie) : undefined,
      type: 'restaurant',
      address: location,
      location: {
        lat: 33.5731, // Placeholder, ideally get from geocoding
        lon: -7.5898,
      },
      phoneNumber: phone,
      openingHours: {
        openAt: openAt,
        closeAt: closeAt,
      },
      workingDays: selectedDays,
      metadata: {
        menu: menuItems.filter(item => item.name && item.price),
      },
      status: 'published',
    };
    try {
      const result = await api.post('/api/catalog/listings', payload, {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });
      if (result.data && result.data.success) {

        console.log('creating pricing schedule');

        const pricing_schedule_payload = {
          startTime: "2025-08-15T10:00:00.000Z",
          endTime: "2025-08-15T10:00:00.000Z",
          price: 100,
          capacity: 44,
        }
        const pricing_schedule_result = await api.post(`/api/partner/listings/${result.data.data.id}/schedules`, pricing_schedule_payload, {
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        })
        console.log('POST schedules response:', pricing_schedule_result.data.data);

        // If image is provided, upload it
        const formData = new FormData();
        formData.append('listingId', result.data.data.id);
        formData.append('caption', 'Main photo');
        formData.append('isCover', 'true');
        formData.append('media', imageFile);
        const result_img = await api.post('/api/media/upload/single', formData, {
          headers: {
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
            'Content-Type': 'multipart/form-data',
          },
        });
        if (result_img.data && result_img.data.success) {
          showNotification({
            type: 'success',
            message: 'Succès',
            description: 'Restaurant ajouté avec succès!',
            placement: 'topRight',
            duration: 3,
          });
          setTimeout(() => {
            navigate('/admin-dashboard/restaurants');
          }, 2000);
          return;
        }

      }
    } catch (err) {
      console.error(err);
      showNotification({
        type: 'error',
        message: 'Erreur',
        description: 'Erreur lors de l\'ajout du restaurant.',
      });
    }
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
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

  return (
    <Card>
      <div className="p-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
        >
          ← Retour
        </button>
        <h2 className="text-lg font-semibold mb-4">Ajouter un restaurant</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Nom du restaurant *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div>
            <label className="block text-gray-700 mb-1">Spécialité</label>
            <select
              value={categorie}
              onChange={(e) => setCategorie(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionnez une spécialité</option>
              {categoriesDisponible.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Adresse *</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Adresse complète"
            />
          </div>



          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Téléphone *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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
                      placeholder="Prix (MAD)"
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
            <label className="block text-gray-700 mb-2">Image du restaurant</label>
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
                  {imageFile?.name} ({(imageFile?.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              </div>
            )}
          </div>



          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Ajouter le restaurant
          </button>
        </form>
      </div>
    </Card>
  );
};

export default RestaurantsAdd;
