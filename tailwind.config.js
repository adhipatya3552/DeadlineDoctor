/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        black:  '#070B13',
        navy:   '#0E1628',
        card:   '#111827',
        border: '#1C2A44',
        teal:   { DEFAULT: '#00E5C4', dim: '#00B49B' },
        red:    { DEFAULT: '#FF3547', critical: '#FF3547' },
        amber:  { DEFAULT: '#FFAB00', alert: '#FFAB00' },
        purple: '#A78BFA',
        text:   { DEFAULT: '#E0E8F4', muted: '#5A6A8A', dim: '#2A3A5A' },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: { xl: '14px', '2xl': '18px' },
    },
  },
  plugins: [],
}
