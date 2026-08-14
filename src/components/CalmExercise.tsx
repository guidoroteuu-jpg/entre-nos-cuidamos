import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Wind, Hand, X, Heart } from "lucide-react";

type ExerciseKind = "breathing" | "grounding";

interface Props {
  open: boolean;
  onClose: () => void;
  /** "breathing" inicia direto na respiração; "grounding" no 5-4-3-2-1; undefined mostra o seletor */
  initialKind?: ExerciseKind;
  /** Mensagem de contexto opcional (ex.: "Vi que hoje você está se sentindo triste...") */
  intro?: string;
}

/* ===== Respiração 4-7-8 guiada ===== */
const BREATHING_PHASES: { label: string; duration: number; scale: number }[] = [
  { label: "Inspire pelo nariz", duration: 4, scale: 1.4 },
  { label: "Segure o ar", duration: 7, scale: 1.4 },
  { label: "Expire devagar pela boca", duration: 8, scale: 1 },
];

const BreathingExercise = ({ onDone }: { onDone: () => void }) => {
  const [cycle, setCycle] = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [count, setCount] = useState(BREATHING_PHASES[0]!.duration);
  const totalCycles = 4;

  useEffect(() => {
    if (cycle >= totalCycles) return;
    const t = window.setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          setPhaseIdx((p) => {
            const next = p + 1;
            if (next >= BREATHING_PHASES.length) {
              setCycle((cy) => cy + 1);
              return 0;
            }
            return next;
          });
          return BREATHING_PHASES[(phaseIdx + 1) % BREATHING_PHASES.length]!.duration;
        }
        return c - 1;
      });
    }, 1000);
    return () => window.clearInterval(t);
  }, [phaseIdx, cycle]);

  const phase = BREATHING_PHASES[phaseIdx] ?? BREATHING_PHASES[0]!;
  const finished = cycle >= totalCycles;

  if (finished) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-status-good/15 flex items-center justify-center">
          <Heart className="w-7 h-7 text-status-good" />
        </div>
        <p className="text-sm text-foreground font-medium">Você fez 4 ciclos completos.</p>
        <p className="text-xs text-muted-foreground">Como você se sente agora? Um pouquinho melhor já é uma vitória.</p>
        <Button variant="hero" onClick={onDone} className="micro-btn">Pronto</Button>
      </div>
    );
  }

  return (
    <div className="text-center space-y-6">
      <div className="text-xs text-muted-foreground">
        Ciclo {cycle + 1} de {totalCycles}
      </div>
      <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-full bg-secondary/20"
          animate={{ scale: phase.scale }}
          transition={{ duration: phase.duration, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-4 rounded-full bg-secondary/30"
          animate={{ scale: phase.scale }}
          transition={{ duration: phase.duration, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-8 rounded-full gradient-hero flex items-center justify-center"
          animate={{ scale: phase.scale }}
          transition={{ duration: phase.duration, ease: "easeInOut" }}
        >
          <span className="text-3xl font-bold text-primary-foreground">{count}</span>
        </motion.div>
      </div>
      <div>
        <p className="font-heading font-bold text-foreground">{phase.label}</p>
        <p className="text-xs text-muted-foreground mt-1">Siga a bolinha. Ela cresce e diminui com você.</p>
      </div>
    </div>
  );
};

/* ===== Grounding 5-4-3-2-1 ===== */
const GROUNDING_STEPS = [
  { n: 5, sense: "coisas que você VÊ", icon: "👀", hint: "Olhe ao redor sem pressa." },
  { n: 4, sense: "coisas que você OUVE", icon: "👂", hint: "Sons perto e longe valem." },
  { n: 3, sense: "coisas que você TOCA", icon: "✋", hint: "Sinta a textura — roupa, mesa, pele." },
  { n: 2, sense: "coisas que você CHEIRA", icon: "👃", hint: "Pode ser o ar, sua roupa, qualquer coisa." },
  { n: 1, sense: "coisa que você SENTE O GOSTO", icon: "👅", hint: "Pode ser o gosto da boca mesmo." },
];

const GroundingExercise = ({ onDone }: { onDone: () => void }) => {
  const [step, setStep] = useState(0);
  const finished = step >= GROUNDING_STEPS.length;

  if (finished) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-status-good/15 flex items-center justify-center">
          <Heart className="w-7 h-7 text-status-good" />
        </div>
        <p className="text-sm text-foreground font-medium">Você voltou pro presente.</p>
        <p className="text-xs text-muted-foreground">
          O 5-4-3-2-1 ajuda quando os pensamentos correm rápido. Você pode usar quando quiser.
        </p>
        <Button variant="hero" onClick={onDone} className="micro-btn">Pronto</Button>
      </div>
    );
  }

  const cur = GROUNDING_STEPS[step] ?? GROUNDING_STEPS[0]!;
  return (
    <div className="text-center space-y-5">
      <div className="text-xs text-muted-foreground">Passo {step + 1} de {GROUNDING_STEPS.length}</div>
      <motion.div
        key={step}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="space-y-3"
      >
        <div className="text-6xl">{cur.icon}</div>
        <div>
          <p className="font-heading font-bold text-2xl text-secondary">{cur.n}</p>
          <p className="text-sm text-foreground font-medium mt-1">{cur.sense}</p>
          <p className="text-xs text-muted-foreground mt-2">{cur.hint}</p>
        </div>
      </motion.div>
      <Button variant="hero" onClick={() => setStep(step + 1)} className="micro-btn w-full">
        {step === GROUNDING_STEPS.length - 1 ? "Concluir" : "Encontrei, próximo →"}
      </Button>
    </div>
  );
};

/* ===== Modal principal ===== */
const CalmExercise = ({ open, onClose, initialKind, intro }: Props) => {
  const [kind, setKind] = useState<ExerciseKind | null>(initialKind ?? null);

  useEffect(() => {
    if (open) setKind(initialKind ?? null);
  }, [open, initialKind]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-card rounded-2xl p-6 w-full max-w-md border border-border shadow-elevated relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            {!kind && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-full gradient-hero flex items-center justify-center mb-3">
                    <span className="text-xs font-bold text-primary-foreground">LS</span>
                  </div>
                  <h2 className="font-heading font-bold text-foreground">Vamos fazer juntos?</h2>
                  {intro && (
                    <p className="text-xs text-muted-foreground mt-2">{intro}</p>
                  )}
                </div>

                <button
                  onClick={() => setKind("breathing")}
                  className="w-full bg-accent/40 hover:bg-accent rounded-xl p-4 text-left transition-all border border-border micro-card"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary/15 flex items-center justify-center flex-shrink-0">
                      <Wind className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">Respiração 4-7-8</p>
                      <p className="text-xs text-muted-foreground">~1 min — acalma o coração rápido</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setKind("grounding")}
                  className="w-full bg-accent/40 hover:bg-accent rounded-xl p-4 text-left transition-all border border-border micro-card"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary/15 flex items-center justify-center flex-shrink-0">
                      <Hand className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">Grounding 5-4-3-2-1</p>
                      <p className="text-xs text-muted-foreground">~2 min — pra quando os pensamentos correm</p>
                    </div>
                  </div>
                </button>
              </div>
            )}

            {kind === "breathing" && <BreathingExercise onDone={onClose} />}
            {kind === "grounding" && <GroundingExercise onDone={onClose} />}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CalmExercise;
