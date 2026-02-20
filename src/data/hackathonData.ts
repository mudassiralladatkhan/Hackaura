export const HACKATHON_DATA = {
    name: "HACKAURA 2026",
    tagline: "Ignite. Innovate. Impact.",
    dates: "March 12-13, 2026",
    duration: "24 Hours (Non-Stop)",
    venue: "VSMs Somashekhar R Kothiwale Institute of Technology, Nipani",
    organizers: "Vikram Sarabhai Tech Club (VSTC)",
    collaboration: "Savikar & Smart Media Technology Group (Hemanth C S)",

    prizes: {
        totalPool: "₹1,00,000",
        breakdown: [
            "🏆 Main Awards (Per Domain):",
            "   - 1st Place: Cash Prize + Certificate",
            "   - 2nd Place: Cash Prize + Certificate",
            "🎨 Design Excellence Awards (Per Domain):",
            "   - 1st, 2nd, & 3rd Place: Certificate of Excellence",
            "📜 All Participants: Participation Certificates"
        ],
        special: "Trophies for Main Winners. Design Awards focus on UI/UX and creativity."
    },

    domains: [
        {
            name: "Generative AI",
            description: "Focus on AI-powered innovative solutions using generative models. Problem assigned via Dice Roll."
        },
        {
            name: "Cybersecurity",
            description: "Build robust security solutions and tools. Problem assigned via Ticket Verification."
        },
        {
            name: "Full Stack",
            description: "End-to-end web/app solutions. Problem assigned via Ticket Verification."
        },
        {
            name: "Internet of Things (IoT)",
            description: "Smart connected solutions. Problem Statement must be selected during Registration."
        }
    ],

    schedule: {
        day1: [
            { time: "11:30 AM", event: "Entry Cut-Off & Verification (Mandatory)" },
            { time: "12:00 PM", event: "Flash Mob Performance" },
            { time: "12:15 PM", event: "Grand Inauguration" },
            { time: "1:00 PM", event: "Problem Statement Reveal" },
            { time: "1:30 PM", event: "Desk Setup & Preparation" },
            { time: "2:00 PM", event: "Hackathon Begins!" },
            { time: "4:00 PM", event: "Evening Snacks & Tea" },
            { time: "8:00 PM", event: "Dinner Break" },
            { time: "10:00 PM", event: "Mentor Round 1" },
            { time: "12:00 AM", event: "Midnight Snacks" },
            { time: "2:00 AM", event: "Mentor Round 2" }
        ],
        day2: [
            { time: "6:00 AM", event: "Morning Tea & Snacks" },
            { time: "9:00 AM", event: "Breakfast" },
            { time: "9:30 AM", event: "Coding Ends - Submission Deadline" },
            { time: "10:00 AM", event: "Presentations Begin" },
            { time: "11:30 AM", event: "Judging & Results" },
            { time: "12:00 PM", event: "Prize Distribution & Closing" }
        ]
    },

    registration: {
        fee: "₹600 per team",
        teamSize: "2-4 members",
        payment: "UPI Scan & Pay. Screenshot with Amount & Success Status required.",
        requirements: [
            "Team Name",
            "College Name",
            "Team Leader Details (Email, Phone)",
            "Member Details",
            "Payment Screenshot"
        ],
        note: "IoT teams must select their problem statement during registration."
    },

    submission: {
        deadline: "March 13, 2026, 12:00 PM",
        platform: "Website / Google Script",
        requirements: [
            "Project Title & Abstract",
            "PowerPoint Presentation (PPT/PDF) - Max 1GB",
            "Source Code Repository (GitHub/GitLab)",
            "Video Demonstration (MP4/MOV/Link) - Max 1GB"
        ],
        prerequisites: "Team must be Checked In at venue & Problem Statement must be assigned.",
        process: "Validate Team Ticket -> OTP Verification -> Upload Files."
    },

    domainSelectionProcess: {
        general: "Participants verify ticket, enter OTP, and then ROLL A DIGITAL DICE (1-6) to get their problem statement.",
        iotException: "IoT teams have their problem statement pre-selected during registration (no dice roll)."
    },

    rules: [
        "Team Size: 2-4 members",
        "Registration Fee: ₹600 per team",
        "Inter-college teams are allowed",
        "Participants must carry valid College ID cards",
        "24-hour stay on campus is allowed and encouraged",
        "Participants cannot leave campus without permission during the event",
        "Code must be written during the hackathon (libraries allowed)",
        "Problem statements revealed on March 12th at venue (except IoT)"
    ],

    contacts: [
        { role: "Faculty Coordinator", name: "Prof. Prabhu Kichadi", phone: "9880437187" },
        { role: "Faculty Coordinator", name: "Prof. S.C. Gandh", phone: "7795838187" },
        { role: "Student Coordinator", name: "Sandesh Birannavar", phone: "7795031246" },
        { role: "Student Coordinator", name: "Rakshita Halluri", phone: "7204033630" },
        { role: "Student Coordinator", name: "Pankaj Babaleshwar", phone: "8217221908", email: "babaleshwarpankaj@gmail.com" }
    ],

    faqs: {
        accommodation: "Yes, accommodation is provided for the night at the venue.",
        washrooms: "Yes, separate washrooms and facilities to freshen up are available.",
        food: "Food is provided! 🍽️ Includes Evening Snacks, Dinner, Midnight Snacks, Breakfast, and Lunch. We also provide special arrangements for Sehri and Iftar for fasting participants.",
        roza: "Yes! Special arrangements for Sehri and Iftar will be provided for all participants who are observing Roza (fasting).",
        wifi: "Yes, Wi-Fi/Internet is available at the venue.",
        power: "We provide a single power socket per team. Please BRING YOUR OWN EXTENSION BOARD/SPIKE BUSTER.",
        iot: "For IoT track: You must BRING YOUR OWN COMPONENTS (Sensors, Arduino, Pi, etc.) relevant to your problem statement.",
        transport: "Transport is available from Nipani Bus Stand to the venue. You need to reach the bus stand on your own.",
        ip: "You (the students) own the intellectual property (IP) of your project code.",
        medical: "Yes, medical facilities/assistance are available on campus."
    }
};
