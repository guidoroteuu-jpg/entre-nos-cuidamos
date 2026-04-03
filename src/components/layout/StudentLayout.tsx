import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, MessageCircle, BookOpen, Users, MessageSquare, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";

const navItems = [
  { path: "/aluno/home", label: "Início", icon: Home },
  { path: "/aluno/chat", label: "Chat", icon: MessageCircle },
  { path: "/aluno/diario", label: "Diário", icon: BookOpen },
  { path: "/aluno/confidente", label: "Confidente", icon: Users },
  { path: "/aluno/chat-ia", label: "Lis", icon: MessageSquare },
];

const StudentLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Barra superior */}
      <header className="bg-card border-b border-border px-4 h-14 flex items-center justify-between">
        <Logo variante="clara" largura={120} />
        <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors micro-btn">
          <LogOut className="w-4 h-4" />
        </Link>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 p-4 pb-20 max-w-2xl mx-auto w-full">
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
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-2 py-1 flex justify-around z-40">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center gap-0.5 py-2 px-2 rounded-lg transition-all ${
                active ? "text-secondary" : "text-muted-foreground"
              }`}
            >
              <motion.div whileTap={{ scale: 0.85 }} transition={{ duration: 0.15 }}>
                <item.icon className="w-5 h-5" />
              </motion.div>
              <span className="text-[10px] font-medium">{item.label}</span>
              {active && (
                <motion.div
                  layoutId="student-nav-dot"
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

export default StudentLayout;
