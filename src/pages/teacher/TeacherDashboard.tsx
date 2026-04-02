import TeacherLayout from "@/components/layout/TeacherLayout";
import { Users, Lightbulb } from "lucide-react";

const students = [
  { id: 1, status: "good" },{ id: 2, status: "good" },{ id: 3, status: "attention" },
  { id: 4, status: "good" },{ id: 5, status: "problem" },{ id: 6, status: "good" },
  { id: 7, status: "good" },{ id: 8, status: "attention" },{ id: 9, status: "good" },
  { id: 10, status: "severe" },{ id: 11, status: "good" },{ id: 12, status: "good" },
  { id: 13, status: "attention" },{ id: 14, status: "good" },{ id: 15, status: "good" },
  { id: 16, status: "good" },{ id: 17, status: "problem" },{ id: 18, status: "good" },
  { id: 19, status: "good" },{ id: 20, status: "good" },
];

const statusColor: Record<string, string> = {
  good: "bg-status-good",
  attention: "bg-status-attention",
  problem: "bg-status-problem",
  severe: "bg-status-severe",
};

const statusLabel: Record<string, string> = {
  good: "Bem",
  attention: "Atenção",
  problem: "Problema",
  severe: "Grave",
};

const stats = [
  { label: "Bem", count: 13, color: "bg-status-good", pct: "65%" },
  { label: "Atenção", count: 3, color: "bg-status-attention", pct: "15%" },
  { label: "Problema", count: 2, color: "bg-status-problem", pct: "10%" },
  { label: "Grave", count: 1, color: "bg-status-severe", pct: "5%" },
];

const suggestions = [
  "Roda de conversa sobre sentimentos — ideal para turmas com muitos alunos em \"atenção\".",
  "Atividade em duplas aleatórias — ajuda a integrar alunos que estão isolados.",
  "Dinâmica \"eu no lugar do outro\" — promove empatia e reduz conflitos.",
];

const TeacherDashboard = () => (
  <TeacherLayout>
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Dashboard da Turma</h1>
        <p className="text-sm text-muted-foreground">Turma 5A · 20 alunos</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-card rounded-xl p-4 border border-border shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${s.color}`} />
              <span className="text-sm text-muted-foreground">{s.label}</span>
            </div>
            <p className="text-2xl font-heading font-bold text-foreground">{s.count}</p>
            <p className="text-xs text-muted-foreground">{s.pct} da turma</p>
          </div>
        ))}
      </div>

      {/* Radar */}
      <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-secondary" />
          <h2 className="font-heading font-bold text-foreground">Radar da Turma</h2>
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {students.map((s) => (
            <div
              key={s.id}
              className={`aspect-square rounded-lg ${statusColor[s.status]} opacity-80 hover:opacity-100 transition-opacity cursor-pointer relative group`}
              title={statusLabel[s.status]}
            >
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                #{s.id}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-4 flex-wrap">
          {Object.entries(statusLabel).map(([key, label]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${statusColor[key]}`} />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sugestões de dinâmicas */}
      <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
        <h2 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-secondary" /> Sugestões de Dinâmicas
        </h2>
        <div className="space-y-3">
          {suggestions.map((s, i) => (
            <div key={i} className="bg-accent rounded-lg p-3 text-sm text-foreground">
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  </TeacherLayout>
);

export default TeacherDashboard;
