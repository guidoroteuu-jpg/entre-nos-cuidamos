import TeacherLayout from "@/components/layout/TeacherLayout";
import { FileText, Download, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { ChartCard, PageHeader, PageShell, StatTile } from "@/components/ui/kit";
import { chartAxis, chartGrid, chartTooltip, statusColors } from "@/lib/design-tokens";

const weeklyData = [
  { semana: "Sem 1", bem: 15, atencao: 3, problema: 1, grave: 1 },
  { semana: "Sem 2", bem: 14, atencao: 4, problema: 1, grave: 1 },
  { semana: "Sem 3", bem: 13, atencao: 3, problema: 2, grave: 2 },
  { semana: "Sem 4", bem: 13, atencao: 3, problema: 2, grave: 1 },
];

const TeacherReport = () => (
  <TeacherLayout>
    <PageShell>
      <PageHeader
        eyebrow="Turma 5A · Março 2026"
        title="Relatório"
        icon={FileText}
        actions={
          <Button variant="hero" size="sm">
            <Download className="w-4 h-4 mr-1" /> Exportar PDF
          </Button>
        }
      />

      {/* Tendência */}
      <div className="grid md:grid-cols-2 gap-4">
        <StatTile
          label="Tendência do mês"
          value={<span className="text-status-problem">-8%</span>}
          caption="O humor geral piorou em relação ao mês anterior"
          icon={TrendingDown}
          delay={0.05}
        />
        <StatTile
          label="Participação no chat"
          value={<span className="text-status-good">+12%</span>}
          caption="Mais alunos estão se expressando"
          icon={TrendingUp}
          delay={0.12}
        />
      </div>

      {/* Chart */}
      <ChartCard title="Humor por semana" description="Distribuição dos check-ins por status" height={256} delay={0.18}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyData}>
            <CartesianGrid {...chartGrid} />
            <XAxis dataKey="semana" {...chartAxis} />
            <YAxis {...chartAxis} width={28} />
            <Tooltip {...chartTooltip} />
            <Bar dataKey="bem" stackId="a" fill={statusColors.good} />
            <Bar dataKey="atencao" stackId="a" fill={statusColors.attention} />
            <Bar dataKey="problema" stackId="a" fill={statusColors.problem} />
            <Bar dataKey="grave" stackId="a" fill={statusColors.severe} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </PageShell>
  </TeacherLayout>
);

export default TeacherReport;
