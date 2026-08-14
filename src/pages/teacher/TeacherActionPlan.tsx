import { FormEvent, useMemo, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle, ClipboardList, Loader2, Sparkles, UserRound } from "lucide-react";
import { toast } from "sonner";
import TeacherLayout from "@/components/layout/TeacherLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { generateActionPlan } from "@/lib/generate-action-plan.functions";
import { cn } from "@/lib/utils";

type ActionStatus = "pendente" | "em_andamento" | "concluida";
type RiskStatus = "Problema" | "Grave";

type StudentProfile = { id: string; name: string; className: string; status: RiskStatus; signals: string; strengths: string };
type PlanAction = { id: string; studentId: string; action: string; owner: string; dueDate: Date; status: ActionStatus };

const students: StudentProfile[] = [
  { id: "s5", name: "Aluno #5", className: "5A", status: "Problema", signals: "Queda de humor, pouca participação e recusa em trabalhos em dupla.", strengths: "Responde bem a tarefas com desenho e combinados claros." },
  { id: "s10", name: "Aluno #10", className: "5A", status: "Grave", signals: "Isolamento recorrente, fala negativa sobre si e evasão de atividades coletivas.", strengths: "Procura adultos de referência quando abordado com discrição." },
  { id: "s17", name: "Aluno #17", className: "5A", status: "Problema", signals: "Conflitos frequentes no recreio e irritabilidade após mudanças de rotina.", strengths: "Tem boa adesão a atividades com papéis definidos." },
];

const initialActions: PlanAction[] = [
  { id: "act-1", studentId: "s5", action: "Realizar acolhimento individual breve no início da semana.", owner: "Professor regente", dueDate: new Date("2026-04-28"), status: "em_andamento" },
  { id: "act-2", studentId: "s10", action: "Encaminhar observações à orientação e combinar adulto de referência.", owner: "Orientação", dueDate: new Date("2026-04-25"), status: "pendente" },
  { id: "act-3", studentId: "s17", action: "Definir dupla mediadora e função positiva em atividade colaborativa.", owner: "Professor regente", dueDate: new Date("2026-04-30"), status: "pendente" },
];

const statusLabels: Record<ActionStatus, string> = { pendente: "Pendente", em_andamento: "Em andamento", concluida: "Concluída" };

