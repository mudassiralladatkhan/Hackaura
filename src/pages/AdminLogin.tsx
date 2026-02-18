import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

import { Loader2, Mail, Lock } from 'lucide-react';
import { NeonButton } from '@/components/ui/neon-button';
import { GlassCard } from '@/components/ui/glass-card';
import { ParticleBackground } from '@/components/ui/particle-background';

export default function AdminLogin() {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/admin'; // Redirect to scanner or dashboard by default

    useEffect(() => {
        if (user) {
            navigate(from, { replace: true });
        }
    }, [user, navigate, from]);

    return (
        <div className="min-h-screen bg-black text-foreground flex items-center justify-center p-4">
            <ParticleBackground />
            <div className="relative z-10 w-full max-w-md">
                <GlassCard glowColor="purple" className="p-8 text-center space-y-6">
                    <div className="mx-auto w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-4 neon-glow-purple">
                        <Lock className="w-8 h-8 text-purple-400" />
                    </div>

                    <h1 className="text-3xl font-bold gradient-text">Admin Access</h1>
                    <p className="text-gray-400">Secure entry for event organizers only.</p>

                    <div className="pt-4">
                        <NeonButton
                            onClick={login}
                            variant="primary"
                            className="w-full flex items-center justify-center gap-2"
                        >
                            <Mail className="w-4 h-4" />
                            Continue with Netlify Identity
                        </NeonButton>
                    </div>

                    <div className="text-xs text-gray-500 pt-4">
                        Protected by Netlify Identity Service
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
