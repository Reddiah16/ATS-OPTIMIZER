/**
 * Global theme tokens — use with Tailwind arbitrary values or CSS var().
 * Example: style={{ color: "var(--text-primary)" }}
 */
export const themeTokens = {
  fonts: {
    display: "var(--font-display)",
    body: "var(--font-body)",
    mono: "var(--font-mono)",
  },
  spacing: {
    pageX: "var(--space-page-x)",
    section: "var(--space-section)",
    card: "var(--space-card)",
  },
  surfaces: {
    base: "var(--bg-base)",
    surface: "var(--bg-surface)",
    elevated: "var(--bg-elevated)",
    muted: "var(--bg-muted)",
  },
  text: {
    primary: "var(--text-primary)",
    secondary: "var(--text-secondary)",
    tertiary: "var(--text-tertiary)",
  },
  glass: {
    bg: "var(--glass-bg)",
    border: "var(--glass-border)",
    blur: "var(--glass-blur)",
  },
  gradients: {
    brand: "var(--gradient-brand)",
    mesh: "var(--gradient-mesh)",
    surface: "var(--gradient-surface)",
  },
} as const;
