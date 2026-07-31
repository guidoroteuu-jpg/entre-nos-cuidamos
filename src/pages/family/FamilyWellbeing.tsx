import { Card } from "@/components/ui/card";
import FamilyLayout from "@/components/layout/FamilyLayout";
import { FamilyPageHeader, useFamilyStudent } from "@/components/family/FamilyPageHeader";
import { moodByStudent, moodLabel } from "@/lib/familyData";
import MoodCat, { catByScore5 } from "@/components/MoodCat";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";
import { Heart, Sparkles, Info } from "lucide-react";

const FamilyWellbeing = () => {
  const { studentId, setStudentId, student } = useFamilyStudent();
  const data = moodByStudent[studentId];

  const avg = data.reduce((a, m) => a + m.humor, 0) / data.length;
  const last = data[data.length - 1].humor;

  return (
    <FamilyLayout>
      <FamilyPageHeader
        title="Bem-estar e humor"
        description={`Como ${student.name} tem se sentido nas últimas semanas.`}
        studentId={studentId}
        onStudent={setStudentId}
      />

      <div className="grid grid-cols-2 gap-3 mb-5">
        <Card className="p-5 surface-card border-0">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <Heart className="w-4 h-4" /> Humor atual
          </div>
          <div className="text-2xl font-bold text-foreground flex items-center gap-2">
            <MoodCat mood={catByScore5(last)} alt={moodLabel(last)} className="w-8 h-8" />
            {moodLabel(last)}
          </div>
          <div className="text-xs text-muted-foreground">{last.toFixed(1)} de 5</div>
        </Card>
        <Card className="p-5 surface-card border-0">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <Sparkles className="w-4 h-4" /> Média do período
          </div>
          <div className="text-2xl font-bold text-foreground flex items-center gap-2">
            <MoodCat mood={catByScore5(avg)} alt={moodLabel(avg)} className="w-8 h-8" />
            {avg.toFixed(1)}
          </div>
          <div className="text-xs text-muted-foreground">{moodLabel(avg)}</div>
        </Card>
      </div>

      <Card className="p-5 mb-5 surface-card border-0">
        <h2 className="font-semibold text-foreground mb-3">Evolução semanal</h2>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="humorGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="bemGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.5} />
                <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 6" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="week" fontSize={11} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
            <YAxis domain={[1, 5]} fontSize={11} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", boxShadow: "var(--shadow-card)", fontSize: 12 }} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
            <Area type="monotone" dataKey="humor" stroke="hsl(var(--primary))" fill="url(#humorGrad)" strokeWidth={2.5} name="Humor" />
            <Area type="monotone" dataKey="bemEstar" stroke="hsl(var(--secondary))" fill="url(#bemGrad)" strokeWidth={2.5} name="Bem-estar" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-4 bg-accent/40 border-primary/20">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm text-foreground/80">
            <p className="font-semibold mb-1">Como ler estes números?</p>
            <p className="text-xs leading-relaxed">
              O humor e o bem-estar são autorelatados pelo aluno em check-ins na plataforma, em uma escala
              de 1 (cuidado) a 5 (ótimo). Esses dados são <strong>privados</strong> e compartilhados apenas
              com a família e a equipe pedagógica responsável. Se notar quedas frequentes, converse com
              gentileza e procure a escola.
            </p>
          </div>
        </div>
      </Card>
    </FamilyLayout>
  );
};

export default FamilyWellbeing;
