import { useState } from "react";
import StudentLayout from "@/components/layout/StudentLayout";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Trash2, ChevronDown, ChevronUp, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const moodOptions = [
  { emoji: "😊", label: "Ótimo", value: "otimo" },
  { emoji: "😐", label: "Neutro", value: "neutro" },
  { emoji: "😢", label: "Triste", value: "triste" },
  { emoji: "😤", label: "Frustrado", value: "frustrado" },
  { emoji: "😔", label: "Excluído", value: "excluido" },
  { emoji: "😞", label: "Muito triste", value: "muito_triste" },
];

interface DiaryEntry {
  id: number; date: string; content: string; mood: string; preview: string;
}

const mockEntries: DiaryEntry[] = [
  { id: 1, date: "01/04/2026", content: "Hoje foi um dia bom. Consegui participar da aula e me senti mais confiante. A professora elogiou minha apresentação.", mood: "otimo", preview: "Hoje foi um dia bom. Consegui participar da aula e..." },
  { id: 2, date: "31/03/2026", content: "Me senti um pouco excluído durante o recreio. Ninguém me chamou para jogar e fiquei sozinho no canto. Não sei o que fazer.", mood: "excluido", preview: "Me senti um pouco excluído durante o recreio..." },
  { id: 3, date: "30/03/2026", content: "A prova de matemática me deixou nervoso, mas acho que fui bem. Preciso estudar mais para a próxima.", mood: "frustrado", preview: "A prova de matemática me deixou nervoso, mas..." },
];

const today = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

const StudentDiary = () => {
  const [isWriting, setIsWriting] = useState(false);
  const [text, setText] = useState("");
  const [entries, setEntries] = useState<DiaryEntry[]>(mockEntries);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [savedText, setSavedText] = useState("");

  const handleSave = () => {
    if (text.trim()) { setSavedText(text); setShowMoodPicker(true); }
  };

  const handleMoodSelect = (mood: string) => {
    const newEntry: DiaryEntry = {
      id: Date.now(), date: new Date().toLocaleDateString("pt-BR"), content: savedText,
      mood, preview: savedText.slice(0, 50) + (savedText.length > 50 ? "..." : ""),
    };
    setEntries([newEntry, ...entries]);
    setIsWriting(false); setShowMoodPicker(false); setText(""); setSavedText("");
  };

  const handleDelete = (id: number) => setEntries(entries.filter((e) => e.id !== id));
  const getMoodEmoji = (mood: string) => moodOptions.find((m) => m.value === mood)?.emoji || "😐";

  return (
    <StudentLayout>
      <div className="space-y-6">
        <motion.div className="flex items-center justify-between" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div>
            <h1 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-secondary" /> Meu Diário
            </h1>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Só você pode ler o que escreve aqui
            </p>
          </div>
          {!isWriting && !showMoodPicker && (
            <Button variant="hero" size="sm" onClick={() => setIsWriting(true)} className="micro-btn">
              <Plus className="w-4 h-4 mr-1" /> Escrever
            </Button>
          )}
        </motion.div>

        <AnimatePresence>
          {isWriting && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-secondary font-medium capitalize">
              {today}
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isWriting && !showMoodPicker && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="bg-accent/30 rounded-2xl p-5 border border-border shadow-card paper-texture"
            >
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Como você está se sentindo? Escreva livremente..."
                className="w-full min-h-[200px] bg-transparent text-foreground placeholder:text-muted-foreground text-sm leading-[28px] focus:outline-none resize-none"
                autoFocus
              />
              <div className="flex gap-2 justify-end mt-3">
                <Button variant="ghost" size="sm" onClick={() => { setIsWriting(false); setText(""); }}>Cancelar</Button>
                <Button variant="hero" size="sm" onClick={handleSave} disabled={!text.trim()} className="micro-btn">Salvar</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showMoodPicker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card rounded-2xl p-6 border border-border shadow-card text-center"
            >
              <p className="font-heading font-bold text-foreground mb-4">Como você está agora?</p>
              <div className="grid grid-cols-3 gap-3">
                {moodOptions.map((m, i) => (
                  <motion.button
                    key={m.value}
                    onClick={() => handleMoodSelect(m.value)}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-accent transition-all"
                  >
                    <span className="text-2xl">{m.emoji}</span>
                    <span className="text-xs text-muted-foreground">{m.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.id}
              className="bg-card rounded-xl border border-border shadow-card overflow-hidden micro-card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <button
                onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                className="w-full p-4 text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">{entry.date}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getMoodEmoji(entry.mood)}</span>
                    {expandedId === entry.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </div>
                <p className="text-sm text-foreground">
                  {expandedId === entry.id ? entry.content : entry.preview}
                </p>
              </button>
              <AnimatePresence>
                {expandedId === entry.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-3 flex justify-end"
                  >
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(entry.id)}>
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Deletar
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentDiary;
