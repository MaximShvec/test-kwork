'use client';

import { useState, useEffect, useRef } from 'react';


export interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  slowDevice: boolean;
}


export function usePerformanceMonitor(): PerformanceMetrics {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    slowDevice: false,
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const rafIdRef = useRef<number>();

  useEffect(() => {
    const MEASURE_DURATION_MS = 5000; // измерить FPS 5 сек, затем остановить — бесконечный rAF блокировал вкладку
    const startTime = performance.now();

    const measureFPS = () => {
      const now = performance.now();
      if (now - startTime > MEASURE_DURATION_MS) {
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        return;
      }

      frameCountRef.current++;
      const elapsed = now - lastTimeRef.current;

      if (elapsed >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / elapsed);

        let memoryUsage = 0;
        if ('memory' in performance && (performance as any).memory) {
          const memory = (performance as any).memory;
          memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
        }

        const slowDevice = fps < 30;

        setMetrics({
          fps,
          memoryUsage,
          slowDevice,
        });

        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      rafIdRef.current = requestAnimationFrame(measureFPS);
    };

    rafIdRef.current = requestAnimationFrame(measureFPS);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return metrics;
}
