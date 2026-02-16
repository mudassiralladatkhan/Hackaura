import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { NeonButton } from '@/components/ui/neon-button';
import { Loader2, ArrowLeft, RefreshCw, ExternalLink, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ParticleBackground } from '@/components/ui/particle-background';

interface Screenshot {
    ticketId: string;
    teamName: string;
    url: string;
    raw: string;
}

const GOOGLE_SCRIPT_API_URL = "https://script.google.com/macros/s/AKfycbyWneTmeB9sq1WVoklnkCKJsQyMOX0LSKedsOG1oNqyCu7GZWj_94dt-FMwV3PSBerG/exec";

export default function PaymentScreenshots() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchScreenshots = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${GOOGLE_SCRIPT_API_URL}?action=getPaymentScreenshots`);
            const data = await response.json();
            if (data.result === 'success') {
                setScreenshots(data.screenshots);
            }
        } catch (error) {
            console.error("Failed to fetch", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScreenshots();
    }, []);

    const filtered = screenshots.filter(s =>
        s.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.ticketId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-black text-slate-200 p-8 font-sans">
            <ParticleBackground />
            <div className="relative z-10 max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <NeonButton variant="secondary" onClick={() => navigate('/admin/participants')} title="Back" className="!p-3">
                            <ArrowLeft className="w-5 h-5" />
                        </NeonButton>
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
                                Payment Proof Gallery
                            </h1>
                            <p className="text-slate-400 text-sm">Review uploaded payment screenshots</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-grow md:flex-grow-0">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search Team or Ticket..."
                                className="pl-9 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors w-full md:w-64"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <NeonButton variant="outline" onClick={fetchScreenshots} disabled={loading}>
                            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </NeonButton>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
                        <p className="text-slate-400">Loading gallery...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 bg-slate-900/20 rounded-2xl border border-slate-800">
                        <p className="text-slate-400">No screenshots found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filtered.map((item, idx) => (
                            <GlassCard key={idx} className="p-4 group hover:border-cyan-500/50 transition-all duration-300">
                                <div className="aspect-[3/5] rounded-lg overflow-hidden bg-slate-950 mb-4 relative border border-slate-800 flex items-center justify-center">
                                    {item.url ? (
                                        <>
                                            <img
                                                src={item.url}
                                                alt={item.teamName}
                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                onClick={() => window.open(item.url, '_blank')}
                                            />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                                <ExternalLink className="w-8 h-8 text-white" />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center p-4">
                                            <p className="text-slate-600 text-xs mb-2">No Screenshot</p>
                                            <div className="text-[10px] text-slate-700 font-mono break-all line-clamp-6">
                                                {item.raw.substring(0, 100)}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-white truncate" title={item.teamName}>{item.teamName}</h3>
                                        <span className="text-xs font-mono text-cyan-400 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-900">
                                            {item.ticketId}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 truncate" title={item.raw}>
                                        {item.url ? 'Verified Upload' : 'Text Record Only'}
                                    </p>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
