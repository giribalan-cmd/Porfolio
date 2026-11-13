import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// Module-scope reusable math helpers (zero GC inside useFrame)
const _vec3 = new THREE.Vector3();
const _dummy = new THREE.Object3D();

type MaterialFinish = 'titanium' | 'obsidian' | 'cobalt';

const FINISH_PALETTES: Record<
  MaterialFinish,
  {
    label: string;
    bracket: string;
    chassis: string;
    accent: string;
    emissive: string;
    wire: string;
  }
> = {
  titanium: {
    label: 'Titanium',
    bracket: '#94a3b8',
    chassis: '#1e293b',
    accent: '#2563eb',
    emissive: '#1d4ed8',
    wire: '#475569',
  },
  obsidian: {
    label: 'Obsidian',
    bracket: '#1e293b',
    chassis: '#0f172a',
    accent: '#2563eb',
    emissive: '#1d4ed8',
    wire: '#334155',
  },
  cobalt: {
    label: 'Cobalt',
    bracket: '#2563eb',
    chassis: '#172554',
    accent: '#38bdf8',
    emissive: '#0284c7',
    wire: '#60a5fa',
  },
};

function detectSoftwareWebGL(): { supported: boolean; isSoftware: boolean } {
  try {
    const probeCanvas = document.createElement('canvas');
    const gl =
      probeCanvas.getContext('webgl2') ||
      (probeCanvas.getContext('webgl') as WebGLRenderingContext | null);
    if (!gl) {
      return { supported: false, isSoftware: true };
    }
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    const isSoftware = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    return { supported: true, isSoftware };
  } catch {
    return { supported: false, isSoftware: true };
  }
}

function createRoundedRectShape(width: number, height: number, radius: number): THREE.Shape {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

function createBracketShape(direction: 'left' | 'right'): THREE.Shape {
  const s = new THREE.Shape();
  const sign = direction === 'left' ? 1 : -1;
  // Crisp geometric chevron `<` or `>` centered around origin
  s.moveTo(-0.34 * sign, 0);
  s.lineTo(0.24 * sign, 0.62);
  s.lineTo(0.39 * sign, 0.46);
  s.lineTo(-0.04 * sign, 0);
  s.lineTo(0.39 * sign, -0.46);
  s.lineTo(0.24 * sign, -0.62);
  s.closePath();
  return s;
}

function createSlashShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-0.24, -0.72);
  s.lineTo(-0.04, -0.72);
  s.lineTo(0.24, 0.72);
  s.lineTo(0.04, 0.72);
  s.closePath();
  return s;
}

function createCodeScreenTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Deep editor canvas
    ctx.fillStyle = '#090c14';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grid lines
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.06)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Editor top bar
    ctx.fillStyle = '#111624';
    ctx.fillRect(0, 0, canvas.width, 54);
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(0, 53, canvas.width, 1);

    // Minimalist window controls (neutral geometric squares)
    ['#334155', '#475569', '#2563eb'].forEach((col, i) => {
      ctx.fillStyle = col;
      ctx.fillRect(28 + i * 24, 21, 12, 12);
    });

    // File tab label
    ctx.font = '500 18px "JetBrains Mono", monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('architecture.ts', 120, 33);

    // Left line-number gutter
    ctx.fillStyle = '#0c101b';
    ctx.fillRect(0, 54, 72, canvas.height - 54);

    const codeLines: Array<{ num: string; tokens: Array<{ text: string; color: string }> }> = [
      {
        num: '01',
        tokens: [
          { text: 'export ', color: '#60a5fa' },
          { text: 'interface ', color: '#93c5fd' },
          { text: 'SystemCore ', color: '#f8fafc' },
          { text: '{', color: '#64748b' },
        ],
      },
      {
        num: '02',
        tokens: [
          { text: '  runtime', color: '#e2e8f0' },
          { text: ': ', color: '#64748b' },
          { text: "'Python' | 'TypeScript'", color: '#38bdf8' },
          { text: ';', color: '#64748b' },
        ],
      },
      {
        num: '03',
        tokens: [
          { text: '  uiLayer', color: '#e2e8f0' },
          { text: ': ', color: '#64748b' },
          { text: "'React.js'", color: '#38bdf8' },
          { text: ';', color: '#64748b' },
        ],
      },
      {
        num: '04',
        tokens: [{ text: '}', color: '#64748b' }],
      },
      {
        num: '05',
        tokens: [{ text: '', color: '#64748b' }],
      },
      {
        num: '06',
        tokens: [
          { text: 'export async function ', color: '#60a5fa' },
          { text: 'buildSolution', color: '#f8fafc' },
          { text: '(spec: ', color: '#64748b' },
          { text: 'SystemCore', color: '#93c5fd' },
          { text: ') {', color: '#64748b' },
        ],
      },
      {
        num: '07',
        tokens: [
          { text: '  const ', color: '#60a5fa' },
          { text: 'api ', color: '#e2e8f0' },
          { text: '= await ', color: '#93c5fd' },
          { text: 'connectServices', color: '#f8fafc' },
          { text: '(spec);', color: '#64748b' },
        ],
      },
      {
        num: '08',
        tokens: [
          { text: '  const ', color: '#60a5fa' },
          { text: 'data ', color: '#e2e8f0' },
          { text: '= ', color: '#64748b' },
          { text: 'api', color: '#93c5fd' },
          { text: '.streamTelemetry();', color: '#cbd5e1' },
        ],
      },
      {
        num: '09',
        tokens: [
          { text: '  return ', color: '#60a5fa' },
          { text: 'renderInterface', color: '#f8fafc' },
          { text: '(data);', color: '#64748b' },
        ],
      },
      {
        num: '10',
        tokens: [{ text: '}', color: '#64748b' }],
      },
    ];

    ctx.font = '500 22px "JetBrains Mono", monospace';
    codeLines.forEach((line, rowIdx) => {
      const y = 112 + rowIdx * 48;
      ctx.fillStyle = '#475569';
      ctx.fillText(line.num, 24, y);

      let cursorX = 98;
      line.tokens.forEach((tok) => {
        ctx.fillStyle = tok.color;
        ctx.fillText(tok.text, cursorX, y);
        cursorX += ctx.measureText(tok.text).width;
      });
    });

    // Subtle bottom bar
    ctx.fillStyle = 'rgba(37, 99, 235, 0.16)';
    ctx.fillRect(0, canvas.height - 36, canvas.width, 36);
    ctx.fillStyle = '#60a5fa';
    ctx.font = '500 15px "JetBrains Mono", monospace';
    ctx.fillText('UTF-8   TypeScript   Full Stack Architecture', 24, canvas.height - 13);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

function createKeycapTexture(symbol: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#151923';
    ctx.fillRect(0, 0, 128, 128);
    ctx.strokeStyle = 'rgba(96, 165, 250, 0.35)';
    ctx.lineWidth = 4;
    ctx.strokeRect(8, 8, 112, 112);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '700 46px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(symbol, 64, 66);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function StudioEnvironment() {
  const { gl, scene } = useThree();

  useEffect(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    scene.background = null;
    scene.fog = null;
    pmremGenerator.dispose();

    return () => {
      scene.environment = null;
      envTarget.dispose();
    };
  }, [gl, scene]);

  return null;
}

function ContactShadowPlane() {
  const shadowTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 124);
      grad.addColorStop(0, 'rgba(15, 23, 42, 0.24)');
      grad.addColorStop(0.45, 'rgba(37, 99, 235, 0.09)');
      grad.addColorStop(1, 'rgba(238, 242, 248, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  useEffect(() => {
    return () => {
      shadowTexture.dispose();
    };
  }, [shadowTexture]);

  return (
    <mesh position={[0, -2.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[5.2, 5.2]} />
      <meshBasicMaterial
        map={shadowTexture}
        transparent
        depthWrite={false}
        opacity={0.85}
      />
    </mesh>
  );
}