const TeacherActionPlan = () => {
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]!.id);
  const [actions, setActions] = useState(initialActions);
  const [form, setForm] = useState({ action: "", owner: "", status: "pendente" as ActionStatus });
  const [dueDate, setDueDate] = useState<Date>();
  const [aiContext, setAiContext] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  const selectedStudent = students.find((student) => student.id === selectedStudentId) || students[0]!;
  const studentActions = useMemo(() => actions.filter((item) => item.studentId === selectedStudent.id), [actions, selectedStudent.id]);
  const completed = studentActions.filter((item) => item.status === "concluida").length;

  const addAction = (event: FormEvent) => {
    event.preventDefault();
    if (form.action.trim().length < 8 || form.owner.trim().length < 3 || !dueDate) {
      toast.error("Preencha ação, responsável e prazo.");
      return;
    }

    setActions((current) => [
      { id: crypto.randomUUID(), studentId: selectedStudent.id, action: form.action.trim(), owner: form.owner.trim(), dueDate, status: form.status },
      ...current,
    ]);
    setForm({ action: "", owner: "", status: "pendente" });
    setDueDate(undefined);
    toast.success("Ação adicionada ao plano individualizado.");
  };

  const updateActionStatus = (id: string, status: ActionStatus) => {
    setActions((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  const generatePlan = async () => {
    if (aiContext.trim().length < 10) {
      toast.error("Descreva o contexto observado para a IA.");
      return;
    }

    setLoadingAi(true);
    setAiResult("");
    try {
      const data = await generateActionPlan({
        data: { studentProfile: `${selectedStudent.name} · ${selectedStudent.className}`, status: selectedStudent.status, context: aiContext.trim() },
      });
      setLoadingAi(false);

      if (data?.error || !data?.content) {
        toast.error(data?.error || "Não foi possível gerar o plano.");
        return;
      }
      setAiResult(data.content);
      toast.success("Sugestões geradas com apoio da IA.");
    } catch (err) {
      setLoadingAi(false);
      toast.error(err instanceof Error ? err.message : "Não foi possível gerar o plano.");
    }
  };

  return (
    <TeacherLayout>
      <div className="w-full space-y-6">
        <div>
          <div className="flex items-center gap-2 text-secondary mb-2">
            <ClipboardList className="w-5 h-5" />
            <span className="text-sm font-semibold">Acompanhamento individual</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Plano de ação individualizado</h1>
          <p className="text-sm text-muted-foreground">Perfil dos alunos em status Problema ou Grave, com ações, responsável, prazo e execução.</p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-5">
          <aside className="bg-card rounded-2xl p-4 border border-border shadow-card space-y-3">
            {students.map((student) => (
              <button key={student.id} onClick={() => setSelectedStudentId(student.id)} className={cn("w-full text-left rounded-xl border p-4 transition-colors", selectedStudent.id === student.id ? "border-secondary bg-accent" : "border-border bg-background hover:bg-accent/60")}>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-heading font-bold text-foreground">{student.name}</span>
                  <Badge variant={student.status === "Grave" ? "destructive" : "outline"}>{student.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Turma {student.className}</p>
              </button>
            ))}
          </aside>

          <div className="space-y-5">
            <section className="surface-card p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-heading font-bold text-foreground flex items-center gap-2"><UserRound className="w-5 h-5 text-secondary" /> Perfil do aluno</h2>
                  <p className="text-sm text-muted-foreground">{selectedStudent.name} · Turma {selectedStudent.className}</p>
                </div>
                <Badge variant={selectedStudent.status === "Grave" ? "destructive" : "outline"}>{selectedStudent.status}</Badge>
              </div>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-accent p-3"><span className="font-medium text-foreground">Sinais observados: </span><span className="text-muted-foreground">{selectedStudent.signals}</span></div>
                <div className="rounded-xl bg-accent p-3"><span className="font-medium text-foreground">Potencialidades: </span><span className="text-muted-foreground">{selectedStudent.strengths}</span></div>
              </div>
            </section>

            <section className="surface-card p-5 space-y-4">
              <h2 className="font-heading font-bold text-foreground flex items-center gap-2"><Sparkles className="w-5 h-5 text-secondary" /> Ajuda da IA</h2>
              <Textarea className="min-h-24" value={aiContext} onChange={(event) => setAiContext(event.target.value)} placeholder="Descreva o contexto observado sem expor dados sensíveis..." />
              <Button onClick={generatePlan} disabled={loadingAi}>{loadingAi ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} Sugerir ações</Button>
              {aiResult && <div className="rounded-xl border border-border bg-accent p-4"><pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">{aiResult}</pre></div>}
            </section>

            <form onSubmit={addAction} className="surface-card p-5 space-y-4" noValidate>
              <h2 className="font-heading font-bold text-foreground">Nova ação do plano</h2>
              <Field label="Ação">
                <Input value={form.action} onChange={(event) => setForm((current) => ({ ...current, action: event.target.value }))} />
              </Field>
              <div className="grid md:grid-cols-3 gap-4">
                <Field label="Responsável">
                  <Input value={form.owner} onChange={(event) => setForm((current) => ({ ...current, owner: event.target.value }))} />
                </Field>
                <Field label="Prazo">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}><CalendarIcon className="w-4 h-4" /> {dueDate ? format(dueDate, "dd/MM/yyyy") : "Selecionar data"}</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={dueDate} onSelect={setDueDate} disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))} initialFocus />
                    </PopoverContent>
                  </Popover>
                </Field>
                <Field label="Status">
                  <Select value={form.status} onValueChange={(value) => setForm((current) => ({ ...current, status: value as ActionStatus }))}>
                    <SelectTrigger aria-label="Status da ação"><SelectValue /></SelectTrigger>
                    <SelectContent>{Object.entries(statusLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
              </div>
              <Button type="submit"><CheckCircle className="w-4 h-4" /> Adicionar ação</Button>
            </form>

            <section className="surface-card p-5 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-heading font-bold text-foreground">Ações do plano</h2>
                <span className="text-sm text-muted-foreground">{completed}/{studentActions.length} concluídas</span>
              </div>
              <div className="space-y-3">
                {studentActions.map((item) => (
                  <article key={item.id} className="rounded-xl border border-border bg-background p-4 space-y-3">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                      <p className="text-sm font-medium text-foreground">{item.action}</p>
                      <Badge variant={item.status === "concluida" ? "secondary" : "outline"}>{statusLabels[item.status]}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Responsável: {item.owner} · Prazo: {format(item.dueDate, "dd/MM/yyyy")}</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(statusLabels).map(([value, label]) => <Button key={value} size="sm" variant={item.status === value ? "default" : "outline"} onClick={() => updateActionStatus(item.id, value as ActionStatus)}>{label}</Button>)}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => <div className="space-y-2"><Label className="text-sm font-medium text-foreground">{label}</Label>{children}</div>;

export default TeacherActionPlan;