'use client';

import dynamic from 'next/dynamic';

interface GlobeWrapperProps {
  fillPercentage: number;
}

function GlobePlaceholder() {
  return (
    <div
      className="relative w-full rounded-full"
      style={{
        aspectRatio: '1 / 1',
        background: 'radial-gradient(circle at 35% 35%, #d4e8de 0%, #b8d4c4 40%, #9bc0ae 100%)',
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#2d6a4f]/30 border-t-[#2d6a4f] animate-spin" />
      </div>
    </div>
  );
}

const GlobeDynamic = dynamic(() => import('./Globe'), {
  ssr: false,
  loading: () => <GlobePlaceholder />,
});

export default function GlobeWrapper({ fillPercentage }: GlobeWrapperProps) {
  return <GlobeDynamic fillPercentage={fillPercentage} />;
}
