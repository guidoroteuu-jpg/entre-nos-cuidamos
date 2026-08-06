import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ScanFace, TrendingDown, TrendingUp, Minus, AlertTriangle, RefreshCw } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import MoodCat, { catByScore6 } from "@/components/MoodCat";
import {
  aggregateFaceCheckins,
  emotionColors,
  emotionLabels,
  fetchFaceCheckins,
  type EmotionScores,
  type FaceAggregate,
} from "@/lib/faceMood";

interface Props {
  /** Turma específica (professor) ou undefined para toda a escola (direção). */
  turmaNome?: string;
  /** Mostra a quebra por turma — usado no painel da direção. */
  mostrarTurmas?: boolean;
}

const FacialMoodPanel = ({ turmaNome, mostrarTurmas = false }: Props) => {
  const [dados, setDados] = useState<FaceAggregate | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregar = async () => {
    setCarregando(true);
    setErro("");
    try {
      const rows = await fetchFaceCheckins(turmaNome);
      setDados(aggregateFaceCheckins(rows));
    } catch {
      setErro("Não foi possível carregar as leituras agora.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turmaNome]);

  const TendIcon = !dados || Math.abs(dados.tendencia) < 0.15 ? Minus : dados.tendencia > 0 ? TrendingUp : TrendingDown;
  const tendCor = !dados || Math.abs(dados.tendencia) < 0.15
    ? "text-muted-foreground"
    : dados.tendencia > 0
      ? "text-status-good"
      : "text-status-problem";

  const ordenadas = dados
    ? (Object.keys(dados.emocoes) as (keyof EmotionScores)[])
        .map((k) => ({ chave: k, valor: dados.emocoes[k] }))
        .sort((a, b) => b.valor - a.valor)
    : [];

  return (
    <motion.div
      className="surface-card p-5 sm:p-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-2.5">
          <span className="icon-chip">
            <ScanFace className="w-5 h-5" />
          </span>
          <div>
            <h2 className="section-title text-base">Leitura emocional por expressão</h2>
            <p className="text-xs text-muted-foreground">
              Dados agregados e anônimos · check-ins voluntários feitos pelos alunos
            </p>
          </div>
        </div>
        <button
          onClick={carregar}
          aria-label="Atualizar leituras"
          className="tap-target rounded-xl p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${carregando ? "animate-spin" : ""}`} />
        </button>
      </div>

      {erro && <p className="text-sm text-status-attention">{erro}</p>}

      {!erro && dados && dados.total === 0 && (
        <p className="text-sm text-muted-foreground surface-inset p-4">
          Ainda não há leituras registradas. Os dados aparecem aqui assim que os alunos
          fizerem o check-in pela câmera.
        </p>
      )}

      {!erro && dados && dados.total > 0 && (
        <div className="space-y-5">
          {/* Resumo */}
          <div className="grid grid-cols-3 gap-3">
            <div className="surface-inset p-3.5">
              <p className="text-[11px] text-muted-foreground">Humor médio</p>
              <div className="flex items-center gap-2 mt-1">
                <MoodCat mood={catByScore6(Math.round(dados.media))} alt="" className="w-7 h-7" />
                <p className="stat-value text-2xl leading-none">{dados.media.toFixed(1)}</p>
              </div>
              <p className="stat-caption mt-1">de 6</p>
            </div>
            <div className="surface-inset p-3.5">
              <p className="text-[11px] text-muted-foreground">Leituras</p>
              <p className="stat-value text-2xl leading-none mt-2">{dados.total}</p>
              <p className="stat-caption mt-1">registros anônimos</p>
            </div>
            <div className="surface-inset p-3.5">
              <p className="text-[11px] text-muted-foreground">Tendência</p>
              <div className={`flex items-center gap-1.5 mt-2 ${tendCor}`}>
                <TendIcon className="w-5 h-5" />
                <p className="text-2xl font-heading font-bold leading-none">
                  {dados.tendencia > 0 ? "+" : ""}{dados.tendencia.toFixed(2)}
                </p>
              </div>
              <p className="stat-caption mt-1">vs. período anterior</p>
            </div>
          </div>

          {/* Alerta de tendência */}
          {dados.alerta && (
            <div className="rounded-xl border border-status-attention/40 bg-status-attention/10 p-3.5 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-status-attention mt-0.5 flex-none" />
              <p className="text-sm text-foreground leading-relaxed">{dados.alerta}</p>
            </div>
          )}

          {/* Distribuição de emoções */}
          <div className="space-y-2">
            <p className="section-eyebrow">Distribuição das emoções</p>
            {ordenadas.map(({ chave, valor }) => (
              <div key={chave} className="flex items-center gap-3">
                <span className="text-xs font-medium text-foreground w-20 flex-none">{emotionLabels[chave]}</span>
                <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full rounded-full ${emotionColors[chave]}`} style={{ width: `${Math.round(valor * 100)}%` }} />
                </div>
                <span className="text-xs text-muted-foreground w-9 text-right">{Math.round(valor * 100)}%</span>
              </div>
            ))}
          </div>

          {/* Evolução */}
          {dados.porDia.length > 1 && (
            <div>
              <p className="section-eyebrow mb-2">Evolução do humor médio</p>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dados.porDia}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="dia" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis domain={[0, 6]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={24} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                    <Line type="monotone" dataKey="media" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Quebra por turma (direção) */}
          {mostrarTurmas && dados.porTurma.length > 0 && (
            <div>
              <p className="section-eyebrow mb-2">Por turma · da mais crítica</p>
              <div className="space-y-2">
                {dados.porTurma.map((t) => (
                  <div key={t.turma} className="surface-inset px-3.5 py-2.5 flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">{t.turma}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{t.total} leituras</span>
                      <MoodCat mood={catByScore6(Math.round(t.media))} alt="" className="w-6 h-6" />
                      <span className="text-sm font-bold text-foreground w-8 text-right">{t.media.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default FacialMoodPanel;
