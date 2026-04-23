import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2, RefreshCw } from "lucide-react";

interface Mission {
  id: string;
  text: string;
  category: "conexao" | "autoestima" | "gentileza" | "calma" | "coragem";
  emoji: string;
}

const MISSIONS: Mission[] = [
  { id: "m1", text: "Fale com alguém da turma com quem você nunca conversou", category: "conexao", emoji: "👋" },
  { id: "m2", text: "Escreva uma coisa boa sobre você no diário", category: "autoestima", emoji: "💛" },
  { id: "m3", text: "Mande um elogio anônimo no mural da turma", category: "gentileza", emoji: "✨" },
  { id: "m4", text: "Faça uma pausa de 1 minuto pra respirar entre as aulas", category: "calma", emoji: "🌿" },
  { id: "m5", text: "Agradeça alguém que te ajudou essa semana", category: "gentileza", emoji: "🙏" },
  { id: "m6", text: "Levante a mão pra responder uma pergunta na aula", category: "coragem", emoji: "🦁" },
  { id: "m7", text: "Pergunte como alguém está antes de falar de você", category: "conexao", emoji: "👂" },
  { id: "m8", text: "Anote 3 coisas pelas quais você é grato hoje", category: "autoestima", emoji: "📝" },
  { id: "m9", text: "Convide alguém que está sozinho pra sentar com você", category: "gentileza", emoji: "🤝" },
  { id: "m10", text: "Tire 10 minutos longe do celular antes de dormir", category: "calma", emoji: "🌙" },
];

const STORAGE_KEY = "lis_weekly_mission";

interface Stored {
  weekKey: string;
  mission: Mission;
  done: boolean;
}

/* Calcula chave única da semana atual (ex.: "2026-W17") */
const getWeekKey = () => {
  const d = new Date();
  const onejan = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${week}`;
};

const pickMission = (): Mission =>
  MISSIONS[Math.floor(Math.random() * MISSIONS.length)];

const WeeklyMission = () => {
  const [stored, setStored] = useState<Stored | null>(null);

  useEffect(() => {
    const weekKey = getWeekKey();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw) as Stored;
        if (s.weekKey === weekKey) {
          setStored(s);
          return;
        }
      }
      const fresh: Stored = { weekKey, mission: pickMission(), done: false };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
      setStored(fresh);
    } catch {
      setStored({ weekKey, mission: pickMission(), done: false });
    }
  }, []);

  const toggleDone = () => {
    if (!stored) return;
    const next = { ...stored, done: !stored.done };
    setStored(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      // Conta missão concluída para conquistas (apenas quando passa para "feito")
      if (next.done && !stored.done) {
        const cur = Number(localStorage.getItem("entre_nos_missions_done") || "0");
        localStorage.setItem("entre_nos_missions_done", String(cur + 1));
        window.dispatchEvent(new Event("storage"));
      }
    } catch { /* ignore */ }
  };

  const skip = () => {
    if (!stored) return;
    let m = pickMission();
    while (m.id === stored.mission.id) m = pickMission();
    const next: Stored = { weekKey: stored.weekKey, mission: m, done: false };
    setStored(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };

  if (!stored) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="bg-gradient-to-br from-secondary/10 to-accent/40 rounded-2xl p-5 border border-secondary/20 shadow-card relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-sm text-foreground">Missão da semana da Lis</h2>
            <p className="text-[10px] text-muted-foreground">Pequeno passo, grande diferença.</p>
          </div>
        </div>
        {!stored.done && (
          <button
            onClick={skip}
            className="text-muted-foreground hover:text-secondary transition-colors p-1"
            aria-label="Trocar missão"
            title="Trocar missão"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={stored.mission.id + String(stored.done)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="bg-card rounded-xl p-4 border border-border"
        >
          <div className="flex items-start gap-3">
            <span className="text-3xl flex-shrink-0">{stored.mission.emoji}</span>
            <div className="flex-1">
              <p className={`text-sm font-medium leading-relaxed ${stored.done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                {stored.mission.text}
              </p>
              <button
                onClick={toggleDone}
                className={`mt-3 inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
                  stored.done
                    ? "bg-status-good/15 text-status-good"
                    : "bg-secondary text-secondary-foreground hover:opacity-90"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {stored.done ? "Feito! 🎉" : "Marcar como feito"}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {stored.done && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-status-good text-center mt-3 font-medium"
        >
          Mandou bem! Semana que vem tem missão nova.
        </motion.p>
      )}
    </motion.div>
  );
};

export default WeeklyMission;
