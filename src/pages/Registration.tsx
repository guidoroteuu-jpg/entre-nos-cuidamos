import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";

const estados = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

const Registration = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: "", cnpj: "", responsavel: "", email: "",
    telefone: "", alunos: "", cidade: "", estado: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.nome || !form.responsavel || !form.email || !form.cidade || !form.estado) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      navigate("/bem-vindo", { state: { escola: form.nome, codigo: "TURMA-" + Math.random().toString(36).slice(2, 6).toUpperCase() } });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-lg"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>

        <div className="flex items-center gap-4 mb-6">
          <Logo variante="slogan" largura={220} />
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="bg-destructive/10 text-destructive text-sm rounded-lg p-3 mb-4">
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 border border-border shadow-elevated space-y-4">
          <h1 className="font-heading font-bold text-xl text-foreground">Cadastre sua escola</h1>
          <p className="text-xs text-muted-foreground -mt-2">30 dias grátis, sem cartão de crédito</p>

          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Nome da escola *</label>
            <Input value={form.nome} onChange={(e) => handleChange("nome", e.target.value)} placeholder="Escola Municipal..." className="h-11 micro-input" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">CNPJ <span className="text-muted-foreground">(opcional)</span></label>
            <Input value={form.cnpj} onChange={(e) => handleChange("cnpj", e.target.value)} placeholder="00.000.000/0000-00" className="h-11 micro-input" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Nome do responsável *</label>
            <Input value={form.responsavel} onChange={(e) => handleChange("responsavel", e.target.value)} placeholder="Seu nome completo" className="h-11 micro-input" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Email institucional *</label>
            <Input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="contato@escola.edu.br" className="h-11 micro-input" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Telefone</label>
            <Input value={form.telefone} onChange={(e) => handleChange("telefone", e.target.value)} placeholder="(11) 99999-9999" className="h-11 micro-input" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Número estimado de alunos</label>
            <Input type="number" value={form.alunos} onChange={(e) => handleChange("alunos", e.target.value)} placeholder="500" className="h-11 micro-input" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Cidade *</label>
              <Input value={form.cidade} onChange={(e) => handleChange("cidade", e.target.value)} placeholder="São Paulo" className="h-11 micro-input" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Estado *</label>
              <select
                value={form.estado}
                onChange={(e) => handleChange("estado", e.target.value)}
                className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">UF</option>
                {estados.map((uf) => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
          </div>

          <Button type="submit" variant="hero" className="w-full h-12 text-base btn-shimmer micro-btn" disabled={loading}>
            {loading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Criando sua conta...</> : "Começar 30 dias grátis"}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Ao cadastrar, você concorda com nossa{" "}
          <Link to="/privacidade" className="text-secondary underline">política de privacidade</Link>.
        </p>
      </motion.div>
    </div>
  );
};

export default Registration;
