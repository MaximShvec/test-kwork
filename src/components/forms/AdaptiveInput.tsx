'use client';

import React, { forwardRef } from 'react';
import { useResponsive } from '@/contexts/ResponsiveContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface AdaptiveInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  
  type?: 'text' | 'email' | 'tel' | 'number' | 'url' | 'search' | 'password';
  
  
  label?: string;
  
  
  error?: string;
  
  
  touchOptimized?: boolean;
  
  
  showValidation?: boolean;
}


const getInputMode = (type: AdaptiveInputProps['type']): React.HTMLAttributes<HTMLInputElement>['inputMode'] => {
  switch (type) {
    case 'email':
      return 'email';
    case 'tel':
      return 'tel';
    case 'number':
      return 'numeric';
    case 'url':
      return 'url';
    case 'search':
      return 'search';
    default:
      return 'text';
  }
};


export const AdaptiveInput = forwardRef<HTMLInputElement, AdaptiveInputProps>(
  (
    {
      type = 'text',
      label,
      error,
      touchOptimized = true,
      showValidation = true,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const { isMobile, isTablet } = useResponsive();
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;
    const inputMode = getInputMode(type);

    const shouldOptimizeTouch = touchOptimized && (isMobile || isTablet);

    return (
      <div className="adaptive-input-wrapper w-full">
        {label && (
          <Label
            htmlFor={inputId}
            className={cn(
              'mb-2 block',
              error && 'text-destructive',

              isMobile && 'text-base',
              !isMobile && 'text-sm'
            )}
          >
            {label}
          </Label>
        )}
        
        <Input
          ref={ref}
          id={inputId}
          type={type}
          inputMode={inputMode}
          variant={shouldOptimizeTouch ? "adaptive" : "default"}
          className={cn(

            'w-full transition-all',

            shouldOptimizeTouch && [
              'text-base', // Prevent zoom on iOS
            ],

            !shouldOptimizeTouch && [
              'text-sm',
            ],

            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        
        {showValidation && error && (
          <p
            id={`${inputId}-error`}
            className={cn(
              'mt-2 text-sm font-medium text-destructive',

              isMobile && 'text-base'
            )}
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

AdaptiveInput.displayName = 'AdaptiveInput';
