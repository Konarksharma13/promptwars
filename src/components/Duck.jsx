import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Float } from '@react-three/drei';
import { useGemini } from '../context/GeminiProvider';

export default function Duck({ id, startX, speed }) {
    const meshRef = useRef();
    const { shootDuck, duckEscaped, gameState } = useGemini();
    const [dead, setDead] = useState(false);

    // Flight trajectory parameters
    const velocity = useRef(new THREE.Vector3(
        (Math.random() - 0.5) * 4, // Horizontal velocity
        2 + Math.random() * 2,     // Initial upward velocity
        0
    ));

    useFrame((state, delta) => {
        if (dead || !meshRef.current || gameState !== 'playing') return;

        // Movement: Simply add velocity to position
        meshRef.current.position.x += velocity.current.x * speed * delta;
        meshRef.current.position.y += velocity.current.y * speed * delta;

        // Z-movement: Slight depth fluctuation
        meshRef.current.position.z = Math.sin(state.clock.elapsedTime * speed) * 2 - 2;

        // Boundary Bounce (Horizontal)
        if (Math.abs(meshRef.current.position.x) > 12) {
            velocity.current.x *= -1; // Bounce back
            meshRef.current.position.x = Math.sign(meshRef.current.position.x) * 12;
        }

        // Facing direction
        meshRef.current.rotation.y = velocity.current.x > 0 ? Math.PI / 2 : -Math.PI / 2;
        meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 10) * 0.1; // Flapping tilt

        // Screen Bounds Check (Vertical and Width)
        // If duck goes too high or too far wide (despite bounce logic), user missed it
        if (meshRef.current.position.y > 10 || Math.abs(meshRef.current.position.x) > 15) {
            duckEscaped(id);
        }
    });

    const handleClick = (e) => {
        e.stopPropagation();
        if (dead) return;
        setDead(true);
        shootDuck(id);
    };

    if (dead) return null;

    return (
        <group ref={meshRef} onClick={handleClick}>
            <Float speed={5} rotationIntensity={0.2} floatIntensity={0.5}>
                {/* Body - Rounded for that 'Nano Banana' look */}
                <RoundedBox args={[0.8, 0.6, 1]} radius={0.2} smoothness={4}>
                    <meshStandardMaterial color="#ffcc00" roughness={0.1} metalness={0.2} />
                </RoundedBox>

                {/* Head */}
                <RoundedBox args={[0.5, 0.5, 0.5]} radius={0.15} position={[0, 0.5, 0.3]} smoothness={4}>
                    <meshStandardMaterial color="#00aa00" roughness={0.1} />
                </RoundedBox>

                {/* Beak */}
                <mesh position={[0, 0.5, 0.6]}>
                    <coneGeometry args={[0.1, 0.3, 4]} />
                    <meshStandardMaterial color="#ff6600" />
                </mesh>

                {/* Wings - Flapping animation simplified */}
                <mesh position={[0.45, 0, 0]} rotation={[0, 0, Math.sin(Date.now() * 0.01) * 0.5]}>
                    <boxGeometry args={[0.1, 0.4, 0.6]} />
                    <meshStandardMaterial color="#ffcc00" />
                </mesh>
                <mesh position={[-0.45, 0, 0]} rotation={[0, 0, -Math.sin(Date.now() * 0.01) * 0.5]}>
                    <boxGeometry args={[0.1, 0.4, 0.6]} />
                    <meshStandardMaterial color="#ffcc00" />
                </mesh>
            </Float>
        </group>
    );
}
