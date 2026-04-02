import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShieldCheck, LayoutDashboard, Users, AlertTriangle, CalendarDays, Settings, LogOut } from "lucide-react";

/* Itens de navegação da direção */
const navItems = [
  { path: "/direcao/painel", label: "Início", icon: LayoutDashboard },
  { path: "/direcao/turmas", label: "Turmas", icon: Users },
  { path: "/direcao/denuncias", label: "Denúncias", icon: AlertTriangle },
  { path: "/direcao/ano-letivo", label: "Ano Letivo", icon: CalendarDays },
  { path: "/direcao/configuracoes", label: "Configurações", icon: Settings },
];

const DirectionLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex w-60 gradient-hero flex-col p-4">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-primary-foreground" />
          <span className="font-heading font-bold text-primary-foreground">Entre Nós</span>
        </div>
        <span className="text-xs text-primary-foreground/50 mb-8 ml-7">Direção</span>
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/10"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Link to="/login" className="flex items-center gap-3 px-3 py-2.5 text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
          <LogOut className="w-4 h-4" /> Sair
        </Link>
      </aside>

      {/* Header mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg gradient-hero flex items-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-sm text-foreground">Entre Nós</span>
          <span className="text-xs text-muted-foreground">Direção</span>
        </div>
      </div>

      {/* Conteúdo */}
      <main className="flex-1 p-4 md:p-8 pt-18 md:pt-8 pb-20 md:pb-8 overflow-auto">
        {children}
      </main>

      {/* Navegação inferior mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border px-2 py-1 flex justify-around">
        {navItems.slice(0, 4).map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 py-2 px-2 rounded-lg transition-colors ${
                active ? "text-secondary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default DirectionLayout;
