"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Phone, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRegion } from "@/contexts/RegionContext";
import { useResponsive } from "@/contexts/ResponsiveContext";
import { useAnimation } from "@/contexts/AnimationContext";
import RegionSelectionModal from "@/components/ui/RegionSelectionModal";
import DesktopNavigation from "@/components/navigation/DesktopNavigation";
import type { DeviceType } from "@/lib/constants/breakpoints";
import { asset } from "@/lib/basePath";
import styles from "./AdaptiveHeader.module.css";

interface AdaptiveHeaderProps {
  variant?: DeviceType;
  transparent?: boolean;
  sticky?: boolean;
}

const navLinks = [
  { href: "#about", label: "О нас" },
  { href: "#pricing-gallery", label: "Цены" },
  { href: "#partners", label: "Партнёры" },
  { href: "#contacts", label: "Контакты" },
  { href: "#order-form", label: "Заказать" },
];

const AdaptiveHeaderComponent: React.FC<AdaptiveHeaderProps> = ({
  variant,
  transparent = false,
  sticky = true,
}) => {
  const { deviceType } = useResponsive();
  const { appReadyForAnimation } = useAnimation();
  const { activeRegion } = useRegion();

  const activeVariant = variant || deviceType;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showOrderBtn, setShowOrderBtn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [logoAnimated, setLogoAnimated] = useState(false);
  const [menuAnimated, setMenuAnimated] = useState(false);
  const [navAnimated, setNavAnimated] = useState(false);
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(
        window.scrollY >
          (activeVariant === "mobile" || activeVariant === "tablet" ? 20 : 50),
      );
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeVariant]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange,
      );
    };
  }, []);

  useEffect(() => {
    if (appReadyForAnimation && !hasAnimated) {
      setHasAnimated(true);
      const headerElement = headerRef.current;

      if (activeVariant === "mobile" || activeVariant === "tablet") {
        setTimeout(() => setLogoAnimated(true), 200);
        setTimeout(() => setMenuAnimated(true), 400);
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("headerAnimated"));
        }, 600);
      } else {
        if (headerElement) {
          headerElement.classList.add(styles["header--bounce"]);
        }
        window.dispatchEvent(new CustomEvent("headerAnimated"));

        setTimeout(() => {
          setNavAnimated(true);

          const WORD_ANIMATION_DELAY_INCREMENT = 0.12;
          const WORD_ANIMATION_DURATION = 0.3;

          let totalAnimatedUnits = 0;
          navLinks.forEach((link) => {
            const labelParts = link.label.split(" ");
            totalAnimatedUnits += labelParts.length > 1 ? labelParts.length : 1;
          });

          const lastUnitGlobalIndex =
            totalAnimatedUnits > 0 ? totalAnimatedUnits - 1 : 0;
          const animationStartTimeForLastUnit =
            lastUnitGlobalIndex * WORD_ANIMATION_DELAY_INCREMENT;
          const animationEndTimeForLastUnit =
            animationStartTimeForLastUnit + WORD_ANIMATION_DURATION;
          const totalDelayMsForNavAnimationStart =
            animationStartTimeForLastUnit * 1000;
          const totalDelayMsForNavAnimationEnd =
            animationEndTimeForLastUnit * 1000;

          setTimeout(() => {
            setShowPhone(true);
          }, totalDelayMsForNavAnimationStart + 150);

          setTimeout(() => {
            setShowOrderBtn(true);
          }, totalDelayMsForNavAnimationEnd + 50);
        }, 900);
      }
    }
  }, [appReadyForAnimation, hasAnimated, activeVariant]);

  const handleScrollToTop = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsMenuOpen(false);
    },
    [],
  );

  const handleScrollTo = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
      e.preventDefault();
      const plainId = targetId.startsWith("#")
        ? targetId.substring(1)
        : targetId;
      const targetElement = document.getElementById(plainId);

      if (targetElement) {
        const headerHeight =
          activeVariant === "mobile" || activeVariant === "tablet" ? 70 : 140;
        const extraOffset =
          plainId === "pricing-gallery"
            ? 500
            : plainId === "order-form"
              ? -600
              : 0;

        window.scrollTo({
          top: targetElement.offsetTop - headerHeight - extraOffset,
          behavior: "smooth",
        });
      }
      setIsMenuOpen(false);
    },
    [activeVariant],
  );

  if (activeVariant === "mobile" || activeVariant === "tablet") {
    return (
      <>
        <header
          ref={headerRef}
          data-testid="mobile-header"
          role="banner"
          aria-label="Главная навигация"
          className={cn(
            styles["mobile-header"],
            styles["mobile-header-adaptive"],
            "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
            styles["mobile-header-textured"],
            "backdrop-blur-md border-b border-accent/20",
            isScrolled && "scrolled shadow-xl shadow-accent/10",
            hasAnimated && styles["mobile-header-bounce"],
          )}
          style={{ height: "70px" }}
        >
          <div className="container mx-auto px-4 h-full flex items-center">
            <div className="flex-shrink-0">
              <Link
                href="#"
                onClick={handleScrollToTop}
                className={cn(
                  "flex items-center group transition-all duration-500",
                  logoAnimated
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-8 opacity-0",
                )}
              >
                <div className={cn("relative", styles["mobile-logo-enhanced"])}>
                  <Image
                    src={asset("/images/logo.svg")}
                    alt="SHELF Logo"
                    width={45}
                    height={45}
                    className={cn(
                      "transition-all duration-500 group-hover:scale-110",
                      logoAnimated && "mobile-logo-pulse",
                    )}
                  />
                  <div
                    className={cn(
                      "absolute inset-0 rounded-full border-2 border-accent/30 transition-all duration-1000",
                      logoAnimated
                        ? "scale-125 opacity-0"
                        : "scale-100 opacity-100",
                    )}
                  />
                </div>
              </Link>
            </div>

            <div className="flex-1 flex justify-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={cn(
                  "relative w-10 h-10 flex flex-col justify-center items-center group transition-all duration-500 delay-200",
                  menuAnimated
                    ? "translate-y-0 opacity-100 rotate-0"
                    : "translate-y-8 opacity-0 rotate-180",
                )}
                aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
              >
                <div
                  className={cn(
                    "w-7 h-0.5 bg-accent transition-all duration-300 group-hover:bg-accent/80",
                    isMenuOpen && "rotate-45 translate-y-2",
                    menuAnimated && "animate-in slide-in-from-bottom-2",
                  )}
                />
                <div
                  className={cn(
                    "w-7 h-0.5 bg-accent transition-all duration-300 mt-1.5 group-hover:bg-accent/80 delay-75",
                    isMenuOpen && "opacity-0",
                    menuAnimated && "animate-in slide-in-from-bottom-2",
                  )}
                />
                <div
                  className={cn(
                    "w-7 h-0.5 bg-accent transition-all duration-300 mt-1.5 group-hover:bg-accent/80 delay-150",
                    isMenuOpen && "-rotate-45 -translate-y-2",
                    menuAnimated && "animate-in slide-in-from-bottom-2",
                  )}
                />
              </button>
            </div>

            <div className="flex-shrink-0">
              <div
                className={cn(
                  "flex items-center transition-all duration-500 delay-200",
                  logoAnimated
                    ? "translate-x-0 opacity-100"
                    : "translate-x-8 opacity-0",
                )}
              >
                <a
                  href={activeRegion.mobileHref || activeRegion.phoneHref}
                  className="flex items-center justify-center w-12 h-12 text-accent hover:text-accent/80 transition-colors group"
                  aria-label="Позвонить"
                >
                  <Phone
                    size={24}
                    className="transition-all duration-300 group-hover:scale-110"
                  />
                </a>
              </div>
            </div>
          </div>
        </header>

        <div
          id="mobile-menu"
          className={cn(
            styles["mobile-menu-overlay"],
            "fixed inset-0 z-40 transition-all duration-700",
            isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible",
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Навигационное меню"
        >
          <div
            className={cn(
              styles["mobile-menu-content"],
              "absolute inset-0 backdrop-blur-xl",
              styles["mobile-menu-textured"],
              "flex flex-col min-h-screen relative",
              "transform transition-all duration-700 ease-out",
              isMenuOpen ? "scale-100 opacity-100" : "scale-95 opacity-0",
            )}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsMenuOpen(false);
              }
            }}
          >
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-6 right-6 w-11 h-11 flex items-center justify-center text-white hover:text-accent transition-colors z-10"
              aria-label="Закрыть меню"
            >
              <div className="relative w-6 h-6">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-current transform -translate-y-1/2 rotate-45" />
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-current transform -translate-y-1/2 -rotate-45" />
              </div>
            </button>

            <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
              <nav
                className="flex flex-col items-center w-full max-w-xs space-y-3"
                role="navigation"
                aria-label="Основное меню"
              >
                {navLinks.map((link, index) => (
                  <div
                    key={link.href}
                    className={cn(
                      "w-full transition-all duration-500 ease-out",
                      isMenuOpen
                        ? "translate-y-0 opacity-100"
                        : "translate-y-8 opacity-0",
                    )}
                    style={{
                      transitionDelay: isMenuOpen
                        ? `${index * 150 + 300}ms`
                        : "0ms",
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={(e) => handleScrollTo(e, link.href)}
                      className="group block py-3 px-6 text-white hover:text-accent transition-all duration-300 font-furore text-2xl hover:scale-105 active:scale-95 relative text-center border border-transparent hover:border-accent/30 rounded-lg"
                    >
                      <span className="relative">
                        {link.label}
                        <span className="absolute bottom-0 left-1/2 w-0 h-1 bg-accent transition-all duration-300 group-hover:w-full group-hover:left-0" />
                      </span>
                    </Link>
                  </div>
                ))}
              </nav>
            </div>

            <div className="flex flex-col items-center justify-center px-6 pb-6 pt-4">
              <div
                className={cn(
                  "text-center transition-all duration-500 ease-out w-full max-w-xs space-y-4",
                  isMenuOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0",
                )}
                style={{ transitionDelay: isMenuOpen ? "800ms" : "0ms" }}
              >
                <button
                  onClick={() => setShowRegionModal(true)}
                  className="flex items-center justify-center gap-2 text-accent hover:text-accent/80 transition-colors group w-full py-2"
                >
                  <MapPin
                    size={20}
                    className={cn(
                      styles["city-icon-pulse"],
                      "group-hover:scale-110 transition-transform",
                    )}
                  />
                  <span className="text-lg font-medium">
                    {activeRegion.name}
                  </span>
                </button>

                <div className="text-sm text-gray-300 text-center py-1">
                  {activeRegion.workingHours}
                </div>

                <Button
                  asChild
                  className="bg-accent hover:bg-accent/90 text-black font-furore text-lg px-8 py-3 transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-accent/30 w-full"
                >
                  <a
                    href={activeRegion.mobileHref || activeRegion.phoneHref}
                    className="flex items-center justify-center"
                  >
                    <Phone size={20} className="mr-2" />
                    Позвонить сейчас
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <RegionSelectionModal
          isOpen={showRegionModal}
          onClose={() => setShowRegionModal(false)}
        />
      </>
    );
  }

  return (
    <>
      <header
        ref={headerRef}
        data-testid="desktop-header"
        role="banner"
        aria-label="Главная навигация"
        className={cn(
          styles.header,
          styles["header-adaptive"],
          isScrolled && styles.scrolled,
          hasAnimated && styles["header--bounce"],
          isFullscreen && styles["header--hidden"],
        )}
        style={{
          minHeight: "var(--header-height)",
          transform: isFullscreen ? "translateY(-100%)" : "translateY(0)",
          transition: "transform 0.3s ease-in-out",
        }}
      >
        <div
          className={cn(
            "container flex items-center gap-8",
            styles["header__content"],
          )}
        >
          <Link
            href="#"
            className={cn(
              styles.logo,
              styles["logo-adaptive"],
              "group flex flex-col items-center justify-center relative",
            )}
            onClick={handleScrollToTop}
          >
            <Image
              src={asset("/images/logo.svg")}
              alt="SHELF Сборка Мебели Logo"
              width={60}
              height={60}
              className={cn(
                styles["logo__image"],
                styles["logo-image-adaptive"],
              )}
              style={{ marginTop: "-45px" }}
              data-ai-hint="logo company"
            />
            <p
              className={cn(
                styles["header__subtitle"],
                styles["logo-subtitle-adaptive"],
                "leading-none",
              )}
              style={{ marginTop: "-35px" }}
            >
              Профессиональная
            </p>
            <p
              className={cn(
                styles["header__subtitle"],
                styles["logo-subtitle-adaptive"],
                "leading-none",
              )}
            >
              Сборка мебели
            </p>
          </Link>

          <div className="flex-1 flex items-center justify-center gap-8">
            <DesktopNavigation
              links={navLinks}
              navAnimated={navAnimated}
              className={styles["nav-adaptive"]}
            />

            <div
              className={cn(
                "relative flex items-center min-w-[220px] gap-2 ml-auto",
                styles["sync-animations-container"],
                !showPhone && "pointer-events-none",
              )}
              style={{
                transform: showPhone ? "translateY(0)" : "translateY(-120%)",
                opacity: showPhone ? 1 : 0,
                transition:
                  "transform 0.3s cubic-bezier(.7,0,.3,1), opacity 0.3s cubic-bezier(.7,0,.3,1)",
              }}
            >
              <a
                href={activeRegion.mobileHref || activeRegion.phoneHref}
                className="flex items-center gap-2 text-white hover:text-accent transition-colors"
                aria-label="Позвонить"
              >
                <span
                  className={cn(
                    styles["phone-display-adaptive"],
                    "select-text whitespace-nowrap",
                  )}
                >
                  {activeRegion.mobileDisplay || activeRegion.phoneDisplay}
                </span>
                <Image
                  src={asset("/images/icons/phone.svg")}
                  alt="Телефон"
                  width={42}
                  height={42}
                  className={cn(
                    styles["phone-shake"],
                    styles["phone-icon-adaptive"],
                    "whitespace-nowrap",
                  )}
                />
              </a>

              <div className="relative">
                <button
                  className="flex items-center justify-center w-12 h-12 rounded cursor-pointer"
                  onClick={() => setShowRegionModal(true)}
                  aria-label="Выбрать регион"
                  title={`Выбрать регион: ${activeRegion.name}`}
                >
                  <MapPin
                    size={30}
                    className={cn("text-accent", styles["city-icon-pulse"])}
                  />
                </button>
              </div>

              <span
                className={cn(
                  "absolute left-0 top-full mt-1 font-bold select-text whitespace-nowrap w-full text-center",
                  styles["working-hours-adaptive"],
                )}
                style={{
                  color: "#b0b0b0",
                  lineHeight: 1,
                  marginLeft: "-30px",
                  letterSpacing: "0.02em",
                  fontSize: "var(--working-hours-size)",
                }}
              >
                {activeRegion.workingHours}
              </span>
            </div>
          </div>
        </div>
      </header>

      {showRegionModal && (
        <RegionSelectionModal
          isOpen={showRegionModal}
          onClose={() => setShowRegionModal(false)}
        />
      )}
    </>
  );
};

export const AdaptiveHeader = React.memo(AdaptiveHeaderComponent);
