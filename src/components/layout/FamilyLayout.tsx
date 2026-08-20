import { ReactNode } from "react";
import { Link, useLocation } from "@/lib/router-compat";
import { Home, GraduationCap, Heart, CalendarCheck, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";
import CatBackground from "@/components/CatBackground";
import lisAvatar from "@/assets/lis-cat-logo.png";

const navItems = [
  { path: "/familia/painel", label: "Resumo", icon: Home },
  { path: "/familia/notas", label: "Notas", icon: GraduationCap },
  { path: "/familia/frequencia", label: "Frequência", icon: CalendarCheck },
  { path: "/familia/bem-estar", label: "Bem-estar", icon: Heart },
];

const FamilyLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-transparent flex flex-col relative">
      <CatBackground variant="subtle" />

      <header className="glass-panel border-b px-4 h-14 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <img
            src={lisAvatar}
            alt="Lis"
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
            loading="lazy"
          />
          <Logo variante="clara" largura={110} />
          <span className="ml-2 text-xs text-muted-foreground hidden sm:inline">Família</span>
        </div>
        <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors micro-btn">
          <LogOut className="w-4 h-4" />
        </Link>
      </header>

      <main className="flex-1 px-4 py-6 pb-24 max-w-3xl mx-auto w-full relative z-10">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 glass-panel border-t px-2 pt-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] flex justify-around z-40 shadow-elevated">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              aria-current={active ? "page" : undefined}
              className={`relative flex flex-col items-center justify-center gap-0.5 py-1.5 px-4 min-h-[44px] rounded-xl transition-colors ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="family-nav-pill"
                  className="absolute inset-0 rounded-xl bg-accent"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <motion.div whileTap={{ scale: 0.85 }} transition={{ duration: 0.15 }} className="relative z-10">
                <item.icon className="w-5 h-5" strokeWidth={active ? 2.4 : 1.9} />
              </motion.div>
              <span className={`relative z-10 text-xs ${active ? "font-bold" : "font-medium"}`}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
};

export default FamilyLayout;
