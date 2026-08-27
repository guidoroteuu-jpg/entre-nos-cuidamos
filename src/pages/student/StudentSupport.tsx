import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Brain, Users, Play, BookOpen, Wind, ChevronRight, X } from "lucide-react";
import StudentLayout from "@/components/layout/StudentLayout";
import CalmExercise from "@/components/CalmExercise";
import { PageHeader, PageShell } from "@/components/ui/kit";

type Categoria = "ansiedade" | "autoestima" | "amizade";

interface Conteudo {
  id: string;
  tipo: "video" | "texto" | "exercicio";
  categoria: Categoria;
  titulo: string;
  resumo: string;
  duracao: string;
  corpo?: string;
}

const CATEGORIAS: { id: Categoria; label: string; icon: typeof Heart; cor: string }[] = [
  { id: "ansiedade", label: "Ansiedade", icon: Brain, cor: "from-secondary/20 to-secondary/5" },
  { id: "autoestima", label: "Autoestima", icon: Heart, cor: "from-primary/20 to-primary/5" },
  { id: "amizade", label: "Amizade", icon: Users, cor: "from-accent to-accent/40" },
];

const CONTEUDOS: Conteudo[] = [
  // Ansiedade
  {
    id: "a1",
    tipo: "exercicio",
    categoria: "ansiedade",
    titulo: "Respiração 4-7-8",
    resumo: "1 minuto pra acalmar antes de uma prova ou apresentação.",
    duracao: "1 min",
  },
  {
    id: "a2",
    tipo: "texto",
    categoria: "ansiedade",
    titulo: "O que é ansiedade?",
    resumo: "Entenda o que seu corpo sente e por que isso acontece.",
    duracao: "3 min de leitura",
    corpo:
      "Ansiedade é o jeito do seu corpo dizer: 'algo importante tá vindo, fica atento'. Coração acelera, mãos suam, pensamento corre. Isso é normal — todo mundo sente. O problema não é sentir, é quando ela aparece o tempo todo, mesmo sem motivo claro.\n\nUm jeito simples de lidar: dá nome pro que você tá sentindo. 'Eu tô ansioso pela prova de amanhã' já ajuda o cérebro a entender e organizar. Outro jeito: respira devagar, conta até 4 ao puxar o ar, segura por 7, solta em 8. Faz isso 3 vezes. O corpo desacelera junto.\n\nSe a ansiedade tá atrapalhando dormir, comer ou ir pra escola, fala com alguém. Procurar ajuda não é fraqueza — é coragem.",
  },
  {
    id: "a3",
    tipo: "video",
    categoria: "ansiedade",
    titulo: "Grounding 5-4-3-2-1",
    resumo: "Volte ao agora usando seus 5 sentidos.",
    duracao: "2 min",
  },
  // Autoestima
  {
    id: "e1",
    tipo: "texto",
    categoria: "autoestima",
    titulo: "Seu valor não vem de likes",
    resumo: "Por que comparar a sua vida com a dos outros nas redes te machuca.",
    duracao: "4 min de leitura",
    corpo:
      "A internet mostra a vida em recortes. Aquela foto perfeita levou 30 tentativas. Aquele corpo levou edição. Aquela viagem incrível teve briga, chuva, tédio — que ninguém posta.\n\nQuando você compara o seu 'bastidor' com o 'palco' dos outros, sempre vai parecer que você tá perdendo. Mas não tá. Cada pessoa tem coisas boas e ruins, e o que você não vê não significa que não exista.\n\nUm exercício: por uma semana, no fim do dia, escreve 1 coisa que VOCÊ fez bem. Pode ser pequena: 'fui paciente com minha irmã', 'estudei 20 min', 'ajudei alguém'. Em 7 dias você vai ter uma lista que ninguém te tira.",
  },
  {
    id: "e2",
    tipo: "exercicio",
    categoria: "autoestima",
    titulo: "3 coisas boas sobre você",
    resumo: "Anote agora. Pode ser pequeno. O importante é começar.",
    duracao: "2 min",
    corpo:
      "Pega seu diário (ou anota mentalmente):\n\n1. Uma qualidade sua que um amigo elogiaria.\n2. Algo que você fez essa semana que te deixou orgulhoso(a).\n3. Algo do seu corpo ou jeito que você gosta.\n\nNão precisa ser grandioso. 'Sei ouvir', 'terminei meu trabalho', 'meu sorriso' já valem. Repete isso 1x por semana. É treino — autoestima também se constrói.",
  },
  {
    id: "e3",
    tipo: "video",
    categoria: "autoestima",
    titulo: "Falando bonito com você mesmo",
    resumo: "Você falaria com seu melhor amigo do jeito que fala consigo?",
    duracao: "3 min",
  },
  // Amizade
  {
    id: "m1",
    tipo: "texto",
    categoria: "amizade",
    titulo: "Quando alguém se afasta",
    resumo: "Nem toda amizade dura pra sempre — e tudo bem.",
    duracao: "3 min de leitura",
    corpo:
      "Amizades mudam. Pessoas crescem em ritmos diferentes, descobrem coisas novas, vão pra outras escolas. Quando alguém que era próximo se afasta, dói. É uma perda de verdade.\n\nMas a culpa nem sempre é sua. Às vezes o outro tá passando por algo que você não sabe. Às vezes vocês simplesmente já não combinam mais. Isso não apaga o que vocês viveram.\n\nDá pra se permitir sentir saudade sem grudar. Dá pra ficar aberto a novas amizades sem trair as antigas. E lembra: você é uma boa companhia. Quem souber, fica.",
  },
  {
    id: "m2",
    tipo: "exercicio",
    categoria: "amizade",
    titulo: "Como puxar conversa",
    resumo: "3 perguntas que sempre funcionam pra começar.",
    duracao: "2 min",
    corpo:
      "Não precisa ser engraçado nem genial. Pessoas gostam de falar sobre elas. Tenta:\n\n1. 'O que você tá vendo/ouvindo ultimamente?' (série, música, jogo)\n2. 'Como foi seu fim de semana?'\n3. 'Você curtiu a aula de [matéria] hoje?'\n\nEscuta a resposta com atenção e faz uma pergunta de volta sobre o que a pessoa disse. Pronto, virou conversa. Funciona com colegas novos, com gente da turma que você nunca falou, com quase todo mundo.",
  },
  {
    id: "m3",
    tipo: "video",
    categoria: "amizade",
    titulo: "Diferença entre brincadeira e bullying",
    resumo: "Se só uma pessoa ri, não é piada — é maldade.",
    duracao: "4 min",
  },
];

