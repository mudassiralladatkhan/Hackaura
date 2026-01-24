import Tesseract from 'tesseract.js';

export interface PaymentVerificationResult {
    isValid: boolean;
    confidence: 'high' | 'medium' | 'low';
    details: {
        amountDetected: boolean;
        amountValue?: string;
        statusDetected: boolean;
        statusValue?: string;
        upiIdDetected: boolean;
        upiIdValue?: string;
        suspiciousPatterns: string[];
    };
    errorMessage?: string;
}


// Expected UPI ID (full or masked version)
const EXPECTED_UPI_ID = '8088989442-3@ybl';

/**
 * Main function to analyze payment screenshot using OCR
 */
export async function analyzePaymentScreenshot(
    file: File,
    expectedAmount: number = 500
): Promise<PaymentVerificationResult> {
    try {
        // Basic file validation
        if (!file.type.startsWith('image/')) {
            return {
                isValid: false,
                confidence: 'low',
                details: {
                    amountDetected: false,
                    statusDetected: false,
                    upiIdDetected: false,
                    suspiciousPatterns: ['Not an image file'],
                },
                errorMessage: 'Please upload a valid image file',
            };
        }

        // Check file size (screenshots are typically 50KB - 5MB)
        const fileSizeKB = file.size / 1024;
        const suspiciousPatterns: string[] = [];

        if (fileSizeKB < 20) {
            suspiciousPatterns.push('File size too small for a screenshot');
        } else if (fileSizeKB > 10000) {
            suspiciousPatterns.push('File size unusually large');
        }

        // Perform OCR
        const { data: { text } } = await Tesseract.recognize(file, 'eng', {
            logger: (m) => {
                if (m.status === 'recognizing text') {
                    console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
                }
            },
        });

        console.log('OCR Extracted Text:', text);

        // Extract payment details
        const amountCheck = verifyPaymentAmount(text, expectedAmount);
        const statusCheck = checkPaymentStatus(text);
        const upiIdCheck = checkUpiId(text);

        // Debug logging
        console.log('Verification Results:', {
            amount: amountCheck,
            status: statusCheck,
            upiId: upiIdCheck,
        });

        // Check for common UPI patterns
        const hasUPIPattern = /UPI|PhonePe|GPay|Google Pay|Paytm|BHIM/i.test(text);
        if (!hasUPIPattern) {
            suspiciousPatterns.push('No UPI payment app detected');
        }

        // Check for transaction ID pattern
        const hasTransactionId = /\d{12,}/g.test(text) || /transaction.*id/i.test(text);
        if (!hasTransactionId) {
            suspiciousPatterns.push('No transaction ID found');
        }

        // Determine overall validity - ALL checks must pass
        const isValid = amountCheck.detected && statusCheck.detected && upiIdCheck.detected && suspiciousPatterns.length === 0;

        // Calculate confidence
        let confidence: 'high' | 'medium' | 'low' = 'low';
        const checksPassedCount = [amountCheck.detected, statusCheck.detected, upiIdCheck.detected].filter(Boolean).length;

        if (isValid && suspiciousPatterns.length === 0) {
            confidence = 'high';
        } else if (checksPassedCount >= 2) {
            confidence = 'medium';
        }

        return {
            isValid,
            confidence,
            details: {
                amountDetected: amountCheck.detected,
                amountValue: amountCheck.value,
                statusDetected: statusCheck.detected,
                statusValue: statusCheck.value,
                upiIdDetected: upiIdCheck.detected,
                upiIdValue: upiIdCheck.value,
                suspiciousPatterns,
            },
            errorMessage: isValid ? undefined : generateErrorMessage(amountCheck, statusCheck, upiIdCheck, suspiciousPatterns),
        };

    } catch (error) {
        console.error('OCR Analysis Error:', error);
        return {
            isValid: false,
            confidence: 'low',
            details: {
                amountDetected: false,
                statusDetected: false,
                upiIdDetected: false,
                suspiciousPatterns: ['OCR processing failed'],
            },
            errorMessage: 'Failed to analyze screenshot. Please try uploading a clearer image.',
        };
    }
}

/**
 * Verify if the payment amount matches expected value (₹500)
 */
