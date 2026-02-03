"use client";

import React, { useEffect, useRef, useState, type CSSProperties } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

type PageItem = {
  title: string;
  leftUrl: string;
  rightUrl: string;
  width?: number;
  height?: number;
};

const pages: PageItem[] = [
  {
    title: "Обложка",
    leftUrl: "/images/textures/обложка.png",
    rightUrl: "/images/textures/обложка.png",
    width: 1600,
    height: 850,
  },
  {
    title: "Group 2",
    leftUrl: "/images/textures/Group 2.png",
    rightUrl: "/images/textures/Group 2.png",
  },
  {
    title: "Group 3",
    leftUrl: "/images/textures/Group 3.png",
    rightUrl: "/images/textures/Group 3.png",
  },
  {
    title: "Group 4",
    leftUrl: "/images/textures/Group 4.png",
    rightUrl: "/images/textures/Group 4.png",
  },
  {
    title: "Group 5",
    leftUrl: "/images/textures/Group 5.png",
    rightUrl: "/images/textures/Group 5.png",
  },
  {
    title: "Group 6",
    leftUrl: "/images/textures/Group 6.png",
    rightUrl: "/images/textures/Group 6.png",
  },
  {
    title: "Group 7",
    leftUrl: "/images/textures/Group 7.png",
    rightUrl: "/images/textures/Group 7.png",
  },
  {
    title: "Group 8",
    leftUrl: "/images/textures/Group 8.png",
    rightUrl: "/images/textures/Group 8.png",
  },
];

const DEFAULT_PAGE_WIDTH = 1600;
const DEFAULT_PAGE_HEIGHT = 850;
const FLIP_SPEED = 250;
const flipTiming: KeyframeAnimationOptions = {
  duration: FLIP_SPEED,
  iterations: 1,
  fill: "both",
};

const flipAnimationLeft: Keyframe[] = [
  { transform: "rotateY(0)" },
  { transform: "rotateY(90deg)" },
  { transform: "rotateY(90deg)" },
];
const flipAnimationRight: Keyframe[] = [
  { transform: "rotateY(-90deg)" },
  { transform: "rotateY(-90deg)" },
  { transform: "rotateY(0)" },
];
const flipAnimationLeftReverse: Keyframe[] = [
  { transform: "rotateY(90deg)" },
  { transform: "rotateY(90deg)" },
  { transform: "rotateY(0)" },
];
const flipAnimationRightReverse: Keyframe[] = [
  { transform: "rotateY(0)" },
  { transform: "rotateY(-90deg)" },
  { transform: "rotateY(-90deg)" },
];

type Side = "left" | "right";

const PHOTOS_STACK_BASE: CSSProperties = {
  position: "absolute",
  transformOrigin: "center center",
  zIndex: 100, // Выше книги
  pointerEvents: "none",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  transition: "transform 0.18s cubic-bezier(.22,1,.36,1)",
  // width/height задаются в flip-gallery.css (clamp для мобильных и десктопа)
};

const CLICKABLE_CARD_BASE: CSSProperties = {
  position: "absolute",
  width: "clamp(200px, 25vw, 400px)",
  height: "auto",
  borderRadius: "8px",
  boxShadow: "0 3px 12px #0002",
  border: "3px solid transparent",
  background: "#fff",
  userSelect: "none",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
};

const GALLERY_WRAPPER_BASE: CSSProperties = {
  marginTop: "200px",
  marginLeft: "200px",
  zIndex: 10, // Ниже фотокарточек
  pointerEvents: "none", // Контейнер прозрачен для кликов
};

