"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { AdaptiveHeader } from "@/components/layout/AdaptiveHeader";
import { Footer } from "@/components/layout/Footer";

import { Toaster } from "@/components/ui/toaster";
import { FloatingIcons } from "@/components/animations/FloatingIcons";
import CustomCursor from "@/components/ui/custom-cursor";
import ScrollToTop from "@/components/utils/ScrollToTop";
import LoadingBar from "@/components/ui/LoadingBar";
import { MobileLoadingBar } from "@/components/ui/MobileLoadingBar";
import { AnimationProvider, useAnimation } from "@/contexts/AnimationContext";
import { useResponsive } from "@/contexts/ResponsiveContext";

declare global {
  interface Window {
    __aboutSectionShowBook?: boolean;
  }
}

const ArrowButton = ({ direction }: { direction: "prev" | "next" }) => {
  const handleClick = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection && aboutSection.offsetParent !== null) {
      if (direction === "prev" && window.__aboutSectionHandleCoverClick) {
        window.__aboutSectionHandleCoverClick();
        return;
      }
      if (direction === "next" && window.__aboutSectionHandleCloseBook) {
        window.__aboutSectionHandleCloseBook();
        return;
      }
    }
    alert(direction === "prev" ? "prev" : "next");
  };
  return (
    <button
      onClick={handleClick}
      className={
        `fixed top-1/2 -translate-y-1/2 z-[9999] w-[60px] h-[60px] md:w-[80px] md:h-[80px] before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:w-[36px] md:before:w-[48px] before:h-[36px] md:before:h-[48px] before:border-l-[5px] before:border-b-[5px] before:border-yellow-500 before:transform before:-translate-x-1/2 before:-translate-y-1/2 ` +
        (direction === "prev"
          ? "before:rotate-45 left-0 md:left-2"
          : "before:-rotate-[135deg] right-0 md:right-2") +
        " hover:before:border-yellow-400 focus:outline-none transition-transform duration-150 hover:scale-125"
      }
      style={{ filter: "drop-shadow(0 0 8px #ffc700)" }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.filter =
          "brightness(2.5) drop-shadow(0 0 18px #ffc700cc) drop-shadow(0 0 8px #ffc70099)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.filter = "drop-shadow(0 0 8px #ffc700)")
      }
      aria-label={direction === "prev" ? "Previous page" : "Next page"}
    />
  );
};

