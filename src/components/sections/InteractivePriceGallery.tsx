"use client";

import React from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useAnimation,
  useInView,
  MotionValue,
} from "framer-motion";
import { TitleAnimation } from "@/components/ui/TitleAnimation";
import { SmoothFrameAnimation } from "@/components/ui/smooth-frame-animation";
import { animation7Frames } from "@/lib/animation7Frames";
import { useResponsive } from "@/contexts/ResponsiveContext";
import "@/styles/interactive-price-gallery.css";

interface InteractivePriceGalleryProps {
  sectionId?: string;
  pricingTitleTiltX?: MotionValue<number>;
  pricingTitleTiltY?: MotionValue<number>;
  pricingTitleScale?: MotionValue<number>;
  onPricingTitleVisible?: (visible: boolean) => void;
}

type IconItem = {
  name: string;
  closed: string;
  open?: string;
  price?: number;
  displayName?: string;
  itemId: string;
  noHover?: boolean;
};

const ICON_GROUPS: { room: string; icons: IconItem[] }[] = [
  {
    room: "СПАЛЬНЯ",
    icons: [
      {
        name: "Шкаф",
        closed: "/app/1 шкаф-закрыт-.png",
        open: "/app/1 шкаф-открыт-.png",
        price: 2500,
        itemId: "shkaf-spalnya",
        displayName: "Шкаф двустворчатый",
      },
      {
        name: "Тумбочка",
        closed: "/app/5-тумбочка-закрыта-с.png",
        open: "/app/5-тумбочка-открыта-без.png",
        price: 1200,
        itemId: "tumbochka-spalnya",
      },
      {
        name: "Кровать",
        closed: "/app/6-кровать-без.png",
        price: 2000,
        itemId: "krovat",
      },
    ],
  },
  {
    room: "ДЕТСКАЯ",
    icons: [
      {
        name: "ТВ тумба",
        closed: "/app/2 тумбочка-закрыта-телевизор.png",
        open: "/app/2 тумбочка-открыта-телевизор.png",
        price: 1200,
        itemId: "tumbochka-detskaya",
      },
      {
        name: "Компьютерный стол",
        closed: "/app/3 компстол-закрыт-с.png",
        open: "/app/3 компстол-открыт-с.png",
        price: 2500,
        itemId: "stol-detskaya",
      },
      {
        name: "Полка",
        closed: "/app/12-полка.png",
        price: 1000,
        itemId: "polka",
      },
      {
        name: "Пенал",
        closed: "/app/10-пенал-закрыт —.png",
        open: "/app/10-пенал-открыт —.png",
        price: 1500,
        itemId: "penal",
      },
    ],
  },
  {
    room: "ГОСТИНАЯ",
    icons: [
      {
        name: "Кресло",
        closed: "/app/4 кресло.png",
        price: 2000,
        itemId: "kreslo",
      },
      {
        name: "Шкаф",
        closed: "/app/7-трехствр-закрытый.png",
        open: "/app/7-трехствр-открытый.png",
        price: 3000,
        itemId: "shkaf-gostinaya",
        displayName: "Шкаф трехстворчатый",
      },
      {
        name: "Диван",
        closed: "/app/8-диван.png",
        price: 1500,
        itemId: "divan",
      },
      {
        name: "Часы",
        closed: "/app/13-часы.png",
        itemId: "chasy",
        noHover: true,
      },
      {
        name: "Торшер",
        closed: "/app/6-торшер.png",
        itemId: "torsher-gostinaya",
        noHover: true,
      },
      {
        name: "Гостиная",
        closed: "/app/18-гостиная-закрыта-с.png",
        open: "/app/18-гостиная-открыта-с.png",
        price: 3500,
        itemId: "gostinaya-tumba",
      },
    ],
  },
  {
    room: "КУХНЯ",
    icons: [
      {
        name: "Кухня",
        closed: "/app/16-кухня-закрыта-с.png",
        open: "/app/16-кухня-открыта-с.png",
        price: 6500,
        itemId: "kuhnya",
      },
      {
        name: "Холодильник",
        closed: "/app/8-холодильник.png",
        itemId: "holodilnik",
        noHover: true,
      },
      {
        name: "Стул левый",
        closed: "/app/11-левый стул.png",
        price: 350,
        itemId: "stul-lev",
        displayName: "Стулья",
      },
      {
        name: "Стол",
        closed: "/app/11-стол.png",
        price: 1000,
        itemId: "stol-kuhnya",
        displayName: "Стол кухонный",
      },
      {
        name: "Стул правый",
        closed: "/app/11-правый стул.png",
        price: 350,
        itemId: "stul-prav",
        displayName: "Стулья",
      },
      {
        name: "Картина",
        closed: "/app/15-картина-2.png",
        itemId: "kartina-kuhnya",
        noHover: true,
      },
    ],
  },
  {
    room: "ПРИХОЖАЯ",
    icons: [
      {
        name: "Комод",
        closed: "/app/17-комод-закрыт.png",
        open: "/app/17-комод-октрыт.png",
        price: 2200,
        itemId: "komod",
      },
      {
        name: "Цветок",
        closed: "/app/9-цветок.png",
        itemId: "tsvetok",
        noHover: true,
      },
      {
        name: "Прихожая",
        closed: "/app/9-прихожая-закрыта-с.png",
        open: "/app/9-прихожая-открыта-с.png",
        price: 3200,
        itemId: "prihozhaya",
      },
      { name: "Зеркало", closed: "/app/3-зеркало.png", itemId: "zerkalo" },
      {
        name: "Картина",
        closed: "/app/14-картина-1.png",
        itemId: "kartina-prihozhaya",
        noHover: true,
      },
    ],
  },
];

