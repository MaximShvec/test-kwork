"use client"; // Add this directive to mark the component as a Client Component

import Link from "next/link";
import Image from "next/image"; // For logo
import { Phone, Mail, MapPin, X } from "lucide-react"; // Assuming Youtube instead of WhatsApp based on file names, added MapPin and X
import { useState, useEffect, useRef, useCallback } from "react";
import { PrivacyPolicyContent } from "@/components/ui/PrivacyPolicyModal";
import { useRegion } from "@/contexts/RegionContext";
import { useResponsive } from "@/contexts/ResponsiveContext";

const TelegramIcon = () => (
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
  >
    <path d="M22 2L11 13"></path>
    <path d="M22 2L15 22l-4-9-9-4 20-6z"></path>
  </svg>
);
const WhatsAppIcon = () => (
  // Placeholder - consider Lucide's MessageSquare or similar
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
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);
const InstagramIcon = () => (
  // Placeholder if Lucide Instagram is not used
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
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
  </svg>
);

const TABS = [
  {
    key: "terms",
    label: "Пользовательское соглашение",
    image: "/images/textures/IMG_6309.PNG", // visual icon for the terms of service tab
  },
  {
    key: "privacy",
    label: "Политика конфиденциальности",
    image: "/images/textures/IMG_6308.PNG", // visual icon for the privacy policy tab
  },
];

