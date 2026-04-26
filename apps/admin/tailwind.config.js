/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#f3efe7",
        ink: "#1f2a2f",
        ember: "#b5512b",
        pine: "#25594d",
        sand: "#d8c6a6",
        shell: "#fffaf1",
      },
      boxShadow: {
        panel: "0 22px 60px rgba(34, 39, 46, 0.12)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
