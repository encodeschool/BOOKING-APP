export default function EmptyState({ title, description }) {
  return (
    <div className="text-center py-10">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-500 mt-2">{description}</p>
    </div>
  );
}