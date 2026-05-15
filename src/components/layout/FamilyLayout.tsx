import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
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
    <div className="min-h-screen bg-background flex flex-col relative">
      <CatBackground variant="subtle" />

      <header className="bg-card/80 backdrop-blur-sm border-b border-border px-4 h-14 flex items-center justify-between relative z-10">
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

      <main className="flex-1 p-4 pb-24 max-w-3xl mx-auto w-full relative z-10">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-2 py-1 flex justify-around z-40">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center gap-0.5 py-2 px-3 rounded-lg transition-all ${
                active ? "text-secondary" : "text-muted-foreground"
              }`}
            >
              <motion.div whileTap={{ scale: 0.85 }} transition={{ duration: 0.15 }}>
                <item.icon className="w-5 h-5" />
              </motion.div>
              <span className="text-[11px] font-medium">{item.label}</span>
              {active && (
                <motion.div
                  layoutId="family-nav-dot"
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

export default FamilyLayout;
