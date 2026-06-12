import { Card } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import FamilyLayout from "@/components/layout/FamilyLayout";
import { FamilyPageHeader, useFamilyStudent } from "@/components/family/FamilyPageHeader";
import { gradesByStudent, average } from "@/lib/familyData";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

const statusOf = (avg: number) => {
  if (avg >= 9) return { label: "Excelente", className: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  if (avg >= 7) return { label: "Bom", className: "bg-primary/10 text-primary border-primary/20" };
  if (avg >= 6) return { label: "Atenção", className: "bg-amber-50 text-amber-700 border-amber-200" };
  return { label: "Apoio", className: "bg-rose-50 text-rose-700 border-rose-200" };
};

const FamilyGrades = () => {
  const { studentId, setStudentId, student } = useFamilyStudent();
  const grades = gradesByStudent[studentId];
  const chartData = grades.map((g) => ({ subject: g.subject, B1: g.b1, B2: g.b2, B3: g.b3 }));

  return (
    <FamilyLayout>
      <FamilyPageHeader
        title="Notas por disciplina"
        description={`Evolução acadêmica de ${student.name} ao longo dos bimestres.`}
        studentId={studentId}
        onStudent={setStudentId}
      />

      <Card className="p-5 mb-5 rounded-2xl shadow-card border-border/60">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Comparativo por bimestre</h2>
          <div className="flex gap-4">
            {[
              { c: "hsl(var(--primary))", l: "B1" },
              { c: "hsl(var(--secondary))", l: "B2" },
              { c: "hsl(var(--accent-foreground))", l: "B3" },
            ].map((x) => (
              <div key={x.l} className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ background: x.c }} />
                <span className="text-xs font-medium text-muted-foreground">{x.l}</span>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="subject" fontSize={10} interval={0} angle={-20} textAnchor="end" height={60} />
            <YAxis domain={[0, 10]} fontSize={11} />
            <Tooltip />
            <Bar dataKey="B1" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="B2" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="B3" fill="hsl(var(--accent-foreground))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="rounded-2xl shadow-card border-border/60 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/60 hover:bg-muted/60">
              <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Disciplina</TableHead>
              <TableHead className="text-center text-[11px] uppercase tracking-wider font-semibold">B1</TableHead>
              <TableHead className="text-center text-[11px] uppercase tracking-wider font-semibold">B2</TableHead>
              <TableHead className="text-center text-[11px] uppercase tracking-wider font-semibold">B3</TableHead>
              <TableHead className="text-center text-[11px] uppercase tracking-wider font-semibold text-foreground">Média</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {grades.map((g) => {
              const avg = average(g);
              const s = statusOf(avg);
              return (
                <TableRow key={g.subject} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">{g.subject}</TableCell>
                  <TableCell className="text-center text-muted-foreground">{g.b1.toFixed(1)}</TableCell>
                  <TableCell className="text-center text-muted-foreground">{g.b2.toFixed(1)}</TableCell>
                  <TableCell className="text-center text-muted-foreground">{g.b3.toFixed(1)}</TableCell>
                  <TableCell className="text-center font-bold text-primary">{avg.toFixed(1)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`rounded-full font-semibold ${s.className}`}>{s.label}</Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </FamilyLayout>
  );
};

export default FamilyGrades;
