import { FormEvent, useMemo, useState } from "react";
import { ClipboardCheck, Clock, FileText, Stethoscope, UserCheck, Users } from "lucide-react";
import { toast } from "sonner";
import DirectionLayout from "@/components/layout/DirectionLayout";
import TeacherLayout from "@/components/layout/TeacherLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type ReferralRole = "teacher" | "admin";
type ReferralStatus = "registrado" | "triagem" | "encaminhado" | "em_acompanhamento" | "concluido";

type SpecialistCase = {
  id: string;
  student: string;
  className: string;
  specialist: string;
  reason: string;
  priority: string;
  description: string;
  familyContact: string;
  createdAt: string;
  status: ReferralStatus;
};

const statusOptions: { value: ReferralStatus; label: string }[] = [
  { value: "registrado", label: "Registrado" },
  { value: "triagem", label: "Em triagem" },
  { value: "encaminhado", label: "Encaminhado" },
  { value: "em_acompanhamento", label: "Em acompanhamento" },
  { value: "concluido", label: "Concluído" },
];

const initialCases: SpecialistCase[] = [
  {
    id: "ESP-2041",
    student: "Aluno acompanhado",
    className: "5A",
    specialist: "Orientador educacional",
    reason: "Ansiedade recorrente em atividades avaliativas",
    priority: "Média",
    description: "Observação contínua de choro, evitação de apresentações e queda de participação em sala.",
    familyContact: "Família informada pela coordenação",
    createdAt: "2026-04-19T09:20:00",
    status: "em_acompanhamento",
  },
  {
    id: "ESP-2042",
    student: "Estudante da turma",
    className: "6B",
    specialist: "Psicólogo escolar",
    reason: "Isolamento social persistente",
    priority: "Alta",
    description: "Aluno evita grupos, permanece sozinho no recreio e recusou participar de atividades colaborativas.",
    familyContact: "Contato inicial pendente",
    createdAt: "2026-04-21T11:10:00",
    status: "triagem",
  },
];

