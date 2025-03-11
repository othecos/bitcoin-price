/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      transitionDuration: {
        '800': '800ms',
      },
      rotate: {
        'y-180': 'rotateY(180deg)',
      },
      transformStyle: {
        '3d': 'preserve-3d',
      },
      backfaceVisibility: {
        'hidden': 'hidden',
      },
      perspective: {
        '1000': '1000px',
      },
    },
  },
  plugins: [],
  corePlugins: {
    // Enable the core plugins we need for 3D transforms
    transform: true,
    transformOrigin: true,
    rotate: true,
    scale: true,
    translate: true,
  },
}; 