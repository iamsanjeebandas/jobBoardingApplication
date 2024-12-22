module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#4c6ef5',
        'custom-purple': '#6c5ce7',
        'lighter-blue': '#dbeafe',
        'lighter-purple': '#ede9fe',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        pattern: "", // Replace with the path to your pattern SVG
      },
    },
  },
  plugins: [],
};
