import { useEffect, useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiUsers,
  FiPhone,
  FiEdit2,
  FiTrash2,
  FiFilter,
  FiX,
  FiUser,
} from "react-icons/fi";

import { useAuth } from "../../app/providers/AuthProvider";
import { useBusiness } from "../../app/providers/BusinessProvider";
import { createStaff, getStaff, updateStaff, deleteStaff, uploadStaffImage } from "../../lib/api";
import StaffWorkingHoursModal from './components/StaffWorkingHoursModal';

export default function StaffPage() {
  const { token } = useAuth();
  const { selectedBusinessId } = useBusiness();
  const API_URL =
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV ? "http://localhost:9087" : "https://api-enroll.encode.uz");

  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const [form, setForm] = useState({
    id: null,
    name: "",
    role: "",
    specialization: "",
    phone: "",
    active: true,
    imageUrl: "",
    file: null,
  });

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    if (token && selectedBusinessId) {
      load();
    }
  }, [token, selectedBusinessId]);

  async function load() {
    try {
      setLoading(true);

      const data = await getStaff(
        token,
        selectedBusinessId
      );

      setStaff(data || []);
    } catch (error) {
      console.error(
        "Failed to load staff:",
        error
      );

      setStaff([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    try {
      const created = await createStaff(token, {
        businessId: Number(selectedBusinessId),
        name: form.name,
        role: form.role,
        phone: form.phone,
        specialization: form.specialization,
      });

      if (form.file) {
        try {
          const updated = await uploadStaffImage(token, created.id, form.file);
          created.imageUrl = updated.imageUrl || updated.image;
        } catch (e) {
          console.warn('Failed to upload staff image', e);
        }
      }

      setStaff((prev) => [...prev, created]);

      setForm({
        id: null,
        name: "",
        role: "",
        specialization: "",
        phone: "",
        active: true,
        imageUrl: "",
        file: null,
      });

      setShowForm(false);
    } catch (error) {
      console.error(
        "Failed to create staff:",
        error
      );
    }
  }

  const filteredStaff = staff.filter(
    (member) =>
      member.name
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (roleFilter === "" ||
        member.role
          .toLowerCase()
          .includes(
            roleFilter.toLowerCase()
          ))
  );

  async function handleUpdate() {
    try {
      const updated = await updateStaff(token, form.id, {
        name: form.name,
        role: form.role,
        phone: form.phone,
        active: form.active,
      });

      if (form.file) {
        try {
          const res = await uploadStaffImage(token, updated.id, form.file);
          updated.imageUrl = res.imageUrl || res.image;
        } catch (e) {
          console.warn('Failed to upload staff image', e);
        }
      }

      setStaff((prev) => prev.map((s) => (s.id === updated.id ? { ...s, ...updated } : s)));
      setShowForm(false);
      setForm({
        id: null,
        name: "",
        role: "",
        specialization: "",
        phone: "",
        active: true,
        imageUrl: "",
        file: null,
      });
    } catch (e) {
      console.error('Failed to update staff', e);
    }
  }

  function openEdit(member) {
    setForm({
      id: member.id,
      name: member.name || "",
      role: member.role || "",
      specialization: member.specialization || "",
      phone: member.phone || "",
      active: member.active ?? true,
      imageUrl: member.imageUrl || "",
      file: null,
    });
    setShowForm(true);
  }

  async function handleDelete(member) {
    if (!confirm(`Delete ${member.name}?`)) return;
    try {
      await deleteStaff(token, member.id);
      setStaff((prev) => prev.filter((s) => s.id !== member.id));
    } catch (e) {
      console.error('Failed to delete staff', e);
    }
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Staff Management
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your employees and team
            members
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:opacity-90 text-white px-5 py-3 rounded-2xl font-medium shadow-lg shadow-green-100 transition-all"
        >
          <FiPlus className="text-lg" />
          Add Staff
        </button>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Staff
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                {staff.length}
              </h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
              <FiUsers className="text-2xl text-blue-600" />
            </div>

          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Managers
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                {
                  staff.filter((s) =>
                    s.role
                      ?.toLowerCase()
                      .includes("manager")
                  ).length
                }
              </h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center">
              <FiUser className="text-2xl text-purple-600" />
            </div>

          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Active Team
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                {filteredStaff.length}
              </h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <FiUsers className="text-2xl text-emerald-600" />
            </div>

          </div>
        </div>

      </div>

      {/* CREATE FORM */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {form.id ? 'Edit Staff' : 'Add New Staff'}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {form.id ? 'Update team member' : 'Create a new team member'}
                </p>
              </div>

              <button
                onClick={() => setShowForm(false)}
                className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition"
              >
                <FiX size={20} />
              </button>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-6 py-3">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo
                </label>

                {form.imageUrl && !form.file && (
                  <div className="mb-3 w-full max-w-[160px] overflow-hidden rounded-3xl border border-gray-200">
                    <img src={form.imageUrl} alt="Staff profile" className="w-full h-full object-cover" />
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      file: e.target.files?.[0] || null,
                    })
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>

                <input
                  type="text"
                  placeholder="Manager"
                  value={form.role}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      role: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialization
                </label>

                <input
                  type="text"
                  placeholder="Hair Styling, Colour, Nails"
                  value={form.specialization}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      specialization: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Active
                </label>

                <label className="inline-flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 w-full cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        active: e.target.checked,
                      })
                    }
                    className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />

                  <span className="text-sm text-gray-600">
                    {form.active ? "Active" : "Inactive"}
                  </span>
                </label>
              </div>

              <div className="md:col-span-2">
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
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
                />
              </div>

            </div>

            <div className="flex items-center justify-end gap-3 mt-8 px-6 py-3">

              <button
                onClick={() => setShowForm(false)}
                className="px-5 py-3 rounded-2xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>

              <button
                onClick={form.id ? handleUpdate : handleCreate}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium shadow-lg shadow-green-100 hover:opacity-90 transition-all"
              >
                {form.id ? 'Save Changes' : 'Create Staff'}
              </button>

            </div>
          </div>
        </div>
      )}

      {/* FILTERS */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">

        <div className="flex flex-col lg:flex-row gap-4">

          {/* SEARCH */}
          <div className="flex-1 relative">

            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

            <input
              type="text"
              placeholder="Search staff..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
            />

          </div>

          {/* FILTER */}
          <div className="relative">

            <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <select
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(e.target.value)
              }
              className="appearance-none pl-11 pr-10 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
            >
              <option value="">
                All Roles
              </option>

              <option value="manager">
                Manager
              </option>

              <option value="stylist">
                Stylist
              </option>

              <option value="assistant">
                Assistant
              </option>
            </select>

          </div>

        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">

            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>

            <p className="mt-4 text-gray-500">
              Loading staff...
            </p>

          </div>
        ) : filteredStaff.length > 0 ? (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50 border-b border-gray-100">

                <tr>

                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Staff Member
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Role
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100">

                {filteredStaff.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-gray-50 transition-all"
                  >

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-4">

                        <div className="w-12 h-12 rounded-2xl overflow-hidden flex items-center justify-center">
                          {member.imageUrl ? (
                            <img src={`${API_URL}${member.imageUrl}`} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold">
                              {member.name?.charAt(0)?.toUpperCase()}
                            </div>
                          )}
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {member.name}
                          </h3>

                          <p className="text-sm text-gray-500">
                            {member.specialization || "Staff Member"}
                          </p>
                        </div>

                      </div>

                    </td>

                    <td className="px-6 py-5">

                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                        {member.role}
                      </span>

                    </td>

                    <td className="px-6 py-5 text-gray-600">

                      <div className="flex items-center gap-2">
                        <FiPhone className="text-gray-400" />
                        {member.phone}
                      </div>

                    </td>

                    <td className="px-6 py-5">

                      <div className="flex items-center justify-end gap-2">

                        <button onClick={() => openEdit(member)} className="w-10 h-10 rounded-xl border border-gray-200 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center transition-all">
                          <FiEdit2 />
                        </button>

                        <button onClick={() => handleDelete(member)} className="w-10 h-10 rounded-xl border border-gray-200 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-all">
                          <FiTrash2 />
                        </button>

                        <button
                          onClick={() =>
                            setSelectedStaff(member)
                          }
                          className="px-4 h-10 rounded-xl border border-gray-200 hover:bg-black hover:text-white transition-all text-sm"
                        >
                          Schedule
                        </button>

                      </div>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        ) : (
          <div className="py-20 text-center">

            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
              <FiUsers className="text-3xl text-gray-400" />
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Staff Found
            </h3>

            <p className="text-gray-500 mb-6">
              Add your first team member to
              get started.
            </p>

            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-5 py-3 rounded-2xl font-medium shadow-lg shadow-green-100"
            >
              <FiPlus />
              Add Staff
            </button>

          </div>
        )}

      </div>

      {selectedStaff && (
        <StaffWorkingHoursModal
          token={token}
          staff={selectedStaff}
          onClose={() =>
            setSelectedStaff(null)
          }
        />
      )}

    </div>
  );
}