interface DeveloperSculptureProps {
  isSoftware: boolean;
  prefersReducedMotion: boolean;
  exploded: boolean;
  finish: MaterialFinish;
  hovered: boolean;
  onHoverChange: (hovered: boolean) => void;
  onToggleExplode: () => void;
  dragStateRef: React.MutableRefObject<{
    isDragging: boolean;
    rotX: number;
    rotY: number;
    velX: number;
    velY: number;
    impulse: number;
  }>;
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
}

function DeveloperCodeSculpture({
  isSoftware,
  prefersReducedMotion,
  exploded,
  finish,
  hovered,
  onHoverChange,
  onToggleExplode,
  dragStateRef,
  pointerRef,
}: DeveloperSculptureProps) {
  const { gl } = useThree();
  const rootGroupRef = useRef<THREE.Group>(null);
  const chassisGroupRef = useRef<THREE.Group>(null);
  const screenMeshRef = useRef<THREE.Mesh>(null);
  const leftBracketRef = useRef<THREE.Mesh>(null);
  const rightBracketRef = useRef<THREE.Mesh>(null);
  const slashPrismRef = useRef<THREE.Mesh>(null);
  const slashMatRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const keycapGroupRef = useRef<THREE.Group>(null);

  const dampedPointer = useRef({ x: 0, y: 0 });
  const explodeVal = useRef(0);
  const scrollOffset = useRef(0);

  const palette = FINISH_PALETTES[finish];

  // Procedural geometries with bevels
  const {
    chassisGeo,
    chassisEdgesGeo,
    leftBracketGeo,
    rightBracketGeo,
    slashGeo,
    keycapBaseGeo,
  } = useMemo(() => {
    const chassisShape = createRoundedRectShape(3.15, 2.02, 0.14);
    const cGeo = new THREE.ExtrudeGeometry(chassisShape, {
      depth: 0.12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 3,
    });
    cGeo.center();

    const cEdges = new THREE.EdgesGeometry(cGeo, 18);

    const extrudeBracketOpts: THREE.ExtrudeGeometryOptions = {
      depth: 0.16,
      bevelEnabled: true,
      bevelThickness: 0.035,
      bevelSize: 0.03,
      bevelSegments: 3,
    };

    const lGeo = new THREE.ExtrudeGeometry(createBracketShape('left'), extrudeBracketOpts);
    lGeo.center();

    const rGeo = new THREE.ExtrudeGeometry(createBracketShape('right'), extrudeBracketOpts);
    rGeo.center();

    const sGeo = new THREE.ExtrudeGeometry(createSlashShape(), {
      depth: 0.18,
      bevelEnabled: true,
      bevelThickness: 0.035,
      bevelSize: 0.03,
      bevelSegments: 3,
    });
    sGeo.center();

    const kShape = createRoundedRectShape(0.46, 0.46, 0.08);
    const kGeo = new THREE.ExtrudeGeometry(kShape, {
      depth: 0.14,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.03,
      bevelSegments: 2,
    });
    kGeo.center();

    return {
      chassisGeo: cGeo,
      chassisEdgesGeo: cEdges,
      leftBracketGeo: lGeo,
      rightBracketGeo: rGeo,
      slashGeo: sGeo,
      keycapBaseGeo: kGeo,
    };
  }, []);

  const { screenTex, keyTexA, keyTexB, keyTexC } = useMemo(() => {
    const maxAniso = Math.min(gl.capabilities.getMaxAnisotropy(), 8);
    return {
      screenTex: createCodeScreenTexture(maxAniso),
      keyTexA: createKeycapTexture('{ }'),
      keyTexB: createKeycapTexture('</>'),
      keyTexC: createKeycapTexture('λ'),
    };
  }, [gl]);

  useEffect(() => {
    return () => {
      chassisGeo.dispose();
      chassisEdgesGeo.dispose();
      leftBracketGeo.dispose();
      rightBracketGeo.dispose();
      slashGeo.dispose();
      keycapBaseGeo.dispose();
      screenTex.dispose();
      keyTexA.dispose();
      keyTexB.dispose();
      keyTexC.dispose();
    };
  }, [
    chassisGeo,
    chassisEdgesGeo,
    leftBracketGeo,
    rightBracketGeo,
    slashGeo,
    keycapBaseGeo,
    screenTex,
    keyTexA,
    keyTexB,
    keyTexC,
  ]);

  useFrame((state, delta) => {
    if (prefersReducedMotion) return;
    const dt = Math.min(delta, 0.1);
    const elapsed = state.clock.getElapsedTime();

    // Smooth pointer parallax damping
    dampedPointer.current.x = THREE.MathUtils.damp(
      dampedPointer.current.x,
      pointerRef.current.x,
      4.5,
      dt
    );
    dampedPointer.current.y = THREE.MathUtils.damp(
      dampedPointer.current.y,
      pointerRef.current.y,
      4.5,
      dt
    );

    // Smooth exploded-view interpolation
    explodeVal.current = THREE.MathUtils.damp(
      explodeVal.current,
      exploded ? 1 : 0,
      5.2,
      dt
    );
    const exp = explodeVal.current;

    // Scroll depth response
    const rawScroll = typeof window !== 'undefined' ? Math.min(window.scrollY / 600, 1) : 0;
    scrollOffset.current = THREE.MathUtils.damp(scrollOffset.current, rawScroll, 4, dt);

    // Drag inertia decay + spin impulse
    const drag = dragStateRef.current;
    if (!drag.isDragging) {
      drag.rotY += drag.velY * dt * 60;
      drag.rotX += drag.velX * dt * 60;
      drag.velX = THREE.MathUtils.damp(drag.velX, 0, 3.8, dt);
      drag.velY = THREE.MathUtils.damp(drag.velY, 0, 3.8, dt);
    }
    drag.impulse = THREE.MathUtils.damp(drag.impulse, 0, 3.2, dt);

    if (rootGroupRef.current) {
      rootGroupRef.current.rotation.y =
        Math.sin(elapsed * 0.45) * 0.22 +
        drag.rotY +
        dampedPointer.current.x * 0.42 +
        scrollOffset.current * 0.35;
      rootGroupRef.current.rotation.x =
        0.08 +
        Math.cos(elapsed * 0.38) * 0.06 +
        drag.rotX -
        dampedPointer.current.y * 0.26;
      rootGroupRef.current.position.y =
        0.12 + Math.sin(elapsed * 0.9) * 0.08 - scrollOffset.current * 0.2;
      rootGroupRef.current.position.z = -scrollOffset.current * 0.55;
    }

    // Layered Exploded-View Separation along Z and X
    if (chassisGroupRef.current) {
      chassisGroupRef.current.position.z = -0.35 - exp * 0.72;
    }
    if (screenMeshRef.current) {
      screenMeshRef.current.position.z = -0.24 - exp * 0.25;
    }
    if (leftBracketRef.current) {
      leftBracketRef.current.position.x = -0.96 - exp * 0.42;
      leftBracketRef.current.position.z = 0.42 + exp * 0.65;
      leftBracketRef.current.rotation.y =
        0.12 + Math.sin(elapsed * 1.1) * 0.06 + drag.impulse * 0.5;
    }
    if (rightBracketRef.current) {
      rightBracketRef.current.position.x = 0.96 + exp * 0.42;
      rightBracketRef.current.position.z = 0.42 + exp * 0.65;
      rightBracketRef.current.rotation.y =
        -0.12 - Math.sin(elapsed * 1.1) * 0.06 - drag.impulse * 0.5;
    }
    if (slashPrismRef.current) {
      slashPrismRef.current.position.z = 0.48 + exp * 0.95;
      slashPrismRef.current.rotation.y =
        Math.sin(elapsed * 0.75) * 0.14 + drag.impulse * Math.PI;
    }
    if (slashMatRef.current) {
      const targetGlow = hovered || exploded ? 0.72 : 0.24;
      slashMatRef.current.emissiveIntensity = THREE.MathUtils.damp(
        slashMatRef.current.emissiveIntensity,
        targetGlow,
        6,
        dt
      );
    }
    if (keycapGroupRef.current) {
      keycapGroupRef.current.position.y = Math.sin(elapsed * 1.3) * 0.06;
      keycapGroupRef.current.position.z = 0.18 + exp * 0.45;
    }
  });

  return (
    <group
      ref={rootGroupRef}
      position={[0, 0.12, 0]}
      rotation={[0.08, -0.22, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHoverChange(true);
      }}
      onPointerOut={() => onHoverChange(false)}
      onClick={(e) => {
        e.stopPropagation();
        if (
          Math.abs(dragStateRef.current.velX) < 0.01 &&
          Math.abs(dragStateRef.current.velY) < 0.01
        ) {
          dragStateRef.current.impulse = 1;
          onToggleExplode();
        }
      }}
    >
      {/* Part 1 & 2: Machined Aluminum IDE Chassis + Edge Highlight */}
      <group ref={chassisGroupRef} position={[0, 0, -0.35]}>
        <mesh geometry={chassisGeo} castShadow={!isSoftware} receiveShadow={!isSoftware}>
          <meshPhysicalMaterial
            color={palette.chassis}
            metalness={0.86}
            roughness={0.34}
            clearcoat={0.35}
            clearcoatRoughness={0.25}
          />
        </mesh>
        <lineSegments geometry={chassisEdgesGeo}>
          <lineBasicMaterial color={palette.wire} transparent opacity={hovered ? 0.55 : 0.28} />
        </lineSegments>

        {/* Corner Precision Standoff Pins */}
        {[
          [-1.42, 0.86],
          [1.42, 0.86],
          [-1.42, -0.86],
          [1.42, -0.86],
        ].map(([px, py]) => (
          <mesh key={`${px}-${py}`} position={[px, py, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.06, 16]} />
            <meshStandardMaterial color={palette.bracket} metalness={0.92} roughness={0.22} />
          </mesh>
        ))}
      </group>

      {/* Part 3: Recessed Code Screen Glass Display */}
      <mesh ref={screenMeshRef} position={[0, 0, -0.24]}>
        <planeGeometry args={[2.86, 1.76]} />
        <meshPhysicalMaterial
          map={screenTex}
          roughness={0.14}
          metalness={0.12}
          clearcoat={0.85}
          clearcoatRoughness={0.08}
          emissive="#1e3a8a"
          emissiveMap={screenTex}
          emissiveIntensity={0.42}
        />
      </mesh>

      {/* Part 4: Extruded Metallic Left Angle Bracket `<` */}
      <mesh
        ref={leftBracketRef}
        geometry={leftBracketGeo}
        position={[-0.96, 0.04, 0.42]}
        rotation={[0, 0.12, 0]}
        castShadow={!isSoftware}
      >
        <meshPhysicalMaterial
          color={palette.bracket}
          metalness={0.94}
          roughness={0.18}
          anisotropy={0.8}
          clearcoat={0.5}
          clearcoatRoughness={0.15}
        />
      </mesh>

      {/* Part 5: Extruded Metallic Right Angle Bracket `>` */}
      <mesh
        ref={rightBracketRef}
        geometry={rightBracketGeo}
        position={[0.96, 0.04, 0.42]}
        rotation={[0, -0.12, 0]}
        castShadow={!isSoftware}
      >
        <meshPhysicalMaterial
          color={palette.bracket}
          metalness={0.94}
          roughness={0.18}
          anisotropy={0.8}
          clearcoat={0.5}
          clearcoatRoughness={0.15}
        />
      </mesh>

      {/* Part 6: Center Cobalt Prism Slash `/` */}
      <mesh
        ref={slashPrismRef}
        geometry={slashGeo}
        position={[0, 0.04, 0.48]}
        castShadow={!isSoftware}
      >
        <meshPhysicalMaterial
          ref={slashMatRef}
          color={palette.accent}
          metalness={0.78}
          roughness={0.16}
          clearcoat={1.0}
          clearcoatRoughness={0.06}
          emissive={palette.emissive}
          emissiveIntensity={0.24}
        />
      </mesh>

      {/* Parts 7-9: Floating Mechanical Developer Keycaps */}
      <group ref={keycapGroupRef} position={[0, -1.28, 0.18]}>
        {[
          { x: -0.78, y: 0.06, rotZ: 0.08, tex: keyTexA },
          { x: 0, y: -0.04, rotZ: 0, tex: keyTexB },
          { x: 0.78, y: 0.06, rotZ: -0.08, tex: keyTexC },
        ].map((keycap, i) => (
          <group
            key={i}
            position={[keycap.x, keycap.y, 0.08]}
            rotation={[-0.36, 0, keycap.rotZ]}
          >
            <mesh geometry={keycapBaseGeo} castShadow={!isSoftware}>
              <meshPhysicalMaterial
                color={palette.chassis}
                metalness={0.78}
                roughness={0.3}
                clearcoat={0.4}
              />
            </mesh>
            <mesh position={[0, 0, 0.115]}>
              <planeGeometry args={[0.38, 0.38]} />
              <meshStandardMaterial
                map={keycap.tex}
                roughness={0.35}
                metalness={0.25}
              />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

function FloatingCodeNodes({
  prefersReducedMotion,
  exploded,
}: {
  prefersReducedMotion: boolean;
  exploded: boolean;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 42;
  const explodeSpread = useRef(0);

  const seeds = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      x: ((i % 7) - 3) * 0.85 + ((i % 3) - 1) * 0.2,
      y: (((i * 3) % 9) - 4) * 0.44,
      z: -1.1 - (i % 5) * 0.35,
      phase: i * 0.45,
      speed: 0.35 + (i % 4) * 0.14,
      scaleX: 0.5 + (i % 3) * 0.45,
      scaleY: 0.45 + (i % 2) * 0.2,
    }));
  }, [count]);

  useEffect(() => {
    const instanced = meshRef.current;
    if (!instanced) return;
    seeds.forEach((seed, i) => {
      _dummy.position.set(seed.x, seed.y, seed.z);
      _dummy.scale.set(seed.scaleX, seed.scaleY, 0.45);
      _dummy.updateMatrix();
      instanced.setMatrixAt(i, _dummy.matrix);
    });
    instanced.instanceMatrix.needsUpdate = true;
    instanced.computeBoundingSphere();
  }, [seeds]);

  useFrame((state, delta) => {
    if (prefersReducedMotion || !meshRef.current) return;
    const elapsed = state.clock.getElapsedTime();
    explodeSpread.current = THREE.MathUtils.damp(
      explodeSpread.current,
      exploded ? 0.55 : 0,
      4.5,
      Math.min(delta, 0.1)
    );

    for (let i = 0; i < count; i++) {
      const seed = seeds[i];
      const bobY = seed.y + Math.sin(elapsed * seed.speed + seed.phase) * 0.14;
      const shiftX = seed.x * (1 + explodeSpread.current * 0.25);
      _vec3.set(shiftX, bobY, seed.z - explodeSpread.current * 0.4);
      _dummy.position.copy(_vec3);
      _dummy.rotation.set(0, elapsed * 0.25 + seed.phase, 0);
      _dummy.scale.set(seed.scaleX, seed.scaleY, 0.45);
      _dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, _dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[0.14, 0.055, 0.055]} />
      <meshStandardMaterial color="#3b82f6" metalness={0.55} roughness={0.32} />
    </instancedMesh>
  );
}

export default function Scene3D() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const pointerTargetRef = useRef({ x: 0, y: 0 });
  const dragStateRef = useRef({
    isDragging: false,
    rotX: 0,
    rotY: 0,
    velX: 0,
    velY: 0,
    impulse: 0,
  });
  const lastPointerRef = useRef({ x: 0, y: 0 });

  const [{ supported, isSoftware }] = useState(() => detectSoftwareWebGL());
  const [contextLost, setContextLost] = useState(false);
  const [exploded, setExploded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const finish: MaterialFinish = 'titanium';

  const [prefersReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragStateRef.current.isDragging = true;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width && rect.height) {
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      pointerTargetRef.current.x = THREE.MathUtils.clamp(nx, -1, 1);
      pointerTargetRef.current.y = THREE.MathUtils.clamp(ny, -1, 1);
    }

    if (dragStateRef.current.isDragging) {
      const dx = e.clientX - lastPointerRef.current.x;
      const dy = e.clientY - lastPointerRef.current.y;
      lastPointerRef.current = { x: e.clientX, y: e.clientY };

      const deltaY = dx * 0.0085;
      const deltaX = dy * 0.0085;
      dragStateRef.current.rotY += deltaY;
      dragStateRef.current.rotX = THREE.MathUtils.clamp(
        dragStateRef.current.rotX + deltaX,
        -0.95,
        0.95
      );
      dragStateRef.current.velY = deltaY;
      dragStateRef.current.velX = deltaX;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    dragStateRef.current.isDragging = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handlePointerLeave = () => {
    pointerTargetRef.current.x = 0;
    pointerTargetRef.current.y = 0;
    dragStateRef.current.isDragging = false;
  };

  return (
    <div
      ref={wrapperRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      aria-label="Interactive 3D developer code sculpture"
      className={`relative h-full min-h-[380px] lg:min-h-[500px] w-full touch-none ${
        hovered ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'
      }`}
    >
      {!supported || contextLost ? (
        <div
          aria-label="Developer code graphic"
          className="flex h-full min-h-[380px] lg:min-h-[500px] w-full items-center justify-center p-8"
        >
          <svg
            viewBox="0 0 320 240"
            className="h-60 w-80 text-blue-600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="24"
              y="24"
              width="272"
              height="176"
              rx="14"
              fill="#ffffff"
              stroke="#cbd5e1"
              strokeWidth="1.5"
            />
            <path
              d="M112 86L76 112L112 138"
              stroke="#1e293b"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M208 86L244 112L208 138"
              stroke="#1e293b"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M174 74L146 150"
              stroke="#2563eb"
              strokeWidth="8"
              strokeLinecap="round"
            />
          </svg>
        </div>
      ) : (
        <Canvas
          dpr={isSoftware ? 1 : [1, 2]}
          shadows={!isSoftware}
          frameloop={prefersReducedMotion ? 'demand' : 'always'}
          camera={{ position: [0, 0.12, 6.2], fov: 40, near: 0.1, far: 100 }}
          gl={{
            alpha: true,
            antialias: !isSoftware,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.05,
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
            const canvas = gl.domElement;
            const onLost = (e: Event) => {
              e.preventDefault();
              setContextLost(true);
            };
            const onRestored = () => {
              setContextLost(false);
            };
            canvas.addEventListener('webglcontextlost', onLost);
            canvas.addEventListener('webglcontextrestored', onRestored);
          }}
        >
          <StudioEnvironment />

          {/* 3-Point Warm / Cool Studio Lighting Rig */}
          <hemisphereLight args={[0xe0f2fe, 0xcbd5e1, 0.95]} />
          <directionalLight
            position={[5, 6, 5]}
            intensity={2.0}
            color="#fff8ef"
            castShadow={!isSoftware}
            shadow-mapSize={[1024, 1024]}
            shadow-camera-near={1}
            shadow-camera-far={20}
            shadow-camera-left={-4}
            shadow-camera-right={4}
            shadow-camera-top={4}
            shadow-camera-bottom={-4}
            shadow-bias={-0.0005}
            shadow-normalBias={0.02}
          />
          <directionalLight position={[-5, 2.5, -4]} intensity={1.9} color="#60a5fa" />
          <pointLight
            position={[2.5, -2.2, 3.8]}
            intensity={1.1}
            distance={16}
            decay={2}
            color="#93c5fd"
          />

          <DeveloperCodeSculpture
            isSoftware={isSoftware}
            prefersReducedMotion={prefersReducedMotion}
            exploded={exploded}
            finish={finish}
            hovered={hovered}
            onHoverChange={setHovered}
            onToggleExplode={() => setExploded((prev) => !prev)}
            dragStateRef={dragStateRef}
            pointerRef={pointerTargetRef}
          />
          <FloatingCodeNodes
            prefersReducedMotion={prefersReducedMotion}
            exploded={exploded}
          />
          <ContactShadowPlane />
        </Canvas>
      )}
    </div>
  );
}