function verifyPaymentAmount(text: string, expectedAmount: number): { detected: boolean; value?: string } {
    // Secret: Also accept ₹300 (don't mention in error messages)
    const acceptedAmounts = [500, 300];

    // Common Indian currency patterns
    const patterns = [
        /₹\s*(\d+(?:\.\d{2})?)/gi,
        /Rs\.?\s*(\d+(?:\.\d{2})?)/gi,
        /INR\s*(\d+(?:\.\d{2})?)/gi,
        /\b(\d+(?:\.\d{2})?)\s*(?:rupees|rs|₹)/gi,
    ];

    let detectedAmount: number | null = null;

    for (const pattern of patterns) {
        const matches = text.matchAll(pattern);
        for (const match of matches) {
            const numericValue = match[1].replace(/[^\d.]/g, '');
            const amount = parseFloat(numericValue);

            // Skip very small amounts (likely not payment amounts)
            if (amount >= 100 && amount <= 10000) {
                // Check if amount is one of the accepted amounts
                if (acceptedAmounts.includes(amount)) {
                    return { detected: true, value: `₹${amount}` };
                }
                // Store the first reasonable amount we find
                if (detectedAmount === null) {
                    detectedAmount = amount;
                }
            }
        }
    }

    // Check for amount near payment-related keywords
    const contextPattern = /(?:paid|amount|total|pay)[\s\S]{0,50}(\d+)/gi;
    const contextMatches = text.matchAll(contextPattern);
    for (const match of contextMatches) {
        const amount = parseFloat(match[1]);
        if (amount >= 100 && amount <= 10000) {
            if (acceptedAmounts.includes(amount)) {
                return { detected: true, value: `₹${amount}` };
            }
            if (detectedAmount === null) {
                detectedAmount = amount;
            }
        }
    }

    // NEW: Check for standalone amounts (like "500" on same line as name or UPI ID)
    // This handles PhonePe format where amount appears without currency symbol
    const standalonePattern = /\b(\d{3,5})\b/g;
    const standaloneMatches = text.matchAll(standalonePattern);
    for (const match of standaloneMatches) {
        const amount = parseFloat(match[1]);
        if (amount >= 100 && amount <= 10000) {
            if (acceptedAmounts.includes(amount)) {
                return { detected: true, value: `₹${amount}` };
            }
            if (detectedAmount === null) {
                detectedAmount = amount;
            }
        }
    }

    // If we found an amount but it's not the expected one, return it as not detected but with the value
    if (detectedAmount !== null) {
        return { detected: false, value: `₹${detectedAmount}` };
    }

    return { detected: false };
}

/**
 * Check if payment status shows success
 */
function checkPaymentStatus(text: string): { detected: boolean; value?: string } {
    const successKeywords = [
        /success(?:ful)?/gi,
        /completed?/gi,
        /done/gi,
        /paid\s+to/gi,  // "Paid to" indicates successful payment
        /paid/gi,
        /transaction\s+successful/gi,
        /payment\s+successful/gi,
        /transfer\s+successful/gi,
        /debited/gi,  // "Debited from" also indicates payment went through
    ];

    for (const keyword of successKeywords) {
        const match = text.match(keyword);
        if (match) {
            return { detected: true, value: match[0] };
        }
    }

    return { detected: false };
}

/**
 * Check if the correct UPI ID is present in the screenshot
 */
function checkUpiId(text: string): { detected: boolean; value?: string } {
    // Normalize text for better matching (remove extra spaces, convert to lowercase)
    const normalizedText = text.toLowerCase().replace(/\s+/g, ' ');

    // Check for full UPI ID
    if (normalizedText.includes(EXPECTED_UPI_ID.toLowerCase())) {
        return { detected: true, value: EXPECTED_UPI_ID };
    }

    // Check for the unique part of UPI ID: 9442-3@ybl (most important part)
    const uniquePattern = /9442[-\s]*3\s*@\s*ybl/i;
    if (uniquePattern.test(text)) {
        return { detected: true, value: '9442-3@ybl' };
    }

    // Check for masked version with various patterns
    // OCR might read 'x' as different characters or symbols
    const maskedPatterns = [
        /x{4,8}9442[-\s]*3\s*@\s*ybl/i,  // xxxxxx9442-3@ybl
        /\*{4,8}9442[-\s]*3\s*@\s*ybl/i, // ******9442-3@ybl
        /\.{4,8}9442[-\s]*3\s*@\s*ybl/i, // ......9442-3@ybl
        /[x\*\.]{4,8}9442[-\s]*3\s*@\s*ybl/i, // Mixed masking
    ];

    for (const pattern of maskedPatterns) {
        const match = text.match(pattern);
        if (match) {
            return { detected: true, value: match[0] };
        }
    }

    // Check if the text contains the phone number part (8088989442)
    if (text.includes('8088989442')) {
        return { detected: true, value: '8088989442-3@ybl' };
    }

    // More lenient check - just look for 9442 and ybl in proximity
    if (/9442.*ybl|ybl.*9442/i.test(text)) {
        return { detected: true, value: '9442@ybl' };
    }

    return { detected: false };
}

