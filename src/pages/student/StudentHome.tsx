import { useState } from "react";
import { Link } from "react-router-dom";
import StudentLayout from "@/components/layout/StudentLayout";
import { Button } from "@/components/ui/button";
import { MessageCircle, BookOpen, AlertTriangle, MessageSquare, X, Wind } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import WeeklyMission from "@/components/WeeklyMission";
import CalmExercise from "@/components/CalmExercise";
import AchievementsPanel, { trackCheckinToday } from "@/components/AchievementsPanel";
import ClimateSurvey from "@/components/ClimateSurvey";
import FacialCheckin from "@/components/FacialCheckin";
import MoodCat, { catByScore6 } from "@/components/MoodCat";

const emojis = [
  { label: "Ótimo", desc: "Estou bem!", value: 6 },
  { label: "Neutro", desc: "Tá indo...", value: 5 },
  { label: "Triste", desc: "Estou triste", value: 4 },
  { label: "Frustrado", desc: "Estou irritado", value: 3 },
  { label: "Excluído", desc: "Me sinto de fora", value: 2 },
  { label: "Muito triste", desc: "Estou sofrendo", value: 1 },
];

const weekData = [
  { day: "Seg", value: 6 },
  { day: "Ter", value: 5 },
  { day: "Qua", value: 4 },
  { day: "Qui", value: 6 },
  { day: "Sex", value: 3 },
  { day: "Sáb", value: 0 },
  { day: "Dom", value: 0 },
];

const barColors: Record<number, string> = {
  6: "bg-status-good", 5: "bg-status-good",
  4: "bg-status-attention", 3: "bg-status-attention",
  2: "bg-status-problem", 1: "bg-status-severe",
};

const complaintTypes = ["Bullying", "Assédio", "Exclusão", "Violência", "Outro"];

