export default function StatusPill({ children, tone = "gray" }) {
  const styles = {
    green: "bg-green-100 text-green-700",
    amber: "bg-yellow-100 text-yellow-700",
    gray: "bg-gray-100 text-gray-600",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[tone]}`}>
      {children}
    </span>
  );
}