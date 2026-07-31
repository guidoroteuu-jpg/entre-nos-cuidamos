import { useEffect, useRef, useState } from "react";
import StudentLayout from "@/components/layout/StudentLayout";
import { Button } from "@/components/ui/button";
import {
  BookOpen, Plus, Trash2, ChevronDown, ChevronUp, Lock,
  Sparkles, Mic, Square, Loader2, TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import EmptyState from "@/components/EmptyState";
import MoodCat, { catMoods, type CatMoodKey } from "@/components/MoodCat";

const moodOptions: { label: string; value: CatMoodKey; score: number }[] = [
  { label: "Ótimo", value: "otimo", score: 6 },
  { label: "Neutro", value: "neutro", score: 5 },
  { label: "Triste", value: "triste", score: 4 },
  { label: "Frustrado", value: "frustrado", score: 3 },
  { label: "Excluído", value: "excluido", score: 2 },
  { label: "Muito triste", value: "muito_triste", score: 1 },
];

const guidedPrompts = [
  "O que foi mais difícil hoje?",
  "Quem te ajudou ou te fez bem hoje?",
  "Qual foi o melhor momento do seu dia?",
  "Aconteceu algo que te deixou triste ou bravo?",
  "Como você gostaria de se sentir amanhã?",
  "Tem algo que você quer guardar só pra você hoje?",
  "Se hoje fosse uma cor, qual seria? Por quê?",
];

interface DiaryEntry {
  id: number;
  date: string;        // dd/mm/yyyy
  isoDate: string;     // yyyy-mm-dd para timeline
  content: string;
  mood: string;
  preview: string;
  source?: "texto" | "audio";
}

const todayISO = () => new Date().toISOString().slice(0, 10);
const fmtBR = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

const mockEntries: DiaryEntry[] = (() => {
  const out: DiaryEntry[] = [];
  const moods = ["otimo", "neutro", "triste", "frustrado", "excluido", "otimo", "neutro"];
  const samples = [
    "Hoje foi um dia bom. Consegui participar da aula e me senti mais confiante.",
    "Me senti um pouco excluído durante o recreio. Ninguém me chamou para jogar.",
    "A prova de matemática me deixou nervoso, mas acho que fui bem.",
    "Conversei com a Ana e ri muito no intervalo.",
    "Briguei com meu irmão de manhã e fiquei mal o resto do dia.",
    "Hoje foi tranquilo, sem nada demais.",
    "Tive um dia legal, fui elogiada pela professora.",
  ];
  for (let i = 0; i < 18; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i * 2);
    const iso = d.toISOString().slice(0, 10);
    const content = samples[i % samples.length];
    out.push({
      id: Date.now() - i * 100000,
      date: fmtBR(iso),
      isoDate: iso,
      content,
      mood: moods[i % moods.length],
      preview: content.slice(0, 50) + (content.length > 50 ? "..." : ""),
      source: i % 5 === 0 ? "audio" : "texto",
    });
  }
  return out;
})();

const today = new Date().toLocaleDateString("pt-BR", {
  weekday: "long", day: "numeric", month: "long", year: "numeric",
});

const moodScore = (m: string) => moodOptions.find((o) => o.value === m)?.score ?? 0;
const moodColor = (score: number) => {
  if (score >= 5) return "bg-status-good";
  if (score >= 3) return "bg-status-attention";
  if (score === 2) return "bg-status-problem";
  if (score === 1) return "bg-status-severe";
  return "bg-muted";
};

