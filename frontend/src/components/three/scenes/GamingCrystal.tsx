"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function GamingCrystal() {
  const crystalRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const targetScale = hovered ? 1.15 : 1.0;

  useFrame(() => {
    if (crystalRef.current) {
      // Rotate the crystal
      crystalRef.current.rotation.x += 0.003;
      crystalRef.current.rotation.y += 0.005;

      // Smoothly scale the crystal on hover
      const s = THREE.MathUtils.lerp(crystalRef.current.scale.x, targetScale, 0.1);
      crystalRef.current.scale.set(s, s, s);
    }

    if (haloRef.current) {
      // Rotate the tilted halo around its local Z axis
      haloRef.current.rotation.z += 0.002;
    }
  });

  return (
    <group>
      {/* Angled Halo Ring around the crystal */}
      <mesh ref={haloRef} rotation={[0.6, 0.4, 0]}>
        <ringGeometry args={[1.4, 1.6, 64]} />
        <meshBasicMaterial
          color="#6366f1"
          transparent={true}
          opacity={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Crystal Mesh Group with Pointer Events */}
      <group
        ref={crystalRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Main Crystal body */}
        <mesh castShadow receiveShadow>
          <icosahedronGeometry args={[1.2, 1]} />
          <meshPhysicalMaterial
            color="#6366f1"
            emissive="#4338ca"
            emissiveIntensity={0.4}
            metalness={0.9}
            roughness={0.05}
            transmission={0.1}
            thickness={1.0}
          />
        </mesh>

        {/* Wireframe Outline */}
        <mesh>
          <icosahedronGeometry args={[1.2, 1]} />
          <meshBasicMaterial
            color="#818cf8"
            wireframe={true}
            transparent={true}
            opacity={0.12}
          />
        </mesh>
      </group>
    </group>
  );
}
