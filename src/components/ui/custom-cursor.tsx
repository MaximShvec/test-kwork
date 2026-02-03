"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useIsMobile } from "@/contexts/ResponsiveContext";
import { asset } from "@/lib/basePath";

const CustomCursor: React.FC = () => {
  const isMobile = useIsMobile();
  const cursorRef = useRef<HTMLDivElement>(null);

  // Убрали дублирование состояний - используем только refs для значений, которые нужны в обработчиках событий
  const [cursorState, setCursorState] = useState({
    isHoveringInteractive: false,
    isMouseDown: false,
    isHidden: true,
    isMounted: false,
    isOutOfBounds: false,
  });

  // Ref для быстрого доступа без ререндеров
  const cursorStateRef = useRef(cursorState);

  // Синхронизируем ref с состоянием при каждом изменении
  useEffect(() => {
    cursorStateRef.current = cursorState;
  }, [cursorState]);

  const positionRef = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const animationFrameRef = useRef<number | null>(null);
  const hoveredInteractiveElementRef = useRef<Element | null>(null);
  const cleanupRefs = useRef<(() => void)[]>([]);

  const hotspotX = 13;
  const hotspotY = 2;

  // Оптимизированная проверка границ с использованием ref
  const checkCursorBounds = useCallback((x: number, y: number) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const margin = 10;

    const isOut =
      x < -margin ||
      x > viewportWidth + margin ||
      y < -margin ||
      y > viewportHeight + margin;

    if (isOut !== cursorStateRef.current.isOutOfBounds) {
      setCursorState((prev) => ({ ...prev, isOutOfBounds: isOut }));
    }

    return isOut;
  }, []);

  // Оптимизированный обработчик движения мыши
  const moveCursor = useCallback(
    (e: MouseEvent) => {
      const newX = e.clientX;
      const newY = e.clientY;
      positionRef.current = { x: newX, y: newY };

      const isOut = checkCursorBounds(newX, newY);

      if (cursorStateRef.current.isHidden && !isOut) {
        setCursorState((prev) => ({ ...prev, isHidden: false }));
      }

      // Используем requestAnimationFrame для плавности
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        const cursorElement = cursorRef.current;
        if (cursorElement) {
          const rotation =
            cursorStateRef.current.isHoveringInteractive &&
            !cursorStateRef.current.isMouseDown
              ? "rotate(-30deg)"
              : "";

          cursorElement.style.transform = `translate(${newX - hotspotX}px, ${
            newY - hotspotY
          }px) ${rotation}`;
        }
      });
    },
    [checkCursorBounds]
  );

  // Улучшенный селектор с кэшированием
  const getInteractiveSelector = useCallback(() => {
    return 'a, button, .btn, [role="button"], [onclick], .nav__link, .service-card, .pricing-card, .gallery-item, .social__link, .footer__link, input, textarea, select, input[type="submit"], input[type="button"], .modal__close, .modal__button, .mobile-menu-toggle, .phone-shake, #privacyPolicyArrow, #termsArrow, .process-toggle, .interactive-folder, .folder-item-content, .carousel-control, [role="option"], [aria-haspopup="listbox"], .region-option, .loading-city-button, .clickable-card, .modal-close-button, [data-interactive="true"], [data-clickable="true"], .clickable-icon';
  }, []);

  // Проверка интерактивных элементов (без getComputedStyle — дорого при каждом mouseover и может вызывать зависания)
  const isInteractiveElement = useCallback(
    (element: Element): boolean => {
      const closestInteractive = element.closest(getInteractiveSelector());
      if (!closestInteractive) return false;
      if (
        closestInteractive instanceof HTMLButtonElement ||
        closestInteractive instanceof HTMLInputElement ||
        closestInteractive instanceof HTMLTextAreaElement ||
        closestInteractive instanceof HTMLSelectElement
      ) {
        if (closestInteractive.disabled) return false;
      }
      return true;
    },
    [getInteractiveSelector]
  );

  // Обработчик наведения на элемент
  const handleMouseOver = useCallback(
    (e: MouseEvent) => {
      const target = e.target as Element;

      if (isInteractiveElement(target)) {
        hoveredInteractiveElementRef.current = target;
        if (!cursorStateRef.current.isHoveringInteractive) {
          setCursorState((prev) => ({ ...prev, isHoveringInteractive: true }));
        }
      }
    },
    [isInteractiveElement]
  );

  // Обработчик ухода с элемента
  const handleMouseOut = useCallback((e: MouseEvent) => {
    const relatedTarget = e.relatedTarget as Element | null;

    if (
      hoveredInteractiveElementRef.current &&
      (!relatedTarget ||
        (relatedTarget !== hoveredInteractiveElementRef.current &&
          !hoveredInteractiveElementRef.current.contains(relatedTarget)))
    ) {
      hoveredInteractiveElementRef.current = null;
      if (cursorStateRef.current.isHoveringInteractive) {
        setCursorState((prev) => ({ ...prev, isHoveringInteractive: false }));
      }
    }
  }, []);

  // Обработчик нажатия кнопки мыши (класс после контекстного меню не восстанавливаем — вешает при повторных кликах)
  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (e.button === 0) {
      setCursorState((prev) => ({ ...prev, isMouseDown: true }));
    }
  }, []);

  // Обработчик отпускания кнопки мыши
  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (e.button === 0) {
      setCursorState((prev) => ({ ...prev, isMouseDown: false }));
    }
  }, []);

  // Обработчик выхода мыши за пределы окна
  const handleDocumentMouseLeave = useCallback(() => {
    setCursorState((prev) => ({
      ...prev,
      isHidden: true,
      isOutOfBounds: true,
      isHoveringInteractive: false,
    }));
  }, []);

  // Обработчик изменения размера окна
  const handleWindowResize = useCallback(() => {
    const currentPos = positionRef.current;
    checkCursorBounds(currentPos.x, currentPos.y);
  }, [checkCursorBounds]);

  // Обработчик fullscreen
  const handleFullscreenChange = useCallback(() => {
    setTimeout(() => {
      if (!document.fullscreenElement) {
        // Удаляем и добавляем класс для переинициализации
        document.body.classList.remove("custom-cursor-active");
        document.body.classList.add("custom-cursor-active");

        if (
          !cursorStateRef.current.isHidden &&
          !cursorStateRef.current.isOutOfBounds
        ) {
          setCursorState((prev) => ({ ...prev, isHidden: false }));
        }
      }
    }, 50);
  }, []);

  // При ПКМ снимаем cursor: none, чтобы контекстное меню не зависало. Класс не восстанавливаем — иначе повторные клики зависают.
  const handleContextMenu = useCallback(() => {
    document.body.classList.remove("custom-cursor-active");
  }, []);

  // Обработчик изменения видимости страницы (вкладки)
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      setCursorState((prev) => ({ ...prev, isHidden: true }));
    }
  }, []);

  useEffect(() => {
    if (isMobile) {
      return;
    }

    // Устанавливаем флаг монтирования
    setCursorState((prev) => ({ ...prev, isMounted: true }));

    // Добавляем класс для скрытия системного курсора
    document.body.classList.add("custom-cursor-active");

    // Добавляем обработчики событий
    const eventHandlers = [
      { event: "mousemove", handler: moveCursor },
      { event: "mouseover", handler: handleMouseOver },
      { event: "mouseout", handler: handleMouseOut },
      { event: "mousedown", handler: handleMouseDown },
      { event: "mouseup", handler: handleMouseUp },
      { event: "contextmenu", handler: handleContextMenu },
      { event: "fullscreenchange", handler: handleFullscreenChange },
      { event: "webkitfullscreenchange", handler: handleFullscreenChange },
      { event: "resize", handler: handleWindowResize },
      { event: "visibilitychange", handler: handleVisibilityChange },
    ];

    eventHandlers.forEach(({ event, handler }) => {
      document.addEventListener(event, handler as EventListener);
      cleanupRefs.current.push(() =>
        document.removeEventListener(event, handler as EventListener)
      );
    });

    // Отдельно обрабатываем mouseleave на документе
    const docMouseLeaveHandler = () => handleDocumentMouseLeave();
    document.documentElement.addEventListener(
      "mouseleave",
      docMouseLeaveHandler
    );
    cleanupRefs.current.push(() =>
      document.documentElement.removeEventListener(
        "mouseleave",
        docMouseLeaveHandler
      )
    );

    return () => {
      // Отменяем анимацию
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Убираем все обработчики
      cleanupRefs.current.forEach((cleanup) => cleanup());
      cleanupRefs.current = [];

      // Убираем класс
      document.body.classList.remove("custom-cursor-active");
    };
  }, [
    isMobile,
    moveCursor,
    handleMouseOver,
    handleMouseOut,
    handleMouseDown,
    handleMouseUp,
    handleDocumentMouseLeave,
    handleWindowResize,
    handleFullscreenChange,
    handleContextMenu,
    handleVisibilityChange,
  ]);

  // Вычисляем стиль курсора
  const cursorStyle: React.CSSProperties = {
    position: "fixed",
    left: 0,
    top: 0,
    width: "64px",
    height: "64px",
    backgroundImage: `url(${
      cursorState.isHoveringInteractive ? asset("/images/3.cur") : asset("/images/2.cur")
    })`,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    pointerEvents: "none",
    transition: `
      transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275),
      opacity 0.15s ease-out,
      background-image 0.1s ease-out
    `,
    filter: cursorState.isHoveringInteractive
      ? "drop-shadow(0 0 8px #fff) drop-shadow(0 0 16px #fff)"
      : "none",
    zIndex: 300000,
    willChange: "transform, opacity",
    transformOrigin: `${hotspotX}px ${hotspotY}px`,
    opacity:
      !cursorState.isMounted ||
      cursorState.isHidden ||
      cursorState.isOutOfBounds
        ? 0
        : 1,
    transform: `translate(${positionRef.current.x - hotspotX}px, ${
      positionRef.current.y - hotspotY
    }px) ${
      cursorState.isHoveringInteractive && !cursorState.isMouseDown
        ? "rotate(-30deg)"
        : ""
    }`,
  };

  if (isMobile) {
    return null;
  }

  return cursorState.isMounted ? (
    <div ref={cursorRef} style={cursorStyle} />
  ) : null;
};

export default CustomCursor;
