import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Flame, Lock, Sparkles, X } from "lucide-react";

/**
 * Sistema leve e local de conquistas/streaks.
 * - Lê eventos do localStorage gravados pelas outras telas.
 * - Não envia nada para o backend (gamificação puramente motivacional).
 *
 * Eventos suportados (localStorage keys):
 *   entre_nos_checkins_dates: string[]   // ISO yyyy-mm-dd
 *   entre_nos_diary_count: number
 *   entre_nos_missions_done: number
 *   lis_weekly_mission: { done: boolean }
 */

interface Badge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  /** Função que recebe stats e retorna progresso 0-1 (1 = conquistado). */
  progress: (s: Stats) => number;
}

interface Stats {
  streak: number;
  totalCheckins: number;
  diaryEntries: number;
  missionsDone: number;
}

const BADGES: Badge[] = [
  {
    id: "first_step",
    title: "Primeiro passo",
    description: "Fez seu primeiro check-in.",
    emoji: "🌱",
    progress: (s) => Math.min(s.totalCheckins / 1, 1),
  },
  {
    id: "streak_3",
    title: "3 dias seguidos",
    description: "Check-in 3 dias em sequência.",
    emoji: "🔥",
    progress: (s) => Math.min(s.streak / 3, 1),
  },
  {
    id: "streak_7",
    title: "Semana cheia",
    description: "7 dias consecutivos de check-in.",
    emoji: "⭐",
    progress: (s) => Math.min(s.streak / 7, 1),
  },
  {
    id: "diary_starter",
    title: "Escritor iniciante",
    description: "Escreveu sua 1ª entrada no diário.",
    emoji: "📖",
    progress: (s) => Math.min(s.diaryEntries / 1, 1),
  },
  {
    id: "diary_5",
    title: "Pensador",
    description: "5 entradas no diário.",
    emoji: "✍️",
    progress: (s) => Math.min(s.diaryEntries / 5, 1),
  },
  {
    id: "mission_1",
    title: "Em missão",
    description: "Completou 1 missão da Lis.",
    emoji: "🎯",
    progress: (s) => Math.min(s.missionsDone / 1, 1),
  },
  {
    id: "mission_4",
    title: "Persistente",
    description: "Completou 4 missões da Lis.",
    emoji: "🏆",
    progress: (s) => Math.min(s.missionsDone / 4, 1),
  },
];

const todayKey = () => new Date().toISOString().slice(0, 10);

const computeStreak = (dates: string[]): number => {
  if (!dates.length) return 0;
  const set = new Set(dates);
  let streak = 0;
  const d = new Date();
  while (set.has(d.toISOString().slice(0, 10))) {
    streak += 1;
    d.setDate(d.getDate() - 1);
  }
  return streak;
};

const readStats = (): Stats => {
  try {
    const dates: string[] = JSON.parse(localStorage.getItem("entre_nos_checkins_dates") || "[]");
    const diaryEntries = Number(localStorage.getItem("entre_nos_diary_count") || "0");
    const missionsDone = Number(localStorage.getItem("entre_nos_missions_done") || "0");
    return {
      streak: computeStreak(dates),
      totalCheckins: dates.length,
      diaryEntries,
      missionsDone,
    };
  } catch {
    return { streak: 0, totalCheckins: 0, diaryEntries: 0, missionsDone: 0 };
  }
};

/** Helper exportado para outras telas registrarem eventos. */
export const trackCheckinToday = () => {
  try {
    const raw = localStorage.getItem("entre_nos_checkins_dates");
    const arr: string[] = raw ? JSON.parse(raw) : [];
    const t = todayKey();
    if (!arr.includes(t)) {
      arr.push(t);
      localStorage.setItem("entre_nos_checkins_dates", JSON.stringify(arr));
    }
  } catch { /* noop */ }
};

