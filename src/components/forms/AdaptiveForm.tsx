'use client';

import React, { useRef, useEffect } from 'react';
import { useResponsive } from '@/contexts/ResponsiveContext';
import { cn } from '@/lib/utils';

export interface AdaptiveFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  
  layout?: 'auto' | 'vertical' | 'horizontal';
  
  
  columns?: 1 | 2 | 3;
  
  
  scrollOnFocus?: boolean;
  
  
  scrollOffset?: number;
  
  children: React.ReactNode;
}


export const AdaptiveForm = React.forwardRef<HTMLFormElement, AdaptiveFormProps>(
  (
    {
      layout = 'auto',
      columns = 2,
      scrollOnFocus = true,
      scrollOffset = 80,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, isTablet } = useResponsive();
    const formRef = useRef<HTMLFormElement>(null);

    const actualLayout = layout === 'auto' 
      ? (isMobile ? 'vertical' : 'horizontal')
      : layout;

    useEffect(() => {
      if (!scrollOnFocus || !isMobile) return;

      const form = formRef.current;
      if (!form) return;

      const handleFocus = (e: FocusEvent) => {
        const target = e.target as HTMLElement;

        if (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT'
        ) {

          setTimeout(() => {
            const rect = target.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const targetTop = rect.top + scrollTop - scrollOffset;

            window.scrollTo({
              top: targetTop,
              behavior: 'smooth',
            });
          }, 300); // Delay accounts for mobile keyboard animation
        }
      };

      form.addEventListener('focus', handleFocus, true);

      return () => {
        form.removeEventListener('focus', handleFocus, true);
      };
    }, [scrollOnFocus, isMobile, scrollOffset]);

    useEffect(() => {
      if (ref) {
        if (typeof ref === 'function') {
          ref(formRef.current);
        } else {
          ref.current = formRef.current;
        }
      }
    }, [ref]);

    return (
      <form
        ref={formRef}
        className={cn(
          'adaptive-form',

          'w-full',

          actualLayout === 'vertical' && 'flex flex-col gap-4',
          actualLayout === 'horizontal' && [
            'grid gap-4',
            columns === 1 && 'grid-cols-1',
            columns === 2 && 'grid-cols-1 md:grid-cols-2',
            columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
          ],

          isMobile && 'gap-6',

          isTablet && 'gap-5',
          className
        )}
        {...props}
      />
    );
  }
);

AdaptiveForm.displayName = 'AdaptiveForm';
