'use client';

import { FC } from 'react';
import { cn } from '@/lib/utils';

export interface AdaptiveSkeletonProps {
  variant: 'title' | 'heading' | 'text' | 'text-large' | 'text-small' | 'input' | 'textarea' | 'button' | 'icon' | 'icon-sm' | 'icon-lg';
  width?: string;
  className?: string;
  animate?: boolean;
}


export const AdaptiveSkeleton: FC<AdaptiveSkeletonProps> = ({
  variant,
  width = 'w-full',
  className,
  animate = true,
}) => {
  const variantClasses = {
    'title': 'skeleton-title',
    'heading': 'skeleton-heading',
    'text': 'skeleton-text',
    'text-large': 'skeleton-text-large',
    'text-small': 'skeleton-text-small',
    'input': 'skeleton-input',
    'textarea': 'skeleton-textarea',
    'button': 'skeleton-button',
    'icon': 'skeleton-icon',
    'icon-sm': 'skeleton-icon-sm',
    'icon-lg': 'skeleton-icon-lg',
  };

  return (
    <div 
      className={cn(
        'skeleton-base',
        variantClasses[variant],
        width,
        !animate && 'animate-none',
        className
      )}
      aria-hidden="true"
      role="status"
      aria-label="Loading..."
    />
  );
};

export interface AdaptiveSkeletonGroupProps {
  count: number;
  variant: AdaptiveSkeletonProps['variant'];
  spacing?: string;
  width?: string;
  className?: string;
}

export const AdaptiveSkeletonGroup: FC<AdaptiveSkeletonGroupProps> = ({
  count,
  variant,
  spacing = 'space-y-4',
  width,
  className,
}) => {
  return (
    <div className={cn(spacing, className)}>
      {Array.from({ length: count }).map((_, index) => (
        <AdaptiveSkeleton 
          key={index} 
          variant={variant} 
          width={width}
        />
      ))}
    </div>
  );
};
