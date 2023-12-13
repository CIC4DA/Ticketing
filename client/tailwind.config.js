/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

