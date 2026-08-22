import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Reduced particle count for better performance on mobile/lower-end devices
const PARTICLE_COUNT = 800;
const CONNECTION_DISTANCE = 2.8;
const MAX_CONNECTIONS = 3;

function DataParticles({ isActive, reducedMotion }) {
  const pointsRef = useRef();
  const positionsRef = useRef(new Float32Array(PARTICLE_COUNT * 3));
  const velocitiesRef = useRef(new Float32Array(PARTICLE_COUNT * 3));
  const colorsRef = useRef(new Float32Array(PARTICLE_COUNT * 3));
  const sizesRef = useRef(new Float32Array(PARTICLE_COUNT));
  const phasesRef = useRef(new Float32Array(PARTICLE_COUNT));
  const connectionLinesRef = useRef(null);
  const geometryRef = useRef(null);
  const materialRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const positions = positionsRef.current;
    const velocities = velocitiesRef.current;
    const colors = colorsRef.current;
    const sizes = sizesRef.current;
    const phases = phasesRef.current;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const radius = 1.5 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      velocities[i * 3] = (Math.random() - 0.5) * 0.002;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002;

      const colorChoice = Math.random();
      if (colorChoice < 0.4) {
        colors[i * 3] = 0.23;
        colors[i * 3 + 1] = 0.51;
        colors[i * 3 + 2] = 0.96;
      } else if (colorChoice < 0.7) {
        colors[i * 3] = 0.06;
        colors[i * 3 + 1] = 0.69;
        colors[i * 3 + 2] = 0.51;
      } else {
        colors[i * 3] = 0.96;
        colors[i * 3 + 1] = 0.6;
        colors[i * 3 + 2] = 0.06;
      }

      sizes[i] = 1.5 + Math.random() * 2.5;
      phases[i] = Math.random() * Math.PI * 2;
    }
  }, []);

  useFrame((state, delta) => {
    if (!isActive || reducedMotion) return;

    timeRef.current += delta;
    const positions = positionsRef.current;
    const velocities = velocitiesRef.current;
    const phases = phasesRef.current;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] += velocities[i * 3];
      positions[i * 3 + 1] += velocities[i * 3 + 1];
      positions[i * 3 + 2] += velocities[i * 3 + 2];

      const radius = Math.sqrt(
        positions[i * 3] ** 2 +
        positions[i * 3 + 1] ** 2 +
        positions[i * 3 + 2] ** 2
      );

      if (radius > 5.5) {
        const force = (radius - 5.5) * 0.01;
        positions[i * 3] -= positions[i * 3] / radius * force;
        positions[i * 3 + 1] -= positions[i * 3 + 1] / radius * force;
        positions[i * 3 + 2] -= positions[i * 3 + 2] / radius * force;
      } else if (radius < 1.2) {
        const force = (1.2 - radius) * 0.01;
        positions[i * 3] += positions[i * 3] / radius * force;
        positions[i * 3 + 1] += positions[i * 3 + 1] / radius * force;
        positions[i * 3 + 2] += positions[i * 3 + 2] / radius * force;
      }

      phases[i] += delta * 0.5;
    }

    if (geometryRef.current) {
      geometryRef.current.attributes.position.needsUpdate = true;
    }
  });

  const connectionGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const maxLines = PARTICLE_COUNT * MAX_CONNECTIONS;
    const linePositions = new Float32Array(maxLines * 6);
    const lineColors = new Float32Array(maxLines * 6);
    const lineAlphas = new Float32Array(maxLines * 2);

    geometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
    geometry.setAttribute('alpha', new THREE.BufferAttribute(lineAlphas, 1));

    connectionLinesRef.current = {
      positions: linePositions,
      colors: lineColors,
      alphas: lineAlphas,
      count: 0,
    };

    return geometry;
  }, []);

  const connectionMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  useFrame(() => {
    if (!isActive || reducedMotion || !connectionLinesRef.current) return;

    const positions = positionsRef.current;
    const conn = connectionLinesRef.current;
    conn.count = 0;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      if (conn.count >= PARTICLE_COUNT * MAX_CONNECTIONS) break;

      let connections = 0;
      for (let j = i + 1; j < PARTICLE_COUNT && connections < MAX_CONNECTIONS; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < CONNECTION_DISTANCE) {
          const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.3;
          const idx = conn.count * 6;

          conn.positions[idx] = positions[i * 3];
          conn.positions[idx + 1] = positions[i * 3 + 1];
          conn.positions[idx + 2] = positions[i * 3 + 2];
          conn.positions[idx + 3] = positions[j * 3];
          conn.positions[idx + 4] = positions[j * 3 + 1];
          conn.positions[idx + 5] = positions[j * 3 + 2];

          const c1 = conn.count % 3;
          const r = c1 === 0 ? 0.23 : c1 === 1 ? 0.06 : 0.96;
          const g = c1 === 0 ? 0.51 : c1 === 1 ? 0.69 : 0.6;
          const b = c1 === 0 ? 0.96 : c1 === 1 ? 0.51 : 0.06;

          conn.colors[idx] = r;
          conn.colors[idx + 1] = g;
          conn.colors[idx + 2] = b;
          conn.colors[idx + 3] = r;
          conn.colors[idx + 4] = g;
          conn.colors[idx + 5] = b;

          conn.alphas[conn.count * 2] = alpha;
          conn.alphas[conn.count * 2 + 1] = alpha;

          conn.count++;
          connections++;
        }
      }
    }

    if (connectionLinesRef.current.positions) {
      connectionGeometry.attributes.position.needsUpdate = true;
      connectionGeometry.attributes.color.needsUpdate = true;
      connectionGeometry.attributes.alpha.needsUpdate = true;
      connectionGeometry.setDrawRange(0, conn.count * 2);
    }
  });

  return (
    <>
      <points ref={pointsRef} onPointerOver={(e) => (e.object.material.size = 4)}>
        <bufferGeometry ref={geometryRef} attach="geometry">
          <bufferAttribute attachObject={['attributes', 'position']} array={positionsRef.current} itemSize={3} />
          <bufferAttribute attachObject={['attributes', 'color']} array={colorsRef.current} itemSize={3} />
          <bufferAttribute attachObject={['attributes', 'size']} array={sizesRef.current} itemSize={1} />
        </bufferGeometry>
        <pointsMaterial
          ref={materialRef}
          attach="material"
          size={2}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <lineSegments>
        <bufferGeometry ref={connectionGeometry} attach="geometry" />
        <material ref={connectionMaterial} attach="material" />
      </lineSegments>
    </>
  );
}

function HeroSceneContent({ reducedMotion }) {
  const [isActive, setIsActive] = React.useState(false);
  const groupRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => setIsActive(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current && !reducedMotion) {
      groupRef.current.rotation.y += delta * 0.02;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <DataParticles isActive={isActive} reducedMotion={reducedMotion} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 7]} intensity={0.8} color="#3B82F6" />
      <directionalLight position={[-5, -5, -7]} intensity={0.4} color="#10B981" />
      <pointLight position={[0, 5, 0]} intensity={0.3} color="#F59E0B" decay={2} distance={15} />
    </group>
  );
}

export default function HeroScene() {
  const prefersReducedMotion = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [hasReducedMotion, setHasReducedMotion] = React.useState(prefersReducedMotion);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setHasReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[500px] max-h-[700px]">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%', display: 'block' }}
        shadows={false}
      >
        <HeroSceneContent reducedMotion={hasReducedMotion} />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-transparent pointer-events-none" />
    </div>
  );
}