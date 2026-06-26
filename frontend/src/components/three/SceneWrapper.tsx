"use client";

import React, { Suspense, useRef, useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";

// Canvas ni lazy import qilish
import { Canvas } from "@react-three/fiber";
import { useDesktopAnimation } from "@/hooks/useDesktopAnimation";

// Ichki komponentlarni lazy import
import { ParticleField } from "./scenes/ParticleField";
import { GamingCrystal } from "./scenes/GamingCrystal";
import { FloatingOrbs } from "./scenes/FloatingOrbs";
import { MouseParallax } from "./scenes/MouseParallax";

interface SceneWrapperProps {
  variant: "hero" | "light" | "minimal";
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
        setFrameloop("demand");
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
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
      }}
    >
      <Canvas
        gl={{ antialias: false, alpha: true }}
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
            <ambientLight intensity={0.3} />
            <pointLight position={[3, 3, 3]} color="#6366f1" intensity={3} />
            <pointLight position={[-3, -3, 2]} color="#818cf8" intensity={2} />
            <pointLight position={[0, 0, -3]} color="#4338ca" intensity={1} />
            <ParticleField
              count={1500}
              size={0.012}
              speed={0.0003}
              repulsionEnabled={true}
            />
            <GamingCrystal />
            <FloatingOrbs count={3} size="large" />
            <MouseParallax strength={0.3} />
          </>
        )}

        {variant === "light" && (
          <>
            <ambientLight intensity={0.2} />
            <pointLight position={[2, 2, 2]} color="#6366f1" intensity={1.5} />
            <ParticleField
              count={800}
              size={0.01}
              speed={0.0002}
              repulsionEnabled={false}
            />
            <FloatingOrbs count={2} size="small" />
            <MouseParallax strength={0.15} />
          </>
        )}

        {variant === "minimal" && (
          <>
            <ambientLight intensity={0.1} />
            <ParticleField
              count={300}
              size={0.008}
              speed={0.0001}
              repulsionEnabled={false}
            />
          </>
        )}
      </Canvas>
    </div>
  );
}
