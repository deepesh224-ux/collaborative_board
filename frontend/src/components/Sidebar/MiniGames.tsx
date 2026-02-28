import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, X } from 'lucide-react';
import { getStore } from '../../store/yjsSetup';

export const MiniGames = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);

    useEffect(() => {
        const { ydoc } = getStore();
        const yGame = ydoc.getMap('tic-tac-toe');

        const updateGame = () => {
            const gBoard = yGame.get('board') as (string | null)[];
            const gNext = yGame.get('xIsNext') as boolean;
            if (gBoard) setBoard(gBoard);
            if (typeof gNext === 'boolean') setXIsNext(gNext);
        };

        yGame.observe(updateGame);
        updateGame();
        return () => yGame.unobserve(updateGame);
    }, []);

    const handleClick = (i: number) => {
        const { ydoc } = getStore();
        const yGame = ydoc.getMap('tic-tac-toe');
        const currentBoard = yGame.get('board') as (string | null)[] || Array(9).fill(null);
        const currentNext = yGame.get('xIsNext') as boolean ?? true;

        if (currentBoard[i] || calculateWinner(currentBoard)) return;

        const nextBoard = currentBoard.slice();
        nextBoard[i] = currentNext ? 'X' : 'O';

        yGame.set('board', nextBoard);
        yGame.set('xIsNext', !currentNext);
    };

    const resetGame = () => {
        const { ydoc } = getStore();
        const yGame = ydoc.getMap('tic-tac-toe');
        yGame.set('board', Array(9).fill(null));
        yGame.set('xIsNext', true);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!isOpen ? (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(true)}
                    className="glass-panel p-4 rounded-2xl flex items-center gap-2 border border-white/20 hover:bg-white/10"
                >
                    <Gamepad2 size={24} className="text-purple-400" />
                    <span className="text-white font-medium">Mini Games</span>
                </motion.button>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="glass-panel p-6 rounded-3xl border border-white/20 w-80 shadow-2xl"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white tracking-tight">Tic-Tac-Toe</h3>
                        <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-6">
                        {board.map((cell, i) => (
                            <button
                                key={i}
                                onClick={() => handleClick(i)}
                                className="h-20 w-full glass-panel border border-white/10 flex items-center justify-center text-2xl font-bold rounded-xl hover:bg-white/5 transition-colors"
                            >
                                <span className={cell === 'X' ? 'text-blue-400' : 'text-rose-400'}>{cell}</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-xs text-white/50">Next: {xIsNext ? 'X' : 'O'}</span>
                        <button onClick={resetGame} className="text-xs text-blue-400 hover:underline">Reset</button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

function calculateWinner(squares: (string | null)[]) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}
