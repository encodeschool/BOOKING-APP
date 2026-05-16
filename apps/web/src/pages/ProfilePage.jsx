import { useState, useEffect } from "react";
import { useAuth } from "../app/providers/AuthProvider";

export default function ProfilePage() {
  const { profile, token, updateProfile, deleteAccount } = useAuth();
  const [fullName, setFullName] = useState(profile?.fullName || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFullName(profile?.fullName || "");
  }, [profile]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ fullName });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete your account? This action cannot be undone.')) return;
    try {
      setSaving(true);
      await deleteAccount();
    } catch (err) {
      console.error(err);
      alert('Failed to delete account');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-4">My Profile</h1>
      <div className="bg-white p-6 rounded shadow">
        <p className="mb-2"><strong>Email:</strong> {profile?.email}</p>
        <p className="mb-4"><strong>Role:</strong> {profile?.role}</p>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full name</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="ml-4 px-4 py-2 bg-red-600 text-white rounded"
              disabled={saving}
            >
              Delete Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
