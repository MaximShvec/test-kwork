'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAnimation } from '@/contexts/AnimationContext';
import { cn } from '@/lib/utils';

interface PerformanceAwareAnimationProps {
  children: React.ReactNode;
  animationType?: 'simple' | 'complex' | 'parallax';
  className?: string;
  animationClass?: string;
  fallbackClass?: string;
  delay?: number;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const PerformanceAwareAnimation: React.FC<PerformanceAwareAnimationProps> = ({
  children,
  animationType = 'simple',
  className,
  animationClass = 'animate-fade-in',
  fallbackClass = 'opacity-100',
  delay = 0,
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true,
}) => {
  const { shouldAnimate, reducedMotion, isLowEndDevice } = useAnimation();
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const canAnimate = shouldAnimate(animationType) && !reducedMotion;

  useEffect(() => {
    if (!canAnimate || !elementRef.current) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && (!triggerOnce || !hasAnimated)) {
            setTimeout(() => {
              setIsVisible(true);
              if (triggerOnce) {
                setHasAnimated(true);
              }
            }, delay);
          } else if (!triggerOnce && !entry.isIntersecting) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(elementRef.current);

    return () => {
      observer.disconnect();
    };
  }, [canAnimate, delay, threshold, rootMargin, triggerOnce, hasAnimated]);

  useEffect(() => {
    if (isVisible && canAnimate && elementRef.current) {
      const element = elementRef.current;
      const elementId = element.id || `animation-${Date.now()}`;

      if (window.performance) {
        window.performance.mark(`animation-start-${elementId}`);
      }

      element.classList.add('performance-optimized');

      const handleAnimationEnd = () => {
        element.classList.remove('performance-optimized');
        element.classList.add('animation-complete');
        
        if (window.performance) {
          window.performance.mark(`animation-end-${elementId}`);
          window.performance.measure(
            `animation-duration-${elementId}`,
            `animation-start-${elementId}`,
            `animation-end-${elementId}`
          );
        }
      };

      element.addEventListener('animationend', handleAnimationEnd, { once: true });
      element.addEventListener('transitionend', handleAnimationEnd, { once: true });

      return () => {
        element.removeEventListener('animationend', handleAnimationEnd);
        element.removeEventListener('transitionend', handleAnimationEnd);
      };
    }
  }, [isVisible, canAnimate]);

  const finalClassName = cn(
    className,
    canAnimate && isVisible ? animationClass : fallbackClass,
    {
      'animate-on-scroll': canAnimate && !isVisible,
      'in-view': canAnimate && isVisible,
      'no-animation': !canAnimate,
      'low-end-device': isLowEndDevice,
    }
  );

  return (
    <div ref={elementRef} className={finalClassName}>
      {children}
    </div>
  );
};

export default PerformanceAwareAnimation;