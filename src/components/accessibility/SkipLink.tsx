

'use client';

import React from 'react';
import { useSkipLink } from '@/hooks/useAccessibility';
import { cn } from '@/lib/utils';

export interface SkipLinkProps {
  
  targetId: string;

  
  children: React.ReactNode;

  
  className?: string;
}


export const SkipLink: React.FC<SkipLinkProps> = ({
  targetId,
  children,
  className,
}) => {
  const { handleSkip } = useSkipLink(targetId);

  return (
    <a
      href={`#${targetId}`}
      onClick={handleSkip}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleSkip(e);
        }
      }}
      className={cn(

        'sr-only',

        'focus:not-sr-only',
        'focus:fixed focus:top-4 focus:left-4 focus:z-[9999]',
        'focus:px-4 focus:py-2',
        'focus:bg-accent focus:text-black',
        'focus:rounded-md focus:shadow-lg',
        'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
        'transition-all duration-200',
        className
      )}
    >
      {children}
    </a>
  );
};

export default SkipLink;
