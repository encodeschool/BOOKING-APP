export default function Header({
  profile,
  logout,
  businesses,
  selectedBusinessId,
  setSelectedBusinessId,
}) {
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow">
      <div>
        <h1 className="text-xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-500">
          {profile?.email}
        </p>
      </div>

      <div className="flex gap-3 items-center">
        <select
          className="border p-2 rounded-xl"
          value={selectedBusinessId}
          onChange={(e) => setSelectedBusinessId(e.target.value)}
        >
          {businesses.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-xl"
        >
          Logout
        </button>
      </div>
    </div>
  );
}