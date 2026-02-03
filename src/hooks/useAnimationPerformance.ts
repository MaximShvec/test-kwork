'use client';

import { useEffect, useState, useCallback } from 'react';

interface AnimationPerformanceConfig {
  enableComplexAnimations: boolean;
  enableParallax: boolean;
  enableTransforms: boolean;
  reducedMotion: boolean;
  animationDuration: {
    fast: number;
    normal: number;
    slow: number;
    hero: number;
  };
}

interface PerformanceMetrics {
  deviceMemory?: number;
  hardwareConcurrency: number;
  connectionType?: string;
  batteryLevel?: number;
  isLowEndDevice: boolean;
}

export const useAnimationPerformance = () => {
  const [config, setConfig] = useState<AnimationPerformanceConfig>({
    enableComplexAnimations: true,
    enableParallax: true,
    enableTransforms: true,
    reducedMotion: false,
    animationDuration: {
      fast: 150,
      normal: 300,
      slow: 600,
      hero: 1200,
    },
  });

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    hardwareConcurrency:
      typeof navigator !== 'undefined' && navigator.hardwareConcurrency
        ? navigator.hardwareConcurrency
        : 4,
    isLowEndDevice: false,
  });

  
  const detectPerformanceCapabilities = useCallback(async (): Promise<PerformanceMetrics | undefined> => {
    if (typeof window === 'undefined') return;

    const newMetrics: PerformanceMetrics = {
      hardwareConcurrency: navigator.hardwareConcurrency || 4,
      isLowEndDevice: false,
    };

    if ('deviceMemory' in navigator) {
      const memory = (navigator as any).deviceMemory;
      if (typeof memory === 'number') {
        newMetrics.deviceMemory = memory;
        newMetrics.isLowEndDevice = memory <= 4;
      }
    }

    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection?.effectiveType) {
        newMetrics.connectionType = connection.effectiveType;

        if (
          connection.effectiveType === 'slow-2g' ||
          connection.effectiveType === '2g'
        ) {
          newMetrics.isLowEndDevice = true;
        }
      }
    }

    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        if (battery && typeof battery.level === 'number') {
          newMetrics.batteryLevel = battery.level;

          if (battery.level < 0.2) {
            newMetrics.isLowEndDevice = true;
          }
        }
      } catch {

      }
    }

    if (newMetrics.hardwareConcurrency <= 2) {
      newMetrics.isLowEndDevice = true;
    }

    setMetrics(newMetrics);
    return newMetrics;
  }, []);

  
  const updateAnimationConfig = useCallback(
    (performanceMetrics: PerformanceMetrics) => {
      const newConfig: AnimationPerformanceConfig = {
        enableComplexAnimations: true,
        enableParallax: true,
        enableTransforms: true,
        reducedMotion: false,
        animationDuration: {
          fast: 150,
          normal: 300,
          slow: 600,
          hero: 1200,
        },
      };

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        newConfig.reducedMotion = true;
        newConfig.enableComplexAnimations = false;
        newConfig.enableParallax = false;
        newConfig.enableTransforms = false;
        newConfig.animationDuration = {
          fast: 0,
          normal: 0,
          slow: 0,
          hero: 0,
        };
      }

      else if (performanceMetrics.isLowEndDevice) {
        newConfig.enableComplexAnimations = false;
        newConfig.enableParallax = false;
        newConfig.animationDuration = {
          fast: 100,
          normal: 200,
          slow: 400,
          hero: 800,
        };
      }

      else if (window.matchMedia('(prefers-reduced-data: reduce)').matches) {
        newConfig.enableComplexAnimations = false;
        newConfig.animationDuration.hero = 400;
      }

      setConfig(newConfig);

      const root = document.documentElement;
      root.style.setProperty('--animation-duration-fast', `${newConfig.animationDuration.fast}ms`);
      root.style.setProperty('--animation-duration-normal', `${newConfig.animationDuration.normal}ms`);
      root.style.setProperty('--animation-duration-slow', `${newConfig.animationDuration.slow}ms`);
      root.style.setProperty('--animation-duration-hero', `${newConfig.animationDuration.hero}ms`);
      root.style.setProperty('--enable-complex-animations', newConfig.enableComplexAnimations ? '1' : '0');
      root.style.setProperty('--enable-parallax', newConfig.enableParallax ? '1' : '0');
      root.style.setProperty('--enable-transforms', newConfig.enableTransforms ? '1' : '0');
    },
    []
  );

  
  useEffect(() => {
    detectPerformanceCapabilities().then((result) => {
      if (result) {
        updateAnimationConfig(result);
      }
    });
  }, [detectPerformanceCapabilities, updateAnimationConfig]);

  
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reducedDataQuery = window.matchMedia('(prefers-reduced-data: reduce)');

    const handleChange = () => {
      updateAnimationConfig(metrics);
    };

    reducedMotionQuery.addEventListener('change', handleChange);
    reducedDataQuery.addEventListener('change', handleChange);

    return () => {
      reducedMotionQuery.removeEventListener('change', handleChange);
      reducedDataQuery.removeEventListener('change', handleChange);
    };
  }, [metrics, updateAnimationConfig]);

  const shouldAnimate = useCallback(
    (type: 'simple' | 'complex' | 'parallax' = 'simple') => {
      if (config.reducedMotion) return false;

      if (type === 'complex') return config.enableComplexAnimations;
      if (type === 'parallax') return config.enableParallax;

      return true;
    },
    [config]
  );

  const getAnimationDuration = useCallback(
    (type: keyof AnimationPerformanceConfig['animationDuration']) => {
      return config.animationDuration[type];
    },
    [config]
  );

  const getAnimationClass = useCallback(
    (baseClass: string, type: 'simple' | 'complex' | 'parallax' = 'simple') => {
      if (!shouldAnimate(type)) {
        return `${baseClass} no-animation`;
      }
      return baseClass;
    },
    [shouldAnimate]
  );

  
  const markAnimationStart = useCallback((id: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(`animation-start-${id}`);
    }
  }, []);

  const markAnimationEnd = useCallback((id: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(`animation-end-${id}`);
      window.performance.measure(
        `animation-duration-${id}`,
        `animation-start-${id}`,
        `animation-end-${id}`
      );
    }
  }, []);

  return {
    config,
    metrics,
    shouldAnimate,
    getAnimationDuration,
    getAnimationClass,
    markAnimationStart,
    markAnimationEnd,
    isLowEndDevice: metrics.isLowEndDevice,
    reducedMotion: config.reducedMotion,
  };
};

export default useAnimationPerformance;
