import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, MapPin, ArrowRight, MessageCircle, Calendar } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { ParticleBackground } from '@/components/ui/particle-background';
import { NeonButton } from '@/components/ui/neon-button';

// CSS Confetti Component
const CSSConfetti = () => {
    const [particles, setParticles] = useState<any[]>([]);

    useEffect(() => {
        const colors = ['#22c55e', '#06b6d4', '#a855f7', '#fbbf24', '#ef4444'];
        const newParticles = Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100, // %
            y: -10 - Math.random() * 20, // start above screen
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 4,
            rotation: Math.random() * 360,
            duration: Math.random() * 2 + 2, // 2-4s
            delay: Math.random() * 2
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        backgroundColor: p.color,
                        transform: `rotate(${p.rotation}deg)`,
                        animation: `fall ${p.duration}s linear ${p.delay}s forwards`
                    }}
                />
            ))}
            <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
        </div>
    );
};

// Countdown Component
const CountdownTimer = () => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const targetDate = new Date('2026-03-01T11:00:00');

        const interval = setInterval(() => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);
                setTimeLeft({ days, hours, minutes, seconds });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const TimeUnit = ({ value, label }: { value: number, label: string }) => (
        <div className="flex flex-col items-center p-3 bg-black/40 rounded-lg border border-cyan-500/30 backdrop-blur-sm min-w-[70px]">
            <span className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent font-mono">
                {String(value).padStart(2, '0')}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-cyan-400/80 mt-1">{label}</span>
        </div>
    );

    return (
        <div className="flex gap-2 md:gap-4 justify-center my-6">
            <TimeUnit value={timeLeft.days} label="Days" />
            <TimeUnit value={timeLeft.hours} label="Hours" />
            <TimeUnit value={timeLeft.minutes} label="Mins" />
            <TimeUnit value={timeLeft.seconds} label="Secs" />
        </div>
    );
};

