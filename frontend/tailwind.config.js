/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    // Custom responsive breakpoints
    screens: {
      'xs': '360px',   // Extra small - iPhone SE, small Android
      'sm': '640px',   // Small - large phones, small tablets
      'md': '768px',   // Medium - tablets
      'lg': '1024px',  // Large - desktops
      'xl': '1280px',  // Extra large - large desktops
      '2xl': '1536px', // 2X large - ultra-wide
    },
    extend: {
      colors: {
        // Backgrounds
        base: 'rgb(var(--bg-base) / <alpha-value>)',
        surface: 'rgb(var(--bg-surface) / <alpha-value>)',
        'surface-alt': 'rgb(var(--bg-surface-alt) / <alpha-value>)',
        elevated: 'rgb(var(--bg-elevated) / <alpha-value>)',
        
        // Borders
        'border-default': 'rgb(var(--border-default) / <alpha-value>)',
        'border-subtle': 'rgb(var(--border-subtle) / <alpha-value>)',
        'border-strong': 'rgb(var(--border-strong) / <alpha-value>)',
        
        // Text - WCAG Contrast Compliant
        'text-primary': 'rgb(var(--text-primary) / <alpha-value>)',     // 15.8:1 - AAA
        'text-secondary': 'rgb(var(--text-secondary) / <alpha-value>)', // 10.2:1 - AAA
        'text-tertiary': 'rgb(var(--text-tertiary) / <alpha-value>)',   // 4.64:1 - AA
        'text-muted': 'rgb(var(--text-muted) / <alpha-value>)',         // 4.64:1 - AA
        'text-placeholder': 'rgb(var(--text-placeholder) / <alpha-value>)', // 4.64:1 - AA
        'text-disabled': 'rgb(var(--text-disabled) / <alpha-value>)',   // 3.5:1 - AA large
        
        // Accent
        accent: {
          DEFAULT: 'rgb(var(--accent-primary) / <alpha-value>)',
          hover: 'rgb(var(--accent-primary-hover) / <alpha-value>)',
          muted: 'rgb(var(--accent-primary) / 0.15)',
        },
        
        // Semantic
        success: {
          DEFAULT: 'rgb(var(--success) / <alpha-value>)',
          muted: 'rgb(var(--success) / 0.15)',
        },
        warning: {
          DEFAULT: 'rgb(var(--warning) / <alpha-value>)',
          muted: 'rgb(var(--warning) / 0.15)',
        },
        error: {
          DEFAULT: 'rgb(var(--error) / <alpha-value>)',
          muted: 'rgb(var(--error) / 0.15)',
        },
        info: {
          DEFAULT: 'rgb(var(--info) / <alpha-value>)',
          muted: 'rgb(var(--info) / 0.15)',
        },
        
        // Rank colors
        'rank-1': '#fbbf24',
        'rank-2': '#a1a1aa',
        'rank-3': '#a16207',
        'rank-other': '#52525b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      fontSize: {
        'display': ['28px', { lineHeight: '1.2', fontWeight: '600' }],
        'heading-lg': ['20px', { lineHeight: '1.3', fontWeight: '600' }],
        'heading-md': ['16px', { lineHeight: '1.4', fontWeight: '600' }],
        'heading-sm': ['14px', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['13px', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '1.4', fontWeight: '400' }],
      },
      spacing: {
        // Base spacing scale (using CSS custom properties for consistency)
        '0.5': '2px',
        '1': 'var(--spacing-xs, 4px)',      // 4px - micro spacing
        '2': 'var(--spacing-sm, 8px)',      // 8px - tight spacing
        '3': 'var(--spacing-md, 12px)',     // 12px - compact spacing
        '4': 'var(--spacing-lg, 16px)',     // 16px - default spacing
        '5': '20px',
        '6': 'var(--spacing-xl, 24px)',     // 24px - section spacing
        '8': 'var(--spacing-2xl, 32px)',    // 32px - large spacing
        '10': 'var(--size-touch-target, 40px)', // 40px - touch target
        '12': 'var(--spacing-3xl, 48px)',   // 48px - extra large
        '14': 'var(--size-nav-width, 56px)', // 56px - nav width
        '16': '64px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
      },
      boxShadow: {
        'elevated': '0 4px 6px -1px rgb(0 0 0 / 0.2), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'modal': '0 25px 50px -12px rgb(0 0 0 / 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-in-right': 'slideInRight 0.25s ease-out',
        'slide-in-up': 'slideInUp 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
