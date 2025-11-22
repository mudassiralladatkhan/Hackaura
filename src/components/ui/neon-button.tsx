import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface NeonButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  className?: string;
}

export function NeonButton({
  children,
  variant = 'primary',
  href,
  onClick,
  icon,
  className
}: NeonButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-300 hover:scale-105 active:scale-95';

  const variantStyles = {
    primary: 'bg-primary text-primary-foreground neon-glow-cyan hover:shadow-[0_0_40px_hsl(var(--neon-cyan)/0.7)]',
    secondary: 'bg-secondary text-secondary-foreground neon-glow-purple hover:shadow-[0_0_40px_hsl(var(--neon-purple)/0.7)]',
    outline: 'border-2 border-primary text-primary hover:bg-primary/10 hover:shadow-[0_0_30px_hsl(var(--neon-cyan)/0.5)]'
  };

  const combinedClassName = cn(baseStyles, variantStyles[variant], className);

  if (href) {
    return (
      <a href={href} className={combinedClassName}>
        {icon && <span className="text-xl">{icon}</span>}
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={combinedClassName}>
      {icon && <span className="text-xl">{icon}</span>}
      {children}
    </button>
  );
}
