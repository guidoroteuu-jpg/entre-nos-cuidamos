import { useState } from "react";
import DirectionLayout from "@/components/layout/DirectionLayout";
import { AlertTriangle, Clock, CheckCircle, Search, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

type Status = "pendente" | "em_analise" | "resolvida";

interface Complaint {
  id: string;
  turma: string;
  tipo: string;
  descricao: string;
  data: string;
  status: Status;
  notas: string[];
  gravidade: "baixa" | "media" | "alta";
}

const initialComplaints: Complaint[] = [
  {
    id: "D001", turma: "6B", tipo: "Bullying verbal",
    descricao: "Aluno relata que está sendo chamado por apelidos depreciativos por um grupo de colegas durante o recreio.",
    data: "2024-03-18", status: "pendente", notas: [], gravidade: "alta",
  },
  {
    id: "D002", turma: "5A", tipo: "Exclusão social",
    descricao: "Estudante afirma que não é convidado para atividades em grupo e que colegas se afastam na hora do lanche.",
    data: "2024-03-17", status: "em_analise",
    notas: ["Orientadora conversou com a turma", "Monitorando situação"],
    gravidade: "media",
  },
  {
    id: "D003", turma: "6A", tipo: "Cyberbullying",
    descricao: "Denúncia de mensagens ofensivas em grupo de WhatsApp da turma. Aluno não identificado.",
    data: "2024-03-15", status: "em_analise",
    notas: ["Professora notificada"], gravidade: "alta",
  },
  {
    id: "D004", turma: "5B", tipo: "Agressão física",
    descricao: "Relato de empurrões frequentes na fila do refeitório.",
    data: "2024-03-10", status: "resolvida",
    notas: ["Reunião com responsáveis realizada", "Alunos fizeram acordo de convivência", "Caso encerrado"],
    gravidade: "alta",
  },
  {
    id: "D005", turma: "7A", tipo: "Isolamento",
    descricao: "Aluno apresenta padrão de isolamento crescente — não interage com ninguém há duas semanas.",
    data: "2024-03-19", status: "pendente", notas: [], gravidade: "media",
  },
];

const statusConfig: Record<Status, { label: string; color: string; icon: typeof Clock }> = {
  pendente: { label: "Pendente", color: "bg-status-attention text-white", icon: Clock },
  em_analise: { label: "Em análise", color: "bg-secondary text-secondary-foreground", icon: MessageSquare },
  resolvida: { label: "Resolvida", color: "bg-status-good text-white", icon: CheckCircle },
};

const gravColors = { baixa: "text-status-good", media: "text-status-attention", alta: "text-status-severe" };

const DirectionComplaints = () => {
  const [complaints, setComplaints] = useState(initialComplaints);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<Status | "todas">("todas");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [newNote, setNewNote] = useState("");

  const filtered = complaints.filter((c) => {
    const matchSearch =
      c.tipo.toLowerCase().includes(search.toLowerCase()) ||
      c.turma.toLowerCase().includes(search.toLowerCase()) ||
      c.descricao.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "todas" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const updateStatus = (id: string, status: Status) => {
    setComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  const addNote = (id: string) => {
    if (!newNote.trim()) return;
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, notas: [...c.notas, newNote.trim()] } : c))
    );
    setNewNote("");
  };

  const counts = {
    todas: complaints.length,
    pendente: complaints.filter((c) => c.status === "pendente").length,
    em_analise: complaints.filter((c) => c.status === "em_analise").length,
    resolvida: complaints.filter((c) => c.status === "resolvida").length,
  };

  return (
    <DirectionLayout>
      <div className="max-w-4xl space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Denúncias</h1>
          <p className="text-sm text-muted-foreground">Gestão de denúncias de toda a escola</p>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 micro-input" />
          </div>
          <div className="flex gap-2">
            {(["todas", "pendente", "em_analise", "resolvida"] as const).map((s) => (
              <Button
                key={s}
                size="sm"
                variant={filterStatus === s ? "default" : "outline"}
                onClick={() => setFilterStatus(s)}
                className="text-xs"
              >
                {s === "todas" ? "Todas" : statusConfig[s].label} ({counts[s]})
              </Button>
            ))}
          </div>
        </div>

        {/* Lista */}
        <div className="space-y-3">
          {filtered.map((c, i) => {
            const cfg = statusConfig[c.status];
            const isExpanded = expanded === c.id;
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl border border-border shadow-card overflow-hidden"
              >
                <div
                  className="p-5 cursor-pointer hover:bg-accent/30 transition-colors"
                  onClick={() => setExpanded(isExpanded ? null : c.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className={`w-4 h-4 ${gravColors[c.gravidade]}`} />
                        <span className="font-heading font-bold text-foreground">{c.tipo}</span>
                        <span className="text-xs text-muted-foreground">#{c.id}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{c.descricao}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span>Turma {c.turma}</span>
                        <span>·</span>
                        <span>{new Date(c.data).toLocaleDateString("pt-BR")}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                        {cfg.label}
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-border pt-4 space-y-4">
                        {/* Alterar status */}
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-2">Alterar status</p>
                          <div className="flex gap-2">
                            {(["pendente", "em_analise", "resolvida"] as Status[]).map((s) => (
                              <Button
                                key={s}
                                size="sm"
                                variant={c.status === s ? "default" : "outline"}
                                onClick={() => updateStatus(c.id, s)}
                                className="text-xs"
                              >
                                {statusConfig[s].label}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Notas */}
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-2">
                            Notas internas ({c.notas.length})
                          </p>
                          {c.notas.length > 0 && (
                            <div className="space-y-1.5 mb-3">
                              {c.notas.map((n, idx) => (
                                <div key={idx} className="bg-accent rounded-lg px-3 py-2 text-sm text-foreground">
                                  {n}
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Input
                              placeholder="Adicionar nota..."
                              value={expanded === c.id ? newNote : ""}
                              onChange={(e) => setNewNote(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && addNote(c.id)}
                              className="micro-input text-sm"
                            />
                            <Button size="sm" onClick={() => addNote(c.id)}>Adicionar</Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </DirectionLayout>
  );
};

export default DirectionComplaints;
