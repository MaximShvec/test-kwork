'use client';

import React, { forwardRef } from 'react';
import { useResponsive } from '@/contexts/ResponsiveContext';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface AdaptiveButtonProps extends ButtonProps {
  
  touchOptimized?: boolean;
  
  
  adaptiveSize?: 'sm' | 'default' | 'lg' | 'icon';
  
  
  loading?: boolean;
  
  
  loadingText?: string;
}


export const AdaptiveButton = forwardRef<HTMLButtonElement, AdaptiveButtonProps>(
  (
    {
      touchOptimized = true,
      adaptiveSize = 'default',
      loading = false,
      loadingText,
      children,
      className,
      disabled,
      variant = 'adaptive',
      size,
      ...props
    },
    ref
  ) => {
    const { isMobile, isTablet } = useResponsive();

    const shouldOptimizeTouch = touchOptimized && (isMobile || isTablet);

    const getAdaptiveSize = () => {
      if (size) return size; // Use explicit size if provided
      
      if (shouldOptimizeTouch) {

        switch (adaptiveSize) {
          case 'sm':
            return 'adaptive-sm';
          case 'lg':
            return 'adaptive-lg';
          case 'icon':
            return 'adaptive-icon';
          default:
            return 'adaptive-default';
        }
      } else {

        return adaptiveSize === 'default' ? 'default' : adaptiveSize;
      }
    };

    const buttonSize = getAdaptiveSize();
    const isDisabled = disabled || loading;

    return (
      <Button
        ref={ref}
        variant={variant}
        size={buttonSize}
        disabled={isDisabled}
        className={cn(

          'transition-all duration-200',

          shouldOptimizeTouch && [
            'active:scale-95', // Subtle press feedback on touch
          ],

          loading && 'cursor-wait',
          className
        )}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {loading && loadingText ? loadingText : children}
      </Button>
    );
  }
);

AdaptiveButton.displayName = 'AdaptiveButton';