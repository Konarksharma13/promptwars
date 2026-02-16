# Duck Hunt 2026 (Nano Banana Edition)

A high-fidelity 3D remake of the classic Duck Hunt, built with React, Three.js, and Tailwind CSS.

## Features
- **Nano Banana Aesthetics**: Polished 3D assets with vibrant colors and smooth geometry.
- **Cyber-Duck Mechanics**: Smooth, challenging flight paths with bounce physics.
- **Nano-Pup Companion**: A robotic dog that introduces the game and reacts to your shots.
- **Performance Optimized**: Uses instanced rendering for a lush grass field.
- **Cloud Ready**: Dockerized and ready for Google Cloud Run deployment.

## Tech Stack
- **Frontend**: React, Vite
- **3D Engine**: React Three Fiber, Three.js
- **Styling**: Tailwind CSS v4
- **State Management**: React Context (GeminiProvider)

## Getting Started
1. `npm install`
2. `npm run dev`

## Deployment
Packaged with Docker. To build:
`docker build -t duck-hunt-2026 .`
