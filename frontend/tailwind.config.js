/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // From design_dock.md §2.2
        display: ['var(--font-bebas)', 'sans-serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      colors: {
        // ── Theater (Employee — Dark Mode) ──────────────────────────────
        'theater-bg-base':        '#0A0A0F',
        'theater-bg-surface':     '#111118',
        'theater-bg-elevated':    '#1A1A24',
        'theater-accent':         '#E8FF47',
        'theater-accent-danger':  '#FF4747',
        'theater-accent-success': '#47FF9E',
        'theater-accent-timer':   '#FFB347',
        'theater-text':           '#F0F0F8',
        'theater-text-secondary': '#8888A0',
        'theater-text-muted':     '#44445A',

        // ── Studio (HR — Light Mode) ─────────────────────────────────────
        'studio-bg-base':         '#F8F8FB',
        'studio-bg-surface':      '#FFFFFF',
        'studio-accent':          '#5B4EFF',
        'studio-accent-lime':     '#E8FF47',
        'studio-accent-success':  '#22C55E',
        'studio-accent-danger':   '#EF4444',
        'studio-accent-warning':  '#F59E0B',
        'studio-text':            '#111118',
        'studio-text-secondary':  '#555566',
        'studio-text-muted':      '#9999AA',
        'studio-border':          '#E5E5EF',
      },
      borderRadius: {
        // From design_dock.md §2.4
        card:   '12px',
        btn:    '8px',
        pill:   '999px',
        modal:  '16px',
        input:  '8px',
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        shimmer: {
          from: { backgroundPosition: '-200% 0' },
          to:   { backgroundPosition:  '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
