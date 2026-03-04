import { useState, useCallback, useEffect } from 'react';
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

// ── Host College (VSM) Registration Limits ───────────────────────
const HOST_COLLEGE_OFFICIAL_NAME = "VSM's Somashekhar R Kothiwale Institute of Technology, Nipani";

// GROUP-BASED limits: each domain maps to its group's combined cap
// Group A (Full Stack + Generative AI) → combined 12
// Group B (Cybersecurity + IoT)         → combined 8
const DOMAIN_GROUPS: Record<string, { group: string; label: string; limit: number }> = {
    'Full Stack': { group: 'A', label: 'Full Stack + Generative AI', limit: 12 },
    'Generative AI': { group: 'A', label: 'Full Stack + Generative AI', limit: 12 },
    'Cybersecurity': { group: 'B', label: 'Cybersecurity + IoT', limit: 8 },
    'Internet of Things': { group: 'B', label: 'Cybersecurity + IoT', limit: 8 },
};
const OVERALL_VSM_LIMIT = 20; // 12 + 8

// Domains closed for new registrations
const CLOSED_DOMAINS = ['Full Stack', 'Generative AI'];

/**
 * Detects whether the entered college name is a variation of VSMSRKIT.
 * Catches all common abbreviations, typos, and alternate names.
 */
