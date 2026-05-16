'use client';

import { useEffect, useRef, useState } from 'react';
import type { GlobeInstance } from 'globe.gl';

interface GlobeProps {
  fillPercentage: number;
}

// Floating purchase card data
interface PurchaseCard {
  id: number;
  text: string;
  x: number; // percent
  y: number; // percent
  visible: boolean;
}

const SAMPLE_PURCHASES = [
  { text: 'Sarah M. funded 5t of carbon removal via Borneo Reforestation', emoji: '🌿' },
  { text: 'GreenTech Solutions funded 20t of emissions avoidance via Amazon REDD+', emoji: '🌍' },
  { text: 'James K. funded 2t of carbon removal via Scottish Peatland', emoji: '🌿' },
  { text: 'Ocean Labs funded 10t of carbon removal via Seagrass Meadow', emoji: '🌊' },
  { text: 'Priya R. funded 8t of carbon removal via Borneo Reforestation', emoji: '🌿' },
  { text: 'Volta Energy funded 50t of emissions avoidance via Amazon REDD+', emoji: '🌍' },
  { text: 'Tom & Ella funded 1t of carbon removal via Scottish Peatland', emoji: '🌿' },
  { text: 'Someone in Canada funded 3t via Kenya Cookstoves', emoji: '🌱' },
];

// Card positions that avoid the very centre of the globe (where the planet is)
// Using positions around the edges of the globe container
const CARD_POSITIONS = [
  { x: 5, y: 15 },
  { x: 62, y: 10 },
  { x: 5, y: 60 },
  { x: 60, y: 65 },
  { x: 8, y: 38 },
  { x: 58, y: 38 },
];

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

const TOTAL_POINTS = 8000;
const ALL_POINTS = generateGlobePoints(TOTAL_POINTS);

// Sort points by latitude ascending (south pole first) for bottom-to-top fill
const POINTS_SORTED_BY_LAT = ALL_POINTS
  .map((pt, idx) => ({ ...pt, originalIdx: idx }))
  .sort((a, b) => a.lat - b.lat);

// Determine which points are "filled" — fill from south pole upward
function getFilledSet(fillPercentage: number): Set<number> {
  const filledCount = Math.round((fillPercentage / 100) * TOTAL_POINTS);
  const filled = new Set<number>();
  for (let i = 0; i < filledCount; i++) {
    filled.add(POINTS_SORTED_BY_LAT[i].originalIdx);
  }
  return filled;
}

let cardIdCounter = 0;

export default function Globe({ fillPercentage }: GlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeInstanceRef = useRef<GlobeInstance | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [cards, setCards] = useState<PurchaseCard[]>([]);
  const cardTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Use a minimum fill of 20% so the globe looks meaningful on launch
  const effectiveFill = fillPercentage < 1 ? 20 : fillPercentage;

  // Floating purchase cards cycle
  useEffect(() => {
    let positionIndex = 0;

    const showNextCard = () => {
      const sample = SAMPLE_PURCHASES[Math.floor(Math.random() * SAMPLE_PURCHASES.length)];
      const pos = CARD_POSITIONS[positionIndex % CARD_POSITIONS.length];
      positionIndex++;

      const newCard: PurchaseCard = {
        id: cardIdCounter++,
        text: `${sample.emoji} ${sample.text}`,
        x: pos.x,
        y: pos.y,
        visible: true,
      };

      setCards((prev) => {
        // Keep at most 3 visible at once
        const active = prev.filter((c) => c.visible).slice(-2);
        return [...active, newCard];
      });

      // Fade out after 3.5 seconds
      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) => (c.id === newCard.id ? { ...c, visible: false } : c))
        );
        // Remove from DOM after fade
        setTimeout(() => {
          setCards((prev) => prev.filter((c) => c.id !== newCard.id));
        }, 600);
      }, 3500);
    };

    // First card after 2 seconds
    const firstTimeout = setTimeout(showNextCard, 2000);
    // Then every 3.5 seconds
    cardTimerRef.current = setInterval(showNextCard, 3500);

    return () => {
      clearTimeout(firstTimeout);
      if (cardTimerRef.current) clearInterval(cardTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const size = container.offsetWidth || 550;

    import('globe.gl').then(({ default: GlobeGL }) => {
      if (!container) return;

      const filledSet = getFilledSet(effectiveFill);

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
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
        .atmosphereColor('#2d6a4f')
        .atmosphereAltitude(0.12)
        .pointsData(pointsData)
        .pointLat('lat')
        .pointLng('lng')
        .pointAltitude(0)
        .pointRadius(0.35)
        .pointResolution(4)
        .pointColor((d: object) =>
          (d as { filled: boolean }).filled
            ? 'rgba(45,106,79,0.95)'
            : 'rgba(45,58,45,0.28)'
        );

      // Auto-rotate
      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.4;
      globe.controls().enableZoom = false;

      // Stop rotation on drag, resume on release
      const onStart = () => { globe.controls().autoRotate = false; };
      const onEnd = () => { globe.controls().autoRotate = true; };
      globe.controls().addEventListener('start', onStart);
      globe.controls().addEventListener('end', onEnd);

      globeInstanceRef.current = globe;
      setIsLoaded(true);

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
  }, [effectiveFill]);

  return (
    <div className="relative" style={{ width: '100%', aspectRatio: '1 / 1' }}>
      {/* Loading placeholder */}
      {!isLoaded && (
        <div
          className="absolute inset-0 flex items-center justify-center rounded-full"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #d4e8de 0%, #b8d4c4 40%, #9bc0ae 100%)',
          }}
        >
          <div className="w-8 h-8 rounded-full border-2 border-[#2d6a4f]/30 border-t-[#2d6a4f] animate-spin" />
        </div>
      )}

      {/* Globe canvas */}
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* Floating purchase cards */}
      {cards.map((card) => (
        <div
          key={card.id}
          className="absolute pointer-events-none"
          style={{
            left: `${card.x}%`,
            top: `${card.y}%`,
            opacity: card.visible ? 1 : 0,
            transition: 'opacity 0.5s ease',
            zIndex: 10,
          }}
        >
          <div
            className="flex items-start gap-2 px-3 py-2 rounded-lg max-w-[200px]"
            style={{
              background: 'white',
              border: '1px solid #e0e8e0',
              boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
            }}
          >
            <span
              className="w-2 h-2 rounded-full mt-1 shrink-0"
              style={{ background: '#2d6a4f' }}
            />
            <p className="text-[#1a1a1a] text-xs leading-snug">{card.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