const SpecialistReferralContent = ({ role }: { role: ReferralRole }) => {
  const [cases, setCases] = useState(initialCases);
  const [form, setForm] = useState({ student: "", className: "", specialist: "", reason: "", priority: "", description: "", familyContact: "" });

  const stats = useMemo(
    () => ({
      total: cases.length,
      open: cases.filter((item) => item.status !== "concluido").length,
      followUp: cases.filter((item) => item.status === "em_acompanhamento").length,
    }),
    [cases],
  );

  const updateField = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const requiredFields = [form.student, form.className, form.specialist, form.reason, form.priority, form.description, form.familyContact];
    if (requiredFields.some((field) => field.trim().length < 3) || form.description.trim().length < 30) {
      toast.error("Preencha o encaminhamento com dados suficientes para acompanhamento.");
      return;
    }

    const newCase: SpecialistCase = {
      id: `ESP-${Math.floor(1000 + Math.random() * 9000)}`,
      student: form.student.trim(),
      className: form.className.trim(),
      specialist: form.specialist,
      reason: form.reason.trim(),
      priority: form.priority,
      description: form.description.trim(),
      familyContact: form.familyContact.trim(),
      createdAt: new Date().toISOString(),
      status: "registrado",
    };

    setCases((current) => [newCase, ...current]);
    setForm({ student: "", className: "", specialist: "", reason: "", priority: "", description: "", familyContact: "" });
    toast.success("Encaminhamento registrado para acompanhamento.");
  };

  const updateStatus = (id: string, status: ReferralStatus) => {
    setCases((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
    toast.success("Status do caso atualizado.");
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <div className="flex items-center gap-2 text-secondary mb-2">
          <Stethoscope className="w-5 h-5" />
          <span className="text-sm font-semibold">{role === "admin" ? "Diretoria" : "Professor"}</span>
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Encaminhamento para especialista</h1>
        <p className="text-sm text-muted-foreground">Fluxo formal para encaminhar aluno ao psicólogo ou orientador, com registro e acompanhamento do caso.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <SummaryCard icon={FileText} label="Casos registrados" value={stats.total} />
        <SummaryCard icon={Clock} label="Casos abertos" value={stats.open} />
        <SummaryCard icon={UserCheck} label="Em acompanhamento" value={stats.followUp} />
      </div>

      <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-5 md:p-6 border border-border shadow-card space-y-5" noValidate>
        <div className="flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-secondary" />
          <h2 className="font-heading font-bold text-foreground">Novo encaminhamento</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Aluno">
            <Input value={form.student} onChange={(event) => updateField("student", event.target.value)} />
          </Field>
          <Field label="Turma/Série">
            <Input value={form.className} onChange={(event) => updateField("className", event.target.value)} />
          </Field>
          <Field label="Especialista indicado">
            <Select value={form.specialist} onValueChange={(value) => updateField("specialist", value)}>
              <SelectTrigger aria-label="Especialista indicado"><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Psicólogo escolar">Psicólogo escolar</SelectItem>
                <SelectItem value="Orientador educacional">Orientador educacional</SelectItem>
                <SelectItem value="Coordenação pedagógica">Coordenação pedagógica</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Prioridade">
            <Select value={form.priority} onValueChange={(value) => updateField("priority", value)}>
              <SelectTrigger aria-label="Prioridade"><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Baixa">Baixa</SelectItem>
                <SelectItem value="Média">Média</SelectItem>
                <SelectItem value="Alta">Alta</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Field label="Motivo do encaminhamento">
          <Input value={form.reason} onChange={(event) => updateField("reason", event.target.value)} />
        </Field>
        <Field label="Descrição objetiva do caso">
          <Textarea className="min-h-32" value={form.description} onChange={(event) => updateField("description", event.target.value)} />
        </Field>
        <Field label="Contato/ciência da família">
          <Input value={form.familyContact} onChange={(event) => updateField("familyContact", event.target.value)} />
        </Field>

        <Button type="submit"><ClipboardCheck className="w-4 h-4" /> Registrar encaminhamento</Button>
      </form>

      <section className="bg-card rounded-2xl p-5 md:p-6 border border-border shadow-card space-y-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-secondary" />
          <h2 className="font-heading font-bold text-foreground">Acompanhamento dos casos</h2>
        </div>
        <div className="space-y-3">
          {cases.map((item) => (
            <article key={item.id} className="rounded-xl border border-border bg-background p-4 space-y-3">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-heading font-bold text-foreground">{item.student}</span>
                    <Badge variant={item.priority === "Alta" ? "destructive" : "outline"}>{item.priority}</Badge>
                    <Badge variant="secondary">{statusOptions.find((status) => status.value === item.status)?.label}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.className} · {item.specialist} · {item.reason}</p>
                </div>
                <span className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleString("pt-BR")}</span>
              </div>
              <p className="text-sm text-foreground">{item.description}</p>
              <p className="text-xs text-muted-foreground">Família: {item.familyContact} · Protocolo {item.id}</p>
              {role === "admin" && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {statusOptions.map((status) => (
                    <Button key={status.value} size="sm" variant={item.status === status.value ? "default" : "outline"} onClick={() => updateStatus(item.id, status.value)}>
                      {status.label}
                    </Button>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

const SummaryCard = ({ icon: Icon, label, value }: { icon: typeof FileText; label: string; value: number }) => (
  <div className="surface-card p-5">
    <div className="flex items-center gap-2 mb-2">
      <Icon className="w-4 h-4 text-secondary" />
      <span className="text-sm font-medium text-foreground">{label}</span>
    </div>
    <p className="text-2xl font-heading font-bold text-foreground">{value}</p>
  </div>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium text-foreground">{label}</Label>
    {children}
  </div>
);

const SpecialistReferral = ({ role }: { role: ReferralRole }) => {
  const content = <SpecialistReferralContent role={role} />;
  return role === "admin" ? <DirectionLayout>{content}</DirectionLayout> : <TeacherLayout>{content}</TeacherLayout>;
};

export default SpecialistReferral;