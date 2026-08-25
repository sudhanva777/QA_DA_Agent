import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';

// Extend React Three Fiber catalogue with Three.js Line2 fat lines
extend({ Line2, LineGeometry, LineMaterial });

const ThreeSceneContext = createContext(null);

export function ThreeSceneProvider({ children }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [cameraTarget, setCameraTarget] = useState(new THREE.Vector3(0, 0, 0));
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [viewport, setViewport] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handler = (e) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / docHeight, 1);
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const value = {
    scrollProgress,
    isReducedMotion,
    cameraTarget,
    setCameraTarget,
    mousePosition,
    viewport,
  };

  return (
    <ThreeSceneContext.Provider value={value}>
      {children}
    </ThreeSceneContext.Provider>
  );
}

export function useThreeScene() {
  const context = useContext(ThreeSceneContext);
  if (!context) {
    throw new Error('useThreeScene must be used within a ThreeSceneProvider');
  }
  return context;
}

export function ThreeSceneCanvas({ children, className = 'fixed inset-0 -z-10 pointer-events-none', cameraPosition = [0, 0, 12] }) {
  const { scrollProgress, isReducedMotion, cameraTarget, mousePosition, viewport } = useThreeScene();

  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: cameraPosition, fov: 50, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: false, logarithmicDepthBuffer: true }}
        style={{ width: '100%', height: '100%', display: 'block' }}
        shadows={false}
        dpr={Math.min(window.devicePixelRatio, 2)}
      >
        <color attach="background" args={['#050507']} />
        <fog attach="fog" args={['#050507', 3, 60]} />
        
        <ambientLight intensity={0.35} color="#1a1a2e" />
        <directionalLight position={[8, 15, 8]} intensity={0.5} color="#8B5CF6" />
        <pointLight position={[-8, 8, -8]} intensity={0.35} color="#06B6D4" distance={40} decay={1.5} />
        <pointLight position={[0, -10, 0]} intensity={0.25} color="#6366F1" distance={30} decay={1.5} />
        <hemisphereLight skyColor="#0a0a1a" groundColor="#050507" intensity={0.4} />

        <SceneContent 
          scrollProgress={scrollProgress} 
          reducedMotion={isReducedMotion} 
          cameraTarget={cameraTarget}
          mousePosition={mousePosition}
          viewport={viewport}
        />
        
        {children}
      </Canvas>
    </div>
  );
}

function SceneContent({ scrollProgress, reducedMotion, cameraTarget, mousePosition, viewport }) {
  const { camera, scene } = useThree();
  const cameraRef = useRef(camera);
  cameraRef.current = camera;

  useFrame((state, _delta) => {
    if (reducedMotion) return;

    const t = state.clock.elapsedTime;
    
    const baseX = Math.sin(t * 0.06) * 2.5 + Math.sin(t * 0.02) * 0.8;
    const baseY = Math.cos(t * 0.05) * 1.5 + Math.sin(t * 0.03) * 0.6;
    const baseZ = 12 + Math.sin(t * 0.025) * 2 + scrollProgress * 35;

    const mouseInfluenceX = mousePosition.x * 1.5;
    const mouseInfluenceY = mousePosition.y * 1.2;

    const targetX = baseX + mouseInfluenceX;
    const targetY = baseY + mouseInfluenceY;
    const targetZ = baseZ;

    cameraRef.current.position.lerp(
      new THREE.Vector3(targetX, targetY, targetZ),
      0.015
    );

    const lookAtX = cameraTarget.x + mouseInfluenceX * 0.5;
    const lookAtY = cameraTarget.y + mouseInfluenceY * 0.4;
    cameraRef.current.lookAt(lookAtX, lookAtY, cameraTarget.z - 20);

    scene.rotation.y = Math.sin(t * 0.008) * 0.015;
  });

  return (
    <>
      <ParticleField count={1200} spread={50} size={0.015} color="#A5B4FC" opacity={0.25} speed={0.0015} layer="far" />
      <ParticleField count={600} spread={35} size={0.03} color="#6366F1" opacity={0.35} speed={0.003} layer="mid" />
      <ParticleField count={300} spread={20} size={0.05} color="#8B5CF6" opacity={0.45} speed={0.005} layer="near" />
      <ParticleField count={150} spread={15} size={0.08} color="#06B6D4" opacity={0.5} speed={0.007} layer="near" />
      
      <FloatingDataNodes scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
      <DataOrbCore position={[0, 0, -18 - scrollProgress * 20]} reducedMotion={reducedMotion} />
      <OrbitingRings position={[0, 0, -18 - scrollProgress * 20]} reducedMotion={reducedMotion} />
      <FloatingGeometry scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
      <ConnectionLines scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
      <DistantGlows reducedMotion={reducedMotion} />
    </>
  );
}

