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
import { Link } from "@/lib/router-compat";
import MoodCat, { catByScore5 } from "@/components/MoodCat";
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

  const grades = gradesByStudent[studentId]!;
  const attendance = attendanceByStudent[studentId]!;
  const mood = moodByStudent[studentId]!;

  const overallAvg =
    grades.reduce((acc, g) => acc + average(g), 0) / grades.length;
  const totalPres = attendance.reduce((a, m) => a + m.presencas, 0);
  const totalFalt = attendance.reduce((a, m) => a + m.faltas, 0);
  const totalJust = attendance.reduce((a, m) => a + m.justificadas, 0);
  const totalDays = totalPres + totalFalt + totalJust;
  const presPct = Math.round((totalPres / totalDays) * 100);
  const lastMood = mood[mood.length - 1]!.humor;
  const prevMood = mood[mood.length - 2]!.humor;
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
        <Card className="surface-card p-5 border-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="icon-chip w-8 h-8 rounded-xl">
              <GraduationCap className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Média geral</span>
          </div>
          <div className="stat-value text-3xl leading-none">{overallAvg.toFixed(1)}</div>
          <div className="stat-caption mt-1.5">de 10,0 nas disciplinas</div>
        </Card>
        <Card className="surface-card p-5 border-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="icon-chip w-8 h-8 rounded-xl">
              <CalendarCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Frequência</span>
          </div>
          <div className="stat-value text-3xl leading-none">{presPct}%</div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-primary" style={{ width: `${presPct}%` }} />
          </div>
          <div className="stat-caption mt-1.5">
            {totalFalt} falta{totalFalt !== 1 && "s"} no período
          </div>
        </Card>
        <Card className="surface-card p-5 border-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="icon-chip w-8 h-8 rounded-xl">
              <Heart className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Bem-estar</span>
          </div>
          <div className="stat-value text-2xl leading-none flex items-center gap-2">
            <MoodCat mood={catByScore5(lastMood)} alt={moodLabel(lastMood)} className="w-9 h-9" />
            {moodLabel(lastMood)}
            <TrendIcon className={`w-4 h-4 ${trendColor}`} />
          </div>
          <div className="stat-caption mt-1.5">
            humor médio {lastMood.toFixed(1)} de 5
          </div>
        </Card>
      </div>

      <Card className="surface-card p-5 mb-5 border-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="section-title text-base">Bem-estar nas últimas semanas</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Escala de 1 (difícil) a 5 (ótimo)</p>
          </div>
          <Link
            to="/familia/bem-estar"
            className="text-xs font-semibold text-primary hover:underline underline-offset-4 tap-target flex items-center"
          >
            Ver detalhes
          </Link>
        </div>
        <ResponsiveContainer width="100%" height={190}>
          <LineChart data={mood} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 6" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="week"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis
              domain={[1, 5]}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid hsl(var(--border))",
                boxShadow: "var(--shadow-card)",
                fontSize: 12,
              }}
            />
            <Line
              type="monotone"
              dataKey="humor"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ r: 3, strokeWidth: 2, fill: "hsl(var(--card))" }}
              activeDot={{ r: 5 }}
              name="Humor"
            />
            <Line
              type="monotone"
              dataKey="bemEstar"
              stroke="hsl(var(--secondary))"
              strokeWidth={3}
              dot={{ r: 3, strokeWidth: 2, fill: "hsl(var(--card))" }}
              activeDot={{ r: 5 }}
              name="Bem-estar"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link to="/familia/notas" className="block">
          <Card className="surface-card p-5 border-0 h-full">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="icon-chip w-8 h-8 rounded-xl">
                <GraduationCap className="w-4 h-4" />
              </span>
              <h3 className="section-title text-[15px]">Notas por disciplina</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Veja a evolução em cada matéria por bimestre.
            </p>
          </Card>
        </Link>
        <Link to="/familia/frequencia" className="block">
          <Card className="surface-card p-5 border-0 h-full">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="icon-chip w-8 h-8 rounded-xl">
                <CalendarCheck className="w-4 h-4" />
              </span>
              <h3 className="section-title text-[15px]">Frequência</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Presenças, faltas e justificativas mês a mês.
            </p>
          </Card>
        </Link>
      </div>

    </FamilyLayout>
  );
};

export default FamilyDashboard;
