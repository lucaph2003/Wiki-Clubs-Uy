import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { PanoramaSpot } from '@/domain/types';

const MIN_FOV = 30;
const MAX_FOV = 90;

/** Esfera invertida + textura equirectangular, sobre three.js puro (§10.1). Se monta tras click explícito. */
export function PanoViewer({ spot }: { spot: PanoramaSpot }): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1100);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);
    const texture = new THREE.TextureLoader().load(spot.asset.src);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    let lon = spot.initialYawDeg ?? 0;
    let lat = 0;
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    let pinchDistance = 0;

    const render = (): void => {
      lat = Math.max(-85, Math.min(85, lat));
      const phi = THREE.MathUtils.degToRad(90 - lat);
      const theta = THREE.MathUtils.degToRad(lon);
      camera.position.set(0, 0, 0);
      camera.lookAt(
        500 * Math.sin(phi) * Math.cos(theta),
        500 * Math.cos(phi),
        500 * Math.sin(phi) * Math.sin(theta),
      );
      renderer.render(scene, camera);
    };

    let frame = 0;
    const loop = (): void => {
      render();
      frame = requestAnimationFrame(loop);
    };
    loop();

    const onPointerDown = (e: PointerEvent): void => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onPointerMove = (e: PointerEvent): void => {
      if (!isDragging) return;
      lon += (e.clientX - lastX) * 0.15;
      lat += (e.clientY - lastY) * 0.15;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onPointerUp = (): void => {
      isDragging = false;
    };

    const distance = (a: TouchList): number => {
      const dx = a[0]!.clientX - a[1]!.clientX;
      const dy = a[0]!.clientY - a[1]!.clientY;
      return Math.hypot(dx, dy);
    };
    const onTouchMove = (e: TouchEvent): void => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const d = distance(e.touches);
        if (pinchDistance) {
          camera.fov = THREE.MathUtils.clamp(camera.fov - (d - pinchDistance) * 0.05, MIN_FOV, MAX_FOV);
          camera.updateProjectionMatrix();
        }
        pinchDistance = d;
      }
    };
    const onTouchEnd = (): void => {
      pinchDistance = 0;
    };

    const onKeyDown = (e: KeyboardEvent): void => {
      const step = 5;
      if (e.key === 'ArrowLeft') lon -= step;
      if (e.key === 'ArrowRight') lon += step;
      if (e.key === 'ArrowUp') lat += step;
      if (e.key === 'ArrowDown') lat -= step;
      if (e.key === '+' || e.key === '=') camera.fov = THREE.MathUtils.clamp(camera.fov - step, MIN_FOV, MAX_FOV);
      if (e.key === '-') camera.fov = THREE.MathUtils.clamp(camera.fov + step, MIN_FOV, MAX_FOV);
      camera.updateProjectionMatrix();
    };

    const onResize = (): void => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const el = renderer.domElement;
    el.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd);
    el.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [spot]);

  return (
    <div
      ref={containerRef}
      className="h-80 w-full overflow-hidden rounded-2xl outline-none"
      role="application"
      aria-label={`Vista panorámica: ${spot.label}. Usá las flechas para rotar, + y - para acercar o alejar.`}
      tabIndex={0}
    />
  );
}
