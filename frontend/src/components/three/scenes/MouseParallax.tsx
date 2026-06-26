"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface MouseParallaxProps {
  strength: number;
}

export function MouseParallax({ strength }: MouseParallaxProps) {
  // Store normalized mouse position between -1 and 1
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    const { camera } = state;

    // Calculate target camera position (maintaining original z = 5)
    const targetX = mouse.current.x * strength;
    const targetY = mouse.current.y * strength;

    // Smoothly interpolate the camera position
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);

    // Keep camera focused on the center
    camera.lookAt(0, 0, 0);
  });

  return null;
}
