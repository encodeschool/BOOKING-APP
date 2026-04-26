import { useEffect, useState } from "react";
import { useAuth } from "../../app/providers/AuthProvider";
import { useBusiness } from "../../app/providers/BusinessProvider";
import { createService, getServices } from "../../lib/api";

export default function ServicesPage() {
  const { token } = useAuth();
  const { selectedBusinessId } = useBusiness();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    durationMinutes: "",
    description: "",
  });

  useEffect(() => {
    if (token && selectedBusinessId) {
      load();
    }
  }, [token, selectedBusinessId]);

  async function load() {
    try {
      setLoading(true);
      const data = await getServices(token, selectedBusinessId);
      setServices(data || []);
    } catch (error) {
      console.error("Failed to load services:", error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    try {
      const created = await createService(token, {
        ...form,
        businessId: Number(selectedBusinessId),
        price: Number(form.price),
        durationMinutes: Number(form.durationMinutes),
      });

      setServices((prev) => [...prev, created]);
      setForm({ name: "", price: "", durationMinutes: "", description: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Failed to create service:", error);
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Services</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <span>+</span> Add Service
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 max-w-xl">
          <h2 className="text-xl font-semibold mb-4">Add New Service</h2>
          <div className="space-y-4">
            <input
              placeholder="Name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Price"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
              <input
                type="number"
                placeholder="Duration (minutes)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={form.durationMinutes}
                onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })}
              />
            </div>
            <textarea
              placeholder="Description"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleCreate}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Create
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-8 text-gray-500">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2">Loading services...</p>
        </div>
      )}

      {!loading && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {services.map((service) => (
              <tr key={service.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {service.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${service.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {service.durationMinutes} min
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {service.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-blue-600 hover:text-blue-900 mr-2">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
          {services.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No services found. Click "Add Service" to create one.
            </div>
          )}
        </div>
      )}
    </div>
  );
}