function isHostCollege(collegeName: string): boolean {
    if (!collegeName || collegeName.length < 3) return false;
    const n = collegeName.toLowerCase().trim().replace(/[\u2018\u2019'']/g, "'").replace(/\s+/g, ' ');

    // Direct abbreviation matches
    const directMatches = ['vsmsrkit', 'vsmit', 'vsm it', 'vsm srkit', 'vsm\'s srkit'];
    for (const alias of directMatches) {
        if (n.includes(alias)) return true;
    }

    // Phrase-based matches
    const phraseMatches = [
        'vsm\'s somashekhar', 'vsm somashekhar', 'somashekhar r kothiwale',
        'somashekhar r. kothiwale', 'kothiwale institute of technology',
        'vsm institute of technology', 'vsm\'s institute of technology',
        'vidya samvardhak mandal',
    ];
    for (const phrase of phraseMatches) {
        if (n.includes(phrase)) return true;
    }

    // Combination-based detection
    const hasVSM = /\bvsm\b/.test(n) || n.includes('vidya samvardhak');
    const hasKothiwale = n.includes('kothiwale');
    const hasNipani = n.includes('nipani');
    const hasTech = n.includes('technology') || n.includes('tech');
    const hasInstitute = n.includes('institute') || n.includes('inst');
    const hasSomashekhar = n.includes('somashekhar') || n.includes('somshekhar') || n.includes('somashekar');

    if (hasVSM && (hasKothiwale || hasNipani || hasTech || hasInstitute)) return true;
    if (hasKothiwale && (hasInstitute || hasTech || hasNipani)) return true;
    if (hasSomashekhar && (hasInstitute || hasTech || hasKothiwale)) return true;

    return false;
}

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
    const [collegeLimitReached, setCollegeLimitReached] = useState(false);
    const [collegeLimitInfo, setCollegeLimitInfo] = useState<{
        groupCount: number; groupLimit: number; groupLabel: string;
        totalCount: number; groupReached: boolean; totalReached: boolean;
    } | null>(null);
    const [checkingCollegeLimit, setCheckingCollegeLimit] = useState(false);

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

    // Watch college + domain for host-college group-based limit check
    const watchedCollegeName = watch('collegeName');
    const watchedDomain = watch('domain');

    useEffect(() => {
        const timer = setTimeout(async () => {
            const isVSM = watchedCollegeName && watchedCollegeName.length >= 3 && isHostCollege(watchedCollegeName);
            const domainGroup = watchedDomain ? DOMAIN_GROUPS[watchedDomain] : null;

            if (isVSM && domainGroup) {
                setCheckingCollegeLimit(true);
                try {
                    const response = await fetch(
                        `${GOOGLE_SCRIPT_API_URL}?action=checkCollegeCount&college=VSMSRKIT&domain=${encodeURIComponent(watchedDomain)}`
                    );
                    const data = await response.json();
                    setCollegeLimitInfo({
                        groupCount: data.groupCount ?? 0,
                        groupLimit: data.groupLimit ?? domainGroup.limit,
                        groupLabel: data.group ?? domainGroup.label,
                        totalCount: data.totalCount ?? 0,
                        groupReached: data.groupReached ?? false,
                        totalReached: data.totalReached ?? false,
                    });
                    setCollegeLimitReached(data.blocked ?? false);
                } catch (error) {
                    console.error('Failed to check college limit:', error);
                    setCollegeLimitReached(false);
                    setCollegeLimitInfo(null);
                } finally {
                    setCheckingCollegeLimit(false);
                }
            } else if (isVSM && !domainGroup) {
                // VSM college detected but no domain selected yet
                setCollegeLimitReached(false);
                setCollegeLimitInfo(null);
            } else {
                setCollegeLimitReached(false);
                setCollegeLimitInfo(null);
            }
        }, 600);
        return () => clearTimeout(timer);
    }, [watchedCollegeName, watchedDomain]);

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

        // Block submission for closed domains
        if (CLOSED_DOMAINS.includes(data.domain)) {
            toast.error('Domain Closed', {
                description: `Registrations for ${data.domain} are closed. Only Cybersecurity and Internet of Things are open.`,
                duration: 8000
            });
            setIsSubmitting(false);
            return;
        }

        // Double-check group limit at submit time for VSM college
        const domainGroup = data.domain ? DOMAIN_GROUPS[data.domain] : null;
        if (isHostCollege(data.collegeName) && domainGroup) {
            try {
                const response = await fetch(
                    `${GOOGLE_SCRIPT_API_URL}?action=checkCollegeCount&college=VSMSRKIT&domain=${encodeURIComponent(data.domain)}`
                );
                const result = await response.json();
                if (result.blocked) {
                    setCollegeLimitReached(true);
                    const msg = result.groupReached
                        ? `The ${result.group ?? domainGroup.label} group has reached its VSM limit (${result.groupCount}/${result.groupLimit} combined teams). Choose a different domain or college.`
                        : `VSMSRKIT has reached the overall registration cap (${result.totalCount}/${result.overallLimit} teams total). No more registrations from this college are accepted.`;
                    toast.error('Registration Limit Reached!', { description: msg, duration: 8000 });
                    setIsSubmitting(false);
                    return;
                }
            } catch (error) {
                console.warn('College limit check failed at submit, continuing:', error);
            }
        }

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

                <GlassCard glowColor="cyan" className="max-w-3xl mx-auto p-8 border-red-500/30 bg-red-500/5">
                    {/* Registration Closed Screen */}
                    <div className="text-center space-y-6">

                        {/* Icon */}
                        <div className="flex justify-center">
                            <div className="w-24 h-24 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center animate-pulse">
                                <span className="text-5xl">🚫</span>
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-3 text-red-400">
                                Registrations Closed
                            </h1>
                            <p className="text-xl text-foreground/60 font-medium">
                                HACKAURA 2026
                            </p>
                        </div>

                        {/* Main message */}
                        <div className="p-5 rounded-xl border border-red-500/30 bg-red-500/10 text-left">
                            <p className="text-red-300 font-semibold text-base md:text-lg text-center">
                                🎯 All slots are filled — Intake Complete!
                            </p>
                            <p className="text-foreground/60 text-sm mt-2 text-center">
                                We have reached our maximum participant capacity across all domains.
                                Thank you to everyone who registered — we can't wait to see you at the event!
                            </p>
                        </div>

                        {/* Domain status grid */}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            {[
                                { name: 'Full Stack', icon: '💻' },
                                { name: 'Generative AI', icon: '🤖' },
                                { name: 'Cybersecurity', icon: '🔐' },
                                { name: 'Internet of Things', icon: '📡' },
                            ].map((d) => (
                                <div key={d.name} className="flex items-center gap-2 p-3 rounded-lg border border-white/10 bg-white/5">
                                    <span>{d.icon}</span>
                                    <span className="font-medium text-foreground/70">{d.name}</span>
                                    <span className="ml-auto text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">Full</span>
                                </div>
                            ))}
                        </div>

                        {/* Info note */}
                        <div className="p-4 rounded-xl border border-white/10 bg-white/5 text-sm text-foreground/50">
                            <p>📅 Event Date: <strong className="text-foreground/80">March 12–13, 2026</strong></p>
                            <p className="mt-1">📍 Venue: <strong className="text-foreground/80">VSMSRKIT, Nipani</strong></p>
                        </div>

                        {/* Back button */}
                        <Link
                            to="/"
                            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl border border-primary/40 bg-primary/10 text-primary font-semibold hover:bg-primary/20 hover:border-primary/60 transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Back to Home
                        </Link>
                    </div>


                </GlassCard>
            </div>
        </div>
    );
}
