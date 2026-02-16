import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

const GeminiContext = createContext();

export const useGemini = () => useContext(GeminiContext);

const ROASTS = [
    "My grandma aims better than that!",
    "Are you trying to miss?",
    "Calculated probability of hit: 0%.",
    "That duck was laughing at you.",
    "System error: User aim not found.",
    "Maybe try using your eyes next time?",
    "I've seen better shooting from a stormtrooper.",
];

export const GeminiProvider = ({ children }) => {
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1);
    const [gameState, setGameState] = useState('menu'); // 'menu', 'intro', 'playing', 'gameover'
    const [ducks, setDucks] = useState([]);
    const [roastMessage, setRoastMessage] = useState("Ready player one?");
    const [bullets, setBullets] = useState(5);
    const [totalClicks, setTotalClicks] = useState(0);

    const startGame = () => {
        setScore(0);
        setRound(1);
        setBullets(5);
        setTotalClicks(0);
        setGameState('intro');
        setRoastMessage("I am Nano-Pup! Prepare to lose.");
        setDucks([]); // Clear any old ducks
    };

    // Phase transition: intro -> playing
    useEffect(() => {
        if (gameState === 'intro') {
            const timer = setTimeout(() => {
                setGameState('playing');
                spawnDucks(1);
            }, 4000); // 4 second intro
            return () => clearTimeout(timer);
        }
    }, [gameState]);

    const spawnDucks = (count) => {
        const limitedCount = Math.min(count, 3);
        const newDucks = [];
        for (let i = 0; i < limitedCount; i++) {
            newDucks.push({
                id: uuidv4(),
                speed: 0.8 + Math.random() * 1.2 + (round * 0.2), // Slower initial speed
                startX: (Math.random() - 0.5) * 10,
                active: true,
            });
        }
        setDucks(newDucks);
        setBullets(5);
    };

    const incrementClicks = () => {
        if (gameState !== 'playing') return;
        setTotalClicks(prev => {
            const next = prev + 1;
            if (next >= 5) {
                setGameState('gameover');
                setRoastMessage("Too many clicks! System shutdown.");
            }
            return next;
        });
    };

    const shootDuck = (id) => {
        if (gameState !== 'playing') return;

        // Total clicks logic handles bullets and game over
        setDucks(prev => {
            const duck = prev.find(d => d.id === id);
            if (duck && duck.active) {
                setScore(s => s + 10);
                return prev.filter(d => d.id !== id);
            }
            return prev;
        });
    };

    const duckEscaped = (id) => {
        if (gameState !== 'playing') return;
        setGameState('gameover');
        setRoastMessage("A duck escaped! You're fired.");
    };

    // Check round end
    useEffect(() => {
        if (gameState === 'playing' && ducks.length === 0) {
            handleRoundEnd();
        }
    }, [ducks, gameState]);

    const handleRoundEnd = () => {
        const randomRoast = ROASTS[Math.floor(Math.random() * ROASTS.length)];
        setRoastMessage(`Round ${round} Clear! Gemini: "${randomRoast}"`);

        setTimeout(() => {
            setRound(r => r + 1);
            spawnDucks(Math.min(round + 1, 3));
        }, 3000);
    };

    return (
        <GeminiContext.Provider value={{
            score,
            round,
            gameState,
            ducks,
            roastMessage,
            bullets,
            totalClicks,
            startGame,
            shootDuck,
            duckEscaped,
            incrementClicks
        }}>
            {children}
        </GeminiContext.Provider>
    );
};
