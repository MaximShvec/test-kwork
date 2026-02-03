'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Maximize2, Minimize2, Volume2, VolumeX, Pause, Play } from 'lucide-react';
import CustomCursor from '@/components/ui/custom-cursor';
import Image from 'next/image';
import { FlippableCreditCard } from '@/components/ui/credit-debit-card';
import { FloatingVolumeButton } from '@/components/ui/floating-volume-button';
import { useResponsive } from '@/contexts/ResponsiveContext';
import { asset } from '@/lib/basePath';

export const FrameAnimation: React.FC = () => {
  return <div className="frame-animation-container" aria-hidden="true" />;
};

const BUTTON_WIDTH = 320;
const BUTTON_HEIGHT = 80;
const ESCAPE_DISTANCE = 400;
const MOVE_STEP = 200;
const NEAR_DECREMENT = 1;

const clamp = (val: number, min: number, max: number) =>
  Math.max(min, Math.min(max, val));

interface AnimatedDiscountButtonProps {
  onTipClick?: (buttonPos: { x: number; y: number }) => void;
  tipMessage?: string;
}

const AnimatedDiscountButton: React.FC<AnimatedDiscountButtonProps> = ({
  onTipClick,
  tipMessage,
}) => {
  const [discount, setDiscount] = useState(100);
  const [isTip, setIsTip] = useState(false);

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  const positionRef = useRef({ x: 0, y: 0 });
  const containerSizeRef = useRef({ width: 0, height: 0 });
  const mousePos = useRef({ x: -9999, y: -9999 });
  const rafId = useRef<number>(0);
  const isInitialized = useRef(false);

  const updateButtonPosition = useCallback((x: number, y: number) => {
    if (buttonRef.current) {
      buttonRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      positionRef.current = { x, y };
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    containerSizeRef.current = { width: rect.width, height: rect.height };
    
    const initialX = rect.width / 2 - BUTTON_WIDTH / 2;
    updateButtonPosition(initialX, 0);
    isInitialized.current = true;
  }, [updateButtonPosition]);

  useEffect(() => {
    if (discount === 0 && !isTip) {
      setIsTip(true);
    }
  }, [discount, isTip]);

  useEffect(() => {
    if (!isTip || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2 - BUTTON_WIDTH / 2;
    updateButtonPosition(centerX, 0);
  }, [isTip, updateButtonPosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!containerRef.current || !isInitialized.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    mousePos.current = { x: mouseX, y: mouseY };

    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    rafId.current = requestAnimationFrame(() => {
      const pos = positionRef.current;
      const size = containerSizeRef.current;

      if (isTip) {
        const newX = clamp(mouseX - BUTTON_WIDTH / 2, 0, size.width - BUTTON_WIDTH);
        const newY = clamp(mouseY - BUTTON_HEIGHT / 2, 0, size.height - BUTTON_HEIGHT);
        updateButtonPosition(newX, newY);
        return;
      }

      const btnCenterX = pos.x + BUTTON_WIDTH / 2;
      const btnCenterY = pos.y + BUTTON_HEIGHT / 2;
      const dx = mouseX - btnCenterX;
      const dy = mouseY - btnCenterY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < ESCAPE_DISTANCE) {
        setDiscount((d) => Math.max(d - NEAR_DECREMENT, 0));

        const angle = Math.atan2(dy, dx);
        let newX = pos.x - Math.cos(angle) * MOVE_STEP;
        let newY = pos.y - Math.sin(angle) * MOVE_STEP;

        newX = clamp(newX, 0, size.width - BUTTON_WIDTH);
        newY = clamp(newY, 0, size.height - BUTTON_HEIGHT);

        updateButtonPosition(newX, newY);
      }
    });
  }, [isTip, updateButtonPosition]);

  useEffect(() => {
    if (isTip) return;

    const interval = setInterval(() => {
      if (!containerRef.current) return;

      const pos = positionRef.current;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2 - BUTTON_WIDTH / 2;

      const btnCenterX = pos.x + BUTTON_WIDTH / 2;
      const btnCenterY = pos.y + BUTTON_HEIGHT / 2;
      const dx = mousePos.current.x - btnCenterX;
      const dy = mousePos.current.y - btnCenterY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 400 && (Math.abs(pos.x - centerX) > 1 || Math.abs(pos.y) > 1)) {
        updateButtonPosition(centerX, 0);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isTip, updateButtonPosition]);

  useEffect(() => {
    if (!isTip) return;

    const handleWindowMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }

      rafId.current = requestAnimationFrame(() => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const newX = clamp(mouseX - BUTTON_WIDTH / 2, 0, rect.width - BUTTON_WIDTH);
        const newY = clamp(mouseY - BUTTON_HEIGHT / 2, 0, rect.height - BUTTON_HEIGHT);

        updateButtonPosition(newX, newY);
      });
    };

    window.addEventListener('mousemove', handleWindowMove);
    return () => {
      window.removeEventListener('mousemove', handleWindowMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isTip, updateButtonPosition]);

  const handleClick = useCallback(() => {
    if (!isTip || !onTipClick || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const screenX = rect.left + rect.width / 2;
    const screenY = rect.top + rect.height / 2;
    
    console.log('🎯 Button click position:', { screenX, screenY, rect });
    
    onTipClick({
      x: screenX,
      y: screenY,
    });
  }, [isTip, onTipClick]);

  return (
    <div
      ref={containerRef}
      className="animated-discount-button-container"
      onMouseMove={handleMouseMove}
    >
      <button
        ref={buttonRef}
        className={`animated-discount-button ${isTip ? 'tip-mode' : 'locked-mode'}`}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: BUTTON_WIDTH,
          height: BUTTON_HEIGHT,
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)',
        }}
        onClick={handleClick}
        disabled={!isTip}
      >
        <div className="animated-discount-button-inner">
          {!isTip ? (
            <span className="discount-text">
              Поймай СКИДКУ
              <span className="discount-value"> -{discount}%</span>
            </span>
          ) : (
            <span className="tip-text">
              {tipMessage || 'Оставить чаевые'}
            </span>
          )}
        </div>
      </button>
    </div>
  );
};


