import { useState } from "react";
import DirectionLayout from "@/components/layout/DirectionLayout";
import { Settings, School, Users, Bell, Shield, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { toast } from "sonner";

const DirectionSettings = () => {
  const [schoolName, setSchoolName] = useState("Escola Municipal Exemplo");
  const [code, setCode] = useState("ENT-2024-XYZ");
  const [autoAlerts, setAutoAlerts] = useState(true);
  const [emailNotify, setEmailNotify] = useState(true);
  const [anonymousMode, setAnonymousMode] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);

  const handleSave = () => {
    toast.success("Configurações salvas com sucesso!");
  };

  return (
    <DirectionLayout>
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Configurações</h1>
          <p className="text-sm text-muted-foreground">Gerencie as configurações da escola</p>
        </div>

        {/* Dados da escola */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-6 border border-border shadow-card space-y-4"
        >
          <h2 className="font-heading font-bold text-foreground flex items-center gap-2">
            <School className="w-5 h-5 text-secondary" /> Dados da escola
          </h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Nome da escola</label>
              <Input value={schoolName} onChange={(e) => setSchoolName(e.target.value)} className="micro-input" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Código de acesso</label>
              <Input value={code} readOnly className="micro-input bg-accent" />
              <p className="text-xs text-muted-foreground mt-1">Compartilhe este código com professores e alunos</p>
            </div>
          </div>
        </motion.div>

        {/* Notificações */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-6 border border-border shadow-card space-y-4"
        >
          <h2 className="font-heading font-bold text-foreground flex items-center gap-2">
            <Bell className="w-5 h-5 text-secondary" /> Notificações
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Alertas automáticos</p>
                <p className="text-xs text-muted-foreground">Gerar alertas quando alunos registrarem humor negativo</p>
              </div>
              <Switch checked={autoAlerts} onCheckedChange={setAutoAlerts} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Notificações por email</p>
                <p className="text-xs text-muted-foreground">Receber emails sobre alertas graves</p>
              </div>
              <Switch checked={emailNotify} onCheckedChange={setEmailNotify} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Relatório semanal</p>
                <p className="text-xs text-muted-foreground">Enviar resumo semanal por email toda segunda-feira</p>
              </div>
              <Switch checked={weeklyReport} onCheckedChange={setWeeklyReport} />
            </div>
          </div>
        </motion.div>

        {/* Privacidade */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-6 border border-border shadow-card space-y-4"
        >
          <h2 className="font-heading font-bold text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5 text-secondary" /> Privacidade e segurança
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Modo anônimo</p>
              <p className="text-xs text-muted-foreground">Alunos não são identificados nos relatórios — apenas dados agregados</p>
            </div>
            <Switch checked={anonymousMode} onCheckedChange={setAnonymousMode} />
          </div>
          <div className="bg-accent rounded-xl p-4">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Conformidade LGPD:</strong> Todos os dados são processados de acordo com a Lei Geral de Proteção de Dados. 
              Nenhum dado pessoal é compartilhado com terceiros. Consulte a página de privacidade para mais detalhes.
            </p>
          </div>
        </motion.div>

        {/* Equipe */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl p-6 border border-border shadow-card space-y-4"
        >
          <h2 className="font-heading font-bold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-secondary" /> Equipe
          </h2>
          <div className="space-y-2">
            {["Prof. Maria Silva", "Prof. João Santos", "Prof. Ana Costa", "Prof. Carlos Lima", "Prof. Paula Neves"].map((name) => (
              <div key={name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-foreground">
                    {name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <span className="text-sm text-foreground">{name}</span>
                </div>
                <span className="text-xs text-muted-foreground">Professor(a)</span>
              </div>
            ))}
          </div>
        </motion.div>

        <Button onClick={handleSave} className="w-full" size="lg">
          <Save className="w-4 h-4 mr-2" /> Salvar configurações
        </Button>
      </div>
    </DirectionLayout>
  );
};

export default DirectionSettings;
