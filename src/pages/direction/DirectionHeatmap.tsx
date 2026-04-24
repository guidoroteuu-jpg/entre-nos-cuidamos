import { useMemo } from "react";
import DirectionLayout from "@/components/layout/DirectionLayout";
import { Button } from "@/components/ui/button";
import { FileDown, TrendingUp, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface TurmaStat {
  turma: string;
  alunos: number;
  bullying: number;
  exclusao: number;
  agressao: number;
  resolvidos: number;
}

const dadosTurmas: TurmaStat[] = [
  { turma: "5A", alunos: 28, bullying: 2, exclusao: 4, agressao: 1, resolvidos: 3 },
  { turma: "5B", alunos: 26, bullying: 0, exclusao: 1, agressao: 2, resolvidos: 2 },
  { turma: "6A", alunos: 30, bullying: 3, exclusao: 1, agressao: 0, resolvidos: 2 },
  { turma: "6B", alunos: 27, bullying: 5, exclusao: 2, agressao: 1, resolvidos: 4 },
  { turma: "7A", alunos: 29, bullying: 1, exclusao: 3, agressao: 0, resolvidos: 2 },
  { turma: "7B", alunos: 28, bullying: 0, exclusao: 0, agressao: 0, resolvidos: 0 },
  { turma: "8A", alunos: 25, bullying: 2, exclusao: 1, agressao: 1, resolvidos: 3 },
  { turma: "9A", alunos: 24, bullying: 1, exclusao: 0, agressao: 0, resolvidos: 1 },
];

const calcRisco = (t: TurmaStat) => t.bullying + t.exclusao + t.agressao;

const corCalor = (n: number) => {
  if (n === 0) return "bg-status-good/30 border-status-good/40";
  if (n <= 2) return "bg-status-good/60 border-status-good/60";
  if (n <= 5) return "bg-status-attention/60 border-status-attention/60";
  return "bg-status-severe/70 border-status-severe/70";
};

const DirectionHeatmap = () => {
  const maxRisco = useMemo(() => Math.max(...dadosTurmas.map(calcRisco)), []);

  const exportarRelatorioMEC = () => {
    const totalAlunos = dadosTurmas.reduce((s, t) => s + t.alunos, 0);
    const totBull = dadosTurmas.reduce((s, t) => s + t.bullying, 0);
    const totExcl = dadosTurmas.reduce((s, t) => s + t.exclusao, 0);
    const totAgr = dadosTurmas.reduce((s, t) => s + t.agressao, 0);
    const totRes = dadosTurmas.reduce((s, t) => s + t.resolvidos, 0);

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Relatório agregado</title>
      <style>
        body{font-family:Arial,sans-serif;max-width:780px;margin:40px auto;padding:0 20px;color:#1a1a1a;line-height:1.6}
        h1{color:#26215C;border-bottom:3px solid #26215C;padding-bottom:10px}
        h2{color:#26215C;margin-top:30px;font-size:16px}
        .meta{background:#f5f5fa;padding:15px;border-radius:8px;margin:20px 0}
        table{width:100%;border-collapse:collapse;margin:10px 0;font-size:13px}
        th,td{border:1px solid #ddd;padding:8px;text-align:left}
        th{background:#26215C;color:white}
        .footer{margin-top:40px;padding-top:15px;border-top:1px solid #ccc;font-size:11px;color:#666}
        .totais{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:20px 0}
        .card{background:#f5f5fa;padding:12px;border-radius:8px;text-align:center}
        .card strong{display:block;font-size:22px;color:#26215C}
      </style></head><body>
      <h1>Relatório agregado de bem-estar escolar</h1>
      <div class="meta">
        <div><strong>Período:</strong> ${new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</div>
        <div><strong>Total de alunos atendidos:</strong> ${totalAlunos}</div>
        <div><strong>Total de turmas:</strong> ${dadosTurmas.length}</div>
        <div><em>Documento sem identificação de alunos — conformidade LGPD</em></div>
      </div>
      <h2>Indicadores agregados</h2>
      <div class="totais">
        <div class="card"><strong>${totBull}</strong>Bullying</div>
        <div class="card"><strong>${totExcl}</strong>Exclusão</div>
        <div class="card"><strong>${totAgr}</strong>Agressão</div>
        <div class="card"><strong>${totRes}</strong>Resolvidos</div>
      </div>
      <h2>Distribuição por turma (anonimizada)</h2>
      <table><thead><tr><th>Turma</th><th>Alunos</th><th>Bullying</th><th>Exclusão</th><th>Agressão</th><th>Resolvidos</th></tr></thead><tbody>
        ${dadosTurmas.map(t => `<tr>
          <td>${t.turma}</td><td>${t.alunos}</td><td>${t.bullying}</td><td>${t.exclusao}</td><td>${t.agressao}</td><td>${t.resolvidos}</td>
        </tr>`).join("")}
      </tbody></table>
      <div class="footer">
        Documento gerado automaticamente por Entre Nós em ${new Date().toLocaleString("pt-BR")}.<br/>
        Dados anonimizados, prontos para entrega à Secretaria de Educação ou MEC.
      </div>
      <script>window.print()</script>
      </body></html>`;
    const w = window.open("", "_blank");
    if (w) { w.document.write(html); w.document.close(); }
    toast.success("Relatório agregado gerado");
  };

  const turmasOrdenadas = [...dadosTurmas].sort((a, b) => calcRisco(b) - calcRisco(a));

  return (
    <DirectionLayout>
      <div className="max-w-5xl space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Mapa de calor</h1>
            <p className="text-sm text-muted-foreground">Visão estratégica para alocar recursos onde há mais necessidade</p>
          </div>
          <Button variant="outline" onClick={exportarRelatorioMEC} className="gap-2">
            <FileDown className="w-4 h-4" /> Relatório agregado (Secretaria/MEC)
          </Button>
        </div>

        {/* Heatmap grid */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-2xl border border-border p-6 shadow-card">
          <h2 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> Intensidade por turma
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {dadosTurmas.map((t, i) => {
              const risco = calcRisco(t);
              return (
                <motion.div
                  key={t.turma}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className={`rounded-2xl p-4 border-2 ${corCalor(risco)} text-foreground`}
                >
                  <p className="font-heading font-bold text-lg">Turma {t.turma}</p>
                  <p className="text-3xl font-bold my-1">{risco}</p>
                  <p className="text-xs opacity-80">{t.alunos} alunos · {t.resolvidos} resolvidos</p>
                </motion.div>
              );
            })}
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
            <span>Menos casos</span>
            <div className="flex-1 h-2 rounded-full bg-gradient-to-r from-status-good via-status-attention to-status-severe" />
            <span>Mais casos</span>
          </div>
        </motion.div>

        {/* Ranking */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
          <h2 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-status-attention" /> Turmas que precisam de mais atenção
          </h2>
          <div className="space-y-2">
            {turmasOrdenadas.slice(0, 5).map((t) => {
              const risco = calcRisco(t);
              const pct = (risco / Math.max(maxRisco, 1)) * 100;
              return (
                <div key={t.turma} className="flex items-center gap-3">
                  <span className="font-heading font-bold w-12 text-foreground">{t.turma}</span>
                  <div className="flex-1 h-3 bg-accent rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className={`h-full ${risco > 5 ? "bg-status-severe" : risco > 2 ? "bg-status-attention" : "bg-status-good"}`}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground w-10 text-right">{risco}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DirectionLayout>
  );
};

export default DirectionHeatmap;
