import { useState } from "react";
import StudentLayout from "@/components/layout/StudentLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Lock } from "lucide-react";
import { motion } from "framer-motion";

const mockMessages = [
  { id: 1, text: "Alguém mais achou a prova difícil?", time: "14:20", self: false, name: "Maria S." },
  { id: 2, text: "Sim, mas o professor explicou bem na revisão", time: "14:21", self: false, name: "João P." },
  { id: 3, text: "Eu gostei da atividade em grupo de hoje!", time: "14:23", self: true, name: "" },
  { id: 4, text: "Quem quer estudar junto amanhã?", time: "14:25", self: false, name: "Ana L." },
  { id: 5, text: "Tô dentro! Pode ser na biblioteca", time: "14:26", self: false, name: "Carlos M." },
];

const getAvatarColor = (name: string) => {
  const colors = ["bg-secondary", "bg-status-good", "bg-status-attention", "bg-purple-glow", "bg-primary"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const getInitials = (name: string) => {
  const parts = name.split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

const StudentChat = () => {
  const [messages, setMessages] = useState(mockMessages);
  const [input, setInput] = useState("");
  const studentName = localStorage.getItem("entre_nos_nome") || "Você";

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, {
      id: Date.now(),
      text: input,
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      self: true,
      name: studentName,
    }]);
    setInput("");
  };

  return (
    <StudentLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="mb-4">
          <h1 className="font-heading text-xl font-bold text-foreground">Chat da Turma</h1>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Lock className="w-3 h-3" /> Mensagens moderadas automaticamente
          </p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              className={`flex ${msg.self ? "justify-end" : "justify-start"}`}
              initial={{ opacity: 0, x: msg.self ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: i < 5 ? i * 0.05 : 0 }}
            >
              <div className={`flex gap-2 max-w-[85%] ${msg.self ? "flex-row-reverse" : "flex-row"}`}>
                {!msg.self && (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground flex-shrink-0 ${getAvatarColor(msg.name)}`}>
                    {getInitials(msg.name)}
                  </div>
                )}
                <div>
                  {!msg.self && (
                    <p className="text-xs text-muted-foreground font-medium mb-0.5 ml-1">{msg.name}</p>
                  )}
                  <div className={`rounded-2xl px-4 py-2.5 ${
                    msg.self
                      ? "gradient-hero text-primary-foreground rounded-br-md"
                      : "bg-accent text-foreground rounded-bl-md"
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.self ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{msg.time}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <form onSubmit={handleSend} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escreva para a turma..."
            className="flex-1 h-11 rounded-full micro-input"
          />
          <motion.div whileHover={{ rotate: 15 }} whileTap={{ scale: 0.9 }}>
            <Button type="submit" variant="hero" size="icon" className="h-11 w-11 rounded-full">
              <Send className="w-4 h-4" />
            </Button>
          </motion.div>
        </form>
      </div>
    </StudentLayout>
  );
};

export default StudentChat;
