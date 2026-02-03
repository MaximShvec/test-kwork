'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAnimationPerformance } from '@/hooks/useAnimationPerformance';

interface AnimationContextType {
  appReadyForAnimation: boolean;
  setAppReadyForAnimation: (ready: boolean) => void;
  startHeroAnimations: boolean;
  setStartHeroAnimations: (start: boolean) => void;
  shouldAnimate: (type?: 'simple' | 'complex' | 'parallax') => boolean;
  getAnimationDuration: (type: 'fast' | 'normal' | 'slow' | 'hero') => number;
  isLowEndDevice: boolean;
  reducedMotion: boolean;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export const AnimationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appReadyForAnimation, setAppReadyForAnimation] = useState(false);
  const [startHeroAnimations, setStartHeroAnimations] = useState(false);

  const {
    shouldAnimate,
    getAnimationDuration,
    isLowEndDevice,
    reducedMotion,
  } = useAnimationPerformance();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadingComplete = sessionStorage.getItem('loadingScreenComplete') === 'true';
      if (loadingComplete) {
        setAppReadyForAnimation(true);

        setStartHeroAnimations(!reducedMotion);
      }
    }
  }, [reducedMotion]);

  useEffect(() => {
    const handleLoadingComplete = () => {
      setAppReadyForAnimation(true);

      setStartHeroAnimations(!reducedMotion);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('loadingScreenComplete', handleLoadingComplete);
      return () => {
        window.removeEventListener('loadingScreenComplete', handleLoadingComplete);
      };
    }
  }, [reducedMotion]);

  return (
    <AnimationContext.Provider
      value={{
        appReadyForAnimation,
        setAppReadyForAnimation,
        startHeroAnimations,
        setStartHeroAnimations,
        shouldAnimate,
        getAnimationDuration,
        isLowEndDevice,
        reducedMotion,
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = (): AnimationContextType => {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};
