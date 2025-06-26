import Card from '../../../components/ui/Card';

const RestaurantsUpdate = () => (
  <Card>
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">Modifier un restaurant</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1" htmlFor="name">Nom du restaurant</label>
          <input id="name" name="name" type="text" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring" placeholder="Nom" />
        </div>
        <div>
          <label className="block text-gray-700 mb-1" htmlFor="address">Adresse</label>
          <input id="address" name="address" type="text" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring" placeholder="Adresse" />
        </div>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Mettre à jour</button>
      </form>
    </div>
  </Card>
);

export default RestaurantsUpdate;
