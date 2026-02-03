"use client";
import { useEffect, useState, useRef } from "react";
import { useRegion } from "@/contexts/RegionContext";

const frameImages = [
  "/loading/IMG_6085.webp",
  "/loading/IMG_6086.webp",
  "/loading/IMG_6087.webp",
  "/loading/IMG_6088.webp",
  "/loading/IMG_6089.webp",
  "/loading/IMG_6091.webp",
  "/loading/IMG_6092.webp",
  "/loading/IMG_6094.webp",
  "/loading/IMG_6095.webp",
  "/loading/IMG_6096.webp",
  "/loading/IMG_6097.webp",
  "/loading/IMG_6098.webp",
];

const MobileFrameAnimation: React.FC = () => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'reverse'>('forward');
  const [isPaused, setIsPaused] = useState(false);
  const lastFrameIndex = frameImages.length - 1;
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const [firstImageLoaded, setFirstImageLoaded] = useState(false);

  useEffect(() => {
    frameImages.forEach((src, index) => {
      const img = new window.Image();
      img.onload = () => {
        setLoadedImages(prev => ({ ...prev, [index]: true }));
        if (index === 0) setFirstImageLoaded(true);
      };
      img.src = src;
    });
  }, []);
  
  useEffect(() => {
    if (!firstImageLoaded) return;

    const frameInterval = setInterval(() => {
      if (isPaused) return;
      
      let nextFrame = currentFrame;
      
      if (direction === 'forward') {
        if (currentFrame === lastFrameIndex) {
          setIsPaused(true);
          setTimeout(() => {
            setDirection('reverse');
            setIsPaused(false);
          }, 1000);
          nextFrame = currentFrame;
        } else {
          nextFrame = currentFrame + 1;
        }
      } else {
        if (currentFrame === 0) {
          setDirection('forward');
          nextFrame = 1;
        } else {
          nextFrame = currentFrame - 1;
        }
      }
      
      if (loadedImages[nextFrame]) {
        setCurrentFrame(nextFrame);
      }
    }, 100);
    
    return () => clearInterval(frameInterval);
  }, [currentFrame, direction, isPaused, firstImageLoaded, loadedImages, lastFrameIndex]);
  
  if (!firstImageLoaded) {
    return <div style={{ width: '200px', height: '200px' }} />;
  }
  
  return (
    <div style={{ width: "200px", height: "200px", position: "relative" }}>
      {frameImages.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Frame ${index + 1}`}
          style={{
            width: "200px",
            height: "200px",
            objectFit: "contain",
            position: "absolute",
            top: 0,
            left: 0,
            opacity: index === currentFrame ? 1 : 0,
            zIndex: index === currentFrame ? 2 : 1,
            display: loadedImages[index] ? "block" : "none"
          }}
        />
      ))}
    </div>
  );
};

export const MobileLoadingBar: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [dotCount, setDotCount] = useState(0);
  const [loadingStartTime] = useState(Date.now());
  const loadingScreenDoneRef = useRef(false);
  const loadingDurationMs = 3000;

  const { activeKey, setActiveRegion } = useRegion();
  
  const shelfLetters = ['S', 'H', 'E', 'L', 'F'];
  const [animatedLetters, setAnimatedLetters] = useState<boolean[]>(Array(5).fill(false));
  const [glowingLetters, setGlowingLetters] = useState<boolean[]>(Array(5).fill(false));

  const baseLoadingTexts = [
    'Ищем шестигранник под диваном',
    'Проверяем уровень',
    'Затачиваем отвертки',
    'Читаем инструкцию',
    'Считаем винтики',
  ];

  useEffect(() => {
    shelfLetters.forEach((_, index) => {
      setTimeout(() => {
        setAnimatedLetters(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
        
        setTimeout(() => {
          setGlowingLetters(prev => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
          
          setTimeout(() => {
            setGlowingLetters(prev => {
              const newState = [...prev];
              newState[index] = false;
              return newState;
            });
          }, 400);
        }, 200);
      }, index * 100);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount(prev => (prev + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 95) return;
    
    const finalTextInterval = setInterval(() => {
      setCurrentTextIndex(Math.floor(Math.random() * baseLoadingTexts.length));
    }, 1200);
    
    return () => clearInterval(finalTextInterval);
  }, [progress, baseLoadingTexts.length]);

  useEffect(() => {
    if (!visible) return;
    
    const startTime = Date.now();
    const targetProgress = 95;
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progressPercent = Math.min((elapsed / loadingDurationMs) * targetProgress, targetProgress);
      setProgress(progressPercent);
      
      if (progressPercent < targetProgress) {
        requestAnimationFrame(updateProgress);
      }
    };
    
    requestAnimationFrame(updateProgress);
  }, [visible, loadingDurationMs]);

  useEffect(() => {
    const finishLoading = () => {
      if (loadingScreenDoneRef.current) return;
      
      const elapsedTime = Date.now() - loadingStartTime;
      const remainingTime = Math.max(0, loadingDurationMs - elapsedTime);
      
      setTimeout(() => {
        setProgress(100);
        setTimeout(() => setVisible(false), 200);
        const cssTransitionDuration = 500;
        setTimeout(() => {
          if (!loadingScreenDoneRef.current) {
            document.body.classList.add('loading-complete');
            window.dispatchEvent(new CustomEvent('loadingScreenComplete'));
            sessionStorage.setItem('loadingScreenComplete', 'true');
            loadingScreenDoneRef.current = true;
          }
        }, cssTransitionDuration + 200);
      }, remainingTime);
    };

    finishLoading();
  }, [loadingDurationMs, loadingStartTime]);

  if (!visible && loadingScreenDoneRef.current) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "hsl(var(--background))",
        zIndex: 200000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--main-font)",
        color: "hsl(var(--foreground))",
        opacity: visible ? 1 : 0,
        visibility: visible ? 'visible' : 'hidden',
        transition: "opacity 0.5s ease-out, visibility 0.5s ease-out",
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      {}
      <div style={{ marginBottom: '16px', fontSize: '3rem', fontWeight: 'bold', textAlign: 'center', letterSpacing: '0.1em' }}>
        {shelfLetters.map((letter, index) => (
          <span
            key={index}
            style={{
              display: 'inline-block',
              opacity: animatedLetters[index] ? 1 : 0,
              transform: animatedLetters[index] ? 'translateY(0) rotateX(0deg) scale(1)' : 'translateY(20px) rotateX(-45deg) scale(0.8)',
              transition: 'opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55), text-shadow 0.4s ease-out',
              transitionDelay: `${index * 0.1}s`,
              color: 'white',
              textShadow: glowingLetters[index] 
                ? '0 0 10px rgba(255, 255, 255, 0.7), 0 0 20px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 255, 255, 0.3), 0 0 40px rgba(255, 199, 0, 0.3), 0 0 70px rgba(255, 199, 0, 0.2)'
                : 'none'
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      {}
      <div style={{ marginBottom: '32px', pointerEvents: 'none' }}>
        <MobileFrameAnimation />
      </div>

      {}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '24px', minHeight: '80px' }}>
        <p style={{ color: '#ffc700', fontSize: '18px', fontWeight: 'bold', letterSpacing: '0.05em', margin: 0, textAlign: 'center' }}>
          Выберите свой регион
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', width: '100%' }}>
          {[{ key: 'spb', label: 'Санкт-Петербург' }, { key: 'msk', label: 'Москва' }].map(city => (
            <button
              key={city.key}
              onClick={() => {
                setActiveRegion(city.key as any);
                if (typeof window !== 'undefined') {
                  localStorage.setItem('regionSelectedOnLoading', 'true');
                }
              }}
              style={{
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                border: activeKey === city.key ? '2px solid #ffc700' : '2px solid rgba(255, 199, 0, 0.3)',
                background: activeKey === city.key ? '#ffc700' : 'transparent',
                color: activeKey === city.key ? '#000' : '#ffc700',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'var(--main-font)',
              }}
            >
              {city.label}
            </button>
          ))}
        </div>
      </div>

      {}
      <div style={{ width: '80%', maxWidth: '400px', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #ffc700, #FFA500)',
            transition: 'width 0.3s ease-out',
            boxShadow: '0 0 10px rgba(255, 199, 0, 0.5)',
          }}
        />
      </div>

      {}
      <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', textAlign: 'center', margin: 0 }}>
        {baseLoadingTexts[currentTextIndex]}{'.'.repeat(dotCount)}
      </p>
    </div>
  );
};