const tipoIcon = { video: Play, texto: BookOpen, exercicio: Wind };

const StudentSupport = () => {
  const [filtro, setFiltro] = useState<Categoria | "todos">("todos");
  const [aberto, setAberto] = useState<Conteudo | null>(null);
  const [showCalm, setShowCalm] = useState(false);

  const lista = filtro === "todos" ? CONTEUDOS : CONTEUDOS.filter((c) => c.categoria === filtro);

  const abrir = (c: Conteudo) => {
    if (c.tipo === "exercicio" && (c.id === "a1" || c.id === "a3")) {
      setShowCalm(true);
      return;
    }
    setAberto(c);
  };

  return (
    <StudentLayout>
      <PageShell>
        <PageHeader
          eyebrow="Conteúdo"
          title="Cantinho de apoio"
          description="Conteúdo curado pra te ajudar com o que tá pesando."
        />

        {/* Categorias destaque */}
        <div className="grid grid-cols-3 gap-3">
          {CATEGORIAS.map((c, i) => {
            const ativo = filtro === c.id;
            return (
              <motion.button
                key={c.id}
                onClick={() => setFiltro(ativo ? "todos" : c.id)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className={`surface-card p-4 transition-all micro-card ${
                  ativo ? "ring-2 ring-secondary/40" : ""
                }`}
              >
                <c.icon className="w-5 h-5 text-secondary mx-auto" />
                <p className="text-xs font-medium text-foreground mt-2">{c.label}</p>
              </motion.button>
            );
          })}
        </div>

        {filtro !== "todos" && (
          <button
            onClick={() => setFiltro("todos")}
            className="text-xs text-muted-foreground hover:text-secondary transition-colors"
          >
            ← Ver tudo
          </button>
        )}

        {/* Lista */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {lista.map((c, i) => {
              const Icon = tipoIcon[c.tipo];
              return (
                <motion.button
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: 0.04 * i }}
                  onClick={() => abrir(c)}
                  className="w-full bg-card hover:bg-accent/30 rounded-2xl p-4 border border-border shadow-card transition-all flex items-center gap-3 text-left micro-card"
                >
                  <div className="w-11 h-11 rounded-xl bg-accent/60 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
                        {c.tipo === "video" ? "Vídeo" : c.tipo === "texto" ? "Texto" : "Exercício"}
                      </span>
                      <span className="text-xs text-muted-foreground">• {c.duracao}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground leading-tight">{c.titulo}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{c.resumo}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </PageShell>

      {/* Modal de leitura */}
      <AnimatePresence>
        {aberto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/50 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setAberto(null)}
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl p-6 w-full max-w-md border border-border shadow-elevated max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-4 gap-3">
                <div>
                  <span className="text-xs uppercase tracking-wider text-secondary font-bold">
                    {aberto.tipo === "video" ? "Vídeo" : aberto.tipo === "texto" ? "Texto" : "Exercício"} • {aberto.duracao}
                  </span>
                  <h2 className="font-heading font-bold text-foreground mt-1">{aberto.titulo}</h2>
                </div>
                <button
                  onClick={() => setAberto(null)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {aberto.tipo === "video" && (
                <div className="aspect-video rounded-xl bg-muted/40 flex items-center justify-center mb-4 border border-border">
                  <div className="text-center text-muted-foreground">
                    <Play className="w-10 h-10 mx-auto mb-2 text-secondary" />
                    <p className="text-xs">Vídeo curado em breve</p>
                  </div>
                </div>
              )}

              {aberto.corpo ? (
                <div className="prose prose-sm max-w-none">
                  {aberto.corpo.split("\n\n").map((p, i) => (
                    <p key={i} className="text-sm text-foreground leading-relaxed mb-3">
                      {p}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">{aberto.resumo}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CalmExercise open={showCalm} onClose={() => setShowCalm(false)} />
    </StudentLayout>
  );
};

export default StudentSupport;
