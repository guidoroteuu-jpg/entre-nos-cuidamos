import TeacherLayout from "@/components/layout/TeacherLayout";
import { Users, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import MoodCat, { type CatMoodKey } from "@/components/MoodCat";
import FacialMoodPanel from "@/components/FacialMoodPanel";

const students = [
  { id: 1, status: "good" },{ id: 2, status: "good" },{ id: 3, status: "attention" },
  { id: 4, status: "good" },{ id: 5, status: "problem" },{ id: 6, status: "good" },
  { id: 7, status: "good" },{ id: 8, status: "attention" },{ id: 9, status: "good" },
  { id: 10, status: "severe" },{ id: 11, status: "good" },{ id: 12, status: "good" },
  { id: 13, status: "attention" },{ id: 14, status: "good" },{ id: 15, status: "good" },
  { id: 16, status: "good" },{ id: 17, status: "problem" },{ id: 18, status: "good" },
  { id: 19, status: "good" },{ id: 20, status: "good" },
];

const statusColor: Record<string, string> = {
  good: "bg-status-good", attention: "bg-status-attention",
  problem: "bg-status-problem", severe: "bg-status-severe",
};

const statusLabel: Record<string, string> = {
  good: "Bem", attention: "Atenção", problem: "Problema", severe: "Grave",
};

const stats: { label: string; count: number; color: string; pct: string; mood: CatMoodKey; ring: string }[] = [
  { label: "Bem", count: 13, color: "bg-status-good", pct: "65%", mood: "otimo", ring: "ring-status-good/25" },
  { label: "Atenção", count: 3, color: "bg-status-attention", pct: "15%", mood: "neutro", ring: "ring-status-attention/30" },
  { label: "Problema", count: 2, color: "bg-status-problem", pct: "10%", mood: "triste", ring: "ring-status-problem/25" },
  { label: "Grave", count: 1, color: "bg-status-severe", pct: "5%", mood: "muito_triste", ring: "ring-status-severe/25" },
];

const suggestions = [
  "Roda de conversa sobre sentimentos — ideal para turmas com muitos alunos em \"atenção\".",
  "Atividade em duplas aleatórias — ajuda a integrar alunos que estão isolados.",
  "Dinâmica \"eu no lugar do outro\" — promove empatia e reduz conflitos.",
];

const TeacherDashboard = () => (
  <TeacherLayout>
    <div className="w-full space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="section-eyebrow mb-1">Visão geral</p>
        <h1 className="font-heading text-[26px] leading-tight font-extrabold text-foreground tracking-tight">
          Dashboard da Turma
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Turma 5A · 20 alunos</p>
      </motion.div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className={`surface-card p-4 sm:p-5 ring-1 ${s.ring}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="icon-chip w-9 h-9 bg-accent/70">
                <MoodCat mood={s.mood} alt="" className="w-6 h-6" />
              </span>
              <div className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${s.color}`} aria-hidden="true" />
                <span className="text-[13px] font-semibold text-foreground">{s.label}</span>
              </div>
            </div>
            <p className="stat-value text-3xl leading-none">{s.count}</p>
            <div className="mt-2.5 h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div className={`h-full rounded-full ${s.color}`} style={{ width: s.pct }} />
            </div>
            <p className="stat-caption mt-1.5">{s.pct} da turma</p>
          </motion.div>
        ))}
      </div>

      {/* Radar */}
      <motion.div
        className="surface-card p-5 sm:p-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2.5 mb-1">
          <span className="icon-chip">
            <Users className="w-5 h-5" />
          </span>
          <div>
            <h2 className="section-title text-base">Radar da Turma</h2>
            <p className="text-xs text-muted-foreground">Cada quadrado é um aluno · passe o mouse para ver o número</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-5 sm:grid-cols-10 gap-2 rounded-xl surface-inset p-3">
          {students.map((s, i) => (
            <motion.div
              key={s.id}
              className={`aspect-square rounded-xl ${statusColor[s.status]} shadow-xs ring-1 ring-inset ring-foreground/5 hover:ring-2 hover:ring-foreground/20 transition-all cursor-pointer relative group`}
              title={`Aluno #${s.id} · ${statusLabel[s.status]}`}
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
          {Object.entries(statusLabel).map(([key, label]) => (
            <div key={key} className="flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-2.5 py-1">
              <span className={`w-2.5 h-2.5 rounded-full ${statusColor[key]}`} aria-hidden="true" />
              <span className="text-xs font-medium text-foreground">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <FacialMoodPanel turmaNome="5A" />

      {/* Sugestões */}
      <motion.div
        className="surface-card p-5 sm:p-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-2.5 mb-4">
          <span className="icon-chip">
            <Lightbulb className="w-5 h-5" />
          </span>
          <h2 className="section-title text-base">Sugestões de Dinâmicas</h2>
        </div>
        <div className="space-y-2.5">
          {suggestions.map((s, i) => (
            <motion.div
              key={i}
              className="surface-inset p-3.5 text-sm text-foreground leading-relaxed flex gap-3"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
            >
              <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {i + 1}
              </span>
              <span>{s}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </TeacherLayout>
);

export default TeacherDashboard;
