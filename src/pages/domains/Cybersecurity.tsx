import { useState } from 'react';
import { ParticleBackground } from '@/components/ui/particle-background';
import { GlassCard } from '@/components/ui/glass-card';
import { NeonButton } from '@/components/ui/neon-button';
import { DiceRoll } from '@/components/DiceRoll';
import { ProblemDisplay } from '@/components/ProblemDisplay';
import { Loader2, Shield, Mail } from 'lucide-react';
import ky from 'ky';

import { GOOGLE_SCRIPT_API_URL } from '@/lib/config';
const DOMAIN = "Cybersecurity";

export default function Cybersecurity() {
    const [step, setStep] = useState<'ticket' | 'otp' | 'dice' | 'problem'>('ticket');
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
                } else {
                    setStep('dice');
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

    const handleDiceRoll = async (number: number) => {
        setLoading(true);
        setError('');

        try {
            const assignResponse = await ky.get(GOOGLE_SCRIPT_API_URL, {
                searchParams: {
                    action: 'assignProblem',
                    ticketId: ticketId.trim(),
                    problemNumber: number
                },
                timeout: 30000
            }).json<any>();

            if (assignResponse.result === 'success') {
                await fetchAssignedProblem();
            } else {
                setError(assignResponse.message || 'Failed to assign problem');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to save dice result');
        } finally {
            setLoading(false);
        }
    };

    const fetchAssignedProblem = async () => {
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
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 relative overflow-hidden flex flex-col items-center justify-center">
            <ParticleBackground />

            <div className="relative z-10 container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Shield className="w-12 h-12 text-red-400" />
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                            Cybersecurity Domain
                        </h1>
                    </div>
                    <p className="text-slate-300 text-lg">Discover Your Problem Statement</p>
                </div>

                <div className="max-w-2xl mx-auto">
                    {step === 'ticket' && (
                        <GlassCard className="p-8">
                            <h2 className="text-2xl font-bold text-white mb-6">Enter Your Ticket ID</h2>
                            <form onSubmit={handleTicketSubmit} className="space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        value={ticketId}
                                        onChange={(e) => setTicketId(e.target.value)}
                                        placeholder="HA26-001"
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-white text-lg focus:border-red-500 focus:outline-none"
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
                                <Mail className="w-8 h-8 text-red-400" />
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
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-white text-2xl text-center tracking-widest focus:border-red-500 focus:outline-none"
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

                    {step === 'dice' && (
                        <GlassCard className="p-8">
                            <h2 className="text-3xl font-bold text-white mb-4 text-center">Roll the Dice!</h2>
                            <p className="text-slate-300 mb-8 text-center">
                                Roll the dice to discover your problem statement (1-6)
                            </p>
                            <DiceRoll onRollComplete={handleDiceRoll} isLocked={false} />
                            {error && <p className="text-red-400 text-sm text-center mt-4">{error}</p>}
                        </GlassCard>
                    )}

                    {step === 'problem' && problem && (
                        <ProblemDisplay problem={problem} domain={DOMAIN} />
                    )}
                </div>
            </div>
        </div>
    );
}
