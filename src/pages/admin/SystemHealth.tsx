import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { NeonButton } from '@/components/ui/neon-button';
import { ParticleBackground } from '@/components/ui/particle-background';
import { CheckCircle2, XCircle, AlertTriangle, RefreshCw, Server, Activity, ArrowLeft } from 'lucide-react';
import { GOOGLE_SCRIPT_API_URL } from '@/lib/config';
import { getGroqResponse } from '@/lib/groq';
import { Link } from 'react-router-dom';

interface ServiceStatus {
    name: string;
    status: 'operational' | 'degraded' | 'down' | 'checking';
    latency: number;
    emailQuota?: number;
    message?: string;
}

export default function SystemHealth() {
    const [apiStatus, setApiStatus] = useState<ServiceStatus>({ name: 'Google Script API', status: 'checking', latency: 0 });
    const [groqStatus, setGroqStatus] = useState<ServiceStatus>({ name: 'Groq AI Model', status: 'checking', latency: 0 });
    const [lastChecked, setLastChecked] = useState<Date | null>(null);

    const checkHealth = async () => {
        setLastChecked(new Date());

        // Check Google Script API
        setApiStatus(prev => ({ ...prev, status: 'checking' }));
        const apiStart = performance.now();
        try {
            // We use getStats as a lightweight ping
            const response = await fetch(`${GOOGLE_SCRIPT_API_URL}?action=getStats`, { method: 'GET' });
            const apiEnd = performance.now();
            const latency = Math.round(apiEnd - apiStart);

            if (response.ok) {
                const data = await response.json();
                if (data.count !== undefined) {
                    setApiStatus({
                        name: 'Google Script API',
                        status: 'operational',
                        latency,
                        emailQuota: data.emailQuota // Expecting this from backend
                    });
                } else {
                    setApiStatus({ name: 'Google Script API', status: 'degraded', latency, message: 'Invalid response format' });
                }
            } else {
                setApiStatus({ name: 'Google Script API', status: 'down', latency, message: `HTTP ${response.status}` });
            }
        } catch (error: any) {
            setApiStatus({ name: 'Google Script API', status: 'down', latency: 0, message: error.message });
        }

        // Check Groq AI
        setGroqStatus(prev => ({ ...prev, status: 'checking' }));
        const groqStart = performance.now();
        try {
            // Simple ping to Groq
            await getGroqResponse("System Health Check Ping");
            const groqEnd = performance.now();
            const latency = Math.round(groqEnd - groqStart);
            setGroqStatus({ name: 'Groq AI Model', status: 'operational', latency });
        } catch (error: any) {
            setGroqStatus({ name: 'Groq AI Model', status: 'degraded', latency: 0, message: "AI Request Failed" });
        }
    };

    useEffect(() => {
        checkHealth();
        // Auto-refresh every 60 seconds
        const interval = setInterval(checkHealth, 60000);
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'operational': return 'text-green-400 bg-green-500/10 border-green-500/30';
            case 'degraded': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
            case 'down': return 'text-red-400 bg-red-500/10 border-red-500/30';
            default: return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
        }
    };

    const StatusIcon = ({ status }: { status: string }) => {
        switch (status) {
            case 'operational': return <CheckCircle2 className="w-6 h-6 text-green-500" />;
            case 'degraded': return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
            case 'down': return <XCircle className="w-6 h-6 text-red-500" />;
            default: return <Activity className="w-6 h-6 text-slate-500 animate-pulse" />;
        }
    };

    return (
        <div className="min-h-screen bg-black text-foreground p-8 flex flex-col items-center relative overflow-hidden">
            <ParticleBackground />

            <div className="relative z-10 w-full max-w-4xl">
                <div className="flex items-center justify-between mb-8">
                    <Link to="/" className="flex items-center text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="mr-2 w-4 h-4" /> Back to Home
                    </Link>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Server className="w-8 h-8 text-cyan-400" /> System Health
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* API Status Card */}
                    <GlassCard className={`p-6 border ${apiStatus.status === 'down' ? 'border-red-500/50' : 'border-slate-800'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">{apiStatus.name}</h3>
                                <p className="text-xs text-slate-500">Backend & Database Connectivity</p>
                            </div>
                            <StatusIcon status={apiStatus.status} />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 rounded-lg bg-black/40 border border-white/5">
                                <span className="text-slate-400 text-sm">Status</span>
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${getStatusColor(apiStatus.status)}`}>
                                    {apiStatus.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-lg bg-black/40 border border-white/5">
                                <span className="text-slate-400 text-sm">Latency</span>
                                <span className="text-white font-mono">{apiStatus.latency}ms</span>
                            </div>

                            {/* Quota Section */}
                            <div className="flex justify-between items-center p-3 rounded-lg bg-black/40 border border-white/5">
                                <span className="text-slate-400 text-sm">Email Quota</span>
                                <span className={`font-mono font-bold ${(apiStatus.emailQuota || 0) > 50 ? 'text-green-400' :
                                    (apiStatus.emailQuota || 0) > 10 ? 'text-yellow-400' : 'text-red-400'
                                    }`}>
                                    {apiStatus.emailQuota !== undefined ? apiStatus.emailQuota : '---'}
                                </span>
                            </div>

                            {apiStatus.message && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono break-all">
                                    {apiStatus.message}
                                </div>
                            )}
                        </div>
                    </GlassCard>

                    {/* Groq AI Status Card */}
                    <GlassCard className={`p-6 border ${groqStatus.status === 'down' ? 'border-red-500/50' : 'border-slate-800'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">{groqStatus.name}</h3>
                                <p className="text-xs text-slate-500">Chatbot Inference Engine</p>
                            </div>
                            <StatusIcon status={groqStatus.status} />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 rounded-lg bg-black/40 border border-white/5">
                                <span className="text-slate-400 text-sm">Status</span>
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${getStatusColor(groqStatus.status)}`}>
                                    {groqStatus.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-lg bg-black/40 border border-white/5">
                                <span className="text-slate-400 text-sm">Latency</span>
                                <span className="text-white font-mono">{groqStatus.latency}ms</span>
                            </div>
                            {groqStatus.message && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono break-all">
                                    {groqStatus.message}
                                </div>
                            )}
                        </div>
                    </GlassCard>
                </div>

                <div className="mt-8 flex justify-center">
                    <NeonButton onClick={checkHealth} variant="primary" className="!w-auto px-8">
                        <RefreshCw className={`w-5 h-5 mr-2 ${apiStatus.status === 'checking' ? 'animate-spin' : ''}`} />
                        Refresh Status
                    </NeonButton>
                </div>

                {lastChecked && (
                    <p className="text-center text-slate-500 text-xs mt-4">
                        Last Updated: {lastChecked.toLocaleTimeString()}
                    </p>
                )}
            </div>
        </div>
    );
}
