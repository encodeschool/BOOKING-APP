export default function SimpleList({ items, renderItem, emptyText }) {
  if (!items.length) {
    return <p className="text-sm text-gray-500">{emptyText}</p>;
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="border rounded-xl p-3 bg-white">
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}