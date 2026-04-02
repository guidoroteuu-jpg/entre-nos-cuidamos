import { useState } from "react";
import StudentLayout from "@/components/layout/StudentLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

const mockMessages = [
  { id: 1, text: "Alguém mais achou a prova difícil?", time: "14:20", self: false },
  { id: 2, text: "Sim, mas o professor explicou bem na revisão", time: "14:21", self: false },
  { id: 3, text: "Eu gostei da atividade em grupo de hoje!", time: "14:23", self: true },
  { id: 4, text: "Quem quer estudar junto amanhã?", time: "14:25", self: false },
  { id: 5, text: "Tô dentro! Pode ser na biblioteca", time: "14:26", self: false },
];

const StudentChat = () => {
  const [messages, setMessages] = useState(mockMessages);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), text: input, time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }), self: true }]);
    setInput("");
  };

  return (
    <StudentLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="mb-4">
          <h1 className="font-heading text-xl font-bold text-foreground">Chat da Turma</h1>
          <p className="text-xs text-muted-foreground">Todas as mensagens são anônimas 🔒</p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.self ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                msg.self
                  ? "gradient-hero text-primary-foreground rounded-br-md"
                  : "bg-accent text-foreground rounded-bl-md"
              }`}>
                <p className="text-sm">{msg.text}</p>
                <p className={`text-[10px] mt-1 ${msg.self ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escreva anonimamente..."
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
