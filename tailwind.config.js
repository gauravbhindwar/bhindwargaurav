/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'gradient-xy': 'gradient-xy 15s ease infinite',
      },
      keyframes: {
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        }
      },
      fontFamily: {
        sans: ['var(--font-montserrat)', 'sans-serif'],
        display: ['var(--font-space)', 'sans-serif'],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        dark: {
          "primary": "#ff3366",    // Pink
          "secondary": "#9333ea",  // Purple
          "accent": "#e11d48",     // Red
          "neutral": "#1f1b24",    // Dark purple-black
          "base-100": "#0a0a0c",   // Very dark
          "base-200": "#16141a",   // Dark purple-grey
          "base-300": "#1f1b24",   // Darker purple
          "base-content": "#e6e6e6", // Light text
          "info": "#7c3aed",       // Violet
          "success": "#10b981",    // Emerald
          "warning": "#ff9800",    // Orange
          "error": "#ef4444",      // Red
        },
        light: {
          "primary": "#ff3366",    // Pink
          "secondary": "#9333ea",  // Purple
          "accent": "#e11d48",     // Red
          "neutral": "#f3f4f6",    // Light grey
          "base-100": "#ffffff",   // White
          "base-200": "#f9fafb",   // Very light grey
          "base-300": "#f3f4f6",   // Light grey
          "base-content": "#1f1b24", // Dark text
          "info": "#7c3aed",       // Violet
          "success": "#10b981",    // Emerald
          "warning": "#ff9800",    // Orange
          "error": "#ef4444",      // Red
        }
      }
    ]
  },
}
