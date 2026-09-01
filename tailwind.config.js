/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "#080c14",
        surface: {
          50: "#182234",
          100: "#121b2b",
          200: "#0d1522",
          300: "#090e17",
        },
        brand: {
          cyan: "#00f0ff",
          blue: "#3b82f6",
          indigo: "#6366f1",
          purple: "#8b5cf6",
          emerald: "#10b981",
        },
        accent: {
          light: "#e2e8f0",
          muted: "#94a3b8",
          dark: "#64748b",
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.15), transparent 70%)',
        'card-glow': 'radial-gradient(circle at top left, rgba(99, 102, 241, 0.08), transparent 50%)',
      },
      animation: {
        'pulse-subtle': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
