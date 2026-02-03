"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { Globe, Instagram } from "lucide-react";
import { cn } from "@/lib/utils";
import { useResponsive } from "@/contexts/ResponsiveContext";
import { asset } from "@/lib/basePath";

const TelegramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 2L11 13"></path>
    <path d="M22 2L15 22l-4-9-9-4 20-6z"></path>
  </svg>
);

interface LogoData {
  src: string;
  alt: string;
  dataAiHint?: string;
  height?: number;
  width?: number;
  websiteUrl?: string;
  instagramUrl?: string;
  telegramUrl?: string;
}

const logos: LogoData[] = [
  {
    src: asset("/images/logo/logo1.png"),
    alt: "BestMebel",
    width: 994,
    height: 200,
    websiteUrl: "https://www.bestmebelshop.ru/",
    instagramUrl: "https://www.instagram.com/bestmebelshop.ru/",
    telegramUrl: "https://t.me/bestmebelshop",
  },
  {
    src: asset("/images/logo/logo2.png"),
    alt: "Volhov",
    width: 975,
    height: 200,
    websiteUrl: "https://volhovamebel.ru/",
  },
  {
    src: asset("/images/logo/logo3.png"),
    alt: "Divan",
    width: 924,
    height: 200,
    websiteUrl: "https://www.divan.ru/",
    instagramUrl: "https://www.instagram.com/official_divan_ru/",
    telegramUrl: "https://t.me/officialdivanru",
  },
  {
    src: asset("/images/logo/logo17.png"),
    alt: "hoff",
    width: 404,
    height: 200,
    websiteUrl: "https://hoff.ru",
  },
  {
    src: asset("/images/logo/logo5.png"),
    alt: "lazurit",
    width: 1349,
    height: 200,
    websiteUrl: "https://lazurit.com/",
  },
  {
    src: asset("/images/logo/logo6.png"),
    alt: "lemanapro",
    width: 697,
    height: 200,
    websiteUrl: "https://lemanapro.ru/",
  },
  {
    src: asset("/images/logo/logo7.png"),
    alt: "ld",
    width: 746,
    height: 200,
    websiteUrl: "https://lubidom.ru/",
  },
  {
    src: asset("/images/logo/logo8.png"),
    alt: "maxidom",
    width: 586,
    height: 200,
    websiteUrl: "https://www.maxidom.ru",
    instagramUrl: "https://t.me/maxidom",
  },
  {
    src: asset("/images/logo/logo9.png"),
    alt: "mnogomebeli",
    width: 398,
    height: 200,
    websiteUrl: "https://mnogomebeli.com/",
    instagramUrl: "https://t.me/mnogomebeliofficial",
  },
  {
    src: asset("/images/logo/logo10.png"),
    alt: "3+2",
    width: 699,
    height: 200,
    websiteUrl: "https://mf78.ru",
  },
  {
    src: asset("/images/logo/logo11.png"),
    alt: "nonton",
    width: 1248,
    height: 200,
    websiteUrl: "https://nonton.ru/",
    instagramUrl: "https://www.instagram.com/nonton_mebel",
    telegramUrl: "https://t.me/nonton_mebel",
  },
  {
    src: asset("/images/logo/logo12.png"),
    alt: "pm",
    width: 1424,
    height: 200,
    websiteUrl: "https://spb.pm.ru",
  },
  {
    src: asset("/images/logo/logo13.png"),
    alt: "robust",
    width: 1385,
    height: 200,
    websiteUrl: "https://vk.com/robust_spb",
  },
  {
    src: asset("/images/logo/logo14.png"),
    alt: "stolplit",
    width: 1369,
    height: 200,
    websiteUrl: "https://spb.stolplit.ru/",
  },
  {
    src: asset("/images/logo/logo15.png"),
    alt: "brw",
    width: 1051,
    height: 200,
    websiteUrl: "https://brw.ru/",
  },
  {
    src: asset("/images/logo/logo16.png"),
    alt: "maria",
    width: 681,
    height: 200,
    websiteUrl: "https://www.marya.ru",
    telegramUrl: "https://t.me/mf_marya",
  },
  {
    src: asset("/images/logo/logo4.png"),
    alt: "dsv",
    width: 580,
    height: 200,
    websiteUrl: "https://dsv-mebel.ru/",
  },
  {
    src: asset("/images/logo/logo18.png"),
    alt: "shatura",
    width: 905,
    height: 200,
    websiteUrl: "https://www.shatura.com/",
  },
  {
    src: asset("/images/logo/logo19.png"),
    alt: "mrdors",
    width: 486,
    height: 200,
    websiteUrl: "https://www.mrdoors.ru/",
    telegramUrl: "https://t.me/mrdoors_russia",
  },
  {
    src: asset("/images/logo/logo20.png"),
    alt: "olisys",
    width: 512,
    height: 200,
    websiteUrl: "https://olissys.com/",
  },
];

