export default function Banner({ text, tone = "success" }) {
  const styles =
    tone === "error"
      ? "bg-red-100 text-red-700 border-red-200"
      : "bg-green-100 text-green-700 border-green-200";

  return (
    <div className={`p-3 rounded-lg border text-sm ${styles}`}>
      {text}
    </div>
  );
}