import { useState } from "react";
import StudentLayout from "@/components/layout/StudentLayout";
import { Button } from "@/components/ui/button";
import { Users, ShieldCheck, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader, PageShell } from "@/components/ui/kit";

const classmates = [
  { id: 1, name: "Colega A" },
  { id: 2, name: "Colega B" },
  { id: 3, name: "Colega C" },
  { id: 4, name: "Colega D" },
  { id: 5, name: "Colega E" },
];

const StudentConfident = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => { if (selected) setConfirmed(true); };

  return (
    <StudentLayout>
      <PageShell>
        <PageHeader
          title="Meu Confidente"
          icon={Users}
          description="Escolha alguém de confiança. Essa pessoa receberá alertas anônimos para te apoiar — sem saber quem enviou."
        />

        {confirmed ? (
          <motion.div
            className="surface-card p-8 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-16 h-16 rounded-full bg-status-good/10 flex items-center justify-center mx-auto mb-4 check-circle">
              <CheckCircle className="w-8 h-8 text-status-good" />
            </div>
            <h2 className="font-heading font-bold text-lg text-foreground mb-2">Confidente escolhido!</h2>
            <p className="text-sm text-muted-foreground">
              Sua escolha é confidencial. Seu confidente receberá orientações de como ajudar, sem saber quem o escolheu.
            </p>
            <Button variant="outline" size="sm" className="mt-4 micro-btn" onClick={() => { setConfirmed(false); setSelected(null); }}>
              Trocar confidente
            </Button>
          </motion.div>
        ) : (
          <>
            <motion.div
              className="bg-accent/50 rounded-xl p-4 border border-border"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-foreground leading-relaxed">
                  Seu confidente pode ser qualquer colega da turma em quem você confia. 
                  Ele não saberá que foi escolhido por você — apenas receberá dicas de como ser um bom amigo.
                </p>
              </div>
            </motion.div>

            <div className="space-y-2">
              {classmates.map((c, i) => (
                <motion.button
                  key={c.id}
                  onClick={() => setSelected(c.id)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all micro-card ${
                    selected === c.id
                      ? "border-secondary bg-accent shadow-card"
                      : "border-border bg-card hover:border-secondary/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      selected === c.id ? "gradient-hero text-primary-foreground" : "bg-accent text-muted-foreground"
                    }`}>
                      {c.name.charAt(c.name.length - 1)}
                    </div>
                    <span className="text-sm font-medium text-foreground">{c.name}</span>
                  </div>
                </motion.button>
              ))}
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: selected ? 1 : 0.5 }}>
              <Button variant="hero" className="w-full btn-shimmer micro-btn" onClick={handleConfirm} disabled={!selected}>
                Confirmar escolha
              </Button>
            </motion.div>
          </>
        )}
      </div>
    </StudentLayout>
  );
};

export default StudentConfident;
