import type { Config } from "tailwindcss";
import {
  BREAKPOINTS,
  DESKTOP_BREAKPOINTS,
} from "./src/lib/constants/breakpoints";
import {
  FONT_SCALE,
  LINE_HEIGHTS,
  LETTER_SPACING,
  FONT_WEIGHTS,
  LINE_LENGTH_CONSTRAINTS,
} from "./src/lib/constants/typography";

/**
 * Tailwind CSS Configuration
 *
 * This configuration uses the unified breakpoint system from src/lib/constants/breakpoints.ts
 * and the responsive typography system from src/lib/constants/typography.ts
 * to ensure consistency across the entire application.
 *
 * Breakpoint values:
 * - sm: 640px
 * - md: 768px (mobile/tablet boundary)
 * - lg: 1024px (tablet/desktop boundary)
 * - xl: 1280px
 * - 2xl: 1536px
 *
 * Typography uses fluid scaling with clamp() for smooth responsive behavior.
 *
 * These values are shared with ResponsiveContext and all responsive utilities.
 * DO NOT modify breakpoints or typography here - update the constants files instead.
 */
export default {
  darkMode: ["class"],
  content: [
    // Removed "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // Override default breakpoints with our unified system
    // These values are imported from src/lib/constants/breakpoints.ts
    screens: {
      sm: `${BREAKPOINTS.sm}px`,
      md: `${BREAKPOINTS.md}px`,
      lg: `${BREAKPOINTS.lg}px`,
      xl: `${BREAKPOINTS.xl}px`,
      "2xl": `${BREAKPOINTS["2xl"]}px`,
      // Desktop-specific breakpoints for precise adaptation
      "desktop-sm": `${DESKTOP_BREAKPOINTS["desktop-sm"]}px`,
      "desktop-md": `${DESKTOP_BREAKPOINTS["desktop-md"]}px`,
      "desktop-lg": `${DESKTOP_BREAKPOINTS["desktop-lg"]}px`,
      "desktop-xl": `${DESKTOP_BREAKPOINTS["desktop-xl"]}px`,
    },
    extend: {
      fontFamily: {
        // sans: ["var(--font-geist-sans)"], // Removed Geist Sans
        // mono: ["var(--font-geist-mono)"], // Removed Geist Mono
        furore: ["var(--font-furore)"], // Add Furore font from CSS variable
      },
      /**
       * Responsive Font Sizes using clamp()
       *
       * These font sizes scale fluidly between mobile and desktop breakpoints.
       * Usage: text-h1, text-body-lg, text-display-xl, etc.
       *
       * Categories:
       * - display-*: Large display text (hero sections)
       * - h1-h6: Heading sizes
       * - body-*: Body text sizes
       * - button-*: Button text sizes
       * - caption, label: Small text sizes
       */
      fontSize: {
        // Display sizes
        "display-2xl": FONT_SCALE["display-2xl"].clamp,
        "display-xl": FONT_SCALE["display-xl"].clamp,
        "display-lg": FONT_SCALE["display-lg"].clamp,

        // Heading sizes
        h1: FONT_SCALE.h1.clamp,
        h2: FONT_SCALE.h2.clamp,
        h3: FONT_SCALE.h3.clamp,
        h4: FONT_SCALE.h4.clamp,
        h5: FONT_SCALE.h5.clamp,
        h6: FONT_SCALE.h6.clamp,

        // Body text sizes
        "body-xl": FONT_SCALE["body-xl"].clamp,
        "body-lg": FONT_SCALE["body-lg"].clamp,
        body: FONT_SCALE.body.clamp,
        "body-sm": FONT_SCALE["body-sm"].clamp,
        "body-xs": FONT_SCALE["body-xs"].clamp,

        // Button sizes
        "button-lg": FONT_SCALE["button-lg"].clamp,
        button: FONT_SCALE.button.clamp,
        "button-sm": FONT_SCALE["button-sm"].clamp,

        // Small text
        caption: FONT_SCALE.caption.clamp,
        label: FONT_SCALE.label.clamp,

        // Adaptive sizes using CSS variables from theme.css
        "adaptive-hero-xl": "var(--font-hero-primary)",
        "adaptive-hero-lg": "var(--font-hero-secondary)",
        "adaptive-section": "var(--font-section-title)",
        "adaptive-section-subtitle": "var(--font-section-subtitle)",
        "adaptive-card": "var(--font-card-title)",
        "adaptive-card-price": "var(--font-card-price)",
        "adaptive-ui-large": "var(--font-ui-large)",
        "adaptive-ui-medium": "var(--font-ui-medium)",
        "adaptive-ui-small": "var(--font-ui-small)",
      },
      /**
       * Line Heights
       *
       * Unitless multipliers for optimal readability
       * Usage: leading-tight, leading-normal, leading-relaxed, etc.
       */
      lineHeight: {
        ...LINE_HEIGHTS,
      },
      /**
       * Letter Spacing
       *
       * Values in em units for proportional spacing
       * Usage: tracking-tight, tracking-normal, tracking-wide, etc.
       */
      letterSpacing: {
        ...LETTER_SPACING,
      },
      /**
       * Font Weights
       *
       * Standard weight scale from thin to black
       * Usage: font-light, font-medium, font-bold, etc.
       */
      fontWeight: {
        ...FONT_WEIGHTS,
      },
      /**
       * Max Width for Optimal Line Lengths
       *
       * These values ensure text remains readable by limiting line length
       * to 60-80 characters, which is optimal for readability.
       *
       * Usage: max-w-prose, max-w-prose-sm, max-w-prose-lg, etc.
       *
       * Guidelines:
       * - max-w-prose: Default for body text (~70 characters)
       * - max-w-prose-lg: For larger text like headings (~60 characters)
       * - max-w-prose-sm: For smaller text (~75 characters)
       * - max-w-prose-narrow: For narrow columns (~45 characters)
       * - max-w-prose-wide: Maximum for readability (~85 characters)
       */
      maxWidth: {
        prose: LINE_LENGTH_CONSTRAINTS.prose,
        "prose-sm": LINE_LENGTH_CONSTRAINTS["prose-sm"],
        "prose-lg": LINE_LENGTH_CONSTRAINTS["prose-lg"],
        "prose-xl": LINE_LENGTH_CONSTRAINTS["prose-xl"],
        "prose-narrow": LINE_LENGTH_CONSTRAINTS["prose-narrow"],
        "prose-wide": LINE_LENGTH_CONSTRAINTS["prose-wide"],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        // Keyframes are defined in globals.css
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        // Animations are defined in globals.css
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 3s ease-in-out infinite", // Keep basic animations if needed elsewhere
        // Map CSS animation names to Tailwind utilities
        "hero-content-appear": "hero-content-appear 1.2s ease-out forwards",
        "contact-content-appear":
          "contact-content-appear 1s ease-out forwards 0.5s",
        "form-elements-appear": "form-elements-appear 0.6s ease-out forwards", // Might be redundant if using slide animations
        "wave-animation": "wave-animation 3s ease-in-out infinite",
        bounce: "bounce 2s infinite",
        videoAppear: "videoAppear 1.5s ease-out forwards",
        contentZoomIn: "contentZoomIn 1s ease-out forwards 0.5s",
        titleAppear: "titleAppear 1s ease-out forwards 0.7s",
        subtitleAppear: "subtitleAppear 1s ease-out forwards 0.9s",
        scrollAppear: "scrollAppear 1s ease-out forwards 1.1s",
        logoAppear: "logoAppear 1s ease-out forwards 0.2s",
        "phone-shake": "syncShake 4s linear infinite",
        "bounce-header": "bounce-header 0.6s cubic-bezier(0.6,0.05,0.4,1)",
        privacyModalSlideUp: "privacyModalSlideUp 0.5s ease-out forwards",
        privacyModalSlideDown: "privacyModalSlideDown 0.5s ease-in forwards",
        arrowBlink: "arrowBlink 1.1s infinite alternate",
        slideFromLeft: "slideFromLeft 0.8s ease forwards",
        slideFromRight: "slideFromRight 0.8s ease forwards",
        slideFromBottom: "slideFromBottom 0.8s ease forwards 0.4s",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
