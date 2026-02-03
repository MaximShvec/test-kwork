'use client';

import React, { forwardRef } from 'react';
import { useResponsive } from '@/contexts/ResponsiveContext';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface AdaptiveTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  
  label?: string;
  
  
  error?: string;
  
  
  touchOptimized?: boolean;
  
  
  showValidation?: boolean;
  
  
  minRows?: number;
}


export const AdaptiveTextarea = forwardRef<HTMLTextAreaElement, AdaptiveTextareaProps>(
  (
    {
      label,
      error,
      touchOptimized = true,
      showValidation = true,
      minRows = 3,
      className,
      id,
      rows,
      ...props
    },
    ref
  ) => {
    const { isMobile, isTablet } = useResponsive();
    const textareaId = id || `textarea-${label?.toLowerCase().replace(/\s+/g, '-')}`;

    const shouldOptimizeTouch = touchOptimized && (isMobile || isTablet);

    const adaptiveRows = rows || (shouldOptimizeTouch ? Math.max(minRows, 3) : minRows);

    return (
      <div className="adaptive-textarea-wrapper w-full">
        {label && (
          <Label
            htmlFor={textareaId}
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
        
        <Textarea
          ref={ref}
          id={textareaId}
          variant={shouldOptimizeTouch ? "adaptive" : "default"}
          rows={adaptiveRows}
          className={cn(

            'w-full transition-all resize-vertical',

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
          aria-describedby={error ? `${textareaId}-error` : undefined}
          {...props}
        />
        
        {showValidation && error && (
          <p
            id={`${textareaId}-error`}
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

AdaptiveTextarea.displayName = 'AdaptiveTextarea';