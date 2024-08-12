/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    screens: {
      //by percen
      //by pixels
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    colors: {
      'blue': '#1fb6ff',
      'purple': '#7e5bef',
      'pink': '#ff49db',
      'orange': '#ff7849',
      'green': '#13ce66',
      'yellow': '#ffc82c',
      'gray-dark': '#273444',
      'gray': '#8492a6',
      'gray-light': '#d3dce6',
      'red': '#ff4d4f',
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '1rem',
      },
      fontSize: {
        'xsm': '0.75rem',  // Adjust base font size to be slightly smaller
      },
    }
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
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  variants: {
    extend: {},
  },
};
