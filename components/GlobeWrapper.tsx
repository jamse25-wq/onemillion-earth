'use client';

import dynamic from 'next/dynamic';

interface GlobeWrapperProps {
  fillPercentage: number;
}

// Loading placeholder shown while the globe JS bundle loads
function GlobePlaceholder() {
  return (
    <div
      className="relative w-full rounded-full"
      style={{
        aspectRatio: '1 / 1',
        background:
          'radial-gradient(circle at 35% 35%, #162016 0%, #0d130d 40%, #0a0f0a 100%)',
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#3ddc84]/30 border-t-[#3ddc84] animate-spin" />
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
