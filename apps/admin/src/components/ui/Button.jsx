export default function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  variant = "primary",
}) {
  const styles = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-semibold transition ${styles[variant]} disabled:opacity-50`}
    >
      {children}
    </button>
  );
}