const StudentHome = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showExtraMessage, setShowExtraMessage] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [complaintType, setComplaintType] = useState("");
  const [complaintDesc, setComplaintDesc] = useState("");
  const [complaintIdentify, setComplaintIdentify] = useState(false);
  const [complaintSent, setComplaintSent] = useState(false);
  const [showCheckConfirm, setShowCheckConfirm] = useState(false);

  const [showCalm, setShowCalm] = useState(false);
  const [calmIntro, setCalmIntro] = useState<string | undefined>(undefined);

  const handleSelect = (value: number) => {
    setSelected(value);
    setShowCheckConfirm(true);
    trackCheckinToday();
    if (value <= 2) {
      setShowExtraMessage(true);
    } else {
      setShowExtraMessage(false);
    }
    setTimeout(() => {
      setShowCheckConfirm(false);
      setSubmitted(true);
      // Lis sugere exercício de calma para humores baixos (Frustrado, Excluído, Muito triste)
      if (value <= 3) {
        const intros: Record<number, string> = {
          3: "Vi que hoje a coisa tá pesada. Quer respirar comigo só por 1 min?",
          2: "Sentir-se de fora dói. Vamos fazer um exercício rápido pra acalmar?",
          1: "Tô aqui com você. Que tal a gente respirar junto agora?",
        };
        setCalmIntro(intros[value]);
        setTimeout(() => setShowCalm(true), 1700);
      }
    }, 1500);
  };

  const handleComplaintSubmit = () => {
    if (complaintType && complaintDesc.trim()) {
      setComplaintSent(true);
      setTimeout(() => {
        setShowComplaintModal(false);
        setComplaintSent(false);
        setComplaintType("");
        setComplaintDesc("");
        setComplaintIdentify(false);
      }, 2000);
    }
  };

  const studentName = localStorage.getItem("entre_nos_nome") || "Aluno";

  return (
    <StudentLayout>
      <div className="space-y-5">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-[26px] leading-tight font-extrabold text-foreground tracking-tight">
            Olá, {studentName}!
          </h1>
          <p className="text-muted-foreground text-sm mt-1.5">Como você está se sentindo hoje?</p>
        </motion.div>

        {/* Check-in emocional — grid 3x2 */}
        <motion.section
          className="surface-card p-5 sm:p-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Animação de confirmação */}
          <AnimatePresence>
            {showCheckConfirm && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20"
              >
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center check-circle">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <path d="M10 20 L18 28 L30 12" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="check-mark" />
                  </svg>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="section-eyebrow mb-3">Check-in de hoje</p>

          <div className="grid grid-cols-3 gap-2.5">
            {emojis.map((e, i) => (
              <motion.button
                key={e.value}
                onClick={() => handleSelect(e.value)}
                aria-pressed={selected === e.value}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06, type: "spring", stiffness: 300 }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                className={`tap-target flex flex-col items-center justify-start gap-1 p-3 rounded-2xl border transition-all ${
                  selected === e.value
                    ? "bg-accent border-primary/40 is-selected"
                    : selected !== null
                      ? "border-border/50 bg-card opacity-60 hover:opacity-100 hover:border-primary/25"
                      : "border-border/50 bg-card hover:bg-accent/50 hover:border-primary/25"
                }`}
              >
                <MoodCat mood={catByScore6(e.value)} alt={e.label} className="w-11 h-11" />
                <span className="text-[13px] font-semibold text-foreground leading-tight">{e.label}</span>
                <span className="text-xs text-muted-foreground leading-tight">{e.desc}</span>
              </motion.button>
            ))}
          </div>
          <AnimatePresence>
            {submitted && !showExtraMessage && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center text-sm text-status-good mt-4 font-semibold"
              >
                Registrado! Obrigado por compartilhar.
              </motion.p>
            )}
            {showExtraMessage && submitted && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 surface-inset p-4"
              >
                <p className="text-sm text-foreground font-medium text-center mb-3 leading-relaxed">
                  Obrigado por compartilhar. Você não está sozinho. O orientador foi notificado de forma discreta.
                </p>
                <Link to="/aluno/chat-ia">
                  <Button variant="hero" size="sm" className="w-full btn-shimmer tap-target">
                    <MessageSquare className="w-4 h-4 mr-1" /> Quer conversar com a Lis agora?
                  </Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        <FacialCheckin />

        {/* Histórico da semana */}
        <motion.section
          className="surface-card p-5 sm:p-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="section-title text-base">Sua semana</h2>
            <span className="text-xs text-muted-foreground">quanto mais alto, melhor o dia</span>
          </div>
          <div className="flex items-end justify-between gap-2 h-36">
            {weekData.map((d, i) => (
              <div key={d.day} className="flex flex-col items-center gap-1.5 flex-1">
                <div className="w-full flex flex-col justify-end h-24 rounded-lg bg-muted/50 p-1">
                  {d.value > 0 && (
                    <motion.div
                      className={`w-full rounded-md ${barColors[d.value] || "bg-muted"}`}
                      initial={{ height: 0 }}
                      animate={{ height: `${(d.value / 6) * 100}%` }}
                      transition={{ duration: 0.6, delay: 0.3 + i * 0.08, ease: "easeOut" }}
                      title={`${d.day}: ${d.value} de 6`}
                    />
                  )}
                </div>
                {d.value > 0 ? (
                  <MoodCat mood={catByScore6(d.value)} alt="" className="w-5 h-5 opacity-90" />
                ) : (
                  <span className="w-5 h-5 flex items-center justify-center text-xs text-muted-foreground">–</span>
                )}
                <span className="text-xs text-muted-foreground font-medium">{d.day}</span>
              </div>
            ))}
          </div>
        </motion.section>


        {/* Conquistas e streaks */}
        <AchievementsPanel />

        {/* Missão semanal da Lis */}
        <WeeklyMission />

        {/* Pesquisa de clima anônima */}
        <ClimateSurvey />

        {/* Botão para abrir exercício de calma a qualquer momento */}
        <motion.button
          onClick={() => { setCalmIntro(undefined); setShowCalm(true); }}
          className="w-full surface-card p-4 min-h-[52px] hover:bg-accent/40 transition-all flex items-center justify-center gap-2.5 micro-btn text-foreground"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
        >
          <span className="icon-chip w-8 h-8 rounded-xl">
            <Wind className="w-4 h-4" />
          </span>
          <span className="font-semibold text-sm">Fazer exercício de calma com a Lis</span>
        </motion.button>

        {/* Links rápidos */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { to: "/aluno/chat", icon: MessageCircle, label: "Chat da Turma" },
            { to: "/aluno/diario", icon: BookOpen, label: "Meu Diário" },
          ].map((item, i) => (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
            >
              <Link to={item.to} className="surface-card p-5 transition-all text-center block micro-card">
                <span className="icon-chip mx-auto">
                  <item.icon className="w-5 h-5" />
                </span>
                <p className="text-sm font-semibold text-foreground mt-2.5">{item.label}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Botão de denúncia */}
        <motion.button
          onClick={() => setShowComplaintModal(true)}
          className="w-full bg-destructive/[0.08] hover:bg-destructive/15 text-destructive rounded-2xl p-4 min-h-[52px] border border-destructive/25 transition-all flex items-center justify-center gap-2.5 micro-btn"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <AlertTriangle className="w-5 h-5" />
          <span className="font-semibold text-sm">Fazer uma denúncia</span>
        </motion.button>

      </div>

      {/* Modal de denúncia */}
      <AnimatePresence>
        {showComplaintModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card rounded-2xl p-6 w-full max-w-md border border-border shadow-elevated"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading font-bold text-foreground">Fazer uma denúncia</h2>
                <button onClick={() => setShowComplaintModal(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {complaintSent ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-status-good/10 flex items-center justify-center mx-auto mb-3 check-circle">
                    <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                      <path d="M8 16 L14 22 L24 10" stroke="hsl(142, 70%, 45%)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="check-mark" />
                    </svg>
                  </div>
                  <p className="font-medium text-foreground">Denúncia enviada</p>
                  <p className="text-sm text-muted-foreground mt-1">Sua denúncia será analisada com cuidado.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Tipo</label>
                    <div className="flex flex-wrap gap-2">
                      {complaintTypes.map((t) => (
                        <button
                          key={t}
                          onClick={() => setComplaintType(t)}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all micro-btn ${
                            complaintType === t
                              ? "gradient-hero text-primary-foreground"
                              : "bg-accent text-foreground hover:bg-accent/80"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Descrição</label>
                    <textarea
                      value={complaintDesc}
                      onChange={(e) => setComplaintDesc(e.target.value)}
                      placeholder="Conte o que aconteceu..."
                      className="w-full min-h-[100px] bg-accent rounded-xl p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary resize-none micro-input"
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={complaintIdentify}
                      onChange={(e) => setComplaintIdentify(e.target.checked)}
                      className="rounded border-border"
                    />
                    <span className="text-sm text-foreground">Quero que o professor saiba que sou eu</span>
                  </label>
                  <Button
                    variant="hero"
                    className="w-full micro-btn"
                    onClick={handleComplaintSubmit}
                    disabled={!complaintType || !complaintDesc.trim()}
                  >
                    Enviar denúncia
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exercício de calma guiado pela Lis */}
      <CalmExercise open={showCalm} onClose={() => setShowCalm(false)} intro={calmIntro} />
    </StudentLayout>
  );
};

export default StudentHome;
