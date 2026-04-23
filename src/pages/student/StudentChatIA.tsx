import { useState, useRef, useEffect } from "react";
import StudentLayout from "@/components/layout/StudentLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Trash2, Lock, Wind } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import CalmExercise from "@/components/CalmExercise";

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

/* Palavras-chave de risco — monitoramento silencioso */
const riskWords = [
  "sozinho", "excluído", "ninguém gosta", "odeio a escola",
  "não quero ir", "me batem", "me xingam", "quero sumir",
  "ninguém me vê", "invisível", "bullying", "desaparecer", "me machucar",
];
const severeRiskWords = ["quero sumir", "desaparecer", "me machucar"];

/* URL da edge function */
const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-lis`;

const StudentChatIA = () => {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCalm, setShowCalm] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  /* Análise de risco silenciosa */
  const analyzeRisk = (text: string) => {
    const lower = text.toLowerCase();
    const hasSevere = severeRiskWords.some((w) => lower.includes(w));
    const hasRisk = riskWords.some((w) => lower.includes(w));
    if (hasSevere) console.log("[Entre Nós] Alerta de risco ALTO detectado silenciosamente");
    else if (hasRisk) console.log("[Entre Nós] Alerta de risco MÉDIO detectado silenciosamente");
  };

  /* Enviar mensagem com streaming real */
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const now = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = { id: Date.now(), role: "user", content: input, time: now };

    setMessages((prev) => [...prev, userMsg]);
    analyzeRisk(input);
    setInput("");
    setIsLoading(true);

    /* Montar histórico para a IA (excluindo a mensagem de boas-vindas) */
    const history = [...messages.filter((m) => m.id !== 0), userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: history }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || `Erro ${resp.status}`);
      }

      if (!resp.body) throw new Error("Sem resposta do servidor");

      /* Streaming token por token */
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let assistantContent = "";
      const assistantId = Date.now() + 1;

      /* Criar a mensagem da assistente vazia */
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "", time: now },
      ]);

      let streamDone = false;
      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              const finalContent = assistantContent;
              setMessages((prev) =>
                prev.map((m) => (m.id === assistantId ? { ...m, content: finalContent } : m))
              );
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      /* Flush do buffer restante */
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              const finalContent = assistantContent;
              setMessages((prev) =>
                prev.map((m) => (m.id === assistantId ? { ...m, content: finalContent } : m))
              );
            }
          } catch { /* ignorar */ }
        }
      }
    } catch (err: any) {
      console.error("Erro no chat:", err);
      toast.error(err.message || "Erro ao enviar mensagem. Tente novamente.");
      /* Remover mensagem vazia da assistente em caso de erro */
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && !last.content) return prev.slice(0, -1);
        return prev;
      });
    } finally {
      setIsLoading(false);
    }
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
          {messages.map((msg) => (
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
          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
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

        <button
          type="button"
          onClick={() => setShowCalm(true)}
          className="mb-2 self-start inline-flex items-center gap-1.5 text-xs text-secondary hover:text-secondary/80 bg-accent/40 hover:bg-accent border border-border rounded-full px-3 py-1.5 transition-colors"
        >
          <Wind className="w-3.5 h-3.5" />
          Fazer um exercício de calma
        </button>

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

      <CalmExercise open={showCalm} onClose={() => setShowCalm(false)} />
    </StudentLayout>
  );
};

export default StudentChatIA;
