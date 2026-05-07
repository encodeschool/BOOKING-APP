import { useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiMapPin,
  FiPhone,
  FiBriefcase,
  FiX,
} from "react-icons/fi";

import { useAuth } from "../../app/providers/AuthProvider";
import { useBusiness } from "../../app/providers/BusinessProvider";
import { createBusiness } from "../../lib/api";

export default function BusinessesPage() {
  const { token } = useAuth();
  const { businesses, load } = useBusiness();

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!form.name || !form.address || !form.phone) return;

    try {
      setLoading(true);

      await createBusiness(token, form);

      setForm({
        name: "",
        address: "",
        phone: "",
      });

      setShowForm(false);

      load();
    } catch (error) {
      console.error("Failed to create business:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredBusinesses = businesses.filter((business) =>
    `${business.name} ${business.address}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Businesses
          </h1>

          <p className="text-gray-500 mt-1">
            Manage all your registered businesses
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:opacity-90 text-white px-5 py-3 rounded-2xl shadow-lg transition-all duration-200"
        >
          <FiPlus size={18} />
          Add Business
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Businesses
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                {businesses.length}
              </h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <FiBriefcase
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
                Active Results
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                {filteredBusinesses.length}
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
            Platform Status
          </p>

          <h2 className="text-2xl font-bold mt-2">
            Running smoothly
          </h2>

          <p className="text-sm mt-2 opacity-80">
            Everything is operational
          </p>
        </div>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
        <div className="relative">
          <FiSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search businesses by name or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
        </div>
      </div>

      {/* BUSINESS LIST */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredBusinesses.map((business) => (
          <div
            key={business.id}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            {/* TOP */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                    {business.name?.charAt(0)}
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {business.name}
                    </h2>

                    <div className="flex items-center gap-2 text-gray-500 mt-2">
                      <FiMapPin size={15} />
                      <span className="text-sm">
                        {business.address}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-500 mt-2">
                      <FiPhone size={15} />
                      <span className="text-sm">
                        {business.phone}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                  Active
                </div>
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

      {/* EMPTY STATE */}
      {filteredBusinesses.length === 0 && (
        <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-16 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 mx-auto flex items-center justify-center mb-5">
            <FiBriefcase
              size={34}
              className="text-gray-400"
            />
          </div>

          <h3 className="text-xl font-semibold text-gray-900">
            No businesses found
          </h3>

          <p className="text-gray-500 mt-2">
            Try adjusting your search or create a new business.
          </p>
        </div>
      )}

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* HEADER */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Create Business
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Add a new business to your platform
                </p>
              </div>

              <button
                onClick={() => setShowForm(false)}
                className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* BODY */}
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name
                </label>

                <input
                  type="text"
                  placeholder="Enter business name"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>

                <input
                  type="text"
                  placeholder="Enter address"
                  value={form.address}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      address: e.target.value,
                    })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>

                <input
                  type="text"
                  placeholder="+371 20 123 456"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value,
                    })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* FOOTER */}
            <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-5 py-3 rounded-2xl border border-gray-200 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleCreate}
                disabled={loading}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:opacity-90 text-white font-medium shadow-lg transition"
              >
                {loading ? "Creating..." : "Create Business"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}