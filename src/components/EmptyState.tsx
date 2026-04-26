import { motion } from "framer-motion";
import lisCat from "@/assets/lis-cat-sleeping.png";

interface EmptyStateProps {
  /** Título principal — curto, gentil */
  title?: string;
  /** Texto complementar */
  description?: string;
  /** Tamanho da ilustração do gatinho. Default: 96px */
  catSize?: number;
  /** Variante do gato. Default: "sleeping" */
  catVariant?: "sleeping" | "sitting" | "playing" | "waving";
  /** Ação opcional (botão, link) abaixo do texto */
  children?: React.ReactNode;
  /** Padding vertical. Default: "py-10" */
  padding?: string;
}

/**
 * Estado vazio universal com gatinho roxo da Lis.
 * Mantém o tom gentil sem distrair, presente em todas as listas/telas sem dados.
 */
const EmptyState = ({
  title = "Nada por aqui ainda",
  description,
  catSize = 96,
  catVariant = "sleeping",
  children,
  padding = "py-10",
}: EmptyStateProps) => {
  /* Lazy: importa só o necessário sob demanda via dynamic import seria custoso.
     Mantemos um único asset (sleeping) por padrão para empty states — calmo e sereno. */
  const catSrc = lisCat;

  return (
    <div className={`flex flex-col items-center justify-center text-center ${padding} px-6`}>
      <motion.img
        src={catSrc}
        alt=""
        aria-hidden="true"
        width={catSize}
        height={catSize}
        loading="lazy"
        className="mb-4 select-none"
        style={{
          width: catSize,
          height: catSize,
          filter: "drop-shadow(0 4px 12px hsl(245 50% 65% / 0.25))",
        }}
        initial={{ opacity: 0, y: 8, scale: 0.92 }}
        animate={{
          opacity: 0.85,
          y: [0, -6, 0],
          scale: 1,
        }}
        transition={{
          opacity: { duration: 0.4 },
          scale: { duration: 0.4 },
          y: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4,
          },
        }}
      />
      <p className="font-heading font-bold text-base text-foreground mb-1">
        {title}
      </p>
      {description && (
        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
          {description}
        </p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default EmptyState;
