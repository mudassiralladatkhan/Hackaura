import { useState } from 'react';
import { motion } from 'framer-motion';

interface DiceRollProps {
    onRollComplete: (number: number) => void;
    isLocked: boolean;
}

export function DiceRoll({ onRollComplete, isLocked }: DiceRollProps) {
    const [isRolling, setIsRolling] = useState(false);
    const [result, setResult] = useState<number | null>(null);

    const rollDice = () => {
        if (isLocked || isRolling) return;

        setIsRolling(true);

        // Simulate dice roll animation
        let count = 0;
        const interval = setInterval(() => {
            setResult(Math.floor(Math.random() * 6) + 1);
            count++;

            if (count >= 20) {
                clearInterval(interval);
                const finalNumber = Math.floor(Math.random() * 6) + 1;
                setResult(finalNumber);
                setIsRolling(false);
                onRollComplete(finalNumber);
            }
        }, 100);
    };

    return (
        <div className="flex flex-col items-center gap-6">
            <motion.div
                className={`w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-6xl font-bold shadow-2xl cursor-pointer ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
                    }`}
                animate={isRolling ? { rotate: 360 } : {}}
                transition={{ duration: 0.1, repeat: isRolling ? Infinity : 0 }}
                onClick={rollDice}
            >
                {result || '?'}
            </motion.div>

            <button
                onClick={rollDice}
                disabled={isLocked || isRolling}
                className={`px-8 py-3 rounded-lg font-bold text-lg transition-all ${isLocked
                        ? 'bg-gray-600 cursor-not-allowed opacity-50'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl'
                    }`}
            >
                {isLocked ? '🔒 Locked' : isRolling ? '🎲 Rolling...' : '🎲 Roll the Dice!'}
            </button>

            {isLocked && (
                <p className="text-sm text-slate-400 text-center">
                    You've already rolled the dice. Your problem statement is locked.
                </p>
            )}
        </div>
    );
}
