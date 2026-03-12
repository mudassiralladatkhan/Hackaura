import { useState } from 'react';
import { ParticleBackground } from '@/components/ui/particle-background';
import { GlassCard } from '@/components/ui/glass-card';
import { NeonButton } from '@/components/ui/neon-button';
import { DiceRoll } from '@/components/DiceRoll';
import { ProblemDisplay } from '@/components/ProblemDisplay';
import { Loader2, Code2, Mail } from 'lucide-react';
import ky from 'ky';

import { GOOGLE_SCRIPT_API_URL } from '@/lib/config';
const DOMAIN = "Full Stack";

const FULLSTACK_PROBLEMS: Record<number, { number: number; title: string; description: string }> = {
    1: {
        number: 1,
        title: '"Mandi-Connect" — Direct Farm-to-Retail Logistics & Marketplace',
        description: `The Problem: Small-scale farmers in regions like Nipani often sell their produce to local middlemen at low prices because they lack a direct link to urban retailers or bulk buyers. Existing platforms are too complex and require high-speed internet, which is often unavailable in the fields.

The Task: Build a Low-Bandwidth, Offline-First Marketplace that:
• Allows farmers to list their harvests and set prices
• Enables retailers to place bulk orders directly
• Works with minimal internet connectivity
• Includes logistics coordination and payment integration via UPI`
    },
    2: {
        number: 2,
        title: '"Daksh-Bharat" — The Skill-Verified Rural Labor Exchange',
        description: `The Problem: In rural India, skilled laborers (plumbers, masons, electricians, solar technicians) struggle to find consistent work, while local businesses struggle to find verified, skilled talent. There is no digital "record of trust" or portfolio for the unorganized sector.

The Task: Create a Verified Skill-Portfolio Platform where:
• Rural workers can build a digital identity and showcase their skills
• Local businesses can search and verify skilled labor
• Completed jobs build a reputation score visible to future employers
• Connect workers with local job opportunities in their area`
    },
    3: {
        number: 3,
        title: '"Arogya-Vahini" — The Universal Rural Referral & Health Vault',
        description: `The Problem: In rural India, the referral process is broken. When a patient at a village Primary Health Center (PHC) is referred to a district hospital, they carry physical papers that often get lost or damaged. The city specialist has to restart all tests, wasting time and money.

The Task: Build a Secure, Token-Based Health Referral Portal that:
• Digitizes the patient journey from the village clinic to the specialist hospital
• Uses a secure token/QR to carry the patient's health summary
• Allows specialists to view the complete referral history
• Works offline and syncs when connectivity is available`
    }
};

export default function FullStack() {
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
            // Save the dice result to backend (fire and forget)
            await ky.get(GOOGLE_SCRIPT_API_URL, {
                searchParams: {
                    action: 'assignProblem',
                    ticketId: ticketId.trim(),
                    problemNumber: number.toString()
                },
                timeout: 30000
            }).json<any>();
        } catch {
            // Ignore backend errors — always show local PS
        } finally {
            // Always display local PS content immediately
            const idx = ((number - 1) % 3) + 1;
            setProblem(FULLSTACK_PROBLEMS[idx] || FULLSTACK_PROBLEMS[1]);
            setStep('problem');
            setLoading(false);
        }
    };

    const fetchAssignedProblem = async () => {
        // Use local PS data — bypass backend placeholder content
        if (_assignedProblem && typeof _assignedProblem === 'number') {
            const ps = FULLSTACK_PROBLEMS[_assignedProblem] || FULLSTACK_PROBLEMS[1];
            setProblem(ps);
            setStep('problem');
        } else {
            setStep('dice');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden flex flex-col items-center justify-center">
            <ParticleBackground />

            <div className="relative z-10 container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Code2 className="w-12 h-12 text-blue-400" />
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            Full Stack Domain
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
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-white text-lg focus:border-blue-500 focus:outline-none"
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
                                <Mail className="w-8 h-8 text-blue-400" />
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
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-white text-2xl text-center tracking-widest focus:border-blue-500 focus:outline-none"
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
                                Roll to discover your problem statement (1, 2, or 3)
                            </p>
                            <DiceRoll onRollComplete={handleDiceRoll} isLocked={false} maxFaces={3} />
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
