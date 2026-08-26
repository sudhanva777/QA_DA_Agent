import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Database,
  Table,
  Cpu,
  Zap,
  BarChart2,
  FileText,
  Lightbulb,
  Download,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

// Workflow node definitions representing the actual product pipeline
// Coordinates are designed for a 1200x420 viewBox
const WORKFLOW_NODES = [
  {
    id: 'upload',
    label: 'Upload Dataset',
    subtitle: 'CSV / XLSX',
    description: 'Drag & drop or browse files up to 50MB. Automatic schema inference and type detection.',
    icon: Database,
    color: '#2563EB',
    position: { x: 80, y: 180 },
    stats: { rows: '12,482', cols: '18' },
    status: 'Ready',
  },
  {
    id: 'profile',
    label: 'Data Profiler',
    subtitle: 'Schema & Stats',
    description: 'Automated quality scoring, null-value analysis, anomaly detection, and column type optimization.',
    icon: Table,
    color: '#3B82F6',
    position: { x: 320, y: 180 },
    stats: { quality: '98/100', completeness: '99.2%' },
    status: 'Analyzed',
  },
  {
    id: 'query',
    label: 'AI Query Understanding',
    subtitle: 'Natural Language',
    description: 'LLM parses intent, maps to schema, and constructs an execution plan with full context awareness.',
    icon: Cpu,
    color: '#6366F1',
    position: { x: 560, y: 180 },
    stats: { latency: '~120ms', model: 'Llama 3.3 70B' },
    status: 'Understood',
  },
  {
    id: 'analysis',
    label: 'Analysis Engine',
    subtitle: 'AST Sandbox',
    description: 'Grounded pandas code validated via AST, executed in hardened sandbox with 10s timeout & memory limits.',
    icon: Zap,
    color: '#8B5CF6',
    position: { x: 800, y: 60 },
    stats: { execution: '340ms', rows: '248' },
    status: 'Complete',
  },
  {
    id: 'chart',
    label: 'Chart Generation',
    subtitle: 'Auto-Visualization',
    description: 'Intelligent chart type selection (bar, line, area, pie, scatter, heatmap) with interactive Recharts rendering.',
    icon: BarChart2,
    color: '#A855F7',
    position: { x: 800, y: 300 },
    stats: { type: 'Bar Chart', series: '3' },
    status: 'Rendered',
  },
  {
    id: 'insight',
    label: 'AI Insight Generation',
    subtitle: 'Plain English',
    description: 'Deterministic answer composition with key findings, statistics, and actionable recommendations.',
    icon: Lightbulb,
    color: '#16A34A',
    position: { x: 1040, y: 180 },
    stats: { confidence: 'High', tokens: '~2.1k' },
    status: 'Generated',
  },
];

// Connections between nodes
const WORKFLOW_CONNECTIONS = [
  { from: 'upload', to: 'profile' },
  { from: 'profile', to: 'query' },
  { from: 'query', to: 'analysis' },
  { from: 'query', to: 'chart' },
  { from: 'analysis', to: 'insight' },
  { from: 'chart', to: 'insight' },
];

// Particle animation for data flow
const PARTICLE_COUNT = 8;

// Design-time dimensions for the SVG viewBox
const DESIGN_WIDTH = 1200;
const DESIGN_HEIGHT = 420;

