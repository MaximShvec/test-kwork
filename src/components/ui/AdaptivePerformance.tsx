'use client';

import React from 'react';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

interface AdaptivePerformanceProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  disableOnSlowDevice?: boolean;
}


export function AdaptivePerformance({
  children,
  fallback,
  disableOnSlowDevice = true,
}: AdaptivePerformanceProps) {
  const { slowDevice } = usePerformanceMonitor();

  if (slowDevice && disableOnSlowDevice) {
    return <>{fallback || children}</>;
  }

  return <>{children}</>;
}


export function withPerformanceMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  FallbackComponent?: React.ComponentType<P>
) {
  return function PerformanceMonitoredComponent(props: P) {
    const { slowDevice } = usePerformanceMonitor();

    if (slowDevice && FallbackComponent) {
      return <FallbackComponent {...props} />;
    }

    return <Component {...props} />;
  };
}

export function usePerformanceAwareProps() {
  const { slowDevice, fps } = usePerformanceMonitor();

  return {
    shouldAnimate: !slowDevice,
    shouldUseHeavyEffects: !slowDevice,
    reducedMotion: slowDevice,
    performanceMode: slowDevice ? 'low' : 'high',
    fps,
  };
}
