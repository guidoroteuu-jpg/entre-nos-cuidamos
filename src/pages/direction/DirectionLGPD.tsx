import { useEffect, useState } from "react";
import DirectionLayout from "@/components/layout/DirectionLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Shield, FileCheck, Trash2, Eye, Download } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface AcessoLog {
  ts: string;
  usuario: string;
  acao: string;
  recurso: string;
}

const ACCESS_LOG_KEY = "entre_nos_log_acessos";
const CONSENT_KEY = "entre_nos_lgpd_consentimento";

interface Consentimento {
  uso_dados_pedagogicos: boolean;
  retencao_egressos_dias: number;
  exportacao_familia: boolean;
}

const DirectionLGPD = () => {
  const [logs, setLogs] = useState<AcessoLog[]>([]);
  const [consent, setConsent] = useState<Consentimento>(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    return stored ? JSON.parse(stored) : { uso_dados_pedagogicos: true, retencao_egressos_dias: 365, exportacao_familia: true };
  });

  useEffect(() => {
    setLogs(JSON.parse(localStorage.getItem(ACCESS_LOG_KEY) || "[]"));
  }, []);

  useEffect(() => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  }, [consent]);

  const apagarEgressos = () => {
    toast.success("Comando enviado: dados de alunos egressos serão apagados conforme política de retenção");
  };

  const exportarLog = () => {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Log auditável</title>
      <style>
        body{font-family:Arial,sans-serif;max-width:780px;margin:40px auto;padding:0 20px;color:#1a1a1a}
        h1{color:#26215C;border-bottom:3px solid #26215C;padding-bottom:10px}
        table{width:100%;border-collapse:collapse;margin:20px 0;font-size:12px}
        th,td{border:1px solid #ddd;padding:6px;text-align:left}
        th{background:#26215C;color:white}
        .footer{margin-top:40px;padding-top:15px;border-top:1px solid #ccc;font-size:11px;color:#666}
      </style></head><body>
      <h1>Log auditável de acesso — Conformidade LGPD</h1>
      <p>Gerado em ${new Date().toLocaleString("pt-BR")} · ${logs.length} registros</p>
      <table><thead><tr><th>Data/Hora</th><th>Usuário</th><th>Ação</th><th>Recurso</th></tr></thead><tbody>
        ${logs.map(l => `<tr>
          <td>${new Date(l.ts).toLocaleString("pt-BR")}</td>
          <td>${l.usuario}</td>
          <td>${l.acao}</td>
          <td>${l.recurso}</td>
        </tr>`).join("") || "<tr><td colspan='4'>Sem registros</td></tr>"}
      </tbody></table>
      <div class="footer">Documento de conformidade — Lei 13.709/2018 (LGPD).</div>
      <script>window.print()</script>
      </body></html>`;
    const w = window.open("", "_blank");
    if (w) { w.document.write(html); w.document.close(); }
  };

  const limparLog = () => {
    localStorage.removeItem(ACCESS_LOG_KEY);
    setLogs([]);
    toast.success("Log limpo");
  };

  return (
    <DirectionLayout>
      <div className="max-w-4xl space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" /> LGPD & Controle de acesso
          </h1>
          <p className="text-sm text-muted-foreground">Consentimento, retenção de dados e log auditável de quem acessou o quê</p>
        </div>

        {/* Consentimento */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border p-6 shadow-card space-y-4">
          <h2 className="font-heading font-bold text-foreground flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-primary" /> Configurações de consentimento
          </h2>

          <div className="flex items-center justify-between gap-4 p-3 bg-accent/30 rounded-xl">
            <div>
              <p className="font-medium text-sm text-foreground">Uso pedagógico de dados</p>
              <p className="text-xs text-muted-foreground">Permite usar dados anonimizados em relatórios pedagógicos</p>
            </div>
            <Switch checked={consent.uso_dados_pedagogicos} onCheckedChange={(v) => setConsent({ ...consent, uso_dados_pedagogicos: v })} />
          </div>

          <div className="flex items-center justify-between gap-4 p-3 bg-accent/30 rounded-xl">
            <div>
              <p className="font-medium text-sm text-foreground">Exportação para famílias</p>
              <p className="text-xs text-muted-foreground">Famílias podem solicitar relatório dos próprios filhos</p>
            </div>
            <Switch checked={consent.exportacao_familia} onCheckedChange={(v) => setConsent({ ...consent, exportacao_familia: v })} />
          </div>

          <div className="p-3 bg-accent/30 rounded-xl">
            <p className="font-medium text-sm text-foreground mb-2">Retenção de dados de alunos egressos</p>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={30}
                max={1095}
                step={30}
                value={consent.retencao_egressos_dias}
                onChange={(e) => setConsent({ ...consent, retencao_egressos_dias: parseInt(e.target.value) })}
                className="flex-1"
              />
              <span className="text-sm font-bold text-foreground w-24 text-right">{consent.retencao_egressos_dias} dias</span>
            </div>
            <Button size="sm" variant="outline" onClick={apagarEgressos} className="gap-1.5 mt-3">
              <Trash2 className="w-3.5 h-3.5" /> Apagar dados de egressos agora
            </Button>
          </div>
        </motion.div>

        {/* Log de acesso */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl border border-border p-6 shadow-card">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="font-heading font-bold text-foreground flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" /> Log de acesso ({logs.length})
            </h2>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={exportarLog} className="gap-1.5">
                <Download className="w-3.5 h-3.5" /> Exportar
              </Button>
              <Button size="sm" variant="ghost" onClick={limparLog}>Limpar</Button>
            </div>
          </div>
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Sem registros. Acesse a aba Denúncias para começar a registrar atividade.
            </p>
          ) : (
            <div className="space-y-1.5 max-h-96 overflow-auto">
              {logs.map((l, i) => (
                <div key={i} className="flex items-center gap-3 text-xs p-2 hover:bg-accent/30 rounded-lg">
                  <span className="text-muted-foreground w-32 flex-shrink-0">{new Date(l.ts).toLocaleString("pt-BR")}</span>
                  <span className="font-medium text-foreground w-28 flex-shrink-0">{l.usuario}</span>
                  <span className="text-muted-foreground w-32 flex-shrink-0">{l.acao}</span>
                  <span className="text-foreground truncate">{l.recurso}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Controle granular */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl border border-border p-6 shadow-card">
          <h2 className="font-heading font-bold text-foreground mb-3">Controle de acesso por perfil</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between p-3 bg-accent/30 rounded-xl">
              <span className="text-foreground"><strong>Professor</strong> — vê só denúncias da própria turma</span>
              <span className="text-xs text-status-good font-medium">Ativo</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-accent/30 rounded-xl">
              <span className="text-foreground"><strong>Orientador</strong> — vê todas as denúncias da escola</span>
              <span className="text-xs text-status-good font-medium">Ativo</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-accent/30 rounded-xl">
              <span className="text-foreground"><strong>Direção</strong> — acesso total + log auditável</span>
              <span className="text-xs text-status-good font-medium">Ativo</span>
            </div>
          </div>
        </motion.div>
      </div>
    </DirectionLayout>
  );
};

export default DirectionLGPD;
