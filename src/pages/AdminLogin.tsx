import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';
import { NeonButton } from '@/components/ui/neon-button';
import { GlassCard } from '@/components/ui/glass-card';
import { ParticleBackground } from '@/components/ui/particle-background';

export default function AdminLogin() {
    const { isAuthenticated, login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/admin';

    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isShaking, setIsShaking] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!password.trim()) {
            setError('Please enter the admin password');
            return;
        }

        const success = login(password);
        if (!success) {
            setError('Invalid password. Access denied.');
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500);
            setPassword('');
        }
    };

    return (
        <div className="min-h-screen bg-black text-foreground flex items-center justify-center p-4">
            <ParticleBackground />
            <div className={`relative z-10 w-full max-w-md transition-transform ${isShaking ? 'animate-shake' : ''}`}>
                <GlassCard glowColor="purple" className="p-8 text-center space-y-6">
                    {/* Lock Icon */}
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 rounded-full flex items-center justify-center mb-4 border border-purple-500/40">
                        <Lock className="w-10 h-10 text-purple-400" />
                    </div>

                    {/* Title */}
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            Admin Access
                        </h1>
                        <p className="text-gray-400 mt-2 text-sm">Authorized personnel only</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                placeholder="Enter admin password"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all pr-12"
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <NeonButton
                            type="submit"
                            variant="primary"
                            className="w-full flex items-center justify-center gap-2"
                        >
                            <ShieldCheck className="w-4 h-4" />
                            Authenticate
                        </NeonButton>
                    </form>

                    {/* Footer */}
                    <div className="text-xs text-gray-600 pt-2">
                        🔒 Secured Admin Portal • HACKAURA 2026
                    </div>
                </GlassCard>
            </div>

            {/* Shake Animation */}
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
                    20%, 40%, 60%, 80% { transform: translateX(4px); }
                }
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
            `}</style>
        </div>
    );
}
