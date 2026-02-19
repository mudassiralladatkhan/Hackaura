import { useState } from 'react';
import { ParticleBackground } from '@/components/ui/particle-background';
import { GlassCard } from '@/components/ui/glass-card';
import { NeonButton } from '@/components/ui/neon-button';
import { Loader2, Cpu, Mail, Target, Code, CheckCircle2, Wrench, ArrowLeft } from 'lucide-react';
import ky from 'ky';
import { Link } from 'react-router-dom';

import { GOOGLE_SCRIPT_API_URL } from '@/lib/config';
const DOMAIN = "Internet of Things";

// All 6 IoT Problem Statements (displayed after ticket verification)
const iotProblems: Record<string, { id: string; title: string; problem: string; features: string[]; components: string }> = {
    'PS-1': {
        id: 'PS-1',
        title: 'Smart Water Management System',
        problem: 'Water wastage is a major issue in colleges and residential areas. Build an IoT system that monitors water tank levels in real-time, detects overflow/leakage, and automatically controls the motor pump.',
        features: [
            'Ultrasonic sensor to measure water level',
            'Auto ON/OFF motor pump via relay module',
            'Real-time dashboard (web/mobile) showing water level %',
            'Alert notification when tank is full or level is critically low',
        ],
        components: 'Ultrasonic sensor, Relay module, ESP32/Arduino, Buzzer, LED indicators',
    },
    'PS-2': {
        id: 'PS-2',
        title: 'Smart Agriculture Monitoring System',
        problem: 'Small-scale farmers lack access to real-time crop health data. Build an IoT system that monitors soil and environmental conditions and provides actionable insights for better crop management.',
        features: [
            'Monitor soil moisture, temperature, and humidity',
            'Auto-irrigation trigger when soil moisture drops below threshold',
            'Web dashboard showing real-time sensor data with graphs',
            'Alert system for extreme weather conditions (too hot/dry/wet)',
        ],
        components: 'Soil moisture sensor, DHT11/22, Relay module, Water pump/servo, ESP32',
    },
    'PS-3': {
        id: 'PS-3',
        title: 'Patient Health Monitoring & Emergency Alert System',
        problem: 'In rural healthcare, continuous patient monitoring is expensive and unavailable. Build a wearable/portable IoT device that monitors vital signs and sends emergency alerts to doctors/family.',
        features: [
            'Monitor heart rate (pulse sensor) and body temperature',
            'Real-time data streaming to a web dashboard',
            'Emergency alert (buzzer + SMS/notification) if vitals go abnormal',
            'Data logging with timestamp for doctor review',
        ],
        components: 'Pulse/Heart rate sensor, Temperature sensor (LM35/DS18B20), Buzzer, ESP32, LED',
    },
    'PS-4': {
        id: 'PS-4',
        title: 'Smart Home Energy Monitor & Optimizer',
        problem: 'Households waste significant electricity due to lack of awareness about consumption patterns. Build an IoT system that monitors energy usage of appliances, identifies wastage, and suggests/automates power-saving actions.',
        features: [
            'Current sensor to measure power consumption of connected devices',
            'Real-time dashboard showing per-appliance energy usage',
            'Auto turn-off for idle appliances (via relay)',
            'Daily/weekly consumption reports with cost estimation',
            'Motion-based lighting control (optional)',
        ],
        components: 'ACS712 current sensor, Relay module, PIR motion sensor, ESP32, LED',
    },
    'PS-5': {
        id: 'PS-5',
        title: 'Smart Parking & Traffic Management System',
        problem: 'Urban areas face severe parking congestion because drivers can\'t find available spots. Build an IoT-based smart parking system that detects slot availability in real-time and guides drivers to the nearest free spot.',
        features: [
            'IR/Ultrasonic sensors at each parking slot to detect occupancy',
            'Live web dashboard showing parking map with available/occupied slots',
            'Entry/exit gate control using servo motor',
            'Counter displaying total available spots',
            'Bonus: Reservation system via web interface',
        ],
        components: 'IR sensors (multiple), Servo motor, LCD display (I2C), ESP32, LEDs (Red/Green per slot)',
    },
    'PS-6': {
        id: 'PS-6',
        title: 'Industrial Safety & Environmental Monitoring System',
        problem: 'Factories and labs face hazards from gas leaks, fires, and unsafe temperatures but lack affordable real-time monitoring. Build an IoT system that continuously monitors environmental safety parameters and triggers multi-level emergency responses.',
        features: [
            'Detect gas leaks (LPG/smoke), fire, and abnormal temperature',
            '3-level alert system: LED warning, Buzzer alarm, Dashboard emergency notification',
            'Automatic exhaust fan/ventilation activation on gas detection (via relay)',
            'Data logging with timestamp for compliance reports',
            'Live web dashboard with zone-wise safety status',
        ],
        components: 'MQ-2/MQ-5 gas sensor, Flame sensor, DHT11, Relay module, Buzzer, ESP32, Fan/servo',
    },
};

