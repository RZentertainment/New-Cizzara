// components/ui/dotted-surface.tsx
'use client';
import { cn } from '@/lib/utils';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'> & {
  dotColor?: string;
  backgroundColor?: string;
  dotSize?: number;
  dotOpacity?: number;
};

export function DottedSurface({ 
  className, 
  dotColor = '#ffffff',
  backgroundColor = '#000000',
  dotSize = 10,
  dotOpacity = 0.8,
  ...props 
}: DottedSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<{
    animationId: number;
    isAnimating: boolean;
    count: number;
    geometry?: THREE.BufferGeometry;
    material?: THREE.PointsMaterial;
  }>({
    animationId: 0,
    isAnimating: false,
    count: 0,
  });

  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const animRef = animationRef.current;

    // Don't reinitialize if already animating
    if (animRef.isAnimating) return;

    const SEPARATION = 150;
    const AMOUNTX = 40;
    const AMOUNTY = 60;

    // Scene setup
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      10000,
    );
    camera.position.set(0, 355, 1220);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    container.appendChild(renderer.domElement);

    // Parse color
    const color = new THREE.Color(dotColor);
    
    // Create particles
    const positions: number[] = [];
    const colors: number[] = [];

    // Create geometry for all particles
    const geometry = new THREE.BufferGeometry();

    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
        const y = 0;
        const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;

        positions.push(x, y, z);
        colors.push(color.r * 255, color.g * 255, color.b * 255);
      }
    }

    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3),
    );
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    // Create material with better visibility
    const material = new THREE.PointsMaterial({
      size: dotSize,
      vertexColors: true,
      transparent: true,
      opacity: dotOpacity,
      sizeAttenuation: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    // Store references for updates
    animRef.geometry = geometry;
    animRef.material = material;

    // Create points object
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Animation function
    const animate = () => {
      if (!animRef.isAnimating) return;
      
      animRef.animationId = requestAnimationFrame(animate);

      const positionAttribute = geometry.attributes.position;
      const positions = positionAttribute.array as Float32Array;

      let i = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const index = i * 3;

          // Animate Y position with sine waves
          positions[index + 1] =
            Math.sin((ix + animRef.count) * 0.3) * 50 +
            Math.sin((iy + animRef.count) * 0.5) * 50;

          i++;
        }
      }

      positionAttribute.needsUpdate = true;
      renderer.render(scene, camera);
      animRef.count += 0.1;
    };

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animRef.animationId) {
          cancelAnimationFrame(animRef.animationId);
        }
        animRef.isAnimating = false;
      } else {
        if (!animRef.isAnimating) {
          animRef.isAnimating = true;
          animate();
        }
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Start animation
    animRef.isAnimating = true;
    animate();

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      animRef.isAnimating = false;
      
      if (animRef.animationId) {
        cancelAnimationFrame(animRef.animationId);
        animRef.animationId = 0;
      }

      scene.traverse((object) => {
        if (object instanceof THREE.Points) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((mat) => mat.dispose());
          } else {
            object.material.dispose();
          }
        }
      });

      renderer.dispose();

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      animRef.geometry = undefined;
      animRef.material = undefined;
    };
  }, []); // Only run once on mount

  // Update material properties without restarting animation
  useEffect(() => {
    const animRef = animationRef.current;
    if (!animRef.material || !animRef.geometry) return;

    // Update opacity and size
    animRef.material.opacity = dotOpacity;
    animRef.material.size = dotSize;
    animRef.material.needsUpdate = true;

    // Update colors
    const colorAttr = animRef.geometry.attributes.color;
    if (colorAttr) {
      const color = new THREE.Color(dotColor);
      const colorArray = colorAttr.array as Float32Array;
      for (let i = 0; i < colorArray.length; i += 3) {
        colorArray[i] = color.r * 255;
        colorArray[i + 1] = color.g * 255;
        colorArray[i + 2] = color.b * 255;
      }
      colorAttr.needsUpdate = true;
    }
  }, [dotColor, dotSize, dotOpacity]);

  return (
    <div
      ref={containerRef}
      className={cn('pointer-events-none fixed inset-0', className)}
      style={{ backgroundColor }}
      {...props}
    />
  );
}