import { useAuth } from "../../app/providers/AuthProvider";
import { useBusiness } from "../../app/providers/BusinessProvider";

export default function Topbar() {
  const { profile, logout } = useAuth();
  const { businesses, selectedBusinessId, setSelectedBusinessId } = useBusiness();

  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center border-b">
      <h1 className="font-bold text-lg text-gray-800">Welcome back, {profile?.name || profile?.email}!</h1>
      <div className="flex items-center gap-4">
        <select
          className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={selectedBusinessId || ""}
          onChange={(e) => setSelectedBusinessId(Number(e.target.value))}
        >
          <option value="" disabled>Select Business</option>
          {businesses.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}