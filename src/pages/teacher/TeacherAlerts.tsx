import TeacherLayout from "@/components/layout/TeacherLayout";
import { Bell, AlertTriangle, Info, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const alerts = [
  { id: 1, severity: "alta", title: "Padrão de tristeza detectado", description: "Um aluno apresenta humor negativo por 5 dias consecutivos. Recomenda-se observação discreta.", time: "Há 2 horas", action: "Conversar com a turma sobre emoções" },
  { id: 2, severity: "alta", title: "Palavras sensíveis no chat", description: "Mensagens com conteúdo relacionado a exclusão foram detectadas no chat da turma.", time: "Há 4 horas", action: "Realizar atividade de integração" },
  { id: 3, severity: "media", title: "Aluno isolado em atividades", description: "Um aluno não participou de nenhuma atividade em grupo nos últimos 7 dias.", time: "Há 1 dia", action: "Incluir em grupo de trabalho" },
  { id: 4, severity: "baixa", title: "Queda no humor geral", description: "A média de humor da turma caiu 15% esta semana em relação à anterior.", time: "Há 2 dias", action: "Roda de conversa" },
];

const severityConfig: Record<string, { icon: typeof Bell; color: string; bg: string; label: string }> = {
  alta: { icon: AlertTriangle, color: "text-status-problem", bg: "bg-status-problem/10", label: "Alta" },
  media: { icon: AlertCircle, color: "text-status-attention", bg: "bg-status-attention/10", label: "Média" },
  baixa: { icon: Info, color: "text-secondary", bg: "bg-accent", label: "Baixa" },
};

const TeacherAlerts = () => (
  <TeacherLayout>
    <div className="w-full space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
          <Bell className="w-6 h-6 text-secondary" /> Alertas
        </h1>
        <p className="text-sm text-muted-foreground">Nenhum aluno é identificado. Apenas padrões são reportados.</p>
      </motion.div>

      <div className="space-y-4">
        {alerts.map((alert, i) => {
          const config = severityConfig[alert.severity]!;
          const Icon = config.icon;
          return (
            <motion.div
              key={alert.id}
              className="surface-card p-5 micro-card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>{config.label}</span>
                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                  </div>
                  <h3 className="font-heading font-bold text-foreground mb-1">{alert.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                  <div className="bg-accent rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Ação sugerida:</p>
                    <p className="text-sm font-medium text-foreground">{alert.action}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </TeacherLayout>
);

export default TeacherAlerts;
