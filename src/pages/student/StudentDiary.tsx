import { useState } from "react";
import StudentLayout from "@/components/layout/StudentLayout";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus } from "lucide-react";

const mockEntries = [
  { id: 1, date: "01/04/2026", preview: "Hoje foi um dia bom. Consegui participar da aula e...", mood: "😊" },
  { id: 2, date: "31/03/2026", preview: "Me senti um pouco excluído durante o recreio...", mood: "😢" },
  { id: 3, date: "30/03/2026", preview: "A prova de matemática me deixou nervoso, mas...", mood: "😤" },
];

const StudentDiary = () => {
  const [isWriting, setIsWriting] = useState(false);
  const [text, setText] = useState("");

  const handleSave = () => {
    if (text.trim()) {
      setIsWriting(false);
      setText("");
    }
  };

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-secondary" /> Meu Diário
            </h1>
            <p className="text-xs text-muted-foreground mt-1">Só você pode ler o que escreve aqui 🔒</p>
          </div>
          {!isWriting && (
            <Button variant="hero" size="sm" onClick={() => setIsWriting(true)}>
              <Plus className="w-4 h-4 mr-1" /> Escrever
            </Button>
          )}
        </div>

        {isWriting && (
          <div className="bg-card rounded-2xl p-5 border border-border shadow-card animate-fade-in">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Como você está se sentindo? Escreva livremente..."
              className="w-full min-h-[150px] bg-transparent text-foreground placeholder:text-muted-foreground text-sm leading-relaxed focus:outline-none resize-none"
              autoFocus
            />
            <div className="flex gap-2 justify-end mt-3">
              <Button variant="ghost" size="sm" onClick={() => { setIsWriting(false); setText(""); }}>
                Cancelar
              </Button>
              <Button variant="hero" size="sm" onClick={handleSave}>
                Salvar
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {mockEntries.map((entry) => (
            <div key={entry.id} className="bg-card rounded-xl p-4 border border-border shadow-card hover:shadow-elevated transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">{entry.date}</span>
                <span className="text-lg">{entry.mood}</span>
              </div>
              <p className="text-sm text-foreground">{entry.preview}</p>
            </div>
          ))}
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentDiary;
