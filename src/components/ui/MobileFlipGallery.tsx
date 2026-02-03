"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { asset } from "@/lib/basePath";

const mobileGalleryData = [
  {
    id: 1,
    title: "Сборка кухонного гарнитура",
    image: asset("/fotos/1.jpg"),
    category: "Кухня",
  },
  {
    id: 2,
    title: "Установка встроенного шкафа",
    image: asset("/fotos/2.jpg"),
    category: "Спальня",
  },
  {
    id: 3,
    title: "Монтаж полок в детской",
    image: asset("/fotos/3.jpg"),
    category: "Детская",
  },
  {
    id: 4,
    title: "Сборка офисной мебели",
    image: asset("/fotos/4.jpg"),
    category: "Офис",
  },
  {
    id: 5,
    title: "Установка прихожей",
    image: asset("/fotos/5.jpg"),
    category: "Прихожая",
  },
  {
    id: 6,
    title: "Сборка спального гарнитура",
    image: asset("/fotos/6.jpg"),
    category: "Спальня",
  },
  {
    id: 7,
    title: "Монтаж кухонных фасадов",
    image: asset("/fotos/7.jpg"),
    category: "Кухня",
  },
  {
    id: 8,
    title: "Установка гардеробной системы",
    image: asset("/fotos/8.jpg"),
    category: "Гардероб",
  },
  {
    id: 9,
    title: "Сборка детской мебели",
    image: asset("/fotos/9.jpg"),
    category: "Детская",
  },
  {
    id: 10,
    title: "Монтаж книжных полок",
    image: asset("/fotos/10.jpg"),
    category: "Гостиная",
  },
  {
    id: 11,
    title: "Установка ТВ-тумбы",
    image: asset("/fotos/11.jpg"),
    category: "Гостиная",
  },
  {
    id: 12,
    title: "Сборка обеденного стола",
    image: asset("/fotos/12.jpg"),
    category: "Кухня",
  },
];

export const MobileFlipGallery: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (galleryRef.current) {
      observer.observe(galleryRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("photo-fullscreen-active");
    } else {
      document.body.style.overflow = "";
      document.body.classList.remove("photo-fullscreen-active");
    }

    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("photo-fullscreen-active");
    };
  }, [isFullscreen]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % mobileGalleryData.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + mobileGalleryData.length) % mobileGalleryData.length
    );
  };

  const openFullscreen = (index: number) => {
    setFullscreenIndex(index);
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  const nextFullscreenPhoto = () => {
    setFullscreenIndex((prev) => (prev + 1) % mobileGalleryData.length);
  };

  const prevFullscreenPhoto = () => {
    setFullscreenIndex(
      (prev) => (prev - 1 + mobileGalleryData.length) % mobileGalleryData.length
    );
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;

      switch (e.key) {
        case "Escape":
          closeFullscreen();
          break;
        case "ArrowLeft":
          prevFullscreenPhoto();
          break;
        case "ArrowRight":
          nextFullscreenPhoto();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  const currentItem = mobileGalleryData[currentIndex];

  return (
    <>
      <div ref={galleryRef} className="mobile-flip-gallery w-full px-4 py-8">
        {}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-3xl md:text-4xl font-furore text-accent mb-4 uppercase">
            Наши Работы
          </h2>
          <p className="text-gray-300 text-sm uppercase max-w-md mx-auto">
            Примеры качественной сборки мебели от наших мастеров
          </p>
        </motion.div>

        {}
        <motion.div
          className="relative max-w-sm mx-auto mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={
            isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
          }
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div
            className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => openFullscreen(currentIndex)}
          >
            <Image
              src={currentItem.image}
              alt={currentItem.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 400px"
            />

            {}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <div className="text-xs text-accent font-semibold mb-1 uppercase">
                {currentItem.category}
              </div>
              <h3 className="text-sm font-furore font-medium leading-tight">
                {currentItem.title}
              </h3>
            </div>

            {}
            <div className="absolute top-4 right-4 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                />
              </svg>
            </div>
          </div>

          {}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            aria-label="Предыдущее фото"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            aria-label="Следующее фото"
          >
            <ChevronRight size={20} />
          </button>
        </motion.div>

        {}
        <motion.div
          className="flex justify-center space-x-2 mb-6"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {mobileGalleryData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-accent" : "bg-gray-600"
              }`}
              aria-label={`Перейти к фото ${index + 1}`}
            />
          ))}
        </motion.div>

        {}
        <motion.div
          className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {mobileGalleryData.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-colors ${
                index === currentIndex ? "border-accent" : "border-transparent"
              }`}
            >
              <Image
                src={item.image}
                alt={item.title}
                width={64}
                height={48}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </motion.div>
      </div>

      {}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {}
            <button
              onClick={closeFullscreen}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              aria-label="Закрыть"
            >
              <X size={24} />
            </button>

            {}
            <motion.div
              className="relative max-w-[90vw] max-h-[90vh] mx-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={mobileGalleryData[fullscreenIndex].image}
                alt={mobileGalleryData[fullscreenIndex].title}
                width={800}
                height={600}
                className="max-w-full max-h-full object-contain rounded-lg"
                sizes="90vw"
              />
            </motion.div>

            {}
            <button
              onClick={prevFullscreenPhoto}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              aria-label="Предыдущее фото"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={nextFullscreenPhoto}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              aria-label="Следующее фото"
            >
              <ChevronRight size={24} />
            </button>

            {}
            <div className="absolute bottom-4 left-4 right-4 text-center text-white">
              <div className="text-sm text-accent font-semibold mb-1 uppercase">
                {mobileGalleryData[fullscreenIndex].category}
              </div>
              <h3 className="text-lg font-furore font-medium">
                {mobileGalleryData[fullscreenIndex].title}
              </h3>
              <div className="text-sm text-gray-300 mt-2">
                {fullscreenIndex + 1} из {mobileGalleryData.length}
              </div>
            </div>

            {}
            <div
              className="absolute left-0 top-0 bottom-0 w-1/3 cursor-pointer"
              onClick={prevFullscreenPhoto}
              aria-label="Предыдущее фото"
            />
            <div
              className="absolute right-0 top-0 bottom-0 w-1/3 cursor-pointer"
              onClick={nextFullscreenPhoto}
              aria-label="Следующее фото"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};

export default MobileFlipGallery;
