interface LogoProps {
  variante?: "escura" | "clara" | "icone" | "slogan";
  largura?: number;
}

const Logo = ({ variante = "clara", largura = 160 }: LogoProps) => {
  const height = largura * 0.35;

  /* Ícone — dois círculos sobrepostos + linhas de conexão */
  const IconSvg = ({ size = 32, light = false }: { size?: number; light?: boolean }) => (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Círculo esquerdo — mais opaco (quem se sente excluído) */}
      <circle cx="44" cy="48" r="24" fill={light ? "#7F77DD" : "#534AB7"} opacity={light ? 0.6 : 0.5} />
      {/* Círculo direito — mais sólido (quem acolhe) */}
      <circle cx="76" cy="48" r="24" fill={light ? "#EEEDFE" : "#3C3489"} opacity={light ? 0.9 : 0.85} />
      {/* Linhas curvas de conexão (abraço) */}
      <path d="M36 80 Q60 100 84 80" stroke={light ? "#EEEDFE" : "#534AB7"} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M40 86 Q60 104 80 86" stroke={light ? "#AFA9EC" : "#7F77DD"} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6" />
    </svg>
  );

  /* Versão apenas ícone */
  if (variante === "icone") {
    return <IconSvg size={largura} light={false} />;
  }

  const isLight = variante === "escura";

  return (
    <svg width={largura} height={variante === "slogan" ? height * 1.5 : height} viewBox={variante === "slogan" ? "0 0 320 168" : "0 0 320 112"} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Ícone */}
      <g transform="translate(0, 8)">
        <circle cx="38" cy="40" r="20" fill={isLight ? "#7F77DD" : "#534AB7"} opacity={isLight ? 0.6 : 0.5} />
        <circle cx="64" cy="40" r="20" fill={isLight ? "#EEEDFE" : "#3C3489"} opacity={isLight ? 0.9 : 0.85} />
        <path d="M30 68 Q51 84 72 68" stroke={isLight ? "#EEEDFE" : "#534AB7"} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M34 73 Q51 87 68 73" stroke={isLight ? "#AFA9EC" : "#7F77DD"} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
      </g>

      {/* Texto "Entre" */}
      <text x="100" y="46" fontFamily="'Nunito', sans-serif" fontWeight="700" fontSize="30" fill={isLight ? "#FFFFFF" : "#3C3489"}>
        Entre
      </text>
      {/* Linha separadora fina */}
      <line x1="100" y1="56" x2="210" y2="56" stroke={isLight ? "rgba(255,255,255,0.3)" : "rgba(60,52,137,0.2)"} strokeWidth="1" />
      {/* Texto "Nós" */}
      <text x="100" y="82" fontFamily="'Nunito', sans-serif" fontWeight="800" fontSize="34" fill={isLight ? "#AFA9EC" : "#534AB7"}>
        Nós
      </text>

      {/* Slogan (só na variante slogan) */}
      {variante === "slogan" && (
        <text x="100" y="120" fontFamily="'Inter', sans-serif" fontWeight="400" fontSize="11" fill="#888780" letterSpacing="1.5">
          Aqui, ninguém fica de fora.
        </text>
      )}
    </svg>
  );
};

export default Logo;
