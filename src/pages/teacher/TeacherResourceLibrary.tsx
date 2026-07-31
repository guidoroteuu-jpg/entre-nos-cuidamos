import { FormEvent, useMemo, useState } from "react";
import { BookOpen, Bot, Clapperboard, FileText, Loader2, Sparkles, Users } from "lucide-react";
import { toast } from "sonner";
import TeacherLayout from "@/components/layout/TeacherLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

const situations = ["bullying", "ansiedade", "exclusão", "conflito"] as const;

const resources = [
  { situation: "bullying", type: "Dinâmica", title: "Mapa da empatia", description: "Atividade guiada para trabalhar impacto das palavras e atitudes no grupo.", icon: Users },
  { situation: "bullying", type: "Guia", title: "Intervenção segura", description: "Passos para acolher relatos sem expor estudantes ou incentivar confrontos.", icon: FileText },
  { situation: "ansiedade", type: "Vídeo", title: "Respiração em sala", description: "Roteiro curto para orientar pausa coletiva de respiração e foco.", icon: Clapperboard },
  { situation: "ansiedade", type: "Material", title: "Semáforo emocional", description: "Ficha para alunos reconhecerem sinais corporais e pedirem ajuda com discrição.", icon: BookOpen },
  { situation: "exclusão", type: "Dinâmica", title: "Duplas rotativas", description: "Estratégia para variar interações e reduzir isolamento em atividades coletivas.", icon: Users },
  { situation: "exclusão", type: "Guia", title: "Observação de vínculos", description: "Checklist de sinais de isolamento sem identificação pública do aluno.", icon: FileText },
  { situation: "conflito", type: "Dinâmica", title: "Acordo de convivência", description: "Construção coletiva de combinados após conflitos recorrentes.", icon: Users },
  { situation: "conflito", type: "Vídeo", title: "Comunicação não violenta", description: "Material de apoio para mediar conversas com escuta e responsabilização.", icon: Clapperboard },
];

const TeacherResourceLibrary = () => {
  const [selectedSituation, setSelectedSituation] = useState<(typeof situations)[number]>("bullying");
  const [grade, setGrade] = useState("5º ano");
  const [objective, setObjective] = useState("");
  const [generated, setGenerated] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredResources = useMemo(() => resources.filter((item) => item.situation === selectedSituation), [selectedSituation]);

  const handleGenerate = async (event: FormEvent) => {
    event.preventDefault();
    if (objective.trim().length < 8 || grade.trim().length < 2) {
      toast.error("Informe turma e objetivo da dinâmica.");
      return;
    }

    setLoading(true);
    setGenerated("");
    const { data, error } = await supabase.functions.invoke("generate-dynamics", {
      body: { situation: selectedSituation, grade: grade.trim(), objective: objective.trim() },
    });
    setLoading(false);

    if (error || !data?.content) {
      toast.error(data?.error || "Não foi possível gerar a dinâmica.");
      return;
    }

    setGenerated(data.content);
    toast.success("Dinâmica gerada com apoio da IA.");
  };

  return (
    <TeacherLayout>
      <div className="max-w-6xl space-y-6">
        <div>
          <div className="flex items-center gap-2 text-secondary mb-2">
            <BookOpen className="w-5 h-5" />
            <span className="text-sm font-semibold">Apoio pedagógico</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Biblioteca de recursos</h1>
          <p className="text-sm text-muted-foreground">Dinâmicas, vídeos, materiais e guias organizados por situação.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {situations.map((situation) => (
            <Button key={situation} variant={selectedSituation === situation ? "default" : "outline"} size="sm" onClick={() => setSelectedSituation(situation)} className="capitalize">
              {situation}
            </Button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {filteredResources.map((resource) => {
            const Icon = resource.icon;
            return (
              <article key={resource.title} className="surface-card p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-secondary" />
                    <h2 className="font-heading font-bold text-foreground">{resource.title}</h2>
                  </div>
                  <Badge variant="outline">{resource.type}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{resource.description}</p>
              </article>
            );
          })}
        </div>

        <section className="bg-card rounded-2xl p-5 md:p-6 border border-border shadow-card space-y-5">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-secondary" />
            <h2 className="font-heading font-bold text-foreground">IA para criação de dinâmicas</h2>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <Field label="Situação">
                <Select value={selectedSituation} onValueChange={(value) => setSelectedSituation(value as typeof selectedSituation)}>
                  <SelectTrigger aria-label="Situação"><SelectValue /></SelectTrigger>
                  <SelectContent>{situations.map((situation) => <SelectItem key={situation} value={situation} className="capitalize">{situation}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Turma ou faixa etária">
                <Input value={grade} onChange={(event) => setGrade(event.target.value)} />
              </Field>
              <Field label="Objetivo da dinâmica">
                <Input value={objective} onChange={(event) => setObjective(event.target.value)} placeholder="Ex.: fortalecer empatia" />
              </Field>
            </div>
            <Button type="submit" disabled={loading}>{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} Gerar dinâmica</Button>
          </form>

          {generated && (
            <div className="rounded-xl border border-border bg-accent p-4">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">{generated}</pre>
            </div>
          )}
        </section>
      </div>
    </TeacherLayout>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium text-foreground">{label}</Label>
    {children}
  </div>
);

export default TeacherResourceLibrary;