import { useState, useRef } from "react";
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

import {  createBusinessApi, getBusinessesApi, addBusinessImagesApi, deleteBusinessImageApi, updateBusinessApi, deleteBusinessApi, } from "../../lib/api/business.api";

import { geocodeAddress } from "../../lib//api/geocode";

export default function BusinessesPage() {
  const { token } = useAuth();
  const { businesses, load } = useBusiness();
  const API_URL = "http://localhost:8080";

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    category: "",
    description: "",
  });

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  /* ===================== ADDED (IMAGES STATE) ===================== */
  const [images, setImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileRef = useRef(null);

  /* ===================== ADDED (EDIT / DETAILS STATE) ===================== */
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const [details, setDetails] = useState(null);

  const handleFiles = (files) => {
    const arr = Array.from(files);
    setImages((prev) => [...prev, ...arr]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length) {
      handleFiles(e.dataTransfer.files);
    }
  };

  /* ===================== CREATE / UPDATE ===================== */
  async function handleSubmit() {
    if (!form.name || !form.address || !form.phone) return;

    try {
      setLoading(true);

      const geo = await geocodeAddress(form.address);

      if (editMode && editId) {
        await updateBusinessApi(token, editId, {
          ...form,
          latitude: geo.latitude,
          longitude: geo.longitude,
        });

        if (images.length > 0) {
          const fd = new FormData();
          images.forEach((img) => fd.append("images", img));

          await addBusinessImagesApi(token, editId, fd);
        }
      } else {
        const fd = new FormData();

        fd.append(
          "req",
          new Blob(
            [
              JSON.stringify({
                ...form,
                latitude: geo.latitude,
                longitude: geo.longitude,
              }),
            ],
            { type: "application/json" }
          )
        );

        images.forEach((img) => fd.append("images", img));

        await createBusinessApi(token, fd);
      }

      setForm({ name: "", address: "", phone: "", category: "", description: "" });
      setImages([]);
      setEditMode(false);
      setEditId(null);
      setShowForm(false);
      await load();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  /* ===================== EDIT ===================== */
  function handleEdit(b) {
    setForm({
      name: b.name,
      address: b.address,
      phone: b.phone,
      category: b.category,
      description: b.description,
    });

    setEditMode(true);
    setEditId(b.id);
    setImages([]);
    setShowForm(true);
  }

  /* ===================== DELETE ===================== */
  async function handleDelete(id) {
    if (!confirm("Delete business?")) return;
    await deleteBusinessApi(token, id);
    load();
  }

  /* ===================== VIEW DETAILS ===================== */
  function handleView(b) {
    setDetails(b);
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

                    {/* ADDED PREVIEW (IF NEW UPLOADED IMAGES ARE LOCAL OR EXISTING) */}
                    {business.images?.length > 0 && (
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {business.images.map((img, i) => (
                          <img
                            key={i}
                            src={
                              img.imageUrl
                              ? `${API_URL}${img.imageUrl}`
                              : `${API_URL}${img}`
                            }
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ))}
                      </div>
                    )}
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
                <button onClick={() => handleEdit(business)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition">
                  <FiEdit2 size={16} />
                  Edit
                </button>

                <button onClick={() => handleDelete(business.id)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition">
                  <FiTrash2 size={16} />
                  Delete
                </button>
              </div>

              <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700" onClick={() => handleView(business)}>
                View Details →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DETAILS MODAL */}
      {details && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{details.name}</h2>
              <button onClick={() => setDetails(null)}>
                <FiX />
              </button>
            </div>

            <div className="mt-4 space-y-2">
              <p><b>Address:</b> {details.address}</p>
              <p><b>Phone:</b> {details.phone}</p>
              <p><b>Category:</b> {details.category}</p>
              <p><b>Description:</b> {details.description}</p>

              {details.images?.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-3">
                  {details.images.map((img, i) => (
                    <img
                      key={i}
                      src={img.imageUrl || img}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {filteredBusinesses.length === 0 && (
        <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-16 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 mx-auto flex items-center justify-center mb-5">
            <FiBriefcase size={34} className="text-gray-400" />
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
                  {editMode ? "Edit Business" : "Create Business"}
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
                  Category
                </label>

                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value,
                    })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select category</option>

                  <option value="Restaurant">Restaurant</option>
                  <option value="Coffee Shop">Coffee Shop</option>
                  <option value="Barber Shop">Barber Shop</option>
                  <option value="Beauty Salon">Beauty Salon</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Hostel">Hostel</option>
                  <option value="Gym">Gym</option>
                  <option value="Spa">Spa</option>
                </select>
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

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>

              <textarea
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Add Description..."
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
              />

              {/* ===================== ADDED UPLOAD ===================== */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Images
                </label>

                <div
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  className={`border-2 border-dashed rounded-2xl p-5 text-center transition ${
                    dragActive
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-300"
                  }`}
                >
                  <p className="text-gray-500 text-sm">
                    Drag & drop images here
                  </p>

                  <button
                    type="button"
                    className="text-emerald-600 text-sm mt-2"
                    onClick={() => fileRef.current.click()}
                  >
                    or select files
                  </button>

                  <input
                    ref={fileRef}
                    type="file"
                    multiple
                    hidden
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                </div>

                {/* PREVIEW */}
                {images.length > 0 && (
                  <div className="flex gap-2 flex-wrap mt-3">
                    {images.map((img, i) => (
                      <div key={i} className="relative">
                        <img
                          src={URL.createObjectURL(img)}
                          className="w-14 h-14 rounded-lg object-cover"
                        />
                        <button
                          onClick={() => removeImage(i)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded"
                        >
                          x
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* ====================================================== */}
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
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:opacity-90 text-white font-medium shadow-lg transition"
              >
                {editMode ? loading ? "Updating..." : "Update" : loading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}