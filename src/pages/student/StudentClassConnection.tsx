import { useState } from "react";
import StudentLayout from "@/components/layout/StudentLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Send, Heart, ShieldAlert, Users, Lock, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import EmptyState from "@/components/EmptyState";
import { PageHeader, PageShell } from "@/components/ui/kit";

interface Compliment {
  id: number;
  to: string;
  message: string;
  createdAt: string; // ex.: "agora", "há 2h"
  reactions: number;
}

const mockCompliments: Compliment[] = [
  { id: 1, to: "Ana", message: "Você sempre me ajuda nas matérias e nem sabe o quanto isso significa pra mim. Obrigada!", createdAt: "há 10min", reactions: 4 },
  { id: 2, to: "Pedro", message: "Cara, seu jeito de fazer todo mundo rir no recreio salva meus dias.", createdAt: "há 1h", reactions: 7 },
  { id: 3, to: "Letícia", message: "Quando você me chamou pra sentar com vocês na semana passada, mudou meu dia. Valeu mesmo.", createdAt: "há 3h", reactions: 12 },
  { id: 4, to: "Turma toda", message: "Acho que a gente tá ficando mais unido esse semestre. Tô feliz de fazer parte daqui.", createdAt: "ontem", reactions: 18 },
];

const StudentClassConnection = () => {
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [compliments, setCompliments] = useState<Compliment[]>(mockCompliments);
  const [sending, setSending] = useState(false);

  // Sinal silencioso
  const [signalSent, setSignalSent] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [holdTimer, setHoldTimer] = useState<number | null>(null);

  const handleReact = (id: number) => {
    setCompliments((cs) => cs.map((c) => (c.id === id ? { ...c, reactions: c.reactions + 1 } : c)));
  };

  const handleSend = () => {
    const r = recipient.trim();
    const m = message.trim();
    if (r.length < 2) { toast.error("Diga pra quem é o elogio."); return; }
    if (r.length > 60) { toast.error("Nome muito longo."); return; }
    if (m.length < 5) { toast.error("Escreva um elogio um pouco maior."); return; }
    if (m.length > 280) { toast.error("Elogio muito longo (máx. 280 caracteres)."); return; }

    setSending(true);
    setTimeout(() => {
      const newC: Compliment = {
        id: Date.now(),
        to: r,
        message: m,
        createdAt: "agora",
        reactions: 0,
      };
      setCompliments([newC, ...compliments]);
      setRecipient("");
      setMessage("");
      setSending(false);
      toast.success("Elogio enviado de forma anônima 💛");
    }, 500);
  };

  // === Sinal silencioso (segurar 2s para evitar toque acidental) ===
  const startHold = () => {
    if (signalSent) return;
    let p = 0;
    const t = window.setInterval(() => {
      p += 5;
      setHoldProgress(p);
      if (p >= 100) {
        window.clearInterval(t);
        setHoldTimer(null);
        triggerSignal();
      }
    }, 100);
    setHoldTimer(t);
  };

  const cancelHold = () => {
    if (holdTimer) {
      window.clearInterval(holdTimer);
      setHoldTimer(null);
    }
    if (!signalSent) setHoldProgress(0);
  };

  const triggerSignal = () => {
    setSignalSent(true);
    setHoldProgress(100);
    toast.success("Seu professor foi avisado. Você não está sozinho.");
  };

  return (
    <StudentLayout>
      <PageShell>
        <PageHeader
          title="Conexão com a turma"
          icon={Users}
          description={
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3" /> Tudo aqui é anônimo. Ninguém vê quem enviou.
            </span>
          }
        />

        {/* Sinal silencioso */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="surface-card p-5"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-status-attention/15 flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="w-5 h-5 text-status-attention" />
            </div>
            <div className="flex-1">
              <h2 className="font-heading font-bold text-sm text-foreground">Sinal silencioso de ajuda</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Sem precisar explicar nada. Seu professor recebe o aviso de que você não está bem hoje.
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col items-center">
            <button
              onMouseDown={startHold}
              onMouseUp={cancelHold}
              onMouseLeave={cancelHold}
              onTouchStart={startHold}
              onTouchEnd={cancelHold}
              disabled={signalSent}
              className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all overflow-hidden border-2 ${
                signalSent
                  ? "bg-status-good/15 border-status-good cursor-default"
                  : "bg-accent/40 border-border hover:border-status-attention active:scale-95"
              }`}
              aria-label="Segurar para enviar sinal silencioso"
            >
              {/* Anel de progresso */}
              {!signalSent && (
                <span
                  className="absolute inset-0 rounded-full bg-status-attention/20 transition-all"
                  style={{ clipPath: `inset(${100 - holdProgress}% 0 0 0)` }}
                />
              )}
              <div className="relative z-10 flex flex-col items-center gap-1">
                {signalSent ? (
                  <>
                    <CheckCircle2 className="w-7 h-7 text-status-good" />
                    <span className="text-xs font-medium text-status-good">Avisado</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-7 h-7 text-status-attention" />
                    <span className="text-xs font-medium text-foreground/80">Segurar</span>
                  </>
                )}
              </div>
            </button>
            <p className="text-xs text-muted-foreground mt-3 text-center max-w-[260px]">
              {signalSent
                ? "Pronto. Em breve um adulto da escola vai chegar perto, com calma."
                : "Segure o botão por 2 segundos. Nenhum colega vê esse pedido."}
            </p>
          </div>
        </motion.div>

        {/* Mural de elogios */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-accent/30 rounded-2xl p-5 border border-border"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-secondary" />
            <h2 className="font-heading font-bold text-sm text-foreground">
              Mande um elogio anônimo
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Diga algo bom pra alguém da turma. O nome de quem enviou nunca aparece — só a mensagem chega.
          </p>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-foreground">Para quem?</label>
              <Input
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Ex.: Ana, Pedro, Turma toda…"
                maxLength={60}
                className="mt-1 bg-card"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground">Sua mensagem</label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escreva algo verdadeiro e gentil…"
                maxLength={280}
                className="mt-1 bg-card min-h-[90px]"
              />
              <p className="text-xs text-muted-foreground mt-1 text-right">
                {message.length}/280
              </p>
            </div>
            <Button
              variant="hero"
              onClick={handleSend}
              disabled={sending || !recipient.trim() || !message.trim()}
              className="w-full micro-btn"
            >
              <Send className="w-4 h-4 mr-2" />
              {sending ? "Enviando…" : "Enviar elogio anônimo"}
            </Button>
          </div>
        </motion.div>

        {/* Mural */}
        <div>
          <h3 className="font-heading font-bold text-sm text-foreground mb-3">
            Mural da turma
          </h3>
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {compliments.map((c, i) => (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ delay: Math.min(i * 0.04, 0.3) }}
                  className="bg-card rounded-xl border border-border shadow-card p-4 micro-card"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">Para</span>
                      <span className="text-sm font-bold text-secondary">{c.to}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{c.createdAt}</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">"{c.message}"</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <span className="text-xs text-muted-foreground italic">— anônimo</span>
                    <button
                      onClick={() => handleReact(c.id)}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-status-problem transition-colors"
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span>{c.reactions}</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {compliments.length === 0 && (
              <EmptyState
                title="O mural está esperando carinho"
                description="Mande o primeiro elogio anônimo para alguém da turma. Pequenas palavras mudam o dia."
              />
            )}
          </div>
        </div>
      </PageShell>
    </StudentLayout>
  );
};

export default StudentClassConnection;