function WorkflowNode({ 
  node, 
  isHovered, 
  isActive, 
  onMouseEnter, 
  onMouseLeave, 
  onClick,
  particleProgress 
}) {
  const Icon = node.icon;
  const { x, y } = node.position;
  
  return (
    <g 
      transform={`translate(${x}, ${y})`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Connection point indicators */}
      <defs>
        <filter id={`glow-${node.id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={isHovered || isActive ? 4 : 2} result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Main node circle */}
      <circle
        cx="0"
        cy="0"
        r={isHovered ? 56 : 50}
        fill="white"
        stroke={node.color}
        strokeWidth={isHovered || isActive ? 3 : 2}
        filter={`url(#glow-${node.id})`}
        className="transition-all duration-300"
      />
      
      {/* Inner accent ring */}
      <circle
        cx="0"
        cy="0"
        r={isHovered ? 48 : 42}
        fill="none"
        stroke={node.color}
        strokeWidth={1.5}
        strokeDasharray="8 6"
        strokeDashoffset={particleProgress * 20}
        className="transition-all duration-300"
        opacity={isHovered || isActive ? 1 : 0.4}
      />
      
      {/* Status indicator dot */}
      <circle
        cx={38}
        cy={38}
        r={8}
        fill={isActive ? '#16A34A' : '#E2E8F0'}
        stroke="white"
        strokeWidth={2}
      >
        {isActive && (
          <animate
            attributeName="r"
            values="8;10;8"
            dur="1.5s"
            repeatCount="indefinite"
          />
        )}
      </circle>
      
      {/* Icon */}
      <Icon
        x={-14}
        y={-14}
        width={28}
        height={28}
        fill="none"
        stroke={node.color}
        strokeWidth={2}
        className="transition-all duration-300"
        style={{ transform: isHovered ? 'scale(1.15)' : 'scale(1)' }}
      />
      
      {/* Label background */}
      <rect
        x={-60}
        y={60}
        width={120}
        height={36}
        rx={8}
        fill="white"
        stroke="#E2E8F0"
        strokeWidth={1}
        opacity={isHovered ? 1 : 0}
        className="transition-opacity duration-200"
      />
      
      {/* Label text */}
      <text
        x="0"
        y={78}
        textAnchor="middle"
        fontSize="11"
        fontWeight="600"
        fill="#111827"
        fontFamily="Inter, system-ui, sans-serif"
        opacity={isHovered ? 1 : 0}
        className="transition-opacity duration-200"
      >
        {node.label}
      </text>
      
      {/* Subtitle */}
      <text
        x="0"
        y={92}
        textAnchor="middle"
        fontSize="9"
        fontWeight="400"
        fill="#64748B"
        fontFamily="Inter, system-ui, sans-serif"
        opacity={isHovered ? 1 : 0}
        className="transition-opacity duration-200"
      >
        {node.subtitle}
      </text>
      
      {/* Tooltip - appears on hover */}
      {isHovered && (
        <g className="node-tooltip">
          <rect
            x={-140}
            y={-140}
            width={280}
            height={130}
            rx={12}
            fill="white"
            stroke="#E2E8F0"
            strokeWidth={1}
            filter="drop-shadow(0 10px 25px rgba(0,0,0,0.1))"
          />
          <text x={0} y={-118} textAnchor="middle" fontSize="13" fontWeight="700" fill="#111827" fontFamily="Inter, system-ui, sans-serif">
            {node.label}
          </text>
          <text x={0} y={-100} textAnchor="middle" fontSize="10" fontWeight="500" fill={node.color} fontFamily="Inter, system-ui, sans-serif">
            {node.subtitle}
          </text>
          <line x1="-120" y1={-92} x2={120} y2={-92} stroke="#E2E8F0" strokeWidth={1} />
          <text x={0} y={-75} textAnchor="middle" fontSize="10" fill="#374151" fontFamily="Inter, system-ui, sans-serif">
            {node.description}
          </text>
          <text x={0} y={-55} textAnchor="middle" fontSize="10" fontWeight="600" fill="#111827" fontFamily="Inter, system-ui, sans-serif">
            Status: <tspan fill={node.color}>{node.status}</tspan>
          </text>
          <text x={0} y={-38} textAnchor="middle" fontSize="9" fill="#64748B" fontFamily="Inter, system-ui, sans-serif">
            {Object.entries(node.stats).map(([k, v], i) => (
              <tspan key={k} x="0" dy={i === 0 ? 0 : 14}>{k}: {v}</tspan>
            ))}
          </text>
        </g>
      )}
    </g>
  );
}

function ConnectionLine({ fromNode, toNode, isActive, particleProgress }) {
  const from = fromNode.position;
  const to = toNode.position;
  
  // Calculate control point for curved line
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const offset = Math.min(distance * 0.15, 40);
  const perpX = -dy / distance * offset;
  const perpY = dx / distance * offset;
  
  const controlX = midX + perpX;
  const controlY = midY + perpY;
  
  // Path for the connection
  const path = `M ${from.x} ${from.y} Q ${controlX} ${controlY} ${to.x} ${to.y}`;
  
  // Calculate arrowhead position (at 85% of path)
  const t = 0.85;
  const arrowX = (1-t)*(1-t)*from.x + 2*(1-t)*t*controlX + t*t*to.x;
  const arrowY = (1-t)*(1-t)*from.y + 2*(1-t)*t*controlY + t*t*to.y;
  
  // Calculate angle for arrowhead
  const prevT = 0.83;
  const prevX = (1-prevT)*(1-prevT)*from.x + 2*(1-prevT)*prevT*controlX + prevT*prevT*to.x;
  const prevY = (1-prevT)*(1-prevT)*from.y + 2*(1-prevT)*prevT*controlY + prevT*prevT*to.y;
  const angle = Math.atan2(arrowY - prevY, arrowX - prevX);
  
  return (
    <g>
      {/* Main connection line */}
      <path
        d={path}
        fill="none"
        stroke="#CBD5E1"
        strokeWidth={2}
        strokeDasharray={isActive ? "8 6" : "none"}
        strokeDashoffset={isActive ? particleProgress * 20 : 0}
        className="transition-all duration-300"
      />
      
      {/* Active flow highlight */}
      {isActive && (
        <path
          d={path}
          fill="none"
          stroke={fromNode.color}
          strokeWidth={3}
          strokeDasharray="20 10"
          strokeDashoffset={particleProgress * 30}
          opacity={0.6}
          filter="drop-shadow(0 0 4px currentColor)"
        />
      )}
      
      {/* Arrowhead */}
      <g transform={`translate(${arrowX}, ${arrowY}) rotate(${angle * 180 / Math.PI})`}>
        <polygon
          points="0,0 -8,-4 -8,4"
          fill="#CBD5E1"
          className="transition-all duration-300"
        />
      </g>
      
      {/* Moving data particles */}
      {[...Array(PARTICLE_COUNT)].map((_, i) => {
        const particleT = (particleProgress + i / PARTICLE_COUNT) % 1;
        const px = (1-particleT)*(1-particleT)*from.x + 2*(1-particleT)*particleT*controlX + particleT*particleT*to.x;
        const py = (1-particleT)*(1-particleT)*from.y + 2*(1-particleT)*particleT*controlY + particleT*particleT*to.y;
        
        return (
          <circle
            key={i}
            cx={px}
            cy={py}
            r={3}
            fill={fromNode.color}
            opacity={isActive ? 1 : 0.3}
            className="transition-opacity duration-300"
          >
            {isActive && (
              <animate
                attributeName="r"
                values="2;4;2"
                dur="1s"
                repeatCount="indefinite"
                begin={`${i * 0.15}s`}
              />
            )}
          </circle>
        );
      })}
    </g>
  );
}

export default function WorkflowCanvas({ className = '' }) {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [activeNode, setActiveNode] = useState('upload');
  const [particleProgress, setParticleProgress] = useState(0);
  const [animationId, setAnimationId] = useState(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const svgRef = useRef(null);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Animation loop for particle flow
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 3000; // 3 second cycle
      setParticleProgress(elapsed % 1);
      setAnimationId(requestAnimationFrame(animate));
    };
    
    setAnimationId(requestAnimationFrame(animate));
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [prefersReducedMotion]);

  // Auto-cycle through active nodes
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const interval = setInterval(() => {
      const nodeIds = WORKFLOW_NODES.map(n => n.id);
      const currentIndex = nodeIds.indexOf(activeNode);
      const nextIndex = (currentIndex + 1) % nodeIds.length;
      setActiveNode(nodeIds[nextIndex]);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [activeNode, prefersReducedMotion]);

  // Determine which connections are active based on active node
  const activeConnections = useMemo(() => {
    const activeConnections = new Set();
    const nodeIds = WORKFLOW_NODES.map(n => n.id);
    const activeIndex = nodeIds.indexOf(activeNode);
    
    // Mark connections up to active node as active
    for (let i = 0; i < activeIndex; i++) {
      const from = nodeIds[i];
      const to = nodeIds[i + 1];
      const conn = WORKFLOW_CONNECTIONS.find(c => c.from === from && c.to === to);
      if (conn) activeConnections.add(`${conn.from}-${conn.to}`);
    }
    
    // Also mark the connection from active node to next as active
    if (activeIndex < nodeIds.length - 1) {
      const from = nodeIds[activeIndex];
      const to = nodeIds[activeIndex + 1];
      const conn = WORKFLOW_CONNECTIONS.find(c => c.from === from && c.to === to);
      if (conn) activeConnections.add(`${conn.from}-${conn.to}`);
    }
    
    return activeConnections;
  }, [activeNode]);

  const handleNodeClick = (nodeId) => {
    setActiveNode(nodeId);
  };

  // Background grid pattern
  const gridPattern = useMemo(() => (
    <pattern id="grid" width={20} height={20} patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#F1F5F9" strokeWidth="1" />
    </pattern>
  ), []);

  return (
    <div className={`relative ${className}`} style={{ width: '100%', height: 'auto', minHeight: 0 }}>
      <div style={{ position: 'relative', width: '100%', paddingBottom: `${(DESIGN_HEIGHT / DESIGN_WIDTH) * 100}%` }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${DESIGN_WIDTH} ${DESIGN_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 w-full h-full"
          role="img"
          aria-label="AI Data Analysis Pipeline Workflow"
        >
          <defs>
            {gridPattern}
            {/* Gradient for active flow */}
            <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#16A34A" />
            </linearGradient>
          </defs>
          
          {/* Background */}
          <rect width={DESIGN_WIDTH} height={DESIGN_HEIGHT} fill="url(#grid)" />
          
          {/* Subtle gradient orbs for depth */}
          <circle cx={150} cy={100} r={120} fill="#EFF6FF" opacity="0.4" filter="blur(60px)" />
          <circle cx={1050} cy={320} r={100} fill="#DCFCE7" opacity="0.3" filter="blur(60px)" />
          <circle cx={600} cy={380} r={150} fill="#F5F0FF" opacity="0.25" filter="blur(80px)" />
          
          {/* Connections */}
          {WORKFLOW_CONNECTIONS.map((conn) => {
            const fromNode = WORKFLOW_NODES.find(n => n.id === conn.from);
            const toNode = WORKFLOW_NODES.find(n => n.id === conn.to);
            const isActive = activeConnections.has(`${conn.from}-${conn.to}`);
            
            return (
              <ConnectionLine
                key={`${conn.from}-${conn.to}`}
                fromNode={fromNode}
                toNode={toNode}
                isActive={isActive}
                particleProgress={particleProgress}
              />
            );
          })}
          
          {/* Nodes */}
          {WORKFLOW_NODES.map((node) => (
            <WorkflowNode
              key={node.id}
              node={node}
              isHovered={hoveredNode === node.id}
              isActive={activeNode === node.id}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => handleNodeClick(node.id)}
              particleProgress={particleProgress}
            />
          ))}
        </svg>
      </div>
      
      {/* Legend / Pipeline Steps */}
      <div className="mt-4 md:mt-6 flex flex-wrap items-center justify-center gap-2 md:gap-3 text-[10px] md:text-xs">
        {WORKFLOW_NODES.map((node, index) => (
          <div
            key={node.id}
            className="flex items-center space-x-1.5 md:space-x-2 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full bg-white border border-border hover:border-primary/30 transition-colors whitespace-nowrap"
            style={{ opacity: activeNode === node.id || hoveredNode === node.id ? 1 : 0.6 }}
          >
            <span
              className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: node.color }}
            />
            <span className="font-medium text-text-primary hidden xs:inline">{node.label}</span>
            {index < WORKFLOW_NODES.length - 1 && (
              <ChevronRight className="w-2.5 h-2.5 md:w-3 md:h-3 text-text-muted flex-shrink-0" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}