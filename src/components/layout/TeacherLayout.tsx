import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, LayoutDashboard, Bell, FileText, LogOut } from "lucide-react";

const navItems = [
  { path: "/professor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/professor/alertas", label: "Alertas", icon: Bell },
  { path: "/professor/relatorio", label: "Relatório", icon: FileText },
];

const TeacherLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex w-60 gradient-hero flex-col p-4">
        <div className="flex items-center gap-2 mb-8">
          <Heart className="w-5 h-5 text-primary-foreground" />
          <span className="font-heading font-bold text-primary-foreground">Entre Nós</span>
        </div>
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

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg gradient-hero flex items-center justify-center">
            <Heart className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-sm text-foreground">Entre Nós</span>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 p-4 md:p-8 pt-18 md:pt-8 pb-20 md:pb-8 overflow-auto">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border px-2 py-1 flex justify-around">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-lg transition-colors ${
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

export default TeacherLayout;
