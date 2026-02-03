'use client';

import React, { useEffect, useState } from 'react';

interface FrameAnimationProps {
  
  images: string[];
  
  fps?: number;
  
  className?: string;
  
  alt?: string;
  
  rangeSpeedMultipliers?: Array<{ startIndex: number; endIndex: number; multiplier: number }>;
}


export const FrameAnimation: React.FC<FrameAnimationProps> = ({
  images,
  fps = 12,
  className = '',
  alt = 'animation',
  rangeSpeedMultipliers = [],
}) => {
  const [index, setIndex] = useState(0);

  const getEffectiveFps = (frameIdx: number): number => {
    const range = rangeSpeedMultipliers.find(
      (r) => frameIdx >= r.startIndex && frameIdx <= r.endIndex,
    );
    return range ? fps * range.multiplier : fps;
  };

  useEffect(() => {
    if (!images.length) return;

    const intervalMs = 1000 / getEffectiveFps(index);

    const timeout = setTimeout(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);

    return () => clearTimeout(timeout);

  }, [index, images.length, fps, JSON.stringify(rangeSpeedMultipliers)]);

  if (!images.length) return null;

  return (
    <img
      src={images[index]}
      alt={alt}
      className={className}
      draggable={false}
    />
  );
}; 