module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      // Width, Height, and Position
      width: {

        //desktop styles (md)
        'video-desktop': '70vw', 
        'chat-desktop': '25vw', 

        //landscape mobile styles (sm)
        'video-mobile-landscape': '50vw', 
        'chat-mobile-landscape': '45vw',

        //portrait landscape styles (default)
        'video-mobile-portrait': '95vw', 
        'chat-mobile-portrait': '95vw', 
        
        // Add more customizable width settings here...
      },
      height: {

        'player-page-height': '125vh',

        //desktop styles
        'video-desktop': '75vh',
        'chat-desktop': '85vh',
        'header-desktop': '10vh',
      
        //landscape mobile styles (sm)
        'video-mobile-landscape': '45vh',
        'chat-mobile-landscape':'150vh',

        //portrait landscape styles
        'video-mobile-portrait': '25vh',
        'chat-mobile-portrait': '65vh',

        // Add more customizable height settings here...

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
        'header-padding': '1rem', // Default padding for the header
        'header-padding-sm': '0.5rem', // Smaller padding 
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
          "primary": "#819171",
          "secondary": "#181818",
          "accent": "#D5D6CB",
          "neutral": "#0C0C0C", //black
          "base-100": "#323232", //background color
          "base-200": "#212121", //darker background (we will use to make gradient)
          "base-300": "#0C0C0C", //darkest backround color
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
