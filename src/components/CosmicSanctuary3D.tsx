import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Profile } from "../types";
import { getProfileComputed } from "../utils/calculations";
import { 
  Sparkles, 
  RotateCw, 
  Maximize2, 
  Minimize2, 
  Compass, 
  Eye, 
  Info, 
  Layers, 
  Sliders, 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";

interface CosmicSanctuary3DProps {
  profile: Profile;
}

interface CelestialNode {
  name: string;
  distance: number;
  speed: number;
  radius: number;
  color: number;
  emissive: number;
  mesh: THREE.Mesh;
  angle: number;
  archetype: string;
}

export const CosmicSanctuary3D: React.FC<CosmicSanctuary3DProps> = ({ profile }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedBody, setSelectedBody] = useState<string | null>(null);
  const [rotationSpeed, setRotationSpeed] = useState<number>(1.0);
  const [auraGlow, setAuraGlow] = useState<boolean>(true);
  const [controlsDockCollapsed, setControlsDockCollapsed] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const comp = profile.computed || getProfileComputed(profile);

  // References for camera transitions
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Fog Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060913);
    scene.fog = new THREE.FogExp2(0x060913, 0.015);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 18, 32);
    cameraRef.current = camera;

    // 3. WebGL Renderer with High-DPI clamp & Tone Mapping
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Damped OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 85;
    controls.minDistance = 6;
    controls.maxPolarAngle = Math.PI / 2 + 0.1;
    controls.target.set(0, 2, 0);
    controlsRef.current = controls;

    // 5. Studio PBR Lighting Setup
    // Key Light - Warm Golden/Teal Directional
    const keyLight = new THREE.DirectionalLight(0xfff4e6, 2.2);
    keyLight.position.set(20, 30, 20);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    scene.add(keyLight);

    // Fill Light - Cool Indigo/Violet Hemisphere
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x1e1b4b, 1.2);
    scene.add(hemiLight);

    // Point Light in the Sacred Core (Lotus Center)
    const corePointLight = new THREE.PointLight(0x2dd4bf, 3.5, 30, 1.5);
    corePointLight.position.set(0, 2, 0);
    scene.add(corePointLight);

    // Subtle Rim Light
    const rimLight = new THREE.DirectionalLight(0xc084fc, 1.4);
    rimLight.position.set(-20, 15, -20);
    scene.add(rimLight);

    // 6. PROCEDURAL COMPOSITE MODEL: SACRED POINT ZERO LOTUS & ORRERY (9 Parts)
    const sanctuaryGroup = new THREE.Group();
    scene.add(sanctuaryGroup);

    // Part 1: Central Point Zero Crystal Core (Icosahedron + Wireframe cage)
    const crystalGeo = new THREE.IcosahedronGeometry(1.4, 1);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0x2dd4bf,
      emissive: 0x0d9488,
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.85,
      ior: 1.5,
      thickness: 1.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const crystalCore = new THREE.Mesh(crystalGeo, crystalMat);
    crystalCore.position.y = 2.2;
    sanctuaryGroup.add(crystalCore);

    // Part 2: Merkabah Sacred Lattice Wireframe
    const wireGeo = new THREE.OctahedronGeometry(1.8, 0);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    });
    const merkabahWire = new THREE.Mesh(wireGeo, wireMat);
    merkabahWire.position.copy(crystalCore.position);
    sanctuaryGroup.add(merkabahWire);

    // Part 3: Golden Stamen Filaments Ring
    const stamenCount = 18;
    const stamenGroup = new THREE.Group();
    stamenGroup.position.y = 1.6;
    for (let i = 0; i < stamenCount; i++) {
      const angle = (i / stamenCount) * Math.PI * 2;
      const stamenStemGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.2, 8);
      const stamenStemMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.9,
        roughness: 0.2,
      });
      const stamenStem = new THREE.Mesh(stamenStemGeo, stamenStemMat);
      stamenStem.position.set(Math.cos(angle) * 1.5, 0.6, Math.sin(angle) * 1.5);
      stamenStem.rotation.x = Math.sin(angle) * 0.25;
      stamenStem.rotation.z = -Math.cos(angle) * 0.25;

      const stamenTipGeo = new THREE.SphereGeometry(0.12, 12, 12);
      const stamenTipMat = new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.8,
        roughness: 0.3,
      });
      const stamenTip = new THREE.Mesh(stamenTipGeo, stamenTipMat);
      stamenTip.position.set(0, 0.65, 0);
      stamenStem.add(stamenTip);
      stamenGroup.add(stamenStem);
    }
    sanctuaryGroup.add(stamenGroup);

    // Part 4, 5, 6: Sacred Lotus Petal Tiers (Inner, Middle, Outer)
    const createPetalGeometry = (width: number, length: number) => {
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.quadraticCurveTo(width, length * 0.5, 0, length);
      shape.quadraticCurveTo(-width, length * 0.5, 0, 0);

      const extrudeSettings = {
        depth: 0.08,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: 0.04,
        bevelThickness: 0.04,
      };
      return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    };

    // Lotus Petal Materials: Royal Purple & Cosmic Blue (Contrasting with the Teal/Gold Orb)
    const petalMatInner = new THREE.MeshPhysicalMaterial({
      color: 0xc084fc, // Radiant purple / violet
      emissive: 0x7e22ce, // Deep amethyst purple
      emissiveIntensity: 0.45,
      roughness: 0.15,
      metalness: 0.1,
      transmission: 0.55,
      ior: 1.45,
      transparent: true,
      opacity: 0.95,
      clearcoat: 0.8,
    });

    const petalMatMiddle = new THREE.MeshPhysicalMaterial({
      color: 0x818cf8, // Indigo-blue violet transition
      emissive: 0x4338ca, // Deep indigo
      emissiveIntensity: 0.35,
      roughness: 0.2,
      metalness: 0.2,
      transmission: 0.45,
      transparent: true,
      opacity: 0.92,
    });

    const petalMatOuter = new THREE.MeshStandardMaterial({
      color: 0x2563eb, // Royal sapphire blue
      emissive: 0x1d4ed8, // Luminous cosmic blue
      emissiveIntensity: 0.25,
      roughness: 0.3,
      metalness: 0.35,
      side: THREE.DoubleSide,
    });

    // Inner Petals (8 petals - Radiant Purple)
    const innerPetals = new THREE.Group();
    innerPetals.position.y = 1.3;
    const innerPetalGeo = createPetalGeometry(0.8, 2.6);
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const petal = new THREE.Mesh(innerPetalGeo, petalMatInner);
      petal.rotation.x = -Math.PI / 2 + 0.45;
      petal.rotation.z = -angle;
      petal.position.set(Math.cos(angle) * 1.2, 0, Math.sin(angle) * 1.2);
      innerPetals.add(petal);
    }
    sanctuaryGroup.add(innerPetals);

    // Middle Petals (12 petals, offset - Indigo / Violet-Blue)
    const middlePetals = new THREE.Group();
    middlePetals.position.y = 1.0;
    const midPetalGeo = createPetalGeometry(1.1, 3.4);
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + Math.PI / 12;
      const petal = new THREE.Mesh(midPetalGeo, petalMatMiddle);
      petal.rotation.x = -Math.PI / 2 + 0.32;
      petal.rotation.z = -angle;
      petal.position.set(Math.cos(angle) * 2.0, 0, Math.sin(angle) * 2.0);
      middlePetals.add(petal);
    }
    sanctuaryGroup.add(middlePetals);

    // Outer Petals (16 petals)
    const outerPetals = new THREE.Group();
    outerPetals.position.y = 0.6;
    const outerPetalGeo = createPetalGeometry(1.3, 4.2);
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const petal = new THREE.Mesh(outerPetalGeo, petalMatOuter);
      petal.rotation.x = -Math.PI / 2 + 0.18;
      petal.rotation.z = -angle;
      petal.position.set(Math.cos(angle) * 2.8, 0, Math.sin(angle) * 2.8);
      outerPetals.add(petal);
    }
    sanctuaryGroup.add(outerPetals);

    // Part 7: Sacred Astrological Gimbal Orbit Rings
    const ringMatGold = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.15,
    });
    const ringMatTeal = new THREE.MeshStandardMaterial({
      color: 0x2dd4bf,
      metalness: 0.85,
      roughness: 0.25,
    });

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(5.2, 0.06, 16, 100), ringMatGold);
    ring1.rotation.x = Math.PI / 3;
    sanctuaryGroup.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(6.6, 0.05, 16, 100), ringMatTeal);
    ring2.rotation.y = Math.PI / 4;
    sanctuaryGroup.add(ring2);

    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(8.2, 0.05, 16, 100), ringMatGold);
    ring3.rotation.z = Math.PI / 6;
    sanctuaryGroup.add(ring3);

    // Part 8: Sacred Reflecting Water Pool (Lifelike Waters beneath the Lotus)
    const floorGeo = new THREE.CircleGeometry(18, 96);
    const floorMat = new THREE.MeshPhysicalMaterial({
      color: 0x050a18,
      roughness: 0.05,
      metalness: 0.65,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.95,
      transmission: 0.35,
      ior: 1.333,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = true;
    sanctuaryGroup.add(floorMesh);

    // Concentric sacred geometry floor rings
    [4, 7, 10, 13, 15.5].forEach((r, idx) => {
      const circGeo = new THREE.RingGeometry(r, r + 0.04, 64);
      const circMat = new THREE.MeshBasicMaterial({
        color: idx % 2 === 0 ? 0x2dd4bf : 0xf59e0b,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
      });
      const circMesh = new THREE.Mesh(circGeo, circMat);
      circMesh.rotation.x = -Math.PI / 2;
      circMesh.position.y = 0.02;
      sanctuaryGroup.add(circMesh);
    });

    // 7. CELESTIAL ORRERY: Astrological Spheres with Elliptical Orbits
    const celestialNodes: CelestialNode[] = [];
    const planetsData = [
      { name: "Sun", distance: 9.5, speed: 0.008, radius: 0.8, color: 0xf59e0b, emissive: 0xd97706, archetype: "Radiant Sovereign Identity" },
      { name: "Moon", distance: 11.2, speed: 0.014, radius: 0.55, color: 0xe2e8f0, emissive: 0x94a3b8, archetype: "Emotional Sanctuary & Rhythms" },
      { name: "Mercury", distance: 12.8, speed: 0.018, radius: 0.4, color: 0x38bdf8, emissive: 0x0284c7, archetype: "Cognitive Agility & Synthesis" },
      { name: "Venus", distance: 14.5, speed: 0.011, radius: 0.65, color: 0xf43f5e, emissive: 0xbe123c, archetype: "Harmonic Intimacy & Aesthetic Values" },
      { name: "Mars", distance: 16.2, speed: 0.009, radius: 0.5, color: 0xef4444, emissive: 0xb91c1c, archetype: "Courage & Catalytic Manifestation" },
      { name: "Jupiter", distance: 18.0, speed: 0.006, radius: 0.95, color: 0xa855f7, emissive: 0x7e22ce, archetype: "Expansive Wisdom & Prosperity" },
      { name: "Saturn", distance: 20.2, speed: 0.004, radius: 0.85, color: 0xfbbf24, emissive: 0xb45309, archetype: "Mastery, Structure & Karma" },
      { name: "North Node", distance: 22.5, speed: 0.003, radius: 0.5, color: 0x2dd4bf, emissive: 0x0f766e, archetype: "Evolutionary Destiny Heading" },
    ];

    planetsData.forEach((p, idx) => {
      // Orbit track line
      const orbitCurve = new THREE.EllipseCurve(0, 0, p.distance, p.distance, 0, 2 * Math.PI, false, 0);
      const points = orbitCurve.getPoints(100);
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(points);
      const orbitMat = new THREE.LineBasicMaterial({
        color: p.color,
        transparent: true,
        opacity: 0.25,
      });
      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      orbitLine.rotation.x = Math.PI / 2;
      orbitLine.position.y = 1.2;
      sanctuaryGroup.add(orbitLine);

      // Planet Mesh
      const pGeo = new THREE.SphereGeometry(p.radius, 24, 24);
      const pMat = new THREE.MeshStandardMaterial({
        color: p.color,
        emissive: p.emissive,
        emissiveIntensity: 0.45,
        roughness: 0.2,
        metalness: 0.3,
      });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.position.set(p.distance, 1.2, 0);
      pMesh.castShadow = true;
      sanctuaryGroup.add(pMesh);

      // If Saturn, add subtle ring
      if (p.name === "Saturn") {
        const saturnRingGeo = new THREE.RingGeometry(1.1, 1.8, 32);
        const saturnRingMat = new THREE.MeshBasicMaterial({
          color: 0xfde68a,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.6,
        });
        const saturnRing = new THREE.Mesh(saturnRingGeo, saturnRingMat);
        saturnRing.rotation.x = Math.PI / 3;
        pMesh.add(saturnRing);
      }

      celestialNodes.push({
        name: p.name,
        distance: p.distance,
        speed: p.speed,
        radius: p.radius,
        color: p.color,
        emissive: p.emissive,
        mesh: pMesh,
        angle: (idx / planetsData.length) * Math.PI * 2,
        archetype: p.archetype,
      });
    });

    // 8. PROCEDURAL STARDUST PARTICLES (1,500 Stars)
    const particleCount = 1500;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const tealColor = new THREE.Color(0x2dd4bf);
    const goldColor = new THREE.Color(0xf59e0b);
    const indigoColor = new THREE.Color(0x818cf8);

    for (let i = 0; i < particleCount; i++) {
      const radius = 8 + Math.random() * 45;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = Math.max(0.2, radius * Math.sin(phi) * Math.sin(theta));
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const mixedColor = i % 3 === 0 ? tealColor : i % 3 === 1 ? goldColor : indigoColor;
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const stardust = new THREE.Points(particleGeo, particleMat);
    scene.add(stardust);

    // 9. ANIMATION LOOP with 60fps & Damped camera
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      const elapsed = clock.getElapsedTime() * rotationSpeed;

      // Rotate lotus core & wireframe
      crystalCore.rotation.y = elapsed * 0.4;
      crystalCore.rotation.x = Math.sin(elapsed * 0.3) * 0.2;
      merkabahWire.rotation.y = -elapsed * 0.5;
      merkabahWire.rotation.z = Math.cos(elapsed * 0.3) * 0.2;

      // Pulsate point light core with breathing curve
      const breath = (Math.sin(elapsed * 1.5) + 1) * 0.5;
      corePointLight.intensity = 2.5 + breath * 2.0;

      // Organic gentle breathing of lotus petals (living sacred flower)
      const lotusBreath = 1 + Math.sin(elapsed * 0.9) * 0.04;
      innerPetals.scale.set(lotusBreath, lotusBreath * 1.02, lotusBreath);
      middlePetals.scale.set(1 + Math.sin(elapsed * 0.9 - 0.3) * 0.03, 1 + Math.cos(elapsed * 0.9) * 0.02, 1 + Math.sin(elapsed * 0.9 - 0.3) * 0.03);
      outerPetals.scale.set(1 + Math.sin(elapsed * 0.9 - 0.6) * 0.02, 1 + Math.cos(elapsed * 0.9) * 0.02, 1 + Math.sin(elapsed * 0.9 - 0.6) * 0.02);

      // Gentle counter-rotations of lotus petal tiers
      innerPetals.rotation.y = elapsed * 0.15;
      middlePetals.rotation.y = -elapsed * 0.1;
      outerPetals.rotation.y = elapsed * 0.05;

      // Orbital gimbal rings rotations
      ring1.rotation.y = elapsed * 0.25;
      ring2.rotation.x = elapsed * 0.2;
      ring3.rotation.z = elapsed * 0.15;

      // Orbit planets around lotus core
      celestialNodes.forEach((node) => {
        node.angle += node.speed * rotationSpeed;
        node.mesh.position.x = Math.cos(node.angle) * node.distance;
        node.mesh.position.z = Math.sin(node.angle) * node.distance;
        node.mesh.position.y = 1.2 + Math.sin(node.angle * 2) * 0.5;
        node.mesh.rotation.y += 0.02;
      });

      // Slowly rotate and float stardust particle field
      stardust.rotation.y = elapsed * 0.02;
      stardust.position.y = Math.sin(elapsed * 0.4) * 0.25;

      // Update damped controls
      controls.update();

      renderer.render(scene, camera);
    };

    animate();

    // 10. RESIZE HANDLER
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);

    // 11. CLEANUP ON UNMOUNT
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }

      // Dispose Geometries and Materials
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else if (obj.material) {
            obj.material.dispose();
          }
        }
      });
    };
  }, [rotationSpeed]);

  // Camera Presets
  const handlePreset = (preset: "core" | "orrery" | "aura") => {
    if (!cameraRef.current || !controlsRef.current) return;
    const controls = controlsRef.current;
    const camera = cameraRef.current;

    if (preset === "core") {
      camera.position.set(0, 6, 12);
      controls.target.set(0, 2, 0);
    } else if (preset === "orrery") {
      camera.position.set(0, 24, 38);
      controls.target.set(0, 1.5, 0);
    } else if (preset === "aura") {
      camera.position.set(22, 16, 22);
      controls.target.set(0, 2, 0);
    }
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div className="relative w-full h-[85vh] rounded-3xl overflow-hidden border border-teal-500/30 bg-[#060913] shadow-2xl flex flex-col" id="cosmic-sanctuary-3d-root">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Floating Badge - Profile Alignment */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-3 bg-slate-950/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-teal-500/30 shadow-lg pointer-events-auto">
        <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-400/30 flex items-center justify-center text-teal-400">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white tracking-wide">
              {profile.firstName}'s 3D Cosmic Sanctuary
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/30 font-semibold">
              Point Zero Engine
            </span>
          </div>
          <span className="text-xs text-slate-400">
            {comp.astrology.sunSign} Sun • Life Path {comp.numerology.lifePath} • {comp.humanDesign.type}
          </span>
        </div>
      </div>

      {/* Top Right Quick Actions */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={toggleFullscreen}
          className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 backdrop-blur-md transition-colors shadow-lg"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen 3D Sanctuary"}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* COMPACT FLOATING CONTROLS DOCK (<= 15% Viewport Footprint) */}
      <div className="absolute bottom-4 right-4 z-20 w-80 max-w-[calc(100vw-2rem)] bg-slate-950/85 backdrop-blur-md border border-teal-500/30 rounded-2xl p-3.5 shadow-2xl pointer-events-auto transition-all">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2 text-teal-300 text-xs font-bold">
            <Sliders className="w-3.5 h-3.5" />
            <span>Sanctuary Navigation Dock</span>
          </div>
          <button
            onClick={() => setControlsDockCollapsed(!controlsDockCollapsed)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            {controlsDockCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {!controlsDockCollapsed && (
          <div className="pt-3 space-y-3 text-xs animate-fade-in">
            {/* Camera Presets */}
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1.5">Camera Perspectives</span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => handlePreset("core")}
                  className="px-2 py-1.5 rounded-lg bg-slate-900 hover:bg-teal-950 text-slate-300 hover:text-teal-300 border border-slate-800 hover:border-teal-500/40 text-[11px] font-medium transition-colors"
                >
                  Lotus Core
                </button>
                <button
                  onClick={() => handlePreset("orrery")}
                  className="px-2 py-1.5 rounded-lg bg-slate-900 hover:bg-teal-950 text-slate-300 hover:text-teal-300 border border-slate-800 hover:border-teal-500/40 text-[11px] font-medium transition-colors"
                >
                  Full Orrery
                </button>
                <button
                  onClick={() => handlePreset("aura")}
                  className="px-2 py-1.5 rounded-lg bg-slate-900 hover:bg-teal-950 text-slate-300 hover:text-teal-300 border border-slate-800 hover:border-teal-500/40 text-[11px] font-medium transition-colors"
                >
                  Auric Orbit
                </button>
              </div>
            </div>

            {/* Rotation Speed Slider */}
            <div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase font-mono mb-1">
                <span>Harmonic Speed</span>
                <span className="text-teal-300 font-bold">{rotationSpeed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0"
                max="2.5"
                step="0.1"
                value={rotationSpeed}
                onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                className="w-full accent-teal-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Instruction footnote */}
            <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <Compass className="w-3 h-3 text-teal-400" />
                Drag to orbit • Scroll to zoom
              </span>
              <span className="text-teal-400 font-mono">60 FPS</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Left Celestial Legend */}
      <div className="absolute bottom-4 left-4 z-20 hidden md:flex items-center gap-2 bg-slate-950/70 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 text-[11px] text-slate-300 pointer-events-none">
        <div className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
        <span>Purple & Blue Lotus</span>
        <span className="text-slate-600">•</span>
        <div className="w-2.5 h-2.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)] animate-pulse" />
        <span>Point Zero Orb</span>
        <span className="text-slate-600">•</span>
        <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
        <span>Astrological Orrery</span>
      </div>
    </div>
  );
};
