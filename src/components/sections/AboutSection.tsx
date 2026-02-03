"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import SpritePlayer from "@/components/ui/SpritePlayer";
import FlipGallery from "@/components/sections/FlipGallery";
import { MobileFlipGallery } from "@/components/ui/MobileFlipGallery";
import { useResponsive } from "@/contexts/ResponsiveContext";

const AboutSectionComponent = () => {
  const { isMobile } = useResponsive();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [animationSize, setAnimationSize] = useState({
    width: 500,
    height: 400,
  });
  const [spriteScale, setSpriteScale] = useState(1);

  useEffect(() => {
    setMounted(true);
  }, []);

  const titleTiltX = useMotionValue(0);
  const titleTiltY = useMotionValue(0);
  const titleScale = useMotionValue(1);
  const smoothTitleTiltX = useSpring(titleTiltX, {
    stiffness: 220,
    damping: 20,
  });
  const smoothTitleTiltY = useSpring(titleTiltY, {
    stiffness: 220,
    damping: 20,
  });
  const smoothTitleScale = useSpring(titleScale, {
    stiffness: 200,
    damping: 15,
  });

  useEffect(() => {
    const updateAnimationSize = () => {
      const viewportWidth = window.innerWidth;
      let width = Math.min(500, Math.max(200, viewportWidth * 0.3));
      let height = Math.min(400, Math.max(160, viewportWidth * 0.24));

      if (viewportWidth >= 1601 && viewportWidth <= 1920) {
        width *= 0.85;
        height *= 0.85;
        setSpriteScale(0.85);
      } else {
        setSpriteScale(1);
      }

      setAnimationSize({ width, height });
    };

    updateAnimationSize();
    window.addEventListener("resize", updateAnimationSize);
    return () => window.removeEventListener("resize", updateAnimationSize);
  }, []);

  useEffect(() => {
    if (!inView) return;

    let rafId: number | null = null;
    let lastMouseEvent: MouseEvent | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      lastMouseEvent = e;

      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        if (lastMouseEvent) {
          const nx = (lastMouseEvent.clientX / window.innerWidth - 0.5) * 2;
          const ny = (lastMouseEvent.clientY / window.innerHeight - 0.5) * 2;

          const ampTilt = 35;
          titleTiltX.set(ny * ampTilt);
          titleTiltY.set(-nx * ampTilt);

          const dist = Math.min(1, Math.sqrt(nx * nx + ny * ny));
          titleScale.set(1 + 0.12 * dist);
        }
        rafId = null;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [inView, titleTiltX, titleTiltY, titleScale]);

  useEffect(() => {
    if (inView || !sectionRef.current) return;
    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [inView]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative flex flex-col items-center justify-center w-full"
      style={{
        paddingTop: "clamp(80px, 12vw, 180px)",
        paddingBottom: "clamp(80px, 12vw, 180px)",
      }}
    >
      {}
      <div
        className="flex items-center justify-center w-full max-w-[1600px] mx-auto px-[clamp(16px,4vw,40px)]"
        style={{
          gap: "clamp(20px, 5vw, 100px)",
          marginBottom: "clamp(40px, 7.5vw, 80px)",
        }}
      >
        {}
        <div
          className={`align-middle transform transition-all duration-700 ease-out relative about-sprite-container ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{
            left: "var(--about-sprite-left, clamp(-600px, -62.5vw, -1200px))",
            top: "var(--about-sprite-top, clamp(-50px, -5.2vw, -100px))",
          }}
        >
          {inView && (
            <SpritePlayer
              metaUrl="/animation6/meta.json"
              width={animationSize.width}
              height={animationSize.height}
              holdFirstMs={0}
              holdLastMs={0}
              speedMultiplier={0.8}
              pingPong={false}
              maxCycles={Infinity}
              stopAtStart={false}
            />
          )}
        </div>

        {}
        <motion.h2
          className="font-bold text-accent font-furore uppercase leading-tight text-center relative about-title-heading"
          style={{
            fontSize: "var(--about-title-size, clamp(3rem, 15vw, 200px))",
            transformStyle: "preserve-3d",
            perspective: "800px",
            rotateX: smoothTitleTiltX,
            rotateY: smoothTitleTiltY,
            scale: smoothTitleScale,
            top: "var(--about-title-top, clamp(-100px, -10.4vw, -200px))",
            left: "var(--about-title-left, clamp(-750px, -78.1vw, -1500px))",
          }}
          initial={{ opacity: 0, x: "-120%", scale: 0.9, rotate: -45 }}
          animate={
            inView
              ? {
                  opacity: [0, 1, 1],
                  x: ["-120%", "2%", "0%"],
                  scale: [0.9, 1.06, 1.0],
                  rotate: [-45, 10, -5],
                }
              : {}
          }
          transition={{ duration: 1.1, ease: "easeOut", times: [0, 0.7, 1] }}
        >
          О нас
        </motion.h2>
      </div>

      {}
      <div
        className="w-full flex justify-center"
        style={{
          marginTop: "clamp(60px, 10vw, 140px)",
          minHeight: "min(280px, 50vw)",
        }}
      >
        {!mounted ? (
          <div
            className="w-full flex items-center justify-center min-h-[200px] text-muted-foreground text-sm uppercase"
            aria-hidden
          >
            Наши работы
          </div>
        ) : isMobile ? (
          <MobileFlipGallery key="mobile-gallery" />
        ) : (
          <FlipGallery key="desktop-gallery" />
        )}
      </div>
    </section>
  );
};

export const AboutSection = React.memo(AboutSectionComponent);
