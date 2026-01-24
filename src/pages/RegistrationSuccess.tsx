import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, MapPin, ArrowRight, MessageCircle, Calendar } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { ParticleBackground } from '@/components/ui/particle-background';

// Simple CSS Confetti Component
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
                        // We use inline styles for dynamic animation properties which Tailwind can't handle easily
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

export default function RegistrationSuccess() {

    // Confetti runs on mount for 5 seconds
    const [showConfetti, setShowConfetti] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => setShowConfetti(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-black text-foreground overflow-x-hidden relative flex flex-col items-center justify-center py-12">
            <ParticleBackground />

            {/* CSS Confetti Animation */}
            {showConfetti && <CSSConfetti />}

            <div className="container mx-auto px-4 relative z-10 max-w-3xl">

                {/* Header Section */}
                <div className="text-center mb-8 animate-in zoom-in duration-700">
                    <div className="inline-flex items-center justify-center p-3 rounded-full bg-green-500/10 border border-green-500/50 mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                        <CheckCircle2 className="w-12 h-12 text-green-400" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
                        <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                            You're In!
                        </span>
                    </h1>
                    <p className="text-xl text-gray-400">
                        Registration Confirmed for <span className="text-white font-bold">HACKAURA 2026</span>
                    </p>
                </div>

                {/* Digital Ticket Card */}
                <div className="animate-in slide-in-from-bottom-10 duration-1000 delay-300">
                    <GlassCard glowColor="cyan" className="p-0 overflow-hidden border-t-4 border-t-cyan-500 relative">
                        {/* Decorative Circles (Punch holes) */}
                        <div className="absolute -left-4 top-1/2 w-8 h-8 bg-black rounded-full" />
                        <div className="absolute -right-4 top-1/2 w-8 h-8 bg-black rounded-full" />

                        <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center border-b border-white/10 border-dashed">
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-lg text-cyan-400 font-bold tracking-widest uppercase mb-2">Official Entry Ticket</h3>
                                <h2 className="text-3xl font-white font-bold mb-4">CONFIRMED</h2>
                                <p className="text-sm text-gray-400 flex items-center justify-center md:justify-start gap-2">
                                    <MessageCircle className="w-4 h-4" />
                                    Your Team ID has been sent to your email
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-md">
                                    <p className="text-xs uppercase text-gray-500 mb-1">Event Date</p>
                                    <p className="text-2xl font-bold text-white">MAR 01</p>
                                    <p className="text-sm text-cyan-400 font-bold">2026</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-black/20 flex flex-col gap-4">
                            <div className="flex flex-col md:flex-row gap-4 justify-between items-center text-sm text-gray-400">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-purple-400" />
                                    <span>VSM's Institute of Technology, Nipani</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-purple-400" />
                                    <span>11:30 AM Reporting</span>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Action Buttons */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto animate-in fade-in duration-1000 delay-700">
                    <a
                        href="https://chat.whatsapp.com/DuetdcEgnGZGrfVSPxA1Sv"
                        target="_blank"
                        rel="noreferrer"
                        className="group relative"
                    >
                        <div className="absolute inset-0 bg-green-500/20 blur-xl group-hover:bg-green-500/30 transition-all rounded-full" />
                        <button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-transform hover:scale-105 active:scale-95 shadow-lg border border-white/10">
                            <MessageCircle className="w-6 h-6 fill-current" />
                            Join WhatsApp Group
                        </button>
                    </a>

                    <Link to="/">
                        <button className="w-full bg-white/5 hover:bg-white/10 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 border border-white/10">
                            <ArrowRight className="w-5 h-5" />
                            Back to Home
                        </button>
                    </Link>
                </div>

                <p className="text-center text-gray-500 text-sm mt-8 animate-in fade-in duration-1000 delay-1000">
                    Please bring your college ID card for verification at the venue.
                </p>

            </div>
        </div>
    );
}
