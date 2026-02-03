'use client';

import * as React from 'react';
import { Hero } from './Hero';
import { MobileHero } from './MobileHero';
import { useResponsive } from '@/contexts/ResponsiveContext';

interface AdaptiveHeroProps {
  startHeroAnimations?: boolean;
}

export const AdaptiveHero: React.FC<AdaptiveHeroProps> = ({
  startHeroAnimations = false,
}) => {
  const { isMobile } = useResponsive();

  if (isMobile) {
    return <MobileHero />;
  }

  return <Hero startHeroAnimations={startHeroAnimations} />;
};

export default AdaptiveHero;
