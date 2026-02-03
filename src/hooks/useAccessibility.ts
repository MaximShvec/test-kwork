

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  trapFocus,
  handleEscapeKey,
  createFocusManager,
  announceToScreenReader,
} from '@/lib/accessibility/focus-management';

export interface UseAccessibilityOptions {
  
  trapFocus?: boolean;

  
  onEscape?: () => void;

  
  autoFocus?: boolean;

  
  announceChanges?: boolean;

  
  manageFocus?: boolean;
}

export const useAccessibility = (options: UseAccessibilityOptions = {}) => {
  const {
    trapFocus: shouldTrapFocus = false,
    onEscape,
    autoFocus = false,
    announceChanges = false,
    manageFocus = false,
  } = options;

  const containerRef = useRef<HTMLElement>(null);
  const focusManagerRef = useRef(createFocusManager());
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsKeyboardUser(true);
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardUser(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  useEffect(() => {
    if (!shouldTrapFocus || !containerRef.current) return;

    const cleanup = trapFocus(containerRef.current);
    return cleanup;
  }, [shouldTrapFocus]);

  useEffect(() => {
    if (!onEscape) return;

    const cleanup = handleEscapeKey(onEscape);
    return cleanup;
  }, [onEscape]);

  useEffect(() => {
    if (!autoFocus || !containerRef.current) return;

    const firstFocusable = containerRef.current.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (firstFocusable) {
      firstFocusable.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (!manageFocus) return;

    focusManagerRef.current.save();

    return () => {
      focusManagerRef.current.restore();
    };
  }, [manageFocus]);

  const announce = useCallback(
    (message: string, politeness: 'polite' | 'assertive' = 'polite') => {
      if (announceChanges) {
        announceToScreenReader(message, politeness);
      }
    },
    [announceChanges]
  );

  return {
    containerRef,
    isKeyboardUser,
    announce,
    focusManager: focusManagerRef.current,
  };
};


export const useSkipLink = (targetId: string) => {
  const handleSkip = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      e.preventDefault();
      const target = document.getElementById(targetId);

      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
        target.addEventListener(
          'blur',
          () => {
            target.removeAttribute('tabindex');
          },
          { once: true }
        );
      }
    },
    [targetId]
  );

  return { handleSkip };
};


export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
};


export const useHighContrast = () => {
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setHighContrast(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setHighContrast(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return highContrast;
};
