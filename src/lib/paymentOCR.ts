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
        transactionId?: string;
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
    expectedAmount: number = 600
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
        const transactionId = extractTransactionId(text);

        // Debug logging
        console.log('Verification Results:', {
            amount: amountCheck,
            status: statusCheck,
            upiId: upiIdCheck,
            transactionId,
        });

        // Check for common UPI patterns
        const hasUPIPattern = /UPI|PhonePe|GPay|Google Pay|Paytm|BHIM|Amazon Pay/i.test(text);
        if (!hasUPIPattern) {
            suspiciousPatterns.push('No UPI payment app detected');
        }

        // Check for transaction ID pattern
        const hasTransactionId = /\d{12,}/g.test(text) || /transaction.*id/i.test(text) || /upi.*ref/i.test(text) || /ref.*no/i.test(text);
        if (!hasTransactionId) {
            suspiciousPatterns.push('No transaction ID found');
        }

        // ── GPay Structural Bypass ────────────────────────────────────────
        // GPay renders ₹600 in an extremely large, thin Google Sans font on a
        // dark gradient — Tesseract consistently fails to OCR it. However, GPay
        // receipts contain unique structural markers (Google transaction ID, UPI
        // transaction ID) that are printed in small readable text. If:
        //   1. UPI ID is verified (8088989442‑3@ybl)  ← confirms correct payee
        //   2. Payment status is success / completed   ← confirms payment done
        //   3. GPay receipt structure is detected      ← confirms it's GPay receipt
        // then we override the failing amount check — it's safe because no other
        // app shows this exact combination, and the UPI ID ties it to our account.
        const isGPayReceipt =
            /google\s*(?:transaction\s*id|pay)/i.test(text) &&
            /upi\s*transaction\s*id/i.test(text);

        // ── Amazon Pay Structural Bypass ──────────────────────────────────────
        // Amazon Pay shows ₹600 in bold black on white — OCR can usually read it,
        // but as a safety net, if the Amazon Pay receipt structure is confirmed
        // (amazon pay + amazon reference id + upi transaction id) along with
        // verified UPI ID and status, we bypass the amount check.
        const isAmazonPayReceipt =
            /amazon\s*pay/i.test(text) &&
            (/amazon\s*reference\s*id/i.test(text) || /upi\s*transaction\s*id/i.test(text));

        const amountPassedOrBypass =
            amountCheck.detected ||
            (isGPayReceipt && upiIdCheck.detected && statusCheck.detected) ||
            (isAmazonPayReceipt && upiIdCheck.detected && statusCheck.detected);

        if (!amountCheck.detected && upiIdCheck.detected && statusCheck.detected) {
            if (isGPayReceipt) console.log('GPay Structural Bypass: Amount OCR failed but GPay receipt structure verified ✓');
            if (isAmazonPayReceipt) console.log('Amazon Pay Structural Bypass: Amount OCR fallback used, Amazon Pay receipt structure verified ✓');
        }
        // ─────────────────────────────────────────────────────────────────────

        // Determine overall validity
        // Core checks (amount, status, UPI ID) must all pass
        // Suspicious patterns only block for critical file issues, NOT for OCR misses
        const coreChecksPassed = amountPassedOrBypass && statusCheck.detected && upiIdCheck.detected;
        const hasCriticalIssues = suspiciousPatterns.some(p =>
            p.includes('File size') || p.includes('Not an image') || p.includes('Suspicious filename')
        );
        const isValid = coreChecksPassed && !hasCriticalIssues;

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
                transactionId: transactionId || undefined,
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
 * Verify if the payment amount matches expected value (₹600)
 */
