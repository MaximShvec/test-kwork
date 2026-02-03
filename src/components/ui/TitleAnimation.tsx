'use client';

import React from 'react';
import { SmoothFrameAnimation } from '@/components/ui/smooth-frame-animation';
import { animation4Frames } from '@/lib/animation4Frames';

export const TitleAnimation: React.FC = () => {
  return (
    <SmoothFrameAnimation
      images={animation4Frames}
      className="self-end"
      width={280}
      height={280}
      baseFps={43.2}
      speedRanges={[{ startIndex: 5, endIndex: 25, multiplier: 1.4 }]}
    />
  );
};