const StudentDiary = () => {
  const [isWriting, setIsWriting] = useState(false);
  const [text, setText] = useState("");
  const [entries, setEntries] = useState<DiaryEntry[]>(mockEntries);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [savedText, setSavedText] = useState("");
  const [savedSource, setSavedSource] = useState<"texto" | "audio">("texto");
  const [activePrompt, setActivePrompt] = useState<string | null>(null);

  // Áudio
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingSec, setRecordingSec] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    mediaRecorderRef.current?.stream.getTracks().forEach((t) => t.stop());
  }, []);

  const openWriting = (prompt?: string) => {
    setActivePrompt(prompt ?? null);
    setText(prompt ? `${prompt}\n\n` : "");
    setIsWriting(true);
  };

  const handleSave = (source: "texto" | "audio" = "texto") => {
    if (text.trim()) {
      setSavedText(text);
      setSavedSource(source);
      setShowMoodPicker(true);
    }
  };

  const handleMoodSelect = (mood: string) => {
    const iso = todayISO();
    const newEntry: DiaryEntry = {
      id: Date.now(),
      date: fmtBR(iso),
      isoDate: iso,
      content: savedText,
      mood,
      preview: savedText.slice(0, 50) + (savedText.length > 50 ? "..." : ""),
      source: savedSource,
    };
    setEntries([newEntry, ...entries]);
    setIsWriting(false);
    setShowMoodPicker(false);
    setText("");
    setSavedText("");
    setActivePrompt(null);
    // Conta entrada para o sistema de conquistas
    try {
      const cur = Number(localStorage.getItem("entre_nos_diary_count") || "0");
      localStorage.setItem("entre_nos_diary_count", String(cur + 1));
      window.dispatchEvent(new Event("storage"));
    } catch { /* ignore */ }
  };

  const handleDelete = (id: number) =>
    setEntries(entries.filter((e) => e.id !== id));
  const getMoodKey = (mood: string): CatMoodKey =>
    (moodOptions.find((m) => m.value === mood)?.value ?? "neutro");
  const getMoodLabel = (mood: string) =>
    moodOptions.find((m) => m.value === mood)?.label || "Neutro";

  // ==== Áudio ====
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: mr.mimeType || "audio/webm" });
        await transcribe(blob, mr.mimeType || "audio/webm");
      };
      mr.start();
      setIsRecording(true);
      setRecordingSec(0);
      timerRef.current = window.setInterval(() => {
        setRecordingSec((s) => {
          if (s >= 120) { stopRecording(); return s; }
          return s + 1;
        });
      }, 1000);
    } catch (e) {
      console.error(e);
      toast.error("Não consegui acessar o microfone. Verifique as permissões.");
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
    mediaRecorderRef.current?.stop();
  };

  const transcribe = async (blob: Blob, mimeType: string) => {
    setIsTranscribing(true);
    try {
      const arrayBuffer = await blob.arrayBuffer();
      // base64 sem prefixo data:
      let binary = "";
      const bytes = new Uint8Array(arrayBuffer);
      const chunkSize = 0x8000;
      for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode.apply(
          null,
          Array.from(bytes.subarray(i, i + chunkSize)) as unknown as number[]
        );
      }
      const base64 = btoa(binary);

      const { data, error } = await supabase.functions.invoke("transcribe-audio", {
        body: { audio: base64, mimeType },
      });
      if (error) throw error;
      const transcript: string = (data as any)?.transcript ?? "";
      if (!transcript.trim()) {
        toast.error("Não consegui ouvir o que você disse. Tente de novo.");
        return;
      }
      setText((prev) => (prev ? `${prev}\n\n${transcript}` : transcript));
      setIsWriting(true);
      toast.success("Áudio transcrito! Revise antes de salvar.");
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Não consegui transcrever agora.");
    } finally {
      setIsTranscribing(false);
    }
  };

  // ==== Timeline mensal ====
  const monthDays = (() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const last = new Date(year, month + 1, 0).getDate();
    const days: { iso: string; day: number; score: number; mood?: string }[] = [];
    for (let d = 1; d <= last; d++) {
      const iso = new Date(year, month, d).toISOString().slice(0, 10);
      const entry = entries.find((e) => e.isoDate === iso);
      days.push({
        iso, day: d,
        score: entry ? moodScore(entry.mood) : 0,
        mood: entry?.mood,
      });
    }
    return days;
  })();

  const monthLabel = new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  const monthEntries = entries.filter((e) => e.isoDate.startsWith(todayISO().slice(0, 7)));
  const avgScore = monthEntries.length
    ? (monthEntries.reduce((s, e) => s + moodScore(e.mood), 0) / monthEntries.length).toFixed(1)
    : "—";

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-secondary" /> Meu Diário
            </h1>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Só você pode ler o que escreve aqui
            </p>
          </div>
          {!isWriting && !showMoodPicker && (
            <Button
              variant="hero"
              size="sm"
              onClick={() => openWriting()}
              className="micro-btn"
            >
              <Plus className="w-4 h-4 mr-1" /> Escrever
            </Button>
          )}
        </motion.div>

        {/* Linha do tempo de humor mensal */}
        {!isWriting && !showMoodPicker && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-5 border border-border shadow-card"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-heading font-bold text-foreground flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-secondary" />
                  Sua linha do tempo
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                  {monthLabel} • {monthEntries.length} {monthEntries.length === 1 ? "dia registrado" : "dias registrados"}
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Média</div>
                <div className="text-lg font-bold text-secondary">{avgScore}</div>
              </div>
            </div>

            {/* Heatmap em grid */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(22px,1fr))] gap-1.5">
              {monthDays.map((d) => (
                <div
                  key={d.iso}
                  title={d.mood ? `${fmtBR(d.iso)} • ${getMoodLabel(d.mood)}` : `${fmtBR(d.iso)} • sem registro`}
                  className={`aspect-square rounded-md ${moodColor(d.score)} flex items-center justify-center text-[10px] font-medium ${d.score === 0 ? "text-muted-foreground/60" : "text-white"} transition-transform hover:scale-110`}
                >
                  {d.day}
                </div>
              ))}
            </div>

            {/* Legenda */}
            <div className="flex items-center gap-3 mt-4 text-[11px] text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-muted"></span>Sem registro</div>
              <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-status-severe"></span>Muito triste</div>
              <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-status-problem"></span>Excluído</div>
              <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-status-attention"></span>Atenção</div>
              <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-status-good"></span>Bem</div>
            </div>
          </motion.div>
        )}

        {/* Prompts guiados */}
        {!isWriting && !showMoodPicker && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-accent/30 rounded-2xl p-5 border border-border"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-secondary" />
              <h3 className="font-heading font-bold text-sm text-foreground">
                Sem ideia do que escrever? Comece por aqui:
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {guidedPrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => openWriting(p)}
                  className="text-xs bg-card border border-border rounded-full px-3 py-1.5 text-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Diário em áudio */}
            <div className="mt-5 pt-4 border-t border-border">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-secondary" />
                    Prefere falar a escrever?
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Grave um áudio curto (até 2 min). A Lis transcreve pra você.
                  </p>
                </div>
                {!isRecording && !isTranscribing && (
                  <Button variant="hero" size="sm" onClick={startRecording} className="micro-btn">
                    <Mic className="w-4 h-4 mr-1" /> Gravar áudio
                  </Button>
                )}
                {isRecording && (
                  <Button variant="destructive" size="sm" onClick={stopRecording} className="micro-btn">
                    <Square className="w-4 h-4 mr-1 fill-current" />
                    Parar ({recordingSec}s)
                  </Button>
                )}
                {isTranscribing && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Lis está transcrevendo...
                  </div>
                )}
              </div>
              {isRecording && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 flex items-center gap-2 text-xs text-destructive"
                >
                  <span className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                  Gravando... fale tranquilo, ninguém mais escuta.
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Data quando escrevendo */}
        <AnimatePresence>
          {isWriting && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-secondary font-medium capitalize"
            >
              {today}
              {activePrompt && (
                <span className="block text-xs text-muted-foreground font-normal mt-1">
                  Respondendo: <em>"{activePrompt}"</em>
                </span>
              )}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Editor */}
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
              <div className="flex gap-2 justify-between items-center mt-3 flex-wrap">
                <div className="flex gap-2">
                  {!isRecording && !isTranscribing && (
                    <Button variant="ghost" size="sm" onClick={startRecording} className="text-secondary">
                      <Mic className="w-3.5 h-3.5 mr-1" /> Adicionar áudio
                    </Button>
                  )}
                  {isRecording && (
                    <Button variant="destructive" size="sm" onClick={stopRecording}>
                      <Square className="w-3.5 h-3.5 mr-1 fill-current" /> Parar ({recordingSec}s)
                    </Button>
                  )}
                  {isTranscribing && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Transcrevendo...
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => { setIsWriting(false); setText(""); setActivePrompt(null); }}>
                    Cancelar
                  </Button>
                  <Button
                    variant="hero"
                    size="sm"
                    onClick={() => handleSave(activePrompt ? "texto" : "texto")}
                    disabled={!text.trim()}
                    className="micro-btn"
                  >
                    Salvar
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mood picker */}
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
                    <MoodCat mood={m.value} alt={m.label} className="w-8 h-8" />
                    <span className="text-xs text-muted-foreground">{m.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lista de entradas */}
        <div className="space-y-3">
          {entries.length === 0 ? (
            <EmptyState
              title="Seu diário está esperando"
              description="Quando você escrever ou gravar algo, aparece aqui — só pra você. Sem pressa."
            />
          ) : (
            entries.map((entry, i) => (
            <motion.div
              key={entry.id}
              className="bg-card rounded-xl border border-border shadow-card overflow-hidden micro-card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.4) }}
            >
              <button
                onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                className="w-full p-4 text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground flex items-center gap-2">
                    {entry.date}
                    {entry.source === "audio" && (
                      <span className="inline-flex items-center gap-1 text-secondary">
                        <Mic className="w-3 h-3" /> áudio
                      </span>
                    )}
                  </span>
                  <div className="flex items-center gap-2">
                    <img src={getMoodEmoji(entry.mood)} alt={getMoodLabel(entry.mood)} width={512} height={512} loading="lazy" className="w-6 h-6 object-contain" />
                    {expandedId === entry.id
                      ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap">
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
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(entry.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Deletar
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            ))
          )}
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentDiary;
