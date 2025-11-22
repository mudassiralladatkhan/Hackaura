import { type ReactNode, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  glowColor?: 'cyan' | 'purple' | 'pink' | 'magenta';
  hover3d?: boolean;
  className?: string;
}

export function GlassCard({
  children,
  glowColor = 'cyan',
  hover3d = false,
  className
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  const glowStyles = {
    cyan: 'border-primary/30 hover:border-primary/60 neon-glow-cyan',
    purple: 'border-secondary/30 hover:border-secondary/60 neon-glow-purple',
    pink: 'border-accent/30 hover:border-accent/60 neon-glow-pink',
    magenta: 'border-neon-magenta/30 hover:border-neon-magenta/60 neon-glow-magenta'
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        'glass-effect border rounded-3xl p-6 transition-all duration-600',
        glowStyles[glowColor],
        hover3d && 'hover:scale-105 hover:-translate-y-2',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5',
        className
      )}
    >
      {children}
    </div>
  );
}
