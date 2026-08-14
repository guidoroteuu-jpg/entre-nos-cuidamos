import { useEffect, useMemo, useState } from "react";
import DirectionLayout from "@/components/layout/DirectionLayout";
import {
  AlertTriangle, Clock, CheckCircle, Search, MessageSquare, ChevronDown, ChevronUp,
  ShieldAlert, Users, Eye, FileDown, UserCheck, CalendarClock, Phone, Mail, FileText, Bell,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

type Status = "pendente" | "em_analise" | "resolvida";
type Categoria = "grave" | "problema" | "atencao";
type AcaoTipo = "conversa_aluno" | "contato_familia" | "encaminhamento" | "reuniao" | "observacao" | "resultado";

interface Acao {
  id: string;
  tipo: AcaoTipo;
  responsavel: string;
  data: string;
  descricao: string;
}

interface Complaint {
  id: string;
  turma: string;
  tipo: string;
  descricao: string;
  data: string;
  status: Status;
  notas: string[];
  gravidade: "baixa" | "media" | "alta";
  categoria: Categoria;
  responsavel: string;
  acoes: Acao[];
  resolvedAt?: string;
  followupAt?: string;
}

const initialComplaints: Omit<Complaint, "categoria" | "responsavel" | "acoes">[] = [
  { id: "D001", turma: "6B", tipo: "Bullying verbal", descricao: "Aluno relata que está sendo chamado por apelidos depreciativos por um grupo de colegas durante o recreio.", data: "2024-03-18", status: "pendente", notas: [], gravidade: "alta" },
  { id: "D002", turma: "5A", tipo: "Exclusão social", descricao: "Estudante afirma que não é convidado para atividades em grupo e que colegas se afastam na hora do lanche.", data: "2024-03-17", status: "em_analise", notas: ["Orientadora conversou com a turma", "Monitorando situação"], gravidade: "media" },
  { id: "D003", turma: "6A", tipo: "Cyberbullying", descricao: "Denúncia de mensagens ofensivas em grupo de WhatsApp da turma.", data: "2024-03-15", status: "em_analise", notas: ["Professora notificada"], gravidade: "alta" },
  { id: "D004", turma: "5B", tipo: "Agressão física", descricao: "Relato de empurrões frequentes na fila do refeitório.", data: "2024-03-10", status: "resolvida", notas: ["Reunião com responsáveis", "Acordo de convivência"], gravidade: "alta" },
  { id: "D005", turma: "7A", tipo: "Desentendimento", descricao: "Aluno apresenta padrão de isolamento crescente.", data: "2024-03-19", status: "pendente", notas: [], gravidade: "baixa" },
];

const triarCategoria = (tipo: string, gravidade: "baixa" | "media" | "alta"): Categoria => {
  const t = tipo.toLowerCase();
  if (gravidade === "alta" || t.includes("agress") || t.includes("cyber")) return "grave";
  if (gravidade === "media" || t.includes("exclus") || t.includes("bullying") || t.includes("isolam")) return "problema";
  return "atencao";
};

const responsavelPorCategoria = (cat: Categoria): string => {
  if (cat === "grave") return "Diretor(a)";
  if (cat === "problema") return "Orientador(a)";
  return "Professor(a) da turma";
};

const categoriaConfig: Record<Categoria, { label: string; bg: string; icon: typeof ShieldAlert; desc: string }> = {
  grave: { label: "Grave", bg: "bg-status-severe text-white", icon: ShieldAlert, desc: "Direção" },
  problema: { label: "Problema", bg: "bg-status-attention text-white", icon: AlertTriangle, desc: "Orientação" },
  atencao: { label: "Atenção", bg: "bg-secondary text-secondary-foreground", icon: Eye, desc: "Professor" },
};

const statusConfig: Record<Status, { label: string; color: string; icon: typeof Clock }> = {
  pendente: { label: "Pendente", color: "bg-status-attention text-white", icon: Clock },
  em_analise: { label: "Em análise", color: "bg-secondary text-secondary-foreground", icon: MessageSquare },
  resolvida: { label: "Resolvida", color: "bg-status-good text-white", icon: CheckCircle },
};

const acaoConfig: Record<AcaoTipo, { label: string; icon: typeof Phone }> = {
  conversa_aluno: { label: "Conversa com aluno", icon: MessageSquare },
  contato_familia: { label: "Contato família", icon: Phone },
  encaminhamento: { label: "Encaminhamento", icon: UserCheck },
  reuniao: { label: "Reunião", icon: Users },
  observacao: { label: "Observação", icon: Eye },
  resultado: { label: "Resultado", icon: CheckCircle },
};

const orientadores = ["Orientadora Marina", "Orientador Paulo", "Diretora Joana", "Profa. Ana (6B)", "Prof. Lucas (5A)"];

const STORAGE_KEY = "entre_nos_denuncias_v2";
const ACCESS_LOG_KEY = "entre_nos_log_acessos";

const logAccess = (acao: string, recurso: string) => {
  const log = JSON.parse(localStorage.getItem(ACCESS_LOG_KEY) || "[]");
  log.unshift({ ts: new Date().toISOString(), usuario: "Diretor(a)", acao, recurso });
  localStorage.setItem(ACCESS_LOG_KEY, JSON.stringify(log.slice(0, 200)));
};

const DirectionComplaints = () => {
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    return initialComplaints.map((c) => {
      const categoria = triarCategoria(c.tipo, c.gravidade);
      return {
        ...c,
        categoria,
        responsavel: responsavelPorCategoria(categoria),
        acoes: c.notas.map((n, i) => ({
          id: `legacy-${c.id}-${i}`,
          tipo: "observacao" as AcaoTipo,
          responsavel: "Sistema",
          data: c.data,
          descricao: n,
        })),
        resolvedAt: c.status === "resolvida" ? c.data : undefined,
        followupAt: c.status === "resolvida"
          ? new Date(new Date(c.data).getTime() + 30 * 86400000).toISOString().slice(0, 10)
          : undefined,
      };
    });
  });
  const [search, setSearch] = useState("");
  const [filterCategoria, setFilterCategoria] = useState<Categoria | "todas">("todas");
  const [filterStatus, setFilterStatus] = useState<Status | "todas">("todas");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [novaAcao, setNovaAcao] = useState<{ tipo: AcaoTipo; descricao: string; responsavel: string }>({
    tipo: "conversa_aluno", descricao: "", responsavel: orientadores[0]!,
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
  }, [complaints]);

  const filtered = complaints.filter((c) => {
    const matchSearch =
      c.tipo.toLowerCase().includes(search.toLowerCase()) ||
      c.turma.toLowerCase().includes(search.toLowerCase()) ||
      c.descricao.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "todas" || c.status === filterStatus;
    const matchCat = filterCategoria === "todas" || c.categoria === filterCategoria;
    return matchSearch && matchStatus && matchCat;
  }).sort((a, b) => {
    const order = { grave: 0, problema: 1, atencao: 2 };
    return order[a.categoria] - order[b.categoria];
  });

  const updateStatus = (id: string, status: Status) => {
    setComplaints((prev) => prev.map((c) => {
      if (c.id !== id) return c;
      const updated = { ...c, status };
      if (status === "resolvida" && !c.resolvedAt) {
        updated.resolvedAt = new Date().toISOString().slice(0, 10);
        updated.followupAt = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
        toast.success("Follow-up agendado para 30 dias");
      }
      return updated;
    }));
    logAccess("alterou status", `Denúncia #${id} → ${status}`);
  };

  const reassignar = (id: string, responsavel: string) => {
    setComplaints((prev) => prev.map((c) => c.id === id ? { ...c, responsavel } : c));
    logAccess("reatribuiu", `Denúncia #${id} para ${responsavel}`);
    toast.success(`Caso atribuído a ${responsavel}`);
  };

  const adicionarAcao = (id: string) => {
    if (!novaAcao.descricao.trim()) return;
    const acao: Acao = {
      id: crypto.randomUUID(),
      tipo: novaAcao.tipo,
      responsavel: novaAcao.responsavel,
      data: new Date().toISOString(),
      descricao: novaAcao.descricao.trim(),
    };
    setComplaints((prev) => prev.map((c) => c.id === id ? { ...c, acoes: [...c.acoes, acao] } : c));
    setNovaAcao({ ...novaAcao, descricao: "" });
    logAccess("registrou ação", `Denúncia #${id}: ${acaoConfig[novaAcao.tipo].label}`);
    toast.success("Ação registrada no log");
  };

  const exportarPDF = (c: Complaint) => {
    logAccess("exportou documentação", `Denúncia #${c.id}`);
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Documentação ${c.id}</title>
      <style>
        body{font-family:Arial,sans-serif;max-width:780px;margin:40px auto;padding:0 20px;color:#1a1a1a;line-height:1.6}
        h1{color:#26215C;border-bottom:3px solid #26215C;padding-bottom:10px}
        h2{color:#26215C;margin-top:30px;font-size:16px}
        .meta{background:#f5f5fa;padding:15px;border-radius:8px;margin:20px 0}
        .meta div{margin:4px 0}
        .badge{display:inline-block;padding:3px 10px;border-radius:12px;font-size:11px;font-weight:bold;color:white}
        .grave{background:#dc2626}.problema{background:#f59e0b}.atencao{background:#3b82f6}
        table{width:100%;border-collapse:collapse;margin:10px 0;font-size:13px}
        th,td{border:1px solid #ddd;padding:8px;text-align:left}
        th{background:#26215C;color:white}
        .footer{margin-top:40px;padding-top:15px;border-top:1px solid #ccc;font-size:11px;color:#666}
      </style></head><body>
      <h1>Documentação Oficial — Denúncia ${c.id}</h1>
      <span class="badge ${c.categoria}">${categoriaConfig[c.categoria].label.toUpperCase()}</span>
      <div class="meta">
        <div><strong>Tipo:</strong> ${c.tipo}</div>
        <div><strong>Turma:</strong> ${c.turma}</div>
        <div><strong>Data do registro:</strong> ${new Date(c.data).toLocaleDateString("pt-BR")}</div>
        <div><strong>Status atual:</strong> ${statusConfig[c.status].label}</div>
        <div><strong>Responsável:</strong> ${c.responsavel}</div>
        ${c.resolvedAt ? `<div><strong>Resolvido em:</strong> ${new Date(c.resolvedAt).toLocaleDateString("pt-BR")}</div>` : ""}
      </div>
      <h2>Descrição da ocorrência</h2>
      <p>${c.descricao}</p>
      <h2>Cronograma de ações tomadas</h2>
      <table><thead><tr><th>Data</th><th>Ação</th><th>Responsável</th><th>Descrição</th></tr></thead><tbody>
        ${c.acoes.map(a => `<tr>
          <td>${new Date(a.data).toLocaleString("pt-BR")}</td>
          <td>${acaoConfig[a.tipo].label}</td>
          <td>${a.responsavel}</td>
          <td>${a.descricao}</td>
        </tr>`).join("") || "<tr><td colspan='4'>Sem ações registradas</td></tr>"}
      </tbody></table>
      <div class="footer">
        Documento emitido por Entre Nós em ${new Date().toLocaleString("pt-BR")}.<br/>
        Este documento contém informações sigilosas — uso restrito a fins legais e pedagógicos.
      </div>
      <script>window.print()</script>
      </body></html>`;
    const w = window.open("", "_blank");
    if (w) { w.document.write(html); w.document.close(); }
    toast.success("Documentação gerada");
  };

  const counts = useMemo(() => ({
    todas: complaints.length,
    grave: complaints.filter(c => c.categoria === "grave").length,
    problema: complaints.filter(c => c.categoria === "problema").length,
    atencao: complaints.filter(c => c.categoria === "atencao").length,
  }), [complaints]);

  const followupsPendentes = complaints.filter(c =>
    c.followupAt && new Date(c.followupAt) <= new Date() && c.status === "resolvida"
  );

  return (
    <DirectionLayout>
      <div className="w-full space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Denúncias</h1>
          <p className="text-sm text-muted-foreground">Triagem automática, log de ações e documentação legal</p>
        </div>

        {/* Follow-ups */}
        {followupsPendentes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-status-attention/10 border border-status-attention/40 rounded-2xl p-4 flex items-start gap-3"
          >
            <Bell className="w-5 h-5 text-status-attention flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-heading font-bold text-foreground text-sm">
                {followupsPendentes.length} follow-up(s) pendente(s)
              </p>
              <p className="text-xs text-muted-foreground">
                Casos resolvidos há mais de 30 dias precisam de verificação:{" "}
                {followupsPendentes.map(c => `#${c.id}`).join(", ")}
              </p>
            </div>
          </motion.div>
        )}

        {/* Triagem cards */}
        <div className="grid grid-cols-3 gap-3">
          {(["grave", "problema", "atencao"] as const).map(cat => {
            const cfg = categoriaConfig[cat];
            const Icon = cfg.icon;
            return (
              <button
                key={cat}
                onClick={() => setFilterCategoria(filterCategoria === cat ? "todas" : cat)}
                className={`text-left p-4 rounded-2xl border-2 transition-all ${
                  filterCategoria === cat ? "border-primary bg-accent/40" : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold mb-2 ${cfg.bg}`}>
                  <Icon className="w-3 h-3" />
                  {cfg.label}
                </div>
                <p className="font-heading text-2xl font-bold text-foreground">{counts[cat]}</p>
                <p className="text-xs text-muted-foreground">→ {cfg.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 micro-input" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(["todas", "pendente", "em_analise", "resolvida"] as const).map((s) => (
              <Button
                key={s}
                size="sm"
                variant={filterStatus === s ? "default" : "outline"}
                onClick={() => setFilterStatus(s)}
                className="text-xs"
              >
                {s === "todas" ? "Todos status" : statusConfig[s].label}
              </Button>
            ))}
          </div>
        </div>

        {/* Lista */}
        <div className="space-y-3">
          {filtered.map((c, i) => {
            const cfg = statusConfig[c.status];
            const catCfg = categoriaConfig[c.categoria];
            const CatIcon = catCfg.icon;
            const isExpanded = expanded === c.id;
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-card rounded-2xl border border-border shadow-card overflow-hidden"
              >
                <div className="p-5 cursor-pointer hover:bg-accent/30 transition-colors" onClick={() => { setExpanded(isExpanded ? null : c.id); if (!isExpanded) logAccess("visualizou", `Denúncia #${c.id}`); }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${catCfg.bg}`}>
                          <CatIcon className="w-3 h-3" />
                          {catCfg.label}
                        </span>
                        <span className="font-heading font-bold text-foreground">{c.tipo}</span>
                        <span className="text-xs text-muted-foreground">#{c.id}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{c.descricao}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground flex-wrap">
                        <span>Turma {c.turma}</span>
                        <span>·</span>
                        <span>{new Date(c.data).toLocaleDateString("pt-BR")}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><UserCheck className="w-3 h-3" />{c.responsavel}</span>
                        {c.acoes.length > 0 && (<><span>·</span><span>{c.acoes.length} ação(ões)</span></>)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
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
                      <div className="px-5 pb-5 border-t border-border pt-4 space-y-5">
                        {/* Atribuição */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
                          <div className="flex-1">
                            <p className="text-xs font-medium text-muted-foreground mb-1.5">Atribuir a</p>
                            <Select value={c.responsavel} onValueChange={(v) => reassignar(c.id, v)}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {orientadores.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => exportarPDF(c)} className="gap-2">
                            <FileDown className="w-4 h-4" /> Documentação legal (PDF)
                          </Button>
                        </div>

                        {/* Status */}
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-2">Status do caso</p>
                          <div className="flex gap-2 flex-wrap">
                            {(["pendente", "em_analise", "resolvida"] as Status[]).map((s) => (
                              <Button key={s} size="sm" variant={c.status === s ? "default" : "outline"} onClick={() => updateStatus(c.id, s)} className="text-xs">
                                {statusConfig[s].label}
                              </Button>
                            ))}
                          </div>
                          {c.followupAt && c.status === "resolvida" && (
                            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                              <CalendarClock className="w-3 h-3" />
                              Follow-up automático em {new Date(c.followupAt).toLocaleDateString("pt-BR")}
                            </p>
                          )}
                        </div>

                        {/* Log de ações */}
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                            <FileText className="w-3 h-3" /> Log de ações ({c.acoes.length})
                          </p>
                          {c.acoes.length > 0 && (
                            <div className="space-y-2 mb-3 border-l-2 border-primary/30 pl-4">
                              {c.acoes.map((a) => {
                                const Icon = acaoConfig[a.tipo].icon;
                                return (
                                  <div key={a.id} className="bg-accent/40 rounded-lg p-3 text-sm">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Icon className="w-3.5 h-3.5 text-primary" />
                                      <span className="font-medium text-foreground text-xs">{acaoConfig[a.tipo].label}</span>
                                      <span className="text-xs text-muted-foreground">· {a.responsavel}</span>
                                      <span className="text-xs text-muted-foreground ml-auto">{new Date(a.data).toLocaleString("pt-BR")}</span>
                                    </div>
                                    <p className="text-foreground text-xs">{a.descricao}</p>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          <div className="space-y-2 bg-accent/20 rounded-xl p-3">
                            <div className="grid grid-cols-2 gap-2">
                              <Select value={novaAcao.tipo} onValueChange={(v) => setNovaAcao({ ...novaAcao, tipo: v as AcaoTipo })}>
                                <SelectTrigger className="text-xs h-9"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  {Object.entries(acaoConfig).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                                </SelectContent>
                              </Select>
                              <Select value={novaAcao.responsavel} onValueChange={(v) => setNovaAcao({ ...novaAcao, responsavel: v })}>
                                <SelectTrigger className="text-xs h-9"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  {orientadores.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex gap-2">
                              <Input
                                placeholder="Descreva a ação tomada..."
                                value={novaAcao.descricao}
                                onChange={(e) => setNovaAcao({ ...novaAcao, descricao: e.target.value })}
                                onKeyDown={(e) => e.key === "Enter" && adicionarAcao(c.id)}
                                className="micro-input text-sm"
                              />
                              <Button size="sm" onClick={() => adicionarAcao(c.id)}>Registrar</Button>
                            </div>
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