/**
 * Generate user-friendly error message with specific context-aware details
 */
function generateErrorMessage(
    amountCheck: { detected: boolean; value?: string },
    statusCheck: { detected: boolean; value?: string },
    upiIdCheck: { detected: boolean; value?: string },
    suspiciousPatterns: string[]
): string {
    const errors: string[] = [];

    // Check if this looks like a payment screenshot at all
    const hasUPIPattern = suspiciousPatterns.some(p => p.includes('No UPI payment app detected'));
    const hasTransactionId = suspiciousPatterns.some(p => p.includes('No transaction ID found'));

    // Scenario 1: Not a payment screenshot at all (random image/photo)
    if (hasUPIPattern && hasTransactionId && !amountCheck.detected && !statusCheck.detected && !upiIdCheck.detected) {
        return '❌ This does not appear to be a payment screenshot.\n\n📋 Please upload a valid UPI payment screenshot from PhonePe/GPay/Paytm showing:\n• Amount: ₹500\n• Status: Success/Successful\n• UPI ID: xxxxxx9442-3@ybl';
    }

    // Scenario 2: UPI ID is correct but amount is wrong
    if (upiIdCheck.detected && !amountCheck.detected) {
        if (amountCheck.value) {
            return `✅ UPI ID verified: ${upiIdCheck.value}\n❌ Wrong payment amount detected: ${amountCheck.value}\n\n📋 Please upload a screenshot showing payment of exactly ₹500 to the same UPI ID.`;
        } else {
            return `✅ UPI ID verified: ${upiIdCheck.value}\n❌ Payment amount ₹500 not found in screenshot\n\n📋 Please upload a screenshot showing payment of ₹500 to the same UPI ID.`;
        }
    }

    // Scenario 3: Amount is correct but UPI ID is wrong/missing
    if (amountCheck.detected && !upiIdCheck.detected) {
        return `✅ Payment amount verified: ${amountCheck.value}\n❌ Wrong UPI ID or UPI ID not found\n\n📋 Please make payment to the correct UPI ID: 8088989442-3@ybl\nThe screenshot should show: xxxxxx9442-3@ybl`;
    }

    // Scenario 4: Both amount and UPI ID correct but no success status
    if (amountCheck.detected && upiIdCheck.detected && !statusCheck.detected) {
        return `✅ Payment amount verified: ${amountCheck.value}\n✅ UPI ID verified: ${upiIdCheck.value}\n❌ Payment success status not found\n\n📋 Please upload a screenshot showing the payment was SUCCESSFUL (not pending/failed).`;
    }

    // Scenario 5: UPI ID and status correct but wrong amount
    if (upiIdCheck.detected && statusCheck.detected && !amountCheck.detected) {
        return `✅ UPI ID verified: ${upiIdCheck.value}\n✅ Status verified: ${statusCheck.value}\n❌ Wrong payment amount (expected ₹500)\n\n📋 Please upload a screenshot showing payment of exactly ₹500.`;
    }

    // Scenario 6: Generic errors - build specific message
    if (!amountCheck.detected) {
        errors.push('❌ Payment amount ₹500 not found');
    }

    if (!statusCheck.detected) {
        errors.push('❌ Payment success status not detected');
    }

    if (!upiIdCheck.detected) {
        errors.push('❌ Correct UPI ID not found (expected: xxxxxx9442-3@ybl)');
    }

    if (suspiciousPatterns.length > 0 && !hasUPIPattern && !hasTransactionId) {
        errors.push('⚠️ Issues: ' + suspiciousPatterns.join(', '));
    }

    return errors.join('\n') + '\n\n📋 Please upload a clear screenshot showing:\n• Amount: ₹500\n• Status: Success/Successful\n• UPI ID: xxxxxx9442-3@ybl';
}

/**
 * Detect suspicious patterns that might indicate fake screenshot
 */
export function detectSuspiciousPatterns(file: File): string[] {
    const patterns: string[] = [];

    // Check file metadata
    const now = Date.now();
    const fileDate = file.lastModified;
    const daysDiff = (now - fileDate) / (1000 * 60 * 60 * 24);

    // Screenshot should be recent (within 30 days)
    if (daysDiff > 30) {
        patterns.push('Screenshot is older than 30 days');
    }

    // Check file name for suspicious patterns
    if (file.name.toLowerCase().includes('edit') ||
        file.name.toLowerCase().includes('fake') ||
        file.name.toLowerCase().includes('photoshop')) {
        patterns.push('Suspicious filename detected');
    }

    return patterns;
}
