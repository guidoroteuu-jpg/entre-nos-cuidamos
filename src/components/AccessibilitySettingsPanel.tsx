import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Monitor, Languages, Type, Contrast, MousePointer2, Underline, Sparkles, Eye, RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useI18n, type Language } from "@/lib/i18n";
import {
  applySettings,
  defaultSettings,
  loadSettings,
  saveSettings,
  type A11ySettings,
  type ContrastMode,
  type FontScale,
  type ThemeMode,
} from "@/lib/accessibility";
import { toast } from "sonner";

const themes: { value: ThemeMode; labelPt: string; labelEn: string; labelEs: string; icon: typeof Sun }[] = [
  { value: "light", labelPt: "Claro", labelEn: "Light", labelEs: "Claro", icon: Sun },
  { value: "dark", labelPt: "Escuro", labelEn: "Dark", labelEs: "Oscuro", icon: Moon },
  { value: "system", labelPt: "Sistema", labelEn: "System", labelEs: "Sistema", icon: Monitor },
];

const fontScales: { value: FontScale; labelPt: string; labelEn: string; labelEs: string; size: string }[] = [
  { value: "sm", labelPt: "Pequeno", labelEn: "Small", labelEs: "Pequeño", size: "text-xs" },
  { value: "md", labelPt: "Padrão", labelEn: "Default", labelEs: "Predeterminado", size: "text-sm" },
  { value: "lg", labelPt: "Grande", labelEn: "Large", labelEs: "Grande", size: "text-base" },
  { value: "xl", labelPt: "Muito grande", labelEn: "Extra large", labelEs: "Muy grande", size: "text-lg" },
];

const contrasts: { value: ContrastMode; labelPt: string; labelEn: string; labelEs: string }[] = [
  { value: "normal", labelPt: "Normal", labelEn: "Normal", labelEs: "Normal" },
  { value: "high", labelPt: "Alto contraste", labelEn: "High contrast", labelEs: "Alto contraste" },
  { value: "inverted", labelPt: "Invertido", labelEn: "Inverted", labelEs: "Invertido" },
];

interface PanelTexts {
  title: string;
  subtitle: string;
  appearance: string;
  appearanceDesc: string;
  language: string;
  languageDesc: string;
  fontSize: string;
  fontSizeDesc: string;
  contrast: string;
  contrastDesc: string;
  motion: string;
  motionDesc: string;
  dyslexia: string;
  dyslexiaDesc: string;
  underline: string;
  underlineDesc: string;
  pointer: string;
  pointerDesc: string;
  highA11y: string;
  highA11yDesc: string;
  reset: string;
  save: string;
  saved: string;
  resetDone: string;
  preview: string;
  previewText: string;
}