function verifyPaymentAmount(text: string, expectedAmount: number): { detected: boolean; value?: string } {
    // Strictly accept only the expected amount
    const acceptedAmounts = [expectedAmount];

    /**
     * Helper: Check if a number at a given position is likely a date/year, not an amount.
     * Filters out: years (2020-2030), numbers near month names, AM/PM, date separators.
     */
    function isDateOrYear(num: number, matchIndex: number): boolean {
        // Skip year-like numbers (2020-2030)
        if (num >= 2020 && num <= 2030) return true;

        // Check surrounding text for date/time context
        const before = text.substring(Math.max(0, matchIndex - 20), matchIndex).toLowerCase();
        const after = text.substring(matchIndex, Math.min(text.length, matchIndex + 20)).toLowerCase();
        const context = before + after;

        // Month names, date keywords, time indicators
        const datePatterns = /jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|am\b|pm\b|:\d{2}/i;
        if (datePatterns.test(context)) return true;

        return false;
    }

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

            if (amount >= 100 && amount <= 10000) {
                if (isDateOrYear(amount, match.index || 0)) continue;
                if (acceptedAmounts.includes(amount)) {
                    return { detected: true, value: `₹${amount}` };
                }
                if (detectedAmount === null) {
                    detectedAmount = amount;
                }
            }
        }
    }

    // Check for amount near payment-related keywords
    const contextPattern = /(?:paid|amount|total|pay|sent|transfer|rupee|six hundred)[\s\S]{0,50}(\d+)/gi;
    const contextMatches = text.matchAll(contextPattern);
    for (const match of contextMatches) {
        const amount = parseFloat(match[1]);
        if (amount >= 100 && amount <= 10000) {
            if (isDateOrYear(amount, match.index || 0)) continue;
            if (acceptedAmounts.includes(amount)) {
                return { detected: true, value: `₹${amount}` };
            }
            if (detectedAmount === null) {
                detectedAmount = amount;
            }
        }
    }

    // Check for written-out amount (GPay sometimes shows "Rupees Six Hundred Only")
    if (/six\s*hundred/i.test(text) && expectedAmount === 600) {
        return { detected: true, value: '₹600' };
    }

    // Standalone number check (e.g., "600" without currency symbol)
    const standalonePattern = /\b(\d{3,5})\b/g;
    const standaloneMatches = text.matchAll(standalonePattern);
    for (const match of standaloneMatches) {
        const amount = parseFloat(match[1]);
        if (amount >= 100 && amount <= 10000) {
            if (isDateOrYear(amount, match.index || 0)) continue;

            // Skip numbers that look like bank account suffixes (4 digits after XXXX)
            const beforeStandalone = text.substring(Math.max(0, (match.index || 0) - 6), match.index || 0);
            if (/[xX\*]{3,}/.test(beforeStandalone)) continue;

            // Skip transaction IDs (very long numbers, this is a 3-5 digit slice)
            if (acceptedAmounts.includes(amount)) {
                return { detected: true, value: `₹${amount}` };
            }
            if (detectedAmount === null) {
                detectedAmount = amount;
            }
        }
    }

    // EXTREME FALLBACK: Google Pay uses a very stylized, thin font for the amount ("₹600")
    // Tesseract often hallucinates the symbol into letters (like "Z600", "F600", "€600")
    // This bypasses word boundaries (\b) and looks for the exact number surrounded by ANY non-digits
    const fallbackPattern = new RegExp(`(?:[^\\d]|^)(${expectedAmount})(?:[^\\d]|$)`, 'g');
    const fallbackMatches = text.matchAll(fallbackPattern);
    for (const match of fallbackMatches) {
        const amount = parseFloat(match[1]);
        if (isDateOrYear(amount, match.index || 0)) continue;
        return { detected: true, value: `₹${amount}` };
    }

    // VISUAL HALLUCINATION FALLBACK: Tesseract often misreads the large thin "600" in GPay
    // as letters. For 600, it might read "60O", "6OO", "G00", "GOO", "Goo", "b00", "boo", "e00"
    if (expectedAmount === 600) {
        const hallucinationPattern = /(?:₹|rs|inr|f|z|e|€|r|[$]|^|\s)([6bGgeE][0oOQ][0oOQ])(?:\s|$|[^\w])/gi;
        const hMatches = text.matchAll(hallucinationPattern);
        for (const _match of hMatches) {
            // Found a visual match for 600!
            return { detected: true, value: '₹600 (OCR corrected)' };
        }

        // Sometimes GPay's giant amount text is completely skipped by OCR, but the rest of the receipt is there.
        // If we see clear GPay structure ("Google transaction ID", "Google Pay"), we can be a bit more lenient.
        if (/(?:google\s*pay|gpay)/i.test(text) && /transaction\s*id/i.test(text)) {
            // Check if there's any mention of "600" anywhere without boundary limits
            if (text.includes('600')) {
                return { detected: true, value: '₹600 (GPay Context)' };
            }
        }
    }

    // Further fallback, GPay OCR might misread the 6 as a b or G, or 0 as O
    // But let's check for standard 600 mixed with weird symbols
    const veryLenientPattern = /(?:rs|inr|₹|r|z|f|€|e|[$])\s*(\d{3,5})(?:[^\d]|$)/gi;
    const lenientMatches = text.matchAll(veryLenientPattern);
    for (const match of lenientMatches) {
        const amount = parseFloat(match[1]);
        if (acceptedAmounts.includes(amount)) {
            return { detected: true, value: `₹${amount}` };
        }
        if (detectedAmount === null && amount >= 100 && amount <= 10000) {
            detectedAmount = amount;
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
        /success(?:full?y?)?/gi,  // success, successful, successfully
        /completed?/gi,
        /done/gi,
        /paid\s+to/gi,
        /paid\s+at/gi,   // "Paid at" (Paytm format)
        /paid/gi,
        /sent\s+successful/gi,  // "Sent Successfully" (Paytm)
        /sent\s+to/gi,
        /transaction\s+successful/gi,
        /payment\s+successful/gi,
        /transfer\s+successful/gi,
        /money\s+transfer/gi,   // "Money Transfer" (Paytm)
        /debited/gi,
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
 * Check if the correct UPI ID is present in the screenshot.
 * Enhanced with OCR-tolerant patterns (handles @ → a/©, l → 1/I, spaces in numbers)
 * and receiver name fallback for GPay/Paytm layouts where UPI ID font is hard to OCR.
 */
function checkUpiId(text: string): { detected: boolean; value?: string } {
    // Normalize text for better matching
    const normalizedText = text.toLowerCase().replace(/\s+/g, ' ');

    // 1. Check for full UPI ID (exact match)
    if (normalizedText.includes(EXPECTED_UPI_ID.toLowerCase())) {
        return { detected: true, value: EXPECTED_UPI_ID };
    }

    // 2. Check for unique part: 9442-3@ybl
    const uniquePattern = /9442[-\s]*3\s*@\s*ybl/i;
    if (uniquePattern.test(text)) {
        return { detected: true, value: '9442-3@ybl' };
    }

    // 3. OCR-tolerant patterns (@ may be read as a/©, l as 1/I/|)
    const ocrTolerantPatterns = [
        /9442[-\s]*3\s*[@a©oQ]\s*yb[l1I|]/i,         // 9442-3@ybl with OCR errors
        /8088989442[-\s]*3\s*[@a©oQ]\s*yb[l1I|]/i,   // Full number with OCR errors
        /808[-\s.]*898[-\s.]*9442/i,                   // Phone number with separators
        /8\s*0\s*8\s*8\s*9\s*8\s*9\s*4\s*4\s*2/i,    // Phone number with spaces between digits
    ];

    for (const pattern of ocrTolerantPatterns) {
        const match = text.match(pattern);
        if (match) {
            return { detected: true, value: match[0].trim() };
        }
    }

    // 4. Masked versions (xxxxxx9442-3@ybl)
    const maskedPatterns = [
        /[x\*\.]{3,8}9442[-\s]*3\s*[@a©]\s*yb[l1I|]/i,  // Masked + OCR tolerant
        /x{4,8}9442[-\s]*3\s*@\s*ybl/i,
        /\*{4,8}9442[-\s]*3\s*@\s*ybl/i,
        /\.{4,8}9442[-\s]*3\s*@\s*ybl/i,
    ];

    for (const pattern of maskedPatterns) {
        const match = text.match(pattern);
        if (match) {
            return { detected: true, value: match[0] };
        }
    }

    // 5. Direct phone number match (PhonePe shows +918088989442)
    if (text.includes('8088989442')) {
        return { detected: true, value: '8088989442-3@ybl' };
    }

    // 6. Lenient: 9442 near ybl (within proximity)
    if (/9442.*ybl|ybl.*9442/i.test(text)) {
        return { detected: true, value: '9442@ybl' };
    }

    // 7. FALLBACK: Receiver name detection
    // When OCR can't accurately read the UPI ID (stylized fonts in GPay/Paytm),
    // check for the payment recipient's name as a strong verification signal.
    const hasReceiverName = /muffas[il1]r/i.test(text) && /a[l1I|]{2}adatkhan/i.test(text);
    if (hasReceiverName) {
        const hasPaymentContext = /paid|payment|transfer|sent|completed|success|to\s*:/i.test(text);
        if (hasPaymentContext) {
            return { detected: true, value: 'Recipient: Muffasir Alladatkhan (verified by name)' };
        }
    }
    // Also check if just the last name appears with payment context + phone number nearby
    if (/a[l1I|]{2}adatkhan/i.test(text) && /808/i.test(text)) {
        return { detected: true, value: 'Recipient: Alladatkhan (verified by name + number)' };
    }

    return { detected: false };
}

/**
 * Extract UTR / Transaction ID / Reference Number from OCR text
 * UPI UTR format: typically 12-digit number
 * Also matches labeled patterns like "UTR: XXXXX", "Ref No: XXXXX", etc.
 */
export function extractTransactionId(text: string): string | null {
    // Pattern 1: Labeled transaction IDs (highest priority)
    const labeledPatterns = [
        /(?:UTR|UPI\s*Ref|Ref(?:erence)?\s*(?:No|Number|ID)|Transaction\s*(?:ID|No|Number|Ref)|Txn\s*(?:ID|No|Ref))\s*[:\-]?\s*([A-Za-z0-9]{8,22})/gi,
        /(?:UPI\s*Transaction\s*ID|Google\s*Transaction\s*ID)\s*[:\-]?\s*([A-Za-z0-9]{8,22})/gi,
    ];

    for (const pattern of labeledPatterns) {
        const matches = [...text.matchAll(pattern)];
        for (const match of matches) {
            const id = match[1].trim();
            // UTR should be at least 8 chars, skip very short matches
            if (id.length >= 8) {
                return id;
            }
        }
    }

    // Pattern 2: Standalone 12-digit numbers (common UPI UTR format)
    const standalonePattern = /\b(\d{12,16})\b/g;
    const standaloneMatches = [...text.matchAll(standalonePattern)];

    // Filter out phone numbers (10-digit starting with 6-9) and amounts
    for (const match of standaloneMatches) {
        const num = match[1];
        // Skip if it looks like a phone number
        if (num.length === 10 && /^[6-9]/.test(num)) continue;
        // Skip if it looks like an amount (with preceding ₹ or Rs)
        const idx = match.index || 0;
        const before = text.substring(Math.max(0, idx - 5), idx);
        if (/[₹]|Rs\.?|INR/i.test(before)) continue;

        return num;
    }

    // Pattern 3: Alphanumeric reference codes (like T2401231234567890)
    const alphaNumPattern = /\b([A-Z]\d{12,20})\b/g;
    const alphaMatches = [...text.matchAll(alphaNumPattern)];
    if (alphaMatches.length > 0) {
        return alphaMatches[0][1];
    }

    return null;
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
        return '❌ This does not appear to be a payment screenshot.\n\n📋 Please upload a valid UPI payment screenshot from PhonePe/GPay/Paytm showing:\n• Amount: ₹600\n• Status: Success/Successful\n• UPI ID: xxxxxx9442-3@ybl';
    }

    // Scenario 2: UPI ID is correct but amount is wrong
    if (upiIdCheck.detected && !amountCheck.detected) {
        if (amountCheck.value) {
            return `✅ UPI ID verified: ${upiIdCheck.value}\n❌ Wrong payment amount detected: ${amountCheck.value}\n\n📋 Please upload a screenshot showing payment of exactly ₹600 to the same UPI ID.`;
        } else {
            return `✅ UPI ID verified: ${upiIdCheck.value}\n❌ Payment amount ₹600 not found in screenshot\n\n📋 Please upload a screenshot showing payment of ₹600 to the same UPI ID.`;
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
        return `✅ UPI ID verified: ${upiIdCheck.value}\n✅ Status verified: ${statusCheck.value}\n❌ Wrong payment amount (expected ₹600)\n\n📋 Please upload a screenshot showing payment of exactly ₹600.`;
    }

    // Scenario 6: Generic errors - build specific message
    if (!amountCheck.detected) {
        errors.push('❌ Payment amount ₹600 not found');
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

    return errors.join('\n') + '\n\n📋 Please upload a clear screenshot showing:\n• Amount: ₹600\n• Status: Success/Successful\n• UPI ID: xxxxxx9442-3@ybl';
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