function ParticleField({ count, spread, size, color, opacity, speed, layer }) {
  const positionsRef = useRef(null);
  const velocitiesRef = useRef(null);
  const { clock } = useThree();
  const reducedMotion = useThreeScene().isReducedMotion;

  const zOffset = useMemo(() => {
    switch (layer) {
      case 'far': return -30;
      case 'mid': return -10;
      case 'near': return 5;
      default: return 0;
    }
  }, [layer]);

  useEffect(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = Math.random() * spread;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi) + zOffset;
      velocities[i * 3] = (Math.random() - 0.5) * 0.002;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.001;
    }
    positionsRef.current = positions;
    velocitiesRef.current = velocities;
  }, [count, spread, zOffset]);

  useFrame(() => {
    if (reducedMotion || !positionsRef.current) return;
    const positions = positionsRef.current;
    const velocities = velocitiesRef.current;
    const t = clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      positions[i * 3] += velocities[i * 3] + Math.sin(t * speed + i * 0.1) * 0.0008;
      positions[i * 3 + 1] += velocities[i * 3 + 1] + Math.cos(t * speed + i * 0.07) * 0.0006;
      positions[i * 3 + 2] += velocities[i * 3 + 2] + Math.sin(t * speed * 0.5 + i * 0.03) * 0.0004;
      
      if (positions[i * 3 + 1] > spread / 2) positions[i * 3 + 1] = -spread / 2;
      if (positions[i * 3 + 1] < -spread / 2) positions[i * 3 + 1] = spread / 2;
      if (positions[i * 3] > spread / 2) positions[i * 3] = -spread / 2;
      if (positions[i * 3] < -spread / 2) positions[i * 3] = spread / 2;
    }
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positionsRef.current || new Float32Array(count * 3)}
          count={count}
          itemSize={3}
          usage={THREE.DynamicDrawUsage}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </points>
  );
}

function DataOrbCore({ position, reducedMotion }) {
  const groupRef = useRef();
  const innerCoreRef = useRef();
  const outerShellRef = useRef();
  const { clock } = useThree();

  useFrame((state, delta) => {
    if (reducedMotion) return;
    const t = clock.elapsedTime;
    
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
      groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.05;
    }
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y -= delta * 0.15;
      innerCoreRef.current.rotation.x += delta * 0.08;
      innerCoreRef.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.04);
    }
    if (outerShellRef.current) {
      outerShellRef.current.rotation.y += delta * 0.04;
      outerShellRef.current.rotation.z += delta * 0.02;
      outerShellRef.current.scale.setScalar(1 + Math.sin(t * 0.8) * 0.02);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh ref={innerCoreRef}>
        <sphereGeometry args={[2.2, 56, 56]} />
        <meshStandardMaterial
          color="#8B5CF6"
          emissive="#6366F1"
          emissiveIntensity={0.7}
          roughness={0.05}
          metalness={0.95}
          transparent
          opacity={0.85}
        />
      </mesh>
      <mesh ref={outerShellRef}>
        <icosahedronGeometry args={[3.2, 4]} />
        <meshStandardMaterial
          color="#6366F1"
          emissive="#4338CA"
          emissiveIntensity={0.3}
          wireframe
          transparent
          opacity={0.18}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[3.8, 32, 32]} />
        <meshBasicMaterial
          color="#8B5CF6"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={3} color="#8B5CF6" distance={25} decay={1.8} />
      <pointLight position={[0, 0, 0]} intensity={1.5} color="#06B6D4" distance={35} decay={2} />
    </group>
  );
}

