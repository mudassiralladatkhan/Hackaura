import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/ui/glass-card';
import { NeonButton } from '@/components/ui/neon-button';
import { Loader2, CheckCircle2, XCircle, Users, School, Award, ArrowLeft, ShieldCheck, User } from 'lucide-react';
import { ParticleBackground } from '@/components/ui/particle-background';

interface TeamDetails {
    teamName: string;
    leaderName: string;
    leaderEmail: string;
    leaderPhone: string;
    college: string;
    domain: string;
    members: string[];
    status: string;
}

const GOOGLE_SCRIPT_API_URL = "https://script.google.com/macros/s/AKfycbysAGugBZQJYH9bgb14_x3MXwN91KXsgGads4NQCAjGuBOunoOtbtYr02czk7LwKwCS/exec";

export default function TicketVerification() {
    const [searchParams] = useSearchParams();
    const ticketId = searchParams.get('ticketId');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<TeamDetails | null>(null);
    const navigate = useNavigate();
    const fetchedRef = useRef(false);

    useEffect(() => {
        if (!ticketId) {
            setError("No Ticket ID provided.");
            setLoading(false);
            return;
        }

        if (fetchedRef.current) return;
        fetchedRef.current = true;

        const verifyTicket = async () => {
            try {
                const response = await fetch(`${GOOGLE_SCRIPT_API_URL}?action=getTeamDetails&ticketId=${ticketId}`);
                const result = await response.json();

                if (result.result === 'success') {
                    setData(result);
                } else {
                    setError(result.message || "Invalid or Expired Ticket.");
                }
            } catch (err) {
                setError("Network error. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        verifyTicket();
    }, [ticketId]);

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden bg-black font-sans text-slate-200">
            <ParticleBackground />

            <div className="relative z-10 w-full max-w-md">
                <GlassCard className="p-8 border-slate-800 bg-slate-950/60 backdrop-blur-xl animate-in fade-in zoom-in duration-500">

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
                            <p className="text-slate-400 animate-pulse">Verifying Ticket...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                                <XCircle className="w-10 h-10 text-red-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-red-500 mb-2">Verification Failed</h2>
                            <p className="text-slate-400 mb-8">{error}</p>
                            <NeonButton variant="secondary" onClick={() => navigate('/')} className="w-full">
                                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                            </NeonButton>
                        </div>
                    ) : (
                        <div className="text-center">
                            {/* STATUS BADGE */}
                            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 mb-8 animate-in slide-in-from-top-4 delay-100">
                                <ShieldCheck className="w-4 h-4" />
                                <span className="font-bold tracking-wide uppercase text-sm">Verified Ticket</span>
                            </div>

                            {/* TICKET ID */}
                            <h1 className="text-5xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2 tracking-tighter">
                                {ticketId}
                            </h1>
                            <p className="text-slate-500 text-sm uppercase tracking-widest mb-8">Official Entry Pass</p>

                            {/* DETAILS GRID */}
                            <div className="space-y-4 text-left">

                                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Team Name</p>
                                    <p className="text-xl font-bold text-white shadow-cyan-500/20 drop-shadow-sm">{data?.teamName}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                                        <div className="flex items-center gap-2 mb-1">
                                            <School className="w-3 h-3 text-purple-400" />
                                            <p className="text-xs text-slate-500 uppercase tracking-wider">College</p>
                                        </div>
                                        <p className="text-sm font-semibold text-slate-200 line-clamp-2" title={data?.college}>{data?.college}</p>
                                    </div>

                                    <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Award className="w-3 h-3 text-pink-400" />
                                            <p className="text-xs text-slate-500 uppercase tracking-wider">Domain</p>
                                        </div>
                                        <p className="text-sm font-semibold text-slate-200">{data?.domain}</p>
                                    </div>
                                </div>

                                {/* MEMBERS LIST */}
                                {/* TEAM LEADER (HIGHLIGHTED) */}
                                <div className="p-5 rounded-xl bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <User className="w-16 h-16 text-cyan-400" />
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <ShieldCheck className="w-4 h-4 text-cyan-400" />
                                        <p className="text-xs text-cyan-400 uppercase tracking-widest font-bold">Team Leader</p>
                                    </div>
                                    <p className="text-xl font-bold text-white tracking-wide">{data?.leaderName}</p>
                                    <p className="text-xs text-cyan-200/50 mt-1">Authorized Representative</p>
                                </div>

                                {/* MEMBERS GRID */}
                                {data?.members && data.members.length > 0 && (
                                    <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                                        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
                                            <Users className="w-4 h-4 text-purple-400" />
                                            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Team Members</p>
                                        </div>
                                        <div className="grid grid-cols-1 gap-2">
                                            {data.members.map((member, idx) => (
                                                <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                                                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-mono text-slate-400">
                                                        {idx + 1}
                                                    </div>
                                                    <span className="text-sm text-slate-300 font-medium">{member}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-800/50">
                                <NeonButton onClick={() => navigate('/')} variant="outline" className="w-full">
                                    Go to Homepage
                                </NeonButton>
                            </div>

                        </div>
                    )}
                </GlassCard>
            </div>
        </div>
    );
}
