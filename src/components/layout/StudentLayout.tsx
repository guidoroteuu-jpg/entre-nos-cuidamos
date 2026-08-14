import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, Users, MessageSquare, LogOut, HeartHandshake, LifeBuoy, Accessibility } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";
import CatBackground from "@/components/CatBackground";
import lisAvatar from "@/assets/lis-cat-logo.png";

const navItems = [
  { path: "/aluno/home", label: "Início", icon: Home },
  { path: "/aluno/diario", label: "Diário", icon: BookOpen },
  { path: "/aluno/turma", label: "Turma", icon: HeartHandshake },
  { path: "/aluno/apoio", label: "Apoio", icon: LifeBuoy },
  { path: "/aluno/confidente", label: "Confidente", icon: Users },
  { path: "/aluno/chat-ia", label: "Lis", icon: MessageSquare },
  { path: "/aluno/acessibilidade", label: "Acesso", icon: Accessibility },
];

const StudentLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* Decoração de cachorrinhos ao fundo — gentil, sereno, leve */}
      <CatBackground variant="subtle" />

      {/* Barra superior */}
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
        </div>
        <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors micro-btn">
          <LogOut className="w-4 h-4" />
        </Link>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 px-4 py-6 pb-24 max-w-2xl mx-auto w-full relative z-10">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>

      {/* Navegação inferior */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border px-1 pt-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] flex justify-around z-40 shadow-elevated">
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
                  layoutId="student-nav-pill"
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

export default StudentLayout;
