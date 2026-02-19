import { useState } from 'react';
import { ParticleBackground } from '@/components/ui/particle-background';
import { GlassCard } from '@/components/ui/glass-card';
import { NeonButton } from '@/components/ui/neon-button';
import { Loader2, Cpu, Mail } from 'lucide-react';
import ky from 'ky';

import { GOOGLE_SCRIPT_API_URL } from '@/lib/config';
const DOMAIN = "Internet of Things";

// All 6 IoT Problem Statements (used to display after verification)
const iotProblems: Record<string, { id: string; icon: string; title: string; difficulty: number; difficultyLabel: string; problem: string; features: string[]; components: string }> = {
    'PS-1': {
        id: 'PS-1',
        icon: '🚰',
        title: 'Smart Water Management System',
        difficulty: 2,
        difficultyLabel: 'Beginner-Friendly',
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
        icon: '🌱',
        title: 'Smart Agriculture Monitoring System',
        difficulty: 2,
        difficultyLabel: 'Beginner-Friendly',
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
        icon: '🏥',
        title: 'Patient Health Monitoring & Emergency Alert System',
        difficulty: 3,
        difficultyLabel: 'Intermediate',
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
        icon: '🏠',
        title: 'Smart Home Energy Monitor & Optimizer',
        difficulty: 3,
        difficultyLabel: 'Intermediate',
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
        icon: '🚗',
        title: 'Smart Parking & Traffic Management System',
        difficulty: 4,
        difficultyLabel: 'Advanced',
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
        icon: '🏭',
        title: 'Industrial Safety & Environmental Monitoring System',
        difficulty: 4,
        difficultyLabel: 'Advanced',
        problem: 'Factories and labs face hazards from gas leaks, fires, and unsafe temperatures but lack affordable real-time monitoring. Build an IoT system that continuously monitors environmental safety parameters and triggers multi-level emergency responses.',
        features: [
            'Detect gas leaks (LPG/smoke), fire, and abnormal temperature',
            '3-level alert system: LED warning → Buzzer alarm → Dashboard emergency notification',
            'Automatic exhaust fan/ventilation activation on gas detection (via relay)',
            'Data logging with timestamp for compliance reports',
            'Live web dashboard with zone-wise safety status',
        ],
        components: 'MQ-2/MQ-5 gas sensor, Flame sensor, DHT11, Relay module, Buzzer, ESP32, Fan/servo',
    },
};

function DifficultyStars({ level }: { level: number }) {
    return (
        <span className="inline-flex gap-0.5">
            {[1, 2, 3, 4].map((i) => (
                <span key={i} className={i <= level ? 'text-yellow-400' : 'text-gray-600'}>⭐</span>
            ))}
        </span>
    );
}

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

                // Always send OTP for security
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

    // Try to find PS details from our local data
    const getPSDetails = () => {
        if (!problem) return null;
        // Match by PS number (e.g. problem.number = 1 → PS-1)
        const psKey = `PS-${problem.number}`;
        return iotProblems[psKey] || null;
    };

    const psDetails = getPSDetails();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 relative overflow-hidden flex flex-col items-center justify-center">
            <ParticleBackground />

            <div className="relative z-10 container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Cpu className="w-12 h-12 text-green-400" />
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                            IoT Domain
                        </h1>
                    </div>
                    <p className="text-slate-300 text-lg">Your Problem Statement Awaits</p>
                </div>

                <div className="max-w-2xl mx-auto">
                    {step === 'ticket' && (
                        <GlassCard className="p-8">
                            <h2 className="text-2xl font-bold text-white mb-6">Enter Your Ticket ID</h2>
                            <p className="text-slate-300 mb-6 text-sm">
                                Your problem statement was pre-selected during registration. Enter your ticket ID to view it.
                            </p>
                            <form onSubmit={handleTicketSubmit} className="space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        value={ticketId}
                                        onChange={(e) => setTicketId(e.target.value)}
                                        placeholder="HA26-001"
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-white text-lg focus:border-green-500 focus:outline-none"
                                        required
                                    />
                                </div>
                                {error && <p className="text-red-400 text-sm">{error}</p>}
                                <NeonButton type="submit" disabled={loading} className="w-full">
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Ticket'}
                                </NeonButton>
                            </form>
                        </GlassCard>
                    )}

                    {step === 'otp' && (
                        <GlassCard className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Mail className="w-8 h-8 text-green-400" />
                                <h2 className="text-2xl font-bold text-white">Enter OTP</h2>
                            </div>
                            <p className="text-slate-300 mb-6">
                                We've sent a 6-digit OTP to <strong>{leaderEmail}</strong>
                            </p>
                            <form onSubmit={handleOTPSubmit} className="space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="123456"
                                        maxLength={6}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-white text-2xl text-center tracking-widest focus:border-green-500 focus:outline-none"
                                        required
                                    />
                                </div>
                                {error && <p className="text-red-400 text-sm">{error}</p>}
                                <NeonButton type="submit" disabled={loading} className="w-full">
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify OTP'}
                                </NeonButton>
                            </form>
                        </GlassCard>
                    )}

                    {step === 'problem' && problem && (
                        <div className="w-full max-w-4xl mx-auto">
                            <GlassCard className="p-8">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-6 mb-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-3xl">{psDetails?.icon || '🔌'}</span>
                                        <h2 className="text-3xl font-bold text-white">
                                            {psDetails ? psDetails.id : `Problem #${problem.number}`}
                                        </h2>
                                        {psDetails && (
                                            <div className="ml-auto">
                                                <DifficultyStars level={psDetails.difficulty} />
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-white/90 text-sm uppercase tracking-wider">IoT Domain</p>
                                    {psDetails && (
                                        <p className="text-white/70 text-xs mt-1">{psDetails.difficultyLabel}</p>
                                    )}
                                </div>

                                {/* Title */}
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        {psDetails?.title || problem.title}
                                    </h3>
                                </div>

                                {/* Problem Description */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-2">Problem Statement</h4>
                                    <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-700">
                                        <p className="text-slate-300 leading-relaxed">
                                            {psDetails?.problem || problem.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Expected Features */}
                                {psDetails && (
                                    <div className="mb-6">
                                        <h4 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-2">Expected Features</h4>
                                        <ul className="space-y-2 bg-slate-900/50 rounded-lg p-5 border border-slate-700">
                                            {psDetails.features.map((f, i) => (
                                                <li key={i} className="flex items-start gap-2 text-slate-300">
                                                    <span className="text-green-400 mt-0.5">✓</span>
                                                    <span>{f}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Components */}
                                {psDetails && (
                                    <div className="mb-6">
                                        <h4 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-2">Suggested Components</h4>
                                        <p className="text-slate-400 text-sm bg-slate-900/50 rounded-lg px-5 py-3 border border-slate-700">
                                            {psDetails.components}
                                        </p>
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="mt-8 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                                    <p className="text-center text-green-300 text-sm">
                                        🎯 <strong>Good Luck!</strong> This is your assigned problem statement. Build something amazing!
                                    </p>
                                </div>
                            </GlassCard>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