const ChasingCreditCard: React.FC<{
  onComplete: () => void;
  onMessageChange: (message: string) => void;
  buttonPosition?: { x: number; y: number };
}> = ({ onComplete, onMessageChange, buttonPosition }) => {
  const CARD_WIDTH = 512;
  const CARD_HEIGHT = 320;

  console.log('💳 ChasingCreditCard received buttonPosition:', buttonPosition);

  const mousePos = useRef<{ x: number; y: number }>({
    x: buttonPosition ? buttonPosition.x : typeof window !== 'undefined' ? window.innerWidth / 2 : 800,
    y: buttonPosition ? buttonPosition.y : typeof window !== 'undefined' ? window.innerHeight / 2 : 300,
  });

  const initialX =
    buttonPosition ? buttonPosition.x - CARD_WIDTH / 2 : typeof window !== 'undefined' ? window.innerWidth / 2 - CARD_WIDTH / 2 : 800;
  const initialY =
    buttonPosition ? buttonPosition.y - CARD_HEIGHT / 2 : typeof window !== 'undefined' ? window.innerHeight / 2 - CARD_HEIGHT / 2 : 300;

  console.log('💳 Card initial position:', { initialX, initialY, CARD_WIDTH, CARD_HEIGHT });

  const [cardPosition, setCardPosition] = useState<{ x: number; y: number }>({ x: initialX, y: initialY });
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [hasArrived, setHasArrived] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isFlyingIn, setIsFlyingIn] = useState<boolean>(true);
  const [canChase, setCanChase] = useState<boolean>(false);
  const startTime = useRef<number>(Date.now());
  const CHASE_DURATION = 5000;

  useEffect(() => {
    onMessageChange('Введите данные карты');
    const flyTimer = setTimeout(() => {
      setIsFlyingIn(false);
    }, 800);
    const chaseTimer = setTimeout(() => {
      setCanChase(true);
    }, 1600);
    return () => {
      clearTimeout(flyTimer);
      clearTimeout(chaseTimer);
    };
  }, [onMessageChange]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (isClicked || isExiting || isFlyingIn || !canChase) return;

    const interval = setInterval(() => {
      setCardPosition((prev) => {
        const targetX = mousePos.current.x - CARD_WIDTH / 2;
        const targetY = mousePos.current.y - CARD_HEIGHT / 2;

        const dx = targetX - prev.x;
        const dy = targetY - prev.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (!hasArrived && distance > 50) {
          const speed = 0.15;
          return {
            x: prev.x + dx * speed,
            y: prev.y + dy * speed,
          };
        } else {
          if (!hasArrived) {
            setHasArrived(true);
          }
          const elapsed = Date.now() - startTime.current;
          if (elapsed >= CHASE_DURATION) {
            onMessageChange('Благодарим вас');
            setIsExiting(true);
            setTimeout(() => {
              onComplete();
            }, 1000);
            return prev;
          }
          const speed = 0.03;
          return {
            x: prev.x + dx * speed,
            y: prev.y + dy * speed,
          };
        }
      });
    }, 16);

    return () => clearInterval(interval);
  }, [isClicked, isExiting, hasArrived, isFlyingIn, canChase, onComplete, onMessageChange]);

  useEffect(() => {
    if (!isExiting) return;
    const flyAwayInterval = setInterval(() => {
      setCardPosition((prev) => ({
        x: prev.x + 50,
        y: prev.y - 50,
      }));
    }, 16);
    return () => clearInterval(flyAwayInterval);
  }, [isExiting]);

  const handleCardClick = () => {
    if (isClicked) return;
    setIsClicked(true);
    onMessageChange('Благодарим вас');
    setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onComplete();
      }, 1000);
    }, 2000);
  };

  return (
    <>
      <motion.div
        className="chasing-credit-card-wrapper"
        style={{
          position: 'fixed',
          left: cardPosition.x,
          top: cardPosition.y,
          pointerEvents: 'none',
          zIndex: 9999,
        }}
        initial={{
          opacity: 0,
          scale: 0.1,
          rotate: -180,
        }}
        animate={{
          opacity: isExiting ? 0 : 1,
          scale: isExiting ? 0.5 : isHovered ? 1.08 : 1,
          rotate: isExiting ? 180 : 0,
        }}
        transition={{
          opacity: { duration: 0.6 },
          scale: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] },
          rotate: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] },
        }}
      >
        <div
          style={{ pointerEvents: isExiting ? 'none' : 'auto' }}
          onClick={handleCardClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          data-interactive="true"
          role="button"
        >
          <FlippableCreditCard className="scale-[2]" isFlipped={isClicked} frontMessage="Введите данные карты" backMessage="Спасибо :)" showBorder={isHovered} />
        </div>
      </motion.div>
    </>
  );
};


