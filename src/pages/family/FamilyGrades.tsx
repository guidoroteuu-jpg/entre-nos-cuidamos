import { Card } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import FamilyLayout from "@/components/layout/FamilyLayout";
import { FamilyPageHeader, useFamilyStudent } from "@/components/family/FamilyPageHeader";
import { gradesByStudent, average } from "@/lib/familyData";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";

const statusOf = (avg: number) => {
  if (avg >= 9) return { label: "Excelente", className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30" };
  if (avg >= 7) return { label: "Bom", className: "bg-primary/10 text-primary border-primary/30" };
  if (avg >= 6) return { label: "Atenção", className: "bg-amber-500/10 text-amber-700 border-amber-500/30" };
  return { label: "Apoio", className: "bg-rose-500/10 text-rose-700 border-rose-500/30" };
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

      <Card className="p-4 mb-5">
        <h2 className="font-semibold text-foreground mb-3">Comparativo por bimestre</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="subject" fontSize={10} interval={0} angle={-20} textAnchor="end" height={60} />
            <YAxis domain={[0, 10]} fontSize={11} />
            <Tooltip />
            <Legend />
            <Bar dataKey="B1" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="B2" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="B3" fill="hsl(var(--accent-foreground))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Disciplina</TableHead>
              <TableHead className="text-center">B1</TableHead>
              <TableHead className="text-center">B2</TableHead>
              <TableHead className="text-center">B3</TableHead>
              <TableHead className="text-center">Média</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {grades.map((g) => {
              const avg = average(g);
              const s = statusOf(avg);
              return (
                <TableRow key={g.subject}>
                  <TableCell className="font-medium">{g.subject}</TableCell>
                  <TableCell className="text-center">{g.b1.toFixed(1)}</TableCell>
                  <TableCell className="text-center">{g.b2.toFixed(1)}</TableCell>
                  <TableCell className="text-center">{g.b3.toFixed(1)}</TableCell>
                  <TableCell className="text-center font-semibold">{avg.toFixed(1)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={s.className}>{s.label}</Badge>
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