function ClientLayoutContent({ children }: { children: React.ReactNode }) {
  const { setAppReadyForAnimation, setStartHeroAnimations } = useAnimation();
  const { isMobile } = useResponsive();

  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const handleLoadingComplete = () => {
      setAppReadyForAnimation(true);
      setStartHeroAnimations(true);
      setShowContent(true);

      window.removeEventListener(
        "loadingScreenComplete",
        handleLoadingComplete
      );
    };

    if (typeof window !== "undefined") {
      if (
        (window as Window & { loadingScreenCompleted?: boolean })
          .loadingScreenCompleted
      ) {
        handleLoadingComplete();
        return;
      }

      sessionStorage.removeItem("loadingScreenComplete");
      window.addEventListener("loadingScreenComplete", handleLoadingComplete);

      const fallbackTimeout = setTimeout(() => {
        if (!showContent) {
          console.warn("Loading screen timeout - forcing content display");
          handleLoadingComplete();
        }
      }, 1500);

      return () => {
        window.removeEventListener(
          "loadingScreenComplete",
          handleLoadingComplete
        );
        clearTimeout(fallbackTimeout);
      };
    }

    return () => {
      window.removeEventListener(
        "loadingScreenComplete",
        handleLoadingComplete
      );
    };
  }, [showContent, setAppReadyForAnimation, setStartHeroAnimations]);

  const [showBook, setShowBook] = React.useState(false);

  const bottomMarkerRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const lastBounceAtRef = useRef<number>(0);

  useEffect(() => {
    const isAtBottomNow = () => {
      const root = document.scrollingElement || document.documentElement;
      const distanceFromBottom =
        root.scrollHeight - (root.clientHeight + root.scrollTop);
      return distanceFromBottom <= 10;
    };

    const triggerBounce = () => {
      const now = performance.now();
      if (now - lastBounceAtRef.current < 600) return;

      if (!isAtBottomNow()) return;
      if (document.querySelector(".footer-modal-backdrop")) return;

      lastBounceAtRef.current = now;

      if (bottomMarkerRef.current) {
        bottomMarkerRef.current.style.height = "150px";

        setTimeout(() => {
          if (bottomMarkerRef.current) {
            bottomMarkerRef.current.style.height = "50px";
          }
        }, 600);
      }
    };

    const wheelListener = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (isAtBottomNow()) triggerBounce();
          });
        });
      }
    };

    window.addEventListener("wheel", wheelListener, { passive: true });
    return () => window.removeEventListener("wheel", wheelListener);
  }, []);
  React.useEffect(() => {
    const checkShowBook = () => {
      setShowBook(!!window.__aboutSectionShowBook);
    };
    checkShowBook();
    window.addEventListener("aboutSectionShowBookChanged", checkShowBook);
    return () => {
      window.removeEventListener("aboutSectionShowBookChanged", checkShowBook);
    };
  }, []);

  return (
    <div
      className={cn(
        "min-h-screen font-furore antialiased flex flex-col relative"
      )}
    >
      {/* ОТЛАДКА: прелоадер + только шапка (AdaptiveHeader). Остальное закомментировано для поиска причины зависания. */}
      {isMobile ? <MobileLoadingBar /> : <LoadingBar />}

      <div
        className={cn(!showContent && "select-none")}
        style={{
          visibility: showContent ? "visible" : "hidden",
          opacity: showContent ? 1 : 0,
          transition: "opacity 0.4s ease",
          pointerEvents: showContent ? "auto" : "none",
        }}
      >
        <AdaptiveHeader />
        <ScrollToTop />
        <CustomCursor />
        <FloatingIcons />
        <div className="flex flex-col flex-grow">
          <main className="flex-grow relative z-10">{children}</main>
          <div ref={contentWrapperRef}>
            <Footer />
            <div
              ref={bottomMarkerRef}
              className="footer-bottom-texture"
              style={{
                width: "100%",
                height: isMobile ? "auto" : "50px",
                minHeight: isMobile ? "65px" : undefined,
                backgroundImage: "url(/images/textures/3-2.jpg)",
                backgroundSize: "cover",
                backgroundRepeat: "repeat-x",
                backgroundPosition: "center top",
                borderTop: "2px solid #ffc700",
                position: "relative",
                transition: "height 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
                zIndex: 50000,
                overflow: isMobile ? "visible" : "hidden",
              }}
            >
              <div
                style={{
                  position: isMobile ? "relative" : "absolute",
                  top: isMobile ? undefined : 0,
                  left: isMobile ? undefined : 0,
                  right: isMobile ? undefined : 0,
                  height: isMobile ? "auto" : "50px",
                  minHeight: isMobile ? undefined : "50px",
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  padding: isMobile ? "8px 12px" : undefined,
                  fontSize: "11px",
                  color: "rgba(255, 255, 255, 0.7)",
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                  pointerEvents: "auto",
                }}
              >
                <span>© 2025 SHELF</span>
                {!isMobile && (
                  <span style={{ color: "rgba(255, 199, 0, 0.5)" }}>|</span>
                )}
                <span>
                  Разработчики:{" "}
                  <a
                    href="https://github.com/prostojhenya"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#ffc700", textDecoration: "none" }}
                  >
                    @prostojhenya
                  </a>{" "}
                  <a
                    href="https://github.com/ignat_chigrin"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#ffc700", textDecoration: "none" }}
                  >
                    @ignat_chigrin
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
        <Toaster />
      </div>
    </div>
  );
}

export function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AnimationProvider>
      <ClientLayoutContent>{children}</ClientLayoutContent>
    </AnimationProvider>
  );
}
