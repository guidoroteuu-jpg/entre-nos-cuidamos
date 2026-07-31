import DirectionLayout from "@/components/layout/DirectionLayout";
import { Users, TrendingUp, TrendingDown, AlertTriangle, BarChart3, Lightbulb, Bell } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line } from "recharts";

/* Dados das turmas */
const classes = [
  { name: "5A", professor: "Prof. Maria", total: 20, good: 13, attention: 3, problem: 2, severe: 1, denuncias: 2, trend: "down" },
  { name: "5B", professor: "Prof. João", total: 22, good: 18, attention: 3, problem: 1, severe: 0, denuncias: 0, trend: "up" },
  { name: "6A", professor: "Prof. Ana", total: 25, good: 20, attention: 3, problem: 1, severe: 1, denuncias: 1, trend: "stable" },
  { name: "6B", professor: "Prof. Carlos", total: 23, good: 15, attention: 5, problem: 2, severe: 1, denuncias: 3, trend: "down" },
  { name: "7A", professor: "Prof. Paula", total: 28, good: 24, attention: 3, problem: 1, severe: 0, denuncias: 0, trend: "up" },
];

/* Ordenar por mais crítica */
const sortedClasses = [...classes].sort((a, b) => {
  const scoreA = a.severe * 4 + a.problem * 3 + a.attention * 2;
  const scoreB = b.severe * 4 + b.problem * 3 + b.attention * 2;
  return scoreB - scoreA;
});

const totalStudents = classes.reduce((a, c) => a + c.total, 0);
const totalGood = classes.reduce((a, c) => a + c.good, 0);
const totalRisk = totalStudents - totalGood;
const totalAlerts = 15;
const totalComplaints = classes.reduce((a, c) => a + c.denuncias, 0);

/* Humor por turma para gráfico de barras */
const classHumorData = classes.map((c) => ({
  turma: c.name,
  humor: Number(((c.good * 5 + c.attention * 3 + c.problem * 2 + c.severe * 1) / c.total).toFixed(1)),
}));

/* Tendência 3 meses */
const trendData = [
  { mes: "Jan", humor: 3.8 },
  { mes: "Fev", humor: 3.9 },
  { mes: "Mar", humor: 3.6 },
];

/* Mapa de calor semanal */
const heatmapData = [
  { dia: "Seg", manha: 4.0, tarde: 3.5 },
  { dia: "Ter", manha: 3.8, tarde: 3.6 },
  { dia: "Qua", manha: 3.5, tarde: 3.2 },
  { dia: "Qui", manha: 4.1, tarde: 3.9 },
  { dia: "Sex", manha: 3.7, tarde: 3.4 },
];

const getHeatColor = (val: number) => {
  if (val >= 4) return "bg-status-good";
  if (val >= 3.5) return "bg-status-attention";
  if (val >= 3) return "bg-status-problem";
  return "bg-status-severe";
};

/* Alertas da escola */
const riskPct = Math.round((totalRisk / totalStudents) * 100);

/* Sugestões automáticas */
const suggestions = [];
const isolatedClasses = classes.filter((c) => c.severe > 0 || c.problem >= 2);
if (isolatedClasses.length >= 2) {
  suggestions.push(`${isolatedClasses.length} turmas têm padrão de isolamento — considere dinâmicas de integração`);
}
if (riskPct > 20) {
  suggestions.push(`A escola tem ${riskPct}% dos alunos em situação de risco — atenção redobrada necessária`);
}
if (totalComplaints > 3) {
  suggestions.push(`${totalComplaints} denúncias ativas — agende reunião com orientação pedagógica`);
}

