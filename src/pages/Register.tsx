import { useState, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ChevronLeft, Plus, Trash2, Send, Loader2, Users, School, User, Mail, Phone, Upload, X, CreditCard, AlertTriangle, CheckCircle2, Download, XCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { NeonButton } from '@/components/ui/neon-button';
import { GlassCard } from '@/components/ui/glass-card';
import { ParticleBackground } from '@/components/ui/particle-background';
import { toast } from 'sonner';
import { analyzePaymentScreenshot, type PaymentVerificationResult } from '@/lib/paymentOCR';
import { PaymentVerificationBadge } from '@/components/ui/PaymentVerificationBadge';

import { GOOGLE_SCRIPT_API_URL, GOOGLE_FORM_ACTION_URL, GOOGLE_FORM_ENTRY_IDS } from '@/lib/config';

// Generic Duplicate Checker Helper



// Generic Duplicate Checker Helper
const checkUnique = async (value: string, type: 'teamName' | 'email' | 'phone') => {
    if (!value || value.length < 3 || !GOOGLE_SCRIPT_API_URL) return true;
    try {
        // Updated to use explicit action=checkUnique to avoid "Invalid params" error
        const param = type === 'teamName' ? 'teamName' : type;
        const response = await fetch(`${GOOGLE_SCRIPT_API_URL}?action=checkUnique&type=${param}&value=${encodeURIComponent(value)}`);
        const data = await response.json();
        return !data.exists;
    } catch (error) {
        console.error(`Failed to check ${type}`, error);
        return true;
    }
};

const memberSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
});

const formSchema = z.object({
    teamName: z.string()
        .min(3, "Team name must be at least 3 characters")
        .refine(async (val) => await checkUnique(val, 'teamName'), "This team name is already taken"),
    domain: z.string().min(1, "Please select a domain"),
    problemStatement: z.string().optional(),
    collegeName: z.string().min(3, "College name is required"),
    leaderName: z.string().min(2, "Leader name is required"),
    leaderEmail: z.string()
        .email("Invalid leader email")
        .refine(async (val) => await checkUnique(val, 'email'), "This email is already registered"),
    leaderPhone: z.string()
        .regex(/^\d{10}$/, "Phone number must be 10 digits")
        .refine(async (val) => await checkUnique(val, 'phone'), "This phone number is already registered"),
    members: z.array(memberSchema).max(3, "Max 3 additional members"),
}).superRefine((data, ctx) => {
    if (data.domain === 'Internet of Things' && !data.problemStatement) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select a problem statement for IoT",
            path: ["problemStatement"]
        });
    }
});

type FormData = z.infer<typeof formSchema>;

