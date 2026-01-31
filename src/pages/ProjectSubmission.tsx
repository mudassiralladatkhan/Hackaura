import { useState } from 'react';
import { NeonButton } from '@/components/ui/neon-button';
import { GlassCard } from '@/components/ui/glass-card';
import { Loader2, Github, FileText, Video, Link as LinkIcon, CheckCircle2, UploadCloud } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import ky from 'ky';

const GOOGLE_SCRIPT_API_URL = "https://script.google.com/macros/s/AKfycbzxnQ42GCK01NcH2egkcko9GTv8p0DYG_OWnou70esO0DUzkgnBsQcgd9OLNjO8YBk3/exec";

interface SubmissionForm {
    title: string;
    description: string;
    pptLink?: string;
    repoLink?: string;
    videoLink?: string;
    otherLinks?: string;
}

export default function ProjectSubmission() {
    const [step, setStep] = useState<'validate' | 'form' | 'success'>('validate');
    const [ticketId, setTicketId] = useState('');
    const [validating, setValidating] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [teamName, setTeamName] = useState('');

    const [showRepo, setShowRepo] = useState(false);
    const [showPPT, setShowPPT] = useState(false);
    const [showVideo, setShowVideo] = useState(false);
    const [showOther, setShowOther] = useState(false);

    // OTP State
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<SubmissionForm>();

    const handleValidate = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidating(true);
        try {
            // First check if ticket exists and send OTP
            const response = await ky.post(`${GOOGLE_SCRIPT_API_URL}?action=sendOTP&ticketId=${ticketId}`, {
                body: JSON.stringify({
                    action: 'sendOTP',
                    ticketId: ticketId
                })
            }).json<any>();

            if (response.result === 'success') {
                setShowOtpInput(true);
            } else {
                alert('Validation failed: ' + response.message);
            }
        } catch (error) {
            alert('Network error. Please try again.');
        } finally {
            setValidating(false);
        }
    };

    const handleVerifyOtp = async () => {
        setValidating(true);
        try {
            // Updated to send Params in URL (for doGet fallback) AND Body (for doPost)
            const response = await ky.post(`${GOOGLE_SCRIPT_API_URL}?action=verifyOTP&ticketId=${ticketId}&otp=${otp}`, {
                body: JSON.stringify({
                    action: 'verifyOTP',
                    ticketId: ticketId,
                    otp: otp
                })
            }).json<any>();

            if (response.result === 'success') {
                // Fetch team name for display
                const teamResponse = await ky.get(`${GOOGLE_SCRIPT_API_URL}?action=getTeamDetails&ticketId=${ticketId}`).json<any>();
                if (teamResponse.result === 'success') {
                    setTeamName(teamResponse.teamName);
                    setStep('form');
                }
            } else {
                alert('Invalid OTP. Please try again.');
            }
        } catch (error) {
            alert('Verification failed. Please check your connection.');
        } finally {
            setValidating(false);
        }
    };

    const onSubmit = async (data: SubmissionForm) => {
        setSubmitting(true);
        try {
            const payload = {
                action: 'submitProject',
                ticketId,
                ...data
            };

            const response = await ky.post(GOOGLE_SCRIPT_API_URL, { body: JSON.stringify(payload) }).json<any>();

            if (response.result === 'success') {
                setStep('success');
            } else {
                alert('Submission failed: ' + response.message);
            }
        } catch (error) {
            alert('Network error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-foreground p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full"></div>

            <div className="w-full max-w-2xl relative z-10">
                <Link to="/" className="inline-block mb-8 text-slate-400 hover:text-white transition-colors">
                    &larr; Back to Home
                </Link>

                {step === 'validate' && (
                    <GlassCard className="p-8 border-cyan-500/30 animate-in fade-in zoom-in duration-500">
                        <div className="text-center mb-8">
                            <UploadCloud className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                            <h1 className="text-3xl font-bold text-white mb-2">Project Submission</h1>
                            <p className="text-slate-400">Enter your Team ID to start your submission.</p>
                        </div>

                        {!showOtpInput ? (
                            <form onSubmit={handleValidate} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Team Ticket ID</label>
                                    <input
                                        type="text"
                                        placeholder="HA26-XXX"
                                        value={ticketId}
                                        onChange={(e) => setTicketId(e.target.value.toUpperCase())}
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-center text-2xl tracking-widest font-mono text-white focus:outline-none focus:border-cyan-500 transition-colors uppercase placeholder:text-slate-700"
                                        required
                                    />
                                </div>
                                <NeonButton
                                    type="submit"
                                    variant="primary"
                                    className="w-full !py-4 text-lg"
                                    disabled={validating || !ticketId}
                                >
                                    {validating ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Send OTP'}
                                </NeonButton>
                            </form>
                        ) : (
                            <div className="space-y-6 animate-in slide-in-from-right">
                                <div className="text-center">
                                    <p className="text-sm text-green-400 mb-2">OTP Sent to Leader's Email!</p>
                                    <p className="text-xs text-slate-500">Please check your inbox/spam folder.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Enter OTP Code</label>
                                    <input
                                        type="text"
                                        placeholder="XXXXXX"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').substring(0, 6))}
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-center text-3xl tracking-[1em] font-mono text-white focus:outline-none focus:border-green-500 transition-colors placeholder:text-slate-700"
                                        required
                                    />
                                </div>
                                <NeonButton
                                    onClick={handleVerifyOtp}
                                    variant="primary"
                                    className="w-full !py-4 text-lg"
                                    disabled={validating || otp.length !== 6}
                                >
                                    {validating ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Verify Code'}
                                </NeonButton>
                                <button
                                    onClick={() => setShowOtpInput(false)}
                                    className="w-full text-center text-sm text-slate-500 hover:text-white transition-colors"
                                >
                                    Change Ticket ID
                                </button>
                            </div>
                        )}
                    </GlassCard>
                )}

                {step === 'form' && (
                    <GlassCard className="p-8 border-purple-500/30 animate-in slide-in-from-right duration-500">
                        <div className="mb-6 pb-6 border-b border-slate-800">
                            <h2 className="text-xl font-bold text-white">submit as: <span className="text-cyan-400">{teamName}</span></h2>
                            <p className="text-slate-500 text-sm">Ticket ID: {ticketId}</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Core Info */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Project Title <span className="text-red-400">*</span></label>
                                    <input
                                        {...register('title', { required: true })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none"
                                        placeholder="e.g. AI Waste Sorter"
                                    />
                                    {errors.title && <span className="text-red-400 text-xs">Title is required</span>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Description / Abstract <span className="text-red-400">*</span></label>
                                    <textarea
                                        {...register('description', { required: true })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white h-32 focus:border-purple-500 focus:outline-none"
                                        placeholder="Briefly describe your project..."
                                    />
                                    {errors.description && <span className="text-red-400 text-xs">Description is required</span>}
                                </div>
                            </div>

                            {/* Dynamic Toggles */}
                            <div className="py-4">
                                <label className="block text-sm font-medium text-slate-300 mb-3">What are you submitting? (Select all that apply)</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <button type="button" onClick={() => setShowRepo(!showRepo)} className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${showRepo ? 'bg-purple-500/20 border-purple-500 text-purple-300' : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500'}`}>
                                        <Github className="w-6 h-6" />
                                        <span className="text-xs font-bold">Code / Repo</span>
                                    </button>
                                    <button type="button" onClick={() => setShowPPT(!showPPT)} className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${showPPT ? 'bg-orange-500/20 border-orange-500 text-orange-300' : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500'}`}>
                                        <FileText className="w-6 h-6" />
                                        <span className="text-xs font-bold">PPT / Slides</span>
                                    </button>
                                    <button type="button" onClick={() => setShowVideo(!showVideo)} className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${showVideo ? 'bg-red-500/20 border-red-500 text-red-300' : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500'}`}>
                                        <Video className="w-6 h-6" />
                                        <span className="text-xs font-bold">Video Demo</span>
                                    </button>
                                    <button type="button" onClick={() => setShowOther(!showOther)} className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${showOther ? 'bg-green-500/20 border-green-500 text-green-300' : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500'}`}>
                                        <LinkIcon className="w-6 h-6" />
                                        <span className="text-xs font-bold">Other Link</span>
                                    </button>
                                </div>
                            </div>

                            {/* Dynamic Fields */}
                            <div className="space-y-4 animate-in fade-in">
                                {showRepo && (
                                    <div className="animate-in slide-in-from-top-2">
                                        <label className="block text-sm font-medium text-purple-300 mb-1">GitHub / GitLab Repository Link</label>
                                        <input {...register('repoLink')} placeholder="https://github.com/..." className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none" />
                                    </div>
                                )}
                                {showPPT && (
                                    <div className="animate-in slide-in-from-top-2">
                                        <label className="block text-sm font-medium text-orange-300 mb-1">Presentation Link (Google Slides / Drive / Canva)</label>
                                        <input {...register('pptLink')} placeholder="https://docs.google.com/presentation/..." className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-orange-500 focus:outline-none" />
                                        <p className="text-xs text-slate-500 mt-1">Please ensure link sharing is turned ON.</p>
                                    </div>
                                )}
                                {showVideo && (
                                    <div className="animate-in slide-in-from-top-2">
                                        <label className="block text-sm font-medium text-red-300 mb-1">Video Demo Link (YouTube / Drive)</label>
                                        <input {...register('videoLink')} placeholder="https://youtube.com/..." className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none" />
                                    </div>
                                )}
                                {showOther && (
                                    <div className="animate-in slide-in-from-top-2">
                                        <label className="block text-sm font-medium text-green-300 mb-1">Other Link (Figma / Live Site / Drive Folder)</label>
                                        <input {...register('otherLinks')} placeholder="https://..." className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-green-500 focus:outline-none" />
                                    </div>
                                )}
                            </div>

                            <NeonButton
                                type="submit"
                                variant="primary"
                                className="w-full !py-4 text-lg mt-8"
                                disabled={submitting}
                            >
                                {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Submit Project'}
                            </NeonButton>
                        </form>
                    </GlassCard>
                )}

                {step === 'success' && (
                    <GlassCard className="p-12 border-green-500/50 text-center animate-in zoom-in duration-500">
                        <div className="inline-flex items-center justify-center p-4 rounded-full bg-green-500/10 mb-6">
                            <CheckCircle2 className="w-16 h-16 text-green-500" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Submission Received!</h2>
                        <p className="text-slate-400 mb-8">Your project details have been successfully recorded.</p>

                        <div className="flex gap-4 justify-center">
                            <Link to="/">
                                <NeonButton variant="secondary">Back to Home</NeonButton>
                            </Link>
                        </div>
                    </GlassCard>
                )}
            </div>
        </div>
    );
}
