'use client';

import { useEffect, useRef, useState } from 'react';
import type { GlobeInstance } from 'globe.gl';

interface GlobeProps {
  fillPercentage: number;
}

// Generate points distributed across the globe surface using a Fibonacci sphere
function generateGlobePoints(count: number): { lat: number; lng: number }[] {
  const points: { lat: number; lng: number }[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2; // y goes from 1 to -1
    const radius = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;

    const x = Math.cos(theta) * radius;
    const z = Math.sin(theta) * radius;

    const lat = Math.asin(y) * (180 / Math.PI);
    const lng = Math.atan2(z, x) * (180 / Math.PI);

    points.push({ lat, lng });
  }

  return points;
}

const TOTAL_POINTS = 5000;
const ALL_POINTS = generateGlobePoints(TOTAL_POINTS);

// Deterministically pick which points are "filled" using a seeded spread
function getFilledPoints(fillPercentage: number): Set<number> {
  const filledCount = Math.round((fillPercentage / 100) * TOTAL_POINTS);
  const filled = new Set<number>();
  // Spread filled points across the globe using a step pattern
  if (filledCount > 0) {
    const step = Math.floor(TOTAL_POINTS / filledCount);
    for (let i = 0; i < filledCount; i++) {
      filled.add((i * step) % TOTAL_POINTS);
    }
  }
  return filled;
}

export default function Globe({ fillPercentage }: GlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeInstanceRef = useRef<GlobeInstance | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const size = container.offsetWidth || 550;

    // Dynamically import globe.gl (browser only)
    import('globe.gl').then(({ default: GlobeGL }) => {
      if (!container) return;

      const filledSet = getFilledPoints(fillPercentage);

      const pointsData = ALL_POINTS.map((pt, idx) => ({
        lat: pt.lat,
        lng: pt.lng,
        filled: filledSet.has(idx),
      }));

      const globe = new GlobeGL(container, { rendererConfig: { antialias: true, alpha: true } });

      globe
        .width(size)
        .height(size)
        .backgroundColor('rgba(0,0,0,0)')
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
        .atmosphereColor('#3ddc84')
        .atmosphereAltitude(0.15)
        .hexPolygonsData([]) // not used — we use custom points layer
        // Use points layer to simulate hex fill
        .pointsData(pointsData)
        .pointLat('lat')
        .pointLng('lng')
        .pointAltitude(0)
        .pointRadius(0.35)
        .pointResolution(4)
        .pointColor((d: object) =>
          (d as { filled: boolean }).filled ? 'rgba(61,220,132,0.95)' : 'rgba(255,255,255,0.04)'
        );

      // Auto-rotate
      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.4;
      globe.controls().enableZoom = false;

      // Stop rotation on drag, resume on release
      const onStart = () => {
        globe.controls().autoRotate = false;
      };
      const onEnd = () => {
        globe.controls().autoRotate = true;
      };
      globe.controls().addEventListener('start', onStart);
      globe.controls().addEventListener('end', onEnd);

      globeInstanceRef.current = globe;
      setIsLoaded(true);

      // Handle resize
      const handleResize = () => {
        if (!container) return;
        const newSize = container.offsetWidth;
        globe.width(newSize).height(newSize);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        globe.controls().removeEventListener('start', onStart);
        globe.controls().removeEventListener('end', onEnd);
        globe._destructor();
      };
    });

    // cleanup captured in the async callback above; nothing to return here
  }, [fillPercentage]);

  return (
    <div className="relative" style={{ width: '100%', aspectRatio: '1 / 1' }}>
      {/* Loading placeholder — fades out once globe is ready */}
      {!isLoaded && (
        <div
          className="absolute inset-0 flex items-center justify-center rounded-full"
          style={{
            background:
              'radial-gradient(circle at 35% 35%, #162016 0%, #0d130d 40%, #0a0f0a 100%)',
          }}
        >
          <div
            className="w-8 h-8 rounded-full border-2 border-[#3ddc84]/30 border-t-[#3ddc84] animate-spin"
          />
        </div>
      )}
      {/* Globe canvas mounts here */}
      <div
        ref={containerRef}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
