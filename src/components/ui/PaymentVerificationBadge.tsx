import { CheckCircle2, Loader2 } from 'lucide-react';

interface PaymentVerificationBadgeProps {
    status: 'idle' | 'analyzing' | 'success' | 'failed';
    details?: {
        amountDetected: boolean;
        amountValue?: string;
        statusDetected: boolean;
        statusValue?: string;
        upiIdDetected: boolean;
        upiIdValue?: string;
        transactionId?: string;
        suspiciousPatterns: string[];
    };
    errorMessage?: string;
}

export function PaymentVerificationBadge({ status, details, errorMessage }: PaymentVerificationBadgeProps) {
    if (status === 'idle') {
        return null;
    }

    if (status === 'analyzing') {
        return (
            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 text-yellow-400 animate-spin" />
                    <div>
                        <p className="text-sm font-medium text-yellow-400">Analyzing Screenshot...</p>
                        <p className="text-xs text-yellow-400/70 mt-1">Verifying payment details using OCR</p>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'success' && details) {
        return (
            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg animate-in slide-in-from-top-2 fade-in duration-300">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-green-400 mb-2">✓ Payment Verified Successfully</p>
                        <div className="space-y-1.5 text-xs text-green-400/80">
                            {details.amountDetected && (
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>Amount: <strong>{details.amountValue || '₹500'}</strong> detected</span>
                                </div>
                            )}
                            {details.statusDetected && (
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>Status: <strong>{details.statusValue || 'Success'}</strong> confirmed</span>
                                </div>
                            )}
                            {details.upiIdDetected && (
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>UPI ID: <strong>{details.upiIdValue || 'xxxxxx9442-3@ybl'}</strong> verified</span>
                                </div>
                            )}
                            {details.transactionId && (
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>UTR: <strong>{details.transactionId}</strong> extracted</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Screenshot appears authentic</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="text-xs text-red-400/90 whitespace-pre-line leading-relaxed">
                    {errorMessage}
                </div>
            </div>
        );
    }

    return null;
}
