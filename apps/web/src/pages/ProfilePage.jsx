import { useState } from "react";
import { useAuth } from "../app/providers/AuthProvider";

const ProfilePage = () => {
  const { profile } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile?.fullName || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600">Your profile</p>
          <h1 className="mt-4 text-4xl font-bold text-slate-900">Manage your account</h1>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">Update your personal details and view your saved account preferences.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Profile</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Your account settings</h2>
              </div>
              <button
                type="button"
                onClick={() => setEditMode(!editMode)}
                className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
              >
                {editMode ? "Cancel edit" : "Edit details"}
              </button>
            </div>

            <div className="grid gap-6">
              <div className="rounded-3xl bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Name</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{profile?.fullName || "Not set"}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Email</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{profile?.email || "Not set"}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Phone</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{profile?.phone || "Not set"}</p>
              </div>
            </div>

            {editMode && (
              <form className="mt-10 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                    <input
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                  <input
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="input-field"
                  />
                </div>
                <button className="btn-primary">Save changes</button>
              </form>
            )}
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Account insights</h2>
            <div className="grid gap-4">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Upcoming bookings</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">2 scheduled</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Saved preferences</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">4 favorites</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Support</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">Available 9am–6pm</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
