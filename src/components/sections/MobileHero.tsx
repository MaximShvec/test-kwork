"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Phone,
  ArrowDown,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useRegion } from "@/contexts/RegionContext";
import { asset } from "@/lib/basePath";

const MobileFrameAnimation: React.FC = () => {
  return (
    <div
      className="mobile-frame-animation-container"
      style={{
        backgroundImage: `url(${asset("/animation/animation.webp")})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "144px",
        height: "144px",
      }}
    />
  );
};

export const MobileHero: React.FC = () => {
  const { activeRegion } = useRegion();
  const [showWelcomeElements, setShowWelcomeElements] = useState(false);
  const [loadingDone, setLoadingDone] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeBounceIndex, setActiveBounceIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("MobileHero: useEffect монтирования выполнен");
    if (videoRef.current) {
      videoRef.current.volume = 0.5;
      console.log(
        "MobileHero: Громкость установлена:",
        videoRef.current.volume
      );
    } else {
      console.log("MobileHero: videoRef.current не найден при монтировании");
    }
  }, []);

  useEffect(() => {
    const handleLoadingComplete = () => {
      setLoadingDone(true);
    };

    if (typeof window !== "undefined") {
      if (sessionStorage.getItem("loadingScreenComplete") === "true") {
        setLoadingDone(true);
      } else {
        window.addEventListener("loadingScreenComplete", handleLoadingComplete);
      }
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "loadingScreenComplete",
          handleLoadingComplete
        );
      }
    };
  }, []);

  useEffect(() => {
    const bounceCount = 4;
    const interval = setInterval(() => {
      setActiveBounceIndex((prev) => (prev + 1) % bounceCount);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (loadingDone) {
      const timer = setTimeout(() => {
        setShowWelcomeElements(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [loadingDone]);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    videoRef.current.volume = 0.5;
    console.log(
      "MobileHero: Громкость после переключения mute:",
      videoRef.current.volume
    );
    setIsMuted(!isMuted);
  };

  const handleFullscreen = async () => {
    if (!videoRef.current) return;

    const video = videoRef.current as any;

    try {
      if (!isFullscreen) {
        if (video.requestFullscreen) {
          await video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) {
          await video.webkitRequestFullscreen();
        } else if (video.webkitEnterFullscreen) {
          video.webkitEnterFullscreen();
        } else if (video.mozRequestFullScreen) {
          await video.mozRequestFullScreen();
        } else if (video.msRequestFullscreen) {
          await video.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen();
        } else if (video.webkitExitFullscreen) {
          video.webkitExitFullscreen();
        }
      }
    } catch (error) {
      console.error("Ошибка при переключении полноэкранного режима:", error);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );

      const wasFullscreen = isFullscreen;
      setIsFullscreen(isCurrentlyFullscreen);

      if (wasFullscreen && !isCurrentlyFullscreen && videoRef.current) {
        if (videoRef.current.paused) {
          videoRef.current.play().catch((err) => {
            console.log(
              "Не удалось автоматически возобновить воспроизведение:",
              err
            );
          });
          setIsPlaying(true);
        }
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, [isFullscreen]);

  const handleScrollToAbout = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();
    const targetElement = document.getElementById("about");
    if (targetElement) {
      const headerElement = document.querySelector(
        ".header"
      ) as HTMLElement | null;
      const headerHeight = headerElement?.clientHeight || 80;
      window.scrollTo({
        top: targetElement.offsetTop - headerHeight,
        behavior: "smooth",
      });
    }
  };

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.25,
      },
    },
  };

  const blockVariants = {
    hidden: { y: 50, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: [0.8, 0, 0.2, 1] },
    },
  };

  return (
    <>
      <section
        id="hero"
        className="mobile-hero flex flex-col items-center justify-center w-full min-h-screen relative overflow-hidden"
      >
        {}
        <div className="container mx-auto px-4 py-20 relative z-10 flex flex-col items-center">
          {}
          <motion.div
            className="mobile-video-container relative mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={
              loadingDone
                ? { scale: 1, opacity: 1 }
                : { scale: 0.8, opacity: 0 }
            }
            transition={{ duration: 0.8, ease: [0.8, 0, 0.2, 1] }}
            style={{ width: "400px", height: "300px" }}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          >
            {}
            <Image
              src={asset("/images/textures/ipad.PNG")}
              alt="iPad"
              width={400}
              height={300}
              priority
              className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none"
            />

            {}
            <Image
              src={asset("/images/textures/konturipad.svg")}
              alt="Контур iPad"
              width={400}
              height={300}
              priority
              className="absolute inset-0 w-full h-full object-contain z-20 pointer-events-none"
            />

            {}
            <div
              ref={videoContainerRef}
              className="absolute bg-black rounded-lg overflow-hidden"
              style={{
                top: "6%",
                left: "4.5%",
                width: "90%",
                height: "90%",
              }}
            >
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  webkit-playsinline="true"
                  x-webkit-airplay="allow"
                  className="w-full h-full object-cover"
                  onLoadedMetadata={(e) => {
                    const video = e.currentTarget;
                    video.volume = 0.5;
                    console.log(
                      "MobileHero: Громкость при загрузке метаданных:",
                      video.volume
                    );
                  }}
                >
                  <source
                    src={asset("/videos/background.mp4")}
                    type="video/mp4"
                  />
                </video>

                {}
                <AnimatePresence>
                  {showControls && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute bottom-2 left-2 right-2 flex justify-between items-center bg-black/50 rounded-lg p-2 z-30"
                    >
                      <button
                        onClick={handlePlayPause}
                        className="text-white hover:text-accent transition-colors"
                      >
                        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                      </button>
                      <button
                        onClick={handleMute}
                        className="text-white hover:text-accent transition-colors"
                      >
                        {isMuted ? (
                          <VolumeX size={16} />
                        ) : (
                          <Volume2 size={16} />
                        )}
                      </button>
                      <button
                        onClick={handleFullscreen}
                        className="text-white hover:text-accent transition-colors"
                      >
                        {isFullscreen ? (
                          <Minimize2 size={16} />
                        ) : (
                          <Maximize2 size={16} />
                        )}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {}
          <motion.div
            className="text-center space-y-6 w-full max-w-2xl"
            variants={containerVariants}
            initial="hidden"
            animate={loadingDone ? "show" : "hidden"}
          >
            {}
            <motion.div variants={blockVariants} className="space-y-6">
              <div
                className="flex items-center justify-center gap-4 mb-6"
                style={{ marginLeft: "-20px" }}
              >
                <motion.div
                  animate={{ y: [0, -12, 0, 12, 0], x: [0, 7, 0, -7, 0] }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                >
                  <MobileFrameAnimation />
                </motion.div>

                <h1
                  className="font-furore leading-tight uppercase text-accent text-center"
                  style={{ fontSize: "clamp(2.4375rem, 5vw, 2.925rem)" }}
                >
                  ПОЧЕМУ
                  <br />
                  ВЫБИРАЮТ
                  <br />
                  НАС?
                </h1>
              </div>

              <p className="text-sm leading-relaxed text-gray-300 max-w-2xl text-center uppercase">
                МЫ - КОМАНДА ОПЫТНЫХ МАСТЕРОВ, УВЛЕЧЁННЫХ СВОИМ ДЕЛОМ. СБОРКА
                МЕБЕЛИ ДЛЯ НАС НЕ ПРОСТО РАБОТА, А ИСКУССТВО СОЗДАНИЯ УЮТА И
                ФУНКЦИОНАЛЬНОСТИ В ВАШЕМ ДОМЕ. МЫ ЦЕНИМ ВАШЕ ВРЕМЯ И ДОВЕРИЕ.
              </p>
            </motion.div>

            {}
            <motion.div variants={blockVariants} className="space-y-6">
              <ul className="space-y-4 max-w-lg mx-auto">
                <li className="flex items-center gap-4 text-left">
                  <span className="icon-container">
                    <Image
                      src={asset("/images/icons/guarantee.png")}
                      alt="Гарантия"
                      width={32}
                      height={32}
                      className={`icon-shield${
                        activeBounceIndex === 0 ? " bounce-check" : ""
                      }`}
                    />
                  </span>
                  <span className="font-furore text-sm leading-snug text-white uppercase">
                    ГАРАНТИЯ КАЧЕСТВА НА ВСЕ ВИДЫ РАБОТ
                  </span>
                </li>
                <li className="flex items-center gap-4 text-left">
                  <span className="icon-container">
                    <Image
                      src={asset("/images/icons/alarm-clock.png")}
                      alt="Пунктуальность"
                      width={32}
                      height={32}
                      className={`icon-alarm${
                        activeBounceIndex === 1 ? " bounce-check" : ""
                      }`}
                    />
                  </span>
                  <span className="font-furore text-sm leading-snug text-white uppercase">
                    ПУНКТУАЛЬНОСТЬ И АККУРАТНОСТЬ МАСТЕРОВ
                  </span>
                </li>
                <li className="flex items-center gap-4 text-left">
                  <span className="icon-container">
                    <Image
                      src={asset("/images/icons/molotok.png")}
                      alt="Инструмент"
                      width={32}
                      height={32}
                      className={`icon-hammer${
                        activeBounceIndex === 2 ? " bounce-check" : ""
                      }`}
                    />
                  </span>
                  <span className="font-furore text-sm leading-snug text-white uppercase">
                    ИСПОЛЬЗОВАНИЕ ПРОФЕССИОНАЛЬНОГО ИНСТРУМЕНТА
                  </span>
                </li>
                <li className="flex items-center gap-4 text-left">
                  <span className="icon-container">
                    <Image
                      src={asset("/images/icons/lupa.png")}
                      alt="Прозрачные цены"
                      width={32}
                      height={32}
                      className={`icon-ruble${
                        activeBounceIndex === 3 ? " bounce-check" : ""
                      }`}
                    />
                  </span>
                  <span className="font-furore text-sm leading-snug text-white uppercase">
                    КОНКУРЕНТНЫЕ И ПРОЗРАЧНЫЕ ЦЕНЫ
                  </span>
                </li>
              </ul>
            </motion.div>

            {}
            <motion.div variants={blockVariants} className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  variant="outline"
                  className="h-12 flex-1 rounded-3xl border-accent/60 text-base font-semibold uppercase tracking-wide text-accent hover:bg-accent/10"
                >
                  <a href="#order-form">Оставить заявку</a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-12 flex-1 rounded-3xl border-accent/60 text-base font-semibold uppercase tracking-wide text-accent hover:bg-accent/10"
                >
                  <a href={activeRegion.mobileHref || activeRegion.phoneHref}>
                    Позвонить мастеру
                  </a>
                </Button>
              </div>

              {}
              <div className="flex flex-col gap-2 text-sm text-[#b4a8cc]">
                <div className="flex items-center justify-center gap-2">
                  Работаем ежедневно с 10:00 до 22:00
                </div>
                <div className="text-center">
                  Выезжаем по всему {activeRegion.name} и Ленинградской области.
                </div>
              </div>
            </motion.div>
          </motion.div>

          {}
        </div>
      </section>
      <style jsx global>{`
        @keyframes bounceCheck {
          0%,
          100% {
            transform: translateY(0);
          }
          20% {
            transform: translateY(-10px);
          }
          40% {
            transform: translateY(0);
          }
        }
        .bounce-check {
          animation: bounceCheck 1.2s;
          display: inline-block;
        }
        .icon-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 48px;
          max-width: 48px;
          height: 48px;
        }
      `}</style>
    </>
  );
};
