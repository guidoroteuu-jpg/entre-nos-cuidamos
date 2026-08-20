import { Link, useLocation } from "@/lib/router-compat";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Logo from "@/components/Logo";
import { useI18n } from "@/lib/i18n";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const { t } = useI18n();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/">
          <Logo variante="clara" largura={130} />
        </Link>

        {isLanding && (
          <>
            <div className="hidden md:flex items-center gap-6">
              <a href="#como-funciona" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("nav.howItWorks")}</a>
              <a href="#planos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("nav.plans")}</a>
              <a href="#privacidade" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("nav.privacy")}</a>
              <Link to="/login">
                <Button variant="hero" size="sm" className="micro-btn">{t("nav.login")}</Button>
              </Link>
            </div>

            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? "Fechar menu" : "Abrir menu"}>
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {isOpen && (
              <div className="absolute top-16 left-0 right-0 bg-card border-b border-border p-4 flex flex-col gap-3 md:hidden animate-fade-in">
                <a href="#como-funciona" className="text-sm text-muted-foreground" onClick={() => setIsOpen(false)}>{t("nav.howItWorks")}</a>
                <a href="#planos" className="text-sm text-muted-foreground" onClick={() => setIsOpen(false)}>{t("nav.plans")}</a>
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="hero" size="sm" className="w-full">{t("nav.login")}</Button>
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
