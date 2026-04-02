import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building, Heart, LogOut, TrendingUp, TrendingDown, Users } from "lucide-react";

const classes = [
  { name: "5A", total: 20, good: 13, attention: 3, problem: 2, severe: 1, trend: "down" },
  { name: "5B", total: 22, good: 18, attention: 3, problem: 1, severe: 0, trend: "up" },
  { name: "6A", total: 25, good: 20, attention: 3, problem: 1, severe: 1, trend: "stable" },
  { name: "6B", total: 23, good: 15, attention: 5, problem: 2, severe: 1, trend: "down" },
  { name: "7A", total: 28, good: 24, attention: 3, problem: 1, severe: 0, trend: "up" },
];

const totalStudents = classes.reduce((a, c) => a + c.total, 0);
const totalGood = classes.reduce((a, c) => a + c.good, 0);
const totalRisk = totalStudents - totalGood;

const DirectionPanel = () => (
  <div className="min-h-screen bg-background">
    <header className="gradient-hero px-4 md:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Heart className="w-5 h-5 text-primary-foreground" />
        <span className="font-heading font-bold text-primary-foreground">Entre Nós</span>
        <span className="text-primary-foreground/50 mx-2">|</span>
        <span className="text-sm text-primary-foreground/70">Direção</span>
      </div>
      <Link to="/login">
        <Button variant="ghost" size="sm" className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10">
          <LogOut className="w-4 h-4 mr-1" /> Sair
        </Button>
      </Link>
    </header>

    <main className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
          <Building className="w-6 h-6 text-secondary" /> Painel da Escola
        </h1>
        <p className="text-sm text-muted-foreground">Dados agregados · Nenhum aluno identificado</p>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-5 border border-border shadow-card">
          <p className="text-sm text-muted-foreground mb-1">Total de alunos</p>
          <p className="text-3xl font-heading font-bold text-foreground">{totalStudents}</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border shadow-card">
          <p className="text-sm text-muted-foreground mb-1">Bem</p>
          <p className="text-3xl font-heading font-bold text-status-good">{Math.round((totalGood / totalStudents) * 100)}%</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border shadow-card">
          <p className="text-sm text-muted-foreground mb-1">Em risco</p>
          <p className="text-3xl font-heading font-bold text-status-problem">{Math.round((totalRisk / totalStudents) * 100)}%</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border shadow-card">
          <p className="text-sm text-muted-foreground mb-1">Turmas</p>
          <p className="text-3xl font-heading font-bold text-foreground">{classes.length}</p>
        </div>
      </div>

      {/* Classes */}
      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="font-heading font-bold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-secondary" /> Clima por Turma
          </h2>
        </div>
        <div className="divide-y divide-border">
          {classes.map((c) => (
            <div key={c.name} className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center font-heading font-bold text-foreground">
                {c.name}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-sm font-medium text-foreground">{c.total} alunos</span>
                  {c.trend === "up" && <TrendingUp className="w-3.5 h-3.5 text-status-good" />}
                  {c.trend === "down" && <TrendingDown className="w-3.5 h-3.5 text-status-problem" />}
                </div>
                <div className="flex h-2 rounded-full overflow-hidden bg-muted">
                  <div className="bg-status-good" style={{ width: `${(c.good / c.total) * 100}%` }} />
                  <div className="bg-status-attention" style={{ width: `${(c.attention / c.total) * 100}%` }} />
                  <div className="bg-status-problem" style={{ width: `${(c.problem / c.total) * 100}%` }} />
                  <div className="bg-status-severe" style={{ width: `${(c.severe / c.total) * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  </div>
);

export default DirectionPanel;