function OrbitingRings({ position, reducedMotion }) {
  const ringRefs = useRef([]);

  useFrame((state, delta) => {
    if (reducedMotion) return;
    
    ringRefs.current.forEach((ref, i) => {
      if (ref) {
        const speeds = [0.22, 0.18, 0.15, 0.12];
        const axes = [
          [0.3, 0.8, 0.2],
          [-0.6, 0.4, 0.7],
          [0.9, -0.3, 0.4],
          [-0.4, -0.7, 0.5],
        ];
        ref.rotation.x += delta * speeds[i] * axes[i][0];
        ref.rotation.y += delta * speeds[i] * axes[i][1];
        ref.rotation.z += delta * speeds[i] * axes[i][2];
      }
    });
  });

  const ringConfigs = [
    { radius: 4.2, tube: 0.012, color: "#6366F1", opacity: 0.45, rotation: [0.4, 0.2, 0] },
    { radius: 5.0, tube: 0.01, color: "#8B5CF6", opacity: 0.3, rotation: [-0.6, 0.5, 0.8] },
    { radius: 5.8, tube: 0.008, color: "#06B6D4", opacity: 0.22, rotation: [1.1, -0.4, -0.3] },
    { radius: 6.8, tube: 0.006, color: "#A5B4FC", opacity: 0.15, rotation: [0.2, -0.8, 0.6] },
  ];

  return (
    <group position={position}>
      {ringConfigs.map((config, i) => (
        <group key={i} ref={(el) => (ringRefs.current[i] = el)} rotation={config.rotation}>
          <mesh>
            <torusGeometry args={[config.radius, config.tube, 16, 120]} />
            <meshBasicMaterial color={config.color} transparent opacity={config.opacity} blending={THREE.AdditiveBlending} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function FloatingDataNodes({ scrollProgress, reducedMotion }) {
  const nodesData = useMemo(() => [
    { id: 'dataset-1', position: [-8, 3, -5], label: 'Dataset', subLabel: 'sales_q3_2026.csv', metric: '12,482 rows', color: '#6366F1', type: 'dataset', scale: 1.2 },
    { id: 'chart-1', position: [7, -1.5, -12], label: 'Revenue Chart', subLabel: 'Monthly Trend', metric: '$1.43M', growth: '+18.4%', color: '#06B6D4', type: 'chart', scale: 1.1 },
    { id: 'insight-1', position: [-5, -3.5, 3], label: 'AI Insight', subLabel: 'Avg Duration', metric: '14.7 days', color: '#10B981', type: 'insight', scale: 1.0 },
    { id: 'query-1', position: [9, 4, -15], label: 'Query', subLabel: 'Natural Language', metric: '"Revenue by region?"', color: '#F59E0B', type: 'query', scale: 1.0 },
    { id: 'table-1', position: [-10, -1, -10], label: 'Data Table', subLabel: 'Filtered View', metric: '248 × 12', color: '#EC4899', type: 'table', scale: 0.9 },
    { id: 'code-1', position: [4, -4.5, 5], label: 'Generated Code', subLabel: 'AST Validated', metric: '42 lines', color: '#A855F7', type: 'code', scale: 0.9 },
    { id: 'export-1', position: [-3, 6, -18], label: 'PDF Export', subLabel: 'Report Ready', metric: '4 pages', color: '#3B82F6', type: 'export', scale: 0.8 },
    { id: 'history-1', position: [10, -2.5, -22], label: 'History', subLabel: 'Past Analyses', metric: '15 items', color: '#F43F5E', type: 'history', scale: 0.8 },
    { id: 'dataset-2', position: [-12, 1, -18], label: 'Dataset', subLabel: 'dev_activity.xlsx', metric: '8,921 rows', color: '#6366F1', type: 'dataset', scale: 1.0 },
    { id: 'insight-2', position: [6, 2, -8], label: 'AI Insight', subLabel: 'Anomaly Detected', metric: '3 outliers', color: '#10B981', type: 'insight', scale: 0.9 },
  ], []);

  const { clock } = useThree();

  return (
    <group>
      {nodesData.map((node) => (
        <FloatingDataNode
          key={node.id}
          node={node}
          scrollProgress={scrollProgress}
          reducedMotion={reducedMotion}
          clock={clock}
        />
      ))}
    </group>
  );
}

function FloatingDataNode({ node, scrollProgress, reducedMotion, clock }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const basePos = useMemo(() => [...node.position], [node.position[0], node.position[1], node.position[2]]);

  useFrame((state, delta) => {
    if (reducedMotion || !meshRef.current) return;
    const t = clock.elapsedTime;
    const seed = node.position[0] * 100 + node.position[2] * 10;
    
    meshRef.current.position.x = basePos[0] + Math.sin(t * 0.4 + seed) * 0.4;
    meshRef.current.position.y = basePos[1] + Math.cos(t * 0.35 + seed) * 0.35 + Math.sin(t * 0.2 + seed) * 0.15;
    meshRef.current.position.z = basePos[2] + Math.sin(t * 0.25 + seed) * 0.3;
    meshRef.current.rotation.y += delta * 0.12;
    meshRef.current.rotation.x = Math.sin(t * 0.4) * 0.08;
  });

  const scale = (hovered ? 1.18 : 1) * node.scale;

  const geometryMap = {
    dataset: <boxGeometry args={[2.8 * scale, 1.8 * scale, 0.2 * scale]} />,
    chart: <cylinderGeometry args={[1.6 * scale, 1.6 * scale, 0.25 * scale, 8]} />,
    insight: <octahedronGeometry args={[1.5 * scale, 2]} />,
    query: <torusGeometry args={[1.4 * scale, 0.4 * scale, 8, 24]} />,
    table: <boxGeometry args={[2.4 * scale, 2.0 * scale, 0.15 * scale]} />,
    code: <icosahedronGeometry args={[1.3 * scale, 2]} />,
    export: <tetrahedronGeometry args={[1.4 * scale, 2]} />,
    history: <boxGeometry args={[1.8 * scale, 2.2 * scale, 0.15 * scale]} />,
  };

  return (
    <mesh
      ref={meshRef}
      position={basePos}
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {geometryMap[node.type] || geometryMap.dataset}
      <meshStandardMaterial
        color={node.color}
        emissive={node.color}
        emissiveIntensity={hovered ? 0.6 : 0.25}
        roughness={0.25}
        metalness={0.75}
        transparent
        opacity={hovered ? 0.95 : 0.85}
      />
    </mesh>
  );
}

function FloatingGeometry({ scrollProgress, reducedMotion }) {
  const geometries = useMemo(() => [
    { type: 'tetrahedron', position: [-14, 6, -12], size: 1.0, color: '#6366F1', speed: 0.35 },
    { type: 'octahedron', position: [16, -3, -10], size: 1.3, color: '#8B5CF6', speed: 0.3 },
    { type: 'icosahedron', position: [-11, -7, 4], size: 0.8, color: '#06B6D4', speed: 0.45 },
    { type: 'torus', position: [14, 7, -18], size: 1.2, color: '#10B981', speed: 0.25 },
    { type: 'box', position: [-16, 1, -22], size: 1.4, color: '#F59E0B', speed: 0.22 },
    { type: 'sphere', position: [8, -8, 6], size: 0.9, color: '#EC4899', speed: 0.4 },
    { type: 'tetrahedron', position: [18, 3, -25], size: 0.7, color: '#A855F7', speed: 0.5 },
    { type: 'octahedron', position: [-18, -4, 8], size: 1.1, color: '#06B6D4', speed: 0.28 },
  ], []);

  const { clock } = useThree();

  return (
    <group>
      {geometries.map((geo, i) => (
        <FloatingGeo
          key={i}
          geo={geo}
          scrollProgress={scrollProgress}
          reducedMotion={reducedMotion}
          clock={clock}
        />
      ))}
    </group>
  );
}

function FloatingGeo({ geo, scrollProgress, reducedMotion, clock }) {
  const meshRef = useRef();
  const basePos = geo.position;

  useFrame((state, delta) => {
    if (reducedMotion || !meshRef.current) return;
    const t = clock.elapsedTime;
    meshRef.current.position.x = basePos[0] + Math.sin(t * geo.speed) * 1.2;
    meshRef.current.position.y = basePos[1] + Math.cos(t * geo.speed * 0.6) * 0.9;
    meshRef.current.position.z = basePos[2] + Math.sin(t * geo.speed * 0.4) * 0.7;
    meshRef.current.rotation.x += delta * geo.speed * 0.4;
    meshRef.current.rotation.y += delta * geo.speed * 0.25;
    meshRef.current.rotation.z += delta * geo.speed * 0.15;
  });

  const geometryMap = {
    tetrahedron: <tetrahedronGeometry args={[geo.size, 2]} />,
    octahedron: <octahedronGeometry args={[geo.size, 2]} />,
    icosahedron: <icosahedronGeometry args={[geo.size, 2]} />,
    torus: <torusGeometry args={[geo.size, geo.size * 0.35, 16, 32]} />,
    box: <boxGeometry args={[geo.size, geo.size, geo.size]} />,
    sphere: <sphereGeometry args={[geo.size, 28, 28]} />,
  };

  return (
    <mesh ref={meshRef} position={basePos}>
      {geometryMap[geo.type]}
      <meshStandardMaterial
        color={geo.color}
        emissive={geo.color}
        emissiveIntensity={0.15}
        roughness={0.5}
        metalness={0.5}
        transparent
        opacity={0.5}
        wireframe
      />
    </mesh>
  );
}

function ConnectionLines({ scrollProgress, reducedMotion }) {
  const connections = useMemo(() => [
    { from: [-8, 3, -5], to: [0, 0, -18], color: '#6366F1' },
    { from: [7, -1.5, -12], to: [0, 0, -18], color: '#06B6D4' },
    { from: [-5, -3.5, 3], to: [0, 0, -18], color: '#10B981' },
    { from: [-8, 3, -5], to: [-5, -3.5, 3], color: '#6366F1' },
    { from: [7, -1.5, -12], to: [4, -4.5, 5], color: '#06B6D4' },
    { from: [-10, -1, -10], to: [0, 0, -18], color: '#EC4899' },
    { from: [-12, 1, -18], to: [0, 0, -18], color: '#6366F1' },
    { from: [6, 2, -8], to: [0, 0, -18], color: '#10B981' },
  ], []);

  return (
    <group>
      {connections.map((conn, i) => (
        <ConnectionLine key={i} from={conn.from} to={conn.to} color={conn.color} reducedMotion={reducedMotion} />
      ))}
    </group>
  );
}

function ConnectionLine({ from, to, color, reducedMotion }) {
  const lineRef = useRef();
  const matRef = useRef();
  const { size } = useThree();
  const progressRef = useRef(0);

  const geometry = useMemo(() => {
    const geo = new LineGeometry();
    geo.setPositions([...from, ...to]);
    return geo;
  }, [from, to]);

  useEffect(() => {
    if (lineRef.current) {
      lineRef.current.computeLineDistances();
    }
  }, [geometry]);

  useFrame((state, delta) => {
    if (reducedMotion) return;
    progressRef.current = (progressRef.current + delta * 0.12) % 1;
    if (matRef.current) {
      matRef.current.dashOffset = -progressRef.current;
      matRef.current.resolution.set(size.width, size.height);
    }
  });

  return (
    <line2 ref={lineRef} geometry={geometry}>
      <lineMaterial
        ref={matRef}
        color={color}
        transparent
        opacity={0.25}
        blending={THREE.AdditiveBlending}
        dashed={true}
        dashSize={0.6}
        gapSize={0.6}
        dashOffset={0}
        linewidth={1.5}
        resolution={[size.width, size.height]}
      />
    </line2>
  );
}

function DistantGlows({ reducedMotion }) {
  const glows = useMemo(() => [
    { position: [-25, 10, -40], color: '#8B5CF6', size: 4, intensity: 0.8 },
    { position: [28, -8, -35], color: '#06B6D4', size: 3.5, intensity: 0.6 },
    { position: [-20, -12, 15], color: '#6366F1', size: 3, intensity: 0.5 },
    { position: [30, 15, -45], color: '#A5B4FC', size: 2.5, intensity: 0.4 },
    { position: [-30, -5, -50], color: '#10B981', size: 3, intensity: 0.5 },
    { position: [22, 12, -55], color: '#F59E0B', size: 2.8, intensity: 0.45 },
  ], []);

  const { clock } = useThree();

  return (
    <group>
      {glows.map((glow, i) => (
        <DistantGlow key={i} glow={glow} clock={clock} reducedMotion={reducedMotion} />
      ))}
    </group>
  );
}

function DistantGlow({ glow, clock, reducedMotion }) {
  const meshRef = useRef();
  const basePos = glow.position;

  useFrame(() => {
    if (reducedMotion || !meshRef.current) return;
    const t = clock.elapsedTime;
    meshRef.current.position.x = basePos[0] + Math.sin(t * 0.05) * 0.5;
    meshRef.current.position.y = basePos[1] + Math.cos(t * 0.04) * 0.4;
    meshRef.current.scale.setScalar(1 + Math.sin(t * 0.3) * 0.1);
    meshRef.current.material.opacity = glow.intensity * (0.3 + Math.sin(t * 0.5) * 0.1);
  });

  return (
    <mesh ref={meshRef} position={basePos}>
      <sphereGeometry args={[glow.size, 16, 16]} />
      <meshBasicMaterial
        color={glow.color}
        transparent
        opacity={glow.intensity * 0.3}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.BackSide}
      />
    </mesh>
  );
}