export default function IoT() {
    const [step, setStep] = useState<'ticket' | 'otp' | 'problem'>('ticket');
    const [ticketId, setTicketId] = useState('');
    const [otp, setOtp] = useState('');
    const [_teamName, setTeamName] = useState('');
    const [leaderEmail, setLeaderEmail] = useState('');
    const [_assignedProblem, setAssignedProblem] = useState<any>(null);
    const [problem, setProblem] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTicketSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await ky.get(GOOGLE_SCRIPT_API_URL, {
                searchParams: {
                    action: 'verifyDomainTicket',
                    ticketId: ticketId.trim(),
                    domain: DOMAIN
                },
                timeout: 30000
            }).json<any>();

            if (response.result === 'success') {
                setTeamName(response.teamName);
                setLeaderEmail(response.leaderEmail);
                setAssignedProblem(response.assignedProblem);
                await sendOTP();
            } else {
                setError(response.message || 'Verification failed');
            }
        } catch (err: any) {
            setError(err.message || 'Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const sendOTP = async () => {
        setLoading(true);
        try {
            const response = await ky.get(GOOGLE_SCRIPT_API_URL, {
                searchParams: {
                    action: 'sendOTP',
                    ticketId: ticketId.trim()
                },
                timeout: 30000
            }).json<any>();

            if (response.result === 'success') {
                setStep('otp');
            } else {
                setError(response.message || 'Failed to send OTP');
            }
        } catch (err) {
            setError('Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleOTPSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await ky.get(GOOGLE_SCRIPT_API_URL, {
                searchParams: {
                    action: 'verifyOTP',
                    ticketId: ticketId.trim(),
                    otp: otp.trim()
                },
                timeout: 30000
            }).json<any>();

            if (response.result === 'success') {
                if (_assignedProblem) {
                    await fetchAssignedProblem();
                    return;
                }

                try {
                    const assignResponse = await ky.get(GOOGLE_SCRIPT_API_URL, {
                        searchParams: {
                            action: 'assignProblem',
                            ticketId: ticketId.trim(),
                            problemNumber: '1'
                        },
                        timeout: 30000
                    }).json<any>();

                    if (assignResponse.result === 'success') {
                        await fetchAssignedProblem();
                    } else {
                        setError(assignResponse.message || 'Failed to assign default problem');
                    }
                } catch (assignErr) {
                    await fetchAssignedProblem();
                }
            } else {
                setError(response.message || 'Invalid OTP');
            }
        } catch (err) {
            setError('OTP verification failed');
        } finally {
            setLoading(false);
        }
    };

    const fetchAssignedProblem = async () => {
        setLoading(true);
        try {
            const response = await ky.get(GOOGLE_SCRIPT_API_URL, {
                searchParams: {
                    action: 'getAssignedProblem',
                    ticketId: ticketId.trim()
                },
                timeout: 30000
            }).json<any>();

            if (response.result === 'success') {
                setProblem(response.problem);
                setStep('problem');
            } else {
                setError('Failed to fetch problem details');
            }
        } catch (err) {
            setError('Failed to load problem');
        } finally {
            setLoading(false);
        }
    };

    // Match PS details from local data
    const getPSDetails = () => {
        if (!problem) return null;
        const psKey = `PS-${problem.number}`;
        return iotProblems[psKey] || null;
    };

    const psDetails = getPSDetails();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 relative overflow-hidden">
            <ParticleBackground />

            {/* Decorative gradient orbs */}
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-green-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 container mx-auto px-4 py-20">
                {/* Header */}
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-3 mb-6 px-5 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5">
                        <Cpu className="w-5 h-5 text-emerald-400" />
                        <span className="text-emerald-400 text-sm font-medium tracking-wide uppercase">Internet of Things</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-emerald-300 via-green-400 to-teal-300 bg-clip-text text-transparent">
                            IoT Domain
                        </span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-md mx-auto">
                        Verify your ticket to view your assigned problem statement
                    </p>
                </div>

                <div className="max-w-xl mx-auto">

                    {/* Step 1: Ticket ID */}
                    {step === 'ticket' && (
                        <GlassCard className="p-8 md:p-10">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                    <Cpu className="w-8 h-8 text-emerald-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Verify Your Ticket</h2>
                                <p className="text-slate-400 text-sm">
                                    Enter your Hackaura ticket ID to access your problem statement
                                </p>
                            </div>
                            <form onSubmit={handleTicketSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Ticket ID</label>
                                    <input
                                        type="text"
                                        value={ticketId}
                                        onChange={(e) => setTicketId(e.target.value)}
                                        placeholder="e.g. HA26-001"
                                        className="w-full bg-slate-900/80 border border-slate-700 rounded-xl p-4 text-white text-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 focus:outline-none transition-all placeholder:text-slate-600"
                                        required
                                    />
                                </div>
                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                                        <p className="text-red-400 text-sm">{error}</p>
                                    </div>
                                )}
                                <NeonButton type="submit" disabled={loading} className="w-full py-4 text-base">
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Verifying...
                                        </span>
                                    ) : 'Verify Ticket'}
                                </NeonButton>
                            </form>
                            <div className="mt-6 text-center">
                                <Link to="/" className="text-slate-500 hover:text-slate-300 text-sm transition-colors inline-flex items-center gap-1">
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    Back to Home
                                </Link>
                            </div>
                        </GlassCard>
                    )}

                    {/* Step 2: OTP Verification */}
                    {step === 'otp' && (
                        <GlassCard className="p-8 md:p-10">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                    <Mail className="w-8 h-8 text-emerald-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">OTP Verification</h2>
                                <p className="text-slate-400 text-sm">
                                    We've sent a 6-digit code to
                                </p>
                                <p className="text-emerald-400 font-medium mt-1">{leaderEmail}</p>
                            </div>
                            <form onSubmit={handleOTPSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Enter OTP</label>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="------"
                                        maxLength={6}
                                        className="w-full bg-slate-900/80 border border-slate-700 rounded-xl p-4 text-white text-2xl text-center tracking-[0.5em] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 focus:outline-none transition-all placeholder:text-slate-700"
                                        required
                                    />
                                </div>
                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                                        <p className="text-red-400 text-sm">{error}</p>
                                    </div>
                                )}
                                <NeonButton type="submit" disabled={loading} className="w-full py-4 text-base">
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Verifying...
                                        </span>
                                    ) : 'Verify OTP'}
                                </NeonButton>
                            </form>
                            <div className="mt-6 text-center">
                                <button
                                    onClick={() => { setStep('ticket'); setError(''); }}
                                    className="text-slate-500 hover:text-slate-300 text-sm transition-colors inline-flex items-center gap-1"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    Back to Ticket
                                </button>
                            </div>
                        </GlassCard>
                    )}

                    {/* Step 3: Problem Statement Display */}
                    {step === 'problem' && problem && (
                        <div className="max-w-3xl mx-auto">
                            <GlassCard className="p-0 overflow-hidden">
                                {/* Header Banner */}
                                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 md:p-8">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium mb-3 tracking-wide">
                                                {psDetails?.id || `Problem #${problem.number}`}
                                            </span>
                                            <h2 className="text-2xl md:text-3xl font-bold text-white">
                                                {psDetails?.title || problem.title}
                                            </h2>
                                        </div>
                                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                                            <Target className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <p className="text-white/70 text-sm mt-2 uppercase tracking-wider">IoT Domain — HACKAURA 2025</p>
                                </div>

                                {/* Content */}
                                <div className="p-6 md:p-8 space-y-6">
                                    {/* Problem Description */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <Code className="w-5 h-5 text-emerald-400" />
                                            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Problem Statement</h3>
                                        </div>
                                        <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-800">
                                            <p className="text-slate-300 leading-relaxed">
                                                {psDetails?.problem || problem.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Expected Features */}
                                    {psDetails && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                                <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Expected Features</h3>
                                            </div>
                                            <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-800">
                                                <ul className="space-y-3">
                                                    {psDetails.features.map((f, i) => (
                                                        <li key={i} className="flex items-start gap-3 text-slate-300">
                                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xs text-emerald-400 font-medium mt-0.5">
                                                                {i + 1}
                                                            </span>
                                                            <span>{f}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    {/* Suggested Components */}
                                    {psDetails && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <Wrench className="w-5 h-5 text-emerald-400" />
                                                <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Suggested Components</h3>
                                            </div>
                                            <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-800">
                                                <div className="flex flex-wrap gap-2">
                                                    {psDetails.components.split(', ').map((comp, i) => (
                                                        <span
                                                            key={i}
                                                            className="inline-block px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm"
                                                        >
                                                            {comp}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5 text-center">
                                        <p className="text-emerald-300 font-medium">Good Luck!</p>
                                        <p className="text-slate-400 text-sm mt-1">This is your assigned problem statement. Build something amazing!</p>
                                    </div>

                                    {/* Back button */}
                                    <div className="text-center pt-2">
                                        <Link to="/" className="text-slate-500 hover:text-slate-300 text-sm transition-colors inline-flex items-center gap-1">
                                            <ArrowLeft className="w-3.5 h-3.5" />
                                            Back to Home
                                        </Link>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
