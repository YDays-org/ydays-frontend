import Card from '../../../components/ui/Card';
import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { showNotification } from '../../../components/ui/notification';

const EventsUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categorie, setCategorie] = useState('');
  const [day, setDay] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [capacity, setCapacity] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [programme, setProgramme] = useState([{ heure: '', detail: '' }]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categoriesDisponible, setCategoriesDisponible] = useState([]);
  const authToken = localStorage.getItem('authToken');

  // Fetch categories (same as EventsAdd)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/catalog/categories');
        if (response.data && response.data.data) {
          const filtered = response.data.data.filter(cat => cat.slug.includes('event'));
          setCategoriesDisponible(filtered);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des catégories', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch event data from API
  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/catalog/listings/${id}`);
        if (res.data && res.data.data) {
          const ev = res.data.data;
          setEvent(ev);
          setTitle(ev.title || '');
          setDescription(ev.description || '');
          setCategorie(ev.categoryId ? String(ev.categoryId) : '');
          setDay(ev.workingDays ? ev.workingDays[0] : ''); // or handle as array
          setTime(ev.openingHours?.start || '');
          setLocation(ev.address || '');
          setPrice(ev.metadata?.price || '');
          setCapacity(ev.metadata?.capacity || '');
          setPhone(ev.phoneNumber || '');
          setWebsite(ev.website || '');
          setProgramme(
            ev.metadata?.programme && ev.metadata.programme.length > 0
              ? ev.metadata.programme.map(p => ({ heure: p.time, detail: p.name }))
              : [{ heure: '', detail: '' }]
          );
          setImagePreview(ev.coverImage?.mediaUrl || null);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération de l\'événement', err);
        showNotification({
          type: 'error',
          message: 'Erreur',
          description: 'Erreur lors de la récupération de l\'événement.'
        });
      }
      setLoading(false);
    };
    fetchEvent();
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

    let formattedWebsite = website;
    if (website && !/^https?:\/\//i.test(website)) {
      formattedWebsite = 'https://' + website;
    }

    // Compose the backend payload to match EventsAdd
    const payload = {
      title,
      description,
      categoryId: Number(categorie),
      address: location,
      // location: {
      //   lat: 33.5731,
      //   lon: -7.5898,
      // },
      phoneNumber: phone,
      website : formattedWebsite,
      // openingHours: {
      //   start: time,
      // },
      workingDays: [day],
      metadata: {
        price: Number(price),
        capacity: capacity ? Number(capacity) : undefined,
        programme: programme
          .filter(p => p.heure && p.detail)
          .map(p => ({ name: p.detail, time: p.heure })),
      },
      // status: 'published',
    };
    console.log('Payload being sent:', payload);
    try {
      // Update event
      const result = await api.put(`/api/catalog/listings/${id}`, payload, {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });
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
              description: 'L\'événement a été mis à jour, mais l\'image n\'a pas pu être modifiée.'
            });
          }
        }
        showNotification({
          type: 'success',
          message: 'Succès',
          description: 'Événement mis à jour avec succès!'
        });
        setTimeout(() => {
          navigate('/admin-dashboard/events');
        }, 1000);
      } else {
        showNotification({
          type: 'error',
          message: 'Erreur',
          description: 'Erreur lors de la mise à jour de l\'événement.'
        });
      }
    } catch (err) {
      console.error(err);
      showNotification({
        type: 'error',
        message: 'Erreur',
        description: 'Erreur lors de la mise à jour de l\'événement.'
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

  const handleProgrammeChange = (index, field, value) => {
    const updated = [...programme];
    updated[index][field] = value;
    setProgramme(updated);
  };
  const addProgramme = () => setProgramme([...programme, { heure: '', detail: '' }]);
  const removeProgramme = (index) => programme.length > 1 && setProgramme(programme.filter((_, i) => i !== index));

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

  return (
    <Card>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Modifier l'événement</h2>
          <button 
            onClick={() => navigate('/admin-dashboard/events')}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Retour
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Titre *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              placeholder="Description de l'événement..."
            />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Jour</label>
              <input
                type="text"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Vendredi 12 Juillet 2024"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Heure</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: 20:00"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Lieu</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Lieu de l'événement"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Prix (MAD)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Prix"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Capacité</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre de places"
                min="1"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Téléphone"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Site web (optionnel)</label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Programme détaillé (heure par heure)</label>
            {programme.map((item, idx) => (
              <div key={idx} className="flex items-center mb-1 space-x-2">
                <input
                  type="text"
                  value={item.heure}
                  onChange={e => handleProgrammeChange(idx, 'heure', e.target.value)}
                  className="border rounded px-2 py-1 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Heure"
                />
                <input
                  type="text"
                  value={item.detail}
                  onChange={e => handleProgrammeChange(idx, 'detail', e.target.value)}
                  className="border rounded px-2 py-1 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Détail"
                />
                {programme.length > 1 && (
                  <button type="button" onClick={() => removeProgramme(idx)} className="text-red-600">Supprimer</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addProgramme} className="text-blue-600 text-sm hover:text-blue-800">+ Ajouter</button>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Image de l'événement</label>
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
          <div className="flex space-x-4 mt-4">
            <button 
              type="submit" 
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Mettre à jour
            </button>
            <button 
              type="button"
              onClick={() => navigate('/admin-dashboard/events')}
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

export default EventsUpdate; 