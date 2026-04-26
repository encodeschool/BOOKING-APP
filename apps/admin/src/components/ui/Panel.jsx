export default function Panel({ title, subtitle, children }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}