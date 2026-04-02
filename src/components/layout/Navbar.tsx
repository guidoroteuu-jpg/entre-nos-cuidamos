import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-lg text-foreground">Entre Nós</span>
        </Link>

        {isLanding && (
          <>
            <div className="hidden md:flex items-center gap-6">
              <a href="#como-funciona" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Como funciona</a>
              <a href="#planos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Planos</a>
              <a href="#privacidade" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacidade</a>
              <Link to="/login">
                <Button variant="hero" size="sm">Entrar</Button>
              </Link>
            </div>

            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {isOpen && (
              <div className="absolute top-16 left-0 right-0 bg-card border-b border-border p-4 flex flex-col gap-3 md:hidden animate-fade-in">
                <a href="#como-funciona" className="text-sm text-muted-foreground" onClick={() => setIsOpen(false)}>Como funciona</a>
                <a href="#planos" className="text-sm text-muted-foreground" onClick={() => setIsOpen(false)}>Planos</a>
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="hero" size="sm" className="w-full">Entrar</Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
