import { useEffect, useState } from "react";
import { useLocation } from "@/lib/router-compat";
import { Languages, Accessibility } from "lucide-react";
import { useI18n, type Language } from "@/lib/i18n";
import { applySettings, loadSettings, saveSettings } from "@/lib/accessibility";

const AccessibilityControls = () => {
  const { language, languages, setLanguage, t } = useI18n();
  const location = useLocation();
  const [highAccessibility, setHighAccessibility] = useState(() => loadSettings().highAccessibility);

  useEffect(() => {
    const settings = loadSettings();
    const next = { ...settings, highAccessibility };
    saveSettings(next);
    applySettings(next);
  }, [highAccessibility]);

  // Esconde o widget flutuante na página dedicada de acessibilidade.
  if (location.pathname.endsWith("/acessibilidade")) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex items-center gap-2 rounded-lg border border-border bg-card/95 p-2 shadow-elevated backdrop-blur-lg">
      <label className="sr-only" htmlFor="global-language-select">{t("a11y.languageLabel")}</label>
      <div className="flex items-center gap-1">
        <Languages className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <select
          id="global-language-select"
          value={language}
          onChange={(event) => setLanguage(event.target.value as Language)}
          className="h-9 rounded-md border border-input bg-background px-2 text-sm font-medium text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
          aria-label={t("a11y.languageLabel")}
        >
          {Object.entries(languages).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>
      <button
        type="button"
        onClick={() => setHighAccessibility((current) => !current)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-foreground transition-colors hover:bg-accent focus:outline-hidden focus:ring-2 focus:ring-ring"
        aria-pressed={highAccessibility}
        aria-label={highAccessibility ? t("a11y.highAccessibilityOff") : t("a11y.highAccessibilityOn")}
        title={highAccessibility ? t("a11y.highAccessibilityOff") : t("a11y.highAccessibilityOn")}
      >
        <Accessibility className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
};

export default AccessibilityControls;
