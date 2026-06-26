"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface OrbConfig {
  radius: number;
  color: string;
  speed: number;
  orbitRadius: number;
  offset: number;
  zBase: number;
}

interface FloatingOrbsProps {
  count: number;
  size: "large" | "small";
}

export function FloatingOrbs({ count, size }: FloatingOrbsProps) {
  const orbsRef = useRef<(THREE.Mesh | null)[]>([]);

  const orbConfigs = useMemo(() => {
    const configs: OrbConfig[] = [];
    // Strict indigo and purple shades only
    const colors = ["#6366f1", "#818cf8", "#8b5cf6", "#a78bfa", "#4f46e5", "#7c3aed"];

    for (let i = 0; i < count; i++) {
      const radius =
        size === "large"
          ? 0.10 + Math.random() * 0.05 // 0.10 - 0.15
          : 0.06 + Math.random() * 0.04; // 0.06 - 0.10

      configs.push({
        radius,
        color: colors[i % colors.length],
        speed: 0.2 + Math.random() * 0.3,
        orbitRadius: 2.2 + Math.random() * 1.3,
        offset: Math.random() * Math.PI * 2,
        zBase: (Math.random() - 0.5) * 1.5,
      });
    }
    return configs;
  }, [count, size]);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    orbConfigs.forEach((config, idx) => {
      const orb = orbsRef.current[idx];
      if (orb) {
        orb.position.x = Math.sin(elapsed * config.speed + config.offset) * config.orbitRadius;
        orb.position.y = Math.cos(elapsed * config.speed * 0.7 + config.offset) * config.orbitRadius * 0.5;
        orb.position.z = config.zBase + Math.sin(elapsed * 0.1 + config.offset) * 0.2;

        // Size pulsing (Shimmer)
        const scaleVal = 1 + Math.sin(elapsed * 2 + config.offset) * 0.2;
        orb.scale.set(scaleVal, scaleVal, scaleVal);

        // Opacity pulsing (Shimmer)
        if (orb.material && !Array.isArray(orb.material)) {
          orb.material.opacity = 0.6 + Math.sin(elapsed * 3.5 + config.offset) * 0.3;
        }
      }
    });
  });

  return (
    <group>
      {orbConfigs.map((config, idx) => (
        <mesh
          key={idx}
          ref={(el) => {
            orbsRef.current[idx] = el;
          }}
        >
          <sphereGeometry args={[config.radius, 32, 32]} />
          <meshPhysicalMaterial
            color={config.color}
            emissive={config.color}
            emissiveIntensity={0.8}
            metalness={1.0}
            roughness={0.0}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
            transparent={true}
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}
