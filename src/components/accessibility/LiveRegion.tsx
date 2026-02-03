

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

type AriaRelevant =
  | 'additions'
  | 'removals'
  | 'text'
  | 'all'
  | 'additions removals'
  | 'additions text'
  | 'removals additions'
  | 'removals text'
  | 'text additions'
  | 'text removals';

export interface LiveRegionProps {
  
  children: React.ReactNode;

  
  politeness?: 'polite' | 'assertive' | 'off';

  
  atomic?: boolean;

  
  relevant?: AriaRelevant;

  
  className?: string;

  
  visuallyHidden?: boolean;
}


export const LiveRegion: React.FC<LiveRegionProps> = ({
  children,
  politeness = 'polite',
  atomic = true,
  relevant = 'additions text',
  className,
  visuallyHidden = true,
}) => {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic={atomic}
      aria-relevant={relevant}
      className={cn(
        visuallyHidden && 'sr-only',
        className
      )}
    >
      {children}
    </div>
  );
};


export const AlertRegion: React.FC<Omit<LiveRegionProps, 'politeness'>> = ({
  children,
  className,
  visuallyHidden = false,
  ...props
}) => {
  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic={true}
      className={cn(
        visuallyHidden && 'sr-only',
        !visuallyHidden &&
          'p-4 bg-destructive/10 border border-destructive rounded-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default LiveRegion;
