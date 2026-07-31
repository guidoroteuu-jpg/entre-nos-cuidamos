import { useState } from "react";
import TeacherLayout from "@/components/layout/TeacherLayout";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Search, Filter, MessageSquare } from "lucide-react";
import EmptyState from "@/components/EmptyState";

/* Tipos de denúncia com ícones */
const typeLabels: Record<string, string> = {
  bullying: "Bullying",
  assedio: "Assédio",
  exclusao: "Exclusão",
  violencia: "Violência",
  outro: "Outro",
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pendente: { label: "Pendente", color: "text-status-attention", bg: "bg-status-attention/10" },
  em_analise: { label: "Em análise", color: "text-secondary", bg: "bg-accent" },
  resolvida: { label: "Resolvida", color: "text-status-good", bg: "bg-status-good/10" },
};

interface Complaint {
  id: number;
  type: string;
  description: string;
  anonymous: boolean;
  studentName?: string;
  status: string;
  date: string;
  notes: string;
}

const mockComplaints: Complaint[] = [
  { id: 1, type: "bullying", description: "Um grupo de alunos fica rindo e fazendo piadas sobre um colega todos os dias no intervalo. Ele já pediu para pararem mas não param.", anonymous: true, status: "pendente", date: "02/04/2026", notes: "" },
  { id: 2, type: "exclusao", description: "Sempre que formam grupos para trabalho, uma pessoa nunca é escolhida e fica sozinha. Isso acontece em todas as aulas.", anonymous: true, status: "em_analise", date: "01/04/2026", notes: "Observar próxima formação de grupos" },
  { id: 3, type: "violencia", description: "Vi um colega empurrando outro no corredor com força. O que foi empurrado bateu na parede.", anonymous: false, studentName: "Ana L.", status: "pendente", date: "01/04/2026", notes: "" },
  { id: 4, type: "assedio", description: "Alguém está mandando mensagens desconfortáveis para uma colega fora da escola.", anonymous: true, status: "resolvida", date: "29/03/2026", notes: "Caso encaminhado à orientação" },
];

const StudentComplaints = () => {
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);
  const [filter, setFilter] = useState<string>("todas");
  const [typeFilter, setTypeFilter] = useState<string>("todos");

  const filteredComplaints = complaints.filter((c) => {
    if (filter !== "todas" && c.status !== filter) return false;
    if (typeFilter !== "todos" && c.type !== typeFilter) return false;
    return true;
  });

  const updateStatus = (id: number, newStatus: string) => {
    setComplaints(complaints.map((c) => c.id === id ? { ...c, status: newStatus } : c));
  };

  const updateNotes = (id: number, notes: string) => {
    setComplaints(complaints.map((c) => c.id === id ? { ...c, notes } : c));
  };

  const pendingCount = complaints.filter((c) => c.status === "pendente").length;

  return (
    <TeacherLayout>
      <div className="max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-secondary" /> Denúncias
            </h1>
            <p className="text-sm text-muted-foreground">
              {pendingCount} pendente{pendingCount !== 1 && "s"} · Identidade protegida quando anônima
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "todas", label: "Todas" },
            { key: "pendente", label: "Pendentes" },
            { key: "em_analise", label: "Em análise" },
            { key: "resolvida", label: "Resolvidas" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                filter === f.key
                  ? "gradient-hero text-primary-foreground"
                  : "bg-accent text-foreground hover:bg-accent/80"
              }`}
            >
              {f.label}
            </button>
          ))}
          <span className="text-border mx-1">|</span>
          {[
            { key: "todos", label: "Todos os tipos" },
            ...Object.entries(typeLabels).map(([k, v]) => ({ key: k, label: v })),
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setTypeFilter(f.key)}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                typeFilter === f.key
                  ? "gradient-hero text-primary-foreground"
                  : "bg-accent text-foreground hover:bg-accent/80"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Lista de denúncias */}
        <div className="space-y-4">
          {filteredComplaints.map((complaint) => {
            const config = statusConfig[complaint.status];
            return (
              <div key={complaint.id} className="surface-card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                      {config.label}
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-accent text-foreground">
                      {typeLabels[complaint.type]}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{complaint.date}</span>
                </div>

                <p className="text-sm text-foreground mb-2">{complaint.description}</p>
                <p className="text-xs text-muted-foreground mb-4">
                  {complaint.anonymous ? "Denúncia anônima" : `Identificado: ${complaint.studentName}`}
                </p>

                {/* Anotações internas */}
                <div className="mb-3">
                  <label className="text-xs text-muted-foreground mb-1 block">Anotações internas</label>
                  <textarea
                    value={complaint.notes}
                    onChange={(e) => updateNotes(complaint.id, e.target.value)}
                    placeholder="Adicionar anotação..."
                    className="w-full bg-accent rounded-lg p-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-secondary resize-none min-h-[60px]"
                  />
                </div>

                {/* Botões de ação */}
                <div className="flex gap-2">
                  {complaint.status === "pendente" && (
                    <Button variant="outline" size="sm" onClick={() => updateStatus(complaint.id, "em_analise")}>
                      Marcar em análise
                    </Button>
                  )}
                  {complaint.status !== "resolvida" && (
                    <Button variant="hero" size="sm" onClick={() => updateStatus(complaint.id, "resolvida")}>
                      Marcar resolvida
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
          {filteredComplaints.length === 0 && (
            <EmptyState
              title="Nenhuma denúncia por aqui"
              description="Nenhuma denúncia encontrada com esses filtros. A Lis te avisa quando algo chegar."
            />
          )}
        </div>
      </div>
    </TeacherLayout>
  );
};

export default StudentComplaints;
