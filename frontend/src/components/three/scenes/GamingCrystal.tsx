"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function GamingCrystal() {
  const crystalRef = useRef<THREE.Group>(null);
  const tiltRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const targetScale = hovered ? 1.15 : 1.0;

  useFrame((state, delta) => {
    // Continuous rotation of the crystal around all axes
    if (crystalRef.current) {
      crystalRef.current.rotation.x += delta * 0.15;
      crystalRef.current.rotation.y += delta * 0.20;
      crystalRef.current.rotation.z += delta * 0.10;

      // Smoothly scale the crystal on hover
      const s = THREE.MathUtils.lerp(crystalRef.current.scale.x, targetScale, 0.1);
      crystalRef.current.scale.set(s, s, s);
    }

    // Tilting group towards mouse cursor
    if (tiltRef.current) {
      const targetRotX = state.pointer.y * 0.4;
      const targetRotY = state.pointer.x * 0.4;
      tiltRef.current.rotation.x = THREE.MathUtils.lerp(tiltRef.current.rotation.x, targetRotX, 0.05);
      tiltRef.current.rotation.y = THREE.MathUtils.lerp(tiltRef.current.rotation.y, targetRotY, 0.05);
    }

    if (haloRef.current) {
      // Rotate the tilted halo around its local Z axis
      haloRef.current.rotation.z += delta * 0.1;
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

      {/* Crystal Mesh Group with Pointer Events and Cursor Tilt */}
      <group ref={tiltRef}>
        <group
          ref={crystalRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          {/* Main Crystal body */}
          <mesh castShadow receiveShadow>
            <icosahedronGeometry args={[1.2, 2]} />
            <meshPhysicalMaterial
              color="#6366F1"
              emissive="#4F46E5"
              emissiveIntensity={0.5}
              metalness={0.9}
              roughness={0.1}
              transparent={true}
              opacity={0.9}
              clearcoat={1.0}
              clearcoatRoughness={0.05}
            />
          </mesh>

          {/* Wireframe Outline */}
          <mesh>
            <icosahedronGeometry args={[1.2, 2]} />
            <meshBasicMaterial
              color="#818cf8"
              wireframe={true}
              transparent={true}
              opacity={0.3}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}
