import { useAuth } from "../../app/providers/AuthProvider";
import { useBusiness } from "../../app/providers/BusinessProvider";

export default function Topbar() {
  const { profile, logout } = useAuth();
  const { businesses, selectedBusinessId, setSelectedBusinessId } = useBusiness();

  return (
    <header className="glass shadow-soft border-b border-gray-200 px-8 py-4 ml-72">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <h1 className="text-lg font-medium text-gray-900">
            Good morning, {profile?.name?.split(' ')[0] || 'Admin'}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Business Selector */}
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-soft"
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
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <span className="text-gray-400 text-xs">􀆈</span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            title="Sign out"
          >
            <span className="text-lg" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display"' }}>
              􀎡
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}