const textsByLang: Record<Language, PanelTexts> = {
  "pt-BR": {
    title: "Configurações de acessibilidade",
    subtitle: "Personalize a experiência para ler e navegar com mais conforto.",
    appearance: "Aparência",
    appearanceDesc: "Escolha entre tema claro, escuro ou seguir o sistema.",
    language: "Idioma",
    languageDesc: "Mude o idioma da plataforma.",
    fontSize: "Tamanho da fonte",
    fontSizeDesc: "Aumente ou reduza o texto em toda a plataforma.",
    contrast: "Contraste",
    contrastDesc: "Realce as cores para uma leitura mais clara.",
    motion: "Reduzir animações",
    motionDesc: "Diminui transições e movimento na tela.",
    dyslexia: "Fonte para dislexia",
    dyslexiaDesc: "Espaçamento maior entre letras e palavras.",
    underline: "Sublinhar links",
    underlineDesc: "Facilita a identificação de links em textos.",
    pointer: "Ponteiro grande",
    pointerDesc: "Aumenta o cursor do mouse para localizá-lo melhor.",
    highA11y: "Modo de alta acessibilidade",
    highA11yDesc: "Combina contraste, foco visível e botões maiores.",
    reset: "Restaurar padrão",
    save: "Salvar preferências",
    saved: "Preferências salvas com sucesso!",
    resetDone: "Configurações restauradas para o padrão.",
    preview: "Pré-visualização",
    previewText: "Este é um exemplo de texto. Aqui você vê um link, um botão e um destaque.",
  },
  en: {
    title: "Accessibility settings",
    subtitle: "Customize the experience to read and navigate more comfortably.",
    appearance: "Appearance",
    appearanceDesc: "Choose between light, dark, or follow the system.",
    language: "Language",
    languageDesc: "Change the platform language.",
    fontSize: "Font size",
    fontSizeDesc: "Increase or decrease text across the platform.",
    contrast: "Contrast",
    contrastDesc: "Boost colors for clearer reading.",
    motion: "Reduce animations",
    motionDesc: "Lowers transitions and on-screen motion.",
    dyslexia: "Dyslexia-friendly font",
    dyslexiaDesc: "Wider spacing between letters and words.",
    underline: "Underline links",
    underlineDesc: "Makes links easier to spot in text.",
    pointer: "Large pointer",
    pointerDesc: "Enlarges the mouse cursor for visibility.",
    highA11y: "High accessibility mode",
    highA11yDesc: "Combines contrast, visible focus and larger buttons.",
    reset: "Reset to defaults",
    save: "Save preferences",
    saved: "Preferences saved successfully!",
    resetDone: "Settings reset to default.",
    preview: "Preview",
    previewText: "This is a sample text. Here you can see a link, a button and a highlight.",
  },
  es: {
    title: "Configuración de accesibilidad",
    subtitle: "Personaliza la experiencia para leer y navegar con más comodidad.",
    appearance: "Apariencia",
    appearanceDesc: "Elige entre tema claro, oscuro o seguir el sistema.",
    language: "Idioma",
    languageDesc: "Cambia el idioma de la plataforma.",
    fontSize: "Tamaño de fuente",
    fontSizeDesc: "Aumenta o reduce el texto en toda la plataforma.",
    contrast: "Contraste",
    contrastDesc: "Realza los colores para una lectura más clara.",
    motion: "Reducir animaciones",
    motionDesc: "Disminuye las transiciones y el movimiento en pantalla.",
    dyslexia: "Fuente para dislexia",
    dyslexiaDesc: "Mayor espaciado entre letras y palabras.",
    underline: "Subrayar enlaces",
    underlineDesc: "Facilita identificar enlaces en los textos.",
    pointer: "Puntero grande",
    pointerDesc: "Aumenta el cursor del ratón para verlo mejor.",
    highA11y: "Modo de alta accesibilidad",
    highA11yDesc: "Combina contraste, foco visible y botones más grandes.",
    reset: "Restaurar predeterminado",
    save: "Guardar preferencias",
    saved: "¡Preferencias guardadas con éxito!",
    resetDone: "Configuración restaurada al predeterminado.",
    preview: "Vista previa",
    previewText: "Este es un texto de ejemplo. Aquí ves un enlace, un botón y un destaque.",
  },
};

