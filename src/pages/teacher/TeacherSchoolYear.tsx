import TeacherLayout from "@/components/layout/TeacherLayout";
import { Button } from "@/components/ui/button";
import { CalendarDays, Download, TrendingUp, TrendingDown, Award, Bell, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

/* Dados por bimestre */
const bimestres = [
  {
    label: "1º Bimestre",
    periodo: "Fev - Abr",
    humorMedio: 3.8,
    alertas: 12,
    denuncias: 3,
    alunosAtencao: 4,
    moodData: [
      { semana: "S1", humor: 3.5 },
      { semana: "S2", humor: 3.7 },
      { semana: "S3", humor: 3.9 },
      { semana: "S4", humor: 4.0 },
    ],
  },
  {
    label: "2º Bimestre",
    periodo: "Mai - Jul",
    humorMedio: 4.2,
    alertas: 8,
    denuncias: 1,
    alunosAtencao: 2,
    moodData: [
      { semana: "S1", humor: 4.0 },
      { semana: "S2", humor: 4.1 },
      { semana: "S3", humor: 4.3 },
      { semana: "S4", humor: 4.4 },
    ],
  },
  {
    label: "3º Bimestre",
    periodo: "Ago - Out",
    humorMedio: 3.5,
    alertas: 15,
    denuncias: 5,
    alunosAtencao: 6,
    moodData: [
      { semana: "S1", humor: 3.8 },
      { semana: "S2", humor: 3.5 },
      { semana: "S3", humor: 3.4 },
      { semana: "S4", humor: 3.3 },
    ],
  },
  {
    label: "4º Bimestre",
    periodo: "Nov - Dez",
    humorMedio: 3.9,
    alertas: 10,
    denuncias: 2,
    alunosAtencao: 3,
    moodData: [
      { semana: "S1", humor: 3.6 },
      { semana: "S2", humor: 3.8 },
      { semana: "S3", humor: 4.0 },
      { semana: "S4", humor: 4.2 },
    ],
  },
];

const totalAlertas = bimestres.reduce((a, b) => a + b.alertas, 0);
const melhorBimestre = bimestres.reduce((best, b) => b.humorMedio > best.humorMedio ? b : best, bimestres[0]);
const evolucao = ((bimestres[bimestres.length - 1].humorMedio - bimestres[0].humorMedio) / bimestres[0].humorMedio * 100).toFixed(0);

const TeacherSchoolYear = () => (
  <TeacherLayout>
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-secondary" /> Ano Letivo 2026
          </h1>
          <p className="text-sm text-muted-foreground">Turma 5A · Timeline completa</p>
        </div>
        <Button variant="hero" size="sm">
          <Download className="w-4 h-4 mr-1" /> Exportar relatório anual
        </Button>
      </div>

      {/* Resumo anual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="surface-card p-5">
          <div className="flex items-center gap-2 mb-1">
            {Number(evolucao) >= 0 ? (
              <TrendingUp className="w-4 h-4 text-status-good" />
            ) : (
              <TrendingDown className="w-4 h-4 text-status-problem" />
            )}
            <span className="text-sm font-medium text-foreground">Evolução</span>
          </div>
          <p className={`text-2xl font-heading font-bold ${Number(evolucao) >= 0 ? "text-status-good" : "text-status-problem"}`}>
            {Number(evolucao) >= 0 ? "+" : ""}{evolucao}%
          </p>
          <p className="text-xs text-muted-foreground">no bem-estar ao longo do ano</p>
        </div>
        <div className="surface-card p-5">
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-foreground">Alertas resolvidos</span>
          </div>
          <p className="text-2xl font-heading font-bold text-foreground">{totalAlertas}</p>
          <p className="text-xs text-muted-foreground">ao longo do ano</p>
        </div>
        <div className="surface-card p-5">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-status-good" />
            <span className="text-sm font-medium text-foreground">Melhor período</span>
          </div>
          <p className="text-2xl font-heading font-bold text-status-good">{melhorBimestre.label}</p>
          <p className="text-xs text-muted-foreground">humor médio: {melhorBimestre.humorMedio.toFixed(1)}</p>
        </div>
      </div>

      {/* Timeline dos bimestres */}
      <div className="space-y-4">
        {bimestres.map((b, idx) => {
          const prev = idx > 0 ? bimestres[idx - 1] : null;
          const diff = prev ? ((b.humorMedio - prev.humorMedio) / prev.humorMedio * 100).toFixed(0) : null;
          return (
            <div key={b.label} className="surface-card p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-heading font-bold text-foreground">{b.label}</h2>
                  <p className="text-xs text-muted-foreground">{b.periodo}</p>
                </div>
                {diff && (
                  <span className={`text-sm font-medium flex items-center gap-1 ${Number(diff) >= 0 ? "text-status-good" : "text-status-problem"}`}>
                    {Number(diff) >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    {Number(diff) >= 0 ? "+" : ""}{diff}% vs anterior
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-accent rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{b.humorMedio.toFixed(1)}</p>
                  <p className="text-[10px] text-muted-foreground">Humor médio</p>
                </div>
                <div className="bg-accent rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{b.alertas}</p>
                  <p className="text-[10px] text-muted-foreground">Alertas</p>
                </div>
                <div className="bg-accent rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{b.denuncias}</p>
                  <p className="text-[10px] text-muted-foreground">Denúncias</p>
                </div>
                <div className="bg-accent rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{b.alunosAtencao}</p>
                  <p className="text-[10px] text-muted-foreground">Alunos atenção</p>
                </div>
              </div>

              {/* Gráfico de humor do bimestre */}
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={b.moodData}>
                    <XAxis dataKey="semana" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 5]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="humor" fill="hsl(245, 40%, 52%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </TeacherLayout>
);

export default TeacherSchoolYear;
