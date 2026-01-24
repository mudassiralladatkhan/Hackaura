export interface HackathonStats {
    totalTeams: number;
    totalColleges: number; // calculated or estimated
}

// Your existing Google Script URL from Register.tsx
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbysAGugBZQJYH9bgb14_x3MXwN91KXsgGads4NQCAjGuBOunoOtbtYr02czk7LwKwCS/exec";

export async function fetchRegistrationStats(): Promise<HackathonStats> {
    try {
        // We add action=getStats to tell the script we just want numbers
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getStats`);
        const data = await response.json();

        return {
            totalTeams: data.count || 0,
            // If the script doesn't return college count, we'll estimate or hide it
            totalColleges: data.collegeCount || Math.floor((data.count || 0) / 5)
        };
    } catch (error) {
        console.error("Failed to fetch stats:", error);
        return { totalTeams: 0, totalColleges: 0 };
    }
}
