import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GlassCard } from '@/components/ui/glass-card';
import { ParticleBackground } from '@/components/ui/particle-background';

const HOST_COLLEGE_NAME = "VSMSRKIT, Nipani";

export default function Register() {
    return (
        <div className="min-h-screen bg-black text-foreground overflow-x-hidden pb-10">
            <ParticleBackground />

            <div className="container mx-auto px-4 py-8 relative z-10">
                <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-8 transition-colors">
                    <ChevronLeft className="mr-2" />
                    Back to Home
                </Link>

                <GlassCard glowColor="cyan" className="max-w-3xl mx-auto p-8 border-red-500/30 bg-red-500/5">
                    {/* Registration Closed Screen */}
                    <div className="text-center space-y-6">

                        {/* Icon */}
                        <div className="flex justify-center">
                            <div className="w-24 h-24 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center animate-pulse">
                                <span className="text-5xl">🚫</span>
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-3 text-red-400">
                                Registrations Closed
                            </h1>
                            <p className="text-xl text-foreground/60 font-medium">
                                HACKAURA 2026
                            </p>
                        </div>

                        {/* Main message */}
                        <div className="p-5 rounded-xl border border-red-500/30 bg-red-500/10">
                            <p className="text-red-300 font-semibold text-base md:text-lg text-center">
                                🎯 All slots are filled — Intake Complete!
                            </p>
                            <p className="text-foreground/60 text-sm mt-2 text-center leading-relaxed">
                                We have successfully registered <strong className="text-white">80 teams</strong> across
                                all domains — our maximum intake capacity has been reached.
                                Due to this, registrations for HACKAURA 2026 are officially closed.
                                Thank you to everyone who registered — we can't wait to see you at the event! 🎉
                            </p>
                        </div>

                        {/* Domain status grid */}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            {[
                                { name: 'Full Stack', icon: '💻' },
                                { name: 'Generative AI', icon: '🤖' },
                                { name: 'Cybersecurity', icon: '🔐' },
                                { name: 'Internet of Things', icon: '📡' },
                            ].map((d) => (
                                <div key={d.name} className="flex items-center gap-2 p-3 rounded-lg border border-white/10 bg-white/5">
                                    <span>{d.icon}</span>
                                    <span className="font-medium text-foreground/70">{d.name}</span>
                                    <span className="ml-auto text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">Full</span>
                                </div>
                            ))}
                        </div>

                        {/* Info note */}
                        <div className="p-4 rounded-xl border border-white/10 bg-white/5 text-sm text-foreground/50">
                            <p>📅 Event Date: <strong className="text-foreground/80">March 12–13, 2026</strong></p>
                            <p className="mt-1">📍 Venue: <strong className="text-foreground/80">{HOST_COLLEGE_NAME}</strong></p>
                        </div>

                        {/* Back button */}
                        <Link
                            to="/"
                            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl border border-primary/40 bg-primary/10 text-primary font-semibold hover:bg-primary/20 hover:border-primary/60 transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Back to Home
                        </Link>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
