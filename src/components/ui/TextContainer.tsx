

import React from 'react';
import { cn } from '@/lib/utils';

export interface TextContainerProps {
  
  children: React.ReactNode;
  
  
  size?: 'default' | 'sm' | 'lg' | 'xl' | 'narrow' | 'wide';
  
  
  className?: string;
  
  
  as?: 'div' | 'section' | 'article' | 'aside';
}


export const TextContainer: React.FC<TextContainerProps> = ({
  children,
  size = 'default',
  className,
  as: Component = 'div',
}) => {

  const maxWidthClass = {
    'default': 'max-w-prose',
    'sm': 'max-w-prose-sm',
    'lg': 'max-w-prose-lg',
    'xl': 'max-w-prose-xl',
    'narrow': 'max-w-prose-narrow',
    'wide': 'max-w-prose-wide',
  }[size];

  return (
    <Component className={cn(maxWidthClass, 'mx-auto', className)}>
      {children}
    </Component>
  );
};




export const BodyTextContainer: React.FC<Omit<TextContainerProps, 'size'>> = (props) => (
  <TextContainer size="default" {...props} />
);


export const HeadingTextContainer: React.FC<Omit<TextContainerProps, 'size'>> = (props) => (
  <TextContainer size="lg" {...props} />
);


export const SmallTextContainer: React.FC<Omit<TextContainerProps, 'size'>> = (props) => (
  <TextContainer size="sm" {...props} />
);


export const NarrowTextContainer: React.FC<Omit<TextContainerProps, 'size'>> = (props) => (
  <TextContainer size="narrow" {...props} />
);

export default TextContainer;
