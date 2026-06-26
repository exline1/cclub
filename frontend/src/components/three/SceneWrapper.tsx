"use client";

import React, { Suspense, useRef, useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";

// Canvas ni lazy import qilish
import { Canvas, useFrame } from "@react-three/fiber";
import { useDesktopAnimation } from "@/hooks/useDesktopAnimation";

// Ichki komponentlarni lazy import
import { ParticleField } from "./scenes/ParticleField";
import { GamingCrystal } from "./scenes/GamingCrystal";
import { FloatingOrbs } from "./scenes/FloatingOrbs";
import { MouseParallax } from "./scenes/MouseParallax";
import * as THREE from "three";

interface SceneWrapperProps {
  variant: "hero" | "light" | "minimal";
}

function DynamicLights() {
  const light1 = useRef<THREE.PointLight>(null);
  const light2 = useRef<THREE.PointLight>(null);
  const light3 = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Light 1 (Indigo): orbits in X-Z plane
    if (light1.current) {
      light1.current.position.x = Math.sin(time * 0.5) * 4;
      light1.current.position.z = Math.cos(time * 0.5) * 4;
      light1.current.position.y = Math.sin(time * 0.3) * 2;
    }

    // Light 2 (Purple): orbits in Y-Z plane
    if (light2.current) {
      light2.current.position.y = Math.sin(time * 0.6) * 4;
      light2.current.position.z = Math.cos(time * 0.6) * 4;
      light2.current.position.x = Math.cos(time * 0.4) * 2;
    }

    // Light 3 (White/Soft Blue): orbits in X-Y plane
    if (light3.current) {
      light3.current.position.x = Math.cos(time * 0.7) * 3;
      light3.current.position.y = Math.sin(time * 0.7) * 3;
      light3.current.position.z = 2 + Math.sin(time * 0.5) * 2;
    }
  });

  return (
    <>
      <pointLight ref={light1} color="#6366f1" intensity={5} distance={12} />
      <pointLight ref={light2} color="#8b5cf6" intensity={4} distance={12} />
      <pointLight ref={light3} color="#ffffff" intensity={3} distance={10} />
    </>
  );
}

export function SceneWrapper({ variant }: SceneWrapperProps) {
  const { shouldAnimate } = useDesktopAnimation();
  const [contextLost, setContextLost] = useState(false);
  const [frameloop, setFrameloop] = useState<"always" | "demand">("demand");
  const glRef = useRef<HTMLCanvasElement | null>(null);

  // visibility change listener to pause rendering loops when browser tab is inactive
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setFrameloop("demand");
      } else {
        setFrameloop("always");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleContextLost = useCallback((event: Event) => {
    event.preventDefault();
    setContextLost(true);
    console.warn("WebGL Context Lost. Unmounting 3D Background Canvas.");
  }, []);

  // Cleanup WebGL context lost event listener
  useEffect(() => {
    return () => {
      if (glRef.current) {
        glRef.current.removeEventListener("webglcontextlost", handleContextLost);
      }
    };
  }, [handleContextLost]);

  // If mobile viewport width < 768px, reduced motion is active, or WebGL context lost, skip rendering
  if (!shouldAnimate || contextLost) {
    return null;
  }

  return (
    <Canvas
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
      }}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
      }}
      dpr={1}
      camera={{ position: [0, 0, 5], fov: 75 }}
      frameloop={frameloop}
      onCreated={({ gl }) => {
        glRef.current = gl.domElement;
        gl.domElement.addEventListener("webglcontextlost", handleContextLost);
      }}
    >
        {variant === "hero" && (
          <>
            <ambientLight intensity={0.2} />
            <DynamicLights />
            <ParticleField
              count={3500}
              size={0.015}
              speed={0.0004}
              repulsionEnabled={true}
            />
            <GamingCrystal />
            <FloatingOrbs count={7} size="large" />
            <MouseParallax strength={0.4} />
          </>
        )}

        {variant === "light" && (
          <>
            <ambientLight intensity={0.15} />
            <DynamicLights />
            <ParticleField
              count={1500}
              size={0.012}
              speed={0.0003}
              repulsionEnabled={true}
            />
            <FloatingOrbs count={4} size="small" />
            <MouseParallax strength={0.2} />
          </>
        )}

        {variant === "minimal" && (
          <>
            <ambientLight intensity={0.1} />
            <ParticleField
              count={600}
              size={0.01}
              speed={0.0002}
              repulsionEnabled={false}
            />
          </>
        )}
      </Canvas>
  );
}
