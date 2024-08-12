module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Arial', 'sans-serif'],
      },
    },
  },
  variants: {
    extend: {},
  },
  daisyui: {
    themes: [
        {
          kpop_light: {
            "primary": "#e91e63",    // Deep pink
            "secondary": "#9c27b0",  // Deep purple
            "accent": "#ffc107",     // Deep yellow
            "neutral": "#ffffff",    // White background
            "base-100": "#f8fafc",   // Light background
            "info": "#b3e5fc",       // Pastel blue
            "success": "#d4edda",    // Pastel green
            "warning": "#ffe5b4",    // Pastel orange
            "error": "#ffcccb",      // Pastel red
          },
        },
        {
          kpop_dark: {
            "primary": "#e91e63",    // Deep pink
            "secondary": "#9c27b0",  // Deep purple
            "accent": "#ffc107",     // Deep yellow
            "neutral": "#212121",    // Black background
            "base-100": "#121212",   // Very dark background
            "info": "#03a9f4",       // Bright blue
            "success": "#4caf50",    // Deep green
            "warning": "#ff9800",    // Deep orange
            "error": "#f44336",      // Deep red
          },
        },
    ],
  },
  plugins: [
    require('daisyui'),
    require('tailwindcss')
  ],
}
