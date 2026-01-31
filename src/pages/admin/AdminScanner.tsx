import { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { NeonButton } from '@/components/ui/neon-button';
import { GlassCard } from '@/components/ui/glass-card';
import { Loader2, CheckCircle2, XCircle, Search, Printer, History, Camera, StopCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const GOOGLE_SCRIPT_API_URL = "https://script.google.com/macros/s/AKfycbysAGugBZQJYH9bgb14_x3MXwN91KXsgGads4NQCAjGuBOunoOtbtYr02czk7LwKwCS/exec";

export default function AdminScanner() {
    const [scanResult, setScanResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [manualId, setManualId] = useState('');
    const [recentScans, setRecentScans] = useState<any[]>([]);
    const [cameraError, setCameraError] = useState<string | null>(null);

    // We use a ref to hold the instance
    const scannerRef = useRef<Html5Qrcode | null>(null);

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().catch(e => console.error(e));
            }
        };
    }, []);

    const startCamera = async () => {
        setCameraError(null);
        try {
            // If instance exists, use it, else create new
            if (!scannerRef.current) {
                scannerRef.current = new Html5Qrcode("reader");
            }

            const scanner = scannerRef.current;

            await scanner.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0
                },
                onScanSuccess,
                (errorMessage) => {
                    // console.log("Scanning..."); // Ignore frame errors
                }
            );
            setScanning(true);
        } catch (err: any) {
            console.error("Error starting camera:", err);
            setCameraError(err?.message || "Camera permission denied or camera not found.");
            setScanning(false);
        }
    };

    const stopCamera = async () => {
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop();
                setScanning(false);
            } catch (err) {
                console.error("Failed to stop", err);
            }
        }
    };

    const onScanSuccess = (decodedText: string) => {
        // Handle URL or Direct ID
        try {
            let ticketId = decodedText;
            if (decodedText.includes('ticketId=')) {
                ticketId = decodedText.split('ticketId=')[1];
            }

            // Pause scanning logic temporarily
            if (scannerRef.current) scannerRef.current.pause();

            handleCheckIn(ticketId);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCheckIn = async (ticketId: string) => {
        if (loading) return;
        setLoading(true);

        try {
            const response = await fetch(`${GOOGLE_SCRIPT_API_URL}?action=markAttendance&ticketId=${ticketId}`);
            const result = await response.json();

            if (result.result === 'success') {
                const newScan = {
                    id: ticketId,
                    team: result.teamName,
                    time: result.timestamp,
                    status: 'success'
                };
                setScanResult(newScan);
                setRecentScans(prev => [newScan, ...prev]);
            } else {
                setScanResult({ id: ticketId, status: 'error', message: result.message });
            }

        } catch (err) {
            setScanResult({ id: ticketId, status: 'error', message: "Network Error" });
        } finally {
            setLoading(false);
            // Resume scanner after 3 seconds
            setTimeout(() => {
                setScanResult(null); // Clear overlay
                if (scannerRef.current) {
                    try {
                        scannerRef.current.resume();
                    } catch (e) { console.warn("Scanner resume failed", e) }
                }
            }, 3000);
        }
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (manualId) handleCheckIn(manualId);
    };

    return (
        <div className="min-h-screen bg-black text-slate-200 p-4 font-sans">
            <div className="max-w-md mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tighter">ADMIN <span className="text-cyan-400">SCANNER</span></h1>
                        <p className="text-xs text-slate-500 uppercase tracking-widest">Hackaura 2026 Admin Portal</p>
                    </div>
                    <Link to="/admin/print">
                        <NeonButton variant="secondary" className="!p-2">
                            <Printer className="w-5 h-5" />
                        </NeonButton>
                    </Link>
                </div>

                {/* Main Scanner Card */}
                <GlassCard className="p-4 bg-slate-900/50 border-slate-800 relative overflow-hidden">

                    {/* Active Overlay for Result */}
                    {scanResult && (
                        <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center p-6 text-center backdrop-blur-md transition-all duration-300 ${scanResult.status === 'success' ? 'bg-green-950/80' : 'bg-red-950/80'}`}>
                            {scanResult.status === 'success' ? (
                                <>
                                    <CheckCircle2 className="w-20 h-20 text-green-400 mb-4 animate-bounce" />
                                    <h2 className="text-3xl font-bold text-white mb-2">Checked In!</h2>
                                    <p className="text-green-300 text-lg font-mono">{scanResult.team}</p>
                                    <p className="text-slate-400 text-sm mt-4">{scanResult.id}</p>
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-20 h-20 text-red-500 mb-4 animate-pulse" />
                                    <h2 className="text-2xl font-bold text-white mb-2">Check-in Failed</h2>
                                    <p className="text-red-300">{scanResult.message}</p>
                                    <p className="text-slate-400 text-sm mt-4">{scanResult.id}</p>
                                </>
                            )}
                        </div>
                    )}

                    {loading && !scanResult && (
                        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
                            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
                        </div>
                    )}

                    {/* Custom Error Message */}
                    {cameraError && (
                        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-900 p-4 text-center">
                            <XCircle className="w-12 h-12 text-red-500 mb-2" />
                            <p className="text-red-400 text-sm font-bold">{cameraError}</p>
                            <NeonButton onClick={startCamera} className="mt-4 !py-2 !text-xs">
                                Retry Config
                            </NeonButton>
                        </div>
                    )}

                    {!scanning && !cameraError && (
                        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/90">
                            <Camera className="w-16 h-16 text-slate-700 mb-4" />
                            <NeonButton onClick={startCamera} className="!w-48 !py-3">
                                Start Camera
                            </NeonButton>
                            <p className="text-slate-500 text-xs mt-4">Takes a moment to load</p>
                        </div>
                    )}

                    <div id="reader" className="w-full h-64 bg-black rounded-lg overflow-hidden border-2 border-slate-700"></div>

                    {scanning && (
                        <div className="mt-4 flex justify-between items-center">
                            <p className="text-xs text-green-400 uppercase tracking-widest animate-pulse flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span> Live
                            </p>
                            <button onClick={stopCamera} className="text-slate-400 hover:text-red-400 transition-colors">
                                <StopCircle className="w-6 h-6" />
                            </button>
                        </div>
                    )}
                </GlassCard>

                {/* Manual Entry */}
                <GlassCard className="p-4">
                    <form onSubmit={handleManualSubmit} className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Enter Manual Ticket ID (e.g. HA26-001)"
                                value={manualId}
                                onChange={(e) => setManualId(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono placeholder:text-slate-600"
                            />
                        </div>
                        <NeonButton type="submit" disabled={loading}>
                            Go
                        </NeonButton>
                    </form>
                </GlassCard>

                {/* Recent History */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2 px-2">
                        <History className="w-4 h-4 text-slate-500" />
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recent Check-ins</span>
                    </div>

                    {recentScans.length === 0 ? (
                        <div className="py-8 text-center border border-dashed border-slate-800 rounded-lg">
                            <p className="text-slate-600 text-sm">No scans this session</p>
                        </div>
                    ) : (
                        recentScans.map((scan, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/50 border border-slate-800 rounded-lg animate-in fade-in slide-in-from-left-4">
                                <div>
                                    <p className="text-sm font-bold text-white">{scan.team}</p>
                                    <p className="text-xs text-slate-500 font-mono">{scan.id}</p>
                                </div>
                                <span className="text-xs font-mono text-cyan-400 bg-cyan-950/30 px-2 py-1 rounded">
                                    {scan.time.split(',')[1]}
                                </span>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
}
