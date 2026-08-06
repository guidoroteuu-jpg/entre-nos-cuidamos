import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, CameraOff, ShieldCheck, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import MoodCat, { catByScore6 } from "@/components/MoodCat";
import {
  EmotionScores,
  emptyEmotions,
  emotionColors,
  emotionLabels,
  emotionsToMoodScore,
  hasCameraConsent,
  setCameraConsent,
  submitFaceCheckin,
} from "@/lib/faceMood";

type Fase = "consentimento" | "pronto" | "carregando" | "lendo" | "resultado" | "erro";

const AMOSTRAS = 16;
const INTERVALO_MS = 320;

const FacialCheckin = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const cancelRef = useRef(false);

  const [fase, setFase] = useState<Fase>(hasCameraConsent() ? "pronto" : "consentimento");
  const [progresso, setProgresso] = useState(0);
  const [emocoes, setEmocoes] = useState<EmotionScores>(emptyEmotions());
  const [erro, setErro] = useState("");
  const [enviado, setEnviado] = useState(false);

  const pararCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  useEffect(() => {
    return () => {
      cancelRef.current = true;
      pararCamera();
    };
  }, []);

  const iniciar = async () => {
    setErro("");
    setEnviado(false);
    setProgresso(0);
    cancelRef.current = false;
    setFase("carregando");

    try {
      const faceapi = await import("@vladmandic/face-api");

      // Backend de processamento local: GPU quando disponível, senão CPU.
      try {
        await faceapi.tf.setBackend("webgl");
        await faceapi.tf.ready();
      } catch {
        await faceapi.tf.setBackend("cpu");
        await faceapi.tf.ready();
      }
      if (faceapi.tf.getBackend() !== "webgl" && faceapi.tf.getBackend() !== "cpu") {
        await faceapi.tf.setBackend("cpu");
        await faceapi.tf.ready();
      }

      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ]);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: "user" },
        audio: false,
      });
      if (cancelRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      streamRef.current = stream;
      setFase("lendo");

      const video = videoRef.current;
      if (!video) throw new Error("Câmera indisponível.");
      video.srcObject = stream;
      await video.play();

      const opcoes = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.4 });
      const acumulado = emptyEmotions();
      let validas = 0;

      for (let i = 0; i < AMOSTRAS; i++) {
        if (cancelRef.current) return;
        const deteccao = await faceapi
          .detectSingleFace(video, opcoes)
          .withFaceExpressions();

        if (deteccao?.expressions) {
          const e = deteccao.expressions;
          acumulado.felicidade += e.happy;
          acumulado.neutro += e.neutral;
          acumulado.tristeza += e.sad;
          acumulado.raiva += e.angry + e.disgusted;
          acumulado.medo += e.fearful;
          acumulado.surpresa += e.surprised;
          validas++;
        }
        setProgresso(Math.round(((i + 1) / AMOSTRAS) * 100));
        await new Promise((r) => setTimeout(r, INTERVALO_MS));
      }

      pararCamera();

      if (validas < 3) {
        setErro("Não consegui ver bem seu rosto. Tente em um lugar mais iluminado e olhando para a câmera.");
        setFase("erro");
        return;
      }

      const media = emptyEmotions();
      (Object.keys(acumulado) as (keyof EmotionScores)[]).forEach((k) => {
        media[k] = acumulado[k] / validas;
      });
      setEmocoes(media);
      setFase("resultado");

      try {
        await submitFaceCheckin(media);
        setEnviado(true);
      } catch {
        setErro("Leitura feita, mas não consegui enviar agora. Tente novamente mais tarde.");
      }
    } catch (e) {
      pararCamera();
      console.error("[FacialCheckin]", e);
      const msg = e instanceof Error ? e.message : "";
      setErro(
        msg.includes("Permission") || msg.includes("denied") || msg.includes("NotAllowed")
          ? "Você não autorizou a câmera. Sem problema — o check-in por carinhas continua disponível."
          : "Não consegui acessar a câmera neste aparelho.",
      );
      setFase("erro");
    }
  };

  const cancelar = () => {
    cancelRef.current = true;
    pararCamera();
    setFase("pronto");
    setProgresso(0);
  };

  const nota = emotionsToMoodScore(emocoes);
  const ordenadas = (Object.keys(emocoes) as (keyof EmotionScores)[])
    .map((k) => ({ chave: k, valor: emocoes[k] }))
    .sort((a, b) => b.valor - a.valor);

  return (
    <motion.section
      className="surface-card p-5 sm:p-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      <div className="flex items-start gap-2.5 mb-3">
        <span className="icon-chip">
          <Camera className="w-5 h-5" />
        </span>
        <div>
          <h2 className="section-title text-base">Leitura pela câmera (opcional)</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Tudo acontece no seu aparelho. Nenhuma foto ou vídeo é salvo ou enviado — só a
            nota de humor, sem o seu nome.
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {fase === "consentimento" && (
          <motion.div key="consent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="surface-inset p-4 space-y-3">
            <div className="flex gap-2.5 text-sm text-foreground leading-relaxed">
              <ShieldCheck className="w-5 h-5 text-status-good flex-none mt-0.5" />
              <p>
                Você escolhe se quer usar. A câmera fica ligada por poucos segundos, a
                análise é feita aqui mesmo no navegador e você pode desativar quando quiser.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="hero"
                size="sm"
                className="tap-target"
                onClick={() => {
                  setCameraConsent(true);
                  setFase("pronto");
                }}
              >
                Aceito usar a câmera
              </Button>
              <Button variant="outline" size="sm" className="tap-target" onClick={() => setFase("consentimento")}>
                Agora não
              </Button>
            </div>
          </motion.div>
        )}

        {fase === "pronto" && (
          <motion.div key="pronto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-wrap items-center gap-2">
            <Button variant="hero" size="sm" className="tap-target" onClick={iniciar}>
              <Camera className="w-4 h-4 mr-1.5" /> Fazer leitura de humor
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="tap-target text-muted-foreground"
              onClick={() => {
                setCameraConsent(false);
                setFase("consentimento");
              }}
            >
              <CameraOff className="w-4 h-4 mr-1.5" /> Desativar câmera
            </Button>
          </motion.div>
        )}

        {(fase === "carregando" || fase === "lendo") && (
          <motion.div key="lendo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            <div className="relative mx-auto w-full max-w-[280px] aspect-[4/3] rounded-2xl overflow-hidden surface-inset">
              <video
                ref={videoRef}
                muted
                playsInline
                className="w-full h-full object-cover scale-x-[-1]"
              />
              {fase === "carregando" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-xs font-medium">Preparando a leitura…</span>
                </div>
              )}
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progresso}%` }} />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Olhe para a câmera por alguns segundos.</p>
              <Button variant="ghost" size="sm" className="tap-target" onClick={cancelar}>
                Cancelar
              </Button>
            </div>
          </motion.div>
        )}

        {fase === "resultado" && (
          <motion.div key="resultado" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="surface-inset p-4 flex items-center gap-3">
              <MoodCat mood={catByScore6(Math.round(nota))} alt="" className="w-12 h-12" />
              <div>
                <p className="text-[13px] text-muted-foreground">Nota de humor da leitura</p>
                <p className="stat-value text-2xl leading-none">{nota.toFixed(1)} <span className="text-sm font-medium text-muted-foreground">de 6</span></p>
              </div>
            </div>

            <div className="space-y-2">
              {ordenadas.map(({ chave, valor }) => (
                <div key={chave} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-foreground w-20 flex-none">{emotionLabels[chave]}</span>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${emotionColors[chave]}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.round(valor * 100)}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-9 text-right">{Math.round(valor * 100)}%</span>
                </div>
              ))}
            </div>

            {enviado && (
              <p className="text-sm text-status-good font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Enviado de forma anônima para o painel da turma.
              </p>
            )}
            {erro && <p className="text-sm text-status-attention">{erro}</p>}

            <Button variant="outline" size="sm" className="tap-target" onClick={() => setFase("pronto")}>
              Fazer outra leitura
            </Button>
          </motion.div>
        )}

        {fase === "erro" && (
          <motion.div key="erro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            <p className="text-sm text-status-attention leading-relaxed">{erro}</p>
            <Button variant="outline" size="sm" className="tap-target" onClick={() => setFase("pronto")}>
              Tentar de novo
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default FacialCheckin;