const shouldWiggleIcon = (iconName: string) => {
  const lower = iconName.toLowerCase();
  return (
    lower.includes("стул") ||
    lower.includes("стол") ||
    lower.includes("кресло") ||
    lower.includes("диван") ||
    lower.includes("кровать")
  );
};

const GalleryIcon: React.FC<{
  name: string;
  closed: string;
  open?: string;
  price?: number;
  onHover: (
    hovered: boolean,
    name: string,
    displayName?: string,
    price?: number
  ) => void;
  onClick?: (
    name: string,
    price?: number,
    event?: React.MouseEvent,
    itemId?: string,
    displayName?: string
  ) => void;
  displayName?: string;
  isClicked?: boolean;
  disableAnimation?: boolean;
  inheritCursor?: boolean;
  itemId: string;
  noHover?: boolean;
  shouldWiggle?: boolean;
}> = ({
  name,
  closed,
  open,
  price,
  onHover,
  onClick = () => {},
  displayName,
  isClicked = false,
  disableAnimation = false,
  inheritCursor = false,
  itemId,
  noHover = false,
  shouldWiggle = false,
}) => {
  const [hovered, setHovered] = React.useState(false);
  const src = open && (hovered || isClicked) ? open : closed;
  const wiggle =
    !disableAnimation &&
    (hovered || isClicked || shouldWiggle) &&
    shouldWiggleIcon(name);

  const classes = [
    "pricing-icon",
    wiggle ? "pricing-icon--wiggle" : "",
    isClicked ? "pricing-icon--clicked" : "",
    inheritCursor ? "pricing-icon--inherit-cursor" : "",
    noHover ? "pricing-icon--no-hover" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const isClickable = !!price && !inheritCursor;

  return (
    <div
      role={isClickable ? "button" : "img"}
      tabIndex={isClickable ? 0 : undefined}
      aria-pressed={isClicked || undefined}
      onMouseEnter={() => {
        if (!noHover) {
          setHovered(true);
          onHover(true, name, displayName, price);
        }
      }}
      onMouseLeave={() => {
        if (!noHover) {
          setHovered(false);
          onHover(false, name, displayName, price);
        }
      }}
      onClick={(e) => {
        if (isClickable) onClick(name, price, e, itemId, displayName);
      }}
      onKeyDown={(e) => {
        if (isClickable && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick(name, price);
        }
      }}
      className={classes}
      data-item-id={itemId}
      data-clickable={isClickable ? "true" : undefined}
    >
      {open ? (
        <img
          src={src}
          alt={displayName || name}
          className="pricing-icon__img"
          draggable={false}
        />
      ) : (
        <motion.img
          src={src}
          alt={displayName || name}
          className="pricing-icon__img"
          draggable={false}
          animate={
            wiggle
              ? { x: [0, -8, 8, -8, 8, 0], rotate: [-7, 7, -7, 7, 0] }
              : { x: 0, rotate: 0 }
          }
          transition={
            wiggle
              ? { duration: 0.5, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }
              : { duration: 0 }
          }
        />
      )}
    </div>
  );
};

const PricingBadge: React.FC<{
  item: {
    id: string;
    name: string;
    price: number;
    itemId: string;
    uniqueKey: string;
  };
  index: number;
  topOffset: number;
  leftOffset: number;
  sectionRef: React.RefObject<HTMLDivElement>;
  badgeId: string;
}> = ({ item, index, topOffset, leftOffset, sectionRef, badgeId }) => {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const updatePosition = () => {
      let targetItemId = item.itemId;
      if (item.itemId === "stul-lev" || item.itemId === "stul-prav")
        targetItemId = "stol-kuhnya";

      const iconElement = document.querySelector(
        `[data-item-id="${targetItemId}"]`
      ) as HTMLElement;
      if (!iconElement || !sectionRef.current) return;

      const iconRect = iconElement.getBoundingClientRect();
      const scaleLayerRect = sectionRef.current.getBoundingClientRect();

      const computedStyle = window.getComputedStyle(sectionRef.current);
      const transform = computedStyle.transform;
      let currentScale = 1;

      if (transform && transform !== "none") {
        const matrix = transform.match(/matrix\(([^)]+)\)/);
        if (matrix) {
          const values = matrix[1].split(",").map(parseFloat);
          currentScale = values[0];
        }
      }

      const iconCenterX = iconRect.left + iconRect.width / 2;
      const iconCenterY = iconRect.top + iconRect.height / 2;
      const x = (iconCenterX - scaleLayerRect.left) / currentScale;
      const y = (iconCenterY - scaleLayerRect.top) / currentScale;

      setPosition({ x, y });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [item.itemId, sectionRef]);

  return (
    <motion.div
      className="pricing-badge"
      data-badge-id={badgeId}
      style={{
        left: position.x + leftOffset,
        top: position.y + topOffset,
        zIndex: 10000 + index,
      }}
      initial={{ opacity: 0, scale: 0, y: 80, rotate: 0 }}
      animate={{
        opacity: [0, 1, 1],
        scale: [0, 1.3, 1],
        y: 0,
        rotate: [0, -15, 10, -5, 0],
      }}
      exit={{ opacity: 0, scale: 0, y: 40, rotate: 15 }}
      transition={{
        duration: 0.4,
        ease: [0.25, 1, 0.5, 1],
        scale: {
          duration: 0.35,
          times: [0, 0.7, 1],
          ease: [0.68, -0.55, 0.265, 1.55],
        },
        y: { duration: 0.35, ease: [0.68, -0.55, 0.265, 1.55] },
        rotate: {
          duration: 0.5,
          times: [0, 0.25, 0.5, 0.75, 1],
          ease: [0.34, 1.56, 0.64, 1],
        },
        opacity: { duration: 0.2, times: [0, 0.5, 1] },
      }}
    >
      <div className="card-adaptive pricing-badge__card">
        <div className="pricing-badge__title">{item.name}</div>
        <div className="pricing-badge__price">от {item.price} ₽</div>
      </div>
    </motion.div>
  );
};

