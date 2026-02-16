import React from 'react';
import { useGemini } from '../context/GeminiProvider';

export default function HUD() {
    const { score, round, gameState, startGame, totalClicks } = useGemini();

    return (
        <>
            <div className="fixed inset-0 pointer-events-none p-4 flex flex-col justify-between">
                {/* Top Header - Compact */}
                <div className="flex justify-between items-start">
                    <div className="bg-black/40 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10 text-white min-w-[120px]">
                        <div className="text-cyan-400 text-[8px] font-bold uppercase tracking-widest">Score</div>
                        <div className="text-xl font-mono leading-none">{score.toString().padStart(6, '0')}</div>
                    </div>

                    <div className="bg-black/40 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10 text-white text-center">
                        <div className="text-yellow-400 text-[8px] font-bold uppercase tracking-widest">Round</div>
                        <div className="text-xl font-bold leading-none">{round}</div>
                    </div>
                </div>

                {/* Clicks tracking - 5 clicks allowed */}
                <div className="flex justify-center mb-4">
                    <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 flex flex-col items-center">
                        <div className="text-[8px] text-white/50 uppercase mb-1">Total Shots (Limit 5)</div>
                        <div className="flex gap-2">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-3 h-3 rounded-full border ${i < totalClicks
                                            ? 'bg-red-500 border-red-400 shadow-[0_0_5px_rgba(255,0,0,0.8)]'
                                            : 'bg-white/10 border-white/5'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Crosshair - Even smaller/cleaner */}
            <div className="fixed top-1/2 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50">
                <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-red-500 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_5px_#ff0000]"></div>
            </div>

            {/* Overlays */}
            {(gameState === 'menu' || gameState === 'gameover') && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md">
                    <div className="text-center p-8 bg-black/60 rounded-3xl border border-white/10 shadow-2xl">
                        <h1 className="text-5xl font-black text-white mb-1 tracking-tighter">
                            DUCK HUNT
                        </h1>
                        <div className="text-cyan-400 font-mono tracking-widest text-xs mb-8">NANO BANANA 2026</div>

                        {gameState === 'gameover' && (
                            <div className="mb-6">
                                <div className="text-red-500 font-bold uppercase text-xs">Terminated</div>
                                <div className="text-white text-3xl font-black uppercase mb-2">Game Over</div>
                                <div className="text-white/40 text-[10px] font-mono">Score: {score}</div>
                            </div>
                        )}

                        <button
                            onClick={startGame}
                            className="px-10 py-4 bg-white text-black font-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl"
                        >
                            {gameState === 'menu' ? 'START' : 'RETRY'}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
