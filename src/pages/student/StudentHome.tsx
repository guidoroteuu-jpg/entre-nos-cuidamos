import { useState } from "react";
import StudentLayout from "@/components/layout/StudentLayout";

const emojis = [
  { emoji: "😊", label: "Bem", value: 4 },
  { emoji: "😐", label: "Normal", value: 3 },
  { emoji: "😢", label: "Triste", value: 2 },
  { emoji: "😤", label: "Irritado", value: 1 },
];

const weekData = [
  { day: "Seg", value: 4 },
  { day: "Ter", value: 3 },
  { day: "Qua", value: 2 },
  { day: "Qui", value: 4 },
  { day: "Sex", value: 3 },
  { day: "Sáb", value: 0 },
  { day: "Dom", value: 0 },
];

const barColors: Record<number, string> = {
  4: "bg-status-good",
  3: "bg-status-attention",
  2: "bg-status-problem",
  1: "bg-status-severe",
};

const StudentHome = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (value: number) => {
    setSelected(value);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Olá! 👋</h1>
          <p className="text-muted-foreground text-sm mt-1">Como você está se sentindo hoje?</p>
        </div>

        {/* Check-in emocional */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
          <div className="flex justify-center gap-4">
            {emojis.map((e) => (
              <button
                key={e.value}
                onClick={() => handleSelect(e.value)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                  selected === e.value
                    ? "bg-accent scale-110 shadow-card"
                    : "hover:bg-accent/50 hover:scale-105"
                }`}
              >
                <span className="text-4xl">{e.emoji}</span>
                <span className="text-xs text-muted-foreground font-medium">{e.label}</span>
              </button>
            ))}
          </div>
          {submitted && (
            <p className="text-center text-sm text-status-good mt-4 animate-fade-in font-medium">
              ✓ Registrado! Obrigado por compartilhar.
            </p>
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
                      style={{ height: `${(d.value / 4) * 100}%` }}
                    />
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground font-medium">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3">
          <a href="/aluno/chat" className="bg-card rounded-xl p-4 border border-border shadow-card hover:shadow-elevated transition-all text-center">
            <span className="text-2xl">💬</span>
            <p className="text-sm font-medium text-foreground mt-2">Chat Anônimo</p>
          </a>
          <a href="/aluno/diario" className="bg-card rounded-xl p-4 border border-border shadow-card hover:shadow-elevated transition-all text-center">
            <span className="text-2xl">📔</span>
            <p className="text-sm font-medium text-foreground mt-2">Meu Diário</p>
          </a>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentHome;
