import { FormEvent, useMemo, useState } from "react";
import { CheckCheck, Clock, FileText, MailCheck, Send, Users } from "lucide-react";
import { toast } from "sonner";
import DirectionLayout from "@/components/layout/DirectionLayout";
import TeacherLayout from "@/components/layout/TeacherLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type FamilyChannelRole = "teacher" | "admin";
type MessageStatus = "unread" | "read";

type FamilyMessage = {
  id: string;
  student: string;
  guardian: string;
  contact: string;
  type: string;
  subject: string;
  message: string;
  createdAt: string;
  status: MessageStatus;
};

const initialMessages: FamilyMessage[] = [
  {
    id: "FAM-1024",
    student: "Aluno acompanhado",
    guardian: "Responsável familiar",
    contact: "responsavel@email.com",
    type: "Alerta",
    subject: "Acompanhamento socioemocional",
    message: "Solicitamos uma conversa breve com a escola para acompanhamento preventivo.",
    createdAt: "2026-04-20T10:30:00",
    status: "read",
  },
  {
    id: "FAM-1025",
    student: "Estudante da turma",
    guardian: "Família cadastrada",
    contact: "(00) 90000-0000",
    type: "Relatório",
    subject: "Resumo de acompanhamento",
    message: "Relatório pedagógico e socioemocional preparado para ciência da família.",
    createdAt: "2026-04-21T14:15:00",
    status: "unread",
  },
];

const FamilyChannelContent = ({ role }: { role: FamilyChannelRole }) => {
  const [messages, setMessages] = useState(initialMessages);
  const [form, setForm] = useState({ student: "", guardian: "", contact: "", type: "", subject: "", message: "" });

  const stats = useMemo(
    () => ({
      total: messages.length,
      read: messages.filter((item) => item.status === "read").length,
      unread: messages.filter((item) => item.status === "unread").length,
    }),
    [messages],
  );

  const updateField = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const requiredFields = [form.student, form.guardian, form.contact, form.type, form.subject, form.message];
    if (requiredFields.some((field) => field.trim().length < 3)) {
      toast.error("Preencha os dados do comunicado antes de salvar.");
      return;
    }

    const newMessage: FamilyMessage = {
      id: `FAM-${Math.floor(1000 + Math.random() * 9000)}`,
      student: form.student.trim(),
      guardian: form.guardian.trim(),
      contact: form.contact.trim(),
      type: form.type,
      subject: form.subject.trim(),
      message: form.message.trim(),
      createdAt: new Date().toISOString(),
      status: "unread",
    };

    setMessages((current) => [newMessage, ...current]);
    setForm({ student: "", guardian: "", contact: "", type: "", subject: "", message: "" });
    toast.success("Comunicado registrado no Canal com a família.");
  };

  const markAsRead = (id: string) => {
    setMessages((current) => current.map((item) => (item.id === id ? { ...item, status: "read" } : item)));
    toast.success("Confirmação de leitura registrada.");
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <div className="flex items-center gap-2 text-secondary mb-2">
          <MailCheck className="w-5 h-5" />
          <span className="text-sm font-semibold">{role === "admin" ? "Diretoria" : "Professor"}</span>
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Canal com a família</h1>
        <p className="text-sm text-muted-foreground">Registro de alertas e relatórios para responsáveis, com acompanhamento de leitura.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <SummaryCard icon={Send} label="Comunicados" value={stats.total} />
        <SummaryCard icon={Clock} label="Aguardando leitura" value={stats.unread} />
        <SummaryCard icon={CheckCheck} label="Leituras confirmadas" value={stats.read} />
      </div>

      <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-5 md:p-6 border border-border shadow-card space-y-5" noValidate>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-secondary" />
          <h2 className="font-heading font-bold text-foreground">Novo comunicado</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Aluno">
            <Input value={form.student} onChange={(event) => updateField("student", event.target.value)} />
          </Field>
          <Field label="Responsável">
            <Input value={form.guardian} onChange={(event) => updateField("guardian", event.target.value)} />
          </Field>
          <Field label="Contato do responsável">
            <Input value={form.contact} onChange={(event) => updateField("contact", event.target.value)} />
          </Field>
          <Field label="Tipo de comunicação">
            <Select value={form.type} onValueChange={(value) => updateField("type", value)}>
              <SelectTrigger aria-label="Tipo de comunicação"><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Alerta">Alerta</SelectItem>
                <SelectItem value="Relatório">Relatório</SelectItem>
                <SelectItem value="Convocação">Convocação</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Field label="Assunto">
          <Input value={form.subject} onChange={(event) => updateField("subject", event.target.value)} />
        </Field>
        <Field label="Mensagem ao responsável">
          <Textarea className="min-h-32" value={form.message} onChange={(event) => updateField("message", event.target.value)} />
        </Field>

        <Button type="submit"><Send className="w-4 h-4" /> Salvar comunicado</Button>
      </form>

      <section className="bg-card rounded-2xl p-5 md:p-6 border border-border shadow-card space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-secondary" />
          <h2 className="font-heading font-bold text-foreground">Histórico de comunicações</h2>
        </div>
        <div className="space-y-3">
          {messages.map((item) => (
            <article key={item.id} className="rounded-xl border border-border bg-background p-4 space-y-3">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-heading font-bold text-foreground">{item.subject}</span>
                    <Badge variant={item.status === "read" ? "secondary" : "outline"}>{item.status === "read" ? "Lido" : "Aguardando leitura"}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.type} · {item.student} · {item.guardian}</p>
                </div>
                <span className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleString("pt-BR")}</span>
              </div>
              <p className="text-sm text-foreground">{item.message}</p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground">
                <span>Contato: {item.contact} · Protocolo {item.id}</span>
                {item.status === "unread" && <Button size="sm" variant="outline" onClick={() => markAsRead(item.id)}>Confirmar leitura</Button>}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

const SummaryCard = ({ icon: Icon, label, value }: { icon: typeof Send; label: string; value: number }) => (
  <div className="bg-card rounded-xl p-5 border border-border shadow-card">
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

const FamilyChannel = ({ role }: { role: FamilyChannelRole }) => {
  const content = <FamilyChannelContent role={role} />;
  return role === "admin" ? <DirectionLayout>{content}</DirectionLayout> : <TeacherLayout>{content}</TeacherLayout>;
};

export default FamilyChannel;