export default function RegistrationSuccess() {
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShowConfetti(false), 8000);
        return () => clearTimeout(timer);
    }, []);

    // Generate Google Calendar Link
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=HACKAURA+2026&details=Join+us+for+the+ultimate+hackathon+experience!+Don't+forget+your+college+ID+and+tech+gear.&location=VSM's+Institute+of+Technology,+Nipani&dates=20260301T110000/20260302T180000`;

    // Generate Google Maps Link
    const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=VSM's+Institute+of+Technology,+Nipani";

    return (
        <div className="min-h-screen bg-black text-foreground overflow-x-hidden relative flex flex-col items-center py-12 px-4">
            <ParticleBackground />

            {showConfetti && <CSSConfetti />}

            <div className="container max-w-5xl mx-auto relative z-10 w-full">

                {/* Hero Status */}
                <div className="text-center mb-8 animate-in slide-in-from-top-10 duration-700">
                    <div className="inline-flex items-center justify-center p-4 rounded-full bg-green-500/10 border border-green-500/50 mb-6 shadow-[0_0_50px_rgba(34,197,94,0.4)] relative group">
                        <div className="absolute inset-0 rounded-full bg-green-400 blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
                        <CheckCircle2 className="w-16 h-16 text-green-400 relative z-10" />
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter uppercase relative">
                        <span className="absolute -inset-1 blur-2xl bg-gradient-to-r from-green-600 to-cyan-600 opacity-20"></span>
                        <span className="bg-gradient-to-r from-green-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent relative z-10">
                            You're In!
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        Registration Confirmed for <span className="text-cyan-300 font-bold">HACKAURA 2026</span>.
                        Get ready to innovate, build, and conquer!
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">

                    {/* Left Column: Ticket & Countdown */}
                    <div className="lg:col-span-7 flex flex-col gap-6 animate-in slide-in-from-left-10 duration-1000 delay-200">

                        {/* Countdown Card */}
                        <GlassCard className="p-6 border-cyan-500/30 bg-black/40 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
                            <h3 className="text-center text-cyan-400 uppercase tracking-[0.2em] text-sm font-bold mb-2">Event Starts In</h3>
                            <CountdownTimer />
                        </GlassCard>

                        {/* Digital Ticket */}
                        <GlassCard glowColor="purple" className="p-0 overflow-hidden border-t-4 border-t-purple-500 relative group transition-transform hover:scale-[1.01] duration-500">
                            {/* Decorative Elements */}
                            <div className="absolute -left-3 top-1/2 w-6 h-6 bg-black rounded-full border-r border-white/20" />
                            <div className="absolute -right-3 top-1/2 w-6 h-6 bg-black rounded-full border-l border-white/20" />

                            {/* Ticket Content */}
                            <div className="p-8 relative">
                                <div className="absolute top-0 right-0 p-4 opacity-50">
                                    <div className="w-16 h-16 border-2 border-white/10 rounded-lg transform rotate-12"></div>
                                </div>

                                <h3 className="text-purple-400 font-bold tracking-widest uppercase mb-1 text-sm">Official Entry Pass</h3>
                                <h2 className="text-3xl md:text-4xl font-black text-white mb-6 uppercase italic">Hackaura <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">2026</span></h2>

                                <div className="space-y-4 border-l-2 border-purple-500/30 pl-4 py-1">
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase">Venue</p>
                                        <p className="text-white font-medium">VSM's Institute of Technology, Nipani</p>
                                    </div>
                                    <div className="flex gap-8">
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase">Date</p>
                                            <p className="text-white font-medium">March 1-2, 2026</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase">Time</p>
                                            <p className="text-cyan-400 font-bold">11:00 AM</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Ticket Footer */}
                            <div className="bg-white/5 p-4 border-t border-white/10 flex justify-between items-center text-xs text-slate-400">
                                <span className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    Status: CONFIRMED
                                </span>
                                <span className="font-mono">ID: PENDING</span>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Right Column: Actions & Info */}
                    <div className="lg:col-span-5 flex flex-col gap-6 animate-in slide-in-from-right-10 duration-1000 delay-300">

                        {/* Next Steps List */}
                        <GlassCard className="p-6 border-green-500/20">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                                Next Steps
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="min-w-6 min-h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs mt-0.5 border border-green-500/30">1</div>
                                    <p className="text-sm text-slate-300">Check your inbox for the <strong>Team ID</strong> verification email.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="min-w-6 min-h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-xs mt-0.5 border border-cyan-500/30">2</div>
                                    <p className="text-sm text-slate-300">Join the WhatsApp group for official updates and announcements.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="min-w-6 min-h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs mt-0.5 border border-purple-500/30">3</div>
                                    <p className="text-sm text-slate-300">Prepare your laptop, charger, and valid College ID card.</p>
                                </li>
                            </ul>
                        </GlassCard>

                        {/* Action Buttons Grid */}
                        <div className="grid grid-cols-1 gap-3">
                            <a href="https://chat.whatsapp.com/DuetdcEgnGZGrfVSPxA1Sv" target="_blank" rel="noreferrer" className="w-full">
                                <NeonButton variant="primary" className="w-full !py-4 group relative overflow-hidden">
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        <MessageCircle className="w-5 h-5" /> Join WhatsApp Group
                                    </span>
                                </NeonButton>
                            </a>

                            <a href={googleCalendarUrl} target="_blank" rel="noreferrer" className="w-full">
                                <button className="w-full bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-lg font-medium border border-slate-700 transition-all flex items-center justify-center gap-2 text-sm">
                                    <Calendar className="w-4 h-4 text-purple-400" /> Add to Calendar
                                </button>
                            </a>

                            <div className="grid grid-cols-2 gap-3">
                                <a href={googleMapsUrl} target="_blank" rel="noreferrer" className="w-full">
                                    <button className="w-full bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-lg font-medium border border-slate-700 transition-all flex items-center justify-center gap-2 text-sm">
                                        <MapPin className="w-4 h-4 text-red-400" /> Map
                                    </button>
                                </a>
                                <Link to="/" className="w-full">
                                    <button className="w-full bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-lg font-medium border border-slate-700 transition-all flex items-center justify-center gap-2 text-sm">
                                        <ArrowRight className="w-4 h-4" /> Home
                                    </button>
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
