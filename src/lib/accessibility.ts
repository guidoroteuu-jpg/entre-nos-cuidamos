// Sistema central de acessibilidade — aplica preferências no <html> e persiste em localStorage.

export type FontScale = "sm" | "md" | "lg" | "xl";
export type ContrastMode = "normal" | "high" | "inverted";
export type ThemeMode = "light" | "dark" | "system";

export interface A11ySettings {
  theme: ThemeMode;
  fontScale: FontScale;
  contrast: ContrastMode;
  reducedMotion: boolean;
  dyslexiaFont: boolean;
  underlineLinks: boolean;
  largePointer: boolean;
  highAccessibility: boolean;
}

export const A11Y_STORAGE_KEY = "entre_nos_a11y_settings";
export const LEGACY_HIGH_A11Y_KEY = "entre_nos_high_accessibility";

export const defaultSettings: A11ySettings = {
  theme: "light",
  fontScale: "md",
  contrast: "normal",
  reducedMotion: false,
  dyslexiaFont: false,
  underlineLinks: false,
  largePointer: false,
  highAccessibility: false,
};

const fontScaleMap: Record<FontScale, string> = {
  sm: "0.9375rem",
  md: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
};

export const loadSettings = (): A11ySettings => {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const raw = localStorage.getItem(A11Y_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<A11ySettings>;
      return { ...defaultSettings, ...parsed };
    }
    // Migração do flag antigo
    const legacy = localStorage.getItem(LEGACY_HIGH_A11Y_KEY);
    if (legacy === "true") {
      return { ...defaultSettings, highAccessibility: true };
    }
  } catch {
    // ignore
  }
  return defaultSettings;
};

export const saveSettings = (settings: A11ySettings) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(settings));
};

export const applySettings = (settings: A11ySettings) => {
  if (typeof window === "undefined") return;
  const html = document.documentElement;
  const body = document.body;

  // Tema (claro/escuro/sistema)
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = settings.theme === "dark" || (settings.theme === "system" && prefersDark);
  html.classList.toggle("dark", isDark);

  // Tamanho de fonte
  html.style.setProperty("font-size", fontScaleMap[settings.fontScale]);

  // Contraste
  body.classList.toggle("high-contrast", settings.contrast === "high");
  body.classList.toggle("inverted-contrast", settings.contrast === "inverted");

  // Modo de alta acessibilidade (legado)
  body.classList.toggle("high-accessibility", settings.highAccessibility);

  // Movimento reduzido
  body.classList.toggle("a11y-reduced-motion", settings.reducedMotion);

  // Fonte para dislexia
  body.classList.toggle("a11y-dyslexia-font", settings.dyslexiaFont);

  // Links sublinhados
  body.classList.toggle("a11y-underline-links", settings.underlineLinks);

  // Ponteiro grande
  body.classList.toggle("a11y-large-pointer", settings.largePointer);
};

export const initAccessibility = () => {
  applySettings(loadSettings());
};
