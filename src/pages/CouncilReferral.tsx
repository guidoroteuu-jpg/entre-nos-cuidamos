import { FormEvent, useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { AlertTriangle, Filter, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import DirectionLayout from "@/components/layout/DirectionLayout";
import TeacherLayout from "@/components/layout/TeacherLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const reasonOptions = [
  "Excesso de faltas injustificadas",
  "Suspeita de violência doméstica",
  "Suspeita de negligência",
  "Sinais de abuso físico ou psicológico",
  "Trabalho infantil",
  "Outro",
];

const contactOptions = ["Sim", "Não", "Tentativa sem sucesso"];

const statusOptions = [
  { value: "registrado", label: "Registrado" },
  { value: "encaminhado", label: "Encaminhado" },
  { value: "em_acompanhamento", label: "Em acompanhamento" },
  { value: "concluido", label: "Concluído" },
];

type UserRole = "admin" | "teacher" | "student";

type SchoolOption = {
  id: string;
  name: string;
  className?: string;
};

type ReferralRecord = {
  id: string;
  protocolo: string;
  student_full_name: string;
  class_or_grade: string;
  reasons: string[];
  other_reason: string | null;
  detailed_description: string;
  registrant_name: string;
  family_contact_attempt: string;
  created_at: string;
  status: string;
};

type AuditRecord = {
  id: string;
  acionamento_id: string;
  actor_name: string;
  action: string;
  previous_status: string | null;
  new_status: string | null;
  reasons: string[];
  created_at: string;
};

type FormState = {
  student_full_name: string;
  class_or_grade: string;
  student_birth_date: string;
  guardian_name: string;
  guardian_contact: string;
  reasons: string[];
  other_reason: string;
  detailed_description: string;
  absences_count: string;
  last_occurrence_date: string;
  family_contact_attempt: string;
  escola_id: string;
};

const initialForm: FormState = {
  student_full_name: "",
  class_or_grade: "",
  student_birth_date: "",
  guardian_name: "",
  guardian_contact: "",
  reasons: [],
  other_reason: "",
  detailed_description: "",
  absences_count: "",
  last_occurrence_date: "",
  family_contact_attempt: "",
  escola_id: "",
};

const ReferralContent = ({ role }: { role: "teacher" | "admin" }) => {
  const [userId, setUserId] = useState("");
  const [registrantName, setRegistrantName] = useState("");
  const [schools, setSchools] = useState<SchoolOption[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [records, setRecords] = useState<ReferralRecord[]>([]);
  const [auditRecords, setAuditRecords] = useState<AuditRecord[]>([]);
  const [filters, setFilters] = useState({ student: "", date: "", reason: "todos" });
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const isAdmin = role === "admin";

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      const { data: authData } = await supabase.auth.getUser();
      const currentUser = authData.user;
      const localStaffRole = localStorage.getItem("entre_nos_staff_role");
      const localStaffEmail = localStorage.getItem("entre_nos_staff_email");
      const hasLocalAccess = !currentUser && localStaffRole === (isAdmin ? "direcao" : "professor");

      if (!currentUser && !hasLocalAccess) {
        setLoading(false);
        return;
      }

      setUserId(currentUser?.id || `local-${localStaffRole}`);

      const [{ data: profileData }, schoolResponse] = await Promise.all([
        currentUser ? supabase.from("profiles").select("full_name").eq("user_id", currentUser.id).maybeSingle() : Promise.resolve({ data: null }),
        currentUser
          ? isAdmin
            ? supabase.from("escolas").select("id,name").order("name")
            : supabase.from("turmas").select("name,escola_id").eq("teacher_id", currentUser.id).order("name")
          : Promise.resolve({ data: [] }),
      ]);

      const name = profileData?.full_name || currentUser?.email || localStaffEmail || "Usuário logado";
      setRegistrantName(name);

      const loadedSchools: SchoolOption[] = isAdmin
        ? ((schoolResponse.data || []) as Array<{ id: string; name: string }>).map((school) => ({ id: school.id, name: school.name }))
        : ((schoolResponse.data || []) as Array<{ escola_id: string; name: string }>).map((turma) => ({
            id: turma.escola_id,
            name: `Escola da turma ${turma.name}`,
            className: turma.name,
          }));

      const fallbackSchools = loadedSchools.length > 0 ? loadedSchools : [{ id: "local-school", name: "Escola vinculada" }];
      setSchools(fallbackSchools);
      setForm((current) => ({
        ...current,
        escola_id: fallbackSchools[0]?.id || "",
        class_or_grade: !isAdmin && fallbackSchools[0]?.className ? fallbackSchools[0].className : current.class_or_grade,
      }));
      setLoading(false);
    };

    loadInitialData();
  }, [isAdmin]);

  const fetchRecords = async () => {
    const pageSize = 10;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const query = (supabase as any)
      .from("conselho_tutelar_acionamentos")
      .select("id,protocolo,student_full_name,class_or_grade,reasons,other_reason,detailed_description,registrant_name,family_contact_attempt,created_at,status")
      .order("created_at", { ascending: false })
      .range(from, to);

    const countQuery = (supabase as any)
      .from("conselho_tutelar_acionamentos")
      .select("id", { count: "exact", head: true });

    if (filters.student.trim()) {
      query.ilike("student_full_name", `%${filters.student.trim()}%`);
      countQuery.ilike("student_full_name", `%${filters.student.trim()}%`);
    }
    if (filters.date) {
      query.gte("created_at", `${filters.date}T00:00:00`).lte("created_at", `${filters.date}T23:59:59`);
      countQuery.gte("created_at", `${filters.date}T00:00:00`).lte("created_at", `${filters.date}T23:59:59`);
    }
    if (filters.reason !== "todos") {
      query.contains("reasons", [filters.reason]);
      countQuery.contains("reasons", [filters.reason]);
    }

    const [{ data, error }, { count }] = await Promise.all([query, countQuery]);
    if (error) {
      toast.error("Não foi possível carregar o histórico.");
      return;
    }
    setRecords(data || []);
    setTotalRecords(count || 0);

    const ids = (data || []).map((record: ReferralRecord) => record.id);
    if (ids.length === 0) {
      setAuditRecords([]);
      return;
    }

    const { data: auditData, error: auditError } = await (supabase as any)
      .from("conselho_tutelar_auditoria")
      .select("id,acionamento_id,actor_name,action,previous_status,new_status,reasons,created_at")
      .in("acionamento_id", ids)
      .order("created_at", { ascending: false });

    if (!auditError) setAuditRecords(auditData || []);
  };

  useEffect(() => {
    if (isAdmin && userId) fetchRecords();
  }, [isAdmin, userId, page]);

  const registeredAt = useMemo(() => new Date().toLocaleString("pt-BR"), []);
  const totalPages = Math.max(1, Math.ceil(totalRecords / 10));

  const updateField = (field: keyof FormState, value: string | string[]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const toggleReason = (reason: string, checked: boolean) => {
    const nextReasons = checked ? [...form.reasons, reason] : form.reasons.filter((item) => item !== reason);
    updateField("reasons", nextReasons);
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (form.student_full_name.trim().length < 3) nextErrors.student_full_name = "Informe o nome completo do aluno.";
    if (!form.class_or_grade.trim()) nextErrors.class_or_grade = "Informe a turma ou série.";
    if (!form.student_birth_date) nextErrors.student_birth_date = "Informe a data de nascimento.";
    if (form.guardian_name.trim().length < 3) nextErrors.guardian_name = "Informe o nome do responsável.";
    if (form.guardian_contact.trim().length < 5) nextErrors.guardian_contact = "Informe telefone ou e-mail do responsável.";
    if (!form.escola_id) nextErrors.escola_id = "Selecione uma escola vinculada.";
    if (form.reasons.length === 0) nextErrors.reasons = "Selecione ao menos um motivo.";
    if (form.reasons.includes("Outro") && form.other_reason.trim().length < 3) nextErrors.other_reason = "Descreva o outro motivo.";
    if (form.detailed_description.trim().length < 50) nextErrors.detailed_description = "A descrição deve ter no mínimo 50 caracteres.";
    if (!form.family_contact_attempt) nextErrors.family_contact_attempt = "Selecione uma opção.";
    if (form.absences_count && Number(form.absences_count) < 0) nextErrors.absences_count = "Use um número válido.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate() || !userId) return;

    setSubmitting(true);
    const payload = {
      escola_id: form.escola_id,
      registered_by: userId,
      student_full_name: form.student_full_name.trim(),
      class_or_grade: form.class_or_grade.trim(),
      student_birth_date: form.student_birth_date,
      guardian_name: form.guardian_name.trim(),
      guardian_contact: form.guardian_contact.trim(),
      reasons: form.reasons,
      other_reason: form.reasons.includes("Outro") ? form.other_reason.trim() : null,
      detailed_description: form.detailed_description.trim(),
      absences_count: form.absences_count ? Number(form.absences_count) : null,
      last_occurrence_date: form.last_occurrence_date || null,
      family_contact_attempt: form.family_contact_attempt,
      registrant_name: registrantName,
    };

    const { data, error } = await (supabase as any)
      .from("conselho_tutelar_acionamentos")
      .insert(payload)
      .select("protocolo")
      .single();

    setSubmitting(false);

    if (error) {
      toast.error("Não foi possível salvar o registro. Verifique os dados e seu perfil de acesso.");
      return;
    }

    toast.success("Registro salvo com sucesso.", {
      description: `Protocolo ${data.protocolo}. Entre em contato com o Conselho Tutelar pelo número 156 ou pelo site oficial do município.`,
    });
    setForm({ ...initialForm, escola_id: schools[0]?.id || "", class_or_grade: !isAdmin && schools[0]?.className ? schools[0].className : "" });
    if (isAdmin) fetchRecords();
  };

  const updateRecordStatus = async (recordId: string, status: string) => {
    const { error } = await (supabase as any)
      .from("conselho_tutelar_acionamentos")
      .update({ status })
      .eq("id", recordId);

    if (error) {
      toast.error("Não foi possível atualizar o status.");
      return;
    }

    toast.success("Status atualizado e registrado na auditoria.");
    fetchRecords();
  };

  const getStatusLabel = (status: string | null) => statusOptions.find((option) => option.value === status)?.label || "—";

  const applyFilters = () => {
    setPage(1);
    if (page === 1) fetchRecords();
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground">Carregando área segura...</p>;
  }

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <div className="flex items-center gap-2 text-status-attention mb-2">
          <ShieldAlert className="w-5 h-5" />
          <span className="text-sm font-semibold">Área sigilosa</span>
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Conselho Tutelar</h1>
        <p className="text-sm text-muted-foreground">Registro de acionamentos para proteção e acompanhamento do aluno.</p>
      </div>

      <div className="rounded-xl border border-status-attention/40 bg-accent p-4 text-sm text-foreground flex gap-3">
        <AlertTriangle className="w-5 h-5 text-status-attention shrink-0 mt-0.5" />
        <p>As informações registradas aqui são sigilosas e destinadas exclusivamente ao Conselho Tutelar. O uso indevido é de responsabilidade do registrante.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-5 md:p-6 border border-border shadow-card space-y-5" noValidate>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Nome completo do aluno" error={errors.student_full_name}>
            <Input value={form.student_full_name} onChange={(e) => updateField("student_full_name", e.target.value)} aria-invalid={!!errors.student_full_name} />
          </Field>
          <Field label="Turma/Série" error={errors.class_or_grade}>
            <Input value={form.class_or_grade} onChange={(e) => updateField("class_or_grade", e.target.value)} aria-invalid={!!errors.class_or_grade} />
          </Field>
          <Field label="Data de nascimento do aluno" error={errors.student_birth_date}>
            <Input type="date" value={form.student_birth_date} onChange={(e) => updateField("student_birth_date", e.target.value)} aria-invalid={!!errors.student_birth_date} />
          </Field>
          <Field label="Escola vinculada" error={errors.escola_id}>
            <Select value={form.escola_id} onValueChange={(value) => updateField("escola_id", value)}>
              <SelectTrigger aria-label="Selecionar escola vinculada"><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>{schools.map((school) => <SelectItem key={school.id} value={school.id}>{school.name}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Nome do responsável" error={errors.guardian_name}>
            <Input value={form.guardian_name} onChange={(e) => updateField("guardian_name", e.target.value)} aria-invalid={!!errors.guardian_name} />
          </Field>
          <Field label="Contato do responsável" error={errors.guardian_contact}>
            <Input value={form.guardian_contact} onChange={(e) => updateField("guardian_contact", e.target.value)} aria-invalid={!!errors.guardian_contact} />
          </Field>
        </div>

        <Field label="Motivo do acionamento" error={errors.reasons}>
          <div className="grid sm:grid-cols-2 gap-3">
            {reasonOptions.map((reason) => (
              <label key={reason} className="flex items-start gap-2 rounded-lg border border-border bg-background p-3 text-sm text-foreground">
                <Checkbox checked={form.reasons.includes(reason)} onCheckedChange={(checked) => toggleReason(reason, checked === true)} aria-label={reason} />
                <span>{reason}</span>
              </label>
            ))}
          </div>
        </Field>

        {form.reasons.includes("Outro") && (
          <Field label="Outro motivo" error={errors.other_reason}>
            <Input value={form.other_reason} onChange={(e) => updateField("other_reason", e.target.value)} aria-invalid={!!errors.other_reason} />
          </Field>
        )}

        <Field label="Descrição detalhada da situação" error={errors.detailed_description}>
          <Textarea className="min-h-36" value={form.detailed_description} onChange={(e) => updateField("detailed_description", e.target.value)} aria-invalid={!!errors.detailed_description} />
        </Field>

        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Número de faltas (se aplicável)" error={errors.absences_count}>
            <Input type="number" min="0" value={form.absences_count} onChange={(e) => updateField("absences_count", e.target.value)} aria-invalid={!!errors.absences_count} />
          </Field>
          <Field label="Data da última ocorrência observada">
            <Input type="date" value={form.last_occurrence_date} onChange={(e) => updateField("last_occurrence_date", e.target.value)} />
          </Field>
          <Field label="Contato com a família" error={errors.family_contact_attempt}>
            <Select value={form.family_contact_attempt} onValueChange={(value) => updateField("family_contact_attempt", value)}>
              <SelectTrigger aria-label="Contato com a família"><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>{contactOptions.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Professor/responsável pelo registro">
            <Input value={registrantName} readOnly aria-readonly="true" />
          </Field>
          <Field label="Data e hora do registro">
            <Input value={registeredAt} readOnly aria-readonly="true" />
          </Field>
        </div>

        <Button type="submit" disabled={submitting}>{submitting ? "Salvando..." : "Salvar acionamento"}</Button>
      </form>

      {isAdmin && (
        <section className="bg-card rounded-2xl p-5 md:p-6 border border-border shadow-card space-y-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-secondary" />
            <h2 className="font-heading font-bold text-foreground">Histórico de acionamentos</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-3">
            <Input placeholder="Filtrar por aluno" value={filters.student} onChange={(e) => setFilters((current) => ({ ...current, student: e.target.value }))} />
            <Input type="date" value={filters.date} onChange={(e) => setFilters((current) => ({ ...current, date: e.target.value }))} />
            <Select value={filters.reason} onValueChange={(value) => setFilters((current) => ({ ...current, reason: value }))}>
              <SelectTrigger aria-label="Filtrar por motivo"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os motivos</SelectItem>
                {reasonOptions.map((reason) => <SelectItem key={reason} value={reason}>{reason}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button type="button" variant="outline" onClick={applyFilters}>Aplicar filtros</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-accent">
                  <th className="text-left p-3 font-medium text-muted-foreground">Protocolo</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Aluno</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Motivo</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Registrante</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Data</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id} className="border-b border-border align-top">
                    <td className="p-3 font-medium text-foreground">{record.protocolo}</td>
                    <td className="p-3 text-foreground">{record.student_full_name}<br /><span className="text-xs text-muted-foreground">{record.class_or_grade}</span></td>
                    <td className="p-3 text-muted-foreground">{record.reasons.join(", ")}</td>
                    <td className="p-3 text-muted-foreground">{record.registrant_name}</td>
                    <td className="p-3 text-muted-foreground">{new Date(record.created_at).toLocaleDateString("pt-BR")}</td>
                    <td className="p-3 min-w-48">
                      <Select value={record.status} onValueChange={(value) => updateRecordStatus(record.id, value)}>
                        <SelectTrigger aria-label={`Atualizar status do protocolo ${record.protocolo}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
                {records.length === 0 && <tr><td colSpan={6} className="p-4 text-center text-muted-foreground">Nenhum registro encontrado.</td></tr>}
              </tbody>
            </table>
          </div>
          {totalRecords > 10 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-border pt-4">
              <p className="text-sm text-muted-foreground">
                Página {page} de {totalPages} · {totalRecords} registros encontrados
              </p>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" disabled={page === 1} onClick={() => setPage(1)} aria-label="Ir para a primeira página">
                  Primeira
                </Button>
                <Button type="button" variant="outline" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} aria-label="Ir para a página anterior">
                  Anterior
                </Button>
                <span className="inline-flex min-w-10 h-10 items-center justify-center rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground" aria-current="page">
                  {page}
                </span>
                <Button type="button" variant="outline" disabled={page === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))} aria-label="Ir para a próxima página">
                  Próxima
                </Button>
                <Button type="button" variant="outline" disabled={page === totalPages} onClick={() => setPage(totalPages)} aria-label="Ir para a última página">
                  Última
                </Button>
              </div>
            </div>
          )}
          <div className="border-t border-border pt-4 space-y-3">
            <h3 className="font-heading font-bold text-foreground">Trilha de auditoria</h3>
            <div className="space-y-2">
              {auditRecords.map((entry) => (
                <div key={entry.id} className="rounded-lg border border-border bg-background p-3 text-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <span className="font-medium text-foreground">{entry.actor_name}</span>
                    <span className="text-xs text-muted-foreground">{new Date(entry.created_at).toLocaleString("pt-BR")}</span>
                  </div>
                  <p className="text-muted-foreground mt-1">
                    {entry.action === "created"
                      ? `Criou o acionamento com status ${getStatusLabel(entry.new_status)}.`
                      : `Atualizou o status de ${getStatusLabel(entry.previous_status)} para ${getStatusLabel(entry.new_status)}.`}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Motivo(s): {entry.reasons.join(", ")}</p>
                </div>
              ))}
              {auditRecords.length === 0 && <p className="text-sm text-muted-foreground">Nenhum evento de auditoria encontrado.</p>}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <Label className="text-foreground">{label}</Label>
    {children}
    {error && <p className="text-sm font-medium text-destructive" role="alert">{error}</p>}
  </div>
);

const CouncilReferral = ({ role }: { role: "teacher" | "admin" }) => {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        setAllowed(localStorage.getItem("entre_nos_staff_role") === (role === "admin" ? "direcao" : "professor"));
        return;
      }

      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", authData.user.id)
        .in("role", [role] as UserRole[])
        .maybeSingle();

      setAllowed(!!data);
    };

    checkAccess();
  }, [role]);

  const Layout = role === "admin" ? DirectionLayout : TeacherLayout;

  if (allowed === null) {
    return <Layout><p className="text-sm text-muted-foreground">Verificando permissões...</p></Layout>;
  }

  if (!allowed) {
    return <Navigate to="/login" replace />;
  }

  return <Layout><ReferralContent role={role} /></Layout>;
};

export default CouncilReferral;
