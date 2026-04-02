import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, Home, MessageCircle, BookOpen, Users, LogOut } from "lucide-react";

const navItems = [
  { path: "/aluno/home", label: "Início", icon: Home },
  { path: "/aluno/chat", label: "Chat", icon: MessageCircle },
  { path: "/aluno/diario", label: "Diário", icon: BookOpen },
  { path: "/aluno/confidente", label: "Confidente", icon: Users },
];

const StudentLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="bg-card border-b border-border px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg gradient-hero flex items-center justify-center">
            <Heart className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-foreground">Entre Nós</span>
        </div>
        <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">
          <LogOut className="w-4 h-4" />
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 p-4 pb-20 max-w-2xl mx-auto w-full">
        {children}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-2 py-1 flex justify-around">
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

export default StudentLayout;
