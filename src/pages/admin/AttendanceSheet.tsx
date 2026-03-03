import { useEffect, useState } from 'react';
import { NeonButton } from '@/components/ui/neon-button';
import { Printer, ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

import { GOOGLE_SCRIPT_API_URL } from '@/lib/config';

export default function AttendanceSheet() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${GOOGLE_SCRIPT_API_URL}?action=getAttendanceList`);
            const result = await response.json();

            if (result.result === 'success') {
                setData(result.teams);
            }
        } catch (err) {
            console.error("Failed to fetch attendance list:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-white text-black p-8 font-serif print:p-0 print:bg-white">

            {/* NO-PRINT HEADER */}
            <div className="print:hidden flex items-center justify-between mb-8 bg-slate-100 p-4 rounded-lg border border-slate-200">
                <div className="flex items-center gap-4">
                    <Link to="/admin">
                        <NeonButton variant="secondary" className="!text-black !border-slate-300">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                        </NeonButton>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Attendance Sheet Generator</h1>
                        <p className="text-sm text-slate-500">Only "Checked In" teams are shown below.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchData} className="p-2 text-slate-600 hover:text-blue-600 transition-colors">
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <NeonButton onClick={() => window.print()} className="!bg-blue-600 !text-white !border-none hover:!bg-blue-700">
                        <Printer className="w-4 h-4 mr-2" /> Print Sheet
                    </NeonButton>
                </div>
            </div>

            {/* PRINTABLE SHEET */}
            <div className="max-w-[210mm] mx-auto bg-white">

                {/* Sheet Header */}
                <div className="text-center border-b-2 border-black pb-4 mb-4">
                    <h1 className="text-3xl font-bold uppercase tracking-wide">Hackaura 2026</h1>
                    <h2 className="text-lg font-semibold uppercase mt-1">Official Attendance Sheet</h2>
                    <p className="text-sm mt-2">Venue: VSM Institute of Technology, Nipani • Date: {new Date().toLocaleDateString()}</p>
                </div>

                {loading ? (
                    <div className="py-12 text-center text-slate-400">Loading data...</div>
                ) : (
                    <table className="w-full border-collapse border border-black text-sm">
                        <thead>
                            <tr className="bg-slate-100 print:bg-slate-100">
                                <th className="border border-black p-2 w-12 text-center bg-gray-200 print:bg-gray-200">#</th>
                                <th className="border border-black p-2 w-24 text-left">Ticket ID</th>
                                <th className="border border-black p-2 text-left">Team Details</th>
                                <th className="border border-black p-2 w-32 text-center">Time</th>
                                <th className="border border-black p-2 w-48 text-center">Signature (Leader)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-slate-500 italic">No teams have checked in yet.</td>
                                </tr>
                            ) : (
                                data.map((team, idx) => (
                                    <tr key={idx} className="break-inside-avoid">
                                        <td className="border border-black p-2 text-center font-bold">{idx + 1}</td>
                                        <td className="border border-black p-2 font-mono font-bold">{team.ticketId}</td>
                                        <td className="border border-black p-2">
                                            <div className="font-bold text-base">{team.teamName}</div>
                                            <div className="text-xs mt-1">L: {team.leaderName}</div>
                                            <div className="text-xs text-slate-600">M: {team.members}</div>
                                        </td>
                                        <td className="border border-black p-2 text-center font-mono text-xs">
                                            {team.checkInTime && team.checkInTime !== 'N/A' ? (
                                                team.checkInTime.includes(',')
                                                    ? team.checkInTime.split(',')[1].trim()
                                                    : team.checkInTime
                                            ) : '-'}
                                        </td>
                                        <td className="border border-black p-2 text-center">
                                            {team.signature ? (
                                                <img
                                                    src={team.signature}
                                                    alt="Signature"
                                                    className="max-w-[120px] max-h-[60px] mx-auto"
                                                    style={{ imageRendering: 'auto' }}
                                                />
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}

                <div className="mt-8 pt-8 border-t border-black flex justify-between text-xs">
                    <div>Coordinator Signature: __________________________</div>
                    <div>Page 1 of 1</div>
                </div>

            </div>
        </div>
    );
}