const AccessibilitySettingsPanel = () => {
  const { language, languages, setLanguage } = useI18n();
  const [settings, setSettings] = useState<A11ySettings>(() => loadSettings());
  const t = textsByLang[language];

  // Aplica em tempo real para o usuário ver as mudanças.
  useEffect(() => {
    applySettings(settings);
  }, [settings]);

  const update = <K extends keyof A11ySettings>(key: K, value: A11ySettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    saveSettings(settings);
    applySettings(settings);
    toast.success(t.saved);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    saveSettings(defaultSettings);
    applySettings(defaultSettings);
    toast.success(t.resetDone);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">{t.title}</h1>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
      </div>

      {/* Aparência */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="surface-card p-5 sm:p-6 space-y-4"
      >
        <header className="flex items-center gap-2">
          <Sun className="w-5 h-5 text-secondary" aria-hidden="true" />
          <h2 className="font-heading font-bold text-foreground">{t.appearance}</h2>
        </header>
        <p className="text-xs text-muted-foreground">{t.appearanceDesc}</p>
        <div role="radiogroup" aria-label={t.appearance} className="grid grid-cols-3 gap-2">
          {themes.map((theme) => {
            const Icon = theme.icon;
            const label = language === "en" ? theme.labelEn : language === "es" ? theme.labelEs : theme.labelPt;
            const active = settings.theme === theme.value;
            return (
              <button
                key={theme.value}
                role="radio"
                aria-checked={active}
                onClick={() => update("theme", theme.value)}
                className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all micro-btn ${
                  active ? "border-primary bg-accent text-foreground" : "border-border bg-background text-muted-foreground hover:border-primary/40"
                }`}
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            );
          })}
        </div>
      </motion.section>

      {/* Idioma */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="surface-card p-5 sm:p-6 space-y-4"
      >
        <header className="flex items-center gap-2">
          <Languages className="w-5 h-5 text-secondary" aria-hidden="true" />
          <h2 className="font-heading font-bold text-foreground">{t.language}</h2>
        </header>
        <p className="text-xs text-muted-foreground">{t.languageDesc}</p>
        <div role="radiogroup" aria-label={t.language} className="grid grid-cols-3 gap-2">
          {(Object.entries(languages) as [Language, string][]).map(([value, label]) => {
            const active = language === value;
            const fullName = value === "pt-BR" ? "Português (BR)" : value === "en" ? "English" : "Español";
            return (
              <button
                key={value}
                role="radio"
                aria-checked={active}
                onClick={() => setLanguage(value)}
                className={`rounded-xl border p-4 text-left transition-all micro-btn ${
                  active ? "border-primary bg-accent text-foreground" : "border-border bg-background text-muted-foreground hover:border-primary/40"
                }`}
              >
                <div className="font-bold text-sm">{label}</div>
                <div className="text-xs text-muted-foreground">{fullName}</div>
              </button>
            );
          })}
        </div>
      </motion.section>

      {/* Tamanho de fonte */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="surface-card p-5 sm:p-6 space-y-4"
      >
        <header className="flex items-center gap-2">
          <Type className="w-5 h-5 text-secondary" aria-hidden="true" />
          <h2 className="font-heading font-bold text-foreground">{t.fontSize}</h2>
        </header>
        <p className="text-xs text-muted-foreground">{t.fontSizeDesc}</p>
        <div role="radiogroup" aria-label={t.fontSize} className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {fontScales.map((scale) => {
            const label = language === "en" ? scale.labelEn : language === "es" ? scale.labelEs : scale.labelPt;
            const active = settings.fontScale === scale.value;
            return (
              <button
                key={scale.value}
                role="radio"
                aria-checked={active}
                onClick={() => update("fontScale", scale.value)}
                className={`flex flex-col items-center gap-1 rounded-xl border p-3 transition-all micro-btn ${
                  active ? "border-primary bg-accent text-foreground" : "border-border bg-background text-muted-foreground hover:border-primary/40"
                }`}
              >
                <span className={`font-bold ${scale.size}`} aria-hidden="true">Aa</span>
                <span className="text-xs">{label}</span>
              </button>
            );
          })}
        </div>
      </motion.section>

      {/* Contraste */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="surface-card p-5 sm:p-6 space-y-4"
      >
        <header className="flex items-center gap-2">
          <Contrast className="w-5 h-5 text-secondary" aria-hidden="true" />
          <h2 className="font-heading font-bold text-foreground">{t.contrast}</h2>
        </header>
        <p className="text-xs text-muted-foreground">{t.contrastDesc}</p>
        <div role="radiogroup" aria-label={t.contrast} className="grid grid-cols-3 gap-2">
          {contrasts.map((c) => {
            const label = language === "en" ? c.labelEn : language === "es" ? c.labelEs : c.labelPt;
            const active = settings.contrast === c.value;
            return (
              <button
                key={c.value}
                role="radio"
                aria-checked={active}
                onClick={() => update("contrast", c.value)}
                className={`rounded-xl border p-3 text-sm transition-all micro-btn ${
                  active ? "border-primary bg-accent text-foreground" : "border-border bg-background text-muted-foreground hover:border-primary/40"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </motion.section>

      {/* Toggles detalhados */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="surface-card p-5 sm:p-6 space-y-1"
      >
        <header className="flex items-center gap-2 mb-3">
          <Eye className="w-5 h-5 text-secondary" aria-hidden="true" />
          <h2 className="font-heading font-bold text-foreground">{language === "en" ? "Detailed adjustments" : language === "es" ? "Ajustes detallados" : "Ajustes detalhados"}</h2>
        </header>

        <ToggleRow
          icon={<Sparkles className="w-4 h-4 text-muted-foreground" />}
          label={t.motion}
          desc={t.motionDesc}
          checked={settings.reducedMotion}
          onChange={(v) => update("reducedMotion", v)}
        />
        <ToggleRow
          icon={<Type className="w-4 h-4 text-muted-foreground" />}
          label={t.dyslexia}
          desc={t.dyslexiaDesc}
          checked={settings.dyslexiaFont}
          onChange={(v) => update("dyslexiaFont", v)}
        />
        <ToggleRow
          icon={<Underline className="w-4 h-4 text-muted-foreground" />}
          label={t.underline}
          desc={t.underlineDesc}
          checked={settings.underlineLinks}
          onChange={(v) => update("underlineLinks", v)}
        />
        <ToggleRow
          icon={<MousePointer2 className="w-4 h-4 text-muted-foreground" />}
          label={t.pointer}
          desc={t.pointerDesc}
          checked={settings.largePointer}
          onChange={(v) => update("largePointer", v)}
        />
        <ToggleRow
          icon={<Contrast className="w-4 h-4 text-muted-foreground" />}
          label={t.highA11y}
          desc={t.highA11yDesc}
          checked={settings.highAccessibility}
          onChange={(v) => update("highAccessibility", v)}
        />
      </motion.section>

      {/* Pré-visualização */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="surface-card p-5 sm:p-6 space-y-3"
      >
        <h2 className="font-heading font-bold text-foreground">{t.preview}</h2>
        <p className="text-foreground">{t.previewText}</p>
        <div className="flex flex-wrap items-center gap-3">
          <a href="#preview" onClick={(e) => e.preventDefault()} className="text-primary hover:underline">
            {language === "en" ? "Example link" : language === "es" ? "Enlace de ejemplo" : "Link de exemplo"}
          </a>
          <Button size="sm">{language === "en" ? "Sample button" : language === "es" ? "Botón de ejemplo" : "Botão de exemplo"}</Button>
          <span className="px-2 py-1 rounded-md bg-accent text-accent-foreground text-sm">
            {language === "en" ? "Highlight" : language === "es" ? "Destacado" : "Destaque"}
          </span>
        </div>
      </motion.section>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={handleSave} className="flex-1" size="lg">
          <Save className="w-4 h-4 mr-2" /> {t.save}
        </Button>
        <Button onClick={handleReset} variant="outline" size="lg">
          <RotateCcw className="w-4 h-4 mr-2" /> {t.reset}
        </Button>
      </div>
    </div>
  );
};

interface ToggleRowProps {
  icon: React.ReactNode;
  label: string;
  desc: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

const ToggleRow = ({ icon, label, desc, checked, onChange }: ToggleRowProps) => (
  <div className="flex items-center justify-between gap-4 py-3 border-b border-border last:border-0">
    <div className="flex items-start gap-3 flex-1">
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
    <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
  </div>
);

export default AccessibilitySettingsPanel;
