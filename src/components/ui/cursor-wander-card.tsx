"use client";

import * as React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { Phone, Mail, Instagram, Send, MessageCircle } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useResponsive } from "@/contexts/ResponsiveContext";
import ScaleWrapper from "./scale-wrapper";

interface CosmicNebulaMastercardProps {
  cardholderName?: string;
  className?: string;
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    glowColor?: string;
  };
  logoText?: {
    topText?: string;
    bottomText?: string;
  };
  height?: string | number;
  width?: string | number;
  phone?: string;
  whatsapp?: string;
  email?: string;
  instagram?: string;
  telegram?: string;
}

const CosmicNebulaMastercard: React.FC<CosmicNebulaMastercardProps> = ({
  cardholderName = "CARDHOLDER NAME",
  className = "",
  theme = {
    primaryColor: "#0FA0CE", // Enhanced bright blue
    secondaryColor: "#0056b3", // Deep space blue
    glowColor: "rgba(15, 160, 206, 0.8)", // Enhanced bright blue glow
  },
  logoText = { topText: "NEBULA", bottomText: "FLUX" },
  height = undefined,
  width = undefined,
  phone,
  whatsapp,
  email,
  instagram,
  telegram,
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [time, setTime] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const timeAnimationRef = useRef<number>(0);
  const rotationRef = useRef({ x: 15, y: 20, z: 5 });
  const rotationSpeedRef = useRef({ x: 0.2, y: 0.3, z: 0.05 });
  const [flipped, setFlipped] = useState(false);

  const [hoveredText, setHoveredText] = useState<string | null>(null);

  const targetRotation = useRef({ x: 0, y: 0, z: 0 });
  const currentRotation = useRef({ x: 0, y: 0, z: 0 });
  const smoothAnimationRef = useRef<number>(0);

  const iconCount = 12;

  const iconGrid = [
    { top: 15, left: 15 },
    { top: 15, left: 40 },
    { top: 15, left: 65 },
    { top: 15, left: 85 },
    { top: 40, left: 15 },
    { top: 40, left: 40 },
    { top: 40, left: 65 },
    { top: 40, left: 85 },
    { top: 70, left: 15 },
    { top: 70, left: 40 },
    { top: 70, left: 65 },
    { top: 70, left: 85 },
  ];
  const icons = useMemo(() => {
    return Array.from({ length: iconCount }, (_, i) => {
      const size = 48;
      const { top, left } = iconGrid[i];

      const topOffset = top + (Math.random() * 14 - 7);
      const leftOffset = left + (Math.random() * 14 - 7);
      const rotate = Math.random() * 360;
      return {
        src: `/images/icons/${i + 1}.png`,
        size,
        top: topOffset,
        left: leftOffset,
        rotate,
      };
    });
  }, []);

  const { ref: inViewRef, inView } = useInView({ threshold: 0.3 });
  const { isMobile } = useResponsive();
  const flipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (inView && !flipped) {
      flipTimeoutRef.current = setTimeout(() => setFlipped(true), 2000);
    }
    return () => {
      if (flipTimeoutRef.current) clearTimeout(flipTimeoutRef.current);
    };
  }, [inView, flipped]);

  const animate = () => {
    if (!cardRef.current || isHovered) return;

    rotationRef.current.x += rotationSpeedRef.current.x;
    rotationRef.current.y += rotationSpeedRef.current.y;
    rotationRef.current.z += rotationSpeedRef.current.z;

    if (Math.abs(rotationRef.current.x) > 15) rotationSpeedRef.current.x *= -1;
    if (Math.abs(rotationRef.current.y) > 15) rotationSpeedRef.current.y *= -1;
    if (Math.abs(rotationRef.current.z) > 5) rotationSpeedRef.current.z *= -1;

    cardRef.current.style.transform = `
      rotateX(${rotationRef.current.x}deg) 
      rotateY(${rotationRef.current.y}deg) 
      rotateZ(${rotationRef.current.z}deg)
    `;

    animationRef.current = requestAnimationFrame(animate);
  };

  const animateTime = () => {
    setTime((prev) => prev + 0.01);
    timeAnimationRef.current = requestAnimationFrame(animateTime);
  };

  useEffect(() => {
    const container = containerRef.current;
    const card = cardRef.current;
    if (!container || !card) return;

    const lerp = (a: number, b: number, n: number) => a + (b - a) * n;
    const smoothRotate = () => {
      currentRotation.current.x = lerp(
        currentRotation.current.x,
        targetRotation.current.x,
        0.15
      );
      currentRotation.current.y = lerp(
        currentRotation.current.y,
        targetRotation.current.y,
        0.15
      );
      currentRotation.current.z = lerp(
        currentRotation.current.z,
        targetRotation.current.z,
        0.15
      );
      if (card) {
        card.style.transform = `rotateX(${currentRotation.current.x}deg) rotateY(${currentRotation.current.y}deg) rotateZ(${currentRotation.current.z}deg)`;
        card.style.transition = "transform 0.1s linear";
      }
      smoothAnimationRef.current = requestAnimationFrame(smoothRotate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const angleX = ((e.clientY - centerY) / (rect.height / 2)) * 18;
      const angleY = (-(e.clientX - centerX) / (rect.width / 2)) * 18;
      setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });

      targetRotation.current.x = angleX;
      targetRotation.current.y = angleY;
      targetRotation.current.z =
        Math.min(Math.abs(angleX) + Math.abs(angleY), 20) / 10;
    };

    const handleResize = () => {
      if (card) {
        setDimensions({
          width: card.offsetWidth,
          height: card.offsetHeight,
        });
      }
    };

    handleResize();
    animationRef.current = requestAnimationFrame(animate);
    timeAnimationRef.current = requestAnimationFrame(animateTime);

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      cancelAnimationFrame(timeAnimationRef.current);
      cancelAnimationFrame(smoothAnimationRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [isHovered]);

  const parallaxRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const parallaxRaf = useRef<number | null>(null);

  const applyParallaxTransform = (hoverScale: number) => {
    if (cardRef.current) {
      const { x, y } = parallaxRef.current;
      const rotateX = y * 10;
      const rotateY = -x * 10;
      cardRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${hoverScale}) ${
        flipped ? "rotateY(180deg)" : "rotateY(0deg)"
      }`;
    }
  };

  const handleParallax = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 ... 1
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 ... 1
    parallaxRef.current = { x, y };
    if (parallaxRaf.current === null) {
      parallaxRaf.current = requestAnimationFrame(() => {
        applyParallaxTransform(isHovered ? 1.05 : 1);
        parallaxRaf.current = null;
      });
    }
  };

  const resetParallax = () => {
    parallaxRef.current = { x: 0, y: 0 };
    applyParallaxTransform(isHovered ? 1.05 : 1);
  };

  useEffect(() => {
    applyParallaxTransform(isHovered ? 1.05 : 1);
  }, [isHovered, flipped]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <ScaleWrapper baseWidth={800} baseHeight={400} className={className}>
      <div
        ref={inViewRef}
        className="perspective-3000"
        style={{
          perspective: "3000px",
          width: width ?? "100%",
          ...(height
            ? { height }
            : isMobile
            ? { height: "auto" }
            : { aspectRatio: "2 / 1" }),
        }}
        onClick={() => setFlipped((f) => !f)}
        onMouseMove={handleParallax}
        onMouseLeave={resetParallax}
      >
        <div
          ref={cardRef}
          className={`relative w-full transition-shadow duration-300 ${
            isMobile ? "" : "h-full"
          }`}
          style={{
            border: isHovered ? "4px solid #ffc700" : "4px solid transparent",
            borderRadius: 0,
            transition:
              "box-shadow 0.3s, border-color 0.3s, transform 0.3s cubic-bezier(.4,2,.6,1)",
            transformStyle: "preserve-3d",
            width: "100%",
            ...(isMobile ? {} : { height: "100%" }),
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {}
          {/* Обратная сторона: на мобильных в потоке — задаёт высоту карточки */}
          <div
            className={
              isMobile
                ? "w-full rounded-none overflow-hidden bg-[#2D1B3B] relative"
                : "absolute w-full h-full rounded-none overflow-hidden bg-[#2D1B3B]"
            }
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              boxShadow: isHovered
                ? "0 0 18px 0 #ffc700cc, 0 0 8px 0 #ffc70099, 32px 32px 128px 0 rgba(0,0,0,0.9), 8px 16px 32px 0 rgba(0,0,0,0.36)"
                : "none",
            }}
          >
            {}
            {flipped &&
              icons.map((icon, idx) => (
                <img
                  key={idx}
                  src={icon.src}
                  alt="icon"
                  style={{
                    position: "absolute",
                    top: `${icon.top}%`,
                    left: `${icon.left}%`,
                    width: "min(9vw, 48px)",
                    height: "min(9vw, 48px)",
                    transform: `translate(-50%, -50%) rotate(${icon.rotate}deg)`,
                    pointerEvents: "none",
                    filter: "grayscale(1) brightness(0.7)",
                    opacity: 0.2,
                    zIndex: 1,
                  }}
                  draggable={false}
                />
              ))}
            <div
              className={
                isMobile
                  ? "flex flex-col justify-between p-2"
                  : "absolute inset-0 flex flex-col justify-between p-6"
              }
            >
              {}
              <div className="w-full text-center mb-4">
                <span
                  className={`text-accent font-furore text-xl md:text-4xl font-bold uppercase tracking-wide transition-colors duration-200 ${
                    hoveredText === "ЗАГОЛОВОК" ? "text-yellow-400" : ""
                  }`}
                  onMouseEnter={() => setHoveredText("ЗАГОЛОВОК")}
                  onMouseLeave={() => setHoveredText(null)}
                >
                  ПРОФЕССИОНАЛЬНАЯ СБОРКА ВАШЕЙ МЕБЕЛИ
                </span>
              </div>
              {}
              <div className="flex flex-col md:flex-row w-full flex-1">
                {}
                <div className="flex flex-col justify-center items-start flex-1 pl-2 mb-4 md:mb-0">
                  <span className="text-white font-furore text-xl md:text-2xl tracking-wide uppercase transition-colors duration-200">
                    СБОРКА
                  </span>
                  <span className="text-white font-furore text-xl md:text-2xl tracking-wide uppercase transition-colors duration-200">
                    РЕМОНТ
                  </span>
                  <span className="text-white font-furore text-xl md:text-2xl tracking-wide uppercase transition-colors duration-200">
                    МОДЕРНИЗАЦИЯ
                  </span>
                </div>
                {}
                <div
                  className="w-[3px] bg-accent mr-12"
                  style={{
                    height: "70%",
                    alignSelf: "center",
                    borderRadius: 1,
                  }}
                />
                {}
                <div className="flex flex-col justify-center items-start flex-1 gap-3">
                  {}
                  <a
                    href={
                      phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : undefined
                    }
                    className="flex items-center gap-2 text-white font-furore text-lg md:text-xl hover:text-yellow-400 transition-colors cursor-pointer"
                    style={{ textDecoration: "none" }}
                  >
                    <Phone className="text-accent w-6 h-6" />
                    {phone}
                  </a>
                  {}
                  <a
                    href={
                      whatsapp
                        ? `https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`
                        : undefined
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white font-furore text-base md:text-xl hover:text-yellow-400 transition-colors cursor-pointer"
                    style={{ textDecoration: "none" }}
                  >
                    <MessageCircle
                      className="w-6 h-6"
                      style={{ color: "#25D366" }}
                    />
                    {whatsapp}
                  </a>
                  {}
                  <a
                    href={email ? `mailto:${email}` : undefined}
                    className="flex items-center gap-2 text-white font-furore text-base md:text-xl hover:text-yellow-400 transition-colors cursor-pointer"
                    style={{ textDecoration: "none" }}
                  >
                    <Mail className="w-6 h-6" style={{ color: "#888" }} />
                    {email}
                  </a>
                  {}
                  <a
                    href={
                      instagram
                        ? `https://instagram.com/${instagram.toLowerCase()}`
                        : undefined
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white font-furore text-base md:text-xl hover:text-yellow-400 transition-colors cursor-pointer"
                    style={{ textDecoration: "none" }}
                  >
                    <Instagram
                      className="w-6 h-6"
                      style={{ color: "#E1306C" }}
                    />
                    {instagram}
                  </a>
                  {}
                  <a
                    href={
                      telegram
                        ? `https://t.me/${telegram.replace("@", "")}`
                        : undefined
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white font-furore text-base md:text-xl hover:text-yellow-400 transition-colors cursor-pointer"
                    style={{ textDecoration: "none" }}
                  >
                    <Send className="w-6 h-6" style={{ color: "#229ED9" }} />
                    {telegram}
                  </a>
                </div>
              </div>
            </div>
          </div>
          {}
          {/* Лицевая сторона: поверх обратной (absolute), на десктопе — flip */}
          <div
            className="absolute inset-0 w-full h-full flex items-center justify-center rounded-none overflow-hidden bg-[#2D1B3B]"
            style={{
              backfaceVisibility: "hidden",
              boxShadow: isHovered
                ? "0 0 18px 0 #ffc700cc, 0 0 8px 0 #ffc70099, 32px 32px 128px 0 rgba(0,0,0,0.9), 8px 16px 32px 0 rgba(0,0,0,0.36)"
                : "none",
            }}
          >
            <img
              src="/images/logo.png"
              alt="Логотип"
              style={{
                maxWidth: "70%",
                maxHeight: "70%",
                objectFit: "contain",
                filter: "drop-shadow(0 2px 12px #0008)",
              }}
            />
          </div>
        </div>
      </div>
    </ScaleWrapper>
  );
};

export default CosmicNebulaMastercard;
