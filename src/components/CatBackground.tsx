import { motion } from "framer-motion";
import catSitting from "@/assets/lis-cat-logo.png";
import catSleeping from "@/assets/lis-cat-sleeping.png";
import catPlaying from "@/assets/lis-cat-playing.png";
import catWaving from "@/assets/lis-cat-waving.png";

interface CatBackgroundProps {
  /** Densidade visual: "subtle" (default, ideal para conteúdo), "lively" (mais visível, telas de boas-vindas) */
  variant?: "subtle" | "lively";
  /** Opacidade base dos gatos. Default: 0.06 (subtle) ou 0.12 (lively) */
  opacity?: number;
}

/**
 * Background decorativo com cachorrinhos dálmatas flutuantes da Lis.
 * Espalha a identidade gentil, serena e leve por todas as telas dos alunos.
 * Não interfere na interação (pointer-events-none).
 */
const CatBackground = ({ variant = "subtle", opacity }: CatBackgroundProps) => {
  const baseOpacity = opacity ?? (variant === "lively" ? 0.12 : 0.06);

  /* Distribuição cuidadosa: cantos e bordas, nunca sobre o conteúdo central */
  const cats = [
    { src: catSleeping, top: "8%", left: "4%", size: 90, delay: 0, duration: 8, alt: "Cachorrinho dormindo" },
    { src: catPlaying, top: "15%", right: "6%", size: 80, delay: 1.2, duration: 9, alt: "Cachorrinho brincando" },
    { src: catSitting, top: "55%", left: "3%", size: 70, delay: 2.4, duration: 10, alt: "Cachorrinho sentado" },
    { src: catWaving, top: "70%", right: "4%", size: 85, delay: 0.6, duration: 11, alt: "Cachorrinho acenando" },
    { src: catSleeping, top: "85%", left: "45%", size: 60, delay: 3, duration: 9, alt: "Cachorrinho dormindo" },
    { src: catSitting, top: "35%", right: "40%", size: 50, delay: 1.8, duration: 12, alt: "Cachorrinho sentado" },
  ];

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden -z-10"
    >
      {/* Halo roxo suave de fundo */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-secondary/10" />

      {cats.map((cat, i) => (
        <motion.img
          key={i}
          src={cat.src}
          alt={cat.alt}
          width={cat.size}
          height={cat.size}
          loading="lazy"
          className="absolute select-none"
          style={{
            top: cat.top,
            left: (cat as any).left,
            right: (cat as any).right,
            width: cat.size,
            height: cat.size,
            opacity: baseOpacity,
            filter: "drop-shadow(0 2px 8px hsl(245 50% 65% / 0.25))",
          }}
          animate={{
            y: [0, -12, 0],
            rotate: [0, 3, -2, 0],
          }}
          transition={{
            duration: cat.duration,
            delay: cat.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default CatBackground;
