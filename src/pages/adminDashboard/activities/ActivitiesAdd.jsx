import Card from '../../../components/ui/Card';
import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { showNotification } from '../../../components/ui/notification';
import api from '../../../services/api';

const ActivitiesAdd = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categorie, setCategorie] = useState('');
  const [prix, setPrix] = useState('');
  const [duration, setDuration] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [inclus, setInclus] = useState(['']);
  const [nonInclus, setNonInclus] = useState(['']);
  const [programme, setProgramme] = useState([{ heure: '', activite: '' }]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [capacity, setCapacity] = useState('');
  const navigate = useNavigate();
  const authToken = localStorage.getItem('authToken');
  const [categoriesDisponible, setCategoriesDisponible] = useState([]);
  const [workingDays, setWorkingDays] = useState({
    Lundi: false,
    Mardi: false,
    Mercredi: false,
    Jeudi: false,
    Vendredi: false,
    Samedi: false,
    Dimanche: false,
  });

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/catalog/categories');
        if (response.data && response.data.data) {
          const filtered = response.data.data.filter(cat => cat.slug.includes('activity'));
          setCategoriesDisponible(filtered);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des catégories', err);
      }
    };
    fetchCategories();
  }, []);

  const handleWorkingDayChange = (day) => {
    setWorkingDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation: all fields must be filled
    if (!title || !description || !categorie || !prix || !duration || !phone || !location || !capacity || inclus.some(i => !i) || !imageFile || nonInclus.some(i => !i) || programme.some(p => !p.heure || !p.activite) ||  !Object.values(workingDays).some(Boolean)) {
      showNotification({
        type: 'error',
        message: 'Erreur',
        description: 'Tous les champs sont obligatoires.',
      });
      return;
    }
    const activityData = {
      title,
      description,
      categoryId: Number(categorie),
      type: 'activity',
      address: location,
      location: {
        lat: 33.5731,
        lon: -7.5898,
      },
      phoneNumber: phone,
      openingHours: {
        start: duration,
      },
      workingDays: Object.keys(workingDays)
        .filter(day => workingDays[day])
        .map(day => day.toLowerCase()),
      metadata: {
        price: prix.toString(),
        programme: programme
          .filter(p => p.heure && p.activite)
          .map(p => ({ name: p.activite, time: p.heure })),
        inclus: inclus.filter(i => i),
        non_inclus: nonInclus.filter(i => i),
      },
      status: 'published',
    };
    console.log('Activity added:', activityData);
    
    try {
      console.log('creating listing');

      const result = await api.post('/api/catalog/listings', activityData, {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });
      console.log('POST listings response:', result.data.data);

      if (result.data.success) {
        console.log('creating pricing schedule');

        const pricing_schedule_payload = {
          startTime: "2025-08-15T10:00:00.000Z",
          endTime: "2025-08-15T10:00:00.000Z",
          price: Number(prix),
          capacity: capacity,
        }
        const pricing_schedule_result = await api.post(`/api/partner/listings/${result.data.data.id}/schedules`, pricing_schedule_payload, {
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        })
        console.log('POST schedules response:', pricing_schedule_result.data.data);

        if (imageFile) {
          const formData = new FormData();
          formData.append('listingId', result.data.data.id);
          formData.append('caption', 'Main photo');
          formData.append('isCover', 'true');
          formData.append('media', imageFile);

          console.log("creating media");

          const result_img = await api.post('/api/media/upload/single', formData, {
            headers: {
              ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
              'Content-Type': 'multipart/form-data',
            },
          });

          console.log("POST media response:", result_img.data.data);

          if (result_img.data.success) {
            showNotification({
              type: 'success', // 'success', 'error', 'info', or 'warning'
              message: 'Succès',
              description: "Activité ajouté avec succès!",
              placement: 'topRight', // optional, default is 'topRight'
              duration: 3, // optional, in seconds, default is 3
            });

            // navigate after 3 seconds
            setTimeout(() => {
              navigate('/admin-dashboard/activities');
            }, 3000);
          }
        }

      }

    } catch (err) {
      console.error(err);
      showNotification({
        type: 'error',
        message: 'Erreur',
        description: 'Erreur lors de l\'ajout de l\'événement.',
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

  const handleInclusChange = (index, value) => {
    const updated = [...inclus];
    updated[index] = value;
    setInclus(updated);
  };
  const addInclus = () => setInclus([...inclus, '']);
  const removeInclus = (index) => inclus.length > 1 && setInclus(inclus.filter((_, i) => i !== index));

  const handleNonInclusChange = (index, value) => {
    const updated = [...nonInclus];
    updated[index] = value;
    setNonInclus(updated);
  };
  const addNonInclus = () => setNonInclus([...nonInclus, '']);
  const removeNonInclus = (index) => nonInclus.length > 1 && setNonInclus(nonInclus.filter((_, i) => i !== index));

  const handleProgrammeChange = (index, field, value) => {
    const updated = [...programme];
    updated[index][field] = value;
    setProgramme(updated);
  };
  const addProgramme = () => setProgramme([...programme, { heure: '', activite: '' }]);
  const removeProgramme = (index) => programme.length > 1 && setProgramme(programme.filter((_, i) => i !== index));

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
        <h2 className="text-lg font-semibold mb-4">Ajouter une activité</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Titre *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Description de l'activité..."
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Prix (MAD)</label>
              <input
                type="number"
                value={prix}
                onChange={(e) => setPrix(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Prix"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Heure</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: 20:00"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Capacité *</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Capacité maximale"
                min="1"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <label className="block text-gray-700 mb-1">Lieu</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Lieu de l'activité"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Jours disponible</label>
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
            <label className="block text-gray-700 mb-2">Inclus</label>
            {inclus.map((item, idx) => (
              <div key={idx} className="flex items-center mb-1">
                <input
                  type="text"
                  value={item}
                  onChange={e => handleInclusChange(idx, e.target.value)}
                  className="border rounded px-2 py-1 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Inclus..."
                />
                {inclus.length > 1 && (
                  <button type="button" onClick={() => removeInclus(idx)} className="ml-2 text-red-600">Supprimer</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addInclus} className="text-blue-600 text-sm hover:text-blue-800">+ Ajouter</button>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Non inclus</label>
            {nonInclus.map((item, idx) => (
              <div key={idx} className="flex items-center mb-1">
                <input
                  type="text"
                  value={item}
                  onChange={e => handleNonInclusChange(idx, e.target.value)}
                  className="border rounded px-2 py-1 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Non inclus..."
                />
                {nonInclus.length > 1 && (
                  <button type="button" onClick={() => removeNonInclus(idx)} className="ml-2 text-red-600">Supprimer</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addNonInclus} className="text-blue-600 text-sm hover:text-blue-800">+ Ajouter</button>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Programme (heure par heure)</label>
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
                  value={item.activite}
                  onChange={e => handleProgrammeChange(idx, 'activite', e.target.value)}
                  className="border rounded px-2 py-1 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Activité"
                />
                {programme.length > 1 && (
                  <button type="button" onClick={() => removeProgramme(idx)} className="text-red-600">Supprimer</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addProgramme} className="text-blue-600 text-sm hover:text-blue-800">+ Ajouter</button>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Image de l'activité</label>
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
            Ajouter l'activité
          </button>
        </form>
      </div>
    </Card>
  );
};

export default ActivitiesAdd; 