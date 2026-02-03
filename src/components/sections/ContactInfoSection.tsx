import React, { useRef, useEffect, useState, useMemo } from "react";
import CosmicNebulaMastercard from "@/components/ui/cursor-wander-card";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
  useInView,
} from "framer-motion";
import Image from "next/image";
import { useRegion } from "@/contexts/RegionContext";

export const ContactInfoSection: React.FC<{ sectionId?: string }> = ({
  sectionId = "contacts",
}) => {
  const transX = useMotionValue(0);
  const transY = useMotionValue(0);
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);

  const smoothX = useSpring(transX, { stiffness: 120, damping: 18 });
  const smoothY = useSpring(transY, { stiffness: 120, damping: 18 });
  const smoothTiltX = useSpring(tiltX, { stiffness: 140, damping: 22 });
  const smoothTiltY = useSpring(tiltY, { stiffness: 140, damping: 22 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2; // -1..1
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      const AMP_T = 20; // px translation
      const AMP_TILT = 10; // degrees tilt
      transX.set(nx * AMP_T);
      transY.set(ny * AMP_T);
      tiltX.set(ny * AMP_TILT);
      tiltY.set(-nx * AMP_TILT);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [transX, transY, tiltX, tiltY]);

  const titleTiltX = useMotionValue(0);
  const titleTiltY = useMotionValue(0);
  const titleScale = useMotionValue(1);
  const smoothTitleTiltX = useSpring(titleTiltX, {
    stiffness: 140,
    damping: 30,
  });
  const smoothTitleTiltY = useSpring(titleTiltY, {
    stiffness: 140,
    damping: 30,
  });
  const smoothTitleScale = useSpring(titleScale, {
    stiffness: 120,
    damping: 20,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      const ampTilt = 12;
      titleTiltX.set(ny * ampTilt);
      titleTiltY.set(-nx * ampTilt);
      const dist = Math.min(1, Math.sqrt(nx * nx + ny * ny));
      titleScale.set(1 + 0.04 * dist);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [titleTiltX, titleTiltY, titleScale]);

  const factors = [1, 0.8, 1.2, 0.6];
  const xVals = [
    useTransform(smoothX, (v) => v * factors[0]),
    useTransform(smoothX, (v) => v * factors[1]),
    useTransform(smoothX, (v) => v * factors[2]),
    useTransform(smoothX, (v) => v * factors[3]),
  ];
  const yVals = [
    useTransform(smoothY, (v) => v * factors[0]),
    useTransform(smoothY, (v) => v * factors[1]),
    useTransform(smoothY, (v) => v * factors[2]),
    useTransform(smoothY, (v) => v * factors[3]),
  ];
  const tiltXVals = [
    useTransform(smoothTiltX, (v) => v * factors[0]),
    useTransform(smoothTiltX, (v) => v * factors[1]),
    useTransform(smoothTiltX, (v) => v * factors[2]),
    useTransform(smoothTiltX, (v) => v * factors[3]),
  ];
  const tiltYVals = [
    useTransform(smoothTiltY, (v) => v * factors[0]),
    useTransform(smoothTiltY, (v) => v * factors[1]),
    useTransform(smoothTiltY, (v) => v * factors[2]),
    useTransform(smoothTiltY, (v) => v * factors[3]),
  ];

  const hoursX = useTransform(smoothX, (v) => v * 0.6);
  const hoursY = useTransform(smoothY, (v) => v * 0.6);
  const hoursTiltX = useTransform(smoothTiltX, (v) => v * 0.6);
  const hoursTiltY = useTransform(smoothTiltY, (v) => v * 0.6);

  const floatOffset0 = useMotionValue(0);
  const floatOffset1 = useMotionValue(0);
  const floatOffset2 = useMotionValue(0);
  const floatOffset3 = useMotionValue(0);
  const floatOffsets = useMemo(
    () => [floatOffset0, floatOffset1, floatOffset2, floatOffset3],
    [floatOffset0, floatOffset1, floatOffset2, floatOffset3]
  );
  const combinedYVals = [
    useTransform(
      [yVals[0], floatOffsets[0]],
      ([cursorY, floatY]) => (cursorY as number) + (floatY as number)
    ),
    useTransform(
      [yVals[1], floatOffsets[1]],
      ([cursorY, floatY]) => (cursorY as number) + (floatY as number)
    ),
    useTransform(
      [yVals[2], floatOffsets[2]],
      ([cursorY, floatY]) => (cursorY as number) + (floatY as number)
    ),
    useTransform(
      [yVals[3], floatOffsets[3]],
      ([cursorY, floatY]) => (cursorY as number) + (floatY as number)
    ),
  ];

  useEffect(() => {
    const controls = floatOffsets.map((offset, i) =>
      animate(offset, [0, -8, 0, 8, 0], {
        duration: 12 - i, // разные скорости: 12,11,10,9
        repeat: Infinity,
        ease: "easeInOut",
      })
    );
    return () => controls.forEach((c) => c.stop && c.stop());
  }, [floatOffsets]);

  const [activeBounceBullet, setActiveBounceBullet] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBounceBullet((prev) => (prev + 1) % 4);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const titleInView = useInView(titleRef, { once: true, amount: 0.6 });
  const imageRef = useRef<HTMLSpanElement | null>(null);
  const imageInView = useInView(imageRef, { once: true, amount: 0.6 });

  const { activeRegion } = useRegion();

  return (
    <div
      id={sectionId}
      className="contact-info-section contact-info-wrapper w-full h-full flex flex-col pt-10 items-center" // контейнер центрирован
    >
      <h2
        ref={titleRef}
        className="section-title text-accent text-center mb-6 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 xl:translate-x-[460px]"
        style={{ position: "relative" }}
      >
        <span
          className="flex flex-col items-center md:items-start leading-tight text-center md:text-left"
          style={{
            position: "relative",
            transformStyle: "preserve-3d",
            perspective: 800,
          }}
        >
          <motion.span
            className="text-adaptive-hero-lg text-yellow-400"
            initial={{ rotateX: 90, opacity: 0 }}
            animate={{
              rotateX: titleInView ? 0 : 90,
              opacity: titleInView ? 1 : 0,
            }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{
              rotateX: smoothTitleTiltX,
              rotateY: smoothTitleTiltY,
              scale: smoothTitleScale,
              transformOrigin: "bottom center",
            }}
          >
            Наши
          </motion.span>
          <motion.span
            className="text-adaptive-hero-xl text-yellow-400"
            initial={{ rotateX: 90, opacity: 0 }}
            animate={{
              rotateX: titleInView ? 0 : 90,
              opacity: titleInView ? 1 : 0,
            }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.12,
            }}
            style={{
              rotateX: smoothTitleTiltX,
              rotateY: smoothTitleTiltY,
              scale: smoothTitleScale,
              transformOrigin: "bottom center",
            }}
          >
            контакты
          </motion.span>

          {}
        </span>
        {}
        <span ref={imageRef} className="relative inline-block">
          <motion.div
            initial={{ opacity: 0, filter: "blur(8px)" }}
            animate={
              imageInView ? { opacity: 1, filter: "blur(0px)" } : undefined
            }
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.28,
            }}
          >
            <Image
              src="/animation_transparent_400.webp"
              alt="Анимация"
              width={400}
              height={400}
              className="block w-[120px] h-[120px] sm:w-[160px] sm:h-[160px] md:w-[300px] md:h-[300px] lg:w-[400px] lg:h-[400px] object-contain"
            />
          </motion.div>

          {}
        </span>
      </h2>
      <motion.p
        className="text-center text-[#888888] text-xl md:text-3xl mb-6 xl:ml-[750px]"
        style={{
          x: hoursX,
          y: hoursY,
          rotateX: hoursTiltX,
          rotateY: hoursTiltY,
          transformStyle: "preserve-3d",
        }}
      >
        работаем с 10 до 22
      </motion.p>
      <div className="container mx-auto px-0 md:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-8 justify-center items-start">
          <div className="w-full max-w-[800px] mx-auto lg:mx-0  xl:mt-[80px]">
            <motion.div
              initial={{ opacity: 0, x: -200 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <CosmicNebulaMastercard
                cardholderName="SHELF SBORKA"
                logoText={{ topText: "SHELF", bottomText: "SBORKA" }}
                phone={activeRegion.mobileDisplay || activeRegion.phoneDisplay}
                whatsapp={activeRegion.whatsappDisplay}
                email={activeRegion.email}
                instagram={activeRegion.instagram}
                telegram={activeRegion.telegram}
              />
            </motion.div>
          </div>
          {}
          <motion.div
            initial={{ opacity: 0, x: 200 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="w-full max-w-[1000px] text-[#888888] font-furore text-2xl md:text-3xl leading-relaxed space-y-4 mt-0 lg:mt-[-50px] xl:ml-[960px]"
            style={{ perspective: "800px" }}
          >
            <motion.p
              className="flex flex-col md:flex-row items-start md:items-center gap-6"
              style={{
                x: xVals[0],
                y: combinedYVals[0],
                rotateX: tiltXVals[0],
                rotateY: tiltYVals[0],
                transformStyle: "preserve-3d",
              }}
            >
              <span className="icon-container">
                <Image
                  src="/images/icons/documents_icon_200.png"
                  alt="Заявка"
                  className={`icon-shield${
                    activeBounceBullet === 0 ? " bounce-check" : ""
                  }`}
                  width={172}
                  height={72}
                />
              </span>
              <span>
                Оставьте заявку любым удобным способом — мы ответим в течение
                рабочего дня и предложим ближайшее время для выезда мастеров.
              </span>
            </motion.p>
            <motion.p
              className="flex flex-col md:flex-row items-start md:items-center gap-6"
              style={{
                x: xVals[1],
                y: combinedYVals[1],
                rotateX: tiltXVals[1],
                rotateY: tiltYVals[1],
                transformStyle: "preserve-3d",
              }}
            >
              <span className="icon-container">
                <Image
                  src="/images/icons/phone_icon_200.png"
                  alt="Телефон"
                  className={`icon-alarm${
                    activeBounceBullet === 1 ? " bounce-check" : ""
                  }`}
                  width={72}
                  height={72}
                />
              </span>
              <span>
                Звонок по телефону поможет оперативно уточнить стоимость и
                согласовать время приезда.
              </span>
            </motion.p>
            <motion.p
              className="flex flex-col md:flex-row items-start md:items-center gap-6"
              style={{
                x: xVals[2],
                y: combinedYVals[2],
                rotateX: tiltXVals[2],
                rotateY: tiltYVals[2],
                transformStyle: "preserve-3d",
              }}
            >
              <span className="icon-container">
                <Image
                  src="/images/icons/camera_icon_200.png"
                  alt="Мессенджеры"
                  className={`icon-hammer${
                    activeBounceBullet === 2 ? " bounce-check" : ""
                  }`}
                  width={72}
                  height={72}
                />
              </span>
              <span>
                В WhatsApp или Telegram удобно отправить фотографии мебели — так
                мы заранее подберём нужные крепежи и инструмент.
              </span>
            </motion.p>
            <motion.p
              className="flex flex-col md:flex-row items-start md:items-center gap-6"
              style={{
                x: xVals[3],
                y: combinedYVals[3],
                rotateX: tiltXVals[3],
                rotateY: tiltYVals[3],
                transformStyle: "preserve-3d",
              }}
            >
              <span className="icon-container">
                <Image
                  src="/images/icons/at_icon_200.png"
                  alt="Почта"
                  className={`icon-ruble${
                    activeBounceBullet === 3 ? " bounce-check" : ""
                  }`}
                  width={72}
                  height={72}
                />
              </span>
              <span>
                Для подробных технических заданий или коммерческих предложений
                пишите на почту — менеджер быстро подготовит документы.
              </span>
            </motion.p>
          </motion.div>
          {}
        </div>
      </div>
    </div>
  );
};
