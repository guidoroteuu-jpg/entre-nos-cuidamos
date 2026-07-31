import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardCheck, CheckCircle2, ChevronRight, Lock } from "lucide-react";
import MoodCat, { catByScore5 } from "@/components/MoodCat";

/**
 * Pesquisa de clima da turma — 100% anônima.
 * - 3 perguntas leves, semanais.
 * - Respostas ficam só localmente (versão atual). Em produção viraria
 *   insert agregado por turma sem user_id.
 */

interface Pergunta {
  id: string;
  texto: string;
  opcoes: { value: number; label: string }[];
}

const PERGUNTAS: Pergunta[] = [
  {
    id: "p1",
    texto: "Como você descreveria o clima da sua turma essa semana?",
    opcoes: [
      { value: 5, label: "Acolhedor" },
      { value: 4, label: "Bom" },
      { value: 3, label: "Neutro" },
      { value: 2, label: "Tenso" },
      { value: 1, label: "Hostil" },
    ],
  },
  {
    id: "p2",
    texto: "Você se sentiu incluído(a) pelos colegas?",
    opcoes: [
      { value: 5, label: "Sempre" },
      { value: 4, label: "Quase sempre" },
      { value: 3, label: "Às vezes" },
      { value: 2, label: "Raramente" },
      { value: 1, label: "Nunca" },
    ],
  },
  {
    id: "p3",
    texto: "Você viu alguém da turma sendo tratado mal essa semana?",
    opcoes: [
      { value: 5, label: "Não" },
      { value: 3, label: "Talvez" },
      { value: 1, label: "Sim" },
    ],
  },
];

const STORAGE_KEY = "entre_nos_climate_survey";

const getWeekKey = () => {
  const d = new Date();
  const onejan = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${week}`;
};

const ClimateSurvey = () => {
  const [respondido, setRespondido] = useState(false);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, number>>({});
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw) as { weekKey: string };
        if (s.weekKey === getWeekKey()) setRespondido(true);
      }
    } catch { /* noop */ }
  }, []);

  const responder = (value: number) => {
    const novas = { ...respostas, [PERGUNTAS[step].id]: value };
    setRespostas(novas);
    if (step < PERGUNTAS.length - 1) {
      setTimeout(() => setStep(step + 1), 200);
    } else {
      // finaliza
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ weekKey: getWeekKey(), respostas: novas, ts: Date.now() })
        );
      } catch { /* noop */ }
      setEnviado(true);
      setTimeout(() => {
        setOpen(false);
        setRespondido(true);
        setEnviado(false);
        setStep(0);
        setRespostas({});
      }, 1800);
    }
  };

  if (respondido) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32 }}
        className="bg-status-good/10 rounded-2xl p-4 border border-status-good/20 flex items-center gap-3"
      >
        <CheckCircle2 className="w-5 h-5 text-status-good flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-foreground">Pesquisa da semana respondida</p>
          <p className="text-[11px] text-muted-foreground">Obrigado! Sua voz ajuda a turma toda.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32 }}
        className="w-full bg-gradient-to-br from-primary/10 to-secondary/10 hover:from-primary/15 rounded-2xl p-4 border border-secondary/20 shadow-card transition-all flex items-center justify-between gap-3 micro-card text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center border border-border">
            <ClipboardCheck className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="font-heading font-bold text-sm text-foreground">Pesquisa de clima da turma</p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
              <Lock className="w-3 h-3" /> 100% anônima • 3 perguntas • 1 min
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/50 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => !enviado && setOpen(false)}
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl p-6 w-full max-w-md border border-border shadow-elevated"
            >
              {enviado ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-full bg-status-good/15 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-7 h-7 text-status-good" />
                  </div>
                  <p className="font-heading font-bold text-foreground">Recebido!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Suas respostas vão pro professor sem identificar você.
                  </p>
                </div>
              ) : (
                <>
                  {/* Header com badge anônimo */}
                  <div className="flex items-center justify-between mb-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-secondary bg-secondary/10 rounded-full px-2 py-0.5">
                      <Lock className="w-3 h-3" /> Anônimo
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {step + 1}/{PERGUNTAS.length}
                    </span>
                  </div>

                  {/* Barra de progresso */}
                  <div className="h-1 rounded-full bg-muted mt-2 mb-5 overflow-hidden">
                    <motion.div
                      className="h-full bg-secondary"
                      initial={{ width: 0 }}
                      animate={{ width: `${((step + 1) / PERGUNTAS.length) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={PERGUNTAS[step].id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                    >
                      <h3 className="font-heading font-bold text-foreground text-base leading-tight mb-4">
                        {PERGUNTAS[step].texto}
                      </h3>
                      <div className="space-y-2">
                        {PERGUNTAS[step].opcoes.map((o) => (
                          <button
                            key={o.value}
                            onClick={() => responder(o.value)}
                            className="w-full flex items-center gap-3 p-3 rounded-xl bg-accent/40 hover:bg-accent/70 border border-border transition-all micro-btn text-left"
                          >
                            <span className="text-2xl">{o.emoji}</span>
                            <span className="text-sm font-medium text-foreground">{o.label}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  <p className="text-[10px] text-muted-foreground text-center mt-4 flex items-center justify-center gap-1">
                    <Lock className="w-2.5 h-2.5" />
                    Suas respostas são agregadas. Ninguém sabe que foi você.
                  </p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ClimateSurvey;
