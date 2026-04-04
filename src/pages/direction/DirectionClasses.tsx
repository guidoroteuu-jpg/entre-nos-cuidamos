import { useState } from "react";
import DirectionLayout from "@/components/layout/DirectionLayout";
import { Users, Search, TrendingUp, TrendingDown, Minus, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

/* Dados simulados das turmas */
const classesData = [
  {
    id: "5a", name: "5º A", professor: "Prof. Maria Silva", turno: "Manhã",
    total: 20, good: 13, attention: 3, problem: 2, severe: 1,
    alertas: 4, denuncias: 2, trend: "down" as const,
    humorSemanal: [
      { dia: "Seg", humor: 3.8 }, { dia: "Ter", humor: 4.0 }, { dia: "Qua", humor: 3.5 },
      { dia: "Qui", humor: 3.9 }, { dia: "Sex", humor: 3.7 },
    ],
  },
  {
    id: "5b", name: "5º B", professor: "Prof. João Santos", turno: "Manhã",
    total: 22, good: 18, attention: 3, problem: 1, severe: 0,
    alertas: 1, denuncias: 0, trend: "up" as const,
    humorSemanal: [
      { dia: "Seg", humor: 4.2 }, { dia: "Ter", humor: 4.1 }, { dia: "Qua", humor: 4.3 },
      { dia: "Qui", humor: 4.0 }, { dia: "Sex", humor: 4.4 },
    ],
  },
  {
    id: "6a", name: "6º A", professor: "Prof. Ana Costa", turno: "Tarde",
    total: 25, good: 20, attention: 3, problem: 1, severe: 1,
    alertas: 3, denuncias: 1, trend: "stable" as const,
    humorSemanal: [
      { dia: "Seg", humor: 3.9 }, { dia: "Ter", humor: 3.8 }, { dia: "Qua", humor: 4.0 },
      { dia: "Qui", humor: 3.7 }, { dia: "Sex", humor: 3.9 },
    ],
  },
  {
    id: "6b", name: "6º B", professor: "Prof. Carlos Lima", turno: "Tarde",
    total: 23, good: 15, attention: 5, problem: 2, severe: 1,
    alertas: 6, denuncias: 3, trend: "down" as const,
    humorSemanal: [
      { dia: "Seg", humor: 3.2 }, { dia: "Ter", humor: 3.0 }, { dia: "Qua", humor: 2.8 },
      { dia: "Qui", humor: 3.1 }, { dia: "Sex", humor: 2.9 },
    ],
  },
  {
    id: "7a", name: "7º A", professor: "Prof. Paula Neves", turno: "Manhã",
    total: 28, good: 24, attention: 3, problem: 1, severe: 0,
    alertas: 1, denuncias: 0, trend: "up" as const,
    humorSemanal: [
      { dia: "Seg", humor: 4.3 }, { dia: "Ter", humor: 4.5 }, { dia: "Qua", humor: 4.2 },
      { dia: "Qui", humor: 4.4 }, { dia: "Sex", humor: 4.6 },
    ],
  },
];

const trendIcon = (t: string) => {
  if (t === "up") return <TrendingUp className="w-4 h-4 text-status-good" />;
  if (t === "down") return <TrendingDown className="w-4 h-4 text-status-severe" />;
  return <Minus className="w-4 h-4 text-muted-foreground" />;
};

const DirectionClasses = () => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = classesData.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.professor.toLowerCase().includes(search.toLowerCase())
  );

  const selectedClass = classesData.find((c) => c.id === selected);

  return (
    <DirectionLayout>
      <div className="max-w-6xl space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Turmas</h1>
          <p className="text-sm text-muted-foreground">Visão geral de todas as turmas da escola</p>
        </div>

        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar turma ou professor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 micro-input"
          />
        </div>

        {/* Grid de turmas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => setSelected(selected === c.id ? null : c.id)}
              className={`bg-card rounded-2xl p-5 border shadow-card cursor-pointer transition-all hover:shadow-md ${
                selected === c.id ? "border-secondary ring-2 ring-secondary/20" : "border-border"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-foreground">{c.name}</span>
                  </div>
                  <div>
                    <p className="font-heading font-bold text-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.professor}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {trendIcon(c.trend)}
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs mb-3">
                <span className="px-2 py-0.5 rounded-full bg-accent text-muted-foreground">{c.turno}</span>
                <span className="px-2 py-0.5 rounded-full bg-accent text-muted-foreground">{c.total} alunos</span>
              </div>

              {/* Barra de status */}
              <div className="flex rounded-full overflow-hidden h-3 mb-3">
                <div className="bg-status-good" style={{ width: `${(c.good / c.total) * 100}%` }} />
                <div className="bg-status-attention" style={{ width: `${(c.attention / c.total) * 100}%` }} />
                <div className="bg-status-problem" style={{ width: `${(c.problem / c.total) * 100}%` }} />
                <div className="bg-status-severe" style={{ width: `${(c.severe / c.total) * 100}%` }} />
              </div>

              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div>
                  <p className="font-bold text-status-good">{c.good}</p>
                  <p className="text-muted-foreground">Bem</p>
                </div>
                <div>
                  <p className="font-bold text-status-attention">{c.attention}</p>
                  <p className="text-muted-foreground">Atenção</p>
                </div>
                <div>
                  <p className="font-bold text-status-problem">{c.problem}</p>
                  <p className="text-muted-foreground">Risco</p>
                </div>
                <div>
                  <p className="font-bold text-status-severe">{c.severe}</p>
                  <p className="text-muted-foreground">Grave</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detalhes da turma selecionada */}
        {selectedClass && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-6 border border-border shadow-card space-y-4"
          >
            <h2 className="font-heading font-bold text-foreground flex items-center gap-2">
              <Eye className="w-5 h-5 text-secondary" />
              Detalhes — {selectedClass.name}
            </h2>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-accent rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{selectedClass.alertas}</p>
                <p className="text-xs text-muted-foreground">Alertas ativos</p>
              </div>
              <div className="bg-accent rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{selectedClass.denuncias}</p>
                <p className="text-xs text-muted-foreground">Denúncias</p>
              </div>
              <div className="bg-accent rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-foreground">
                  {((selectedClass.good / selectedClass.total) * 100).toFixed(0)}%
                </p>
                <p className="text-xs text-muted-foreground">Bem-estar</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">Humor da semana</h3>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={selectedClass.humorSemanal}>
                    <XAxis dataKey="dia" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="humor" fill="hsl(245, 40%, 52%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </DirectionLayout>
  );
};

export default DirectionClasses;