const AllIconsGallery: React.FC<{
  sectionRef: React.RefObject<HTMLDivElement>;
  clickedItemsInfo: Array<{
    id: string;
    name: string;
    price: number;
    itemId: string;
    uniqueKey: string;
  }>;
  setClickedItemsInfo: React.Dispatch<
    React.SetStateAction<
      Array<{
        id: string;
        name: string;
        price: number;
        itemId: string;
        uniqueKey: string;
      }>
    >
  >;
  clickedItems: Set<string>;
  setClickedItems: React.Dispatch<React.SetStateAction<Set<string>>>;
  isMobile?: boolean;
}> = ({
  sectionRef,
  clickedItemsInfo,
  setClickedItemsInfo,
  clickedItems,
  setClickedItems,
  isMobile = false,
}) => {
  const isElementClicked = (itemId: string) =>
    clickedItemsInfo.some((item) => item.uniqueKey === itemId);

  const [hoveredGroupIndex, setHoveredGroupIndex] = React.useState<
    number | null
  >(null);
  const [hoveredIconName, setHoveredIconName] = React.useState<string | null>(
    null
  );
  const [isShelfHovered, setIsShelfHovered] = React.useState(false);
  const shelfControls = useAnimation();
  const [catAnimationState, setCatAnimationState] = React.useState<
    "idle" | "playing"
  >("idle");

  const isKitchenChairsHovered =
    hoveredGroupIndex === 3 &&
    (hoveredIconName === "Стул левый" || hoveredIconName === "Стул правый");

  const handleClick = (
    name: string,
    price?: number,
    event?: React.MouseEvent,
    itemId?: string,
    displayName?: string
  ) => {
    if (price && event && itemId) {
      const uniqueKey = itemId;
      const displayedName = displayName || name;
      const existingItem = clickedItemsInfo.find(
        (item) => item.uniqueKey === uniqueKey
      );

      if (existingItem) {
        setClickedItemsInfo((prev) => [
          ...prev.filter((item) => item !== existingItem),
          existingItem,
        ]);
      } else {
        setClickedItems((prev) => new Set(prev).add(uniqueKey));
        const id = `${uniqueKey}-${Date.now()}`;
        setClickedItemsInfo((prev) => [
          ...prev,
          { id, name: displayedName, price, itemId, uniqueKey },
        ]);

        if (uniqueKey === "stol-detskaya") {
          const chairKey = "kreslo-detskaya";
          const chairExists = clickedItemsInfo.find(
            (item) => item.uniqueKey === chairKey
          );
          if (!chairExists) {
            setClickedItems((prev) => new Set(prev).add(chairKey));
            const chairId = `${chairKey}-${Date.now()}`;
            setClickedItemsInfo((prev) => [
              ...prev,
              {
                id: chairId,
                name: "Компьютерное кресло",
                price: 500,
                itemId: chairKey,
                uniqueKey: chairKey,
              },
            ]);
          }
        }
      }
    }
  };

  const handleHover = (hovered: boolean, name: string) => {
    setHoveredIconName(hovered ? name : null);
  };

  const handleShelfHover = () => {
    setIsShelfHovered(true);
    const icon = ICON_GROUPS[1].icons.find((i) => i.name === "Полка");
    if (icon) {
      handleHover(true, "Полка");
      setHoveredGroupIndex(1);
    }
    shelfControls.start({
      x: [0, -8, 8, -8, 8, 0],
      rotate: [-7, 7, -7, 7, 0],
      scale: [1, 1.08, 1.08, 1.08, 1.08, 1.08],
      transition: { duration: 0.5, times: [0, 0.2, 0.4, 0.6, 0.8, 1] },
    });
  };

  const handleShelfLeave = () => {
    setIsShelfHovered(false);
    handleHover(false, "Полка");
    setHoveredGroupIndex(null);
    shelfControls.start({
      x: 0,
      rotate: 0,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    });
  };

  const handleShelfClick = (e: React.MouseEvent) => {
    const icon = ICON_GROUPS[1].icons.find((i) => i.name === "Полка");
    if (icon?.price)
      handleClick("Полка", icon.price, e, icon.itemId, icon.displayName);
  };

  const handleCatClick = () => {
    if (catAnimationState === "idle") setCatAnimationState("playing");
  };
  const handleCatAnimationComplete = () => {
    setCatAnimationState("idle");
  };

  const catFrameRange = React.useMemo(
    () =>
      catAnimationState === "playing"
        ? { start: 3, end: 9 }
        : { start: 0, end: 2 },
    [catAnimationState]
  );
  const catLoopSegments = React.useMemo(
    () =>
      catAnimationState === "playing"
        ? [{ startIndex: 7, endIndex: 9, times: 3 }]
        : [],
    [catAnimationState]
  );
  const catBaseFps = React.useMemo(
    () => (catAnimationState === "playing" ? 32 : 24),
    [catAnimationState]
  );

  return (
    <>
      <div className="pricing-grid">
        {}
        <div
          className="pricing-column"
          onMouseEnter={() => setHoveredGroupIndex(0)}
          onMouseLeave={() => setHoveredGroupIndex(null)}
        >
          <h3 className="pricing-room-title">{ICON_GROUPS[0].room}</h3>
          <div className="pricing-row">
            {ICON_GROUPS[0].icons.map((icon) => (
              <div key={icon.itemId} className="pricing-row-item">
                <GalleryIcon
                  {...icon}
                  onHover={handleHover}
                  onClick={handleClick}
                  isClicked={isElementClicked(icon.itemId)}
                />
                {isMobile && icon.price != null && (
                  <div className="pricing-item-badge-mobile">
                    <span className="pricing-item-badge-mobile__title">
                      {icon.displayName ?? icon.name}
                    </span>
                    <span className="pricing-item-badge-mobile__price">
                      от {icon.price} ₽
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {}
        <div
          className="pricing-column"
          onMouseEnter={() => setHoveredGroupIndex(1)}
          onMouseLeave={() => setHoveredGroupIndex(null)}
        >
          <h3 className="pricing-room-title">{ICON_GROUPS[1].room}</h3>
          <div data-layout="shelf-container" style={{ width: "100%" }}>
            <div
              className="shelf-wrapper"
              data-clickable="true"
              data-interactive="true"
              onMouseEnter={handleShelfHover}
              onMouseLeave={handleShelfLeave}
              onClick={handleShelfClick}
            >
              <motion.div
                animate={shelfControls}
                className={`shelf-motion-container ${
                  isShelfHovered ? "shelf-motion-container--hovered" : ""
                }`}
              >
                <div className="shelf-icon-wrapper">
                  {ICON_GROUPS[1].icons
                    .filter((icon) => icon.name === "Полка")
                    .map((icon) => (
                      <div key={icon.itemId} className="pricing-row-item">
                        <GalleryIcon
                          {...icon}
                          onHover={() => {}}
                          onClick={handleClick}
                          isClicked={isElementClicked(icon.itemId)}
                          disableAnimation
                          inheritCursor
                        />
                        {isMobile && icon.price != null && (
                          <div className="pricing-item-badge-mobile">
                            <span className="pricing-item-badge-mobile__title">
                              {icon.displayName ?? icon.name}
                            </span>
                            <span className="pricing-item-badge-mobile__price">
                              от {icon.price} ₽
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
                <div className="shelf-car-container">
                  <div className="shelf-car-wrapper">
                    <img
                      src="/app/машинка.png"
                      alt="Машинка"
                      className="shelf-car-img"
                    />
                    <div
                      className={`shelf-car-shadow ${
                        isShelfHovered ? "shelf-car-shadow--hovered" : ""
                      }`}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          <div className="pricing-row">
            {ICON_GROUPS[1].icons
              .filter((icon) => icon.name !== "Полка")
              .map((icon) => (
                <div key={icon.itemId} className="pricing-row-item">
                  <GalleryIcon
                    {...icon}
                    onHover={handleHover}
                    onClick={handleClick}
                    isClicked={isElementClicked(icon.itemId)}
                  />
                  {isMobile && icon.price != null && (
                    <div className="pricing-item-badge-mobile">
                      <span className="pricing-item-badge-mobile__title">
                        {icon.displayName ?? icon.name}
                      </span>
                      <span className="pricing-item-badge-mobile__price">
                        от {icon.price} ₽
                      </span>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>

        {}
        <div
          className="pricing-column"
          onMouseEnter={() => setHoveredGroupIndex(4)}
          onMouseLeave={() => setHoveredGroupIndex(null)}
        >
          <h3 className="pricing-room-title">{ICON_GROUPS[4].room}</h3>
          <div className="pricing-row">
            {ICON_GROUPS[4].icons.map((icon) => (
              <div key={icon.itemId} className="pricing-row-item">
                <GalleryIcon
                  {...icon}
                  onHover={handleHover}
                  onClick={handleClick}
                  isClicked={isElementClicked(icon.itemId)}
                />
                {isMobile && icon.price != null && (
                  <div className="pricing-item-badge-mobile">
                    <span className="pricing-item-badge-mobile__title">
                      {icon.displayName ?? icon.name}
                    </span>
                    <span className="pricing-item-badge-mobile__price">
                      от {icon.price} ₽
                    </span>
                  </div>
                )}
              </div>
            ))}
            <div
              className="cat-container"
              data-clickable="true"
              onClick={handleCatClick}
            >
              <SmoothFrameAnimation
                images={animation7Frames}
                className="cat-animation"
                width={120}
                height={120}
                baseFps={catBaseFps}
                frameRange={catFrameRange}
                pingPong={catAnimationState === "idle"}
                loopSegments={catLoopSegments}
                playReverseAfterLoop={catAnimationState === "playing"}
                onAnimationComplete={
                  catAnimationState === "playing"
                    ? handleCatAnimationComplete
                    : undefined
                }
                paused={false}
              />
            </div>
          </div>
        </div>

        {}
        <div
          className="pricing-column"
          onMouseEnter={() => setHoveredGroupIndex(3)}
          onMouseLeave={() => setHoveredGroupIndex(null)}
        >
          <h3 className="pricing-room-title">{ICON_GROUPS[3].room}</h3>
          <div className="pricing-row">
            <div className="pricing-row-item">
              <GalleryIcon
                {...ICON_GROUPS[3].icons[1]}
                onHover={handleHover}
                onClick={handleClick}
                isClicked={isElementClicked(ICON_GROUPS[3].icons[1].itemId)}
              />
              {isMobile && ICON_GROUPS[3].icons[1].price != null && (
                <div className="pricing-item-badge-mobile">
                  <span className="pricing-item-badge-mobile__title">
                    {ICON_GROUPS[3].icons[1].displayName ??
                      ICON_GROUPS[3].icons[1].name}
                  </span>
                  <span className="pricing-item-badge-mobile__price">
                    от {ICON_GROUPS[3].icons[1].price} ₽
                  </span>
                </div>
              )}
            </div>
            <div className="pricing-row-item kitchen-annotation-wrapper">
              <GalleryIcon
                {...ICON_GROUPS[3].icons[0]}
                onHover={handleHover}
                onClick={handleClick}
                isClicked={isElementClicked(ICON_GROUPS[3].icons[0].itemId)}
              />
              {isMobile && ICON_GROUPS[3].icons[0].price != null && (
                <div className="pricing-item-badge-mobile">
                  <span className="pricing-item-badge-mobile__title">
                    {ICON_GROUPS[3].icons[0].displayName ??
                      ICON_GROUPS[3].icons[0].name}
                  </span>
                  <span className="pricing-item-badge-mobile__price">
                    от {ICON_GROUPS[3].icons[0].price} ₽
                  </span>
                </div>
              )}
              {}
              <div className="kitchen-annotation-text">
                <span>кликните</span>
              </div>
              {}
              <div className="kitchen-annotation-arrow">
                <motion.div
                  animate={{ x: [0, -15, 0, -15, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.25, 0.5, 0.75, 1],
                  }}
                >
                  <Image
                    src="/images/icons/arrow.png"
                    alt="arrow"
                    width={150}
                    height={150}
                  />
                </motion.div>
              </div>
            </div>
            <div
              className="pricing-row-item"
              data-layout="kitchen-table-column"
            >
              <GalleryIcon
                {...ICON_GROUPS[3].icons[5]}
                onHover={handleHover}
                onClick={handleClick}
                isClicked={isElementClicked(ICON_GROUPS[3].icons[5].itemId)}
              />
              {isMobile && ICON_GROUPS[3].icons[5].price != null && (
                <div className="pricing-item-badge-mobile">
                  <span className="pricing-item-badge-mobile__title">
                    {ICON_GROUPS[3].icons[5].displayName ??
                      ICON_GROUPS[3].icons[5].name}
                  </span>
                  <span className="pricing-item-badge-mobile__price">
                    от {ICON_GROUPS[3].icons[5].price} ₽
                  </span>
                </div>
              )}
              <div data-layout="kitchen-chairs-row">
                <GalleryIcon
                  {...ICON_GROUPS[3].icons[2]}
                  onHover={handleHover}
                  onClick={handleClick}
                  isClicked={isElementClicked(ICON_GROUPS[3].icons[2].itemId)}
                  shouldWiggle={isKitchenChairsHovered}
                />
                {isMobile && ICON_GROUPS[3].icons[2].price != null && (
                  <div className="pricing-item-badge-mobile">
                    <span className="pricing-item-badge-mobile__title">
                      {ICON_GROUPS[3].icons[2].displayName ??
                        ICON_GROUPS[3].icons[2].name}
                    </span>
                    <span className="pricing-item-badge-mobile__price">
                      от {ICON_GROUPS[3].icons[2].price} ₽
                    </span>
                  </div>
                )}
                <GalleryIcon
                  {...ICON_GROUPS[3].icons[3]}
                  onHover={handleHover}
                  onClick={handleClick}
                  isClicked={isElementClicked(ICON_GROUPS[3].icons[3].itemId)}
                />
                {isMobile && ICON_GROUPS[3].icons[3].price != null && (
                  <div className="pricing-item-badge-mobile">
                    <span className="pricing-item-badge-mobile__title">
                      {ICON_GROUPS[3].icons[3].displayName ??
                        ICON_GROUPS[3].icons[3].name}
                    </span>
                    <span className="pricing-item-badge-mobile__price">
                      от {ICON_GROUPS[3].icons[3].price} ₽
                    </span>
                  </div>
                )}
                <GalleryIcon
                  {...ICON_GROUPS[3].icons[4]}
                  onHover={handleHover}
                  onClick={handleClick}
                  isClicked={isElementClicked(ICON_GROUPS[3].icons[4].itemId)}
                  shouldWiggle={isKitchenChairsHovered}
                />
                {isMobile && ICON_GROUPS[3].icons[4].price != null && (
                  <div className="pricing-item-badge-mobile">
                    <span className="pricing-item-badge-mobile__title">
                      {ICON_GROUPS[3].icons[4].displayName ??
                        ICON_GROUPS[3].icons[4].name}
                    </span>
                    <span className="pricing-item-badge-mobile__price">
                      от {ICON_GROUPS[3].icons[4].price} ₽
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {}
        <div
          className="pricing-column"
          onMouseEnter={() => setHoveredGroupIndex(2)}
          onMouseLeave={() => setHoveredGroupIndex(null)}
        >
          <h3 className="pricing-room-title">{ICON_GROUPS[2].room}</h3>
          <div className="pricing-row">
            <div className="pricing-row-item">
              <GalleryIcon
                {...ICON_GROUPS[2].icons[1]}
                onHover={handleHover}
                onClick={handleClick}
                isClicked={isElementClicked(ICON_GROUPS[2].icons[1].itemId)}
              />
              {isMobile && ICON_GROUPS[2].icons[1].price != null && (
                <div className="pricing-item-badge-mobile">
                  <span className="pricing-item-badge-mobile__title">
                    {ICON_GROUPS[2].icons[1].displayName ??
                      ICON_GROUPS[2].icons[1].name}
                  </span>
                  <span className="pricing-item-badge-mobile__price">
                    от {ICON_GROUPS[2].icons[1].price} ₽
                  </span>
                </div>
              )}
            </div>
            <div className="pricing-row-item" data-layout="clock-sofa-column">
              <GalleryIcon
                {...ICON_GROUPS[2].icons[3]}
                onHover={handleHover}
                onClick={handleClick}
                isClicked={isElementClicked(ICON_GROUPS[2].icons[3].itemId)}
              />
              {isMobile && ICON_GROUPS[2].icons[3].price != null && (
                <div className="pricing-item-badge-mobile">
                  <span className="pricing-item-badge-mobile__title">
                    {ICON_GROUPS[2].icons[3].displayName ??
                      ICON_GROUPS[2].icons[3].name}
                  </span>
                  <span className="pricing-item-badge-mobile__price">
                    от {ICON_GROUPS[2].icons[3].price} ₽
                  </span>
                </div>
              )}
              <GalleryIcon
                {...ICON_GROUPS[2].icons[2]}
                onHover={handleHover}
                onClick={handleClick}
                isClicked={isElementClicked(ICON_GROUPS[2].icons[2].itemId)}
              />
              {isMobile && ICON_GROUPS[2].icons[2].price != null && (
                <div className="pricing-item-badge-mobile">
                  <span className="pricing-item-badge-mobile__title">
                    {ICON_GROUPS[2].icons[2].displayName ??
                      ICON_GROUPS[2].icons[2].name}
                  </span>
                  <span className="pricing-item-badge-mobile__price">
                    от {ICON_GROUPS[2].icons[2].price} ₽
                  </span>
                </div>
              )}
            </div>
            <div className="pricing-row-item">
              <GalleryIcon
                {...ICON_GROUPS[2].icons[5]}
                onHover={handleHover}
                onClick={handleClick}
                isClicked={isElementClicked(ICON_GROUPS[2].icons[5].itemId)}
              />
              {isMobile && ICON_GROUPS[2].icons[5].price != null && (
                <div className="pricing-item-badge-mobile">
                  <span className="pricing-item-badge-mobile__title">
                    {ICON_GROUPS[2].icons[5].displayName ??
                      ICON_GROUPS[2].icons[5].name}
                  </span>
                  <span className="pricing-item-badge-mobile__price">
                    от {ICON_GROUPS[2].icons[5].price} ₽
                  </span>
                </div>
              )}
            </div>
            <div className="pricing-row-item">
              <GalleryIcon
                {...ICON_GROUPS[2].icons[0]}
                onHover={handleHover}
                onClick={handleClick}
                isClicked={isElementClicked(ICON_GROUPS[2].icons[0].itemId)}
              />
              {isMobile && ICON_GROUPS[2].icons[0].price != null && (
                <div className="pricing-item-badge-mobile">
                  <span className="pricing-item-badge-mobile__title">
                    {ICON_GROUPS[2].icons[0].displayName ??
                      ICON_GROUPS[2].icons[0].name}
                  </span>
                  <span className="pricing-item-badge-mobile__price">
                    от {ICON_GROUPS[2].icons[0].price} ₽
                  </span>
                </div>
              )}
            </div>
            <div className="pricing-row-item">
              <GalleryIcon
                {...ICON_GROUPS[2].icons[4]}
                onHover={handleHover}
                onClick={handleClick}
                isClicked={isElementClicked(ICON_GROUPS[2].icons[4].itemId)}
              />
              {isMobile && ICON_GROUPS[2].icons[4].price != null && (
                <div className="pricing-item-badge-mobile">
                  <span className="pricing-item-badge-mobile__title">
                    {ICON_GROUPS[2].icons[4].displayName ??
                      ICON_GROUPS[2].icons[4].name}
                  </span>
                  <span className="pricing-item-badge-mobile__price">
                    от {ICON_GROUPS[2].icons[4].price} ₽
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const InteractivePriceGallery: React.FC<
  InteractivePriceGalleryProps
> = ({
  sectionId,
  pricingTitleTiltX,
  pricingTitleTiltY,
  pricingTitleScale,
  onPricingTitleVisible,
}) => {
  const { isMobile } = useResponsive();
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const scaleLayerRef = React.useRef<HTMLDivElement | null>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });
  const headingRef = React.useRef<HTMLHeadingElement | null>(null);
  const headingInView = useInView(headingRef, { once: true, amount: 0.2 });
  const rollControls = useAnimation();
  const revealControls = useAnimation();
  const [clickedItems, setClickedItems] = React.useState<Set<string>>(
    new Set()
  );
  const [clickedItemsInfo, setClickedItemsInfo] = React.useState<
    Array<{
      id: string;
      name: string;
      price: number;
      itemId: string;
      uniqueKey: string;
    }>
  >([]);
  const [screenWidth, setScreenWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 3440
  );

  React.useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    if (!inView) return;
    rollControls.start({
      x: "calc(100vw - 200px)",
      transition: { duration: 0.75, ease: "easeOut" },
    });
    revealControls.start({
      clipPath: "inset(-100vmax 0% -100vmax 0)",
      transition: { duration: 0.75, ease: "easeOut" },
    });
  }, [inView, rollControls, revealControls]);

  React.useEffect(() => {
    if (headingInView && onPricingTitleVisible) onPricingTitleVisible(true);
  }, [headingInView, onPricingTitleVisible]);

  const getBadgeOffsets = (item: { name: string; uniqueKey: string }) => {
    if (screenWidth <= 1920) {
      let topOffset = -70,
        leftOffset = -20;
      if (item.name === "Полка") {
        topOffset = -100;
        leftOffset = -140;
      } else if (item.name === "Кровать") {
        topOffset = -160;
        leftOffset = -80;
      } else if (
        item.uniqueKey === "shkaf-spalnya" ||
        item.name === "Шкаф двустворчатый"
      ) {
        topOffset = -170;
        leftOffset = -120;
      } else if (item.name === "Тумбочка") {
        topOffset = -155;
        leftOffset = -53;
      } else if (
        item.uniqueKey === "tumbochka-detskaya" ||
        item.name === "ТВ тумба"
      ) {
        topOffset = -140;
        leftOffset = -70;
      } else if (
        item.uniqueKey === "stol-detskaya" ||
        item.name === "Компьютерный стол"
      ) {
        topOffset = -130;
        leftOffset = -100;
      } else if (item.uniqueKey === "kreslo-detskaya") {
        topOffset = 295;
        leftOffset = 850;
      } else if (item.uniqueKey === "penal") {
        topOffset = -175;
        leftOffset = -80;
      } else if (item.uniqueKey === "stol-kuhnya") {
        topOffset = -160;
        leftOffset = 18;
      } else if (item.name === "Стулья") {
        topOffset = -162;
        leftOffset = -160;
      } else if (item.name === "Кухня") {
        topOffset = -190;
        leftOffset = -78;
      } else if (item.name === "Диван") {
        topOffset = -200;
        leftOffset = -70;
      } else if (item.uniqueKey === "shkaf-gostinaya") {
        topOffset = -185;
        leftOffset = -130;
      } else if (item.name === "Гостиная") {
        topOffset = -170;
        leftOffset = -76;
      } else if (item.name === "Кресло") {
        topOffset = -142;
        leftOffset = -75;
      } else if (item.name === "Комод") {
        topOffset = -215;
        leftOffset = -76;
      } else if (item.name === "Прихожая") {
        topOffset = -180;
        leftOffset = -86;
      } else if (item.name === "Цветок") topOffset = -50;
      return { topOffset, leftOffset };
    }

    let topOffset = -110,
      leftOffset = -35;
    if (item.name === "Полка") topOffset = -100;
    else if (item.name === "Кровать") {
      topOffset = -230;
      leftOffset = -98;
    } else if (
      item.uniqueKey === "shkaf-spalnya" ||
      item.name === "Шкаф двустворчатый"
    ) {
      topOffset = -250;
      leftOffset = -158;
    } else if (item.name === "Тумбочка") {
      topOffset = -220;
      leftOffset = -58;
    } else if (
      item.uniqueKey === "tumbochka-detskaya" ||
      item.name === "ТВ тумба"
    ) {
      topOffset = -190;
      leftOffset = -88;
    } else if (
      item.uniqueKey === "stol-detskaya" ||
      item.name === "Компьютерный стол"
    ) {
      topOffset = -175;
      leftOffset = -140;
    } else if (item.uniqueKey === "kreslo-detskaya") {
      topOffset = 420;
      leftOffset = 1610;
    } else if (item.uniqueKey === "penal") {
      topOffset = -255;
      leftOffset = -120;
    } else if (item.uniqueKey === "stol-kuhnya") {
      topOffset = -222;
      leftOffset = 50;
    } else if (item.name === "Стулья") {
      topOffset = -235;
      leftOffset = -250;
    } else if (item.name === "Кухня") {
      topOffset = -250;
      leftOffset = -85;
    } else if (item.name === "Диван") {
      topOffset = -300;
      leftOffset = -88;
    } else if (item.uniqueKey === "shkaf-gostinaya") {
      topOffset = -240;
      leftOffset = -160;
    } else if (item.name === "Гостиная") {
      topOffset = -230;
      leftOffset = -100;
    } else if (item.name === "Кресло") {
      topOffset = -200;
      leftOffset = -98;
    } else if (item.name === "Комод") {
      topOffset = -330;
      leftOffset = -100;
    } else if (item.name === "Прихожая") {
      topOffset = -175;
      leftOffset = -350;
    } else if (item.name === "Цветок") topOffset = -90;

    return { topOffset, leftOffset };
  };

  const getBadgeId = (item: { uniqueKey: string }) => {
    return item.uniqueKey;
  };

  return (
    <section
      id={sectionId || "pricing-gallery"}
      ref={sectionRef}
      className="pricing-gallery-section"
      aria-labelledby={`${sectionId ?? "pricing-gallery"}-title`}
    >
      <motion.div
        className="pricing-blueprint-bg"
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={revealControls}
        aria-hidden
      />
      <motion.div
        className="pricing-roll"
        initial={{ x: 0 }}
        animate={rollControls}
        aria-hidden
      >
        <div className="pricing-roll__texture" />
        <div className="pricing-roll__shadow" />
        <div className="pricing-roll__edge" />
      </motion.div>
      <motion.div
        ref={scaleLayerRef}
        className="pricing-scale-layer"
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={revealControls}
      >
        <div className="pricing-container">
          <div className="pricing-heading">
            <motion.h3
              id={`${sectionId ?? "pricing-gallery"}-title`}
              ref={headingRef}
              className="pricing-main-title"
              style={{
                rotateX: pricingTitleTiltX,
                rotateY: pricingTitleTiltY,
                scale: pricingTitleScale,
              }}
              animate={{
                scale: [1, 1.05, 1],
                textShadow: [
                  "0 0 0px #ffc700",
                  "0 0 20px #ffc700",
                  "0 0 0px #ffc700",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.span
                className="title-left"
                initial={{
                  x: -220,
                  opacity: 0,
                  rotate: -6,
                  filter: "blur(6px)",
                }}
                animate={
                  headingInView
                    ? {
                        x: 0,
                        opacity: 1,
                        rotate: 0,
                        filter: "blur(0px)",
                        scale: [1, 1.08, 1],
                        textShadow: [
                          "0 0 0px #ffc700",
                          "0 0 15px #ffc700",
                          "0 0 0px #ffc700",
                        ],
                      }
                    : {}
                }
                transition={{
                  type: "tween",
                  duration: 0.35,
                  ease: "easeOut",
                  scale: {
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  },
                  textShadow: {
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  },
                }}
              >
                НАШИ
              </motion.span>
              <motion.div
                className="title-center"
                initial={{
                  y: -240,
                  opacity: 0,
                  rotate: 0,
                  scale: 0.9,
                  filter: "blur(8px)",
                }}
                animate={
                  headingInView
                    ? { y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }
                    : {}
                }
                transition={{ type: "tween", duration: 0.35, ease: "easeOut" }}
              >
                <TitleAnimation />
              </motion.div>
              <motion.span
                className="title-right"
                initial={{ x: 220, opacity: 0, rotate: 6, filter: "blur(6px)" }}
                animate={
                  headingInView
                    ? {
                        x: 0,
                        opacity: 1,
                        rotate: 0,
                        filter: "blur(0px)",
                        scale: [1, 1.08, 1],
                        textShadow: [
                          "0 0 0px #ffc700",
                          "0 0 15px #ffc700",
                          "0 0 0px #ffc700",
                        ],
                      }
                    : {}
                }
                transition={{
                  type: "tween",
                  duration: 0.35,
                  ease: "easeOut",
                  scale: {
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.2,
                  },
                  textShadow: {
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.2,
                  },
                }}
              >
                ЦЕНЫ
              </motion.span>
            </motion.h3>
          </div>
          <AllIconsGallery
            sectionRef={scaleLayerRef}
            clickedItemsInfo={clickedItemsInfo}
            setClickedItemsInfo={setClickedItemsInfo}
            clickedItems={clickedItems}
            setClickedItems={setClickedItems}
            isMobile={isMobile}
          />
        </div>
        {!isMobile && (
          <AnimatePresence>
            {clickedItemsInfo.map((item, index) => {
              const { topOffset, leftOffset } = getBadgeOffsets(item);
              const badgeId = getBadgeId(item);
              return (
                <PricingBadge
                  key={item.id}
                  item={item}
                  index={index}
                  topOffset={topOffset}
                  leftOffset={leftOffset}
                  sectionRef={scaleLayerRef}
                  badgeId={badgeId}
                />
              );
            })}
          </AnimatePresence>
        )}
      </motion.div>
    </section>
  );
};

export default InteractivePriceGallery;
