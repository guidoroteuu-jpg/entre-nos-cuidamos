import { Link } from "@/lib/router-compat";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft } from "lucide-react";

const sections = [
  {
    title: "O que coletamos",
    content: "Coletamos apenas o essencial: respostas emocionais (emojis), mensagens anônimas do chat e textos do diário privado. Nenhum dado é associado ao nome real do aluno — tudo é vinculado a um ID anônimo gerado pelo sistema.",
  },
  {
    title: "Como protegemos os dados",
    content: "Todos os dados são criptografados em trânsito e em repouso. Mensagens do chat nunca armazenam a identidade do remetente. Dados de humor são agregados antes de serem exibidos aos professores, garantindo que nenhum aluno individual possa ser identificado.",
  },
  {
    title: "Quem tem acesso",
    content: "Professores veem apenas dados agregados da turma e alertas sem identificação. A direção vê dados gerais da escola. Nenhum funcionário do Entre Nós acessa dados individuais de alunos.",
  },
  {
    title: "Dados que nunca vendemos",
    content: "Nenhum dado de aluno é vendido, compartilhado com terceiros ou usado para publicidade. Os dados pertencem à escola e podem ser deletados a qualquer momento.",
  },
  {
    title: "Conformidade com a LGPD",
    content: "O Entre Nós está em total conformidade com a Lei Geral de Proteção de Dados (LGPD). A escola é a controladora dos dados, e o Entre Nós atua como operador, processando dados apenas conforme instruções da escola.",
  },
  {
    title: "Direitos dos alunos e responsáveis",
    content: "Alunos e seus responsáveis podem solicitar acesso, correção ou exclusão de seus dados a qualquer momento. Para exercer seus direitos, entre em contato com a escola ou diretamente conosco.",
  },
];

const Privacy = () => (
  <div className="min-h-screen bg-background">
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <Link to="/">
        <Button variant="ghost" size="sm" className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
        </Button>
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-8 h-8 text-secondary" />
        <h1 className="font-heading text-3xl font-bold text-foreground">Privacidade e Segurança</h1>
      </div>

      <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
        Explicamos em linguagem simples como cuidamos dos dados dos alunos. 
        Privacidade não é um extra — é a base de tudo que fazemos.
      </p>

      <div className="space-y-8">
        {sections.map((s) => (
          <div key={s.title} className="bg-card rounded-xl p-6 border border-border shadow-card">
            <h2 className="font-heading font-bold text-lg text-foreground mb-3">{s.title}</h2>
            <p className="text-muted-foreground leading-relaxed">{s.content}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Privacy;
