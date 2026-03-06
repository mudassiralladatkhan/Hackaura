export interface HackathonStats {
    totalTeams: number;
    totalColleges: number;
}

// Hardcoded final numbers — registration is closed.
export async function fetchRegistrationStats(): Promise<HackathonStats> {
    return {
        totalTeams: 80,
        totalColleges: 27
    };
}