function FlipGalleryComponent() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isHoveringLeft, setIsHoveringLeft] = useState(false);
  const [isHoveringRight, setIsHoveringRight] = useState(false);
  const [isBookHovered, setIsBookHovered] = useState(false);
  const [isGroup2Complete, setIsGroup2Complete] = useState(false);
  const [isOpeningComplete, setIsOpeningComplete] = useState(false);
  const uniteRef = useRef<NodeListOf<HTMLElement> | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isBookOpen, setIsBookOpen] = useState(false);

  const isFlippingRef = useRef(false);
  const [isFlipping, setIsFlipping] = useState(false);

  const [suppressFX, setSuppressFX] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [isPhotoFullscreen, setIsPhotoFullscreen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isVerticalImage, setIsVerticalImage] = useState(false);

  const [isCardFullscreen, setIsCardFullscreen] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const cardImages = [
    { src: "/images/textures/card-left.png", label: "Карточка 1" },
    { src: "/images/textures/card-middle.png", label: "Карточка 2" },
    { src: "/images/textures/card-right.png", label: "Карточка 3" },
  ];

  const totalSpreads = pages.length - 1;
  const photoDescriptions = [
    "Сборка кухонного гарнитура",
    "Установка встроенного шкафа",
    "Монтаж полок в детской",
    "Сборка офисной мебели",
    "Установка прихожей",
    "Сборка спального гарнитура",
    "Монтаж кухонных фасадов",
    "Установка гардеробной системы",
    "Сборка детской мебели",
    "Монтаж книжных полок",
    "Установка ТВ-тумбы",
    "Сборка обеденного стола",
    "Монтаж настенных полок",
    "Установка комода",
    "Сборка рабочего стола",
    "Монтаж шкафа-купе",
    "Установка кухонного острова",
    "Сборка мебели для ванной",
    "Монтаж стеллажей",
    "Установка барной стойки",
  ];

  const allPhotos = Array.from({ length: totalSpreads * 2 }, (_, i) => ({
    label: photoDescriptions[i] || `Проект ${i + 1}`,
    src: `/fotos/${(i % 20) + 1}.jpg`,
  }));

  const lastMouseRef = useRef<{ x: number; y: number }>({ x: -1, y: -1 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    uniteRef.current =
      containerRef.current.querySelectorAll<HTMLElement>(".unite");
    defineFirstImg();

    const preloadImages = [
      "/fotos/1.jpg",
      "/fotos/2.jpg",
      "/fotos/3.jpg",
      "/fotos/4.jpg",
      "/fotos/5.jpg",
      "/fotos/6.jpg",
      "/fotos/7.jpg",
      "/fotos/8.jpg",
      "/fotos/9.jpg",
      "/fotos/10.jpg",
      "/fotos/11.jpg",
      "/fotos/12.jpg",
    ];

    preloadImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const [isVisible, setIsVisible] = useState(false);
  const [textAnimDone, setTextAnimDone] = useState(false);
  const [photosVisible, setPhotosVisible] = useState(false);
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const textInnerRef = useRef<HTMLDivElement | null>(null);
  const photosRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.3 }
    );
    const el = galleryRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setPhotosVisible(true),
      { threshold: 0.3 }
    );
    const el = photosRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!textInnerRef.current) return;
      const winW = window.innerWidth;
      const winH = window.innerHeight;
      const x = (e.clientX - winW / 2) / (winW / 2);
      const y = (e.clientY - winH / 2) / (winH / 2);
      const maxOffset = 30;
      const maxRotate = 12;

      requestAnimationFrame(() => {
        if (textInnerRef.current) {
          textInnerRef.current.style.setProperty("--tx", `${x * maxOffset}px`);
          textInnerRef.current.style.setProperty("--ty", `${y * maxOffset}px`);
          textInnerRef.current.style.setProperty(
            "--rx",
            `${-y * maxRotate}deg`
          );
          textInnerRef.current.style.setProperty("--ry", `${x * maxRotate}deg`);
        }
      });
    };

    const handleMouseLeave = () => {
      if (!textInnerRef.current) return;
      requestAnimationFrame(() => {
        if (textInnerRef.current) {
          textInnerRef.current.style.setProperty("--tx", "0px");
          textInnerRef.current.style.setProperty("--ty", "0px");
          textInnerRef.current.style.setProperty("--rx", "0deg");
          textInnerRef.current.style.setProperty("--ry", "0deg");
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { capture: true });
    window.addEventListener("mouseleave", handleMouseLeave, { capture: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove, {
        capture: true,
      });
      window.removeEventListener("mouseleave", handleMouseLeave, {
        capture: true,
      });
    };
  }, []);

  const openPhotoFullscreen = (photoIdx: number) => {
    setCurrentPhotoIndex(photoIdx);
    setIsPhotoFullscreen(true);
    checkImageOrientation(allPhotos[photoIdx]?.src || "");
    document.body.classList.add("photo-fullscreen-active");
    document.body.style.overflow = "hidden";
  };

  const closePhotoFullscreen = () => {
    setIsPhotoFullscreen(false);
    setCurrentPhotoIndex(0);
    document.body.classList.remove("photo-fullscreen-active");
    document.body.style.overflow = "";
  };

  const openCardFullscreen = (cardIdx: number) => {
    setCurrentCardIndex(cardIdx);
    setIsCardFullscreen(true);
    document.body.classList.add("photo-fullscreen-active");
    document.body.style.overflow = "hidden";
  };

  const closeCardFullscreen = () => {
    setIsCardFullscreen(false);
    setCurrentCardIndex(0);
    document.body.classList.remove("photo-fullscreen-active");
    document.body.style.overflow = "";
  };

  const nextCard = () => {
    if (currentCardIndex < cardImages.length - 1)
      setCurrentCardIndex(currentCardIndex + 1);
  };
  const prevCard = () => {
    if (currentCardIndex > 0) setCurrentCardIndex(currentCardIndex - 1);
  };
  const nextPhoto = () => {
    if (currentPhotoIndex < allPhotos.length - 1) {
      const newIndex = currentPhotoIndex + 1;
      setCurrentPhotoIndex(newIndex);
      checkImageOrientation(allPhotos[newIndex]?.src || "");
    }
  };
  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      const newIndex = currentPhotoIndex - 1;
      setCurrentPhotoIndex(newIndex);
      checkImageOrientation(allPhotos[newIndex]?.src || "");
    }
  };

  const defineFirstImg = () => {
    uniteRef.current?.forEach((el, idx) => setActiveImage(el, idx, 0));
    setImageTitle(0);
    const gallery = containerRef.current;
    const baseLeft = gallery?.querySelector<HTMLElement>(".left");
    const baseRight = gallery?.querySelector<HTMLElement>(".right");
    const oLeft = gallery?.querySelector<HTMLElement>(".overlay-left");
    const oRight = gallery?.querySelector<HTMLElement>(".overlay-right");
    if (baseLeft) baseLeft.style.opacity = "1";
    if (baseRight) baseRight.style.opacity = "1";

    if (oLeft) oLeft.style.backgroundImage = "none";
    if (oRight) oRight.style.backgroundImage = "none";
  };

  const setActiveImage = (el: HTMLElement, idx: number, pageIndex: number) => {
    const isLeft = idx === 0 || idx === 2;
    const page = pages[pageIndex];
    const url =
      pageIndex === 0 ? page.leftUrl : isLeft ? page.leftUrl : page.rightUrl;
    el.style.backgroundImage = `url('${url}')`;
    const width = page.width ?? DEFAULT_PAGE_WIDTH;
    el.style.backgroundSize = `${width}px ${
      page.height ?? DEFAULT_PAGE_HEIGHT
    }px`;
    el.style.backgroundPosition = isLeft ? "left center" : "right center";
  };

  const setImageTitle = (pageIndex: number) => {
    const gallery = containerRef.current;
    if (!gallery) return;
    gallery.style.setProperty("--title-y", "0");
    gallery.style.setProperty("--title-opacity", "1");
    gallery.style.setProperty("--spine-opacity", pageIndex === 0 ? "0" : "1");
  };

  const renderBaseSpread = (pageIndex: number) => {
    const gallery = containerRef.current;
    if (!gallery) return;
    const left = gallery.querySelector<HTMLElement>(".left");
    const right = gallery.querySelector<HTMLElement>(".right");
    const oLeft = gallery.querySelector<HTMLElement>(".overlay-left");
    const oRight = gallery.querySelector<HTMLElement>(".overlay-right");
    if (left) setActiveImage(left, 0, pageIndex);
    if (right) setActiveImage(right, 1, pageIndex);
    if (oLeft) oLeft.style.backgroundImage = "none";
    if (oRight) oRight.style.backgroundImage = "none";
  };

  const preRenderBaseSpreadDirectional = (
    nextIndex: number,
    prevIndex: number,
    isPrev: boolean
  ) => {
    const gallery = containerRef.current;
    if (!gallery) return;
    const baseLeft = gallery.querySelector<HTMLElement>(".left");
    const baseRight = gallery.querySelector<HTMLElement>(".right");

    if (!isPrev) {
      if (baseRight) setActiveImage(baseRight, 1, nextIndex);
      if (baseLeft) setActiveImage(baseLeft, 0, prevIndex);
    } else {
      if (baseLeft) setActiveImage(baseLeft, 0, nextIndex);
      if (baseRight) setActiveImage(baseRight, 1, prevIndex);
    }

    if (baseLeft) baseLeft.style.opacity = "1";
    if (baseRight) baseRight.style.opacity = "1";
  };

  const cancelOverlayAnimations = () => {
    const gallery = containerRef.current;
    if (!gallery) return;
    const overlayLeft = gallery.querySelector<HTMLElement>(".overlay-left");
    const overlayRight = gallery.querySelector<HTMLElement>(".overlay-right");
    overlayLeft?.getAnimations().forEach((a) => a.cancel());
    overlayRight?.getAnimations().forEach((a) => a.cancel());
    if (overlayLeft) overlayLeft.style.transform = "";
    if (overlayRight) overlayRight.style.transform = "";
  };

  const clearPhotosFromOverlay = (
    overlayLeft: HTMLElement,
    overlayRight: HTMLElement
  ) => {
    const leftPhotos = overlayLeft.querySelectorAll(".page-square");
    const rightPhotos = overlayRight.querySelectorAll(".page-square");
    leftPhotos.forEach((photo) => photo.remove());
    rightPhotos.forEach((photo) => photo.remove());
  };

  const addPhotoToOverlay = (
    overlay: HTMLElement,
    side: Side,
    src: string,
    alt: string,
    pageIndex: number
  ) => {
    const photoDiv = document.createElement("div");
    photoDiv.className = `page-square page-square-${side}`;
    photoDiv.setAttribute("aria-hidden", "true");

    if (pageIndex === 1) {
      if (side === "left") {
        photoDiv.style.cssText = `
          position: absolute; box-sizing: border-box; pointer-events: auto; z-index: 100;
          border: 3px solid #ffc700; border-radius: 0;
          background: transparent;
          box-shadow: none;
          overflow: hidden;
          height: 645px; width: 502px;
          transform: translate(-50%, -50%) translateX(-355px) translateY(-7px);
        `;
      } else {
        photoDiv.style.cssText = `
          position: absolute; box-sizing: border-box; pointer-events: auto; z-index: 100;
          border: 3px solid #ffc700; border-radius: 0;
          background: transparent;
          box-shadow: none;
          overflow: hidden;
          height: 645px; width: 502px;
          transform: translate(50%, -50%) translateX(363px) translateY(-7px);
        `;
      }
    } else if (pageIndex === 2) {
      if (side === "left") {
        photoDiv.style.cssText = `
          position: absolute; box-sizing: border-box; pointer-events: auto; z-index: 100;
          border: 3px solid #ffc700; border-radius: 0;
          background: transparent;
          box-shadow: none;
          overflow: hidden;
          height: 645px; width: 502px;
          transform: translate(-50%, -50%) translateX(-355px) translateY(-7px);
        `;
      } else {
        photoDiv.style.cssText = `
          position: absolute; box-sizing: border-box; pointer-events: auto; z-index: 100;
          border: 3px solid #ffc700; border-radius: 0;
          background: transparent;
          box-shadow: none;
          overflow: hidden;
          height: 395px; width: 600px;
          transform: translate(50%, -50%) translateX(364px) translateY(-7px);
        `;
      }
    }

    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.className = "square-image";
    img.style.cssText = `
      width: 100%; height: 100%; object-fit: cover;
      border-radius: 0;
      pointer-events: auto;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;

    img.onclick = () =>
      openPhotoFullscreen(allPhotos.findIndex((photo) => photo.src === src));

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "photo-frame");

    const frameHeight =
      side === "left" ? "calc(105.5% + 3px + 2px)" : "calc(105.5% + 3px - 9px)";
    const frameTop =
      side === "left" ? "calc(-2.75% - 1px)" : "calc(-2.75% + 3px)";
    const frameWidth =
      side === "left" ? "calc(105.5% - 2px)" : "calc(105.5% + 2px)";
    const frameLeft =
      side === "left" ? "calc(-2.75% + 1px)" : "calc(-2.75% - 1px)";
    svg.style.cssText = `
      position: absolute;
      top: ${frameTop};
      left: ${frameLeft};
      width: ${frameWidth};
      height: ${frameHeight};
      pointer-events: none;
      z-index: 1;
      opacity: 0;
      transition: opacity 0.2s ease;
      filter: drop-shadow(0 0 12px #ffc700) drop-shadow(0 0 24px #ffc700) drop-shadow(0 0 36px #ffc700);
    `;

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", "0");
    rect.setAttribute("y", "0");
    rect.setAttribute("width", "100%");
    rect.setAttribute("height", "100%");
    rect.setAttribute("fill", "none");
    rect.setAttribute("stroke", "#ffc700");
    rect.setAttribute("stroke-width", "6");
    rect.setAttribute("rx", "0");

    svg.appendChild(rect);

    photoDiv.addEventListener("mouseenter", () => {
      photoDiv.style.borderColor = "#ffff00";
      photoDiv.style.borderWidth = "5px";
      svg.style.opacity = "1";
    });

    photoDiv.addEventListener("mouseleave", () => {
      photoDiv.style.borderColor = "#ffc700";
      photoDiv.style.borderWidth = "3px";
      svg.style.opacity = "0";
    });

    photoDiv.appendChild(img);
    photoDiv.appendChild(svg);
    overlay.appendChild(photoDiv);
  };

  const addPhotosToOverlay = (
    overlayLeft: HTMLElement,
    overlayRight: HTMLElement,
    prevIndex: number,
    nextIndex: number,
    isPrev: boolean
  ) => {
    if (prevIndex === 1 || nextIndex === 1) return;
    clearPhotosFromOverlay(overlayLeft, overlayRight);

    if (!isPrev) {
      if (prevIndex === 1)
        addPhotoToOverlay(overlayRight, "right", "/fotos/2.jpg", "Фото 2", 1);
      if (nextIndex === 1)
        addPhotoToOverlay(overlayLeft, "left", "/fotos/1.jpg", "Фото 1", 1);
      if (prevIndex === 2)
        addPhotoToOverlay(overlayRight, "right", "/fotos/4.jpg", "Фото 4", 2);
      if (nextIndex === 2)
        addPhotoToOverlay(overlayLeft, "left", "/fotos/3.jpg", "Фото 3", 2);
    } else {
      if (prevIndex === 1)
        addPhotoToOverlay(overlayLeft, "left", "/fotos/1.jpg", "Фото 1", 1);
      if (nextIndex === 1)
        addPhotoToOverlay(overlayRight, "right", "/fotos/2.jpg", "Фото 2", 1);
      if (prevIndex === 2)
        addPhotoToOverlay(overlayLeft, "left", "/fotos/3.jpg", "Фото 3", 2);
      if (nextIndex === 2)
        addPhotoToOverlay(overlayRight, "right", "/fotos/4.jpg", "Фото 4", 2);
    }
  };

  const updateGallery = async (nextIndex: number, isPrev: boolean) => {
    const gallery = containerRef.current;
    if (!gallery) return;

    const overlayLeft = gallery.querySelector<HTMLElement>(".overlay-left");
    const overlayRight = gallery.querySelector<HTMLElement>(".overlay-right");
    const baseLeft = gallery.querySelector<HTMLElement>(".left");
    const baseRight = gallery.querySelector<HTMLElement>(".right");
    if (!overlayLeft || !overlayRight || !baseLeft || !baseRight) return;

    cancelOverlayAnimations();

    gallery.style.setProperty("--title-y", "-1rem");
    gallery.style.setProperty("--title-opacity", "0");
    gallery.setAttribute("data-title", "");

    const prevIndex = currentIndex;

    const isCoverOpen = prevIndex === 0 && nextIndex === 1 && !isPrev;
    const isCoverClose = prevIndex > 0 && nextIndex === 0 && isPrev;

    if (!isCoverClose) {
      preRenderBaseSpreadDirectional(nextIndex, prevIndex, isPrev);
    }

    if (isCoverOpen || isCoverClose) {
      baseLeft.style.opacity = "0";
    } else {
      baseLeft.style.opacity = "1";
      baseRight.style.opacity = "1";
    }

    if (!isPrev) {
      setActiveImage(overlayRight, 1, prevIndex);
      setActiveImage(overlayLeft, 2, nextIndex);
      overlayRight.style.transform = "rotateY(0)";
      overlayLeft.style.transform = "rotateY(90deg)";
    } else {
      setActiveImage(overlayLeft, 0, prevIndex);
      setActiveImage(overlayRight, 3, nextIndex);
      overlayLeft.style.transform = "rotateY(0)";
      overlayRight.style.transform = "rotateY(-90deg)";
    }

    addPhotosToOverlay(overlayLeft, overlayRight, prevIndex, nextIndex, isPrev);

    const a1 = !isPrev
      ? overlayRight.animate(flipAnimationRightReverse, flipTiming)
      : overlayLeft.animate(flipAnimationLeft, flipTiming);
    const a2 = !isPrev
      ? overlayLeft.animate(flipAnimationLeftReverse, flipTiming)
      : overlayRight.animate(flipAnimationRight, flipTiming);

    await Promise.all([a1.finished, a2.finished]).catch(() => {});

    overlayLeft.style.transform = "";
    overlayRight.style.transform = "";

    clearPhotosFromOverlay(overlayLeft, overlayRight);

    renderBaseSpread(nextIndex);
    setImageTitle(nextIndex);
    if ((isCoverOpen || isCoverClose) && baseLeft) baseLeft.style.opacity = "1";
  };

  const updateIndex = async (increment: number) => {
    const inc = Number(increment);
    const nextIndex = currentIndex + inc;

    if (nextIndex === 0 && inc < 0) {
      setIsClosing(true);
      setIsBookOpen(false);
      setSuppressFX(true);
      const gallery = containerRef.current;
      if (gallery) gallery.style.setProperty("--overlap", "0px");
      setIsFlipping(true);
      isFlippingRef.current = true;
      const isPrev = true;
      await updateGallery(0, isPrev);
      setCurrentIndex(0);
      isFlippingRef.current = false;
      setIsFlipping(false);
      resetCoverTilt();
      requestAnimationFrame(() => {
        setTimeout(() => {
          restoreHoverLikeStart();
          setTimeout(() => {
            setSuppressFX(false);
            setIsClosing(false);
          }, 150);
        }, 0);
      });
      return;
    }

    if (nextIndex < 0 || nextIndex >= pages.length) return;
    if (currentIndex === 0 && inc > 0) {
      setContourFlash(true);
      setTimeout(() => setContourFlash(false), 500);
    }
    if (currentIndex === 1 && inc < 0) {
      setContourFlash(true);
      setTimeout(() => setContourFlash(false), 500);
    }
    setIsFlipping(true);
    isFlippingRef.current = true;
    const isPrev = inc < 0;
    await updateGallery(nextIndex, isPrev);
    setCurrentIndex(nextIndex);
    isFlippingRef.current = false;
    setIsFlipping(false);

    if (currentIndex > 0 && nextIndex > 0) {
      if (nextIndex === 2) {
        setTimeout(() => {
          setIsGroup2Complete(true);
        }, 200);
      } else {
        setIsGroup2Complete(false);
      }
    }
  };

  const openBook = () => {
    if (currentIndex === 0) {
      const gallery = containerRef.current;
      if (gallery) {
        gallery.style.setProperty("--overlap", "3px");

        gallery.classList.remove("book-hover-active");
      }
      setIsBookOpen(true);
      setIsBookHovered(false);
      setTimeout(() => {
        setIsOpeningComplete(true);
      }, FLIP_SPEED / 2);
      updateIndex(1);
      setTimeout(() => {
        setIsHovering(false);
        setIsHoveringLeft(false);
        setIsHoveringRight(false);
        resetCoverTilt();
      }, FLIP_SPEED + 50);
    }
  };

  const restoreHoverLikeStart = () => {
    const gallery = containerRef.current;
    if (!gallery) {
      setIsHovering(false);
      setIsHoveringLeft(false);
      setIsHoveringRight(false);
      setIsBookHovered(false); // Сбрасываем тень
      return;
    }
    const rect = gallery.getBoundingClientRect();
    const { x, y } = lastMouseRef.current;
    const inside =
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

    if (inside) {
      setIsHovering(true);
      const midX = rect.left + rect.width / 2;
      const onLeft = x < midX;
      setIsHoveringLeft(onLeft);
      setIsHoveringRight(!onLeft);
    } else {
      setIsHovering(false);
      setIsHoveringLeft(false);
      setIsHoveringRight(false);
      setIsBookHovered(false); // Сбрасываем тень
    }
  };

  const closeBook = async () => {
    if (currentIndex > 0) {
      setIsClosing(true);
      setIsBookOpen(false);
      setIsBookHovered(false); // Сбрасываем hover состояние при закрытии
      setSuppressFX(true);
      const gallery = containerRef.current;
      if (gallery) gallery.style.setProperty("--overlap", "0px");
      setTimeout(() => {
        setIsOpeningComplete(false);
      }, FLIP_SPEED / 2);
      await updateIndex(-currentIndex);
      resetCoverTilt();
      requestAnimationFrame(() => {
        setTimeout(() => {
          restoreHoverLikeStart();
          setTimeout(() => {
            setSuppressFX(false);
            setIsClosing(false);
          }, 150);
        }, 0);
      });
    }
  };

  const scrollBlockDiagnosticsRef = useRef(0);
  useEffect(() => {
    if (isPhotoFullscreen) {
      const logScrollBlock = () => {
        const now = Date.now();
        if (now - scrollBlockDiagnosticsRef.current > 1000) {
          scrollBlockDiagnosticsRef.current = now;
          console.error(
            "[ScrollDiagnostics] Прокрутка заблокирована FlipGallery (fullscreen фото). Проверьте закрытие и очистку слушателей."
          );
        }
      };

      const preventScroll = (e: WheelEvent) => {
        e.preventDefault();
        logScrollBlock();
      };
      const preventTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        logScrollBlock();
      };

      document.addEventListener("wheel", preventScroll, { passive: false });
      document.addEventListener("touchmove", preventTouchMove, {
        passive: false,
      });

      return () => {
        document.removeEventListener("wheel", preventScroll);
        document.removeEventListener("touchmove", preventTouchMove);
      };
    }
  }, [isPhotoFullscreen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isPhotoFullscreen) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closePhotoFullscreen();
      } else if (e.key === "ArrowLeft" && currentPhotoIndex > 0) {
        e.preventDefault();
        prevPhoto();
      } else if (
        e.key === "ArrowRight" &&
        currentPhotoIndex < allPhotos.length - 1
      ) {
        e.preventDefault();
        nextPhoto();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isPhotoFullscreen, currentPhotoIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isCardFullscreen) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeCardFullscreen();
      } else if (e.key === "ArrowLeft" && currentCardIndex > 0) {
        e.preventDefault();
        prevCard();
      } else if (
        e.key === "ArrowRight" &&
        currentCardIndex < cardImages.length - 1
      ) {
        e.preventDefault();
        nextCard();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isCardFullscreen, currentCardIndex]);

  useEffect(() => {
    return () => {
      document.body.classList.remove("photo-fullscreen-active");
      document.body.style.overflow = "";
    };
  }, []);

  const [contourFlash, setContourFlash] = useState(false);
  const [coverTilt, setCoverTilt] = useState({ tx: 0, ty: 0 });
  const resetCoverTilt = () => setCoverTilt({ tx: 0, ty: 0 });

  // Смещение контура по X: считаем от фактической ширины #flip-gallery (50% = центр книги)
  const [contourOffsetX, setContourOffsetX] = useState(400);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const w = el.offsetWidth;
      // Смещение вправо на половину ширины рамки (25% ширины галереи)
      if (w > 0) setContourOffsetX(w * 0.25);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const coverHalfStyleLeft: CSSProperties | undefined =
    currentIndex === 0
      ? {
          transform: `translate3d(${coverTilt.tx}px, ${coverTilt.ty}px, 0)`,
          transition: "none",
          willChange: "transform",
          outline: "1px solid transparent",
          clipPath: "inset(1.5px 2px 1.5px 1.5px round 8px)",
          pointerEvents: "none", // Левая половина не блокирует клики на фото
        }
      : {
          transformOrigin: "center center",
          pointerEvents: "none",
        };

  const coverHalfStyleRight: CSSProperties | undefined =
    currentIndex === 0
      ? {
          transform: `translate3d(${coverTilt.tx}px, ${coverTilt.ty}px, 0)`,
          transition: "none",
          willChange: "transform",
          outline: "1px solid transparent",
          clipPath: "inset(1.5px 1.5px 1.5px 2px round 8px)",
          pointerEvents: "none", // Правая половина тоже не блокирует (клики обрабатывает .hit-right)
        }
      : {
          transformOrigin: "center center",
          pointerEvents: "none",
        };

  const showHover = isBookHovered && currentIndex === 0 && !isBookOpen;
  const showCoverFX =
    currentIndex === 0 && !isBookOpen && showHover && !suppressFX;

  const handleBookMouseEnter = () => setIsBookHovered(true);
  const handleBookMouseLeave = () => setIsBookHovered(false);

  const checkImageOrientation = (src: string) => {
    const img = new window.Image();
    img.onload = () => setIsVerticalImage(img.height > img.width);
    img.src = src;
  };

  return (
    <>
      {}
      <div
        ref={photosRef}
        className="photo-stack"
        style={{
          ...PHOTOS_STACK_BASE,
          transform: "translateY(-50%) scale(var(--flip-gallery-scale))",
        }}
      >
        {}
        <motion.div
          onClick={() => !isBookOpen && openCardFullscreen(0)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="clickable-card"
          data-interactive="true"
          style={{
            ...CLICKABLE_CARD_BASE,
            left: "clamp(-200px, -8vw, -250px)",
            top: "clamp(-100px, -8vh, -150px)",
            zIndex: 150, // Гораздо выше книги
            pointerEvents: isBookOpen ? "none" : "auto",
            cursor: isBookOpen ? "default" : "pointer",
            transformOrigin: "center",
          }}
          initial={{ opacity: 0, x: -300, y: -100, rotate: -60, scale: 0.7 }}
          animate={
            photosVisible
              ? {
                  opacity: 1,
                  x: 0,
                  y: 0,
                  rotate: -28,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 22,
                    delay: 0.05,
                  },
                }
              : {}
          }
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "#ffc700";
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 0 20px rgba(255, 199, 0, 0.6), 0 8px 24px rgba(0, 0, 0, 0.3)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "transparent";
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 3px 12px #0002";
          }}
        >
          <img
            src="/images/textures/card-left.png"
            alt="фотка 1"
            className="card-image"
            draggable={false}
          />
        </motion.div>

        <motion.div
          onClick={() => !isBookOpen && openCardFullscreen(1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="clickable-card"
          data-interactive="true"
          style={{
            ...CLICKABLE_CARD_BASE,
            left: "clamp(100px, 20vw, 200px)",
            top: "clamp(-300px, -25vh, -400px)",
            zIndex: 151, // Еще выше
            pointerEvents: isBookOpen ? "none" : "auto",
            cursor: isBookOpen ? "default" : "pointer",
          }}
          initial={{ opacity: 0, x: -300, y: -100, rotate: 60, scale: 0.7 }}
          animate={
            photosVisible
              ? {
                  opacity: 1,
                  x: 0,
                  y: 0,
                  rotate: 20,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 22,
                    delay: 0.15,
                  },
                }
              : {}
          }
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "#ffc700";
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 0 20px rgba(255, 199, 0, 0.6), 0 8px 24px rgba(0, 0, 0, 0.3)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "transparent";
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 3px 12px #0002";
          }}
        >
          <img
            src="/images/textures/card-middle.png"
            alt="фотка 2"
            className="card-image"
            draggable={false}
          />
        </motion.div>

        <motion.div
          onClick={() => !isBookOpen && openCardFullscreen(2)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="clickable-card"
          data-interactive="true"
          style={{
            ...CLICKABLE_CARD_BASE,
            left: "clamp(300px, 30vw, 450px)",
            top: "0px",
            zIndex: 152, // Самая верхняя
            pointerEvents: isBookOpen ? "none" : "auto",
            cursor: isBookOpen ? "default" : "pointer",
          }}
          initial={{ opacity: 0, x: -300, y: -100, rotate: -40, scale: 0.7 }}
          animate={
            photosVisible
              ? {
                  opacity: 1,
                  x: 0,
                  y: 0,
                  rotate: -10,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 22,
                    delay: 0.25,
                  },
                }
              : {}
          }
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "#ffc700";
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 0 20px rgba(255, 199, 0, 0.6), 0 8px 24px rgba(0, 0, 0, 0.3)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "transparent";
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 3px 12px #0002";
          }}
        >
          <img
            src="/images/textures/card-right.png"
            alt="фотка 3"
            className="card-image"
            draggable={false}
          />
        </motion.div>
      </div>

      {}
      <motion.div
        ref={textRef}
        className="flip-gallery-text max-w-4xl mb-12 text-center"
        initial={{ opacity: 0, x: 900, y: -350, scale: 0.8 }}
        animate={photosVisible ? { opacity: 1, x: 50, y: -350, scale: 1 } : {}}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 25,
          delay: 0.35,
        }}
        style={{
          transform: `scale(var(--flip-gallery-scale))`,
        }}
        onAnimationComplete={() => setTextAnimDone(true)}
      >
        <div
          ref={textInnerRef}
          style={{
            fontFamily: "Furore, sans-serif",
            fontSize: "clamp(0.875rem, 1.5vw, 1.87rem)",
            fontWeight: 500,
            color: "#888888",
            transform: `translate(calc(-100px + var(--tx, 0px)), calc(-350px + var(--ty, 0px))) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))`,
            willChange: "transform",
            transition: "none",
          }}
        >
          Для нас мебель — это не просто предметы интерьера, а часть вашей
          истории, отражение характера и заботы о близких. Наши проекты — это
          всегда индивидуальный подход, честность и открытость на каждом этапе.
        </div>
      </motion.div>

      {}
      <motion.div
        ref={galleryRef}
        className="flip-gallery-book-area relative p-2 flex items-center justify-center"
        initial={{ opacity: 0, x: 900, y: -350, scale: 0.8 }}
        animate={photosVisible ? { opacity: 1, x: 50, y: -350, scale: 1 } : {}}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 25,
          delay: 0.65,
        }}
        style={GALLERY_WRAPPER_BASE as CSSProperties}
      >
        {isBookHovered && currentIndex === 0 && !isBookOpen && (
          <div aria-hidden="true" className="book-shadow-hover">
            <div className="book-shadow-hover-element-1" />
            <div className="book-shadow-hover-element-2" />
            <div className="book-shadow-hover-element-3" />
            <div className="book-shadow-hover-element-4" />
            <div className="book-shadow-hover-element-5" />
          </div>
        )}

        {isOpeningComplete && (
          <div aria-hidden="true" className="book-backdrop-opened" />
        )}

        {}
        <div
          onMouseEnter={() => {
            setIsHoveringRight(false);
            handleBookMouseEnter();
          }}
          onMouseLeave={() => {
            setIsHoveringRight(false);
            resetCoverTilt();
            handleBookMouseLeave();
          }}
          onMouseMove={(e) => {
            const gallery = containerRef.current;
            if (!gallery) return;
            const rect = gallery.getBoundingClientRect();
            const midX = rect.left + rect.width / 2;
            if (e.clientX >= midX) {
              setIsHoveringRight(true);
              if (currentIndex === 0) {
                const cx = rect.left + rect.width * 0.5;
                const cy = rect.top + rect.height * 0.5;
                const dx = (e.clientX - cx) / (rect.width * 0.5);
                const dy = (e.clientY - cy) / (rect.height * 0.5);
                const clamp = (n: number, min: number, max: number) =>
                  Math.max(min, Math.min(max, n));
                const x = clamp(dx, -1, 1);
                const y = clamp(dy, -1, 1);
                const maxTranslate = 10;
                setCoverTilt({ tx: x * maxTranslate, ty: y * maxTranslate });
              }
            } else {
              setIsHoveringRight(false);
              if (currentIndex === 0) setCoverTilt({ tx: 0, ty: 0 });
            }
          }}
          id="flip-gallery"
          ref={containerRef}
          className={`flip-gallery-book relative text-center ${
            showHover ? "book-hover-active" : ""
          }`}
          style={
            {
              perspective: "1500px",
              transformStyle: "preserve-3d",
              backgroundRepeat: "no-repeat",
              transformOrigin: "center",
              "--overlap": "3px",
              transition: "transform 0.18s cubic-bezier(.22,1,.36,1)",
              zIndex: 1,
              width: "1600px",
              height: "850px",
              pointerEvents: "none", // Контейнер прозрачен для кликов, клики идут через hit-right
            } as CSSProperties
          }
        >
          {}
          <div
            className="left unite bg-cover bg-no-repeat"
            style={coverHalfStyleLeft}
          />
          <div
            className="right unite bg-cover bg-no-repeat"
            style={coverHalfStyleRight}
          />

          {}
          <div className="overlay-left unite bg-cover bg-no-repeat" />
          <div className="overlay-right unite bg-cover bg-no-repeat" />

          {}
          {currentIndex === 0 &&
            !isBookOpen &&
            (!isFlipping || contourFlash || isClosing) && (
              <div
                className={`book-contour${
                  contourFlash ? " contour-flash" : ""
                }${isClosing ? " contour-flash" : ""}`}
                style={{
                  backgroundImage: "url('/images/textures/Книга-2-контур.svg')",
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  transform: `translateX(${contourOffsetX}px) translate3d(${
                    coverTilt.tx * 0.6
                  }px, ${coverTilt.ty * 0.6}px, 0) scale(1.01)`,
                  transition: "opacity 0.25s ease",
                }}
              >
                {}
                {showCoverFX && (
                  <div
                    className="book-contour-glow"
                    aria-hidden="true"
                    style={{
                      backgroundImage:
                        "url('/images/textures/Книга-2-контур.svg')",
                      backgroundSize: "contain",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      position: "absolute",
                      inset: 0,
                      transform: "none", // Уже позиционирован родителем
                    }}
                  />
                )}
              </div>
            )}

          {}
          {currentIndex === 1 && !isFlipping && (
            <>
              <div
                className="page-square page-square-left"
                data-interactive="true"
                style={{
                  height: "645px",
                  width: "502px",
                  transform:
                    "translate(-50%, -50%) translateX(-355px) translateY(-7px)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "#ffff00";
                  (e.currentTarget as HTMLElement).style.borderWidth = "5px";
                  const svg = e.currentTarget.querySelector(
                    ".photo-frame"
                  ) as HTMLElement;
                  if (svg) svg.style.opacity = "1";
                  document.body.setAttribute("data-cursor-active", "true");
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "#ffc700";
                  (e.currentTarget as HTMLElement).style.borderWidth = "3px";
                  const svg = e.currentTarget.querySelector(
                    ".photo-frame"
                  ) as HTMLElement;
                  if (svg) svg.style.opacity = "0";
                  document.body.removeAttribute("data-cursor-active");
                }}
              >
                <img
                  src="/fotos/1.jpg"
                  alt="Фото 1"
                  className="square-image square-image-clickable"
                  onClick={() => openPhotoFullscreen(0)}
                />
                <svg className="photo-frame photo-frame-left-2">
                  <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="none"
                    stroke="#ffc700"
                    strokeWidth="6"
                    rx="0"
                  />
                </svg>
              </div>

              <div
                className="page-square page-square-right"
                data-interactive="true"
                style={{
                  height: "645px",
                  width: "502px",
                  transform:
                    "translate(50%, -50%) translateX(363px) translateY(-7px)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "#ffff00";
                  (e.currentTarget as HTMLElement).style.borderWidth = "5px";
                  const svg = e.currentTarget.querySelector(
                    ".photo-frame"
                  ) as HTMLElement;
                  if (svg) svg.style.opacity = "1";
                  document.body.setAttribute("data-cursor-active", "true");
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "#ffc700";
                  (e.currentTarget as HTMLElement).style.borderWidth = "3px";
                  const svg = e.currentTarget.querySelector(
                    ".photo-frame"
                  ) as HTMLElement;
                  if (svg) svg.style.opacity = "0";
                  document.body.removeAttribute("data-cursor-active");
                }}
              >
                <img
                  src="/fotos/2.jpg"
                  alt="Фото 2"
                  className="square-image square-image-clickable"
                  onClick={() => openPhotoFullscreen(1)}
                />
                <svg className="photo-frame photo-frame-right-1">
                  <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="none"
                    stroke="#ffc700"
                    strokeWidth="6"
                    rx="0"
                  />
                </svg>
              </div>
            </>
          )}

          {}
          {currentIndex === 2 && !isFlipping && (
            <>
              <div
                className="page-square page-square-left"
                data-interactive="true"
                style={{
                  height: "645px",
                  width: "502px",
                  transform:
                    "translate(-50%, -50%) translateX(-355px) translateY(-7px)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "#ffff00";
                  (e.currentTarget as HTMLElement).style.borderWidth = "5px";
                  const svg = e.currentTarget.querySelector(
                    ".photo-frame"
                  ) as HTMLElement;
                  if (svg) svg.style.opacity = "1";
                  document.body.setAttribute("data-cursor-active", "true");
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "#ffc700";
                  (e.currentTarget as HTMLElement).style.borderWidth = "3px";
                  const svg = e.currentTarget.querySelector(
                    ".photo-frame"
                  ) as HTMLElement;
                  if (svg) svg.style.opacity = "0";
                  document.body.removeAttribute("data-cursor-active");
                }}
              >
                <img
                  src="/fotos/3.jpg"
                  alt="Фото 3"
                  className="square-image square-image-clickable"
                  onClick={() => openPhotoFullscreen(2)}
                />
                <svg className="photo-frame photo-frame-left-2">
                  <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="none"
                    stroke="#ffc700"
                    strokeWidth="6"
                    rx="0"
                  />
                </svg>
              </div>

              <div
                className="page-square page-square-right"
                data-interactive="true"
                style={{
                  height: "645px",
                  width: "502px",
                  transform:
                    "translate(50%, -50%) translateX(363px) translateY(-7px)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "#ffff00";
                  (e.currentTarget as HTMLElement).style.borderWidth = "5px";
                  const svg = e.currentTarget.querySelector(
                    ".photo-frame"
                  ) as HTMLElement;
                  if (svg) svg.style.opacity = "1";
                  document.body.setAttribute("data-cursor-active", "true");
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "#ffc700";
                  (e.currentTarget as HTMLElement).style.borderWidth = "3px";
                  const svg = e.currentTarget.querySelector(
                    ".photo-frame"
                  ) as HTMLElement;
                  if (svg) svg.style.opacity = "0";
                  document.body.removeAttribute("data-cursor-active");
                }}
              >
                <img
                  src="/fotos/4.jpg"
                  alt="Фото 4"
                  className="square-image square-image-clickable"
                  onClick={() => openPhotoFullscreen(3)}
                />
                <svg className="photo-frame photo-frame-right-1">
                  <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="none"
                    stroke="#ffc700"
                    strokeWidth="6"
                    rx="0"
                  />
                </svg>
              </div>
            </>
          )}

          {}
          {currentIndex >= 3 && !isFlipping && (
            <>
              {(() => {
                const isOdd = currentIndex % 2 === 1;
                const photoMapping: { [key: number]: [number, number] } = {
                  1: [0, 1],
                  2: [2, 3],
                  3: [4, 5],
                  4: [10, 11],
                  5: [12, 13],
                  6: [7, 6],
                  7: [8, 9],
                };
                const [leftPhotoIdx, rightPhotoIdx] = photoMapping[
                  currentIndex
                ] || [(currentIndex - 1) * 2, (currentIndex - 1) * 2 + 1];

                const leftProps =
                  isOdd && currentIndex !== 5 && currentIndex !== 7
                    ? {
                        style: {
                          height: "395px",
                          width: "600px",
                          transform:
                            "translate(-50%, -50%) translateX(-355px) translateY(-7px)",
                        },
                        svg: {
                          top: "calc(-2.75% - 1px)",
                          height: "calc(105.5% + 3px + 3px)",
                          left: "calc(-2.75% - 3px)",
                          width: "calc(105.5% - 2px)",
                        },
                      }
                    : {
                        style: {
                          height: "645px",
                          width: "502px",
                          transform:
                            "translate(-50%, -50%) translateX(-355px) translateY(-7px)",
                        },
                        svg: {
                          top: "calc(-2.75% + 5px)",
                          height: "calc(105.5% + 3px - 9px)",
                          left: "calc(-2.75% - 5px)",
                          width: "calc(105.5% + 4px)",
                        },
                      };
                const leftFrameClass =
                  isOdd && currentIndex !== 5 && currentIndex !== 7
                    ? "photo-frame-left-1"
                    : "photo-frame-left-2";

                const rightProps =
                  isOdd || currentIndex === 4 || currentIndex === 6
                    ? {
                        style: {
                          height: "645px",
                          width: "502px",
                          transform:
                            "translate(50%, -50%) translateX(363px) translateY(-7px)",
                        },
                        svg: {
                          top: "calc(-2.75% + 5px)",
                          height: "calc(105.5% + 3px - 9px)",
                          left: "calc(-1.75% - 10px)",
                          width: "calc(105.5% + 2px)",
                        },
                      }
                    : {
                        style: {
                          height: "395px",
                          width: "600px",
                          transform:
                            "translate(50%, -50%) translateX(364px) translateY(-7px)",
                        },
                        svg: {
                          top: "calc(-2.75% - 1px)",
                          height: "calc(105.5% + 3px + 2px)",
                          left: "calc(-2.75% - 3px)",
                          width: "calc(105.5% - 2px)",
                        },
                      };
                const rightFrameClass =
                  isOdd || currentIndex === 4 || currentIndex === 6
                    ? "photo-frame-right-1"
                    : "photo-frame-right-2";
                return (
                  <>
                    <div
                      className="page-square page-square-left"
                      data-interactive="true"
                      style={leftProps.style}
                      onClick={() => openPhotoFullscreen(leftPhotoIdx)}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor =
                          "#ffff00";
                        (e.currentTarget as HTMLElement).style.borderWidth =
                          "5px";
                        const svg = e.currentTarget.querySelector(
                          ".photo-frame"
                        ) as HTMLElement;
                        if (svg) svg.style.opacity = "1";
                        document.body.setAttribute(
                          "data-cursor-active",
                          "true"
                        );
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor =
                          "#ffc700";
                        (e.currentTarget as HTMLElement).style.borderWidth =
                          "3px";
                        const svg = e.currentTarget.querySelector(
                          ".photo-frame"
                        ) as HTMLElement;
                        if (svg) svg.style.opacity = "0";
                        document.body.removeAttribute("data-cursor-active");
                      }}
                    >
                      <img
                        src={allPhotos[leftPhotoIdx]?.src || "/fotos/1.jpg"}
                        alt={allPhotos[leftPhotoIdx]?.label || "Фото"}
                        className="square-image"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <svg className={`photo-frame ${leftFrameClass}`}>
                        <rect
                          x="0"
                          y="0"
                          width="100%"
                          height="100%"
                          fill="none"
                          stroke="#ffc700"
                          strokeWidth="6"
                          rx="0"
                        />
                      </svg>
                    </div>

                    <div
                      className="page-square page-square-right"
                      data-interactive="true"
                      style={rightProps.style}
                      onClick={() => openPhotoFullscreen(rightPhotoIdx)}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor =
                          "#ffff00";
                        (e.currentTarget as HTMLElement).style.borderWidth =
                          "5px";
                        const svg = e.currentTarget.querySelector(
                          ".photo-frame"
                        ) as HTMLElement;
                        if (svg) svg.style.opacity = "1";
                        document.body.setAttribute(
                          "data-cursor-active",
                          "true"
                        );
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor =
                          "#ffc700";
                        (e.currentTarget as HTMLElement).style.borderWidth =
                          "3px";
                        const svg = e.currentTarget.querySelector(
                          ".photo-frame"
                        ) as HTMLElement;
                        if (svg) svg.style.opacity = "0";
                        document.body.removeAttribute("data-cursor-active");
                      }}
                    >
                      <img
                        src={allPhotos[rightPhotoIdx]?.src || "/fotos/1.jpg"}
                        alt={allPhotos[rightPhotoIdx]?.label || "Фото"}
                        className="square-image"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <svg className={`photo-frame ${rightFrameClass}`}>
                        <rect
                          x="0"
                          y="0"
                          width="100%"
                          height="100%"
                          fill="none"
                          stroke="#ffc700"
                          strokeWidth="6"
                          rx="0"
                        />
                      </svg>
                    </div>
                  </>
                );
              })()}
            </>
          )}

          {}
          <div className="spine-mask" aria-hidden="true" />

          {}
          {!isBookOpen && (
            <button
              type="button"
              aria-label="Открыть книгу"
              className="hit-right hit-right-active"
              onClick={() => openBook()}
              onMouseEnter={() => {
                setIsHovering(true);
                setIsHoveringLeft(false);
                setIsHoveringRight(true);
                handleBookMouseEnter();
              }}
              onMouseLeave={() => {
                setIsHoveringRight(false);
                handleBookMouseLeave();
              }}
            />
          )}

          {}
          {(isBookOpen || isFlipping) && !isClosing && currentIndex > 1 && (
            <button
              type="button"
              onClick={() => updateIndex(-1)}
              className="carousel-arrow-prev"
              aria-label="Previous slide"
            />
          )}

          {(isBookOpen || isFlipping) &&
            !isClosing &&
            currentIndex < pages.length - 1 && (
              <button
                type="button"
                onClick={() => updateIndex(1)}
                className="carousel-arrow-next"
                aria-label="Next slide"
              />
            )}

          {}
          {(isBookOpen || isFlipping) &&
            !isClosing &&
            !isPhotoFullscreen &&
            !isCardFullscreen && (
              <button
                type="button"
                onClick={closeBook}
                aria-label="Закрыть книгу"
                className="flip-gallery-close-btn float-animation text-accent"
              >
                <X size={56} />
              </button>
            )}
        </div>
      </motion.div>

      {}
      {isPhotoFullscreen && (
        <div
          className="fixed inset-0 z-[9999] fullscreen-photo-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр фотографии"
        >
          <div
            className="absolute inset-0 fullscreen-photo-backdrop"
            onClick={closePhotoFullscreen}
          />
          <div className="relative flex items-center justify-center w-full h-full fullscreen-photo-content">
            <div className="relative inline-block photo-container-with-arrows">
              {currentPhotoIndex > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    prevPhoto();
                  }}
                  aria-label="Предыдущее фото"
                  className="modal-nav-arrow photo-arrow-left"
                />
              )}

              {allPhotos[currentPhotoIndex]?.src ? (
                <motion.img
                  src={allPhotos[currentPhotoIndex].src}
                  alt={allPhotos[currentPhotoIndex].label}
                  className="block object-contain select-none fullscreen-photo-image"
                  draggable={false}
                  initial={{ scale: 0.5, opacity: 0, y: 100 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.5, opacity: 0, y: 100 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    duration: 0.5,
                  }}
                />
              ) : (
                <motion.div
                  className="fullscreen-placeholder"
                  initial={{ scale: 0.5, opacity: 0, y: 100 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.5, opacity: 0, y: 100 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    duration: 0.5,
                  }}
                >
                  {allPhotos[currentPhotoIndex]?.label}
                </motion.div>
              )}

              {currentPhotoIndex < allPhotos.length - 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    nextPhoto();
                  }}
                  aria-label="Следующее фото"
                  className="modal-nav-arrow photo-arrow-right"
                />
              )}
            </div>

            {currentPhotoIndex > 0 && (
              <div
                className="modal-clickable-area left"
                onClick={(e) => {
                  e.stopPropagation();
                  prevPhoto();
                }}
                aria-label="Предыдущее фото"
              />
            )}
            {currentPhotoIndex < allPhotos.length - 1 && (
              <div
                className="modal-clickable-area right"
                onClick={(e) => {
                  e.stopPropagation();
                  nextPhoto();
                }}
                aria-label="Следующее фото"
              />
            )}
          </div>

          <button
            type="button"
            onClick={closePhotoFullscreen}
            aria-label="Закрыть"
            className="modal-close-button float-animation"
          >
            <X size={56} />
          </button>
        </div>
      )}

      {}
      {isCardFullscreen && (
        <div
          className="fixed inset-0 z-[9999] fullscreen-card-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр карточки"
        >
          <div
            className="absolute inset-0 fullscreen-card-backdrop"
            onClick={closeCardFullscreen}
          />
          <div className="relative flex items-center justify-center w-full h-full fullscreen-photo-content">
            <div className="relative inline-block">
              {currentCardIndex > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    prevCard();
                  }}
                  aria-label="Предыдущая карточка"
                  className="modal-nav-arrow card-left"
                />
              )}

              <motion.img
                key={currentCardIndex}
                src={cardImages[currentCardIndex].src}
                alt={cardImages[currentCardIndex].label}
                className="block select-none fullscreen-card-image"
                draggable={false}
                initial={{ scale: 0.5, opacity: 0, y: 100 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.5, opacity: 0, y: 100 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  duration: 0.5,
                }}
              />

              {currentCardIndex < cardImages.length - 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    nextCard();
                  }}
                  aria-label="Следующая карточка"
                  className="modal-nav-arrow card-right"
                />
              )}
            </div>

            {currentCardIndex > 0 && (
              <div
                className="modal-clickable-area left"
                onClick={(e) => {
                  e.stopPropagation();
                  prevCard();
                }}
                aria-label="Предыдущая карточка"
              />
            )}
            {currentCardIndex < cardImages.length - 1 && (
              <div
                className="modal-clickable-area right"
                onClick={(e) => {
                  e.stopPropagation();
                  nextCard();
                }}
                aria-label="Следующая карточка"
              />
            )}
          </div>

          <motion.button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              closeCardFullscreen();
            }}
            aria-label="Закрыть"
            className="modal-close-button float-animation text-accent"
            whileHover={{ scale: 1.5, filter: "brightness(1.5)" }}
            transition={{ duration: 0.3 }}
          >
            <X size={56} />
          </motion.button>
        </div>
      )}

      {}
      <style jsx>{`
        #flip-gallery > .unite {
          position: absolute;
          width: calc(50% + var(--overlap, 3px));
          height: 100%;
          overflow: visible;
          background-size: ${DEFAULT_PAGE_WIDTH}px ${DEFAULT_PAGE_HEIGHT}px;
          backface-visibility: hidden;
          will-change: transform;
          transform-style: preserve-3d;
          pointer-events: none;
          contain: paint;
        }
        .left,
        .right {
          z-index: 10;
        }
        .overlay-left,
        .overlay-right {
          z-index: 20;
        }
        .left,
        .overlay-left {
          left: 0;
          transform-origin: right;
          background-position: left center;
        }
        .right,
        .overlay-right {
          right: 0;
          transform-origin: left;
          background-position: right center;
        }
        .spine-mask {
          position: absolute;
          z-index: 25;
          left: 50%;
          top: 0;
          height: 100%;
          width: calc(var(--overlap, 3px) * 1.5);
          transform: translateX(-50%);
          pointer-events: none;
          opacity: var(--spine-opacity, 1);
          background: linear-gradient(
            to right,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0.15) 30%,
            rgba(0, 0, 0, 0.2) 50%,
            rgba(0, 0, 0, 0.15) 70%,
            rgba(0, 0, 0, 0) 100%
          );
        }
      `}</style>
    </>
  );
}

export default React.memo(FlipGalleryComponent);
