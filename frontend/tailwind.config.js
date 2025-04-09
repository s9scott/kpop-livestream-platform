module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      // Width, Height, and Position
      width: {
        'chat-desktop': '30%', // Chat width for desktop
        'chat-mobile': '100%', // Chat width for mobile
        'video-desktop': '70%', // Video width for desktop
        'video-mobile': '100%', // Video width for mobile
        // Add more customizable width settings here...
      },
      height: {
        'chat-desktop': '100%', // Chat height for desktop
        'chat-mobile': '60%', // Chat height for mobile
        'video-desktop': '100%', // Video height for desktop
        'video-mobile': '30%', // Video height for mobile
        'header-desktop': '4rem', // Header height for desktop
        'header-mobile': '3rem', // Header height for mobile
        // Add more customizable height settings here...
      },
      inset: {
        'chat-desktop-top': '6rem', // Top offset for desktop (md:inset-y-24)
        'chat-desktop-right': '0', // Right position for desktop
        'chat-desktop-bottom': '0', // Bottom position for desktop
        'chat-mobile-bottom': '0', // Bottom position for mobile
        'video-desktop-top': '6rem', // Top offset for desktop
        'video-desktop-left': '0', // Left position for desktop
        // Add more customizable inset settings here...
      },

      // Text Size for Everything
      fontSize: {
        'xs': '.75rem',
        'sm': '.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        // Add more customizable font sizes here...
      },

      // Header Settings
      padding: {
        'header-padding': '3rem', // Default padding for the header
        // Add more customizable padding settings here...
      },

      // Button Settings
      // Add customization for button sizes, padding, and borders here...
      borderRadius: {
        'btn': '0.9rem', // Default button border-radius
        // Add more customizable border-radius settings here...
      },

      // Dropdown Settings
      // Add customization for dropdown sizes, padding, and borders here...
      borderWidth: {
        'dropdown': '1px', // Default border-width for dropdowns
        // Add more customizable border-width settings here...
      },

      // Spacing (Margin, Padding, etc.)
      spacing: {
        '1': '0.25rem',
        '2': '0.5rem',
        '4': '1rem',
        '8': '2rem',
        // Add more customizable spacing settings here...
      },

      // Shadows
      boxShadow: {
        'btn': '0px 4px 6px -1px rgba(0, 0, 0, 0.1)', // Default shadow for buttons
        'dropdown': '0px 4px 6px -1px rgba(0, 0, 0, 0.1)', // Default shadow for dropdowns
        // Add more customizable shadow settings here...
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
          "primary": "#e91e63",
          "secondary": "#9c27b0",
          "accent": "#ffc107",
          "neutral": "#212121",
          "base-100": "#121212",
          "info": "#03a9f4",
          "success": "#4caf50",
          "warning": "#ff9800",
          "error": "#f44336",
        },
      },
      {
        kpop_light: {
          "primary": "#e91e63",
          "secondary": "#9c27b0",
          "accent": "#ffc107",
          "neutral": "#ffffff",
          "base-100": "#f8fafc",
          "info": "#b3e5fc",
          "success": "#d4edda",
          "warning": "#ffe5b4",
          "error": "#ffcccb",
        },
      },
    ],
  },
  plugins: [
    require('daisyui'),
    require('tailwindcss'),
  ],
};
