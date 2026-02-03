"use client";
import { useEffect, useState, useRef } from "react";
import { useRegion } from "@/contexts/RegionContext";
import RegionSelectionModal from "./RegionSelectionModal";

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

function easeInCubic(t: number): number {
  return t * t * t;
}

const FrameAnimation: React.FC = () => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [activeBuffer, setActiveBuffer] = useState(0); // 0 or 1 to alternate between buffers
  const [direction, setDirection] = useState<'forward' | 'reverse'>('forward');
  const [isPaused, setIsPaused] = useState(false);
  const lastFrameIndex = frameImages.length - 1; // Index of IMG_6098.webp
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const [firstImageLoaded, setFirstImageLoaded] = useState(false);
  const imageRefs = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    imageRefs.current = Array(frameImages.length).fill(null);

    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.width = '0';
    container.style.height = '0';
    container.style.overflow = 'hidden';
    container.style.visibility = 'hidden';
    document.body.appendChild(container);

    frameImages.forEach((src, index) => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => ({
          ...prev,
          [index]: true
        }));

        if (index === 0) {
          setFirstImageLoaded(true);
        }
      };
      img.src = src;
      imageRefs.current[index] = img;
      container.appendChild(img);
    });

    return () => {
      document.body.removeChild(container);
    };
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
      } 

      else {
        if (currentFrame === 0) {
          setDirection('forward');
          nextFrame = 1;
        } else {
          nextFrame = currentFrame - 1;
        }
      }

      if (loadedImages[nextFrame]) {
        setCurrentFrame(nextFrame);
        setActiveBuffer(prev => prev === 0 ? 1 : 0);
      }
    }, 100);
    
    return () => clearInterval(frameInterval);
  }, [currentFrame, direction, isPaused, firstImageLoaded, loadedImages]);

  if (!firstImageLoaded) {
    return (
      <div style={{ width: '336px', height: '336px' }}>
      </div>
    );
  }

  return (
    <div style={{ width: "336px", height: "336px", position: "relative" }}>
      {frameImages.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Animation frame ${index + 1}`}
          style={{
            width: "336px",
            height: "336px",
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

export default function LoadingBar() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [dotCount, setDotCount] = useState(0); // для анимации многоточия
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [isChangingRegion, setIsChangingRegion] = useState(false);
  const [isMouseInWindow, setIsMouseInWindow] = useState(true);

  const [showRegionModal, setShowRegionModal] = useState(false);
  const [regionMessage, setRegionMessage] = useState('Выберите свой регион');
  const [loadingStartTime] = useState(Date.now());
  const loadingScreenDoneRef = useRef(false); // To ensure event fires only once

  const loadingDurationMs = 3000;

  const { activeKey, setActiveRegion } = useRegion();
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const handler = () => {
      console.log('LOADINGBAR: headerAnimated received');
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
    window.addEventListener('headerAnimated', handler);
    return () => window.removeEventListener('headerAnimated', handler);
  }, []);


  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const margin = 50;
      const isNearBorder = x < margin || x > windowWidth - margin || y < margin || y > windowHeight - margin;
      
      setMousePosition({ x, y });
      setIsMouseInWindow(!isNearBorder);
    };

    const handleMouseLeave = () => {
      setIsMouseInWindow(false);
    };

    const handleMouseEnter = () => {
      setIsMouseInWindow(true);
    };

    const handleResize = () => {
      const x = mousePosition.x;
      const y = mousePosition.y;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      const margin = 50;
      const isNearBorder = x < margin || x > windowWidth - margin || y < margin || y > windowHeight - margin;
      setIsMouseInWindow(!isNearBorder);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('resize', handleResize);
    };
  }, [mousePosition]);

  const baseLoadingTexts = [
    "Загружаем инструменты",
    "Ищем потерявшийся шуруп",
    "Разбираемся в инструкции",
    "Спасаем мебель от кривых рук",
    "Убеждаем шкаф не падать",
    "Ищем шестигранник под диваном",
    "Считаем оставшиеся детали",
    "Объясняем дивану, что он должен собраться",
    "Выпрямляем кривые гвозди",
    "Переворачиваем инструкцию ИКЕА",
    "Собираем стол вверх ногами",
    "Придумываем, куда деть лишние детали",
    "Объясняем, что молоток - не отвёртка",
    "Уговариваем шкаф встать ровно",
    "Читаем мантры над комодом",
    "Устанавливаем дверцы с третьей попытки",
  ];

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4); // 0, 1, 2, 3, 0, ...
    }, 300);
    
    return () => clearInterval(dotInterval);
  }, []);

  const getCurrentText = () => {
    const baseText = baseLoadingTexts[currentTextIndex];
    const dots = ".".repeat(dotCount);
    return `${baseText}${dots}`;
  };

  const lettersAppearDelay = 400; // задержка между появлением букв

  const shelfLetters = "SHELF".split('');
  const [animatedLetters, setAnimatedLetters] = useState<string[]>([]);
  const [glowingLetters, setGlowingLetters] = useState<boolean[]>([]);

  useEffect(() => {
    let letterTimeout: NodeJS.Timeout;
    let glowTimeout: NodeJS.Timeout;
    shelfLetters.forEach((letter, index) => {
      letterTimeout = setTimeout(() => {
        setAnimatedLetters(prev => [...prev, letter]);
        setGlowingLetters(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });

        glowTimeout = setTimeout(() => {
          setGlowingLetters(prev => {
            const newState = [...prev];
            newState[index] = false;
            return newState;
          });
        }, 600);
      }, (index + 1) * lettersAppearDelay);
    });
    return () => {
      clearTimeout(letterTimeout);
      clearTimeout(glowTimeout);
    };
  }, [lettersAppearDelay]);

  useEffect(() => {
    const textChangeInterval = 1200; 

    const getRandomTextIndex = () => {
      return Math.floor(Math.random() * baseLoadingTexts.length);
    };

    setCurrentTextIndex(getRandomTextIndex());

    const textInterval = setInterval(() => {
      setCurrentTextIndex(getRandomTextIndex());
    }, textChangeInterval);

    return () => {
      clearInterval(textInterval);
    };
  }, [baseLoadingTexts.length]);

  useEffect(() => {
    if (progress > 90) {
      const finalTextInterval = setInterval(() => {
        setCurrentTextIndex(Math.floor(Math.random() * baseLoadingTexts.length));
      }, 1200);
      
      return () => clearInterval(finalTextInterval);
    }
  }, [progress]);

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
            (window as Window & { loadingScreenCompleted?: boolean }).loadingScreenCompleted = true;
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
    <>
      <div
        style={{
          position: 'fixed',
          left: mousePosition.x - 32,
          top: mousePosition.y - 32,
          width: '64px',
          height: '64px',
          backgroundImage: `url(${isHoveringButton ? '/images/3.cur' : '/images/2.cur'})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          pointerEvents: 'none',
          zIndex: 300001,
          transform: isHoveringButton ? 'rotate(-30deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease-out, opacity 0.2s ease-out',
          filter: isHoveringButton ? 'drop-shadow(0 0 8px #fff) drop-shadow(0 0 16px #fff)' : 'none',
          opacity: (isMouseInWindow && visible) ? 1 : 0,
        }}
      />
      
      {visible && false && (
        <div style={{
          position: 'fixed',
          top: 10,
          left: 10,
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '12px',
          zIndex: 300002,
          fontFamily: 'monospace',
          pointerEvents: 'none',
        }}>
          Hovering: {isHoveringButton ? 'YES' : 'NO'}<br/>
          Mouse: {mousePosition.x}, {mousePosition.y}<br/>
          Cursor: {isHoveringButton ? '3.cur' : '2.cur'}<br/>
          Element under cursor: {document.elementFromPoint(mousePosition.x, mousePosition.y)?.tagName || 'N/A'}
        </div>
      )}
      
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
      <div className="mb-4 text-5xl md:text-7xl font-bold text-accent text-center" style={{ letterSpacing: '0.1em' }}>
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
      <div className="mb-8" style={{ pointerEvents: 'none' }}>
        <FrameAnimation />
      </div>

      {}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: 12, 
        marginBottom: 24, 
        minHeight: '80px',
        position: 'relative',
        zIndex: 1000000,
      }}>
        <p style={{ 
          color: '#FFD600', 
          fontSize: '20px', 
          fontWeight: 'bold', 
          letterSpacing: '0.05em',
          margin: 0,
          textAlign: 'center',
        }}>
          {regionMessage}
        </p>
        <div 
          className="loading-city-container" 
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 16,
            width: '100%',
            position: 'relative',
            overflow: 'visible',
            zIndex: 1000001,
            pointerEvents: 'auto',
          }}
        >
          {[{ key: 'spb', label: 'Санкт-Петербург' }, { key: 'msk', label: 'Москва' }].map(city => {
            const handleClick = (e: React.MouseEvent) => {
              console.log('Button clicked:', city.key);
              e.preventDefault();
              e.stopPropagation();
              
              if (isChangingRegion) return;
              
              const isSameRegion = activeKey === city.key;
              
              setIsChangingRegion(true);
              setActiveRegion(city.key as any);
              
              if (typeof window !== 'undefined') {
                localStorage.setItem('regionSelectedOnLoading', 'true');
              }
              
              if (isSameRegion) {
                setRegionMessage('Регион подтвержден');
              } else {
                setRegionMessage('Регион изменен');
              }
              
              setTimeout(() => {
                setIsChangingRegion(false);
              }, 1500);
            };

            const buttonWidth = city.key === 'spb' ? '250px' : 'auto';
            const buttonMinWidth = city.key === 'spb' ? '250px' : 'auto';
            const buttonMaxWidth = city.key === 'spb' ? '250px' : 'none';
            
            return (
              <div
                key={city.key}
                onClick={handleClick}
                onMouseEnter={() => setIsHoveringButton(true)}
                onMouseLeave={() => setIsHoveringButton(false)}
                style={{
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: '8px 20px 8px 8px',
                  margin: '-8px -20px -8px -8px',
                }}
              >
                <button
                  style={{
                    position: 'relative',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: buttonWidth,
                    minWidth: buttonMinWidth,
                    maxWidth: buttonMaxWidth,
                    height: '48px',
                    padding: '0 24px',
                    margin: 0,
                    boxSizing: 'border-box',
                    borderRadius: '8px',
                    border: activeKey === city.key ? '2px solid #FFD600' : '2px solid #444',
                    background: activeKey === city.key ? '#FFD60022' : 'rgba(0,0,0,0.2)',
                    color: activeKey === city.key ? '#FFD600' : '#fff',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    letterSpacing: '1px',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease-out',
                    opacity: isChangingRegion ? 0.6 : 1,
                    cursor: 'pointer',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    msUserSelect: 'none',
                    fontFamily: 'inherit',
                    flexShrink: 0,
                    pointerEvents: 'none',
                    overflow: 'visible',
                  }}
                >
                  <span style={{ pointerEvents: 'none' }}>
                    {city.label}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ width: "70%", maxWidth: "500px", marginBottom: "2rem", background: 'hsl(var(--muted))', borderRadius: 'var(--radius)' }}>
        <div
          style={{
            width: `${progress}%`,
            height: "10px",
            background: "hsl(var(--primary))",
            borderRadius: 'var(--radius)',
            boxShadow: "0 0 10px hsl(var(--primary)), 0 0 5px hsl(var(--primary))",
            transition: "width 0.3s ease-in-out",
          }}
        />
      </div>

      <div className="flex flex-col items-center text-center">
        <p
          className="text-lg text-muted-foreground transition-opacity duration-500 ease-in-out"
          style={{ opacity: 1 }}
        >
          {getCurrentText()}
        </p>
      </div>
    </div>

    {}
    <RegionSelectionModal 
      isOpen={showRegionModal} 
      onClose={() => setShowRegionModal(false)} 
    />
    </>
  );
}
