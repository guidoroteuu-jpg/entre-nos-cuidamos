/**
 * Tokens de design do Entre Nós.
 * Fonte única de verdade para cores, tipografia e superfícies de vidro
 * usadas fora do CSS (gráficos Recharts, SVGs inline, canvas, etc.).
 * Os valores apontam para as variáveis definidas em src/styles.css.
 */

/** Cor de um token semântico, pronta para uso em SVG/Recharts. */
export const token = (name: string) => `hsl(var(--${name}))`;

/** Cor de um token com opacidade (0–1). */
export const tokenAlpha = (name: string, alpha: number) =>
  `hsl(var(--${name}) / ${alpha})`;

/** Paleta de marca (Roxo Aurora Claro). */
export const brand = {
  purple: token("purple-medium"),
  purpleDark: token("purple-dark"),
  purpleLight: token("purple-light"),
  pink: token("purple-glow"),
  foreground: token("foreground"),
  muted: token("muted-foreground"),
  border: token("border"),
  card: token("card"),
} as const;

/** Cores de status compartilhadas por gráficos, radares e badges. */
export const statusColors = {
  good: token("status-good"),
  attention: token("status-attention"),
  problem: token("status-problem"),
  severe: token("status-severe"),
} as const;

export type StatusKey = keyof typeof statusColors;

export const statusLabels: Record<StatusKey, string> = {
  good: "Bem",
  attention: "Atenção",
  problem: "Problema",
  severe: "Grave",
};

/** Classes utilitárias de background por status (Tailwind). */
export const statusBg: Record<StatusKey, string> = {
  good: "bg-status-good",
  attention: "bg-status-attention",
  problem: "bg-status-problem",
  severe: "bg-status-severe",
};

/** Sequência de cores para séries de gráficos sem semântica de status. */
export const chartSeries = [
  token("purple-medium"),
  token("purple-glow"),
  token("purple-dark"),
  token("status-good"),
  token("status-attention"),
] as const;

/** Props padrão para eixos, grid e tooltip do Recharts. */
export const chartAxis = {
  stroke: token("muted-foreground"),
  tick: { fontSize: 12, fill: token("muted-foreground") },
  tickLine: false,
  axisLine: false,
} as const;

export const chartGrid = {
  strokeDasharray: "4 6",
  vertical: false,
  stroke: tokenAlpha("border", 0.9),
} as const;

export const chartTooltip = {
  cursor: { fill: tokenAlpha("purple-medium", 0.08) },
  contentStyle: {
    borderRadius: 16,
    border: `1px solid ${tokenAlpha("border", 0.9)}`,
    background: "hsl(0 0% 100% / 0.92)",
    backdropFilter: "blur(18px)",
    boxShadow: "var(--shadow-card)",
    fontSize: 12,
    fontFamily: "var(--font-body)",
    color: token("foreground"),
  },
  labelStyle: { fontWeight: 700, color: token("foreground") },
} as const;

/** Superfícies de vidro (classes utilitárias definidas em styles.css). */
export const surfaces = {
  card: "surface-card",
  inset: "surface-inset",
  panel: "glass-panel",
  soft: "glass-soft",
} as const;

/** Tipografia. */
export const typography = {
  heading: "var(--font-heading)",
  body: "var(--font-body)",
} as const;
