/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        heading: ["Poppins", "Inter", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#e0f2fe",    // light trust blue
          100: "#bae6fd",
          300: "#7dd3fc",
          500: "#0284c7",   // deep trust blue
          600: "#0369a1",
          700: "#075985",
          800: "#0c4a6e",
        },
        secondary: {
          50: "#f0fdf4",    // light affordable green
          100: "#dcfce7",
          300: "#86efac",
          500: "#22c55e",   // affordable green
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
        },
        accent: {
          50: "#fef3c7",    // warm trust yellow
          500: "#f59e0b",
          600: "#d97706",
        },
        trust: "#0284c7",      // main trust blue
        affordable: "#22c55e", // main affordable green
        card: "#ffffff",
        muted: "#64748b"
      },
      boxShadow: {
        'soft-lg': '0 12px 30px rgba(14,30,37,0.08)',
        'inner-3': 'inset 0 6px 12px rgba(0,0,0,0.12)'
      },
      borderRadius: {
        'xl': '1rem'
      }
    },
  },
  plugins: [],
}
