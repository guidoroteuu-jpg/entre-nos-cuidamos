import catOtimo from "@/assets/cat-mood-otimo.png";
import catNeutro from "@/assets/cat-mood-neutro.png";
import catTriste from "@/assets/cat-mood-triste.png";
import catFrustrado from "@/assets/cat-mood-frustrado.png";
import catExcluido from "@/assets/cat-mood-excluido.png";
import catMuitoTriste from "@/assets/cat-mood-muito-triste.png";

/**
 * Cachorrinhos de humor padronizados — fonte única para todas as telas
 * (check-in, diário, pesquisa de clima, professor e família).
 */
export const catMoods = {
  otimo: { src: catOtimo, label: "Ótimo" },
  neutro: { src: catNeutro, label: "Neutro" },
  triste: { src: catTriste, label: "Triste" },
  frustrado: { src: catFrustrado, label: "Frustrado" },
  excluido: { src: catExcluido, label: "Excluído" },
  muito_triste: { src: catMuitoTriste, label: "Muito triste" },
} as const;

export type CatMoodKey = keyof typeof catMoods;

/** Escala de 1 a 6 usada no check-in e no diário. */
export const catByScore6 = (score: number): CatMoodKey => {
  if (score >= 6) return "otimo";
  if (score >= 5) return "neutro";
  if (score >= 4) return "triste";
  if (score >= 3) return "frustrado";
  if (score >= 2) return "excluido";
  return "muito_triste";
};

/** Escala de 1 a 5 usada na pesquisa de clima e nos painéis da família. */
export const catByScore5 = (score: number): CatMoodKey => {
  if (score >= 4.5) return "otimo";
  if (score >= 3.5) return "neutro";
  if (score >= 2.5) return "triste";
  if (score >= 1.5) return "frustrado";
  return "muito_triste";
};

interface MoodCatProps {
  mood: CatMoodKey;
  className?: string;
  alt?: string;
}

const MoodCat = ({ mood, className = "w-8 h-8", alt }: MoodCatProps) => {
  const item = catMoods[mood] ?? catMoods.neutro;
  return (
    <img
      src={item.src}
      alt={alt ?? item.label}
      width={512}
      height={512}
      loading="lazy"
      className={`${className} object-contain`}
    />
  );
};

export default MoodCat;
