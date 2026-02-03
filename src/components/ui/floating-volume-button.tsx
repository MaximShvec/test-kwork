'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingVolumeButtonProps {
  isMuted: boolean;
  onToggle: () => void;
}

const FloatingVolumeButtonComponent: React.FC<FloatingVolumeButtonProps> = ({ isMuted, onToggle }) => {
  const [isFloating, setIsFloating] = useState(false); // Кнопка в плавающем состоянии
  const [ipadPosition, setIpadPosition] = useState<{ x: number; y: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {

    const ipadWrapper = document.querySelector('.ipad-video-wrapper') as HTMLElement;
    if (ipadWrapper) {
      const rect = ipadWrapper.getBoundingClientRect();
      setIpadPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const aboutSection = document.getElementById('about');
      if (!aboutSection) return;

      const aboutRect = aboutSection.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;

      const aboutTop = aboutRect.top;
      const shouldFloat = aboutTop <= viewportCenter;

      if (shouldFloat !== isFloating) {

        const ipadWrapper = document.querySelector('.ipad-video-wrapper') as HTMLElement;
        if (ipadWrapper) {
          const rect = ipadWrapper.getBoundingClientRect();
          setIpadPosition({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          });
        }
        setIsFloating(shouldFloat);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Проверяем при монтировании

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFloating]);

  const buttonSize = isMobile ? 40 : 80; // 40px для мобильных, 80px для десктопа
  const iconSize = isMobile ? 30 : 60; // 30px для мобильных, 60px для десктопа

  const finalX = 32; // left-8 = 32px
  const finalY = typeof window !== 'undefined' ? window.innerHeight - 112 : 600; // bottom-8 + высота кнопки

  const offsetX = ipadPosition ? ipadPosition.x - (buttonSize / 2) - finalX : 0;
  const offsetY = ipadPosition ? ipadPosition.y - (buttonSize / 2) - finalY : 0;

  return (
    <>
      <AnimatePresence>
        {isFloating && (
        <motion.button
          initial={{ 
            opacity: 0, 
            scale: 0.3,
            x: offsetX,
            y: offsetY,
          }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            x: 0,
            y: 0,
          }}
          exit={{ 
            opacity: 0, 
            scale: 0.3,
            x: offsetX,
            y: offsetY,
          }}
          transition={{ 
            duration: 0.4, 
            ease: 'easeOut',
          }}
          onClick={onToggle}
          className="floating-volume-btn fixed bottom-8 left-8 z-50 flex items-center justify-center"
          style={{
            width: `${buttonSize}px`,
            height: `${buttonSize}px`,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
          aria-label={isMuted ? 'Включить звук' : 'Выключить звук'}
          type="button"
        >
            {isMuted ? (
              <VolumeX 
                stroke="#ffc700" 
                color="#ffc700" 
                className="floating-volume-icon"
                style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
              />
            ) : (
              <Volume2 
                stroke="#ffc700" 
                color="#ffc700" 
                className="floating-volume-icon"
                style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
              />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .floating-volume-btn {
          -webkit-tap-highlight-color: transparent;
          user-select: none;
        }
        
        .floating-volume-icon {
          stroke-width: 2.5;
          transition: transform 0.15s, filter 0.15s;
        }
        
        .floating-volume-btn:hover .floating-volume-icon {
          transform: scale(1.3);
          filter: brightness(2) drop-shadow(0 0 12px #ffc700);
        }
        
        .floating-volume-btn:active .floating-volume-icon {
          transform: scale(1.08);
          filter: brightness(1.5) drop-shadow(0 0 6px #ffc700);
        }
      `}</style>
    </>
  );
};

export const FloatingVolumeButton = React.memo(FloatingVolumeButtonComponent);
