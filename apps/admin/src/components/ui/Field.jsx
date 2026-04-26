export default function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled = false,
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-600">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-100"
      />
    </label>
  );
}