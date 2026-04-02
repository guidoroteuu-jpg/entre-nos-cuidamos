import { useState } from "react";
import StudentLayout from "@/components/layout/StudentLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Lock } from "lucide-react";

/* Mensagens com nome do aluno (sem anonimato) */
const mockMessages = [
  { id: 1, text: "Alguém mais achou a prova difícil?", time: "14:20", self: false, name: "Maria S." },
  { id: 2, text: "Sim, mas o professor explicou bem na revisão", time: "14:21", self: false, name: "João P." },
  { id: 3, text: "Eu gostei da atividade em grupo de hoje!", time: "14:23", self: true, name: "" },
  { id: 4, text: "Quem quer estudar junto amanhã?", time: "14:25", self: false, name: "Ana L." },
  { id: 5, text: "Tô dentro! Pode ser na biblioteca", time: "14:26", self: false, name: "Carlos M." },
];

/* Gera cor de avatar com base no nome */
const getAvatarColor = (name: string) => {
  const colors = [
    "bg-secondary", "bg-status-good", "bg-status-attention",
    "bg-purple-glow", "bg-primary",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

/* Iniciais do nome */
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
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.self ? "justify-end" : "justify-start"}`}>
              <div className={`flex gap-2 max-w-[85%] ${msg.self ? "flex-row-reverse" : "flex-row"}`}>
                {/* Avatar */}
                {!msg.self && (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-primary-foreground flex-shrink-0 ${getAvatarColor(msg.name)}`}>
                    {getInitials(msg.name)}
                  </div>
                )}
                <div>
                  {/* Nome */}
                  {!msg.self && (
                    <p className="text-[10px] text-muted-foreground font-medium mb-0.5 ml-1">{msg.name}</p>
                  )}
                  <div className={`rounded-2xl px-4 py-2.5 ${
                    msg.self
                      ? "gradient-hero text-primary-foreground rounded-br-md"
                      : "bg-accent text-foreground rounded-bl-md"
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-[10px] mt-1 ${msg.self ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{msg.time}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escreva para a turma..."
            className="flex-1 h-11 rounded-full"
          />
          <Button type="submit" variant="hero" size="icon" className="h-11 w-11 rounded-full">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </StudentLayout>
  );
};

export default StudentChat;
