import { Card } from "@/components/ui/card";
import FamilyLayout from "@/components/layout/FamilyLayout";
import { FamilyPageHeader, useFamilyStudent } from "@/components/family/FamilyPageHeader";
import {
  attendanceByStudent,
  gradesByStudent,
  moodByStudent,
  moodLabel,
  average,
} from "@/lib/familyData";
import { Link } from "react-router-dom";
import { GraduationCap, CalendarCheck, Heart, TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const FamilyDashboard = () => {
  const { studentId, setStudentId, student } = useFamilyStudent();

  const grades = gradesByStudent[studentId];
  const attendance = attendanceByStudent[studentId];
  const mood = moodByStudent[studentId];

  const overallAvg =
    grades.reduce((acc, g) => acc + average(g), 0) / grades.length;
  const totalPres = attendance.reduce((a, m) => a + m.presencas, 0);
  const totalFalt = attendance.reduce((a, m) => a + m.faltas, 0);
  const totalJust = attendance.reduce((a, m) => a + m.justificadas, 0);
  const totalDays = totalPres + totalFalt + totalJust;
  const presPct = Math.round((totalPres / totalDays) * 100);
  const lastMood = mood[mood.length - 1].humor;
  const prevMood = mood[mood.length - 2].humor;
  const moodTrend = lastMood - prevMood;

  const TrendIcon = moodTrend > 0.1 ? TrendingUp : moodTrend < -0.1 ? TrendingDown : Minus;
  const trendColor =
    moodTrend > 0.1 ? "text-emerald-600" : moodTrend < -0.1 ? "text-amber-600" : "text-muted-foreground";

  return (
    <FamilyLayout>
      <FamilyPageHeader
        title="Olá, família 💜"
        description={`Acompanhe o caminho de ${student.name} com gentileza.`}
        studentId={studentId}
        onStudent={setStudentId}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <GraduationCap className="w-4 h-4" /> Média geral
          </div>
          <div className="text-2xl font-bold text-foreground">{overallAvg.toFixed(1)}</div>
          <div className="text-xs text-muted-foreground">de 10,0 nas disciplinas</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <CalendarCheck className="w-4 h-4" /> Frequência
          </div>
          <div className="text-2xl font-bold text-foreground">{presPct}%</div>
          <div className="text-xs text-muted-foreground">
            {totalFalt} falta{totalFalt !== 1 && "s"} no período
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <Heart className="w-4 h-4" /> Bem-estar
          </div>
          <div className="text-2xl font-bold text-foreground flex items-center gap-2">
            {moodLabel(lastMood)}
            <TrendIcon className={`w-4 h-4 ${trendColor}`} />
          </div>
          <div className="text-xs text-muted-foreground">
            humor médio {lastMood.toFixed(1)} de 5
          </div>
        </Card>
      </div>

      <Card className="p-4 mb-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-foreground">Bem-estar nas últimas semanas</h2>
          <Link to="/familia/bem-estar" className="text-xs text-primary hover:underline">
            Ver detalhes
          </Link>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={mood}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="week" fontSize={11} />
            <YAxis domain={[1, 5]} fontSize={11} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="humor"
              stroke="hsl(var(--primary))"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              name="Humor"
            />
            <Line
              type="monotone"
              dataKey="bemEstar"
              stroke="hsl(var(--secondary))"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              name="Bem-estar"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link to="/familia/notas">
          <Card className="p-4 hover:shadow-md transition-all">
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground">Notas por disciplina</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Veja a evolução em cada matéria por bimestre.
            </p>
          </Card>
        </Link>
        <Link to="/familia/frequencia">
          <Card className="p-4 hover:shadow-md transition-all">
            <div className="flex items-center gap-2 mb-1">
              <CalendarCheck className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground">Frequência</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Presenças, faltas e justificativas mês a mês.
            </p>
          </Card>
        </Link>
      </div>
    </FamilyLayout>
  );
};

export default FamilyDashboard;
