export interface HackathonStats {
    totalTeams: number;
    totalColleges: number;
}

import { GOOGLE_SCRIPT_API_URL } from './config';

export async function fetchRegistrationStats(): Promise<HackathonStats> {
    try {
        const response = await fetch(`${GOOGLE_SCRIPT_API_URL}?action=getStats`);
        const data = await response.json();
        return {
            totalTeams: data.count || 0,
            totalColleges: data.collegeCount || 0
        };
    } catch (error) {
        console.error("Failed to fetch stats:", error);
        return { totalTeams: 0, totalColleges: 0 };
    }
}

