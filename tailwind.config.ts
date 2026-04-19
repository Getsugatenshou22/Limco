import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        border: 'hsl(var(--border))',
        muted: 'hsl(var(--muted))',
        accent: 'hsl(var(--accent))',
        primary: 'hsl(var(--primary))'
      },
      boxShadow: {
        glow: '0 0 60px rgba(79, 70, 229, 0.35)'
      },
      backgroundImage: {
        mesh: 'radial-gradient(circle at top, rgba(56,189,248,0.28), rgba(15,23,42,0.1) 40%, transparent 70%)'
      }
    }
  },
  plugins: []
};

export default config;
