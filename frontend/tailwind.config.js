/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#2B211B',
        'brand-brown-dark': '#3A2A20',
        'brand-brown': '#6B4A35',
        'brand-brown-soft': '#8B684D',
        'brand-gold': '#B58A4A',
        'brand-gold-hover': '#9D743B',
        'brand-biscuit': '#E7D8C5',
        'brand-biscuit-light': '#F3EBDD',
        'brand-cream': '#F3EBDD',
        'brand-muted': '#776B60',
        'brand-border': '#D8CBB9',
        'brand-brown-border': '#6B4A35',
        'brown-50': '#F6EFE6',
        'brown-100': '#EDE0D0',
        'brown-200': '#DCC7AF',
        'brown-400': '#B58A4A',
        'brown-600': '#7A563D',
        'brown-700': '#5B3D2C',
      },
      fontFamily: { sans: ['Inter','system-ui','-apple-system','sans-serif'], heading: ['Manrope','Inter','system-ui','sans-serif'] },
      boxShadow: {
        'card-soft': '0 4px 24px -8px rgba(43,33,27,.16)',
        'card-hover': '0 14px 35px -12px rgba(107,74,53,.22)',
        'brown-glow': '0 0 28px rgba(107,74,53,.18)',
        'gold-glow': '0 0 28px rgba(181,138,74,.18)',
      }
    },
  },
  plugins: [],
}
