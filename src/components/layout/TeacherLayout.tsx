import { ReactNode } from "react";
import { Link, useLocation } from "@/lib/router-compat";
import { LayoutDashboard, Bell, FileText, CalendarDays, AlertTriangle, LogOut, ShieldAlert, MailCheck, BookOpen, Stethoscope, ClipboardList, Accessibility } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";

const navItems = [
  { path: "/professor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/professor/alertas", label: "Alertas", icon: Bell },
  { path: "/professor/denuncias", label: "Denúncias", icon: AlertTriangle },
  { path: "/professor/relatorio", label: "Relatório", icon: FileText },
  { path: "/professor/biblioteca", label: "Biblioteca", icon: BookOpen },
  { path: "/professor/plano-individual", label: "Plano", icon: ClipboardList },
  { path: "/professor/familia", label: "Família", icon: MailCheck },
  { path: "/professor/especialista", label: "Especialista", icon: Stethoscope },
  { path: "/professor/conselho-tutelar", label: "Conselho", icon: ShieldAlert },
  { path: "/professor/ano-letivo", label: "Ano Letivo", icon: CalendarDays },
  { path: "/professor/acessibilidade", label: "Acessibilidade", icon: Accessibility },
];

const TeacherLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-transparent flex gap-0 lg:gap-5 lg:p-5">
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex w-20 lg:w-72 shrink-0 gradient-hero flex-col p-3 lg:p-5 shadow-elevated md:sticky md:top-5 md:h-[calc(100vh-2.5rem)] rounded-2xl border border-primary-foreground/10 overflow-y-auto">
        <div className="mb-8 px-1 hidden lg:block">
          <Logo variante="escura" largura={140} />
        </div>
        <nav className="space-y-1 flex-1 relative">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                aria-label={item.label}
                title={item.label}
                aria-current={active ? "page" : undefined}
                className={`relative flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 min-h-[44px] rounded-xl text-sm transition-all group ${
                  active
                    ? "bg-primary-foreground/[0.18] text-primary-foreground font-semibold shadow-xs"
                    : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 font-medium"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="teacher-sidebar-bar"
                    className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-primary-foreground"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon className="w-[18px] h-[18px] flex-none transition-transform group-hover:translate-x-0.5" strokeWidth={active ? 2.3 : 1.9} />
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <Link to="/login" aria-label="Sair" title="Sair" className="mt-2 flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 min-h-[44px] rounded-xl text-sm text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors micro-btn">
          <LogOut className="w-4 h-4" /> <span className="hidden lg:inline">Sair</span>
        </Link>
      </aside>


      {/* Header mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border h-14 flex items-center justify-between px-4">
        <Logo variante="clara" largura={120} />
      </div>

      {/* Conteúdo */}
      <main className="flex-1 min-w-0 overflow-auto px-4 py-6 pt-[4.5rem] pb-24 md:px-6 md:py-5 lg:px-8 lg:py-8">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mx-auto w-full max-w-[1480px]"
        >
          {children}
        </motion.div>
      </main>

      {/* Navegação inferior mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-panel border-t px-1 pt-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] flex justify-around z-40 shadow-elevated overflow-x-auto">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              aria-current={active ? "page" : undefined}
              className={`relative flex flex-col items-center justify-center gap-0.5 py-1.5 px-2 min-h-[44px] rounded-xl transition-colors ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="teacher-nav-pill"
                  className="absolute inset-0 rounded-xl bg-accent"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <motion.div whileTap={{ scale: 0.85 }} className="relative z-10">
                <item.icon className="w-5 h-5" strokeWidth={active ? 2.4 : 1.9} />
              </motion.div>
              <span className={`relative z-10 text-xs whitespace-nowrap ${active ? "font-bold" : "font-medium"}`}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
};

export default TeacherLayout;
