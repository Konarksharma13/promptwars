import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sky, Stars, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { useGemini } from '../context/GeminiProvider';
import Duck from './Duck';
import RobotDog from './RobotDog';

function Grass() {
    const meshRef = useRef();
    const count = 1500; // Reduced for performance/stability
    const dummy = useMemo(() => new THREE.Object3D(), []);

    // Custom geometry for a blade of grass: a simple curved plane
    const geometry = useMemo(() => {
        const geo = new THREE.PlaneGeometry(0.1, 0.8, 1, 4);
        geo.translate(0, 0.4, 0); // Origin at bottom
        // Bend the geometry slightly
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const y = pos.getY(i);
            const skew = Math.pow(y, 2) * 0.2;
            pos.setX(i, pos.getX(i) + skew);
        }
        return geo;
    }, []);

    const instances = useMemo(() => {
        const data = [];
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 60;
            const z = (Math.random() - 0.5) * 40 - 5;
            const scale = 0.4 + Math.random() * 0.8;
            const rotationY = Math.random() * Math.PI;
            data.push({ x, z, scale, rotationY });
        }
        return data;
    }, []);

    useFrame((state) => {
        if (!meshRef.current) return;
        const time = state.clock.getElapsedTime();
        instances.forEach((instance, i) => {
            dummy.position.set(instance.x, -2, instance.z);
            dummy.scale.set(instance.scale, instance.scale, instance.scale);

            // Wind animation: sway based on position and time
            const sway = Math.sin(time * 2 + instance.x * 0.5 + instance.z * 0.3) * 0.2;
            dummy.rotation.set(sway, instance.rotationY, 0);

            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[geometry, null, count]}>
            <meshStandardMaterial color="#3a5f2a" side={THREE.DoubleSide} roughness={0.6} />
        </instancedMesh>
    );
}

export default function Scene() {
    const { ducks, incrementClicks, gameState } = useGemini();

    // Bullet sound synthesizer
    const playShot = () => {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    };

    const handlePointerDown = (e) => {
        if (gameState !== 'playing') return;
        playShot();
        incrementClicks();
    };

    return (
        <Canvas
            shadows
            camera={{ position: [0, 1, 12], fov: 45 }}
            onPointerDown={handlePointerDown}
            gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        >
            <color attach="background" args={['#87CEEB']} />
            <Environment preset="park" />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} castShadow shadow-mapSize={[2048, 2048]} />
            <Sky sunPosition={[100, 20, 100]} />
            <Stars depth={100} />
            <Grass />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="#1a3311" />
            </mesh>
            <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.35} far={10} color="#000000" />

            <RobotDog />
            {ducks.map((duck) => (
                <Duck key={duck.id} id={duck.id} startX={duck.startX} speed={duck.speed} />
            ))}
        </Canvas>
    );
}
