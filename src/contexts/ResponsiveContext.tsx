"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getDeviceType,
  getBreakpoint,
  type Breakpoint,
  type DeviceType,
} from "@/lib/constants/breakpoints";
import { useDebounce } from "@/hooks/useDebounce";

interface ResponsiveContextType {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  deviceType: DeviceType;
  screenWidth: number;
  screenHeight: number;
  breakpoint: Breakpoint;
  orientation: "portrait" | "landscape";
  hasTouch: boolean;
  prefersReducedMotion: boolean;
  connectionSpeed: "slow" | "medium" | "fast";
}

const ResponsiveContext = createContext<ResponsiveContextType | undefined>(
  undefined
);

const detectTouch = (): boolean => {
  if (typeof window === "undefined") return false;
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
};

const detectReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const detectConnectionSpeed = (): "slow" | "medium" | "fast" => {
  if (typeof window === "undefined") return "medium";

  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;

  if (!connection) return "medium";

  const effectiveType = connection.effectiveType;

  if (effectiveType === "slow-2g" || effectiveType === "2g") return "slow";
  if (effectiveType === "3g") return "medium";
  return "fast"; // 4g or better
};

export const ResponsiveProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Начальные значения mobile-first: до гидратации считаем мобильным, чтобы MobileHero показывался на телефонах
  const [screenWidth, setScreenWidth] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);
  const [hasTouch, setHasTouch] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [connectionSpeed, setConnectionSpeed] = useState<
    "slow" | "medium" | "fast"
  >("medium");
  const [isHydrated, setIsHydrated] = useState(false);

  const updateDimensions = () => {
    setScreenWidth(window.innerWidth);
    setScreenHeight(window.innerHeight);
  };

  const debouncedUpdateDimensions = useDebounce(updateDimensions, 150);

  useEffect(() => {
    const updateFeatures = () => {
      setHasTouch(detectTouch());
      setPrefersReducedMotion(detectReducedMotion());
      setConnectionSpeed(detectConnectionSpeed());
    };

    updateDimensions();
    updateFeatures();
    setIsHydrated(true);

    window.addEventListener("resize", debouncedUpdateDimensions, {
      passive: true,
    });

    const handleOrientationChange = () => {
      setTimeout(updateDimensions, 100);
    };
    window.addEventListener("orientationchange", handleOrientationChange);

    const motionMediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    motionMediaQuery.addEventListener("change", handleMotionChange);

    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;
    if (connection) {
      const handleConnectionChange = () => {
        setConnectionSpeed(detectConnectionSpeed());
      };
      connection.addEventListener("change", handleConnectionChange);

      return () => {
        window.removeEventListener("resize", debouncedUpdateDimensions);
        window.removeEventListener(
          "orientationchange",
          handleOrientationChange
        );
        motionMediaQuery.removeEventListener("change", handleMotionChange);
        connection.removeEventListener("change", handleConnectionChange);
      };
    }

    return () => {
      window.removeEventListener("resize", debouncedUpdateDimensions);
      window.removeEventListener("orientationchange", handleOrientationChange);
      motionMediaQuery.removeEventListener("change", handleMotionChange);
    };
  }, [debouncedUpdateDimensions]);

  const deviceType = getDeviceType(screenWidth);
  const isMobile = deviceType === "mobile";
  const isTablet = deviceType === "tablet";
  const isDesktop = deviceType === "desktop";
  const breakpoint = getBreakpoint(screenWidth);
  const orientation = screenHeight > screenWidth ? "portrait" : "landscape";

  const value: ResponsiveContextType = {
    isMobile,
    isTablet,
    isDesktop,
    deviceType,
    screenWidth,
    screenHeight,
    breakpoint,
    orientation,
    hasTouch,
    prefersReducedMotion,
    connectionSpeed,
  };

  return (
    <ResponsiveContext.Provider value={value}>
      {children}
    </ResponsiveContext.Provider>
  );
};

export const useResponsive = (): ResponsiveContextType => {
  const context = useContext(ResponsiveContext);
  if (context === undefined) {
    throw new Error("useResponsive must be used within a ResponsiveProvider");
  }
  return context;
};

export const useIsMobile = (): boolean => {
  const { isMobile } = useResponsive();
  return isMobile;
};
