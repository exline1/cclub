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
  count = 3000,
  size,
  speed,
  opacity = 0.8,
  repulsionEnabled = true,
}: ParticleFieldProps) {
  const pointsRef1 = useRef<THREE.Points>(null);
  const pointsRef2 = useRef<THREE.Points>(null);
  const pointsRef3 = useRef<THREE.Points>(null);

  // Generate random positions once
  const initialPositions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, [count]);

  // Maintain current positions to animate/lerp
  const currentPositions = useMemo(() => new Float32Array(initialPositions), [initialPositions]);

  // Generate random velocities for drifting
  const velocities = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const driftSpeed = speed * 1.5;
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * driftSpeed;
      arr[i * 3 + 1] = (Math.random() - 0.5) * driftSpeed;
      arr[i * 3 + 2] = (Math.random() - 0.5) * driftSpeed;
    }
    return arr;
  }, [count, speed]);

  // Generate colors gradient (Indigo #6366F1 to Purple #8B5CF6)
  const colors = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const color1 = new THREE.Color("#6366F1");
    const color2 = new THREE.Color("#8B5CF6");
    const tempColor = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const t = Math.random();
      tempColor.lerpColors(color1, color2, t);
      arr[i * 3] = tempColor.r;
      arr[i * 3 + 1] = tempColor.g;
      arr[i * 3 + 2] = tempColor.b;
    }
    return arr;
  }, [count]);

  // Subdivide count for size partitioning
  const count1 = Math.floor(count / 3);
  const count2 = Math.floor(count / 3);
  const count3 = count - count1 - count2;

  // Subarray memory views to share the same coordinates
  const currentPositions1 = useMemo(() => currentPositions.subarray(0, count1 * 3), [currentPositions, count1]);
  const currentPositions2 = useMemo(() => currentPositions.subarray(count1 * 3, (count1 + count2) * 3), [currentPositions, count1, count2]);
  const currentPositions3 = useMemo(() => currentPositions.subarray((count1 + count2) * 3), [currentPositions, count1, count2]);

  const colors1 = useMemo(() => colors.subarray(0, count1 * 3), [colors, count1]);
  const colors2 = useMemo(() => colors.subarray(count1 * 3, (count1 + count2) * 3), [colors, count1, count2]);
  const colors3 = useMemo(() => colors.subarray((count1 + count2) * 3), [colors, count1, count2]);

  // Pre-allocated THREE objects to avoid GC overhead
  const originalPos = useMemo(() => new THREE.Vector3(), []);
  const planeZ = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const mouse3D = useMemo(() => new THREE.Vector3(), []);
  const localMouse3D = useMemo(() => new THREE.Vector3(), []);
  const invMatrix = useMemo(() => new THREE.Matrix4(), []);

  useFrame((state) => {
    const p1 = pointsRef1.current;
    if (!p1) return;

    // Slowly rotate the entire system as a base movement
    const baseRotationSpeed = speed * 0.2;
    if (pointsRef1.current) {
      pointsRef1.current.rotation.y += baseRotationSpeed;
    }
    if (pointsRef2.current) {
      pointsRef2.current.rotation.y += baseRotationSpeed;
    }
    if (pointsRef3.current) {
      pointsRef3.current.rotation.y += baseRotationSpeed;
    }

    // Project mouse cursor ray onto Z=0 plane once per frame
    state.raycaster.ray.intersectPlane(planeZ, mouse3D);

    // Transform world mouse coordinate to local coordinates of points
    p1.updateMatrixWorld();
    invMatrix.copy(p1.matrixWorld).invert();
    localMouse3D.copy(mouse3D).applyMatrix4(invMatrix);

    const positions = currentPositions;
    const limit = 5.0;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Update positions with 3D drift
      initialPositions[i3] += velocities[i3];
      initialPositions[i3 + 1] += velocities[i3 + 1];
      initialPositions[i3 + 2] += velocities[i3 + 2];

      // Wrap boundaries
      if (initialPositions[i3] > limit) initialPositions[i3] = -limit;
      if (initialPositions[i3] < -limit) initialPositions[i3] = limit;
      if (initialPositions[i3 + 1] > limit) initialPositions[i3 + 1] = -limit;
      if (initialPositions[i3 + 1] < -limit) initialPositions[i3 + 1] = limit;
      if (initialPositions[i3 + 2] > limit) initialPositions[i3 + 2] = -limit;
      if (initialPositions[i3 + 2] < -limit) initialPositions[i3 + 2] = limit;

      originalPos.set(
        initialPositions[i3],
        initialPositions[i3 + 1],
        initialPositions[i3 + 2]
      );

      let targetX = originalPos.x;
      let targetY = originalPos.y;
      let targetZ = originalPos.z;

      if (repulsionEnabled) {
        const dx = originalPos.x - localMouse3D.x;
        const dy = originalPos.y - localMouse3D.y;
        const dz = originalPos.z - localMouse3D.z;
        const distSq = dx * dx + dy * dy + dz * dz;
        const repulsionRadius = 1.8;
        const repulsionRadiusSq = repulsionRadius * repulsionRadius;

        if (distSq < repulsionRadiusSq) {
          const dist = Math.sqrt(distSq);
          const force = (repulsionRadius - dist) / repulsionRadius;
          const dirX = dist > 0.0001 ? dx / dist : Math.random() - 0.5;
          const dirY = dist > 0.0001 ? dy / dist : Math.random() - 0.5;
          const dirZ = dist > 0.0001 ? dz / dist : Math.random() - 0.5;

          const pushAmount = force * 1.5;
          targetX = originalPos.x + dirX * pushAmount;
          targetY = originalPos.y + dirY * pushAmount;
          targetZ = originalPos.z + dirZ * pushAmount;
        }
      }

      // Smoothly lerp towards target (pushed position or original position)
      const lerpFactor = 0.05;
      positions[i3] += (targetX - positions[i3]) * lerpFactor;
      positions[i3 + 1] += (targetY - positions[i3 + 1]) * lerpFactor;
      positions[i3 + 2] += (targetZ - positions[i3 + 2]) * lerpFactor;
    }

    // Trigger attribute update for all 3 subgeometries
    if (pointsRef1.current) {
      const posAttr = pointsRef1.current.geometry.attributes.position;
      if (posAttr) posAttr.needsUpdate = true;
    }
    if (pointsRef2.current) {
      const posAttr = pointsRef2.current.geometry.attributes.position;
      if (posAttr) posAttr.needsUpdate = true;
    }
    if (pointsRef3.current) {
      const posAttr = pointsRef3.current.geometry.attributes.position;
      if (posAttr) posAttr.needsUpdate = true;
    }
  });

  return (
    <>
      {/* Group 1: Small Particles */}
      <points ref={pointsRef1}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[currentPositions1, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors1, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.01}
          sizeAttenuation={true}
          transparent={true}
          opacity={opacity}
          depthWrite={false}
          vertexColors={true}
        />
      </points>

      {/* Group 2: Medium Particles */}
      <points ref={pointsRef2}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[currentPositions2, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors2, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          sizeAttenuation={true}
          transparent={true}
          opacity={opacity * 0.9}
          depthWrite={false}
          vertexColors={true}
        />
      </points>

      {/* Group 3: Large Particles */}
      <points ref={pointsRef3}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[currentPositions3, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors3, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          sizeAttenuation={true}
          transparent={true}
          opacity={opacity * 0.8}
          depthWrite={false}
          vertexColors={true}
        />
      </points>
    </>
  );
}
