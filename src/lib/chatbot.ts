
import { HACKATHON_DATA } from '@/data/hackathonData';

export function getChatbotResponse(message: string): string {
    const lowerMsg = message.toLowerCase();

    // 1. Greetings
    if (lowerMsg.match(/\b(hi|hello|hey|greetings|start|good morning|good evening)\b/)) {
        return "Hello! I'm the Hackaura AI Assistant. 🤖 Ask me about:\n• Registration & Fees\n• Problem Statements\n• Submission Guidelines\n• Schedule & Rules";
    }

    // 2. Dates & Timing
    if (lowerMsg.match(/\b(date|when|time|duration|start|end|long)\b/)) {
        return `HACKAURA 2026 is a ${HACKATHON_DATA.duration} event happening on ${HACKATHON_DATA.dates}. It starts on Day 1 at 2:00 PM and ends on Day 2 at 12:00 PM.`;
    }

    // 3. Venue & Location
    if (lowerMsg.match(/\b(where|venue|location|place|college|address)\b/)) {
        return `The hackathon will be held at ${HACKATHON_DATA.venue}.`;
    }

    // 4. Prizes & Awards
    if (lowerMsg.match(/\b(prize|award|reward|money|cash|pool|first place|second place|winner)\b/)) {
        return `The total prize pool is ${HACKATHON_DATA.prizes.totalPool}! 🏆\n\nBreakdown:\n• ${HACKATHON_DATA.prizes.breakdown.join('\n• ')}\n\nPlus: ${HACKATHON_DATA.prizes.special}`;
    }

    // 5. Registration & Fee & Payment
    if (lowerMsg.match(/\b(register|fee|cost|pay|upi|qr code|screenshot|how to join|team size)\b/)) {
        return `Registration Fee: ${HACKATHON_DATA.registration.fee}.\n\nSteps:\n1. Fill Team & Member details.\n2. Pay ₹600 via UPI (Scan QR on form).\n3. Upload Payment Screenshot (Must show Amount & Success).\n\nNOTE: You can register easily via the 'Register Now' button!`;
    }

    // 6. Domains & Problem Statements
    if (lowerMsg.match(/\b(domain|theme|topic|subject|problem|track|idea|what to build)\b/)) {
        return "Domains:\n1. Generative AI (Dice Roll assign)\n2. Cybersecurity (Ticket Verify)\n3. Full Stack (Ticket Verify)\n4. IoT (Select during Registration!)\n\nProblem Statements (except IoT) are revealed on March 12th at the venue.";
    }

    // 7. Submission & Project Upload
    if (lowerMsg.match(/\b(submit|submission|upload|ppt|video|github|repo|code|presentation)\b/)) {
        return `Submission Requirements:\n• GitHub/GitLab Repository Link\n• PPT/PDF Presentation (Max 1GB)\n• Video Demo (Max 1GB)\n\nPrerequisite: Your team must be Checked-In at the venue.`;
    }

    // 8. Schedule
    if (lowerMsg.match(/\b(schedule|timeline|flow|agenda|program|food|dinner|lunch|breakfast)\b/)) {
        return "Day 1: Verification @ 11:30 AM -> Coding Starts @ 2:00 PM -> Dinner @ 8:00 PM.\nDay 2: Coding Ends @ 9:30 AM -> Presentations @ 10:00 AM.\n\n(Food is provided! 🍽️)";
    }

    // 9. Rules
    if (lowerMsg.match(/\b(rule|allow|restrict|bring|laptop|stay|night|sleep|id card)\b/)) {
        return "Key Rules:\n• Bring College ID (Mandatory)\n• Bring Laptops & Chargers\n• 24-hour stay allowed on campus\n• Inter-college teams allowed\n• No leaving campus seamlessly during event.";
    }

    // 10. Organizers & Contact
    if (lowerMsg.match(/\b(organizer|contact|call|help|support|coordinator|person)\b/)) {
        const contacts = HACKATHON_DATA.contacts.map(c => `${c.name} (${c.role}): ${c.phone}`).join('\n');
        return `Organized by ${HACKATHON_DATA.organizers}.\n\nContacts:\n${contacts}`;
    }

    // --- FAQs ---

    // 11. Accommodation & Stay
    if (lowerMsg.match(/(accom|acom)(mod|mad|od|ad)ation|stay|sleep|night|room|bed/)) {
        return `${HACKATHON_DATA.faqs.accommodation}\n${HACKATHON_DATA.faqs.washrooms}`;
    }

    // 12. Food & Drinks
    if (lowerMsg.match(/\b(food|eat|dinner|lunch|breakfast|snack|coffee|tea|veg|non-veg|hungry)\b/)) {
        return HACKATHON_DATA.faqs.food;
    }

    // 13. Wi-Fi & Internet
    if (lowerMsg.match(/\b(wifi|wi-fi|internet|net|connection|hotspot)\b/)) {
        return HACKATHON_DATA.faqs.wifi;
    }

    // 14. Power & Extension
    if (lowerMsg.match(/\b(power|socket|plug|extension|charge|board|spike)\b/)) {
        return `🔌 ${HACKATHON_DATA.faqs.power}`;
    }

    // 15. IoT Components
    if (lowerMsg.match(/\b(iot|component|sensor|arduino|raspberry|hardware|kit|bring)\b/)) {
        return `🛠️ ${HACKATHON_DATA.faqs.iot}\n🔌 ${HACKATHON_DATA.faqs.power}`;
    }

    // 16. Transport & Bus
    if (lowerMsg.match(/\b(transport|bus|travel|reach|commute|nipani|stand)\b/)) {
        return `🚌 ${HACKATHON_DATA.faqs.transport}`;
    }

    // 17. Intellectual Property
    if (lowerMsg.match(/\b(ip|intellectual|property|own|code|rights)\b/)) {
        return `🧠 ${HACKATHON_DATA.faqs.ip}`;
    }

    // 18. Medical
    if (lowerMsg.match(/\b(medical|sick|doctor|hospital|emergency|first aid)\b/)) {
        return `🏥 ${HACKATHON_DATA.faqs.medical}`;
    }

    // 19. Specific People
    if (lowerMsg.includes('hemanth')) return "Hemanth C S is our Event Partner from Smart Media Technology Group.";
    if (lowerMsg.includes('pankaj')) return "Pankaj Babaleshwar is a Student Coordinator (8217221908). Email: babaleshwarpankaj@gmail.com";
    if (lowerMsg.includes('sana')) return "Sana Ravat is a former coordinator.";

    // Default Fallback
    return "I'm not sure about that. Try asking about 'Fees', 'Schedule', 'Food', 'Transport', 'IoT Components', or 'Extension Boards'!";
}
