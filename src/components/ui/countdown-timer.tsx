import { useEffect, useState } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer() {
  const targetDate = new Date('2025-11-26T19:00:00').getTime();
  
  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000)
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  const timeBlocks = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', value: timeLeft.seconds }
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 max-w-2xl mx-auto">
      {timeBlocks.map((block, index) => (
        <div
          key={block.label}
          className="glass-effect border border-primary/30 rounded-3xl p-6 text-center transition-all duration-300 hover:scale-105 hover:border-primary/60 neon-glow-cyan"
        >
          <div className="text-4xl xl:text-5xl font-bold font-mono text-primary mb-2">
            {formatNumber(block.value)}
          </div>
          <div className="text-xs xl:text-sm uppercase tracking-widest text-muted-foreground">
            {block.label}
          </div>
        </div>
      ))}
    </div>
  );
}
