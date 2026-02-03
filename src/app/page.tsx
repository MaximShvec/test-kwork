"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

import { AdaptiveHero } from "@/components/sections/AdaptiveHero";
import type { PortfolioItem } from "@/types";
import { animation2Frames } from "@/lib/animation2Frames";
import { preloadImages } from "@/lib/preloadImages";
import { SkipLink } from "@/components/accessibility/SkipLink";

// Lazy-loaded components for code splitting
import {
  LazyInteractivePriceGallery,
  LazyContactFormSection,
  LazyContactInfoSection,
  LazyAboutSection,
  LazyLogoCarousel,
  LazyItemDetailView,
  LazyRegionSelectionModal,
  LazySmoothFrameAnimation,
} from "@/components/lazy";

export default function Home() {
  const [hasShownPartners, setHasShownPartners] = useState(false);
  const [hasShownPartnersTitle, setHasShownPartnersTitle] = useState(false);
  const [hasShownPricingTitle, setHasShownPricingTitle] = useState(false);
  const partnersRef = useRef<HTMLDivElement>(null);
  const [itemForDetailView, setItemForDetailView] =
    useState<PortfolioItem | null>(null);
  const [showRegionModal, setShowRegionModal] = useState(false);

  // Motion values для эффекта наклона заголовка партнеров
  const partnersTitleTiltX = useMotionValue(0);
  const partnersTitleTiltY = useMotionValue(0);
  const partnersTitleScale = useMotionValue(1);
  const smoothPartnersTitleTiltX = useSpring(partnersTitleTiltX, {
    stiffness: 140,
    damping: 30,
  });
  const smoothPartnersTitleTiltY = useSpring(partnersTitleTiltY, {
    stiffness: 140,
    damping: 30,
  });
  const smoothPartnersTitleScale = useSpring(partnersTitleScale, {
    stiffness: 120,
    damping: 20,
  });

  // Motion values для эффекта наклона заголовка цен
  const pricingTitleTiltX = useMotionValue(0);
  const pricingTitleTiltY = useMotionValue(0);
  const pricingTitleScale = useMotionValue(1);
  const smoothPricingTitleTiltX = useSpring(pricingTitleTiltX, {
    stiffness: 140,
    damping: 30,
  });
  const smoothPricingTitleTiltY = useSpring(pricingTitleTiltY, {
    stiffness: 140,
    damping: 30,
  });
  const smoothPricingTitleScale = useSpring(pricingTitleScale, {
    stiffness: 120,
    damping: 20,
  });

  // Motion values для подписи про поставщиков
  const supplierX = useMotionValue(0);
  const supplierY = useMotionValue(0);
  const supplierTiltX = useMotionValue(0);
  const supplierTiltY = useMotionValue(0);
  const smoothSupplierX = useSpring(supplierX, { stiffness: 120, damping: 18 });
  const smoothSupplierY = useSpring(supplierY, { stiffness: 120, damping: 18 });
  const smoothSupplierTiltX = useSpring(supplierTiltX, {
    stiffness: 140,
    damping: 22,
  });
  const smoothSupplierTiltY = useSpring(supplierTiltY, {
    stiffness: 140,
    damping: 22,
  });

  // Анимация заголовка запускается, когда блок partners появляется в зоне видимости
  useEffect(() => {
    if (hasShownPartnersTitle) return;
    const ref = partnersRef.current;
    if (!ref) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasShownPartnersTitle(true);
            setTimeout(() => setHasShownPartners(true), 800);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(ref);
    return () => observer.disconnect();
  }, [hasShownPartnersTitle]);

  // Preload partner animation frames once on mount
  useEffect(() => {
    preloadImages(animation2Frames);
  }, []);

  // Обработчик движения мыши для эффекта наклона заголовка партнеров
  useEffect(() => {
    if (!hasShownPartnersTitle) return;

    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2; // -1..1
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;

      const ampTilt = 15; // амплитуда наклона
      partnersTitleTiltX.set(ny * ampTilt);
      partnersTitleTiltY.set(-nx * ampTilt);

      const dist = Math.min(1, Math.sqrt(nx * nx + ny * ny));
      partnersTitleScale.set(1 + 0.05 * dist);

      // обновляем подпись про поставщиков (мягче)
      const AMP_T = 14;
      const AMP_TILT = 8;
      supplierX.set(nx * AMP_T);
      supplierY.set(ny * AMP_T);
      supplierTiltX.set(ny * AMP_TILT);
      supplierTiltY.set(-nx * AMP_TILT);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [
    hasShownPartnersTitle,
    partnersTitleTiltX,
    partnersTitleTiltY,
    partnersTitleScale,
  ]);

  // Обработчик движения мыши для эффекта наклона заголовка цен
  useEffect(() => {
    if (!hasShownPricingTitle) return;

    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2; // -1..1
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;

      const ampTilt = 12; // амплитуда наклона для заголовка цен
      pricingTitleTiltX.set(ny * ampTilt);
      pricingTitleTiltY.set(-nx * ampTilt);

      const dist = Math.min(1, Math.sqrt(nx * nx + ny * ny));
      pricingTitleScale.set(1 + 0.03 * dist);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [
    hasShownPricingTitle,
    pricingTitleTiltX,
    pricingTitleTiltY,
    pricingTitleScale,
  ]);

  useEffect(() => {
    const handler = () => {
      setTimeout(() => {
        // Временно отключено: модалка выбора региона при загрузке
        // const regionManuallySelected = typeof window !== 'undefined' ?
        //   localStorage.getItem('regionManuallySelected') === 'true' : false;
        // const regionSelectedOnLoading = typeof window !== 'undefined' ?
        //   localStorage.getItem('regionSelectedOnLoading') === 'true' : false;
        // if (!regionManuallySelected && !regionSelectedOnLoading) {
        //   setShowRegionModal(true);
        // }
      }, 3000);
    };
    window.addEventListener("headerAnimated", handler);
    return () => window.removeEventListener("headerAnimated", handler);
  }, []);

  return (
    <>
      <SkipLink targetId="main-content">
        Перейти к основному содержимому
      </SkipLink>
      <div className="flex flex-col min-h-screen relative">
        {/* Hero section is above the fold - render immediately without lazy loading */}
        <AdaptiveHero />
        <main id="main-content" role="main">
          {/* ОТЛАДКА: открываем блоки главной по одному. Сейчас: Hero + About. Следующий блок — галерея цен. */}
          <LazyAboutSection />
          {true && (
            <>
              {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
              {/* @ts-ignore - Gallery currently doesn't accept extra props, will refactor later */}
              <LazyInteractivePriceGallery
                sectionId="pricing-gallery"
                pricingTitleTiltX={smoothPricingTitleTiltX}
                pricingTitleTiltY={smoothPricingTitleTiltY}
                pricingTitleScale={smoothPricingTitleScale}
                onPricingTitleVisible={setHasShownPricingTitle}
              />

              {itemForDetailView && (
                <LazyItemDetailView
                  item={itemForDetailView}
                  onClose={() => setItemForDetailView(null)}
                />
              )}

              {/* Партнёрский блок: оборачиваем заголовок и карусель в контейнер с ID "partners" */}
              <div
                id="partners"
                ref={partnersRef}
                className="-mt-32 md:-mt-96 lg:-mt-[450px]"
              >
                <div className="section-title-wrapper py-6 md:py-12 px-4">
                  <motion.h2
                    className="section-title text-adaptive-section leading-none mb-6 md:mb-12 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 min-[1920px]:mt-5"
                    style={{
                      color: "#ffc700",
                      transformStyle: "preserve-3d",
                      perspective: "800px",
                      rotateX: smoothPartnersTitleTiltX,
                      rotateY: smoothPartnersTitleTiltY,
                      scale: smoothPartnersTitleScale,
                    }}
                    initial="hidden"
                    animate={hasShownPartnersTitle ? "visible" : "hidden"}
                    variants={{
                      hidden: {
                        opacity: 0,
                        y: 120,
                        scale: 0.7,
                        rotate: -8,
                        filter: "blur(12px)",
                      },
                      visible: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        rotate: 0,
                        filter: "blur(0px)",
                        transition: {
                          type: "spring",
                          stiffness: 60,
                          damping: 18,
                          delay: 0.1,
                        },
                      },
                    }}
                  >
                    <motion.div
                      initial="hidden"
                      animate={hasShownPartnersTitle ? "visible" : "hidden"}
                      variants={{
                        hidden: {
                          opacity: 0,
                          x: -120,
                          scale: 0.6,
                          rotate: -12,
                          filter: "blur(8px)",
                        },
                        visible: {
                          opacity: 1,
                          x: 0,
                          scale: 1,
                          rotate: 0,
                          filter: "blur(0px)",
                          transition: {
                            type: "spring",
                            stiffness: 80,
                            damping: 16,
                            delay: 0.25,
                          },
                        },
                      }}
                      className="align-middle mb-4 md:mb-0 md:mr-6 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-56 lg:h-56 xl:w-64 xl:h-64 min-[1920px]:w-[300px] min-[1920px]:h-[300px] 2xl:w-[400px] 2xl:h-[400px]"
                    >
                      <LazySmoothFrameAnimation
                        images={animation2Frames}
                        baseFps={60}
                        speedRanges={[
                          { startIndex: 7, endIndex: 76, multiplier: 2.8 },
                        ]}
                        // Repeat frames IMG_6519..IMG_6523 (indices 84..88) three times total
                        loopSegments={[
                          { startIndex: 84, endIndex: 88, times: 3 },
                        ]}
                        width="100%"
                        height="100%"
                      />
                    </motion.div>
                    <motion.span
                      className="text-center leading-none text-[#ffc700] min-[1920px]:mt-5"
                      initial="hidden"
                      animate={hasShownPartnersTitle ? "visible" : "hidden"}
                      variants={{
                        hidden: {},
                        visible: {
                          transition: {
                            staggerChildren: 0.08,
                            delayChildren: 0.35,
                          },
                        },
                      }}
                    >
                      {["Н", "а", "ш", "и"].map((l, i) => (
                        <motion.span
                          key={l + i}
                          style={{ display: "inline-block", color: "#ffc700" }}
                          initial={{
                            opacity: 0,
                            y: 60,
                            scale: 0.7,
                            rotate: -10,
                          }}
                          animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 90,
                            damping: 14,
                          }}
                        >
                          {l}
                        </motion.span>
                      ))}
                      <br />
                      {["П", "а", "р", "т", "н", "ё", "р", "ы"].map((l, i) => (
                        <motion.span
                          key={l + i + 10}
                          style={{ display: "inline-block", color: "#ffc700" }}
                          initial={{
                            opacity: 0,
                            y: 80,
                            scale: 0.7,
                            rotate: 10,
                          }}
                          animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 90,
                            damping: 14,
                          }}
                        >
                          {l}
                        </motion.span>
                      ))}
                    </motion.span>
                  </motion.h2>
                </div>
                {/* Передаём другой id, чтобы избежать дубликатов */}
                <LazyLogoCarousel
                  sectionId="partners-carousel"
                  active={hasShownPartners}
                />

                {/* Supplier description below carousel */}
                <motion.div
                  className="supplier-note text-center font-furore text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl px-4 mt-12 md:mt-24 mx-auto max-w-[900px]"
                  style={{
                    color: "#888888",
                    transformStyle: "preserve-3d",
                    x: smoothSupplierX,
                    y: smoothSupplierY,
                    rotateX: smoothSupplierTiltX,
                    rotateY: smoothSupplierTiltY,
                  }}
                  initial={{ opacity: 0, y: 60, filter: "blur(8px)" }}
                  animate={
                    hasShownPartners
                      ? { opacity: 1, y: 0, filter: "blur(0px)" }
                      : { opacity: 0, y: 60 }
                  }
                  transition={{
                    type: "spring",
                    stiffness: 70,
                    damping: 18,
                    delay: 0.6,
                  }}
                >
                  Наши поставщики — люди, которые знают, как выглядит идеальная
                  полка. И даже если вы не знаете, они всё равно привезут
                  лучшее!
                </motion.div>
              </div>
              <div className="contacts-form-columns container mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-stretch px-4">
                <div className="flex justify-center items-center mb-8 md:mb-32 lg:mb-[200px]">
                  <LazyContactInfoSection sectionId="contacts" />
                </div>
                <div className="flex justify-center items-center mt-8 md:mt-64 lg:mt-[500px]">
                  <LazyContactFormSection sectionId="order-form" />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
      <LazyRegionSelectionModal
        isOpen={showRegionModal}
        onClose={() => setShowRegionModal(false)}
      />
    </>
  );
}
