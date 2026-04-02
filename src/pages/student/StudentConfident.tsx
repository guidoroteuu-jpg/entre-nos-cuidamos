import { useState } from "react";
import StudentLayout from "@/components/layout/StudentLayout";
import { Button } from "@/components/ui/button";
import { Users, ShieldCheck, CheckCircle } from "lucide-react";

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

  const handleConfirm = () => {
    if (selected) setConfirmed(true);
  };

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-secondary" /> Meu Confidente
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Escolha alguém de confiança. Essa pessoa receberá alertas anônimos para te apoiar — sem saber quem enviou.
          </p>
        </div>

        {confirmed ? (
          <div className="bg-card rounded-2xl p-8 border border-border shadow-card text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-status-good/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-status-good" />
            </div>
            <h2 className="font-heading font-bold text-lg text-foreground mb-2">Confidente escolhido!</h2>
            <p className="text-sm text-muted-foreground">
              Sua escolha é confidencial. Seu confidente receberá orientações de como ajudar, sem saber quem o escolheu.
            </p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => { setConfirmed(false); setSelected(null); }}>
              Trocar confidente
            </Button>
          </div>
        ) : (
          <>
            <div className="bg-accent/50 rounded-xl p-4 border border-border">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-foreground leading-relaxed">
                  Seu confidente pode ser qualquer colega da turma em quem você confia. 
                  Ele não saberá que foi escolhido por você — apenas receberá dicas de como ser um bom amigo.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {classmates.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelected(c.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
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
                </button>
              ))}
            </div>

            <Button variant="hero" className="w-full" onClick={handleConfirm} disabled={!selected}>
              Confirmar escolha
            </Button>
          </>
        )}
      </div>
    </StudentLayout>
  );
};

export default StudentConfident;
