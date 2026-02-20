import { useState } from 'react';
import { NeonButton } from '@/components/ui/neon-button';
import { GlassCard } from '@/components/ui/glass-card';
import { Loader2, Github, FileText, Video, Link as LinkIcon, CheckCircle2, UploadCloud } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import ky from 'ky';

import { GOOGLE_SCRIPT_API_URL } from '@/lib/config';

interface SubmissionForm {
    title: string;
    description: string;
    pptLink?: string;
    pptFile?: string; // Base64
    pptFileName?: string;
    repoLink?: string;
    videoLink?: string;
    videoFile?: string; // Base64
    videoFileName?: string;
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
    const [pptSubmissionType, setPptSubmissionType] = useState<'link' | 'file'>('link');
    const [pptFile, setPptFile] = useState<File | null>(null);

    const [showVideo, setShowVideo] = useState(false);
    const [videoSubmissionType, setVideoSubmissionType] = useState<'link' | 'file'>('link');
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [showOther, setShowOther] = useState(false);

    // OTP State
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, setValue, formState: { errors, isSubmitting, isValidating } } = useForm<SubmissionForm>();

    const handleValidate = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidating(true);
        setError(null);
        try {
            // First check if ticket exists and send OTP
            const response = await ky.post(`${GOOGLE_SCRIPT_API_URL}?action=sendOTP&ticketId=${ticketId}&type=submission`, {
                body: JSON.stringify({
                    action: 'sendOTP',
                    ticketId: ticketId,
                    type: 'submission'
                })
            }).json<any>();

            if (response.result === 'success') {
                setShowOtpInput(true);
            } else {
                setError(response.message);
            }
        } catch (error) {
            setError('Network error. Please try again.');
        } finally {
            setValidating(false);
        }
    };

    const handleVerifyOtp = async () => {
        setValidating(true);
        setError(null);
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
                // Fetch team name and problem title for display and pre-fill
                const teamResponse = await ky.get(`${GOOGLE_SCRIPT_API_URL}?action=getTeamDetails&ticketId=${ticketId}`).json<any>();
                if (teamResponse.result === 'success') {
                    setTeamName(teamResponse.teamName);

                    // Pre-fill the project title if a problem statement exists
                    if (teamResponse.problemTitle) {
                        const iotMap: Record<string, string> = {
                            "Internet of Things Problem Statement 1": "Smart Water Management System",
                            "Internet of Things Problem Statement 2": "Smart Agriculture Monitoring System",
                            "Internet of Things Problem Statement 3": "Patient Health Monitoring & Emergency Alert",
                            "Internet of Things Problem Statement 4": "Smart Home Energy Monitor & Optimizer",
                            "Internet of Things Problem Statement 5": "Smart Parking & Traffic Management",
                            "Internet of Things Problem Statement 6": "Industrial Safety & Environmental Monitoring"
                        };

                        const displayTitle = iotMap[teamResponse.problemTitle] || teamResponse.problemTitle;
                        setValue('title', displayTitle);
                    }

                    setStep('form');
                }
            } else {
                setError('Invalid OTP. Please try again.');
            }
        } catch (error) {
            setError('Verification failed. Please check your connection.');
        } finally {
            setValidating(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 1024 * 1024 * 1024) { // 1GB limit
                alert("File size exceeds 1GB limit.");
                return;
            }
            setPptFile(file);
        }
    };

    const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 1024 * 1024 * 1024) { // 1GB limit
                alert("File size exceeds 1GB limit.");
                return;
            }
            setVideoFile(file);
        }
    };

    const onSubmit = async (data: SubmissionForm) => {
        setSubmitting(true);
        try {
            let pptBase64 = '';
            let videoBase64 = '';

            if (pptSubmissionType === 'file' && pptFile) {
                pptBase64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(pptFile);
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = error => reject(error);
                });
            }

            if (videoSubmissionType === 'file' && videoFile) {
                videoBase64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(videoFile);
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = error => reject(error);
                });
            }

            const payload = {
                action: 'submitProject',
                ticketId,
                ...data,
                pptSubmissionType,
                pptFile: pptBase64,
                pptFileName: pptFile?.name || '',
                videoSubmissionType,
                videoFile: videoBase64,
                videoFileName: videoFile?.name || ''
            };

            const response = await ky.post(GOOGLE_SCRIPT_API_URL, {
                body: JSON.stringify(payload),
                timeout: 180000 // 3 minute timeout for large uploads
            }).json<any>();

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
                            <p className="text-slate-400 mb-6">Enter your Team ID to start your submission.</p>

                            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 mb-2 text-left">
                                <h3 className="text-cyan-400 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" /> Submission Prerequisites
                                </h3>
                                <ul className="text-xs text-slate-400 space-y-1 list-disc pl-4">
                                    <li>Your team must be <span className="text-cyan-300 font-semibold">Checked In</span> at the registration desk.</li>
                                    <li>You must have a <span className="text-cyan-300 font-semibold">Problem Statement</span> assigned via your domain page.</li>
                                </ul>
                            </div>
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

                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 animate-in fade-in slide-in-from-top-2">
                                        <p className="text-red-400 text-sm text-center font-medium">{error}</p>
                                    </div>
                                )}

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

                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 animate-in fade-in slide-in-from-top-2">
                                        <p className="text-red-400 text-sm text-center font-medium">{error}</p>
                                    </div>
                                )}

                                <NeonButton
                                    onClick={handleVerifyOtp}
                                    variant="primary"
                                    className="w-full !py-4 text-lg"
                                    disabled={validating || otp.length !== 6}
                                >
                                    {validating ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Verify Code'}
                                </NeonButton>

                                <button
                                    onClick={() => {
                                        setShowOtpInput(false);
                                        setError(null);
                                    }}
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
                                    <div className="animate-in slide-in-from-top-2 border border-orange-500/30 bg-orange-500/5 rounded-lg p-4">
                                        <label className="block text-sm font-medium text-orange-300 mb-3">Presentation (PPT / PDF)</label>

                                        <div className="flex gap-4 mb-4">
                                            <button
                                                type="button"
                                                onClick={() => setPptSubmissionType('link')}
                                                className={`px-4 py-2 rounded-md text-sm transition-colors ${pptSubmissionType === 'link' ? 'bg-orange-500 text-black font-bold' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                                            >
                                                Submit Link
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setPptSubmissionType('file')}
                                                className={`px-4 py-2 rounded-md text-sm transition-colors ${pptSubmissionType === 'file' ? 'bg-orange-500 text-black font-bold' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                                            >
                                                Upload File
                                            </button>
                                        </div>

                                        {pptSubmissionType === 'link' ? (
                                            <div>
                                                <input
                                                    {...register('pptLink')}
                                                    placeholder="https://docs.google.com/presentation/..."
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-orange-500 focus:outline-none"
                                                />
                                                <p className="text-xs text-slate-500 mt-1">Please ensure link sharing is turned ON.</p>
                                            </div>
                                        ) : (
                                            <div>
                                                <input
                                                    type="file"
                                                    accept=".pdf, .ppt, .pptx"
                                                    onChange={handleFileChange}
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-orange-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-black hover:file:bg-orange-400"
                                                />
                                                <p className="text-xs text-slate-500 mt-1">Max file size: 1GB.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {showVideo && (
                                    <div className="animate-in slide-in-from-top-2 border border-red-500/30 bg-red-500/5 rounded-lg p-4">
                                        <label className="block text-sm font-medium text-red-300 mb-3">Video Demo</label>

                                        <div className="flex gap-4 mb-4">
                                            <button
                                                type="button"
                                                onClick={() => setVideoSubmissionType('link')}
                                                className={`px-4 py-2 rounded-md text-sm transition-colors ${videoSubmissionType === 'link' ? 'bg-red-500 text-black font-bold' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                                            >
                                                Submit Link
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setVideoSubmissionType('file')}
                                                className={`px-4 py-2 rounded-md text-sm transition-colors ${videoSubmissionType === 'file' ? 'bg-red-500 text-black font-bold' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                                            >
                                                Upload File
                                            </button>
                                        </div>

                                        {videoSubmissionType === 'link' ? (
                                            <div>
                                                <input
                                                    {...register('videoLink')}
                                                    placeholder="https://youtube.com/..."
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none"
                                                />
                                            </div>
                                        ) : (
                                            <div>
                                                <input
                                                    type="file"
                                                    accept="video/*, .mp4, .mov"
                                                    onChange={handleVideoFileChange}
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-500 file:text-black hover:file:bg-red-400"
                                                />
                                                <p className="text-xs text-slate-500 mt-1">Max file size: 1GB.</p>
                                            </div>
                                        )}
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
                                disabled={submitting || isSubmitting || isValidating}
                            >
                                {submitting || isSubmitting || isValidating ? (
                                    <span className="flex items-center gap-2 justify-center">
                                        <Loader2 className="w-6 h-6 animate-spin" /> {isValidating ? 'Checking...' : 'Submitting...'}
                                    </span>
                                ) : 'Submit Project'}
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
