import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, RoundedBox, Float } from '@react-three/drei';
import { useGemini } from '../context/GeminiProvider';

export default function RobotDog() {
    const meshRef = useRef();
    const { roastMessage, gameState } = useGemini();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (gameState === 'intro') {
            setVisible(true);
        } else if (gameState === 'playing' || gameState === 'gameover') {
            // Delay hiding slightly for a transition effect if desired, or hide immediately
            setVisible(false);
        }
    }, [gameState]);

    useFrame((state) => {
        if (!meshRef.current || !visible) return;
        const time = state.clock.getElapsedTime();

        // Jump/Bark animation during intro
        meshRef.current.position.y = -0.8 + Math.abs(Math.sin(time * 10)) * 0.4;
        meshRef.current.rotation.x = Math.sin(time * 5) * 0.1;
    });

    if (!visible || gameState === 'menu') return null;

    return (
        <group ref={meshRef} position={[0, -0.8, 4]}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                {/* Simplified, cuter head */}
                <RoundedBox args={[0.5, 0.4, 0.4]} radius={0.15} smoothness={4}>
                    <meshStandardMaterial color="#ffffff" metalness={0.6} roughness={0.1} />
                </RoundedBox>

                {/* Face plate */}
                <RoundedBox args={[0.4, 0.3, 0.05]} radius={0.05} position={[0, -0.05, 0.2]} smoothness={4}>
                    <meshStandardMaterial color="#1a1a1a" />
                </RoundedBox>

                {/* Glowing Eyes */}
                <mesh position={[0.12, 0, 0.23]}>
                    <planeGeometry args={[0.06, 0.04]} />
                    <meshBasicMaterial color="#00ffcc" />
                </mesh>
                <mesh position={[-0.12, 0, 0.23]}>
                    <planeGeometry args={[0.06, 0.04]} />
                    <meshBasicMaterial color="#00ffcc" />
                </mesh>

                {/* Floppy ears */}
                <mesh position={[0.25, 0.1, 0]} rotation={[0, 0, -0.2]}>
                    <boxGeometry args={[0.08, 0.3, 0.15]} />
                    <meshStandardMaterial color="#ffffff" />
                </mesh>
                <mesh position={[-0.25, 0.1, 0]} rotation={[0, 0, 0.2]}>
                    <boxGeometry args={[0.08, 0.3, 0.15]} />
                    <meshStandardMaterial color="#ffffff" />
                </mesh>
            </Float>

            {/* Intro Message */}
            {roastMessage && gameState === 'intro' && (
                <Html position={[0, 0.8, 0]} center>
                    <div className="bg-white px-4 py-2 rounded-2xl text-black font-black text-xs uppercase tracking-tighter border-2 border-cyan-400 shadow-[0_0_15px_rgba(0,255,204,0.5)]">
                        {roastMessage}
                    </div>
                </Html>
            )}
        </group>
    );
}
