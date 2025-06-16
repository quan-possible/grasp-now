/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Cheltenham', 'Georgia', 'Times New Roman', 'serif'],
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        'serif': ['Georgia', 'Times New Roman', 'serif'],
        'mono': ['JetBrains Mono', 'SF Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'xs': '0.75rem',      // 12px
        'sm': '0.875rem',     // 14px
        'base': '1rem',       // 16px
        'lg': '1.125rem',     // 18px
        'xl': '1.25rem',      // 20px
        '2xl': '1.563rem',    // 25px
        '3xl': '1.953rem',    // 31px
        '4xl': '2.441rem',    // 39px
        '5xl': '3.052rem',    // 49px
      },
      lineHeight: {
        'tight': '1.25',
        'normal': '1.5',
        'relaxed': '1.7',
      },
      colors: {
        // Design system colors
        'bg-primary': '#FFFFFF',
        'bg-secondary': '#FAFAFA',
        'bg-tertiary': '#F5F5F5',
        'bg-article': '#FCFCFC',
        'text-primary': '#171717',
        'text-secondary': '#666666',
        'text-tertiary': '#A3A3A3',
        'border-primary': '#EAEAEA',
        'border-secondary': '#D1D1D1',
        'accent': '#2563EB',
        'accent-hover': '#1D4ED8',
        'success': '#16A34A',
        'warning': '#F97316',
        'error': '#DC2626',
        // Pastel tags
        'tag-red': '#FEE2E2',
        'tag-yellow': '#FEF9C3',
        'tag-pink': '#FCE7F3',
        'tag-teal': '#CCFBF1',
        // Gradients
        'gradient-center': 'rgba(37,99,235,.08)',
        'gradient-edge': 'rgba(37,99,235,0)',
      },
      maxWidth: {
        'article': '620px',
      },
      width: {
        'drawer': '320px',
      },
      gap: {
        'masonry': '16px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0,0,0,.05)',
        'md': '0 2px 8px rgba(0,0,0,.06), 0 1px 3px rgba(0,0,0,.1)',
        'lg': '0 8px 24px rgba(0,0,0,.08), 0 4px 12px rgba(0,0,0,.12)',
        'stack': '0 4px 8px rgba(0,0,0,.08), 0 2px 4px rgba(0,0,0,.12), 0 8px 16px rgba(0,0,0,.04)',
        'active': '0 12px 32px rgba(0,0,0,.1), 0 6px 16px rgba(0,0,0,.15)',
        'drawer': '-4px 0 12px rgba(0,0,0,.06)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        'full': '9999px',
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '250ms',
      },
      transitionTimingFunction: {
        'ease': 'cubic-bezier(.4,0,.2,1)',
      },
      animation: {
        'fade-in': 'fadeIn 150ms cubic-bezier(.4,0,.2,1)',
        'slide-up': 'slideUp 250ms cubic-bezier(.4,0,.2,1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}