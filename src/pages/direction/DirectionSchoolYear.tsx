import DirectionLayout from "@/components/layout/DirectionLayout";
import { CalendarDays, TrendingUp, AlertTriangle, Users, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line, Legend } from "recharts";

/* Dados por bimestre */
const bimestres = [
  {
    id: 1, label: "1º Bimestre", periodo: "Fev – Abr 2024",
    humorMedio: 3.9, alertas: 12, denuncias: 4, alunosAtencao: 8,
    humorSemanal: [
      { semana: "S1", humor: 3.6 }, { semana: "S2", humor: 3.8 },
      { semana: "S3", humor: 4.0 }, { semana: "S4", humor: 3.9 },
      { semana: "S5", humor: 4.1 }, { semana: "S6", humor: 4.0 },
      { semana: "S7", humor: 3.8 }, { semana: "S8", humor: 3.9 },
    ],
    destaques: [
      "Semana de adaptação teve humor mais baixo",
      "Melhora progressiva após dinâmicas de integração",
    ],
  },
  {
    id: 2, label: "2º Bimestre", periodo: "Mai – Jul 2024",
    humorMedio: 3.6, alertas: 18, denuncias: 6, alunosAtencao: 12,
    humorSemanal: [
      { semana: "S1", humor: 3.9 }, { semana: "S2", humor: 3.7 },
      { semana: "S3", humor: 3.5 }, { semana: "S4", humor: 3.4 },
      { semana: "S5", humor: 3.3 }, { semana: "S6", humor: 3.6 },
      { semana: "S7", humor: 3.7 }, { semana: "S8", humor: 3.8 },
    ],
    destaques: [
      "Queda de humor na semana de provas",
      "Aumento de denúncias de bullying verbal",
      "Intervenção com turma 6B na semana 5",
    ],
  },
  {
    id: 3, label: "3º Bimestre", periodo: "Ago – Out 2024",
    humorMedio: 4.1, alertas: 8, denuncias: 2, alunosAtencao: 5,
    humorSemanal: [
      { semana: "S1", humor: 3.8 }, { semana: "S2", humor: 4.0 },
      { semana: "S3", humor: 4.1 }, { semana: "S4", humor: 4.2 },
      { semana: "S5", humor: 4.0 }, { semana: "S6", humor: 4.2 },
      { semana: "S7", humor: 4.3 }, { semana: "S8", humor: 4.1 },
    ],
    destaques: [
      "Melhor bimestre do ano até agora",
      "Projeto de mentoria entre alunos funcionou bem",
    ],
  },
  {
    id: 4, label: "4º Bimestre", periodo: "Nov – Dez 2024",
    humorMedio: null, alertas: 3, denuncias: 1, alunosAtencao: 3,
    humorSemanal: [
      { semana: "S1", humor: 4.0 }, { semana: "S2", humor: 3.9 },
    ],
    destaques: ["Em andamento"],
  },
];

/* Comparativo entre bimestres */
const comparativo = bimestres
  .filter((b) => b.humorMedio !== null)
  .map((b) => ({ bimestre: b.label.replace(" Bimestre", ""), humor: b.humorMedio, alertas: b.alertas, denuncias: b.denuncias }));

const DirectionSchoolYear = () => (
  <DirectionLayout>
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Ano Letivo 2024</h1>
        <p className="text-sm text-muted-foreground">Visão completa do bem-estar escolar ao longo do ano</p>
      </div>

      {/* Comparativo geral */}
      <div className="surface-card p-5 sm:p-6">
        <h2 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-secondary" /> Evolução por bimestre
        </h2>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparativo}>
              <XAxis dataKey="bimestre" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="humor" name="Humor médio" fill="hsl(245, 40%, 52%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Timeline de bimestres */}
      <div className="space-y-4">
        {bimestres.map((bim, i) => (
          <motion.div
            key={bim.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-2xl border border-border shadow-card overflow-hidden"
          >
            <div className="p-5 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center">
                    <CalendarDays className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-foreground">{bim.label}</h3>
                    <p className="text-xs text-muted-foreground">{bim.periodo}</p>
                  </div>
                </div>
                {bim.humorMedio !== null && (
                  <div className="text-right">
                    <p className="text-2xl font-bold text-secondary">{bim.humorMedio.toFixed(1)}</p>
                    <p className="text-[10px] text-muted-foreground">humor médio</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* Stats rápidos */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-accent rounded-xl p-3 text-center">
                  <Bell className="w-4 h-4 mx-auto text-status-attention mb-1" />
                  <p className="text-lg font-bold text-foreground">{bim.alertas}</p>
                  <p className="text-[10px] text-muted-foreground">Alertas</p>
                </div>
                <div className="bg-accent rounded-xl p-3 text-center">
                  <AlertTriangle className="w-4 h-4 mx-auto text-status-problem mb-1" />
                  <p className="text-lg font-bold text-foreground">{bim.denuncias}</p>
                  <p className="text-[10px] text-muted-foreground">Denúncias</p>
                </div>
                <div className="bg-accent rounded-xl p-3 text-center">
                  <Users className="w-4 h-4 mx-auto text-secondary mb-1" />
                  <p className="text-lg font-bold text-foreground">{bim.alunosAtencao}</p>
                  <p className="text-[10px] text-muted-foreground">Em atenção</p>
                </div>
              </div>

              {/* Gráfico semanal */}
              {bim.humorSemanal.length > 2 && (
                <div className="h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={bim.humorSemanal}>
                      <XAxis dataKey="semana" tick={{ fontSize: 10 }} />
                      <YAxis domain={[2, 5]} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="humor" stroke="hsl(245, 40%, 52%)" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Destaques */}
              <div className="space-y-1.5">
                {bim.destaques.map((d, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />
                    {d}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </DirectionLayout>
);

export default DirectionSchoolYear;
