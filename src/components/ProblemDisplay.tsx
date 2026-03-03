import { GlassCard } from './ui/glass-card';
import { Lightbulb, Target, Code } from 'lucide-react';

interface ProblemDisplayProps {
    problem: {
        number: number;
        title: string;
        description: string;
    };
    domain: string;
}

export function ProblemDisplay({ problem, domain }: ProblemDisplayProps) {
    const domainColors = {
        genai: 'from-purple-500 to-pink-500',
        cybersecurity: 'from-red-500 to-orange-500',
        fullstack: 'from-blue-500 to-cyan-500',
        iot: 'from-green-500 to-emerald-500'
    };

    const gradient = domainColors[domain.toLowerCase() as keyof typeof domainColors] || 'from-purple-500 to-pink-500';

    return (
        <div className="w-full max-w-4xl mx-auto">
            <GlassCard className="p-8">
                {/* Header */}
                <div className={`bg-gradient-to-r ${gradient} rounded-lg p-6 mb-6`}>
                    <div className="flex items-center gap-3 mb-2">
                        <Lightbulb className="w-8 h-8 text-white" />
                        <h2 className="text-3xl font-bold text-white">Problem Statement #{problem.number}</h2>
                    </div>
                    <p className="text-white/90 text-sm uppercase tracking-wider">{domain} Domain</p>
                </div>

                {/* Title */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <Target className="w-6 h-6 text-purple-400" />
                        <h3 className="text-2xl font-bold text-white">Challenge</h3>
                    </div>
                    <p className="text-xl text-slate-200 font-semibold">{problem.title}</p>
                </div>

                {/* Description */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Code className="w-6 h-6 text-purple-400" />
                        <h3 className="text-xl font-bold text-white">Description</h3>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{problem.description}</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <p className="text-center text-purple-300 text-sm">
                        🎯 <strong>Good Luck!</strong> This is your assigned problem statement. Build something amazing!
                    </p>
                </div>
            </GlassCard>
        </div>
    );
}