export const Footer = () => {
  const { activeRegion } = useRegion();
  const { isMobile } = useResponsive();
  const [showTabModal, setShowTabModal] = useState(false);
  const [activeTab, setActiveTab] = useState("privacy");
  const [headerHeight, setHeaderHeight] = useState(140); // default min-height
  const [collapsedFooterHeight, setCollapsedFooterHeight] = useState(200); // высота контента футера в свёрнутом виде
  const [isClosing, setIsClosing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const [isHovered, setIsHovered] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const [showThrown, setShowThrown] = useState(false);
  const [thrownTab, setThrownTab] = useState<string | null>(null);
  const [animationName, setAnimationName] = useState("animation-throw-in");
  const [hoveredTabKey, setHoveredTabKey] = useState<string | null>(null);
  const [isReverseThrow, setIsReverseThrow] = useState(false); // Новое состояние для реверса
  const [hideStaticText, setHideStaticText] = useState(false);
  const TAB_OUTLINES: Record<string, string> = {
    privacy: "/images/textures/soglas.svg",
    terms: "/images/textures/politika.svg",
  };

  const folderContainerRef = useRef<HTMLDivElement>(null);
  const footerBottomRef = useRef<HTMLDivElement>(null); // для измерения высоты контента
  const parallaxRaf = useRef<number | null>(null);
  const lastCoords = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const modalCardsRef = useRef<HTMLDivElement>(null);
  const modalParallaxRaf = useRef<number | null>(null);
  const modalLastCoords = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleModalMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!modalCardsRef.current) return;
    const rect = modalCardsRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    const intensity = 30;
    modalLastCoords.current = { x: nx * intensity, y: ny * intensity };
    if (modalParallaxRaf.current === null) {
      modalParallaxRaf.current = requestAnimationFrame(() => {
        if (modalCardsRef.current) {
          const { x, y } = modalLastCoords.current;
          modalCardsRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        }
        modalParallaxRaf.current = null;
      });
    }
  };
  const handleModalMouseLeave = () => {
    if (modalCardsRef.current) {
      modalCardsRef.current.style.transition =
        "transform 0.4s cubic-bezier(0.6,0.05,0.4,1)";
      modalCardsRef.current.style.transform = "translate3d(0,0,0)";
      setTimeout(() => {
        if (modalCardsRef.current) {
          modalCardsRef.current.style.transition = "";
        }
      }, 400);
    }
    modalLastCoords.current = { x: 0, y: 0 };
  };

  useEffect(() => {
    if (showTabModal) {
      const prevHtmlOverflow = document.documentElement.style.overflow;
      const prevBodyOverflow = document.body.style.overflow;
      const prevBodyPaddingRight = document.body.style.paddingRight;

      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      return () => {
        document.documentElement.style.overflow = prevHtmlOverflow;
        document.body.style.overflow = prevBodyOverflow;
        document.body.style.paddingRight = prevBodyPaddingRight;
      };
    }
  }, [showTabModal]);

  useEffect(() => {
    const header = document.querySelector(".header");
    if (header) {
      setHeaderHeight(header.clientHeight);
    }
  }, [showTabModal]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Высота футера в свёрнутом виде = полная высота контента (scrollHeight), чтобы не было пустого места и обрезки
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  useEffect(() => {
    if (isExpanded) return;
    const measure = () => {
      const wrapper = footerBottomRef.current;
      if (!wrapper) return;
      const fullHeight = wrapper.scrollHeight;
      setCollapsedFooterHeight(fullHeight);
    };
    const t = requestAnimationFrame(() => {
      measure();
      resizeObserverRef.current = new ResizeObserver(measure);
      if (footerBottomRef.current)
        resizeObserverRef.current.observe(footerBottomRef.current);
    });
    return () => {
      cancelAnimationFrame(t);
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
    };
  }, [isExpanded, isClient]);

  const handleFolderMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!folderContainerRef.current) return;

      const rect = folderContainerRef.current.getBoundingClientRect();
      if (!rect) return;

      const intensity = 15;
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      lastCoords.current = { x: nx * intensity, y: ny * intensity };

      if (parallaxRaf.current === null) {
        parallaxRaf.current = requestAnimationFrame(() => {
          if (folderContainerRef.current) {
            const { x, y } = lastCoords.current;
            const hoverTransform = "scale(1.1)";
            folderContainerRef.current.style.transform = `${hoverTransform} translate3d(${x}px, ${y}px, 0)`;
          }
          parallaxRaf.current = null;
        });
      }
    },
    []
  );

  const handleFolderMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (folderContainerRef.current) {
      folderContainerRef.current.style.transition = "none";
      folderContainerRef.current.style.transform = "scale(1.1)";
    }
  }, []);

  const handleFolderMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (folderContainerRef.current) {
      folderContainerRef.current.style.transition =
        "transform 0.4s cubic-bezier(0.6,0.05,0.4,1)";
      folderContainerRef.current.style.transform = "scale(1)";
    }
    if (parallaxRaf.current) {
      cancelAnimationFrame(parallaxRaf.current);
      parallaxRaf.current = null;
    }
  }, []);

  const handleClose = () => {
    if (showThrown) {
      setIsReverseThrow(true);
      setAnimationName("animation-throw-out");
      setIsHovered(false);
      setHoveredTabKey(null);

      return;
    }

    setShowTabModal(false);
    setIsExpanded(false);
    setIsClosing(false);
    setActiveTab("privacy");
    setShowThrown(false);
    setAnimationName("");
    setIsHovered(false);
    setHoveredTabKey(null);
  };

  const tabContent: Record<string, JSX.Element> = {
    privacy: (
      <div className="p-8 text-lg max-w-[1400px] mx-auto w-full">
        <p className="privacy-intro">
          НАСТОЯЩАЯ ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ ОПРЕДЕЛЯЕТ ПОРЯДОК ОБРАБОТКИ И
          ЗАЩИТЫ ПЕРСОНАЛЬНЫХ ДАННЫХ ФИЗИЧЕСКИХ ЛИЦ, ПОЛЬЗУЮЩИХСЯ СЕРВИСАМИ
          САЙТА SHELF (ДАЛЕЕ – КОМПАНИЯ).
        </p>
        <h3 className="text-accent mt-6 text-xl font-bold">
          1. Общие положения
        </h3>
        <p>
          1.1. Настоящая Политика является официальным документом Компании и
          определяет порядок обработки и защиты информации о физических лицах,
          пользующихся услугами сайта SHELF.
        </p>
        <p>
          1.2. Целью настоящей Политики является обеспечение надлежащей защиты
          информации о пользователях, в том числе их персональных данных, от
          несанкционированного доступа и разглашения.
        </p>
        <h3 className="text-accent mt-6 text-xl font-bold">
          2. Собираемая информация
        </h3>
        <p>
          2.1. Компания собирает следующие данные: имя, номер телефона, адрес
          электронной почты и адрес выполнения работ.
        </p>
        <h3 className="text-accent mt-6 text-xl font-bold">
          3. Цели сбора и обработки
        </h3>
        <p>
          3.1. Компания собирает и хранит только ту персональную информацию,
          которая необходима для предоставления сервисов сайта.
        </p>
        <p>
          3.2. Персональная информация пользователя используется в следующих
          целях:
        </p>
        <ul className="list-disc ml-8">
          <li>Оказание услуг по сборке мебели</li>
          <li>Осуществление клиентской поддержки</li>
          <li>Информирование о новых услугах и акциях</li>
          <li>Улучшение качества предоставляемых услуг</li>
        </ul>
        <h3 className="text-accent mt-6 text-xl font-bold">
          4. Защита, изменение и удаление информации
        </h3>
        <p>
          4.1. Компания защищает ваши персональные данные и по первому запросу
          изменит либо удалит их — достаточно связаться с нами по указанным
          контактам.
        </p>
        <h3 className="text-accent mt-6 text-xl font-bold">5. Контакты</h3>
        <p>
          5.1. По всем вопросам, связанным с настоящей Политикой, пользователи
          могут обращаться в Компанию по следующим контактным данным:
        </p>
        <ul className="list-disc ml-8">
          <li>
            Телефон:{" "}
            <a href={activeRegion.phoneHref} className="text-accent underline">
              {activeRegion.phoneDisplay}
            </a>
          </li>
          <li>
            Email:{" "}
            <a
              href={`mailto:${activeRegion.email}`}
              className="text-accent underline"
            >
              {activeRegion.email}
            </a>
          </li>
          <li>Адрес: {activeRegion.address}</li>
        </ul>
      </div>
    ),
    terms: (
      <div className="p-8 text-lg max-w-[1400px] mx-auto w-full">
        <h3 className="text-accent mt-6 text-xl font-bold">
          1. Общие положения
        </h3>
        <p>
          1.1. Настоящее Пользовательское соглашение (далее — Соглашение)
          регулирует отношения между владельцем сайта SHELF и пользователями
          данного сайта.
        </p>
        <p>
          1.2. Используя сайт, вы соглашаетесь с условиями данного Соглашения.
        </p>
        <h3 className="text-accent mt-6 text-xl font-bold">
          2. Права и обязанности сторон
        </h3>
        <ul className="list-disc ml-8">
          <li>
            Пользователь обязуется предоставлять достоверную информацию при
            заполнении форм на сайте.
          </li>
          <li>
            Пользователь не имеет права использовать сайт в целях,
            противоречащих законодательству РФ.
          </li>
          <li>
            Владелец сайта вправе изменять содержание сайта, приостанавливать
            или прекращать его работу без предварительного уведомления.
          </li>
        </ul>
        <h3 className="text-accent mt-6 text-xl font-bold">
          3. Персональные данные
        </h3>
        <p>
          3.1. Владелец сайта обязуется соблюдать конфиденциальность
          персональных данных пользователей в соответствии с Политикой
          конфиденциальности.
        </p>
        <h3 className="text-accent mt-6 text-xl font-bold">
          4. Ответственность
        </h3>
        <ul className="list-disc ml-8">
          <li>
            Владелец сайта не несет ответственности за возможные убытки,
            возникшие в результате использования или невозможности использования
            сайта.
          </li>
          <li>
            Пользователь самостоятельно несет ответственность за достоверность
            предоставляемых данных.
          </li>
        </ul>
        <h3 className="text-accent mt-6 text-xl font-bold">
          5. Изменения в соглашении
        </h3>
        <p>
          5.1. Владелец сайта вправе в любое время изменять условия настоящего
          Соглашения. Изменения вступают в силу с момента публикации на сайте.
        </p>
        <h3 className="text-accent mt-6 text-xl font-bold">6. Контакты</h3>
        <p>
          По всем вопросам, связанным с использованием сайта, вы можете
          обратиться по следующим контактам:
        </p>
        <ul className="list-disc ml-8">
          <li>
            Телефон:{" "}
            <a href={activeRegion.phoneHref} className="text-accent underline">
              {activeRegion.phoneDisplay}
            </a>
          </li>
          <li>
            Email:{" "}
            <a
              href={`mailto:${activeRegion.email}`}
              className="text-accent underline"
            >
              {activeRegion.email}
            </a>
          </li>
          <li>Адрес: {activeRegion.address}</li>
        </ul>
      </div>
    ),
  };

  const activeTabImage = TABS.find((t) => t.key === activeTab)?.image;

  const handleStartThrowIn = (tabKey: string) => {
    setIsExpanded(true);
    setActiveTab(tabKey);
    setShowTabModal(true);
    if (isMobile) {
      setShowThrown(false);
      setThrownTab(null);
      return;
    }
    if (hideStaticText) setHideStaticText(false);
    setHideStaticText(true);
    setTimeout(() => setHideStaticText(false), 550); // длительность throw-in 0.5s + запас
    setThrownTab(tabKey);
    setShowThrown(true);
    setAnimationName("animation-throw-in");
  };

  return (
    <>
      <footer
        className={`footer ${
          isExpanded ? "footer--expanded" : "footer--collapsed"
        }`}
        style={{
          background: "transparent",
          overflow: isExpanded ? "visible" : "hidden",
          ...(isMobile
            ? { height: "auto", marginTop: 0 }
            : {
                height: `${collapsedFooterHeight}px`,
                marginTop: `-${collapsedFooterHeight}px`,
              }),
          position: "relative",
        }}
      >
        {!isExpanded && (
          <div
            ref={footerBottomRef}
            className="footer__bottom"
            style={{ background: "transparent", borderTop: "none" }}
          >
            <div className="footer__bottom-content container flex justify-center py-4">
              {}
              <div
                className={
                  isMobile
                    ? "relative w-full max-w-[360px] mx-auto mt-8 overflow-hidden"
                    : undefined
                }
                style={
                  isMobile
                    ? {
                        height: 540,
                        width: 360,
                        maxWidth: "100%",
                      }
                    : undefined
                }
              >
                <div
                  ref={folderContainerRef}
                  className={
                    isMobile
                      ? "absolute left-1/2 top-0 origin-top -translate-x-1/2"
                      : "relative w-[800px] h-[1200px] mt-20"
                  }
                  onMouseEnter={isMobile ? undefined : handleFolderMouseEnter}
                  onMouseLeave={isMobile ? undefined : handleFolderMouseLeave}
                  onMouseMove={isMobile ? undefined : handleFolderMouseMove}
                  style={{
                    ...(isMobile
                      ? {
                          width: 800,
                          height: 1200,
                          marginTop: 0,
                          transform:
                            "translateX(-50%) translateY(0) scale(0.45)",
                          transformOrigin: "top center",
                        }
                      : {
                          transform: "translateY(0) scale(1)",
                        }),
                    transition: "transform 0.4s cubic-bezier(0.6,0.05,0.4,1)",
                    zIndex: 36000,
                  }}
                >
                  {TABS.map((tab, idx) => {
                    const isSecond = idx === 1;
                    const buttonZ = isSecond ? 10 : 20;
                    return (
                      <button
                        key={tab.key}
                        aria-label={tab.label}
                        className="interactive-folder absolute left-0 top-0 p-0 bg-transparent border-none focus:outline-none"
                        style={{
                          zIndex: buttonZ,
                          pointerEvents: "auto",
                        }}
                        onAnimationEnd={(e) =>
                          e.currentTarget.classList.remove(
                            "animate-button-header-like-bounce-in"
                          )
                        }
                      >
                        <Image
                          src={tab.image}
                          alt={tab.label}
                          width={800}
                          height={460}
                          className="object-contain select-none"
                          priority
                        />
                      </button>
                    );
                  })}
                  {}
                  {hoveredTabKey && (
                    <Image
                      src={TAB_OUTLINES[hoveredTabKey]}
                      alt="outline"
                      width={800}
                      height={520}
                      className="absolute left-0 top-0 object-contain pointer-events-none z-40"
                      style={{
                        top: hoveredTabKey === "terms" ? 2 : 6,
                        left: 1,
                        transform: "translate(-0.25%, -0.25%) scale(1.005)",
                        filter: "drop-shadow(0 0 6px #FFC700)",
                      }}
                    />
                  )}

                  {}
                  <button
                    aria-label={TABS[0].label}
                    className={`absolute left-0 top-0 bg-transparent focus:outline-none ${
                      isMobile ? "w-1/2 h-[54px]" : "w-[400px] h-[120px]"
                    }`}
                    style={{ zIndex: 30 }}
                    onClick={() => handleStartThrowIn(TABS[0].key)}
                    onMouseEnter={() => setHoveredTabKey(TABS[0].key)}
                    onMouseLeave={() => setHoveredTabKey(null)}
                  />
                  {}
                  <button
                    aria-label={TABS[1].label}
                    className={`absolute top-0 bg-transparent focus:outline-none ${
                      isMobile
                        ? "right-0 w-1/2 h-[54px]"
                        : "right-0 w-[520px] h-[120px]"
                    }`}
                    style={{ zIndex: 25 }}
                    onClick={() => handleStartThrowIn(TABS[1].key)}
                    onMouseEnter={() => setHoveredTabKey(TABS[1].key)}
                    onMouseLeave={() => setHoveredTabKey(null)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </footer>
      {}
      {showTabModal && (
        <>
          {}
          <div
            className="footer-modal-backdrop"
            onClick={handleClose}
            style={{
              top: headerHeight,
              height: `calc(100vh - ${headerHeight}px)`,
            }}
          />
          <div
            className={`fixed left-0 right-0 z-[20000] flex flex-col items-center ${
              isClosing ? "footer-slide-down" : ""
            }`}
            onClick={handleClose}
            style={{
              top: isMobile ? 0 : headerHeight,
              height: isMobile ? "100vh" : `calc(100vh - ${headerHeight}px)`,
              // height: `calc(100vh - ${headerHeight}px)`,
              animation: isClosing
                ? "footer-slide-down 0.25s cubic-bezier(0.6,0.05,0.4,1)"
                : "footer-slide-up 0.3s cubic-bezier(0.6,0.05,0.4,1)",
              background: "transparent",
              backdropFilter: "none",
              perspective: "2000px",
            }}
          >
            {}
            {}
            {!isClosing && (
              <div
                className={`float-animation ${
                  isMobile
                    ? "absolute right-4 top-4"
                    : "absolute right-[1106px] top-[-6px]"
                }`}
                style={{
                  height: isMobile ? 48 : 80,
                  width: isMobile ? 48 : 80,
                  zIndex: 65000,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="w-full h-full p-2 rounded-full text-accent flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-150 hover:brightness-150"
                  onClick={handleClose}
                  aria-label="Закрыть"
                >
                  <X size={isMobile ? 28 : 56} />
                </button>
              </div>
            )}
            {}
            <div
              ref={modalCardsRef}
              className={isMobile ? "flex flex-col min-h-0 flex-1" : ""}
              style={{ willChange: "transform", width: "100%", height: "100%" }}
              onMouseMove={handleModalMouseMove}
              onMouseLeave={handleModalMouseLeave}
            >
              {}
              {!isMobile && isReverseThrow && (
                <>
                  {}
                  {TABS.map((tab, idx) => (
                    <div
                      key={tab.key}
                      className={`thrown-container animation-throw-out`}
                      style={{
                        transform: `translate(-50%, -50%) translate3d(${modalLastCoords.current.x}px, ${modalLastCoords.current.y}px, 0) scale(1)`,
                        zIndex: tab.key === thrownTab ? 51000 : 49000,
                      }}
                      onAnimationEnd={
                        tab.key === thrownTab
                          ? () => {
                              setShowTabModal(false);
                              setIsExpanded(false);
                              setIsClosing(false);
                              setActiveTab("privacy");
                              setShowThrown(false);
                              setIsReverseThrow(false);
                              setAnimationName("");
                              setIsHovered(false);
                              setHoveredTabKey(null);
                            }
                          : undefined
                      }
                    >
                      <Image
                        src={tab.image}
                        alt={tab.label}
                        width={800}
                        height={520}
                        className="object-contain select-none"
                        priority
                      />
                      {}
                      <Image
                        src={TAB_OUTLINES[tab.key]}
                        alt="outline-active"
                        width={800}
                        height={520}
                        className="absolute left-0 top-0 object-contain pointer-events-none z-[51000]"
                        style={{
                          top: 4,
                          left: 2,
                          transform: "translate(-0.25%, -0.25%) scale(1.008)",
                          filter: "drop-shadow(0 0 6px #FFC700)",
                        }}
                      />
                      {}
                      {tab.key === thrownTab && (
                        <div
                          className={`thrown-text ${
                            thrownTab === "privacy" ? "terms" : "privacy"
                          }`}
                        >
                          {
                            tabContent[
                              thrownTab === "privacy" ? "terms" : "privacy"
                            ]
                          }
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}
              {}
              {!isMobile &&
                !isReverseThrow &&
                showThrown &&
                !isClosing &&
                thrownTab && (
                  <>
                    {}
                    <div
                      className={`static-container ${
                        isClosing ? "" : "animation-throw-in"
                      }`}
                      style={{
                        transform: `translate(-50%, -50%) translate3d(${modalLastCoords.current.x}px, ${modalLastCoords.current.y}px, 0)`,
                      }}
                    >
                      <Image
                        src={TABS.find((t) => t.key !== thrownTab)?.image || ""}
                        alt={TABS.find((t) => t.key !== thrownTab)?.label || ""}
                        width={800}
                        height={460}
                        className="object-contain select-none"
                        priority
                      />
                    </div>
                    {}
                    {!isReverseThrow && (
                      <div
                        className={`static-text ${activeTab} ${
                          hideStaticText ? "static-text--hidden" : ""
                        } ${isClosing ? "" : ""}`}
                      >
                        {activeTab && tabContent[activeTab]}
                      </div>
                    )}
                    {}
                    <div
                      className={`thrown-container ${
                        isClosing ? "" : animationName
                      }`}
                      key={thrownTab}
                      onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                        e.stopPropagation()
                      }
                      onAnimationEnd={(
                        _e: React.AnimationEvent<HTMLDivElement>
                      ) => {
                        if (
                          isReverseThrow &&
                          animationName === "animation-throw-out"
                        ) {
                          setShowTabModal(false);
                          setIsExpanded(false);
                          setIsClosing(false);
                          setActiveTab("privacy");
                          setShowThrown(false);
                          setIsReverseThrow(false);
                          setAnimationName("");
                          setIsHovered(false);
                          setHoveredTabKey(null);
                        }
                      }}
                      style={{
                        transform: `translate(-50%, -50%) translate3d(${modalLastCoords.current.x}px, ${modalLastCoords.current.y}px, 0) scale(1)`,
                      }}
                    >
                      <Image
                        src={TABS.find((t) => t.key === thrownTab)?.image || ""}
                        alt={thrownTab}
                        width={800}
                        height={460}
                        className="object-contain select-none"
                        priority
                      />
                      {}
                      {thrownTab && (
                        <Image
                          src={TAB_OUTLINES[thrownTab]}
                          alt="outline-active"
                          width={800}
                          height={520}
                          className="absolute left-0 top-0 object-contain pointer-events-none z-[51000]"
                          style={{
                            top: 4,
                            left: 2,
                            transform: "translate(-0.25%, -0.25%) scale(1.008)",
                            filter: "drop-shadow(0 0 6px #FFC700)",
                          }}
                        />
                      )}
                      <div
                        className={`thrown-text ${
                          thrownTab === "privacy" ? "terms" : "privacy"
                        }`}
                      >
                        {thrownTab &&
                          tabContent[
                            thrownTab === "privacy" ? "terms" : "privacy"
                          ]}
                      </div>
                    </div>
                  </>
                )}
              <div
                className={`relative w-full py-4 bg-transparent sticky top-0 z-10 ${
                  isMobile ? "flex-1 min-h-0 flex flex-col" : ""
                }`}
              >
                {}
                {isMobile ? (
                  <div className="relative w-full max-w-[360px] mx-auto px-4 flex flex-col min-h-0 flex-1">
                    <div className="flex gap-2 mb-4 shrink-0">
                      {TABS.map((tab) => (
                        <button
                          key={tab.key}
                          type="button"
                          aria-label={tab.label}
                          onClick={() => setActiveTab(tab.key)}
                          className={`px-4 py-2 text-sm font-furore rounded border-2 transition-colors ${
                            activeTab === tab.key
                              ? "border-accent text-accent bg-accent/10"
                              : "border-[#888] text-[#888] bg-transparent"
                          }`}
                        >
                          {tab.key === "privacy" ? "Политика" : "Соглашение"}
                        </button>
                      ))}
                    </div>
                    <div
                      className={`policy-container flex-1 overflow-y-auto p-4 flex flex-col items-center justify-start text-xs md:text-sm leading-tight ${
                        activeTab === "privacy" ? "terms" : "privacy"
                      }`}
                      style={{ pointerEvents: isClosing ? "none" : "auto" }}
                    >
                      {
                        tabContent[
                          activeTab === "privacy" ? "terms" : "privacy"
                        ]
                      }
                    </div>
                  </div>
                ) : (
                  <div className="relative w-[800px] h-[1200px] mx-auto">
                    {}
                    {!showThrown &&
                      TABS.map((tab, idx) => {
                        const isActive = activeTab === tab.key;
                        const zIndex = isActive ? 20 : 10;
                        return (
                          <button
                            key={tab.key}
                            aria-label={tab.label}
                            className="absolute left-0 top-0 p-0 bg-transparent border-none focus:outline-none"
                            style={{
                              pointerEvents: "auto",
                              zIndex,
                              transform: `translate3d(${modalLastCoords.current.x}px, ${modalLastCoords.current.y}px, 0)`,
                            }}
                            onClick={() => {
                              setActiveTab(tab.key);
                              setThrownTab(tab.key);
                              setShowThrown(true);
                            }}
                          >
                            <Image
                              src={tab.image}
                              alt={tab.label}
                              width={800}
                              height={460}
                              className="object-contain select-none"
                            />
                          </button>
                        );
                      })}
                    {}
                    {}
                    {!showThrown && (
                      <div
                        className={`policy-container absolute inset-0 z-[40000] overflow-y-auto p-4 flex flex-col items-center justify-start text-xs md:text-sm leading-tight ${
                          activeTab === "privacy" ? "terms" : "privacy"
                        }`}
                        style={{
                          pointerEvents: isClosing ? "none" : "auto",
                        }}
                      >
                        {
                          tabContent[
                            activeTab === "privacy" ? "terms" : "privacy"
                          ]
                        }
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            {}
            {!isMobile &&
              !isReverseThrow &&
              showThrown &&
              !isClosing &&
              thrownTab && (
                <div
                  className="tab-switch-buttons-container"
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  style={{ pointerEvents: "auto" }}
                >
                  <button
                    aria-label="Соглашение"
                    className="invisible-tab-btn left"
                    style={{ pointerEvents: "auto" }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      console.log(
                        "MouseDown Terms button, activeTab:",
                        activeTab
                      );
                      if (activeTab !== "terms") {
                        setAnimationName("animation-slide-out-left-and-drop");
                        setActiveTab("terms");
                        setThrownTab("terms");
                        setShowThrown(true);
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                  />
                  <button
                    aria-label="Политика"
                    className="invisible-tab-btn right"
                    style={{ pointerEvents: "auto" }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      console.log(
                        "MouseDown Privacy button, activeTab:",
                        activeTab
                      );
                      if (activeTab !== "privacy") {
                        setAnimationName("animation-slide-out-right-and-drop");
                        setActiveTab("privacy");
                        setThrownTab("privacy");
                        setShowThrown(true);
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                  />
                </div>
              )}
          </div>
        </>
      )}
      <style jsx global>{`
        .footer--collapsed {
          position: relative;
        }

        .footer--expanded {
          position: relative;
        }

        @keyframes footer-slide-up {
          from {
            transform: translateY(100%);
            opacity: 0.7;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes footer-slide-down {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(100%);
          }
        }

        @keyframes card-slide-down {
          from {
            transform: translate(-50%, -50%) scale(1);
          }
          to {
            transform: translate(-50%, 100vh) scale(1);
          }
        }

        .slide-down-card {
          animation: card-slide-down 0.25s cubic-bezier(0.6, 0.05, 0.4, 1)
            forwards !important;
        }

        .policy-container,
        .policy-container * {
          color: #888888 !important;
          font-family: "Slavic", sans-serif !important;
        }

        .policy-container::-webkit-scrollbar {
          display: none;
        }
        .policy-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @media (max-width: 767px) {
          .policy-container {
            width: 100%;
            max-width: 360px;
            box-sizing: border-box;
            padding: 0.75rem 1rem;
          }
        }

        @keyframes throw-in {
          0% {
            opacity: 0;
            transform: translate(-50%, 150vh) rotate(30deg) scale(0.5);
          }
          60% {
            opacity: 1;
            transform: translate(-50%, -50%) rotate(0deg) scale(1.5);
          }
          80% {
            transform: translate(-50%, -50%) rotate(-5deg) scale(1);
          }
          100% {
            transform: translate(-50%, -50%) rotate(0deg) scale(1);
          }
        }

        .thrown-container {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(1);
          z-index: 50000;
          pointer-events: auto;
        }
        @media (max-width: 767px) {
          .thrown-container {
            transform: translate(-50%, -50%) scale(0.45);
            transform-origin: center center;
          }
        }

        @keyframes slide-out-left-and-drop {
          0% {
            transform: translate3d(-50%, -50%, -200px) rotateY(30deg);
            opacity: 0;
          }
          50% {
            transform: translate3d(-150%, -60vh, 0) rotateY(0deg)
              rotateZ(-20deg);
            opacity: 1;
          }
          100% {
            transform: translate3d(-50%, -50%, 0) rotateZ(0deg);
            opacity: 1;
          }
        }

        @keyframes slide-out-right-and-drop {
          0% {
            transform: translate3d(-50%, -50%, -200px) rotateY(-30deg);
            opacity: 0;
          }
          50% {
            transform: translate3d(50%, -60vh, 0) rotateY(0deg) rotateZ(20deg);
            opacity: 1;
          }
          100% {
            transform: translate3d(-50%, -50%, 0) rotateZ(0deg);
            opacity: 1;
          }
        }

        .animation-throw-in {
          animation: throw-in 0.5s ease-out forwards;
        }
        .animation-slide-out-left-and-drop {
          animation: slide-out-left-and-drop 0.4s cubic-bezier(0.5, 0, 0.2, 1)
            forwards;
        }
        .animation-slide-out-right-and-drop {
          animation: slide-out-right-and-drop 0.4s cubic-bezier(0.5, 0, 0.2, 1)
            forwards;
        }

        @keyframes float-animation {
          0%,
          100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(5px, 5px);
          }
          50% {
            transform: translate(-5px, -5px);
          }
          75% {
            transform: translate(5px, -5px);
          }
        }

        .float-animation {
          animation: float-animation 6s ease-in-out infinite;
        }

        .static-container {
          position: fixed;
          top: calc(50% + 15px);
          left: 50%;
          transform: translate(-50%, -50%);
          width: 800px;
          height: 1200px;
          pointer-events: none;
          z-index: 30000;
        }
        @media (max-width: 767px) {
          .static-container {
            transform: translate(-50%, -50%) scale(0.45);
            transform-origin: center center;
          }
        }

        .static-text {
          position: fixed;
          top: calc(50% + 15px);
          left: 50%;
          transform: translate(-50%, -50%);
          width: 800px;
          height: 1200px;
          overflow-y: auto;
          padding: 1rem;
          z-index: 40000;
          color: #888888 !important;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          font-family: "Slavic", sans-serif !important;
        }
        @media (max-width: 767px) {
          .static-text {
            width: 100%;
            max-width: 360px;
            height: auto;
            min-height: 70vh;
            padding: 1rem 0.75rem;
            box-sizing: border-box;
          }
        }
        .static-text.terms,
        .thrown-text.terms,
        .policy-container.terms {
          padding-top: 60px;
        }
        @media (max-width: 767px) {
          .static-text.terms,
          .thrown-text.terms,
          .policy-container.terms {
            padding-top: 40px;
          }
        }
        .static-text * {
          font-family: "Slavic", sans-serif !important;
        }

        .thrown-text {
          position: absolute;
          inset: 0;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          z-index: 55000;
          color: #888888 !important;
          font-family: "Slavic", sans-serif !important;
        }
        @media (max-width: 767px) {
          .thrown-text {
            padding: 0.75rem;
            box-sizing: border-box;
          }
        }
        .thrown-text * {
          font-family: "Slavic", sans-serif !important;
        }

        .static-text,
        .static-text *,
        .thrown-text,
        .thrown-text *,
        .policy-container,
        .policy-container * {
          font-weight: 700 !important;
        }
        .thrown-text::-webkit-scrollbar {
          display: none;
        }
        .thrown-text {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .tab-switch-buttons-container {
          position: fixed;
          top: calc(50% - 540px);
          left: 50%;
          transform: translate(-50%, -50%);
          width: 800px;
          height: 120px;
          z-index: 80000;
          pointer-events: auto !important;
        }
        @media (max-width: 767px) {
          .tab-switch-buttons-container {
            width: 360px;
            max-width: calc(100vw - 32px);
            height: 90px;
            top: calc(50% - 240px);
            transform: translate(-50%, -50%);
          }
        }

        .invisible-tab-btn {
          position: absolute;
          top: 0;
          width: 400px;
          height: 120px;
          background: transparent;
          border: none;
          cursor: pointer;
          z-index: 80000;
          pointer-events: auto !important;
        }
        @media (max-width: 767px) {
          .invisible-tab-btn {
            width: 50%;
            height: 90px;
          }
        }
        .invisible-tab-btn.left {
          left: 0;
        }
        .invisible-tab-btn.right {
          right: 0;
        }
        @font-face {
          font-family: "Slavic";
          src: url("/fonts/Slavic-Regular.ttf") format("truetype");
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }

        .static-text p,
        .static-text li,
        .thrown-text p,
        .thrown-text li {
          color: #888888 !important;
        }

        .static-text.privacy,
        .thrown-text.privacy,
        .policy-container.privacy {
          padding-top: 70px;
        }
        @media (max-width: 767px) {
          .static-text.privacy,
          .thrown-text.privacy,
          .policy-container.privacy {
            padding-top: 44px;
          }
        }

        .static-text .privacy-intro,
        .thrown-text .privacy-intro,
        .policy-container .privacy-intro {
          color: #ae2c2c !important;
        }

        .static-text,
        .static-text * {
          color: #888888 !important;
          font-family: "Slavic", sans-serif !important;
        }
        .thrown-text,
        .thrown-text * {
          color: #888888 !important;
          font-family: "Slavic", sans-serif !important;
        }

        @keyframes throw-out {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) rotate(0deg) scale(1);
          }
          60% {
            opacity: 1;
            transform: translate(-50%, 10vh) rotate(-10deg) scale(0.9);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, 150vh) rotate(30deg) scale(0.5);
          }
        }
        .animation-throw-out {
          animation: throw-out 0.25s ease-in forwards;
        }

        .static-text--hidden {
          opacity: 0 !important;
          pointer-events: none !important;
          transition: opacity 0.2s;
        }

        .footer-overlay-bottom-texture {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 50px;
          border-top: 2px solid #ffc700;
          pointer-events: none;
          z-index: 90000;
          background-image: url("/images/textures/3-2.jpg");
          background-size: cover;
          background-repeat: repeat-x;
          background-position: center bottom;
          margin: 0;
          padding: 0;
          transform-origin: center bottom;
          will-change: transform;

          transition: transform 0.1s ease-out;
        }

        .footer-texture-text {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          height: 100%;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.7);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
          pointer-events: auto;
        }
        .footer-texture-divider {
          color: rgba(255, 199, 0, 0.5);
        }
        .footer-texture-link {
          color: #ffc700;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .footer-texture-link:hover {
          color: #ffdd00;
          text-decoration: underline;
        }

        .footer-modal-backdrop {
          position: fixed;
          left: 0;
          right: 0;
          background: transparent;
          backdrop-filter: blur(8px);
          z-index: 19500;
          pointer-events: auto;
        }

        .static-text::-webkit-scrollbar {
          display: none;
        }
        .static-text {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};
