/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // 1. Add your color palette (matches your UI design brief)
      colors: {
        primary: '#2A2A2A',       // Deep gray
        secondary: '#6B46C1',     // Purple accent
        accent: '#48BB78',        // Neon green
        dark: '#0F0F0F',          // Background
        light: '#F7FAFC'          // Text
      },
      
      // 2. Add custom fonts (Space Mono + Inter)
      fontFamily: {
        heading: ['Space Mono', 'monospace'],
        body: ['Inter', 'sans-serif'],
        haas: ['Neue Haas Grotesk', 'sans-serif'],
      },

      // 3. Add animations for microinteractions
      animation: {
        'progress-bar': 'progress 3s linear',
        'celebrate': 'celebrate 0.5s ease-in-out'
      },
      keyframes: {
        progress: {
          '0%': { width: '0%' },
          '100%': { width: '100%' }
        },
        celebrate: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' }
        }
      }
    },
  },
  plugins: [
    require('tailwindcss-animate')
  ],
};
