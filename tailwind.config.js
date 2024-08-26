module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Graphik', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      //text size
    
      fontSize: {
        'xxxs': '.5rem',
        'xxs': '.5rem',
        'xsm': '.65rem',
        'sm': '.75rem',
        'tiny': '.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',  
        '3xl': '1.875rem',
      },
    },
  },
  variants: {
    extend: {},
  },
  daisyui: {
    themes: [
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
        
    ],
  },
  plugins: [
    require('daisyui'),
    require('tailwindcss')
  ],
}
