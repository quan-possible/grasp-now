/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        '1': '0.25rem',  // 4px
        '2': '0.5rem',   // 8px
        '3': '0.75rem',  // 12px
        '4': '1rem',     // 16px
        '6': '1.5rem',   // 24px
        '8': '2rem',     // 32px
        '12': '3rem',    // 48px
        '16': '4rem',    // 64px
      },
      fontFamily: {
        'display': ['Cheltenham', 'Georgia', 'Times New Roman', 'serif'],
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        'serif': ['Georgia', 'Times New Roman', 'serif'],
        'mono': ['JetBrains Mono', 'SF Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'xxs': '0.6875rem',   // 11px – UI micro
        'xs': '0.75rem',      // 12px – tags, code
        'sm': '0.875rem',     // 14px – captions
        'base': '1rem',       // 16px – app body
        'lg': '1.125rem',     // 18px – doc body
        'xl': '1.375rem',     // 22px – H4
        '2xl': '1.75rem',     // 28px – H3
        '3xl': '2.1875rem',   // 35px – H2
        '4xl': '2.75rem',     // 44px – Section hero
        '5xl': '3.4375rem',   // 55px – Marketing hero
        '6xl': '4.2969rem',   // 69px – Splash / empty-state
      },
      lineHeight: {
        'tight': '1.2',
        'normal': '1.5',
        'relaxed': '1.72',
      },
      colors: {
        // Base surfaces
        'bg-primary': '#FFFFFF',      // editor canvas & paper sheet
        'bg-secondary': '#FAFAFA',    // sidebars, app chrome
        'bg-tertiary': '#F5F5F5',     // hovers, subtle cards
        'bg-page': '#FCFCFC',         // app background behind sheet
        
        // Type
        'text-primary': '#171717',
        'text-secondary': '#616161',
        'text-tertiary': '#9E9E9E',
        
        // Borders (rare)
        'border-primary': '#E0E0E0',
        'border-secondary': '#CFCFCF',
        
        // Accent
        'accent': '#2563EB',          // blue-600
        'accent-hover': '#1E4FDB',
        
        // Semantic feedback
        'success': '#16A34A',
        'warning': '#F97316',
        'error': '#DC2626',
        
        // Pastel system (tags, muted buttons, nav dots)
        'pastel-red': '#FEE2E2',
        'pastel-yellow': '#FEF9C3',
        'pastel-pink': '#FCE7F3',
        'pastel-teal': '#CCFBF1',
        
        // Gradient hero
        'gradient-center': 'rgba(37,99,235,.08)',
        'gradient-edge': 'rgba(37,99,235,0)',
      },
      maxWidth: {
        'article': '620px',           // NYT column
      },
      width: {
        'drawer': '320px',            // metadata
      },
      gap: {
        'masonry': '16px',            // grid gap
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0,0,0,.05)',
        'md': '0 2px 6px rgba(0,0,0,.06)',
        'lg': '0 8px 20px rgba(0,0,0,.08)',
        'stack': '0 4px 8px rgba(0,0,0,.08), 0 2px 4px rgba(0,0,0,.12), 0 8px 16px rgba(0,0,0,.04)',
        'active': '0 12px 32px rgba(0,0,0,.12)',
        'drawer': '-4px 0 12px rgba(0,0,0,.06)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '12px',
        'xl': '16px',
        'full': '9999px',
      },
      transitionDuration: {
        'fast': '120ms',
        'normal': '220ms',
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