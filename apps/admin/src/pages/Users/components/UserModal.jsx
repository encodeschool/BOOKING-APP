import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

export default function UserModal({ open, onClose, onSubmit, initial = {}, mode = "create", loading, businesses = [] }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    role: "CLIENT",
    businessId: "",
  });

  useEffect(() => {
    if (initial) {
      setForm((f) => ({ ...f, ...initial }));
    }
  }, [initial]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{mode === "create" ? "Add New User" : "Edit User"}</h2>
            <p className="text-sm text-gray-500 mt-1">{mode === "create" ? "Create a new account" : "Update user details"}</p>
          </div>

          <button onClick={onClose} className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition">
            <FiX size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-6 py-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} type="email" className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white outline-none" />
          </div>

          {mode === "create" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} type="password" className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white outline-none" />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input value={form.fullName} onChange={(e) => setForm({...form, fullName: e.target.value})} className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white outline-none" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select value={form.role} onChange={(e) => setForm({...form, role: e.target.value})} className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 outline-none">
              <option value="CLIENT">Client</option>
              <option value="STAFF">Staff</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {mode === "create" && form.role === "STAFF" && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Assign to Business</label>
              <select value={form.businessId} onChange={(e) => setForm({...form, businessId: e.target.value})} className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 outline-none">
                <option value="">Select a business...</option>
                {businesses.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">The staff user will be created with this business assignment.</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-3 rounded-2xl border border-gray-200 text-gray-700 hover:bg-gray-50">Cancel</button>
          <button onClick={() => onSubmit(form)} disabled={loading} className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium">
            {loading ? (mode === "create" ? "Creating..." : "Saving...") : (mode === "create" ? "Create User" : "Save Changes")}
          </button>
        </div>
      </div>
    </div>
  );
}
