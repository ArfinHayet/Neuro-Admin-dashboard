/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
        
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
    
      colors: {
        primary: '#114654',
        secondary: '#7e7e7e',
        
      },

    },
  },
  plugins: [require("daisyui")],
};