interface LogoCarouselProps {
  sectionId?: string;
  active?: boolean; // новый проп для анимации
}

const DESKTOP_SIDE_BUFFER = 500;
const MOBILE_SIDE_BUFFER = 16;

export function LogoCarousel({ sectionId, active = false }: LogoCarouselProps) {
  const { isMobile } = useResponsive();
  const sideBuffer = isMobile ? MOBILE_SIDE_BUFFER : DESKTOP_SIDE_BUFFER;

  const x = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);

  const duplicated = logos;

  const [textureWidth, setTextureWidth] = useState(1024); // Default value, will be updated after image loads
  const textureRef = useRef<HTMLDivElement>(null);

  const [containerWidth, setContainerWidth] = useState(0); // общая ширина трека
  const [visibleWidth, setVisibleWidth] = useState(0); // ширина видимой области
  const trackRef = useRef<HTMLDivElement>(null);
  const BASE_DURATION = 120; // секунд на полную ленту (ещё медленнее)
  const socialIconStyle = { width: 60, height: 60 };
  const animationInstance = useRef<ReturnType<typeof animate> | null>(null);
  const OVERSHOOT = 60; // пикселей дополнительного хода за край для «iOS-bounce»
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  useEffect(() => {
    let rafId: number;

    const syncTexture = () => {
      if (textureRef.current) {
        const latestX = x.get();

        const offset = latestX % 1000;
        textureRef.current.style.transform = `translateX(${offset}px)`;
      }
      rafId = requestAnimationFrame(syncTexture);
    };

    rafId = requestAnimationFrame(syncTexture);
    return () => cancelAnimationFrame(rafId);
  }, [x]);

  const [isHovered, setIsHovered] = useState(false);

  const mouseRef = useRef({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);

  const scale = useMotionValue(1);
  const translateX = useMotionValue(0);
  const translateY = useMotionValue(0);

  useEffect(() => {
    if (!isHovered) {
      animate(translateX, 0, { duration: 0.45, ease: "easeOut" });
      animate(translateY, 0, { duration: 0.45, ease: "easeOut" });
    }
  }, [isHovered, translateX, translateY]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseRef.current = { x, y }; // stored for potential future use without re-render

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const maxOffset = 30;
    const offsetX = ((x - centerX) / centerX) * maxOffset;
    const offsetY = ((y - centerY) / centerY) * maxOffset;

    translateX.set(offsetX);
    translateY.set(offsetY);
  };
  const handleMouseEnter = () => {
    if (isMobile) return;
    setIsHovered(true);
    animate(scale, 1.06, { duration: 0.35, ease: "easeOut" });
  };
  const handleMouseLeave = () => {
    if (isMobile) return;
    setIsHovered(false);
    animate(scale, 1, { duration: 0.45, ease: "easeOut" });
  };

  useEffect(() => {
    const copiesCount = duplicated.length / logos.length; // сколько раз продублирован массив
    const updateWidth = () => {
      if (trackRef.current) {
        const fullWidth =
          trackRef.current.scrollWidth || trackRef.current.offsetWidth;
        setContainerWidth(fullWidth / copiesCount);

        const parentWidth = trackRef.current.parentElement?.clientWidth || 0;

        setVisibleWidth(Math.max(parentWidth - sideBuffer * 2, 0));
      }
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(() => updateWidth());
    if (trackRef.current) resizeObserver.observe(trackRef.current);

    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
      resizeObserver.disconnect();
    };
  }, [sideBuffer]);

  useEffect(() => {
    const img = document.createElement("img");
    img.src = asset("/images/partners/IMG_6107.jpg");
    img.onload = () => {
      setTextureWidth(img.width);
    };
  }, []);

  useEffect(() => {
    if (containerWidth > 0) {
      startAnimation(x.get(), direction);
    }
  }, [containerWidth, direction]);

  const startAnimation = (fromX: number, dir: "forward" | "backward") => {
    if (!containerWidth) return;
    const maxShift = Math.max(containerWidth - visibleWidth, 0); // расстояние до появления последнего логотипа
    const toX = dir === "forward" ? -maxShift : 0;
    const distance = Math.abs(toX - fromX);
    const duration = (distance / containerWidth) * BASE_DURATION;
    if (animationInstance.current) {
      animationInstance.current.stop();
    }
    animationInstance.current = animate(x, toX, {
      type: "tween",
      ease: "linear",
      duration,
      onComplete: () => {
        setDirection((prev) => (prev === "forward" ? "backward" : "forward"));
      },
    });
  };

  const handlePrevClick = () => {
    if (!containerWidth) return;
    const logoWidth = containerWidth / logos.length;
    const delta = logoWidth; // на 1 логотип вправо (лента смещается влево)
    x.stop();

    const rawTarget = x.get() + delta;
    const target = rawTarget > 0 ? Math.min(OVERSHOOT, rawTarget) : rawTarget;

    setDirection("backward");
    animate(x, target, {
      type: "tween",
      ease: "linear",
      duration: 0.7,
      onComplete: () => {
        const maxShift = Math.max(containerWidth - visibleWidth, 0);
        if (target > 0) {
          animate(x, 0, {
            type: "spring",
            stiffness: 300,
            damping: 22,
            onComplete: () => startAnimation(0, "backward"),
          });
        } else {
          startAnimation(target, "backward");
        }
      },
    });
  };
  const handleNextClick = () => {
    if (!containerWidth) return;
    const logoWidth = containerWidth / logos.length;
    const delta = -logoWidth; // на 1 логотип влево (лента смещается вправо)
    x.stop();

    const maxShift = Math.max(containerWidth - visibleWidth, 0);
    const rawTarget = x.get() + delta;
    const target =
      rawTarget < -maxShift
        ? Math.max(-(maxShift + OVERSHOOT), rawTarget)
        : rawTarget;

    setDirection("forward");
    animate(x, target, {
      type: "tween",
      ease: "linear",
      duration: 0.7,
      onComplete: () => {
        if (target < -maxShift) {
          animate(x, -maxShift, {
            type: "spring",
            stiffness: 300,
            damping: 22,
            onComplete: () => startAnimation(-maxShift, "forward"),
          });
        } else {
          startAnimation(target, "forward");
        }
      },
    });
  };

  const renderSocialIcon = (
    url: string | undefined,
    IconComponent: React.ElementType,
    label: string
  ) => {
    const isActive = url && url !== "#";
    const iconClasses = "w-5 h-5 sm:w-6 sm:h-6";
    if (isActive) {
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
        >
          <IconComponent className={iconClasses} />
        </a>
      );
    }
    return (
      <span className="opacity-50 cursor-not-allowed">
        <IconComponent className={iconClasses} />
      </span>
    );
  };

  return (
    <motion.section
      id={sectionId}
      ref={sectionRef}
      animate={
        active
          ? {
              y: [1000, 0], // пролетаем путь ~1000px до финальной позиции
              scale: [1.5, 1.5, 1], // держим крупный размер и только в конце уменьшаем
              opacity: [0, 0.9, 1],
            }
          : {
              y: 1000,
              scale: 1.5, // начальное состояние — увеличенный размер
              rotateX: 0,
              opacity: 0,
            }
      }
      transition={{
        y: { duration: 0.35, ease: [0.42, 0, 0.58, 1] },
        scale: { duration: 0.35, ease: [0.42, 0, 0.58, 1] },
        opacity: { duration: 0.2, ease: "linear" },
      }}
      className={cn(
        "w-screen overflow-hidden relative partners-carousel z-[30000]",
        isMobile ? "h-[200px] partners-carousel--no-hover" : "h-[200px]"
      )}
      style={{
        backgroundColor: "#2D1B3B",
        paddingLeft: sideBuffer,
        paddingRight: sideBuffer,
        transform: "none",
        scale: isMobile ? 1 : scale,
        x: isMobile ? 0 : translateX,
        y: isMobile ? 0 : translateY,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          ref={textureRef}
          className="absolute top-0 bottom-0 flex"
          style={{ left: "-50%", width: "300%" }}
        >
          <img
            src={asset("/images/partners/IMG_6107.jpg")}
            alt=""
            className="h-full w-auto object-cover"
            style={{ objectPosition: "bottom" }}
          />
          <img
            src={asset("/images/partners/IMG_6107.jpg")}
            alt=""
            className="h-full w-auto object-cover"
            style={{ objectPosition: "bottom" }}
          />
          <img
            src={asset("/images/partners/IMG_6107.jpg")}
            alt=""
            className="h-full w-auto object-cover"
            style={{ objectPosition: "bottom" }}
          />
          <img
            src={asset("/images/partners/IMG_6107.jpg")}
            alt=""
            className="h-full w-auto object-cover"
            style={{ objectPosition: "bottom" }}
          />
        </div>
      </div>
      {}
      <button
        onClick={handlePrevClick}
        className={
          `carousel-arrow-prev absolute top-1/2 -translate-y-1/2 z-50 w-[60px] h-[60px] md:w-[80px] md:h-[80px] before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:w-[36px] md:before:w-[48px] before:h-[36px] md:before:h-[48px] before:border-l-[5px] before:border-b-[5px] before:border-yellow-500 before:transform before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-45 before:origin-center hover:before:border-yellow-400 focus:outline-none transition-transform duration-150 hover:scale-125 ` +
          (isHovered && !isMobile
            ? " left-[370px] md:left-[370px]"
            : " left-[15px] md:left-[40px]")
        }
        style={{ filter: "drop-shadow(0 0 8px #ffc700)" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.filter =
            "brightness(2.5) drop-shadow(0 0 18px #ffc700cc) drop-shadow(0 0 8px #ffc70099)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.filter = "drop-shadow(0 0 8px #ffc700)")
        }
        aria-label="Previous slide"
      />
      <button
        onClick={handleNextClick}
        className={
          `carousel-arrow-next absolute top-1/2 -translate-y-1/2 z-50 w-[60px] h-[60px] md:w-[80px] md:h-[80px] before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:w-[36px] md:before:w-[48px] before:h-[36px] md:before:h-[48px] before:border-l-[5px] before:border-b-[5px] before:border-yellow-500 before:transform before:-translate-x-1/2 before:-translate-y-1/2 before:-rotate-[135deg] before:origin-center hover:before:border-yellow-400 focus:outline-none transition-transform duration-150 hover:scale-125 ` +
          (isHovered && !isMobile
            ? " right-[370px] md:right-[370px]"
            : " right-[15px] md:right-[40px]")
        }
        style={{ filter: "drop-shadow(0 0 8px #ffc700)" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.filter =
            "brightness(2.5) drop-shadow(0 0 18px #ffc700cc) drop-shadow(0 0 8px #ffc70099)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.filter = "drop-shadow(0 0 8px #ffc700)")
        }
        aria-label="Next slide"
      />
      <motion.div
        ref={trackRef}
        className={cn(
          "absolute flex gap-32 w-max z-20 cursor-grab active:cursor-grabbing",
          isMobile ? "top-1/2" : "bottom-0"
        )}
        style={{
          x,
          ...(isMobile && { y: "-50%" }),
          touchAction: "pan-y",
        }}
        drag="x"
        dragConstraints={{
          left: -(Math.max(containerWidth - visibleWidth, 0) + OVERSHOOT),
          right: OVERSHOOT,
        }}
        onDragStart={() => {
          x.stop();
          setIsDragging(true);
        }}
        onDragEnd={() => {
          setIsDragging(false);

          let currentX = x.get();
          const maxShift = Math.max(containerWidth - visibleWidth, 0);
          if (currentX > 0) {
            animate(x, 0, {
              type: "spring",
              stiffness: 300,
              damping: 22,
              onComplete: () => startAnimation(0, direction),
            });
          } else if (currentX < -maxShift) {
            animate(x, -maxShift, {
              type: "spring",
              stiffness: 300,
              damping: 22,
              onComplete: () => startAnimation(-maxShift, direction),
            });
            currentX = -maxShift;
          } else {
            startAnimation(
              currentX > -maxShift ? currentX : -maxShift,
              direction
            );
          }
        }}
        onMouseEnter={() => {
          if (animationInstance.current) {
            animationInstance.current.stop();
          }
          x.stop();
        }}
        onMouseLeave={() => {
          startAnimation(x.get(), direction);
        }}
      >
        {duplicated.map((logo, index) => {
          const scale = isMobile ? 0.32 : 0.6;
          const scaledWidth = logo.width
            ? Math.round(logo.width * scale)
            : undefined;
          const scaledHeight = logo.height
            ? Math.round(logo.height * scale)
            : undefined;
          return (
            <div
              key={index}
              className={cn(
                "flex-shrink-0 flex items-center justify-center cursor-pointer group relative",
                isMobile ? "h-[80px]" : "h-[200px]"
              )}
              style={{ minWidth: isMobile ? "200px" : "240px" }}
            >
              {logo.websiteUrl ? (
                <a
                  href={logo.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform duration-150 hover:scale-110"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={scaledWidth}
                    height={scaledHeight}
                    className={cn(
                      "grayscale hover:grayscale-0 transition-all duration-300 object-contain"
                    )}
                    data-ai-hint={logo.dataAiHint}
                    style={{
                      pointerEvents: "auto",
                      ...(isMobile && { maxWidth: "70vw" }),
                    }}
                    draggable={false}
                  />
                </a>
              ) : (
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={scaledWidth}
                  height={scaledHeight}
                  className={cn(
                    "peer grayscale group-hover:grayscale-0 peer-hover:grayscale-0 transition-all duration-300 object-contain"
                  )}
                  data-ai-hint={logo.dataAiHint}
                  style={{
                    pointerEvents: "auto",
                    ...(isMobile && { maxWidth: "80vw" }),
                  }}
                  draggable={false}
                />
              )}
            </div>
          );
        })}
      </motion.div>
      {}
      <div className="top-border absolute top-0 left-0 w-full h-[3px] bg-transparent" />
      <div className="bottom-border absolute bottom-0 left-0 w-full h-[3px] bg-transparent" />

      <style jsx global>{`
        .partners-carousel {
          transition: box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1);

          -webkit-transform: translateZ(0);
          transform: translateZ(0);
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }

        @keyframes textureSlide {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-33.33%);
          }
        }

        .animated-texture-wrapper {
          animation: textureSlide 14s linear infinite;
        }

        .animated-texture-wrapper.reverse {
          animation-direction: reverse;
        }

        .partners-carousel:hover .animated-texture-wrapper {
          animation-play-state: paused;
        }

        .partners-carousel:hover {
          box-shadow: 0 0 12px 4px #ffc70099,
            24px 32px 64px 0 rgba(0, 0, 0, 0.95);
        }

        .partners-carousel .top-border,
        .partners-carousel .bottom-border {
          background-color: transparent;
          transition: background-color 0.25s ease, box-shadow 0.25s ease;
        }

        .partners-carousel:hover .top-border {
          background-color: #ffc700;
          box-shadow: 0 -5px 10px 1px rgba(255, 199, 0, 0.9),
            0 -10px 20px 2px rgba(255, 199, 0, 0.7),
            0 -15px 30px 3px rgba(255, 199, 0, 0.5),
            0 -20px 40px 4px rgba(255, 199, 0, 0.3);
        }

        .partners-carousel:hover .bottom-border {
          background-color: #ffc700;
          box-shadow: 0 5px 10px 1px rgba(255, 199, 0, 0.9),
            0 10px 20px 2px rgba(255, 199, 0, 0.7),
            0 15px 30px 3px rgba(255, 199, 0, 0.5),
            0 20px 40px 4px rgba(255, 199, 0, 0.3);
        }

        .partners-carousel--no-hover:hover {
          box-shadow: none;
        }
        .partners-carousel--no-hover:hover .top-border,
        .partners-carousel--no-hover:hover .bottom-border {
          background-color: transparent !important;
          box-shadow: none !important;
        }
        .partners-carousel--no-hover:hover .animated-texture-wrapper {
          animation-play-state: running;
        }
      `}</style>
    </motion.section>
  );
}
