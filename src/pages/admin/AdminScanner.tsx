import { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { NeonButton } from '@/components/ui/neon-button';
import { GlassCard } from '@/components/ui/glass-card';
import { Loader2, CheckCircle2, XCircle, Search, Printer, History, Camera, StopCircle, PenTool, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

import { GOOGLE_SCRIPT_API_URL } from '@/lib/config';

export default function AdminScanner() {
    const [scanResult, setScanResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [manualId, setManualId] = useState('');
    const [recentScans, setRecentScans] = useState<any[]>([]);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [resetting, setResetting] = useState(false);


    // Signature States
    const [showSignaturePad, setShowSignaturePad] = useState(false);
    const [currentTicketId, setCurrentTicketId] = useState<string | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    // Refs
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().catch(e => console.error(e));
            }
        };
    }, []);

    // Initialize Canvas
    useEffect(() => {
        if (showSignaturePad && canvasRef.current) {
            const canvas = canvasRef.current;
            canvas.width = canvas.offsetWidth * 2;
            canvas.height = canvas.offsetHeight * 2;
            canvas.style.width = `${canvas.offsetWidth}px`;
            canvas.style.height = `${canvas.offsetHeight}px`;

            const context = canvas.getContext('2d');
            if (context) {
                context.scale(2, 2);
                context.lineCap = 'round';
                context.strokeStyle = '#06b6d4'; // Cyan color
                context.lineWidth = 2;
                contextRef.current = context;
            }
        }
    }, [showSignaturePad]);

    const startCamera = async () => {
        setCameraError(null);
        try {
            if (!scannerRef.current) {
                scannerRef.current = new Html5Qrcode("reader");
            }
            const scanner = scannerRef.current;

            let cameraId = null;
            try {
                const devices = await Html5Qrcode.getCameras();
                if (devices && devices.length > 0) {
                    const backCamera = devices.find(d => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('environment'));
                    cameraId = backCamera ? backCamera.id : devices[0].id;
                }
            } catch (e) {
                console.warn("Failed to get camera list, trying generic mode", e);
            }

            const config = {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            };

            if (cameraId) {
                await scanner.start(cameraId, config, onScanSuccess, undefined);
            } else {
                await scanner.start({ facingMode: "environment" }, config, onScanSuccess, undefined);
            }

            setScanning(true);

        } catch (err: any) {
            console.error("Camera Start Error:", err);
            setCameraError(err?.message || "Permission Denied: Could not access camera.");
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
        try {
            let ticketId = decodedText;
            if (decodedText.includes('ticketId=')) {
                ticketId = decodedText.split('ticketId=')[1];
            }

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
            // Just validate the ticket exists, don't mark attendance yet
            const response = await fetch(`${GOOGLE_SCRIPT_API_URL}?action=getTeamDetails&ticketId=${ticketId}`);
            const result = await response.json();

            if (result.result === 'success') {
                // Show signature pad - we'll mark attendance AFTER signature
                setCurrentTicketId(ticketId);
                setShowSignaturePad(true);
                setScanResult({ id: ticketId, team: result.teamName, status: 'pending_signature' });
            } else {
                setScanResult({ id: ticketId, status: 'error', message: result.message || 'Invalid Ticket' });
                setTimeout(() => {
                    setScanResult(null);
                    if (scannerRef.current) {
                        try { scannerRef.current.resume(); } catch (e) { console.warn(e) }
                    }
                }, 3000);
            }

        } catch (err) {
            setScanResult({ id: ticketId, status: 'error', message: "Network Error" });
            setTimeout(() => {
                setScanResult(null);
                if (scannerRef.current) {
                    try { scannerRef.current.resume(); } catch (e) { console.warn(e) }
                }
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (manualId) handleCheckIn(manualId);
    };

    const handleResetAttendance = async () => {
        const confirmed = window.confirm(
            "⚠️ WARNING: This will clear ALL attendance data (check-ins, timestamps, and signatures).\n\nRegistration data will NOT be affected.\n\nAre you sure you want to proceed?"
        );

        if (!confirmed) return;

        setResetting(true);
        try {
            const response = await fetch(`${GOOGLE_SCRIPT_API_URL}?action=resetAttendance`);
            const result = await response.json();

            if (result.result === 'success') {
                alert(`✅ Success! Cleared attendance data for ${result.rowsCleared} rows.`);
                setRecentScans([]); // Clear recent scans display
            } else {
                alert(`❌ Error: ${result.message || 'Failed to reset attendance'}`);
            }
        } catch (err) {
            console.error("Reset error:", err);
            alert("❌ Network error while resetting attendance");
        } finally {
            setResetting(false);
        }
    };

    // Signature Drawing Functions
    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!contextRef.current || !canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.nativeEvent.offsetX;
        const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.nativeEvent.offsetY;

        contextRef.current.beginPath();
        contextRef.current.moveTo(x, y);
        setIsDrawing(true);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !contextRef.current || !canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.nativeEvent.offsetX;
        const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.nativeEvent.offsetY;

        contextRef.current.lineTo(x, y);
        contextRef.current.stroke();
    };

    const stopDrawing = () => {
        if (!contextRef.current) return;
        contextRef.current.closePath();
        setIsDrawing(false);
    };

    const clearSignature = () => {
        if (!canvasRef.current || !contextRef.current) return;
        contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    };

    const submitSignature = async () => {
        if (!canvasRef.current || !currentTicketId) return;

        setLoading(true);
        try {
            const imageData = canvasRef.current.toDataURL('image/png');

            const response = await fetch(GOOGLE_SCRIPT_API_URL, {
                method: 'POST',
                body: JSON.stringify({
                    action: 'uploadSignature',
                    ticketId: currentTicketId,
                    image: imageData
                })
            });

            const result = await response.json();

            if (result.result === 'success') {
                // Update scan result to success with data from backend
                setScanResult({
                    id: currentTicketId,
                    team: result.teamName,
                    time: result.timestamp,
                    status: 'success'
                });
                setRecentScans(prev => [{
                    id: currentTicketId,
                    team: result.teamName,
                    time: result.timestamp,
                    status: 'success'
                }, ...prev]);

                // Close signature pad and resume scanning
                setTimeout(() => {
                    setShowSignaturePad(false);
                    setScanResult(null);
                    setCurrentTicketId(null);
                    if (scannerRef.current) {
                        try { scannerRef.current.resume(); } catch (e) { console.warn(e) }
                    }
                }, 2000);
            } else {
                // Show detailed error for debugging
                alert(`Backend Error:\n${JSON.stringify(result, null, 2)}`);
                setScanResult({ id: currentTicketId, status: 'error', message: result.message || 'Unknown error from backend' });
                setTimeout(() => {
                    setShowSignaturePad(false);
                    setScanResult(null);
                    setCurrentTicketId(null);
                    if (scannerRef.current) {
                        try { scannerRef.current.resume(); } catch (e) { console.warn(e) }
                    }
                }, 3000);
            }
        } catch (err) {
            console.error("Signature upload error:", err);
            alert(`Network Error:\n${err}`);
            setScanResult({ id: currentTicketId, status: 'error', message: "Failed to upload signature" });
        } finally {
            setLoading(false);
        }
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
                    <div className="flex gap-2">
                        <button
                            onClick={handleResetAttendance}
                            disabled={resetting}
                            className="p-2 bg-red-900/30 hover:bg-red-900/50 border border-red-700/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Reset Attendance"
                        >
                            {resetting ? (
                                <Loader2 className="w-5 h-5 text-red-400 animate-spin" />
                            ) : (
                                <RotateCcw className="w-5 h-5 text-red-400" />
                            )}
                        </button>
                        <Link to="/admin/participants">
                            <NeonButton variant="secondary" className="!p-2">
                                <span className="font-bold text-xs">LIST</span>
                            </NeonButton>
                        </Link>
                        <Link to="/admin/print">
                            <NeonButton variant="secondary" className="!p-2">
                                <Printer className="w-5 h-5" />
                            </NeonButton>
                        </Link>
                    </div>
                </div>

                {/* Main Scanner Card */}
                <GlassCard className="p-4 bg-slate-900/50 border-slate-800 relative overflow-hidden">

                    {/* Signature Pad Overlay */}
                    {showSignaturePad && (
                        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 bg-slate-950/95 backdrop-blur-md">
                            <PenTool className="w-12 h-12 text-cyan-400 mb-2" />
                            <h2 className="text-xl font-bold text-white mb-1">Digital Signature</h2>
                            <p className="text-slate-400 text-sm mb-4">{scanResult?.team}</p>

                            <div className="w-full bg-slate-900 border-2 border-cyan-500/30 rounded-lg p-2 mb-4">
                                <canvas
                                    ref={canvasRef}
                                    onMouseDown={startDrawing}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseLeave={stopDrawing}
                                    onTouchStart={startDrawing}
                                    onTouchMove={draw}
                                    onTouchEnd={stopDrawing}
                                    className="w-full h-40 bg-white rounded cursor-crosshair touch-none"
                                />
                            </div>

                            <div className="flex gap-2 w-full">
                                <NeonButton
                                    onClick={clearSignature}
                                    variant="secondary"
                                    className="flex-1 !py-2"
                                >
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    Clear
                                </NeonButton>
                                <NeonButton
                                    onClick={submitSignature}
                                    disabled={loading}
                                    className="flex-1 !py-2"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit'}
                                </NeonButton>
                            </div>
                        </div>
                    )}

                    {/* Active Overlay for Result */}
                    {scanResult && scanResult.status !== 'pending_signature' && (
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
                            <p className="text-red-400 text-sm font-bold block mb-2">{cameraError}</p>
                            <p className="text-slate-500 text-xs mb-4">Ensure you are using HTTPS and have allowed permissions.</p>
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
