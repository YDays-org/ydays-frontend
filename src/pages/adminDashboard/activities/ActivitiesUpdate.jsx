import Card from '../../../components/ui/Card';
import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useParams, useNavigate } from 'react-router-dom';
import activitiesData from './activitiesData.json';

const ActivitiesUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState('');
  const [prix, setPrix] = useState('');
  const [duration, setDuration] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [inclus, setInclus] = useState(['']);
  const [nonInclus, setNonInclus] = useState(['']);
  const [programme, setProgramme] = useState([{ heure: '', activite: '' }]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundActivity = activitiesData.find(a => a.id === parseInt(id));
    if (foundActivity) {
      setActivity(foundActivity);
      setTitle(foundActivity.title);
      setDescription(foundActivity.description);
      setCategories(foundActivity.categories.join(', '));
      setPrix(foundActivity.prix.toString());
      setDuration(foundActivity.duration);
      setPhone(foundActivity.phone);
      setLocation(foundActivity.location);
      setInclus(foundActivity.inclus.length ? foundActivity.inclus : ['']);
      setNonInclus(foundActivity.nonInclus.length ? foundActivity.nonInclus : ['']);
      setProgramme(foundActivity.programme.length ? foundActivity.programme : [{ heure: '', activite: '' }]);
      setImagePreview(foundActivity.img);
    }
    setLoading(false);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const activityData = {
      id: parseInt(id),
      title,
      description,
      categories: categories.split(',').map(c => c.trim()),
      prix: parseFloat(prix),
      duration,
      phone,
      location,
      inclus: inclus.filter(i => i),
      nonInclus: nonInclus.filter(i => i),
      programme: programme.filter(p => p.heure && p.activite),
      img: imagePreview
    };
    console.log('Activity updated:', activityData);
    alert(`Activité modifiée : ${title}`);
    navigate('/admin-dashboard/activities');
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
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

  if (!activity) {
    return (
      <Card>
        <div className="p-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-4">Activité non trouvée</h2>
            <button 
              onClick={() => navigate('/admin-dashboard/activities')}
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
          <h2 className="text-lg font-semibold">Modifier l'activité</h2>
          <button 
            onClick={() => navigate('/admin-dashboard/activities')}
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
              placeholder="Description de l'activité..."
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Catégories (séparées par des virgules)</label>
            <input
              type="text"
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Sport, Bien-être, Atelier..."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Prix (€)</label>
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
              <label className="block text-gray-700 mb-1">Durée</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: 1h, 2h30..."
              />
            </div>
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
          <div className="block text-gray-700 mb-2">Image de l'activité</div>
          {!imagePreview ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive && !isDragReject
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
          <div className="flex space-x-4 mt-4">
            <button 
              type="submit" 
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Mettre à jour
            </button>
            <button 
              type="button"
              onClick={() => navigate('/admin-dashboard/activities')}
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

export default ActivitiesUpdate; 