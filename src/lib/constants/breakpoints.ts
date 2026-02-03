


export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;


export const DESKTOP_BREAKPOINTS = {
  'desktop-sm': 1366,  // Most popular laptop resolution
  'desktop-md': 1920,  // Standard Full HD desktop
  'desktop-lg': 2560,  // 2K monitors
  'desktop-xl': 3840,  // 4K monitors
} as const;


export const ALL_BREAKPOINTS = {
  ...BREAKPOINTS,
  ...DESKTOP_BREAKPOINTS,
} as const;


export const DEVICE_BREAKPOINTS = {
  mobile: 768,  // Below this is mobile
  tablet: 1024, // Between mobile and this is tablet
} as const;


export const DESKTOP_CATEGORIES = {
  'small-desktop': { min: 1366, max: 1599, label: 'Small Desktop' },
  'medium-desktop': { min: 1600, max: 2199, label: 'Medium Desktop' },
  'large-desktop': { min: 2200, max: 2999, label: 'Large Desktop' },
  'ultra-desktop': { min: 3000, max: Infinity, label: 'Ultra Desktop' },
} as const;


export const TOUCH_TARGET_SIZES = {
  mobile: 44,  // Minimum 44x44px on mobile (iOS/Android guidelines)
  tablet: 40,  // Minimum 40x40px on tablet
  desktop: 32, // Minimum 32x32px on desktop
} as const;


export type Breakpoint = keyof typeof BREAKPOINTS;
export type DesktopBreakpoint = keyof typeof DESKTOP_BREAKPOINTS;
export type AllBreakpoint = keyof typeof ALL_BREAKPOINTS;
export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type DesktopCategory = keyof typeof DESKTOP_CATEGORIES;


export const getDeviceType = (width: number): DeviceType => {
  if (width < DEVICE_BREAKPOINTS.mobile) return 'mobile';
  if (width < DEVICE_BREAKPOINTS.tablet) return 'tablet';
  return 'desktop';
};


export const getDesktopCategory = (width: number): DesktopCategory => {
  for (const [category, range] of Object.entries(DESKTOP_CATEGORIES)) {
    if (width >= range.min && width <= range.max) {
      return category as DesktopCategory;
    }
  }
  return 'medium-desktop'; // Default fallback
};


export const getBreakpoint = (width: number): Breakpoint => {
  if (width < BREAKPOINTS.sm) return 'xs';
  if (width < BREAKPOINTS.md) return 'sm';
  if (width < BREAKPOINTS.lg) return 'md';
  if (width < BREAKPOINTS.xl) return 'lg';
  if (width < BREAKPOINTS['2xl']) return 'xl';
  return '2xl';
};


export const getDesktopBreakpoint = (width: number): DesktopBreakpoint | null => {
  if (width >= DESKTOP_BREAKPOINTS['desktop-xl']) return 'desktop-xl';
  if (width >= DESKTOP_BREAKPOINTS['desktop-lg']) return 'desktop-lg';
  if (width >= DESKTOP_BREAKPOINTS['desktop-md']) return 'desktop-md';
  if (width >= DESKTOP_BREAKPOINTS['desktop-sm']) return 'desktop-sm';
  return null; // Not a desktop resolution
};


export const matchesBreakpoint = (width: number, breakpoint: Breakpoint): boolean => {
  const breakpointValue = BREAKPOINTS[breakpoint];
  const breakpointKeys = Object.keys(BREAKPOINTS) as Breakpoint[];
  const currentIndex = breakpointKeys.indexOf(breakpoint);
  
  if (currentIndex === breakpointKeys.length - 1) {

    return width >= breakpointValue;
  }
  
  const nextBreakpoint = breakpointKeys[currentIndex + 1];
  const nextBreakpointValue = BREAKPOINTS[nextBreakpoint];
  
  return width >= breakpointValue && width < nextBreakpointValue;
};


export const isDesktopWidth = (width: number): boolean => {
  return width >= DESKTOP_BREAKPOINTS['desktop-sm'];
};
