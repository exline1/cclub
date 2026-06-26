"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleFieldProps {
  count: number;
  size: number;
  speed: number;
  opacity?: number;
  repulsionEnabled?: boolean;
}

export function ParticleField({
  count,
  size,
  speed,
  opacity = 0.6,
  repulsionEnabled = false,
}: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate random positions once
  const initialPositions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Distribute randomly in a 3D volume
      arr[i * 3] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, [count]);

  // Maintain current positions to animate/lerp
  const currentPositions = useMemo(() => new Float32Array(initialPositions), [initialPositions]);

  // Pre-allocated THREE objects to avoid Garbage Collection inside useFrame
  const originalPos = useMemo(() => new THREE.Vector3(), []);
  const closestPoint = useMemo(() => new THREE.Vector3(), []);
  const localRay = useMemo(() => new THREE.Ray(), []);
  const invMatrix = useMemo(() => new THREE.Matrix4(), []);

  useFrame((state) => {
    const points = pointsRef.current;
    if (!points) return;

    // Slowly rotate the particle system
    points.rotation.x += speed;
    points.rotation.y += speed;

    // Force update matrix to get the latest world matrix
    points.updateMatrixWorld();
    invMatrix.copy(points.matrixWorld).invert();
    localRay.copy(state.raycaster.ray).applyMatrix4(invMatrix);

    const posAttr = points.geometry.attributes.position;
    if (!posAttr) return;

    const positions = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      originalPos.set(
        initialPositions[i3],
        initialPositions[i3 + 1],
        initialPositions[i3 + 2]
      );

      let targetX = originalPos.x;
      let targetY = originalPos.y;
      let targetZ = originalPos.z;

      if (repulsionEnabled) {
        localRay.closestPointToPoint(originalPos, closestPoint);
        const dx = originalPos.x - closestPoint.x;
        const dy = originalPos.y - closestPoint.y;
        const dz = originalPos.z - closestPoint.z;
        const distSq = dx * dx + dy * dy + dz * dz;
        const repulsionRadius = 0.8;
        const repulsionRadiusSq = repulsionRadius * repulsionRadius;

        if (distSq < repulsionRadiusSq) {
          const dist = Math.sqrt(distSq);
          const force = (repulsionRadius - dist) / repulsionRadius;
          const dirX = dist > 0.0001 ? dx / dist : Math.random() - 0.5;
          const dirY = dist > 0.0001 ? dy / dist : Math.random() - 0.5;
          const dirZ = dist > 0.0001 ? dz / dist : Math.random() - 0.5;

          const pushAmount = force * 0.8;
          targetX = originalPos.x + dirX * pushAmount;
          targetY = originalPos.y + dirY * pushAmount;
          targetZ = originalPos.z + dirZ * pushAmount;
        }
      }

      // Smoothly lerp towards target (pushed position or original position)
      const lerpFactor = 0.08;
      positions[i3] += (targetX - positions[i3]) * lerpFactor;
      positions[i3 + 1] += (targetY - positions[i3 + 1]) * lerpFactor;
      positions[i3 + 2] += (targetZ - positions[i3 + 2]) * lerpFactor;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[currentPositions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#6366f1"
        size={size}
        sizeAttenuation={true}
        transparent={true}
        opacity={opacity}
        depthWrite={false}
      />
    </points>
  );
}