const DirectionPanel = () => (
  <DirectionLayout>
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Painel da Escola</h1>
        <p className="text-sm text-muted-foreground">Dados agregados · Nenhum aluno identificado</p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="surface-card p-5">
          <Users className="w-5 h-5 text-secondary mb-2" />
          <p className="text-sm text-muted-foreground">Total de alunos</p>
          <p className="text-3xl font-heading font-bold text-foreground">{totalStudents}</p>
        </div>
        <div className="surface-card p-5">
          <BarChart3 className="w-5 h-5 text-secondary mb-2" />
          <p className="text-sm text-muted-foreground">Turmas</p>
          <p className="text-3xl font-heading font-bold text-foreground">{classes.length}</p>
        </div>
        <div className="surface-card p-5">
          <Bell className="w-5 h-5 text-status-attention mb-2" />
          <p className="text-sm text-muted-foreground">Alertas ativos</p>
          <p className="text-3xl font-heading font-bold text-status-attention">{totalAlerts}</p>
        </div>
        <div className="surface-card p-5">
          <AlertTriangle className="w-5 h-5 text-status-problem mb-2" />
          <p className="text-sm text-muted-foreground">Denúncias pendentes</p>
          <p className="text-3xl font-heading font-bold text-status-problem">{totalComplaints}</p>
        </div>
      </div>

      {/* Humor por turma (gráfico de barras) */}
      <div className="surface-card p-5 sm:p-6">
        <h2 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-secondary" /> Humor médio por turma
        </h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={classHumorData}>
              <XAxis dataKey="turma" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="humor" fill="hsl(245, 40%, 52%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparativo de turmas (tabela) */}
      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="font-heading font-bold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-secondary" /> Comparativo entre turmas
          </h2>
          <p className="text-xs text-muted-foreground">Ordenado por mais crítica</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-accent">
                <th className="text-left p-3 font-medium text-muted-foreground">Turma</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Professor</th>
                <th className="text-center p-3 font-medium text-status-good">Bem</th>
                <th className="text-center p-3 font-medium text-status-attention">Atenção</th>
                <th className="text-center p-3 font-medium text-status-problem">Problema</th>
                <th className="text-center p-3 font-medium text-status-severe">Grave</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Denúncias</th>
              </tr>
            </thead>
            <tbody>
              {sortedClasses.map((c) => (
                <tr key={c.name} className="border-b border-border hover:bg-accent/50 transition-colors cursor-pointer">
                  <td className="p-3 font-medium text-foreground">{c.name}</td>
                  <td className="p-3 text-muted-foreground">{c.professor}</td>
                  <td className="p-3 text-center text-status-good font-medium">{c.good}</td>
                  <td className="p-3 text-center text-status-attention font-medium">{c.attention}</td>
                  <td className="p-3 text-center text-status-problem font-medium">{c.problem}</td>
                  <td className="p-3 text-center text-status-severe font-medium">{c.severe}</td>
                  <td className="p-3 text-center text-foreground">{c.denuncias}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mapa de calor semanal */}
      <div className="surface-card p-5 sm:p-6">
        <h2 className="font-heading font-bold text-foreground mb-4">Mapa de calor semanal</h2>
        <div className="grid grid-cols-6 gap-2">
          <div />
          {heatmapData.map((d) => (
            <div key={d.dia} className="text-center text-xs text-muted-foreground font-medium">{d.dia}</div>
          ))}
          <div className="text-xs text-muted-foreground font-medium flex items-center">Manhã</div>
          {heatmapData.map((d) => (
            <div key={`m-${d.dia}`} className={`${getHeatColor(d.manha)} rounded-lg h-12 flex items-center justify-center text-xs font-bold text-primary-foreground`}>
              {d.manha}
            </div>
          ))}
          <div className="text-xs text-muted-foreground font-medium flex items-center">Tarde</div>
          {heatmapData.map((d) => (
            <div key={`t-${d.dia}`} className={`${getHeatColor(d.tarde)} rounded-lg h-12 flex items-center justify-center text-xs font-bold text-primary-foreground`}>
              {d.tarde}
            </div>
          ))}
        </div>
      </div>

      {/* Tendências - gráfico de linha */}
      <div className="surface-card p-5 sm:p-6">
        <h2 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-secondary" /> Evolução do bem-estar (últimos 3 meses)
        </h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="humor" stroke="hsl(245, 40%, 52%)" strokeWidth={3} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sugestões automáticas */}
      {suggestions.length > 0 && (
        <div className="surface-card p-5 sm:p-6">
          <h2 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-secondary" /> Sugestões automáticas
          </h2>
          <div className="space-y-3">
            {suggestions.map((s, i) => (
              <div key={i} className="bg-accent rounded-lg p-3 text-sm text-foreground flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-status-attention mt-0.5 flex-shrink-0" />
                {s}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </DirectionLayout>
);

export default DirectionPanel;
