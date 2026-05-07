import { useEffect, useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiClock,
  FiDollarSign,
  FiEdit2,
  FiTrash2,
  FiX,
  FiLayers,
  FiTag,
} from "react-icons/fi";

import { useAuth } from "../../app/providers/AuthProvider";
import { useBusiness } from "../../app/providers/BusinessProvider";
import {
  createService,
  getServices,
} from "../../lib/api";

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

  const [search, setSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState("");

  useEffect(() => {
    if (token && selectedBusinessId) {
      load();
    }
  }, [token, selectedBusinessId]);

  async function load() {
    try {
      setLoading(true);

      const data = await getServices(
        token,
        selectedBusinessId
      );

      setServices(data || []);
    } catch (error) {
      console.error(
        "Failed to load services:",
        error
      );

      setServices([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (
      !form.name ||
      !form.price ||
      !form.durationMinutes
    ) {
      return;
    }

    try {
      const created = await createService(token, {
        ...form,
        businessId: Number(selectedBusinessId),
        price: Number(form.price),
        durationMinutes: Number(
          form.durationMinutes
        ),
      });

      setServices((prev) => [...prev, created]);

      setForm({
        name: "",
        price: "",
        durationMinutes: "",
        description: "",
      });

      setShowForm(false);
    } catch (error) {
      console.error(
        "Failed to create service:",
        error
      );
    }
  }

  const filteredServices = services.filter(
    (service) =>
      service.name
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (priceFilter === "" ||
        service.price <= Number(priceFilter))
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Services
          </h1>

          <p className="text-gray-500 mt-1">
            Manage and organize your business
            services
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:opacity-90 text-white px-5 py-3 rounded-2xl shadow-lg transition-all duration-200"
        >
          <FiPlus size={18} />
          Add Service
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Services
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                {services.length}
              </h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <FiLayers
                size={24}
                className="text-emerald-600"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Filtered Results
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                {filteredServices.length}
              </h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
              <FiSearch
                size={24}
                className="text-blue-600"
              />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl p-6 shadow-lg text-white">
          <p className="text-sm opacity-90">
            Business Status
          </p>

          <h2 className="text-2xl font-bold mt-2">
            Active Services
          </h2>

          <p className="text-sm mt-2 opacity-80">
            Ready for bookings
          </p>
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* SEARCH */}
          <div className="relative flex-1">
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>

          {/* FILTER */}
          <select
            className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-emerald-500 transition"
            value={priceFilter}
            onChange={(e) =>
              setPriceFilter(e.target.value)
            }
          >
            <option value="">
              All Prices
            </option>

            <option value="50">
              Under €50
            </option>

            <option value="100">
              Under €100
            </option>

            <option value="200">
              Under €200
            </option>
          </select>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-gray-500">
            Loading services...
          </p>
        </div>
      )}

      {/* SERVICES GRID */}
      {!loading && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* TOP */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white flex items-center justify-center shadow-lg">
                      <FiTag size={28} />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {service.name}
                      </h2>

                      <div className="flex items-center gap-2 text-gray-500 mt-2">
                        <FiDollarSign size={15} />

                        <span className="text-sm">
                          €{service.price}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-500 mt-2">
                        <FiClock size={15} />

                        <span className="text-sm">
                          {
                            service.durationMinutes
                          }{" "}
                          minutes
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                    Active
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div className="mt-5">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {service.description ||
                      "No description provided"}
                  </p>
                </div>
              </div>

              {/* FOOTER */}
              <div className="p-5 flex items-center justify-between">
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition">
                    <FiEdit2 size={16} />
                    Edit
                  </button>

                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition">
                    <FiTrash2 size={16} />
                    Delete
                  </button>
                </div>

                <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EMPTY */}
      {!loading &&
        filteredServices.length === 0 && (
          <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-16 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 mx-auto flex items-center justify-center mb-5">
              <FiLayers
                size={34}
                className="text-gray-400"
              />
            </div>

            <h3 className="text-xl font-semibold text-gray-900">
              No services found
            </h3>

            <p className="text-gray-500 mt-2">
              Try adjusting your filters or add
              a new service.
            </p>
          </div>
        )}

      {/* CREATE MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* HEADER */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Create Service
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Add a new service to your
                  business
                </p>
              </div>

              <button
                onClick={() =>
                  setShowForm(false)
                }
                className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* BODY */}
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Name
                </label>

                <input
                  type="text"
                  placeholder="Haircut, Massage..."
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (€)
                  </label>

                  <input
                    type="number"
                    placeholder="50"
                    value={form.price}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        price:
                          e.target.value,
                      })
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>

                  <input
                    type="number"
                    placeholder="60"
                    value={
                      form.durationMinutes
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        durationMinutes:
                          e.target.value,
                      })
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>

                <textarea
                  rows={5}
                  placeholder="Describe your service..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description:
                        e.target.value,
                    })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 outline-none resize-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* FOOTER */}
            <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={() =>
                  setShowForm(false)
                }
                className="px-5 py-3 rounded-2xl border border-gray-200 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleCreate}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:opacity-90 text-white font-medium shadow-lg transition"
              >
                Create Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}