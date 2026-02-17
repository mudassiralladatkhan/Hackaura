import { useEffect, useState } from 'react';
import { NeonButton } from '@/components/ui/neon-button';
import { Loader2, Search, ArrowLeft, Users, Building, Mail, Phone, RefreshCw, RotateCcw, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GlassCard } from '@/components/ui/glass-card';

import { GOOGLE_SCRIPT_API_URL } from '@/lib/config';

interface Participant {
    ticketId: string;
    teamName: string;
    leaderName: string;
    college: string;
    email: string;
    phone: string;
    membersCount: number;
    status: string;
    assignedProblem?: string | null;
}

export default function ParticipantsList() {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [filteredParticipants, setFilteredParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchParticipants = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${GOOGLE_SCRIPT_API_URL}?action=getAllParticipants`);
            const result = await response.json();

            if (result.result === 'success') {
                setParticipants(result.teams);
                setFilteredParticipants(result.teams);
            }
        } catch (err) {
            console.error("Failed to fetch participants:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleResetProblem = async (ticketId: string, teamName: string) => {
        if (!window.confirm(`Are you sure you want to RESET the problem specific for team ${teamName}?`)) return;

        try {
            const response = await fetch(`${GOOGLE_SCRIPT_API_URL}?action=resetProblem&ticketId=${ticketId}`);
            const result = await response.json();
            if (result.result === 'success') {
                alert('Problem reset successfully!');
                fetchParticipants();
            } else {
                alert('Failed: ' + result.message);
            }
        } catch (e) {
            alert('Network Error');
        }
    };

    useEffect(() => {
        fetchParticipants();
    }, []);

    useEffect(() => {
        const results = participants.filter(p =>
            p.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.leaderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.college.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredParticipants(results);
    }, [searchTerm, participants]);

    return (
        <div className="min-h-screen bg-black text-foreground p-4 md:p-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <Link to="/admin">
                            <NeonButton variant="secondary" className="!p-2">
                                <ArrowLeft className="w-5 h-5" />
                            </NeonButton>
                        </Link>
                        <Link to="/admin/payments">
                            <NeonButton variant="outline" className="!p-2 text-xs" title="View Payment Screenshots">
                                <span className="mr-2">Payment Proofs</span>
                                <ExternalLink className="w-4 h-4" />
                            </NeonButton>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-tight">Participants <span className="text-cyan-400">List</span></h1>
                            <p className="text-sm text-slate-400">Total Registered Teams: {participants.length}</p>
                        </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search teams, leaders..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                        </div>
                        <button
                            onClick={fetchParticipants}
                            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
                        >
                            <RefreshCw className={`w-5 h-5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
                        <p className="text-slate-400">Loading participants...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredParticipants.length === 0 ? (
                            <div className="col-span-full text-center py-12 text-slate-500">
                                No participants found matching "{searchTerm}"
                            </div>
                        ) : (
                            filteredParticipants.map((team) => (
                                <GlassCard key={team.ticketId} className="p-5 border-l-4 border-l-cyan-500 hover:bg-slate-900/50 transition-colors">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="font-mono text-xs bg-slate-800 text-cyan-400 px-2 py-1 rounded">
                                            {team.ticketId}
                                        </span>
                                        <span className={`text-xs px-2 py-1 rounded-full border ${team.status === 'Checked In'
                                            ? 'bg-green-500/10 text-green-400 border-green-500/30'
                                            : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'
                                            }`}>
                                            {team.status}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-1 truncate">{team.teamName}</h3>
                                    <p className="text-sm text-slate-400 mb-4 flex items-center gap-1">
                                        <Building className="w-3 h-3" /> {team.college}
                                    </p>

                                    <div className="mb-4 bg-slate-900/50 p-2 rounded border border-slate-700/50">
                                        <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Problem Statement</span>
                                        <div className="text-sm text-cyan-400 font-medium">
                                            {team.assignedProblem || <span className="text-slate-600 italic">Not Assigned</span>}
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-sm border-t border-slate-800 pt-3">
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <Users className="w-4 h-4 text-purple-400" />
                                            <span className="font-medium">{team.leaderName}</span>
                                            <span className="text-xs text-slate-500">({team.membersCount} members)</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                                            <Mail className="w-3 h-3" /> {team.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                                            <Phone className="w-3 h-3" /> {team.phone}
                                        </div>
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-slate-800 flex justify-end">
                                        <button
                                            onClick={() => handleResetProblem(team.ticketId, team.teamName)}
                                            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-red-900/20"
                                            title="Reset Assigned Problem"
                                        >
                                            <RotateCcw className="w-3 h-3" /> Reset Problem
                                        </button>
                                    </div>
                                </GlassCard>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
