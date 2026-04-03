import { useState, useRef, useEffect } from "react";
import StudentLayout from "@/components/layout/StudentLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Trash2, Lock } from "lucide-react";
import { motion } from "framer-motion";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  time: string;
}

const welcomeMessage: Message = {
  id: 0,
  role: "assistant",
  content: "Oi! Eu sou a Lis, sua assistente de bem-estar. Estou aqui para te ouvir sem julgamento. Como você está se sentindo hoje?",
  time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
};

const riskWords = [
  "sozinho", "excluído", "ninguém gosta", "odeio a escola",
  "não quero ir", "me batem", "me xingam", "quero sumir",
  "ninguém me vê", "invisível", "bullying", "desaparecer", "me machucar",
];
const severeRiskWords = ["quero sumir", "desaparecer", "me machucar"];

const StudentChatIA = () => {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const analyzeRisk = (text: string) => {
    const lower = text.toLowerCase();
    const hasSevere = severeRiskWords.some((w) => lower.includes(w));
    const hasRisk = riskWords.some((w) => lower.includes(w));
    if (hasSevere) console.log("[Entre Nós] Alerta de risco ALTO detectado silenciosamente");
    else if (hasRisk) console.log("[Entre Nós] Alerta de risco MÉDIO detectado silenciosamente");
  };

  const getAIResponse = (userMessage: string): string => {
    const lower = userMessage.toLowerCase();
    if (severeRiskWords.some((w) => lower.includes(w)))
      return "Eu entendo que você está passando por um momento muito difícil. Seus sentimentos são válidos e importantes.\n\nSe você está pensando em se machucar, por favor ligue para o CVV: 188 (24h, gratuito). Também é muito importante conversar com um adulto de confiança — pode ser um professor, familiar ou orientador.\n\nEstou aqui para te ouvir. Quer me contar mais sobre o que está sentindo?";
    if (lower.includes("sozinho") || lower.includes("excluído") || lower.includes("invisível"))
      return "Sentir-se assim é muito difícil, e eu agradeço por compartilhar comigo. Muitas pessoas passam por isso e não é culpa sua.\n\nÀs vezes, dar pequenos passos pode ajudar — como cumprimentar alguém no corredor ou pedir para participar de um grupo. O que você acha?\n\nVocê já tentou conversar com alguém sobre como se sente?";
    if (lower.includes("bullying") || lower.includes("me xingam") || lower.includes("me batem"))
      return "Ninguém merece ser tratado assim. O que você está descrevendo é sério e precisa de atenção.\n\nContar para um adulto de confiança — como um professor ou orientador — é um passo corajoso e importante. Eles podem ajudar a resolver a situação.\n\nQuer me contar mais detalhes sobre o que está acontecendo?";
    if (lower.includes("triste") || lower.includes("mal") || lower.includes("chorar"))
      return "Tá tudo bem sentir tristeza — faz parte de ser humano. Obrigada por confiar em mim para falar sobre isso.\n\nO que te ajuda a se sentir melhor normalmente? Às vezes ouvir uma música, desenhar ou conversar com alguém pode aliviar.\n\nEstou aqui se quiser continuar conversando.";
    return "Obrigada por compartilhar! Seus sentimentos são importantes e válidos.\n\nQuer me contar mais sobre como foi seu dia? Estou aqui para te ouvir sem julgamento.";
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const userMsg: Message = {
      id: Date.now(), role: "user", content: input,
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    analyzeRisk(input);
    setInput("");
    setIsLoading(true);
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1, role: "assistant", content: getAIResponse(userMsg.content),
        time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1200);
  };

  const handleClear = () => setMessages([welcomeMessage]);

  return (
    <StudentLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">LS</span>
            </div>
            <div>
              <h1 className="font-heading text-lg font-bold text-foreground">Conversa com a Lis</h1>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" /> Privado — só você vê isso
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClear} className="text-muted-foreground micro-btn">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 mb-4">
          {messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className={`flex gap-2 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full gradient-hero flex items-center justify-center flex-shrink-0">
                    <span className="text-[9px] font-bold text-primary-foreground">LS</span>
                  </div>
                )}
                <div className={`rounded-2xl px-4 py-2.5 ${
                  msg.role === "user"
                    ? "bg-secondary text-secondary-foreground rounded-br-md"
                    : "bg-accent text-foreground rounded-bl-md"
                }`}>
                  <p className="text-sm whitespace-pre-line">{msg.content}</p>
                  <p className={`text-[10px] mt-1 ${msg.role === "user" ? "text-secondary-foreground/60" : "text-muted-foreground"}`}>{msg.time}</p>
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full gradient-hero flex items-center justify-center flex-shrink-0">
                  <span className="text-[9px] font-bold text-primary-foreground">LS</span>
                </div>
                <div className="bg-accent rounded-2xl px-4 py-3 rounded-bl-md">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-muted-foreground/40 rounded-full typing-dot" />
                    <div className="w-2 h-2 bg-muted-foreground/40 rounded-full typing-dot" />
                    <div className="w-2 h-2 bg-muted-foreground/40 rounded-full typing-dot" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Fale com a Lis..."
            className="flex-1 h-11 rounded-full micro-input"
            disabled={isLoading}
          />
          <motion.div whileHover={{ rotate: 15 }} whileTap={{ scale: 0.9 }}>
            <Button type="submit" variant="hero" size="icon" className="h-11 w-11 rounded-full" disabled={isLoading}>
              <Send className="w-4 h-4" />
            </Button>
          </motion.div>
        </form>
      </div>
    </StudentLayout>
  );
};

export default StudentChatIA;
