export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f9fafb',   // 60% - Background
        secondary: '#d1d5db', // 30% - Secondary elements (Navbar, Footer)
        accent: '#6366f1',    // 10% - Accent for buttons, links
      },
    },
  },
  plugins: [],
}