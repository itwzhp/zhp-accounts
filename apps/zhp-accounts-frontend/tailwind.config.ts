import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  daisyui: {
    themes: [
      {
        zhp: {
          primary: '#86a315',
          'primary-content': '#ffffff',
          secondary: '#587d18',
          accent: '#80539b',
          neutral: '#cfd3d7',
          'base-100': '#fbfbfb',
          info: '#194093',
          success: '#afca0b',
          warning: '#fbcd44',
          error: '#e94f2D',
        },
      },
    ],
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
};
export default config;
