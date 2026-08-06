import { supabase } from "@/integrations/supabase/client";

/**
 * Leitura emocional por expressão facial — 100% processada no aparelho do aluno.
 * Nenhuma imagem, vídeo ou identificação sai do dispositivo: apenas as
 * intensidades médias das emoções e a nota de humor são enviadas, de forma anônima.
 */

export interface EmotionScores {
  felicidade: number;
  neutro: number;
  tristeza: number;
  raiva: number;
  medo: number;
  surpresa: number;
}

export const emptyEmotions = (): EmotionScores => ({
  felicidade: 0,
  neutro: 0,
  tristeza: 0,
  raiva: 0,
  medo: 0,
  surpresa: 0,
});

export const emotionLabels: Record<keyof EmotionScores, string> = {
  felicidade: "Felicidade",
  neutro: "Neutro",
  tristeza: "Tristeza",
  raiva: "Raiva",
  medo: "Medo",
  surpresa: "Surpresa",
};

export const emotionColors: Record<keyof EmotionScores, string> = {
  felicidade: "bg-status-good",
  neutro: "bg-secondary",
  tristeza: "bg-status-problem",
  raiva: "bg-status-severe",
  medo: "bg-status-attention",
  surpresa: "bg-primary",
};

/** Converte as emoções em uma nota de humor de 1 a 6 (mesma escala do check-in). */
export const emotionsToMoodScore = (e: EmotionScores): number => {
  const total =
    e.felicidade + e.neutro + e.tristeza + e.raiva + e.medo + e.surpresa || 1;
  const valencia =
    (e.felicidade * 1 +
      e.surpresa * 0.7 +
      e.neutro * 0.5 +
      e.medo * 0.25 +
      e.tristeza * 0.1 +
      e.raiva * 0.05) /
    total;
  return Math.min(6, Math.max(1, Number((1 + valencia * 5).toFixed(2))));
};

/* ---------- Consentimento (opt-in, guardado no aparelho do aluno) ---------- */

const CONSENT_KEY = "entre_nos_consent_camera";

export const hasCameraConsent = () => localStorage.getItem(CONSENT_KEY) === "1";
export const setCameraConsent = (value: boolean) => {
  if (value) localStorage.setItem(CONSENT_KEY, "1");
  else localStorage.removeItem(CONSENT_KEY);
};

/** Turma do aluno (usada só para agrupar; nunca identifica a pessoa). */
export const getTurmaNome = () =>
  localStorage.getItem("entre_nos_turma") || "5A";

/* ---------- Envio e leitura dos dados anônimos ---------- */

export interface FaceCheckinRow {
  id: string;
  turma_nome: string;
  mood_score: number;
  created_at: string;
  felicidade: number;
  neutro: number;
  tristeza: number;
  raiva: number;
  medo: number;
  surpresa: number;
}

export const submitFaceCheckin = async (
  emotions: EmotionScores,
  turmaNome = getTurmaNome(),
) => {
  const round = (n: number) => Number(n.toFixed(4));
  const { error } = await supabase.from("expressao_checkins").insert({
    turma_nome: turmaNome,
    mood_score: emotionsToMoodScore(emotions),
    felicidade: round(emotions.felicidade),
    neutro: round(emotions.neutro),
    tristeza: round(emotions.tristeza),
    raiva: round(emotions.raiva),
    medo: round(emotions.medo),
    surpresa: round(emotions.surpresa),
  });
  if (error) throw error;
};

export const fetchFaceCheckins = async (turmaNome?: string) => {
  let query = supabase
    .from("expressao_checkins")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  if (turmaNome) query = query.eq("turma_nome", turmaNome);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as FaceCheckinRow[];
};

/* ---------- Agregação (nada identificável) ---------- */

export interface FaceAggregate {
  total: number;
  media: number;
  emocoes: EmotionScores;
  porDia: { dia: string; media: number; total: number }[];
  porTurma: { turma: string; media: number; total: number }[];
  tendencia: number;
  alerta: string | null;
}

const diaLabel = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });

export const aggregateFaceCheckins = (rows: FaceCheckinRow[]): FaceAggregate => {
  const total = rows.length;
  const emocoes = emptyEmotions();
  let soma = 0;

  rows.forEach((r) => {
    soma += Number(r.mood_score);
    emocoes.felicidade += Number(r.felicidade);
    emocoes.neutro += Number(r.neutro);
    emocoes.tristeza += Number(r.tristeza);
    emocoes.raiva += Number(r.raiva);
    emocoes.medo += Number(r.medo);
    emocoes.surpresa += Number(r.surpresa);
  });

  if (total > 0) {
    (Object.keys(emocoes) as (keyof EmotionScores)[]).forEach((k) => {
      emocoes[k] = emocoes[k] / total;
    });
  }

  const media = total > 0 ? Number((soma / total).toFixed(2)) : 0;

  // Agrupamento por dia (mais antigo -> mais recente)
  const diasMap = new Map<string, { soma: number; total: number }>();
  [...rows].reverse().forEach((r) => {
    const key = diaLabel(r.created_at);
    const cur = diasMap.get(key) ?? { soma: 0, total: 0 };
    cur.soma += Number(r.mood_score);
    cur.total += 1;
    diasMap.set(key, cur);
  });
  const porDia = [...diasMap.entries()].map(([dia, v]) => ({
    dia,
    media: Number((v.soma / v.total).toFixed(2)),
    total: v.total,
  }));

  // Agrupamento por turma
  const turmaMap = new Map<string, { soma: number; total: number }>();
  rows.forEach((r) => {
    const cur = turmaMap.get(r.turma_nome) ?? { soma: 0, total: 0 };
    cur.soma += Number(r.mood_score);
    cur.total += 1;
    turmaMap.set(r.turma_nome, cur);
  });
  const porTurma = [...turmaMap.entries()]
    .map(([turma, v]) => ({
      turma,
      media: Number((v.soma / v.total).toFixed(2)),
      total: v.total,
    }))
    .sort((a, b) => a.media - b.media);

  // Tendência: diferença entre a média dos últimos dias e a dos anteriores
  let tendencia = 0;
  if (porDia.length >= 2) {
    const metade = Math.floor(porDia.length / 2);
    const antes = porDia.slice(0, metade);
    const depois = porDia.slice(metade);
    const m = (arr: typeof porDia) =>
      arr.reduce((a, d) => a + d.media, 0) / (arr.length || 1);
    tendencia = Number((m(depois) - m(antes)).toFixed(2));
  }

  let alerta: string | null = null;
  if (total >= 5) {
    if (tendencia <= -0.5) {
      alerta = `Queda consistente no humor médio da turma (${tendencia.toFixed(2)} pontos). Vale observar o clima em sala.`;
    } else if (media < 3) {
      alerta = `Humor médio abaixo do esperado (${media.toFixed(2)} de 6) nas leituras recentes.`;
    } else if (emocoes.tristeza + emocoes.raiva > 0.45) {
      alerta = `Alta presença de tristeza e raiva nas leituras (${Math.round((emocoes.tristeza + emocoes.raiva) * 100)}%). Considere uma roda de conversa.`;
    }
  }

  return { total, media, emocoes, porDia, porTurma, tendencia, alerta };
};
