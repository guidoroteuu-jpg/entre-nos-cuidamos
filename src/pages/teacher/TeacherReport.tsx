import TeacherLayout from "@/components/layout/TeacherLayout";
import { FileText, Download, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const weeklyData = [
  { semana: "Sem 1", bem: 15, atencao: 3, problema: 1, grave: 1 },
  { semana: "Sem 2", bem: 14, atencao: 4, problema: 1, grave: 1 },
  { semana: "Sem 3", bem: 13, atencao: 3, problema: 2, grave: 2 },
  { semana: "Sem 4", bem: 13, atencao: 3, problema: 2, grave: 1 },
];

const TeacherReport = () => (
  <TeacherLayout>
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="w-6 h-6 text-secondary" /> Relatório
          </h1>
          <p className="text-sm text-muted-foreground">Turma 5A · Março 2026</p>
        </div>
        <Button variant="hero" size="sm">
          <Download className="w-4 h-4 mr-1" /> Exportar PDF
        </Button>
      </div>

      {/* Tendência */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl p-5 border border-border shadow-card">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="w-4 h-4 text-status-problem" />
            <span className="text-sm font-medium text-foreground">Tendência do mês</span>
          </div>
          <p className="text-2xl font-heading font-bold text-status-problem">-8%</p>
          <p className="text-xs text-muted-foreground">O humor geral piorou em relação ao mês anterior</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border shadow-card">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-status-good" />
            <span className="text-sm font-medium text-foreground">Participação no chat</span>
          </div>
          <p className="text-2xl font-heading font-bold text-status-good">+12%</p>
          <p className="text-xs text-muted-foreground">Mais alunos estão se expressando</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
        <h2 className="font-heading font-bold text-foreground mb-4">Humor por Semana</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <XAxis dataKey="semana" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="bem" stackId="a" fill="hsl(142, 70%, 45%)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="atencao" stackId="a" fill="hsl(45, 93%, 47%)" />
              <Bar dataKey="problema" stackId="a" fill="hsl(0, 84%, 60%)" />
              <Bar dataKey="grave" stackId="a" fill="hsl(0, 0%, 15%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </TeacherLayout>
);

export default TeacherReport;
