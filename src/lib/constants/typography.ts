

import { BREAKPOINTS } from './breakpoints';


export const BASE_FONT_SIZES = {
  mobile: 16,    // 16px base on mobile
  tablet: 16,    // 16px base on tablet
  desktop: 16,   // 16px base on desktop
} as const;


export const FONT_SCALE = {

  'display-2xl': {
    min: '3rem',      // 48px on mobile
    preferred: '4vw + 1rem',
    max: '6rem',      // 96px on desktop
    clamp: 'clamp(3rem, 4vw + 1rem, 6rem)',
  },
  'display-xl': {
    min: '2.5rem',    // 40px on mobile
    preferred: '3.5vw + 0.75rem',
    max: '5rem',      // 80px on desktop
    clamp: 'clamp(2.5rem, 3.5vw + 0.75rem, 5rem)',
  },
  'display-lg': {
    min: '2rem',      // 32px on mobile
    preferred: '3vw + 0.5rem',
    max: '4rem',      // 64px on desktop
    clamp: 'clamp(2rem, 3vw + 0.5rem, 4rem)',
  },

  'h1': {
    min: '1.875rem',  // 30px on mobile
    preferred: '2.5vw + 0.5rem',
    max: '3.5rem',    // 56px on desktop
    clamp: 'clamp(1.875rem, 2.5vw + 0.5rem, 3.5rem)',
  },
  'h2': {
    min: '1.5rem',    // 24px on mobile
    preferred: '2vw + 0.5rem',
    max: '2.75rem',   // 44px on desktop
    clamp: 'clamp(1.5rem, 2vw + 0.5rem, 2.75rem)',
  },
  'h3': {
    min: '1.25rem',   // 20px on mobile
    preferred: '1.5vw + 0.5rem',
    max: '2.25rem',   // 36px on desktop
    clamp: 'clamp(1.25rem, 1.5vw + 0.5rem, 2.25rem)',
  },
  'h4': {
    min: '1.125rem',  // 18px on mobile
    preferred: '1.25vw + 0.375rem',
    max: '1.875rem',  // 30px on desktop
    clamp: 'clamp(1.125rem, 1.25vw + 0.375rem, 1.875rem)',
  },
  'h5': {
    min: '1rem',      // 16px on mobile
    preferred: '1vw + 0.25rem',
    max: '1.5rem',    // 24px on desktop
    clamp: 'clamp(1rem, 1vw + 0.25rem, 1.5rem)',
  },
  'h6': {
    min: '0.875rem',  // 14px on mobile
    preferred: '0.75vw + 0.25rem',
    max: '1.25rem',   // 20px on desktop
    clamp: 'clamp(0.875rem, 0.75vw + 0.25rem, 1.25rem)',
  },

  'body-xl': {
    min: '1.125rem',  // 18px on mobile
    preferred: '1vw + 0.25rem',
    max: '1.5rem',    // 24px on desktop
    clamp: 'clamp(1.125rem, 1vw + 0.25rem, 1.5rem)',
  },
  'body-lg': {
    min: '1rem',      // 16px on mobile
    preferred: '0.75vw + 0.25rem',
    max: '1.25rem',   // 20px on desktop
    clamp: 'clamp(1rem, 0.75vw + 0.25rem, 1.25rem)',
  },
  'body': {
    min: '0.875rem',  // 14px on mobile
    preferred: '0.5vw + 0.25rem',
    max: '1.125rem',  // 18px on desktop
    clamp: 'clamp(0.875rem, 0.5vw + 0.25rem, 1.125rem)',
  },
  'body-sm': {
    min: '0.8125rem', // 13px on mobile
    preferred: '0.5vw + 0.125rem',
    max: '1rem',      // 16px on desktop
    clamp: 'clamp(0.8125rem, 0.5vw + 0.125rem, 1rem)',
  },
  'body-xs': {
    min: '0.75rem',   // 12px on mobile
    preferred: '0.25vw + 0.125rem',
    max: '0.875rem',  // 14px on desktop
    clamp: 'clamp(0.75rem, 0.25vw + 0.125rem, 0.875rem)',
  },

  'button-lg': {
    min: '1rem',      // 16px on mobile
    preferred: '0.75vw + 0.25rem',
    max: '1.25rem',   // 20px on desktop
    clamp: 'clamp(1rem, 0.75vw + 0.25rem, 1.25rem)',
  },
  'button': {
    min: '0.875rem',  // 14px on mobile
    preferred: '0.5vw + 0.25rem',
    max: '1.125rem',  // 18px on desktop
    clamp: 'clamp(0.875rem, 0.5vw + 0.25rem, 1.125rem)',
  },
  'button-sm': {
    min: '0.8125rem', // 13px on mobile
    preferred: '0.5vw + 0.125rem',
    max: '1rem',      // 16px on desktop
    clamp: 'clamp(0.8125rem, 0.5vw + 0.125rem, 1rem)',
  },

  'caption': {
    min: '0.75rem',   // 12px on mobile
    preferred: '0.25vw + 0.125rem',
    max: '0.875rem',  // 14px on desktop
    clamp: 'clamp(0.75rem, 0.25vw + 0.125rem, 0.875rem)',
  },
  'label': {
    min: '0.8125rem', // 13px on mobile
    preferred: '0.5vw + 0.125rem',
    max: '1rem',      // 16px on desktop
    clamp: 'clamp(0.8125rem, 0.5vw + 0.125rem, 1rem)',
  },
} as const;


