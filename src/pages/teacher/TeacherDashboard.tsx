import TeacherLayout from "@/components/layout/TeacherLayout";
import { Users, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import MoodCat, { type CatMoodKey } from "@/components/MoodCat";
import FacialMoodPanel from "@/components/FacialMoodPanel";
import { CardSkeleton, GlassCard, GridSkeleton, PageHeader, PageShell, SectionHeader, StatGridSkeleton, StatTile, StatusPill, useInitialLoading } from "@/components/ui/kit";
import { statusBg, statusLabels, type StatusKey } from "@/lib/design-tokens";

const students = [
  { id: 1, status: "good" },{ id: 2, status: "good" },{ id: 3, status: "attention" },
  { id: 4, status: "good" },{ id: 5, status: "problem" },{ id: 6, status: "good" },
  { id: 7, status: "good" },{ id: 8, status: "attention" },{ id: 9, status: "good" },
  { id: 10, status: "severe" },{ id: 11, status: "good" },{ id: 12, status: "good" },
  { id: 13, status: "attention" },{ id: 14, status: "good" },{ id: 15, status: "good" },
  { id: 16, status: "good" },{ id: 17, status: "problem" },{ id: 18, status: "good" },
  { id: 19, status: "good" },{ id: 20, status: "good" },
];

const statusColor = statusBg;
const statusLabel = statusLabels;

const stats: { status: StatusKey; count: number; pct: number; mood: CatMoodKey }[] = [
  { status: "good", count: 13, pct: 65, mood: "otimo" },
  { status: "attention", count: 3, pct: 15, mood: "neutro" },
  { status: "problem", count: 2, pct: 10, mood: "triste" },
  { status: "severe", count: 1, pct: 5, mood: "muito_triste" },
];

const suggestions = [
  "Roda de conversa sobre sentimentos — ideal para turmas com muitos alunos em \"atenção\".",
  "Atividade em duplas aleatórias — ajuda a integrar alunos que estão isolados.",
  "Dinâmica \"eu no lugar do outro\" — promove empatia e reduz conflitos.",
];

const TeacherDashboard = () => {
  const loading = useInitialLoading();

  return (
  <TeacherLayout>
    <PageShell>
      <PageHeader eyebrow="Visão geral" title="Dashboard da Turma" description="Turma 5A · 20 alunos" />

      {/* Estatísticas */}
      {loading ? <StatGridSkeleton /> : (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <StatTile
            key={s.status}
            label={statusLabel[s.status]}
            value={s.count}
            caption={`${s.pct}% da turma`}
            status={s.status}
            progress={s.pct}
            delay={i * 0.07}
            visual={<MoodCat mood={s.mood} alt="" className="w-6 h-6" />}
          />
        ))}
      </div>
      )}

      {/* Radar */}
      {loading ? <CardSkeleton lines={0} className="min-h-[220px]" /> : (
      <GlassCard delay={0.28}>
        <SectionHeader
          title="Radar da Turma"
          description="Cada quadrado é um aluno · passe o mouse para ver o número"
          icon={Users}
        />
        <div className="mt-4 grid grid-cols-5 sm:grid-cols-10 gap-2 rounded-xl surface-inset p-3">
          {students.map((s, i) => (
            <motion.div
              key={s.id}
              className={`aspect-square rounded-xl ${statusColor[s.status as StatusKey]} shadow-xs ring-1 ring-inset ring-foreground/5 hover:ring-2 hover:ring-foreground/20 transition-all cursor-pointer relative group`}
              title={`Aluno #${s.id} · ${statusLabel[s.status as StatusKey]}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.92, scale: 1 }}
              transition={{ delay: 0.35 + i * 0.03 }}
              whileHover={{ scale: 1.08 }}
            >
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                #{s.id}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex gap-2 mt-4 flex-wrap">
          {(Object.keys(statusLabel) as StatusKey[]).map((key) => (
            <StatusPill key={key} status={key} />
          ))}
        </div>
      </GlassCard>
      )}

      <FacialMoodPanel turmaNome="5A" />

      {/* Sugestões */}
      <GlassCard delay={0.36}>
        <SectionHeader title="Sugestões de Dinâmicas" icon={Lightbulb} className="mb-4" />
        <div className="space-y-2.5">
          {suggestions.map((s, i) => (
            <motion.div
              key={i}
              className="surface-inset p-3.5 text-sm text-foreground leading-relaxed flex gap-3"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 + i * 0.08 }}
            >
              <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {i + 1}
              </span>
              <span>{s}</span>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </PageShell>
  </TeacherLayout>
  );
};

export default TeacherDashboard;
