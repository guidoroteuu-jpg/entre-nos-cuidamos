import { useEffect, useState } from "react";
import DirectionLayout from "@/components/layout/DirectionLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, GripVertical, BookOpenCheck, Save } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface Passo {
  id: string;
  acao: string;
  responsavel: string;
  prazoDias: number;
}

interface Protocolo {
  id: string;
  tipo: string;
  descricao: string;
  passos: Passo[];
}

const STORAGE_KEY = "entre_nos_protocolos";

const protocolosPadrao: Protocolo[] = [
  {
    id: "p1", tipo: "Bullying verbal",
    descricao: "Resposta padrão para apelidos, ofensas e ridicularização verbal.",
    passos: [
      { id: "s1", acao: "Conversar individualmente com o aluno alvo", responsavel: "Professor(a)", prazoDias: 1 },
      { id: "s2", acao: "Conversar com aluno autor da conduta", responsavel: "Orientador(a)", prazoDias: 2 },
      { id: "s3", acao: "Reunir com a família", responsavel: "Direção", prazoDias: 5 },
      { id: "s4", acao: "Acompanhar comportamento por 30 dias", responsavel: "Orientador(a)", prazoDias: 30 },
    ],
  },
  {
    id: "p2", tipo: "Cyberbullying",
    descricao: "Casos envolvendo redes sociais, grupos e plataformas digitais.",
    passos: [
      { id: "s1", acao: "Coletar evidências (prints, mensagens)", responsavel: "Orientador(a)", prazoDias: 1 },
      { id: "s2", acao: "Notificar famílias dos envolvidos", responsavel: "Direção", prazoDias: 2 },
      { id: "s3", acao: "Avaliar acionamento do Conselho Tutelar", responsavel: "Direção", prazoDias: 7 },
    ],
  },
  {
    id: "p3", tipo: "Agressão física",
    descricao: "Empurrões, brigas ou contato físico violento.",
    passos: [
      { id: "s1", acao: "Atendimento imediato e separação", responsavel: "Equipe escolar", prazoDias: 0 },
      { id: "s2", acao: "Comunicar famílias no mesmo dia", responsavel: "Direção", prazoDias: 0 },
      { id: "s3", acao: "Registrar boletim interno", responsavel: "Direção", prazoDias: 1 },
      { id: "s4", acao: "Encaminhar ao Conselho Tutelar se reincidência", responsavel: "Direção", prazoDias: 3 },
    ],
  },
];

const DirectionProtocols = () => {
  const [protocolos, setProtocolos] = useState<Protocolo[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : protocolosPadrao;
  });
  const [editing, setEditing] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(protocolos));
  }, [protocolos]);

  const addProtocolo = () => {
    const novo: Protocolo = {
      id: crypto.randomUUID(),
      tipo: "Novo tipo de caso",
      descricao: "",
      passos: [],
    };
    setProtocolos([...protocolos, novo]);
    setEditing(novo.id);
  };

  const updateProtocolo = (id: string, patch: Partial<Protocolo>) => {
    setProtocolos((prev) => prev.map((p) => p.id === id ? { ...p, ...patch } : p));
  };

  const removeProtocolo = (id: string) => {
    setProtocolos((prev) => prev.filter((p) => p.id !== id));
    toast.success("Protocolo removido");
  };

  const addPasso = (id: string) => {
    const novo: Passo = { id: crypto.randomUUID(), acao: "", responsavel: "Orientador(a)", prazoDias: 1 };
    updateProtocolo(id, { passos: [...protocolos.find(p => p.id === id)!.passos, novo] });
  };

  const updatePasso = (protId: string, passoId: string, patch: Partial<Passo>) => {
    const prot = protocolos.find(p => p.id === protId)!;
    updateProtocolo(protId, {
      passos: prot.passos.map(s => s.id === passoId ? { ...s, ...patch } : s),
    });
  };

  const removePasso = (protId: string, passoId: string) => {
    const prot = protocolos.find(p => p.id === protId)!;
    updateProtocolo(protId, { passos: prot.passos.filter(s => s.id !== passoId) });
  };

  return (
    <DirectionLayout>
      <div className="w-full space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Protocolos de resposta</h1>
            <p className="text-sm text-muted-foreground">Defina passos padronizados que toda a escola seguirá</p>
          </div>
          <Button onClick={addProtocolo} className="gap-2">
            <Plus className="w-4 h-4" /> Novo protocolo
          </Button>
        </div>

        <div className="space-y-4">
          {protocolos.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-2xl p-5 shadow-card"
            >
              <div className="flex items-start gap-3 mb-3">
                <BookOpenCheck className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div className="flex-1 space-y-2">
                  {editing === p.id ? (
                    <>
                      <Input value={p.tipo} onChange={(e) => updateProtocolo(p.id, { tipo: e.target.value })} className="font-heading font-bold" />
                      <Textarea value={p.descricao} onChange={(e) => updateProtocolo(p.id, { descricao: e.target.value })} rows={2} className="text-sm" />
                    </>
                  ) : (
                    <>
                      <h3 className="font-heading font-bold text-foreground">{p.tipo}</h3>
                      <p className="text-sm text-muted-foreground">{p.descricao || "Sem descrição"}</p>
                    </>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => setEditing(editing === p.id ? null : p.id)}>
                    {editing === p.id ? <Save className="w-4 h-4" /> : <GripVertical className="w-4 h-4" />}
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => removeProtocolo(p.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 ml-2 border-l-2 border-primary/20 pl-4">
                {p.passos.map((passo, idx) => (
                  <div key={passo.id} className="flex items-start gap-2 bg-accent/30 rounded-lg p-2.5">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0">
                      {idx + 1}
                    </span>
                    {editing === p.id ? (
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-[1fr_140px_90px_auto] gap-2">
                        <Input value={passo.acao} onChange={(e) => updatePasso(p.id, passo.id, { acao: e.target.value })} placeholder="Ação" className="text-sm h-9" />
                        <Input value={passo.responsavel} onChange={(e) => updatePasso(p.id, passo.id, { responsavel: e.target.value })} placeholder="Responsável" className="text-sm h-9" />
                        <Input type="number" value={passo.prazoDias} onChange={(e) => updatePasso(p.id, passo.id, { prazoDias: parseInt(e.target.value) || 0 })} placeholder="Dias" className="text-sm h-9" />
                        <Button size="icon" variant="ghost" onClick={() => removePasso(p.id, passo.id)}>
                          <Trash2 className="w-3.5 h-3.5 text-destructive" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex-1 text-sm">
                        <p className="text-foreground">{passo.acao}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {passo.responsavel} · prazo {passo.prazoDias} dia{passo.prazoDias !== 1 ? "s" : ""}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
                {editing === p.id && (
                  <Button size="sm" variant="outline" onClick={() => addPasso(p.id)} className="gap-1.5 mt-2">
                    <Plus className="w-3.5 h-3.5" /> Adicionar passo
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DirectionLayout>
  );
};

export default DirectionProtocols;