export const LINE_HEIGHTS = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
} as const;


export const LETTER_SPACING = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const;


export const FONT_WEIGHTS = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
} as const;


export const getFontSize = (size: keyof typeof FONT_SCALE): string => {
  return FONT_SCALE[size].clamp;
};


export const createFluidSize = (
  minRem: number,
  maxRem: number,
  minVw: number = 320,
  maxVw: number = 1920
): string => {

  const slope = (maxRem - minRem) / (maxVw - minVw);
  const intercept = minRem - slope * minVw;

  const vwValue = slope * 100;
  const remValue = intercept;
  
  return `clamp(${minRem}rem, ${vwValue.toFixed(2)}vw + ${remValue.toFixed(3)}rem, ${maxRem}rem)`;
};


export type FontSize = keyof typeof FONT_SCALE;
export type LineHeight = keyof typeof LINE_HEIGHTS;
export type LetterSpacing = keyof typeof LETTER_SPACING;
export type FontWeight = keyof typeof FONT_WEIGHTS;


export const RESPONSIVE_TYPOGRAPHY = {
  mobile: {
    baseFontSize: BASE_FONT_SIZES.mobile,
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACING.normal,
  },
  tablet: {
    baseFontSize: BASE_FONT_SIZES.tablet,
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACING.normal,
  },
  desktop: {
    baseFontSize: BASE_FONT_SIZES.desktop,
    lineHeight: LINE_HEIGHTS.relaxed,
    letterSpacing: LETTER_SPACING.normal,
  },
} as const;


export const OPTIMAL_LINE_LENGTH = {
  min: 60,
  ideal: 70,
  max: 80,
} as const;


export const LINE_LENGTH_CONSTRAINTS = {

  prose: '70ch',        // ~70 characters per line (ideal for body text)

  'prose-sm': '75ch',   // ~75 characters for smaller text

  'prose-lg': '60ch',   // ~60 characters for larger text

  'prose-xl': '50ch',   // ~50 characters for very large text

  'prose-narrow': '45ch', // ~45 characters for narrow layouts

  'prose-wide': '85ch',  // ~85 characters (maximum for readability)
} as const;


export const getOptimalLineWidth = (fontSize: number = 1, charsPerLine: number = 70): string => {
  return `${charsPerLine}ch`;
};


export const getLineConstraintForSize = (textSize: FontSize): string => {

  if (textSize.startsWith('display') || textSize === 'h1' || textSize === 'h2') {
    return LINE_LENGTH_CONSTRAINTS['prose-lg'];
  }

  if (textSize === 'h3' || textSize === 'h4') {
    return LINE_LENGTH_CONSTRAINTS['prose'];
  }

  if (textSize.startsWith('body')) {
    if (textSize === 'body-xl' || textSize === 'body-lg') {
      return LINE_LENGTH_CONSTRAINTS['prose'];
    }
    if (textSize === 'body-sm' || textSize === 'body-xs') {
      return LINE_LENGTH_CONSTRAINTS['prose-sm'];
    }
    return LINE_LENGTH_CONSTRAINTS['prose'];
  }

  return LINE_LENGTH_CONSTRAINTS['prose'];
};
