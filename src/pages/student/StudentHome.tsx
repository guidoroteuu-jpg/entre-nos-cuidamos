import { useState } from "react";
import { Link } from "react-router-dom";
import StudentLayout from "@/components/layout/StudentLayout";
import { Button } from "@/components/ui/button";
import { MessageCircle, BookOpen, AlertTriangle, MessageSquare, X } from "lucide-react";

/* 6 opções de humor expandidas */
const emojis = [
  { emoji: "😊", label: "Ótimo", desc: "Estou bem!", value: 6 },
  { emoji: "😐", label: "Neutro", desc: "Tá indo...", value: 5 },
  { emoji: "😢", label: "Triste", desc: "Estou triste", value: 4 },
  { emoji: "😤", label: "Frustrado", desc: "Estou irritado", value: 3 },
  { emoji: "😔", label: "Excluído", desc: "Me sinto de fora", value: 2 },
  { emoji: "😞", label: "Muito triste", desc: "Estou sofrendo", value: 1 },
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
  6: "bg-status-good",
  5: "bg-status-good",
  4: "bg-status-attention",
  3: "bg-status-attention",
  2: "bg-status-problem",
  1: "bg-status-severe",
};

/* Tipos de denúncia */
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

  const handleSelect = (value: number) => {
    setSelected(value);
    setSubmitted(true);
    // Se escolheu "Excluído" ou "Muito triste", mostrar mensagem extra
    if (value <= 2) {
      setShowExtraMessage(true);
    } else {
      setShowExtraMessage(false);
    }
    setTimeout(() => setSubmitted(false), 3000);
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
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Olá, {studentName}!</h1>
          <p className="text-muted-foreground text-sm mt-1">Como você está se sentindo hoje?</p>
        </div>

        {/* Check-in emocional — grid 3x2 */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
          <div className="grid grid-cols-3 gap-3">
            {emojis.map((e) => (
              <button
                key={e.value}
                onClick={() => handleSelect(e.value)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                  selected === e.value
                    ? "bg-accent scale-105 shadow-card ring-2 ring-secondary"
                    : "hover:bg-accent/50 hover:scale-105"
                }`}
              >
                <span className="text-3xl">{e.emoji}</span>
                <span className="text-xs font-medium text-foreground">{e.label}</span>
                <span className="text-[10px] text-muted-foreground">{e.desc}</span>
              </button>
            ))}
          </div>
          {submitted && !showExtraMessage && (
            <p className="text-center text-sm text-status-good mt-4 animate-fade-in font-medium">
              Registrado! Obrigado por compartilhar.
            </p>
          )}
          {showExtraMessage && submitted && (
            <div className="mt-4 bg-accent rounded-xl p-4 animate-fade-in">
              <p className="text-sm text-foreground font-medium text-center mb-2">
                Obrigado por compartilhar. Você não está sozinho. O orientador foi notificado de forma discreta.
              </p>
              <Link to="/aluno/chat-ia">
                <Button variant="hero" size="sm" className="w-full">
                  <MessageSquare className="w-4 h-4 mr-1" /> Quer conversar com a Lis agora?
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Histórico da semana */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
          <h2 className="font-heading font-bold text-foreground mb-4">Sua semana</h2>
          <div className="flex items-end justify-between gap-2 h-32">
            {weekData.map((d) => (
              <div key={d.day} className="flex flex-col items-center gap-1 flex-1">
                <div className="w-full flex flex-col justify-end h-24">
                  {d.value > 0 && (
                    <div
                      className={`w-full rounded-t-md ${barColors[d.value] || "bg-muted"} transition-all`}
                      style={{ height: `${(d.value / 6) * 100}%` }}
                    />
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground font-medium">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Links rápidos */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/aluno/chat" className="bg-card rounded-xl p-4 border border-border shadow-card hover:shadow-elevated transition-all text-center">
            <MessageCircle className="w-6 h-6 text-secondary mx-auto" />
            <p className="text-sm font-medium text-foreground mt-2">Chat da Turma</p>
          </Link>
          <Link to="/aluno/diario" className="bg-card rounded-xl p-4 border border-border shadow-card hover:shadow-elevated transition-all text-center">
            <BookOpen className="w-6 h-6 text-secondary mx-auto" />
            <p className="text-sm font-medium text-foreground mt-2">Meu Diário</p>
          </Link>
        </div>

        {/* Botão de denúncia */}
        <button
          onClick={() => setShowComplaintModal(true)}
          className="w-full bg-destructive/10 hover:bg-destructive/15 text-destructive rounded-xl p-4 border border-destructive/20 transition-all flex items-center justify-center gap-2"
        >
          <AlertTriangle className="w-5 h-5" />
          <span className="font-medium text-sm">Fazer uma denúncia</span>
        </button>
      </div>

      {/* Modal de denúncia */}
      {showComplaintModal && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md border border-border shadow-elevated animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-foreground">Fazer uma denúncia</h2>
              <button onClick={() => setShowComplaintModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {complaintSent ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-status-good/10 flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="w-6 h-6 text-status-good" />
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
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
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
                    className="w-full min-h-[100px] bg-accent rounded-xl p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
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
                  className="w-full"
                  onClick={handleComplaintSubmit}
                  disabled={!complaintType || !complaintDesc.trim()}
                >
                  Enviar denúncia
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </StudentLayout>
  );
};

export default StudentHome;