export default function Register() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
    const [ocrVerificationStatus, setOcrVerificationStatus] = useState<'idle' | 'analyzing' | 'success' | 'failed'>('idle');
    const [ocrResults, setOcrResults] = useState<PaymentVerificationResult | null>(null);
    const [extractedUTR, setExtractedUTR] = useState<string | null>(null);

    const { register, control, handleSubmit, watch, formState: { errors, isSubmitting: formSubmitting, isValidating } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        mode: 'onBlur',
        defaultValues: {
            teamName: '',
            domain: '',
            problemStatement: '',
            collegeName: '',
            leaderName: '',
            leaderEmail: '',
            leaderPhone: '',
            members: [],
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "members"
    });

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setPaymentScreenshot(file);
            setOcrVerificationStatus('analyzing');
            setOcrResults(null);
            toast.info("Analyzing screenshot...", {
                description: "Please wait while we verify your payment."
            });

            // Perform OCR analysis
            try {
                const result = await analyzePaymentScreenshot(file, 600);
                setOcrResults(result);

                if (result.isValid) {
                    // Extract UTR and check for duplicates
                    const utr = result.details.transactionId || null;
                    setExtractedUTR(utr);

                    if (utr) {
                        // Check if this UTR has already been used
                        toast.info("Checking transaction ID...", { description: "Verifying UTR is not already used." });
                        try {
                            const checkResponse = await fetch(
                                `${GOOGLE_SCRIPT_API_URL}?action=checkUTR&utr=${encodeURIComponent(utr)}`
                            );
                            const checkResult = await checkResponse.json();

                            if (checkResult.exists) {
                                const duplicateMsg = `⚠️ Duplicate Payment Detected!\n\nThis transaction (UTR: ${utr}) has already been used${checkResult.teamName ? ` by team "${checkResult.teamName}"` : ''}.\n\nPlease make a new payment and upload a fresh screenshot.`;
                                setOcrVerificationStatus('failed');
                                setOcrResults({
                                    isValid: false,
                                    confidence: 'high',
                                    details: {
                                        amountDetected: false,
                                        statusDetected: false,
                                        upiIdDetected: false,
                                        suspiciousPatterns: ['Duplicate UTR detected'],
                                    },
                                    errorMessage: duplicateMsg,
                                });
                                setPaymentScreenshot(null);
                                setExtractedUTR(null);
                                toast.error("Duplicate Payment Detected!", {
                                    description: `This transaction (UTR: ${utr}) has already been used${checkResult.teamName ? ` by ${checkResult.teamName}` : ''}. Please use a different payment.`,
                                    duration: 8000
                                });
                                return;
                            }
                        } catch (checkError) {
                            console.warn('UTR check failed, continuing:', checkError);
                            // Don't block registration if UTR check fails
                        }
                    }

                    setOcrVerificationStatus('success');
                    toast.success("Payment Verified!", {
                        description: utr ? `Screenshot verified. UTR: ${utr}` : "Screenshot verified successfully."
                    });
                } else {
                    setOcrVerificationStatus('failed');
                    // Clear the screenshot so user can upload a new one
                    setPaymentScreenshot(null);
                    setExtractedUTR(null);
                    toast.error("Verification Failed", {
                        description: result.errorMessage || "Could not verify payment details."
                    });
                }
            } catch (error) {
                console.error('OCR Error:', error);
                setOcrVerificationStatus('failed');
                // Clear the screenshot so user can upload a new one
                setPaymentScreenshot(null);
                setExtractedUTR(null);
                setOcrResults({
                    isValid: false,
                    confidence: 'low',
                    details: {
                        amountDetected: false,
                        statusDetected: false,
                        upiIdDetected: false,
                        suspiciousPatterns: ['OCR processing failed'],
                    },
                    errorMessage: 'Failed to analyze screenshot. Please try again.'
                });
                toast.error("Analysis Failed", {
                    description: "Could not analyze screenshot. Please try uploading again."
                });
            }
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png']
        },
        maxFiles: 1,
        multiple: false
    });

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);

        if (!paymentScreenshot) {
            toast.error("Payment Screenshot Required", {
                description: "Please upload a screenshot of your payment."
            });
            setIsSubmitting(false);
            return;
        }

        // Check OCR verification status
        if (ocrVerificationStatus !== 'success') {
            toast.error("Payment Verification Required", {
                description: "Please upload a valid payment screenshot showing ₹600 payment with success status."
            });
            setIsSubmitting(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append(GOOGLE_FORM_ENTRY_IDS.TEAM_NAME, data.teamName);
            formData.append(GOOGLE_FORM_ENTRY_IDS.COLLEGE_NAME, data.collegeName);
            formData.append(GOOGLE_FORM_ENTRY_IDS.LEADER_NAME, data.leaderName);
            formData.append(GOOGLE_FORM_ENTRY_IDS.LEADER_EMAIL, data.leaderEmail);
            formData.append(GOOGLE_FORM_ENTRY_IDS.LEADER_PHONE, data.leaderPhone);
            // Append Domain
            formData.append(GOOGLE_FORM_ENTRY_IDS.DOMAIN, data.domain);
            if (data.domain === 'Internet of Things' && data.problemStatement) {
                formData.append(GOOGLE_FORM_ENTRY_IDS.PROBLEM_STATEMENT, data.problemStatement);
            }

            // Map members to individual fields
            if (data.members[0]) {
                formData.append(GOOGLE_FORM_ENTRY_IDS.MEMBER_1, `${data.members[0].name} (${data.members[0].email})`);
            }
            if (data.members[1]) {
                formData.append(GOOGLE_FORM_ENTRY_IDS.MEMBER_2, `${data.members[1].name} (${data.members[1].email})`);
            }
            if (data.members[2]) {
                formData.append(GOOGLE_FORM_ENTRY_IDS.MEMBER_3, `${data.members[2].name} (${data.members[2].email})`);
            }

            // Payment Proof - Include OCR Verification Status AND Upload URL
            let paymentUrl = "Upload Failed";
            try {
                if (paymentScreenshot) {
                    toast.info("Uploading Screenshot...", { description: "Saving your payment proof." });

                    // Convert to Base64
                    const reader = new FileReader();
                    const base64Promise = new Promise<string>((resolve, reject) => {
                        reader.onload = () => resolve(reader.result as string);
                        reader.onerror = reject;
                        reader.readAsDataURL(paymentScreenshot);
                    });
                    const base64Image = await base64Promise;

                    // Upload to Script
                    const uploadResponse = await fetch(`${GOOGLE_SCRIPT_API_URL}`, {
                        method: 'POST',
                        body: JSON.stringify({
                            action: 'uploadPaymentProof',
                            teamName: data.teamName,
                            image: base64Image
                        })
                    });
                    const uploadResult = await uploadResponse.json();

                    if (uploadResult.result === 'success') {
                        paymentUrl = uploadResult.url;
                        toast.success("Screenshot Uploaded");
                    } else {
                        console.error("Upload failed:", uploadResult);
                        toast.error("Screenshot Upload Failed", { description: "Continuing with registration..." });
                    }
                }
            } catch (e) {
                console.error("Upload Error:", e);
                toast.error("Upload Error", { description: "Could not save screenshot. Continuing..." });
            }

            const verificationStatus = `Screenshot URL: ${paymentUrl} | OCR Status: Amount ₹${ocrResults?.details.amountValue || '600'}, Status: ${ocrResults?.details.statusValue || 'Success'}${extractedUTR ? ', UTR: ' + extractedUTR : ''}`;
            formData.append(GOOGLE_FORM_ENTRY_IDS.PAYMENT_PROOF, verificationStatus);


            await fetch(GOOGLE_FORM_ACTION_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            });

            // Email is sent automatically by Google Apps Script Trigger (onFormSubmit)
            // Removed redundant fetch call to avoid "Invalid params" / "Unknown Action" error

            toast.success("Registration Successful!", {
                description: "Your team has been registered. Check your email for confirmation."
            });

            setTimeout(() => {
                navigate('/registration-success');
            }, 2000);

            // If successful, we don't set isSubmitting to false 
            // because we are navigating away in 2 seconds.
            // This prevents the button from becoming clickable again.

        } catch (error) {
            console.error("Submission Error:", error);
            toast.error("Registration Failed", {
                description: "Something went wrong. Please try again or contact support."
            });
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-foreground overflow-x-hidden pb-10">
            <ParticleBackground />

            <div className="container mx-auto px-4 py-8 relative z-10">
                <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-8 transition-colors">
                    <ChevronLeft className="mr-2" />
                    Back to Home
                </Link>

                <GlassCard glowColor="cyan" className="max-w-3xl mx-auto p-8 border-primary/20">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-bold mb-2 gradient-text">Team Registration</h1>
                        <p className="text-foreground/60">HACKAURA 2026 • Join the Innovation</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                        {/* Team Details Section */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold flex items-center gap-2 text-secondary">
                                <Users className="w-5 h-5" />
                                Team Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Team Name</label>
                                    <div className="relative">
                                        <input
                                            {...register("teamName")}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 focus:border-primary/50 focus:ring-1 focus:ring-primary outline-none transition-all pr-10"
                                            placeholder="e.g. Code Wizards"
                                        />
                                    </div>
                                    {errors.teamName && <p className="text-red-400 text-xs">{errors.teamName.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">College Name</label>
                                    <div className="relative">
                                        <School className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                                        <input
                                            {...register("collegeName")}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 pl-10 focus:border-primary/50 focus:ring-1 focus:ring-primary outline-none transition-all"
                                            placeholder="Your Institute Name"
                                        />
                                    </div>
                                    {errors.collegeName && <p className="text-red-400 text-xs">{errors.collegeName.message}</p>}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium">Project Domain</label>
                                    <div className="relative">
                                        <select
                                            {...register("domain")}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 focus:border-primary/50 focus:ring-1 focus:ring-primary outline-none transition-all appearance-none text-gray-300"
                                        >
                                            <option value="" className="bg-gray-900 text-gray-500">Select Domain</option>
                                            <option value="Full Stack" className="bg-gray-900">Full Stack</option>
                                            <option value="Cybersecurity" className="bg-gray-900">Cybersecurity</option>
                                            <option value="Generative AI" className="bg-gray-900">Generative AI</option>
                                            <option value="Internet of Things" className="bg-gray-900">Internet of Things</option>
                                        </select>
                                        <div className="absolute right-3 top-3.5 pointer-events-none">
                                            <ChevronLeft className="w-4 h-4 -rotate-90 text-gray-500" />
                                        </div>
                                    </div>
                                    {errors.domain && <p className="text-red-400 text-xs">{errors.domain.message}</p>}

                                    {/* Problem Statement Info */}
                                    {watch('domain') && (
                                        <div className={`text-xs mt-2 p-2 rounded border ${watch('domain') === 'Internet of Things'
                                            ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                                            : 'bg-white/5 border-white/10 text-gray-400'
                                            }`}>
                                            <span className="font-semibold">Note: </span>
                                            {watch('domain') === 'Internet of Things'
                                                ? 'Please select your IOT Problem Statement below'
                                                : 'Problem Statement will be provided On Venue'}
                                        </div>
                                    )}

                                    {/* Conditional Problem Statement Dropdown for IOT */}
                                    {watch('domain') === 'Internet of Things' && (
                                        <div className="space-y-2 mt-4 animate-in fade-in slide-in-from-top-2">
                                            <label className="text-sm font-medium text-blue-400">Select Problem Statement</label>
                                            <div className="relative">
                                                <select
                                                    {...register("problemStatement")}
                                                    className="w-full bg-blue-950/20 border border-blue-500/30 rounded-lg p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none text-blue-100"
                                                >
                                                    <option value="" className="bg-gray-900 text-gray-500">Select Problem Statement</option>
                                                    <option value="Internet of Things Problem Statement 1" className="bg-gray-900">PS-1: Smart Water Management System</option>
                                                    <option value="Internet of Things Problem Statement 2" className="bg-gray-900">PS-2: Smart Agriculture Monitoring System</option>
                                                    <option value="Internet of Things Problem Statement 3" className="bg-gray-900">PS-3: Patient Health Monitoring & Emergency Alert</option>
                                                    <option value="Internet of Things Problem Statement 4" className="bg-gray-900">PS-4: Smart Home Energy Monitor & Optimizer</option>
                                                    <option value="Internet of Things Problem Statement 5" className="bg-gray-900">PS-5: Smart Parking & Traffic Management</option>
                                                    <option value="Internet of Things Problem Statement 6" className="bg-gray-900">PS-6: Industrial Safety & Environmental Monitoring</option>
                                                </select>
                                                <div className="absolute right-3 top-3.5 pointer-events-none">
                                                    <ChevronLeft className="w-4 h-4 -rotate-90 text-blue-400" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* Team Leader Section */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold flex items-center gap-2 text-accent">
                                <User className="w-5 h-5" />
                                Team Leader Details
                            </h3>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Full Name</label>
                                <input
                                    {...register("leaderName")}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 focus:border-primary/50 focus:ring-1 focus:ring-primary outline-none transition-all"
                                    placeholder="Leader's Name"
                                />
                                {errors.leaderName && <p className="text-red-400 text-xs">{errors.leaderName.message}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                                        <input
                                            {...register("leaderEmail")}
                                            type="email"
                                            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 pl-10 focus:border-primary/50 focus:ring-1 focus:ring-primary outline-none transition-all pr-10"
                                            placeholder="leader@example.com"
                                        />
                                    </div>
                                    {errors.leaderEmail && <p className="text-red-400 text-xs">{errors.leaderEmail.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                                        <input
                                            {...register("leaderPhone")}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 pl-10 focus:border-primary/50 focus:ring-1 focus:ring-primary outline-none transition-all pr-10"
                                            placeholder="9876543210"
                                        />
                                    </div>
                                    {errors.leaderPhone && <p className="text-red-400 text-xs">{errors.leaderPhone.message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Team Members Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold flex items-center gap-2 text-neon-magenta">
                                    <Users className="w-5 h-5" />
                                    Team Members
                                </h3>
                                {fields.length < 3 && (
                                    <button
                                        type="button"
                                        onClick={() => append({ name: '', email: '' })}
                                        className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                                    >
                                        <Plus className="w-4 h-4" /> Add Member
                                    </button>
                                )}
                            </div>

                            <div className="space-y-3">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="p-4 bg-white/5 rounded-xl border border-white/5 relative group animate-in slide-in-from-left-4 fade-in duration-300">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs text-muted-foreground">Member {index + 1} Name</label>
                                                <input
                                                    {...register(`members.${index}.name` as const)}
                                                    className="w-full bg-transparent border-b border-white/20 focus:border-primary px-0 py-2 outline-none transition-colors"
                                                    placeholder="Full Name"
                                                />
                                                {errors.members?.[index]?.name && <p className="text-red-400 text-xs">{errors.members[index]?.name?.message}</p>}
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs text-muted-foreground">Member {index + 1} Email</label>
                                                <input
                                                    {...register(`members.${index}.email` as const)}
                                                    className="w-full bg-transparent border-b border-white/20 focus:border-primary px-0 py-2 outline-none transition-colors"
                                                    placeholder="Email Address"
                                                />
                                                {errors.members?.[index]?.email && <p className="text-red-400 text-xs">{errors.members[index]?.email?.message}</p>}
                                            </div>
                                        </div>

                                        {fields.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="absolute -top-2 -right-2 bg-red-500/20 text-red-400 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/40"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Section */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold flex items-center gap-2 text-green-400">
                                <CreditCard className="w-5 h-5" />
                                Payment Verification
                            </h3>

                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4 text-sm text-gray-300">
                                <div className="flex flex-col items-center mb-4">
                                    <div className="bg-white p-2 rounded-lg mb-2">
                                        <img src="/payment-qr.jpg" alt="Payment QR Code" className="w-48 h-48 object-contain" />
                                    </div>
                                    <p className="text-xs text-center text-gray-400 mb-2">Scan to Pay via PhonePe / UPI</p>
                                    <a
                                        href="/payment-qr.jpg"
                                        download="hackaura-payment-qr.jpg"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors"
                                    >
                                        <Download className="w-3 h-3" />
                                        Download QR
                                    </a>
                                </div>

                                <p className="flex items-center gap-2 mb-2">
                                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                                    <strong>Important:</strong> Upload a screenshot of your payment.
                                </p>
                                <ul className="list-disc list-inside space-y-1 text-gray-400 ml-1">
                                    <li>Transfer <strong>₹600</strong> to the UPI ID provided below.</li>
                                    <li>Ensure the screenshot clearly shows the <strong>Amount (₹600)</strong>, <strong>Success</strong> status.</li>
                                </ul>
                            </div>

                            <div
                                {...getRootProps()}
                                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${ocrVerificationStatus === 'analyzing'
                                    ? 'border-yellow-500/50 bg-yellow-500/10'
                                    : ocrVerificationStatus === 'success'
                                        ? 'border-green-500/50 bg-green-500/10'
                                        : ocrVerificationStatus === 'failed'
                                            ? 'border-red-500/50 bg-red-500/10'
                                            : paymentScreenshot
                                                ? 'border-blue-500/50 bg-blue-500/10'
                                                : isDragActive
                                                    ? 'border-primary bg-primary/10'
                                                    : 'border-white/10 hover:border-primary/50 hover:bg-white/5'
                                    }`}
                            >
                                <input {...getInputProps()} />
                                <div className="flex flex-col items-center gap-3">
                                    {paymentScreenshot ? (
                                        <>
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${ocrVerificationStatus === 'analyzing'
                                                ? 'bg-yellow-500/20'
                                                : ocrVerificationStatus === 'success'
                                                    ? 'bg-green-500/20'
                                                    : ocrVerificationStatus === 'failed'
                                                        ? 'bg-red-500/20'
                                                        : 'bg-blue-500/20'
                                                }`}>
                                                {ocrVerificationStatus === 'analyzing' ? (
                                                    <Loader2 className="w-6 h-6 text-yellow-400 animate-spin" />
                                                ) : ocrVerificationStatus === 'success' ? (
                                                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                                                ) : ocrVerificationStatus === 'failed' ? (
                                                    <XCircle className="w-6 h-6 text-red-500" />
                                                ) : (
                                                    <CheckCircle2 className="w-6 h-6 text-blue-500" />
                                                )}
                                            </div>

                                            <div>
                                                <div className="flex items-center justify-center gap-2 mb-1">
                                                    <span className="font-medium truncate max-w-[200px] text-white">{paymentScreenshot.name}</span>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setPaymentScreenshot(null);
                                                            setOcrVerificationStatus('idle');
                                                            setOcrResults(null);
                                                        }}
                                                        className="hover:text-red-400 transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <p className={`text-sm font-medium ${ocrVerificationStatus === 'analyzing'
                                                    ? 'text-yellow-400'
                                                    : ocrVerificationStatus === 'success'
                                                        ? 'text-green-400'
                                                        : ocrVerificationStatus === 'failed'
                                                            ? 'text-red-400'
                                                            : 'text-blue-400'
                                                    }`}>
                                                    {ocrVerificationStatus === 'analyzing'
                                                        ? 'Analyzing Screenshot...'
                                                        : ocrVerificationStatus === 'success'
                                                            ? '✓ Payment Verified!'
                                                            : ocrVerificationStatus === 'failed'
                                                                ? '✗ Verification Failed'
                                                                : 'Screenshot Uploaded'}
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                                <Upload className={`w-6 h-6 ${isDragActive ? 'text-primary' : 'text-gray-400'}`} />
                                            </div>
                                            <div>
                                                <p className="text-base font-medium">Drop payment screenshot here</p>
                                                <p className="text-sm text-foreground/50 mt-1">or click to browse (JPG, PNG)</p>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* OCR Verification Details - Inside upload box */}
                                {ocrVerificationStatus !== 'idle' && ocrVerificationStatus !== 'analyzing' && (
                                    <div className="mt-4">
                                        <PaymentVerificationBadge
                                            status={ocrVerificationStatus}
                                            details={ocrResults?.details}
                                            errorMessage={ocrResults?.errorMessage}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-6">
                            <NeonButton
                                variant="primary"
                                className="w-full relative overflow-hidden"
                                disabled={isSubmitting || formSubmitting || isValidating}
                                type="submit"
                            >
                                {isSubmitting || formSubmitting || isValidating ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="animate-spin" /> {isValidating ? 'Checking Details...' : 'Submission in Progress...'}
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Submit Registration <Send className="w-4 h-4" />
                                    </span>
                                )}
                            </NeonButton>
                        </div>

                    </form>
                </GlassCard>
            </div>
        </div>
    );
}

