"use client";

import React, { useRef, useEffect, useState } from "react";
import { useResponsive } from "@/contexts/ResponsiveContext";

interface ScaleWrapperProps {
  children: React.ReactNode;
  className?: string;
  baseWidth?: number;
  baseHeight?: number;
  minScale?: number;
  maxScale?: number;
  maintainAspectRatio?: boolean;
  style?: React.CSSProperties;
}

const ScaleWrapper: React.FC<ScaleWrapperProps> = ({
  children,
  className = "",
  baseWidth = 800,
  baseHeight = 400,
  minScale = 0.3,
  maxScale = 2,
  maintainAspectRatio = true,
  style = {},
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const { screenWidth, screenHeight, isMobile } = useResponsive();

  useEffect(() => {
    const updateScale = () => {
      if (!wrapperRef.current) return;

      const container = wrapperRef.current.parentElement;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;

      let scaleX = containerWidth / baseWidth;
      let scaleY = containerHeight / baseHeight;

      let newScale: number;

      if (maintainAspectRatio) {
        newScale = Math.min(scaleX, scaleY);
      } else {
        newScale = (scaleX + scaleY) / 2;
      }

      newScale = Math.max(minScale, Math.min(maxScale, newScale));

      setScale(newScale);
    };

    updateScale();

    const resizeObserver = new ResizeObserver(updateScale);
    if (wrapperRef.current?.parentElement) {
      resizeObserver.observe(wrapperRef.current.parentElement);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [
    baseWidth,
    baseHeight,
    minScale,
    maxScale,
    maintainAspectRatio,
    screenWidth,
    screenHeight,
  ]);

  return (
    <div
      ref={wrapperRef}
      className={`scale-wrapper ${className}`}
      style={{
        ...(isMobile
          ? {
              width: "100%",
              height: "auto",
              minHeight: "min-content",
              overflow: "visible",
              display: "block",
            }
          : {
              transform: `scale(${scale})`,
              transformOrigin: "center center",
              transition: "transform 0.3s ease-out",
              width: baseWidth,
              height: baseHeight,
            }),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default ScaleWrapper;
