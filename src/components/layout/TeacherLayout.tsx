import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Bell, FileText, CalendarDays, AlertTriangle, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";

const navItems = [
  { path: "/professor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/professor/alertas", label: "Alertas", icon: Bell },
  { path: "/professor/denuncias", label: "Denúncias", icon: AlertTriangle },
  { path: "/professor/relatorio", label: "Relatório", icon: FileText },
  { path: "/professor/ano-letivo", label: "Ano Letivo", icon: CalendarDays },
];

const TeacherLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex w-60 gradient-hero flex-col p-4">
        <div className="mb-8">
          <Logo variante="escura" largura={140} />
        </div>
        <nav className="space-y-1 flex-1 relative">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  active
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/10"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="teacher-sidebar-bar"
                    className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full bg-primary-foreground"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Link to="/login" className="flex items-center gap-3 px-3 py-2.5 text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors micro-btn">
          <LogOut className="w-4 h-4" /> Sair
        </Link>
      </aside>

      {/* Header mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border h-14 flex items-center justify-between px-4">
        <Logo variante="clara" largura={120} />
      </div>

      {/* Conteúdo */}
      <main className="flex-1 p-4 md:p-8 pt-18 md:pt-8 pb-20 md:pb-8 overflow-auto">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>

      {/* Navegação inferior mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border px-2 py-1 flex justify-around z-40">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center gap-0.5 py-2 px-2 rounded-lg transition-colors ${
                active ? "text-secondary" : "text-muted-foreground"
              }`}
            >
              <motion.div whileTap={{ scale: 0.85 }}>
                <item.icon className="w-5 h-5" />
              </motion.div>
              <span className="text-[10px] font-medium">{item.label}</span>
              {active && (
                <motion.div
                  layoutId="teacher-nav-dot"
                  className="absolute -bottom-0.5 w-5 h-1 rounded-full bg-secondary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default TeacherLayout;
