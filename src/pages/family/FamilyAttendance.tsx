import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import FamilyLayout from "@/components/layout/FamilyLayout";
import { FamilyPageHeader, useFamilyStudent } from "@/components/family/FamilyPageHeader";
import { attendanceByStudent } from "@/lib/familyData";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";

const FamilyAttendance = () => {
  const { studentId, setStudentId, student } = useFamilyStudent();
  const data = attendanceByStudent[studentId];

  const totals = data.reduce(
    (acc, m) => ({
      presencas: acc.presencas + m.presencas,
      faltas: acc.faltas + m.faltas,
      justificadas: acc.justificadas + m.justificadas,
    }),
    { presencas: 0, faltas: 0, justificadas: 0 },
  );
  const total = totals.presencas + totals.faltas + totals.justificadas;
  const presPct = Math.round((totals.presencas / total) * 100);

  return (
    <FamilyLayout>
      <FamilyPageHeader
        title="Frequência escolar"
        description={`Presenças e faltas de ${student.name} no ano letivo.`}
        studentId={studentId}
        onStudent={setStudentId}
      />

      <Card className="p-4 mb-5">
        <div className="flex items-end justify-between mb-2">
          <div>
            <p className="text-xs text-muted-foreground">Frequência total</p>
            <p className="text-3xl font-bold text-foreground">{presPct}%</p>
          </div>
          <div className="text-right text-xs text-muted-foreground space-y-0.5">
            <div>Presenças: <span className="font-semibold text-foreground">{totals.presencas}</span></div>
            <div>Faltas: <span className="font-semibold text-foreground">{totals.faltas}</span></div>
            <div>Justificadas: <span className="font-semibold text-foreground">{totals.justificadas}</span></div>
          </div>
        </div>
        <Progress value={presPct} />
        <p className="text-[11px] text-muted-foreground mt-2">
          A frequência mínima exigida por lei é de 75%.
        </p>
      </Card>

      <Card className="p-4 mb-5">
        <h2 className="font-semibold text-foreground mb-3">Mês a mês</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="month" fontSize={11} />
            <YAxis fontSize={11} />
            <Tooltip />
            <Legend />
            <Bar dataKey="presencas" stackId="a" fill="hsl(var(--primary))" name="Presenças" radius={[0, 0, 0, 0]} />
            <Bar dataKey="justificadas" stackId="a" fill="hsl(var(--secondary))" name="Justificadas" />
            <Bar dataKey="faltas" stackId="a" fill="hsl(var(--destructive))" name="Faltas" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-4">
        <h2 className="font-semibold text-foreground mb-2">Detalhamento</h2>
        <div className="space-y-2">
          {data.map((m) => {
            const monthTotal = m.presencas + m.faltas + m.justificadas;
            const pct = Math.round((m.presencas / monthTotal) * 100);
            return (
              <div key={m.month} className="flex items-center gap-3">
                <span className="w-10 text-sm font-medium">{m.month}</span>
                <Progress value={pct} className="flex-1" />
                <span className="text-xs text-muted-foreground w-24 text-right">
                  {m.presencas}P · {m.faltas}F · {m.justificadas}J
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </FamilyLayout>
  );
};

export default FamilyAttendance;