const VIDEO_CONFIG = {
  desktop: {
    src: '/videos/background.mp4',
    className: 'ipad-video',
    volume: 0.5,
  },
  mobile: {
    src: '/videos/background.mp4',
    volume: 0.3,
  },
};


export const Hero: React.FC<{ startHeroAnimations?: boolean }> = ({ startHeroAnimations = false }) => {
  const { isMobile } = useResponsive();
  const [showWelcomeElements, setShowWelcomeElements] = useState<boolean>(false);
  const [showCard, setShowCard] = useState<boolean>(false);
  const [buttonMessage, setButtonMessage] = useState<string>('Оставить чаевые');
  const [cardStartPosition, setCardStartPosition] = useState<{ x: number; y: number } | null>(null);
  const [hideButton, setHideButton] = useState<boolean>(false);

  const [loadingDone, setLoadingDone] = useState<boolean>(() => {
    if (startHeroAnimations) {
      return true;
    }
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('loadingScreenComplete') === 'true';
    }
    return false;
  });

  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isVideoActuallyPlaying, setIsVideoActuallyPlaying] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const [showControls, setShowControls] = useState<boolean>(false);
  const controlsHideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const innerParallaxRef = useRef<HTMLDivElement | null>(null);
  const parallaxRaf = useRef<number | null>(null);
  const lastCoords = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const [activeBounceIndex, setActiveBounceIndex] = useState<number>(0);
  const [ipadAnimationDone, setIpadAnimationDone] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const smoothTiltX = useSpring(tiltX, { stiffness: 140, damping: 30 });
  const smoothTiltY = useSpring(tiltY, { stiffness: 140, damping: 30 });
  const inverseSmoothTiltY = useTransform(smoothTiltY, (v) => -v);

  const bodyX = useMotionValue(0);
  const bodyY = useMotionValue(0);
  const smoothBodyX = useSpring(bodyX, { stiffness: 120, damping: 18 });
  const smoothBodyY = useSpring(bodyY, { stiffness: 120, damping: 18 });

  const bodyTiltX = useMotionValue(0);
  const bodyTiltY = useMotionValue(0);
  const smoothBodyTiltX = useSpring(bodyTiltX, { stiffness: 150, damping: 20 });
  const smoothBodyTiltY = useSpring(bodyTiltY, { stiffness: 150, damping: 20 });

  const listX = useMotionValue(0);
  const listY = useMotionValue(0);
  const smoothListX = useSpring(listX, { stiffness: 120, damping: 18 });
  const smoothListY = useSpring(listY, { stiffness: 120, damping: 18 });

  const listTiltX = useMotionValue(0);
  const listTiltY = useMotionValue(0);
  const smoothListTiltX = useSpring(listTiltX, { stiffness: 150, damping: 20 });
  const smoothListTiltY = useSpring(listTiltY, { stiffness: 150, damping: 20 });

  const heroInViewRef = useRef<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      heroInViewRef.current = true;
      return;
    }
    if (!heroRef.current || !('IntersectionObserver' in window)) {
      heroInViewRef.current = true;
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        heroInViewRef.current = entry.isIntersecting;
      },
      {
        root: null,
        threshold: 0,
        rootMargin: '200px',
      }
    );

    observer.observe(heroRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleLoadingComplete = () => {
      setLoadingDone(true);
    };

    if (typeof window !== 'undefined') {
      if (sessionStorage.getItem('loadingScreenComplete') === 'true') {
        setLoadingDone(true);
      } else {
        window.addEventListener('loadingScreenComplete', handleLoadingComplete);
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('loadingScreenComplete', handleLoadingComplete);
      }
    };
  }, []);

  useEffect(() => {
    if (startHeroAnimations && !loadingDone) {
      setLoadingDone(true);
    }
  }, [startHeroAnimations, loadingDone]);

  useEffect(() => {
    if (loadingDone) {
      const timer = setTimeout(() => {
        setShowWelcomeElements(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [loadingDone]);

  useEffect(() => {
    const bounceCount = 4;
    const interval = setInterval(() => {
      setActiveBounceIndex((prev) => (prev + 1) % bounceCount);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = isMuted;
    videoRef.current.volume = isMobile ? VIDEO_CONFIG.mobile.volume : VIDEO_CONFIG.desktop.volume;
    if (isPlaying) {
      videoRef.current.play().catch(() => {
      });
    } else {
      try {
        videoRef.current.pause();
      } catch {
      }
    }
  }, [isMuted, isPlaying, isMobile]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const handleLoadedMetadata = () => {
    };
    const handlePlay = () => setIsVideoActuallyPlaying(true);
    const handlePause = () => setIsVideoActuallyPlaying(false);

    v.addEventListener('loadedmetadata', handleLoadedMetadata);
    v.addEventListener('play', handlePlay);
    v.addEventListener('pause', handlePause);

    return () => {
      v.removeEventListener('loadedmetadata', handleLoadedMetadata);
      v.removeEventListener('play', handlePlay);
      v.removeEventListener('pause', handlePause);
    };
  }, [isMobile]);

  useEffect(() => {
    if (ipadAnimationDone && loadingDone && videoRef.current && isMuted) {
      const timer = setTimeout(() => {
        videoRef.current?.play().catch(() => {
        });
        setIsPlaying(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [ipadAnimationDone, loadingDone, isMuted]);

  const handlePlayPause = useCallback(
    (e?: React.MouseEvent) => {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      if (!videoRef.current) return;
      try {
        if (isPlaying) {
          videoRef.current.pause();
          setIsPlaying(false);
        } else {
          videoRef.current
            .play()
            .then(() => {
              setIsPlaying(true);
            })
            .catch(() => {
              setIsPlaying(false);
            });
        }
      } catch (error) {
        console.error('Ошибка управления видео:', error);
      }
    },
    [isPlaying]
  );

  const handleVideoClick = useCallback(() => {
    handlePlayPause();
  }, [handlePlayPause]);

  const handleMute = useCallback(
    (e?: React.MouseEvent) => {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      if (!videoRef.current) return;
      try {
        const newMutedState = !isMuted;
        videoRef.current.muted = newMutedState;
        videoRef.current.volume = isMobile ? VIDEO_CONFIG.mobile.volume : VIDEO_CONFIG.desktop.volume;
        setIsMuted(newMutedState);
      } catch (error) {
        console.error('Ошибка управления звуком:', error);
      }
    },
    [isMuted, isMobile]
  );

  const handleFullscreen = useCallback(
    (e?: React.MouseEvent) => {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      try {
        const elem = wrapperRef.current ?? videoRef.current;
        if (elem) {
          if (!document.fullscreenElement) {
            if ((elem as any).requestFullscreen) {
              (elem as any).requestFullscreen();
            } else if ((elem as any).webkitRequestFullscreen) {
              (elem as any).webkitRequestFullscreen();
            }
          } else {
            document.exitFullscreen();
          }
        }
      } catch (error) {
        console.error('Ошибка управления полноэкранным режимом:', error);
      }
    },
    []
  );

  const intensity = 12;
  const handleIpadPointerMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!ipadAnimationDone || isFullscreen) return;
      const rect = wrapperRef.current?.getBoundingClientRect();
      if (!rect) return;
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      lastCoords.current = { x: nx * intensity, y: ny * intensity };
      if (parallaxRaf.current === null) {
        parallaxRaf.current = requestAnimationFrame(() => {
          if (wrapperRef.current) {
            const { x, y } = lastCoords.current;
            wrapperRef.current.style.setProperty('--ipad-translate-x', `${x}px`);
            wrapperRef.current.style.setProperty('--ipad-translate-y', `${y}px`);
          }
          parallaxRaf.current = null;
        });
      }
    },
    [ipadAnimationDone, isFullscreen]
  );

  const resetIpadParallax = useCallback(() => {
    if (wrapperRef.current) {
      wrapperRef.current.style.setProperty('--ipad-translate-x', `0px`);
      wrapperRef.current.style.setProperty('--ipad-translate-y', `0px`);
    }
  }, []);

  const handleIpadPointerEnter = useCallback(() => {
    if (wrapperRef.current) {
      wrapperRef.current.style.transition = 'transform 0.35s cubic-bezier(.4,2,.6,1)';
    }
  }, []);

  const handleIpadPointerLeave = useCallback(() => {
    if (wrapperRef.current) {
      wrapperRef.current.style.transition = 'transform 0.35s cubic-bezier(.4,2,.6,1)';
      resetIpadParallax();
    }
    lastCoords.current = { x: 0, y: 0 };
  }, [resetIpadParallax]);

  useEffect(() => {
    if (ipadAnimationDone) {
      setIsHovering(false);
    }
  }, [ipadAnimationDone]);

  const hoverOscillate = (amp: number): import('framer-motion').Variants => ({
    hover: {
      x: [-amp, amp],
      transition: { duration: 0.6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
    },
  });

  const containerVariants: import('framer-motion').Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.25,
      },
    },
  };

  const blockVariants: import('framer-motion').Variants = {
    hidden: { x: '100vw', opacity: 0 },
    show: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: [0.8, 0, 0.2, 1] },
    },
  };

  const resetHeroMotion = () => {
    tiltX.set(0);
    tiltY.set(0);
    bodyX.set(0);
    bodyY.set(0);
    bodyTiltX.set(0);
    bodyTiltY.set(0);
    listX.set(0);
    listY.set(0);
    listTiltX.set(0);
    listTiltY.set(0);
  };

  const handleHeroMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      const rect = heroRef.current?.getBoundingClientRect();
      if (!rect) return;
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      const amp = 25;
      tiltX.set(ny * amp);
      tiltY.set(-nx * amp);

      const ampT = 12;
      bodyX.set(nx * ampT);
      bodyY.set(ny * ampT);

      const ampTiltBody = 10;
      bodyTiltX.set(ny * ampTiltBody);
      bodyTiltY.set(-nx * ampTiltBody);

      const ampTList = 14;
      listX.set(nx * ampTList);
      listY.set(ny * ampTList);

      const ampTiltList = 12;
      listTiltX.set(ny * ampTiltList);
      listTiltY.set(-nx * ampTiltList);
    },
    [bodyX, bodyY, bodyTiltX, bodyTiltY, listX, listY, listTiltX, listTiltY, tiltX, tiltY]
  );

  return (
    <>
      <section
        id="hero"
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={resetHeroMotion}
        className="video-hero"
      >
        <div className="hero-scale-layer">
          <div
            ref={wrapperRef}
            className={`ipad-video-wrapper${ipadAnimationDone && isHovering ? ' shadow-active' : ''}`}
            style={{ pointerEvents: 'none' }} // убираем события с wrapper
          >
            <motion.div
              ref={innerParallaxRef}
              initial={{ x: '-100vw' }}
              animate={loadingDone ? { x: 0 } : { x: '-100vw' }}
              transition={{ duration: 0.7, ease: [0.8, 0, 0.2, 1] }}
              className="ipad-inner"
              onAnimationComplete={() => setIpadAnimationDone(true)}
            >
              {!isFullscreen && (
                <>
                  <Image
                    src={asset("/images/textures/ipad.PNG")}
                    alt="iPad"
                    className="ipad-frame"
                    width={1200}
                    height={900}
                    priority
                    style={{ pointerEvents: 'none', display: 'block', width: '100%', height: '100%' }}
                  />
                  <Image
                    src={asset("/images/textures/konturipad.svg")}
                    alt="Контур iPad"
                    className="ipad-contour"
                    width={1200}
                    height={900}
                    priority
                    style={{ pointerEvents: 'none', display: 'block', width: '100%', height: '100%' }}
                  />
                </>
              )}

              <div 
                className="ipad-screen" 
                role="region" 
                aria-label="Видео iPad"
                onMouseEnter={() => {
                  handleIpadPointerEnter();
                  setIsHovering(true);
                  setShowControls(true);
                }}
                onMouseMove={ipadAnimationDone ? handleIpadPointerMove : undefined}
                onMouseLeave={() => {
                  handleIpadPointerLeave();
                  setIsHovering(false);
                  setShowControls(false);
                  resetIpadParallax();
                }}
              >
                <video
                  ref={videoRef}
                  loop
                  muted={isMuted}
                  playsInline
                  className="ipad-video"
                  onClick={handleVideoClick}
                  onPlay={() => {
                    setIsVideoActuallyPlaying(true);
                  }}
                  onPause={() => setIsVideoActuallyPlaying(false)}
                >
                  <source src={VIDEO_CONFIG.desktop.src} type="video/mp4" />
                  Ваш браузер не поддерживает тег видео.
                </video>

                <div className={`ipad-controls ${showControls ? 'visible' : ''}`} aria-hidden={!showControls}>
                  <button
                    type="button"
                    className="video-control-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayPause(e);
                    }}
                    aria-label={isPlaying ? 'Пауза' : 'Воспроизвести'}
                  >
                    {isPlaying ? <Pause /> : <Play />}
                  </button>

                  <button
                    type="button"
                    className="video-control-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMute(e);
                    }}
                    aria-label={isMuted ? 'Включить звук' : 'Отключить звук'}
                  >
                    {isMuted ? <VolumeX /> : <Volume2 />}
                  </button>

                  <button
                    type="button"
                    className="video-control-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFullscreen(e);
                    }}
                    aria-label={isFullscreen ? 'Выйти из полноэкранного режима' : 'Полный экран'}
                  >
                    {isFullscreen ? <Minimize2 /> : <Maximize2 />}
                  </button>
                </div>

                {isFullscreen && <CustomCursor />}
              </div>
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {loadingDone && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="hero-side-content"
            >
              <motion.div variants={blockVariants}>
                <div className="flex items-center mb-12 hero-heading-wrapper">
                  <motion.div className="frame-animation-wrapper" animate={{ y: [0, -24, 0, 24, 0], x: [0, 14, 0, -14, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}>
                    <FrameAnimation />
                  </motion.div>
                  <motion.div animate={{ y: [0, -24, 0, 24, 0], x: [0, 14, 0, -14, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}>
                    <motion.h2
                      whileHover={{
                        x: 8,
                        scale: 1.05,
                        transition: {
                          type: 'spring',
                          stiffness: 60,
                          damping: 12,
                          repeat: Infinity,
                          repeatType: 'mirror',
                        },
                      }}
                      className="text-adaptive-hero-xl font-bold text-accent font-furore uppercase leading-tight cursor-pointer text-center"
                      style={{ transformStyle: 'preserve-3d', rotateX: smoothTiltX, rotateY: inverseSmoothTiltY }}
                    >
                      ПОЧЕМУ
                      <br />
                      ВЫБИРАЮТ
                      <br />
                      НАС
                    </motion.h2>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div variants={blockVariants}>
                <motion.div animate={{ y: [0, -12, 0, 12, 0], x: [0, 8, 0, -8, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 1 }} style={{ perspective: '800px' }}>
                  <motion.p
                    variants={hoverOscillate(10)}
                    whileHover="hover"
                    className="text-2xl md:text-3xl mb-8 font-furore"
                    style={{
                      color: '#888888',
                      x: smoothBodyX,
                      y: smoothBodyY,
                      rotateX: smoothBodyTiltX,
                      rotateY: smoothBodyTiltY,
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    МЫ - КОМАНДА ОПЫТНЫХ МАСТЕРОВ, УВЛЕЧЁННЫХ СВОИМ ДЕЛОМ. СБОРКА МЕБЕЛИ ДЛЯ НАС НЕ ПРОСТО РАБОТА, А
                    ИСКУССТВО СОЗДАНИЯ УЮТА И ФУНКЦИОНАЛЬНОСТИ В ВАШЕМ ДОМЕ. МЫ ЦЕНИМ ВАШЕ ВРЕМЯ И ДОВЕРИЕ.
                  </motion.p>
                </motion.div>
              </motion.div>

              <motion.div variants={blockVariants}>
                <motion.div animate={{ y: [0, -10, 0, 10, 0], x: [0, -8, 0, 8, 0] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 1 }} style={{ perspective: '800px' }}>
                  <motion.ul className="text-left mb-8 space-y-4 right-side-features" variants={hoverOscillate(12)} whileHover="hover" style={{ x: smoothListX, y: smoothListY, rotateX: smoothListTiltX, rotateY: smoothListTiltY, transformStyle: 'preserve-3d' }}>
                    <li className="flex items-center gap-4 text-white font-furore text-2xl md:text-3xl">
                      <span className="icon-container">
                        <Image src={asset("/images/icons/guarantee.png")} alt="Гарантия" className={`icon-shield${activeBounceIndex === 0 ? ' bounce-check' : ''}`} width={48} height={48} loading="lazy" />
                      </span>
                      ГАРАНТИЯ КАЧЕСТВА НА ВСЕ ВИДЫ РАБОТ
                    </li>
                    <li className="flex items-center gap-4 text-white font-furore text-2xl md:text-3xl">
                      <span className="icon-container">
                        <Image src={asset("/images/icons/alarm-clock.png")} alt="Пунктуальность" className={`icon-alarm${activeBounceIndex === 1 ? ' bounce-check' : ''}`} width={48} height={48} loading="lazy" />
                      </span>
                      ПУНКТУАЛЬНОСТЬ И АККУРАТНОСТЬ МАСТЕРОВ
                    </li>
                    <li className="flex items-center gap-4 text-white font-furore text-2xl md:text-3xl">
                      <span className="icon-container">
                        <Image src={asset("/images/icons/molotok.png")} alt="Инструмент" className={`icon-hammer${activeBounceIndex === 2 ? ' bounce-check' : ''}`} width={48} height={48} loading="lazy" />
                      </span>
                      ИСПОЛЬЗОВАНИЕ ПРОФЕССИОНАЛЬНОГО ИНСТРУМЕНТА
                    </li>
                    <li className="flex items-center gap-4 text-white font-furore text-2xl md:text-3xl">
                      <span className="icon-container">
                        <Image src={asset("/images/icons/lupa.png")} alt="Цены" className={`icon-ruble${activeBounceIndex === 3 ? ' bounce-check' : ''}`} width={48} height={48} loading="lazy" />
                      </span>
                      КОНКУРЕНТНЫЕ И ПРОЗРАЧНЫЕ ЦЕНЫ
                    </li>
                  </motion.ul>
                </motion.div>
              </motion.div>

              {!hideButton && !showCard && (
                <motion.div variants={blockVariants}>
                  <AnimatedDiscountButton
                    onTipClick={(buttonPos) => {
                      console.log('🎯 Hero received buttonPos:', buttonPos);
                      setCardStartPosition(buttonPos);
                      setShowCard(true);
                    }}
                    tipMessage={buttonMessage}
                  />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {showCard && (
        <ChasingCreditCard
          onComplete={() => {
            setShowCard(false);
            setHideButton(true);
          }}
          onMessageChange={setButtonMessage}
          buttonPosition={cardStartPosition || undefined}
        />
      )}

      <FloatingVolumeButton
        isMuted={isMuted}
        onToggle={() => {
          if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(!!videoRef.current.muted);
          }
        }}
      />
    </>
  );
};

export default Hero;
