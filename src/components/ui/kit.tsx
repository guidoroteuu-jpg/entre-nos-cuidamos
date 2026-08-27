/**
 * Biblioteca de componentes do Entre Nós.
 * Superfícies de vidro, cabeçalhos e blocos de estatística reutilizáveis
 * para unificar o UI de aluno, professor, direção e família.
 */
import { forwardRef, type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { statusBg, statusLabels, type StatusKey } from "@/lib/design-tokens";

/* ─────────── Superfícies ─────────── */

type GlassCardProps = HTMLMotionProps<"div"> & {
  /** `card` = vidro elevado · `inset` = vidro interno · `soft` = vidro leve */
  tone?: "card" | "inset" | "soft";
  padding?: "none" | "sm" | "md" | "lg";
  interactive?: boolean;
  /** índice para escalonar a entrada animada */
  delay?: number;
};

const paddings = {
  none: "",
  sm: "p-3.5",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
} as const;

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ tone = "card", padding = "md", interactive = false, delay = 0, className, children, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        tone === "card" && "surface-card",
        tone === "inset" && "surface-inset",
        tone === "soft" && "glass-soft rounded-3xl",
        paddings[padding],
        interactive && "micro-card cursor-pointer",
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  ),
);
GlassCard.displayName = "GlassCard";

/* ─────────── Cabeçalhos ─────────── */

export const PageHeader = ({
  eyebrow,
  title,
  description,
  icon: Icon,
  actions,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  icon?: ElementType;
  actions?: ReactNode;
  className?: string;
}) => (
  <motion.header
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    className={cn("flex flex-wrap items-start justify-between gap-3", className)}
  >
    <div className="flex items-start gap-3 min-w-0">
      {Icon && (
        <span className="icon-chip mt-0.5">
          <Icon className="w-5 h-5" />
        </span>
      )}
      <div className="min-w-0">
        {eyebrow && <p className="section-eyebrow mb-1">{eyebrow}</p>}
        <h1 className="font-heading text-[26px] leading-tight font-extrabold text-foreground tracking-tight">
          {title}
        </h1>
        {description && <p className="text-sm text-muted-foreground mt-1.5">{description}</p>}
      </div>
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </motion.header>
);

export const SectionHeader = ({
  title,
  description,
  icon: Icon,
  aside,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  icon?: ElementType;
  aside?: ReactNode;
  className?: string;
}) => (
  <div className={cn("flex items-start justify-between gap-3", className)}>
    <div className="flex items-start gap-2.5 min-w-0">
      {Icon && (
        <span className="icon-chip">
          <Icon className="w-5 h-5" />
        </span>
      )}
      <div className="min-w-0">
        <h2 className="section-title text-base">{title}</h2>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
    </div>
    {aside && <div className="flex-none text-xs text-muted-foreground">{aside}</div>}
  </div>
);

/* ─────────── Indicadores ─────────── */

export const StatTile = ({
  label,
  value,
  caption,
  icon: Icon,
  visual,
  progress,
  status,
  delay = 0,
  className,
}: {
  label: string;
  value: ReactNode;
  caption?: ReactNode;
  icon?: ElementType;
  visual?: ReactNode;
  /** 0–100 */
  progress?: number;
  status?: StatusKey;
  delay?: number;
  className?: string;
}) => (
  <GlassCard padding="sm" delay={delay} className={cn("p-4 sm:p-5", className)}>
    <div className="flex items-center gap-2 mb-3">
      <span className="icon-chip w-9 h-9 bg-accent/70">
        {visual ?? (Icon ? <Icon className="w-4.5 h-4.5" /> : null)}
      </span>
      <div className="flex items-center gap-1.5 min-w-0">
        {status && <span className={cn("w-2.5 h-2.5 rounded-full flex-none", statusBg[status])} aria-hidden="true" />}
        <span className="text-[13px] font-semibold text-foreground truncate">{label}</span>
      </div>
    </div>
    <p className="stat-value text-3xl leading-none">{value}</p>
    {progress !== undefined && (
      <div className="mt-2.5 h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full", status ? statusBg[status] : "bg-primary")}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.7, delay: delay + 0.15, ease: "easeOut" }}
        />
      </div>
    )}
    {caption && <p className="stat-caption mt-1.5">{caption}</p>}
  </GlassCard>
);

export const StatusPill = ({
  status,
  label,
  className,
}: {
  status: StatusKey;
  label?: string;
  className?: string;
}) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-2.5 py-1",
      className,
    )}
  >
    <span className={cn("w-2.5 h-2.5 rounded-full", statusBg[status])} aria-hidden="true" />
    <span className="text-xs font-medium text-foreground">{label ?? statusLabels[status]}</span>
  </span>
);

/* ─────────── Gráficos ─────────── */

export const ChartCard = ({
  title,
  description,
  icon,
  aside,
  height = 240,
  delay = 0,
  className,
  children,
}: {
  title: ReactNode;
  description?: ReactNode;
  icon?: ElementType;
  aside?: ReactNode;
  height?: number;
  delay?: number;
  className?: string;
  children: ReactNode;
}) => (
  <GlassCard delay={delay} className={className}>
    <SectionHeader title={title} description={description} icon={icon} aside={aside} className="mb-4" />
    <div className="surface-inset p-3" style={{ height }}>
      {children}
    </div>
  </GlassCard>
);

/* ─────────── Layout ─────────── */

export const PageShell = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("w-full space-y-5 sm:space-y-6", className)} {...props}>
    {children}
  </div>
);