const AchievementsPanel = () => {
  const [stats, setStats] = useState<Stats>({ streak: 0, totalCheckins: 0, diaryEntries: 0, missionsDone: 0 });
  const [open, setOpen] = useState(false);
  const [celebrate, setCelebrate] = useState<Badge | null>(null);

  useEffect(() => {
    const refresh = () => {
      const s = readStats();
      setStats((prev) => {
        // detectar nova conquista
        const newly = BADGES.find((b) => b.progress(s) >= 1 && b.progress(prev) < 1);
        if (newly) setCelebrate(newly);
        return s;
      });
    };
    refresh();
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    window.addEventListener("storage", onFocus);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("storage", onFocus);
    };
  }, []);

  const earned = BADGES.filter((b) => b.progress(stats) >= 1);

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        className="w-full bg-gradient-to-br from-accent/60 to-secondary/10 hover:from-accent/80 rounded-2xl p-4 border border-secondary/20 shadow-card transition-all flex items-center justify-between micro-card"
        aria-label="Ver minhas conquistas"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center">
            <Award className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="text-left">
            <p className="font-heading font-bold text-sm text-foreground">Minhas conquistas</p>
            <p className="text-xs text-muted-foreground">
              {earned.length}/{BADGES.length} emblemas conquistados
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-card rounded-full px-3 py-1.5 border border-border">
          <Flame className={`w-4 h-4 ${stats.streak > 0 ? "text-status-attention" : "text-muted-foreground"}`} />
          <span className="text-sm font-bold text-foreground">{stats.streak}</span>
          <span className="text-xs text-muted-foreground">dias</span>
        </div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/50 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl p-6 w-full max-w-md border border-border shadow-elevated max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-heading font-bold text-foreground">Suas conquistas</h2>
                  <p className="text-xs text-muted-foreground">Pequenos passos viram emblemas.</p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-accent/40 rounded-xl p-3 text-center">
                  <Flame className="w-4 h-4 mx-auto text-status-attention" />
                  <p className="text-lg font-bold text-foreground mt-1">{stats.streak}</p>
                  <p className="text-xs text-muted-foreground">streak</p>
                </div>
                <div className="bg-accent/40 rounded-xl p-3 text-center">
                  <Sparkles className="w-4 h-4 mx-auto text-secondary" />
                  <p className="text-lg font-bold text-foreground mt-1">{stats.missionsDone}</p>
                  <p className="text-xs text-muted-foreground">missões</p>
                </div>
                <div className="bg-accent/40 rounded-xl p-3 text-center">
                  <Award className="w-4 h-4 mx-auto text-secondary" />
                  <p className="text-lg font-bold text-foreground mt-1">{earned.length}</p>
                  <p className="text-xs text-muted-foreground">emblemas</p>
                </div>
              </div>

              <div className="space-y-2">
                {BADGES.map((b) => {
                  const p = b.progress(stats);
                  const done = p >= 1;
                  return (
                    <div
                      key={b.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        done ? "bg-status-good/10 border-status-good/30" : "bg-accent/30 border-border"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                          done ? "bg-card" : "bg-muted/50 grayscale opacity-60"
                        }`}
                      >
                        {done ? b.emoji : <Lock className="w-4 h-4 text-muted-foreground" />}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${done ? "text-foreground" : "text-muted-foreground"}`}>
                          {b.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{b.description}</p>
                        {!done && (
                          <div className="mt-1.5 h-1 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full bg-secondary transition-all"
                              style={{ width: `${Math.round(p * 100)}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebração ao desbloquear nova conquista */}
      <AnimatePresence>
        {celebrate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-foreground/40 flex items-center justify-center p-4"
            onClick={() => setCelebrate(null)}
          >
            <motion.div
              initial={{ scale: 0.7, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="bg-card rounded-3xl p-6 max-w-xs w-full text-center border border-secondary/30 shadow-elevated"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-5xl mb-3">{celebrate.emoji}</div>
              <p className="text-xs uppercase tracking-wider text-secondary font-bold mb-1">
                Nova conquista!
              </p>
              <h3 className="font-heading text-lg font-bold text-foreground">{celebrate.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{celebrate.description}</p>
              <button
                onClick={() => setCelebrate(null)}
                className="mt-4 w-full py-2.5 rounded-xl gradient-hero text-primary-foreground font-medium text-sm micro-btn"
              >
                Continuar 🎉
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AchievementsPanel;
