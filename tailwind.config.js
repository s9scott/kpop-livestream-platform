module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      //Width, Height, and Position
      width: {
        'chat-desktop': '30%', // Chat width for desktop
        'chat-mobile': '100%', // Chat width for mobile
        'video-desktop': '70%', // Video width for desktop
        'video-mobile': '100%', // Video width for mobile
      },
      height: {
        'chat-desktop': '100%', // Chat height for desktop
        'chat-mobile': '60%', // Chat height for mobile
        'video-desktop': '100%', // Video height for desktop
        'video-mobile': '30%', // Video height for mobile
        'header-desktop': '4rem', // Header height for desktop
        'header-mobile': '3rem', // Header height for mobile
      },
      inset: {
        'chat-desktop-top': '6rem', // Top offset for desktop (md:inset-y-24)
        'chat-desktop-right': '0', // Right position for desktop
        'chat-desktop-bottom': '0', // Bottom position for desktop
        'chat-mobile-bottom': '0', // Bottom position for mobile
        'video-desktop-top': '6rem', // Top offset for desktop
        'video-desktop-left': '0', // Left position for desktop
      },

      padding: {
        'header-padding': '3rem', // Default padding for the header
      },
      // Colors
      colors: {
        'primary': '#e91e63',
        'secondary': '#9c27b0',
        'accent': '#ffc107',
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
}
