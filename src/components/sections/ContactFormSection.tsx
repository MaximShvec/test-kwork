"use client";

import type { FC } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { submitContactForm } from "@/actions/contact";
import { cn } from "@/lib/utils";
import { useRegion } from "@/contexts/RegionContext";
import { useResponsive } from "@/contexts/ResponsiveContext";
import { CartoonContract } from "./CartoonContract";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { InputMask } from "@react-input/mask";
import {
  motion,
  useMotionValue,
  useSpring,
  useInView,
  useTransform,
} from "framer-motion";
import { SmoothFrameAnimation } from "@/components/ui/smooth-frame-animation";
import Image from "next/image";

const formSchema = z.object({
  lastName: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 2, {
      message: "Фамилия должна содержать не менее 2 символов.",
    }),
  firstName: z.string().min(2, "Имя обязательно!"),
  middleName: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 2, {
      message: "Отчество должно содержать не менее 2 символов.",
    }),
  phone: z
    .string()
    .min(10, "Телефон обязателен!")
    .refine(
      (val) => {
        const digits = (val.match(/\d/g) || []).length;

        return digits === 11;
      },
      {
        message: "Телефон должен содержать 10 цифр!",
      }
    ),
});

type ContactFormValues = z.infer<typeof formSchema>;

interface ContactFormSectionProps {
  sectionId?: string;
}

const ANIMATION_FRAME_COUNT = 79; // Актуальное количество после удаления 2 кадров
const ANIMATION_PATH = "/animation3/";
const ANIMATION_PREFIX = "IMG_";
const ANIMATION_START = 6561;
const ANIMATION_END = 6641;
const ANIMATION_EXT = ".PNG";

const SKIP_FRAMES: number[] = [6568, 6575];

const getFrameNames = () => {
  const frames: string[] = [];
  for (let i = ANIMATION_START; i <= ANIMATION_END; i++) {
    if (SKIP_FRAMES.includes(i)) continue;
    frames.push(`${ANIMATION_PATH}${ANIMATION_PREFIX}${i}${ANIMATION_EXT}`);
  }
  return frames;
};

const PNGAnimation: React.FC<{ show: boolean; isMobile?: boolean }> =
  React.memo(({ show, isMobile }) => {
    const frames = useMemo(() => getFrameNames(), []);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: show ? 1 : 0 }}
        transition={{ duration: 0.7 }}
        style={{
          width: isMobile ? 200 : 400,
          height: isMobile ? 200 : 400,
          position: "absolute",
          ...(isMobile
            ? {
                right: 16,
                bottom: 80,
                left: "auto",
                top: "auto",
                transform: "none",
              }
            : { top: 0, left: 0, transform: "translate(-1300px, 500px)" }),
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        {show && (
          <SmoothFrameAnimation
            images={frames}
            baseFps={48}
            width={isMobile ? 200 : 400}
            height={isMobile ? 200 : 400}
            shouldLoop={true}
            speedRanges={[
              { startIndex: 0, endIndex: 20, multiplier: 0.7 },
              { startIndex: 21, endIndex: frames.length - 1, multiplier: 1.4 },
            ]}
          />
        )}
      </motion.div>
    );
  });

export const ContactFormSection: FC<ContactFormSectionProps> = ({
  sectionId = "order-form",
}) => {
  const { toast } = useToast();
  const { activeKey } = useRegion(); // Получаем текущий регион из контекста
  const { isMobile, screenWidth } = useResponsive();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lastName: "",
      firstName: "",
      middleName: "",
      phone: "",
    },
    mode: "onChange",
  });
  const [showStamp, setShowStamp] = useState(false);
  const [focus, setFocus] = useState({
    lastName: false,
    firstName: false,
    middleName: false,
    phone: false,
  });
  const [placeholders, setPlaceholders] = useState({
    lastName: "ВАША ФАМИЛИЯ",
    firstName: "ВАШЕ ИМЯ",
    middleName: "ВАШЕ ОТЧЕСТВО",
    phone: "ВАШ ТЕЛЕФОН",
  });
  const [showPulseBorder, setShowPulseBorder] = useState(true);
  const [activeBounceInput, setActiveBounceInput] = useState<number | null>(
    null
  );
  const [bounceActive, setBounceActive] = useState(false);
  const [hoveredField, setHoveredField] = useState<string | null>(null);

  const [activeBounceBullet, setActiveBounceBullet] = useState(0);
  useEffect(() => {
    const bounceCount = 4;
    const interval = setInterval(() => {
      setActiveBounceBullet((prev) => (prev + 1) % bounceCount);
    }, 1200);
    return () => clearInterval(interval);
  }, []);
  const bounceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const bounceIdxRef = useRef(0);
  const [isContractHovered, setIsContractHovered] = useState(false);
  const [submittedValues, setSubmittedValues] = useState<{
    lastName?: string;
    firstName: string;
    middleName?: string;
  } | null>(null);

  const bounceFields = [
    "lastName",
    "firstName",
    "middleName",
    "phone",
  ] as const;

  useEffect(() => {
    if (showStamp) {
      setPlaceholders({
        lastName: "ВАША ФАМИЛИЯ",
        firstName: "ВАШЕ ИМЯ",
        middleName: "ВАШЕ ОТЧЕСТВО",
        phone: "ВАШ ТЕЛЕФОН",
      });
    }
  }, [showStamp]);

  const handleContractMouseEnter = () => {
    setIsContractHovered(true);

    if (Object.values(focus).every((f) => !f)) {
      setBounceActive(true);
      bounceIdxRef.current = 0;
      setActiveBounceInput(0);
      const bounceStep = () => {
        bounceIdxRef.current = (bounceIdxRef.current + 1) % bounceFields.length;
        setActiveBounceInput(bounceIdxRef.current);
        setBounceActive(false);
        setTimeout(() => {
          setBounceActive(true);
        }, 0);
        bounceIntervalRef.current = setTimeout(bounceStep, 1200);
      };
      bounceIntervalRef.current = setTimeout(bounceStep, 1200);
    }
  };
  const handleContractMouseLeave = () => {
    setIsContractHovered(false);
    setBounceActive(false);
    setActiveBounceInput(null);
    if (bounceIntervalRef.current) {
      clearTimeout(bounceIntervalRef.current);
      bounceIntervalRef.current = null;
    }
    bounceIdxRef.current = 0;
  };
  useEffect(() => {
    return () => {
      if (bounceIntervalRef.current) clearTimeout(bounceIntervalRef.current);
    };
  }, []);

  const handleInputFocus = (fieldName: keyof typeof focus) => {
    setFocus((f) => ({ ...f, [fieldName]: true }));
    setShowPulseBorder(false);
    setBounceActive(false);
    setActiveBounceInput(null);
    if (bounceIntervalRef.current) {
      clearTimeout(bounceIntervalRef.current);
      bounceIntervalRef.current = null;
    }
  };

  const handleInputBlur = (fieldName: keyof typeof focus) => {
    setFocus((f) => ({ ...f, [fieldName]: false }));
  };

  async function onSubmit(values: ContactFormValues) {
    const city = activeKey; // 'spb' или 'msk'
    const cityName = city === "spb" ? "Санкт-Петербург" : "Москва";

    console.log("Submitting data:", values);
    console.log("Город из шапки:", cityName, `(${city})`);

    try {
      const result = await submitContactForm({
        ...values,
        city,
      });

      if (result.success) {
        setSubmittedValues({
          lastName: values.lastName,
          firstName: values.firstName,
          middleName: values.middleName,
        });
        setShowStamp(true);
      } else {
        toast({
          title: "Ошибка",
          description:
            result.message ||
            "Что-то пошло не так. Пожалуйста, попробуйте еще раз.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Ошибка",
        description:
          "Произошла непредвиденная ошибка. Пожалуйста, попробуйте позже.",
        variant: "destructive",
      });
    }

    const errors = form.formState.errors;
    setPlaceholders((ph) => ({
      ...ph,
      lastName:
        form.getValues("lastName") && errors.lastName
          ? errors.lastName.message + "!"
          : "ВАША ФАМИЛИЯ",
      firstName: errors.firstName ? errors.firstName.message + "!" : "ВАШЕ ИМЯ",
      middleName:
        form.getValues("middleName") && errors.middleName
          ? errors.middleName.message + "!"
          : "ВАШЕ ОТЧЕСТВО",
      phone: errors.phone ? errors.phone.message + "!" : "ВАШ ТЕЛЕФОН",
    }));
  }

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.25,
      },
    },
  } as const;

  const blockVariants = {
    hidden: {
      x: isMobile ? 0 : 1800,
      y: isMobile ? 0 : -400,
      scale: isMobile ? 1 : 1.3,
      rotateZ: isMobile ? 0 : -10,
      opacity: isMobile ? 1 : undefined,
    },
    show: {
      x: 0,
      y: 0,
      scale: 1,
      rotateZ: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: isMobile ? 200 : 180,
        damping: isMobile ? 24 : 28,
        mass: 0.9,
      },
    },
  };

  const leftBlockVariants = {
    hidden: { x: "-100vw", opacity: 0 },
    show: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: [0.8, 0, 0.2, 1] },
    },
  } as const;

  const headingTiltX = useMotionValue(0);
  const headingTiltY = useMotionValue(0);
  const smoothHeadingTiltX = useSpring(headingTiltX, {
    stiffness: 140,
    damping: 30,
  });
  const smoothHeadingTiltY = useSpring(headingTiltY, {
    stiffness: 140,
    damping: 30,
  });
  const headingScale = useMotionValue(1);

  const phraseTiltX = useMotionValue(0);
  const phraseTiltY = useMotionValue(0);
  const smoothPhraseTiltX = useSpring(phraseTiltX, {
    stiffness: 140,
    damping: 30,
  });
  const smoothPhraseTiltY = useSpring(phraseTiltY, {
    stiffness: 140,
    damping: 30,
  });
  const phraseScale = useMotionValue(1);

  const listX = useMotionValue(0);
  const listY = useMotionValue(0);
  const smoothListX = useSpring(listX, { stiffness: 120, damping: 18 });
  const smoothListY = useSpring(listY, { stiffness: 120, damping: 18 });
  const listTiltX = useMotionValue(0);
  const listTiltY = useMotionValue(0);
  const smoothListTiltX = useSpring(listTiltX, { stiffness: 150, damping: 20 });
  const smoothListTiltY = useSpring(listTiltY, { stiffness: 150, damping: 20 });

  const factors = [1, 1.15, 1.3, 1.45];
  const itemTransforms = [
    {
      x: useTransform(smoothListX, (v) => v * factors[0]),
      y: useTransform(smoothListY, (v) => v * factors[0]),
      rotateX: useTransform(smoothListTiltX, (v) => v * factors[0]),
      rotateY: useTransform(smoothListTiltY, (v) => v * factors[0]),
    },
    {
      x: useTransform(smoothListX, (v) => v * factors[1]),
      y: useTransform(smoothListY, (v) => v * factors[1]),
      rotateX: useTransform(smoothListTiltX, (v) => v * factors[1]),
      rotateY: useTransform(smoothListTiltY, (v) => v * factors[1]),
    },
    {
      x: useTransform(smoothListX, (v) => v * factors[2]),
      y: useTransform(smoothListY, (v) => v * factors[2]),
      rotateX: useTransform(smoothListTiltX, (v) => v * factors[2]),
      rotateY: useTransform(smoothListTiltY, (v) => v * factors[2]),
    },
    {
      x: useTransform(smoothListX, (v) => v * factors[3]),
      y: useTransform(smoothListY, (v) => v * factors[3]),
      rotateX: useTransform(smoothListTiltX, (v) => v * factors[3]),
      rotateY: useTransform(smoothListTiltY, (v) => v * factors[3]),
    },
  ];

  const bulletContainerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.35,
        delayChildren: 0.4, // общая задержка перед началом перечисления
      },
    },
  } as const;

  const bulletItemVariants = {
    hidden: { x: -100, opacity: 0 }, // Start off-screen to the left
    show: {
      x: 0,
      opacity: 1,
      transition: { duration: 1, ease: [0.8, 0, 0.2, 1] },
    },
  } as const;

  const sectionRef = useRef<HTMLElement>(null);

  const headingRef = useRef<HTMLDivElement>(null);

  const isInView = useInView(sectionRef, { amount: 0.1 });

  const isHeadingInView = useInView(headingRef, { amount: 0.65 });
  const [animationShown, setAnimationShown] = useState(false);

  useEffect(() => {
    if (isHeadingInView && !animationShown) {
      setAnimationShown(true);
    }
  }, [isHeadingInView, animationShown]);

  useEffect(() => {
    if (!isInView) return;

    const handleMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;

      const ampHeading = 10; // reduced from 20 for subtler heading tilt
      headingTiltX.set(ny * ampHeading);
      headingTiltY.set(nx * ampHeading);

      const dist = Math.min(1, Math.sqrt(nx * nx + ny * ny));
      headingScale.set(1 + 0.04 * dist);

      const ampPhrase = 12;
      phraseTiltX.set(ny * ampPhrase);
      phraseTiltY.set(nx * ampPhrase);
      phraseScale.set(1 + 0.05 * dist);

      const ampTrans = 12;
      listX.set(-nx * ampTrans);
      listY.set(ny * ampTrans);

      const ampTilt = 5; // reduced from 10 for subtler list tilt
      listTiltX.set(ny * ampTilt);
      listTiltY.set(nx * ampTilt);
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [
    isInView,
    headingTiltX,
    headingTiltY,
    headingScale,
    phraseTiltX,
    phraseTiltY,
    phraseScale,
    listX,
    listY,
    listTiltX,
    listTiltY,
  ]);

  const resetSectionMotion = () => {
    headingTiltX.set(0);
    headingTiltY.set(0);
    headingScale.set(1);
    phraseTiltX.set(0);
    phraseTiltY.set(0);
    phraseScale.set(1);
    listX.set(0);
    listY.set(0);
    listTiltX.set(0);
    listTiltY.set(0);
  };

  return (
    <section
      id={sectionId}
      ref={sectionRef}
      className="contact contact-section flex items-center justify-center"
      style={{
        position: "relative",
        overflow: isMobile ? undefined : "visible",
        overflowX: isMobile ? "hidden" : undefined,
        overflowY: isMobile ? "visible" : undefined,
        minHeight: isMobile ? "auto" : "100vh",
        maxWidth: "2000px",
        margin: "0 auto",
        paddingTop: isMobile ? 24 : undefined,
        paddingBottom: isMobile ? 80 : undefined,
        ...(isMobile ? { width: "100%" } : {}),
      }}
    >
      {}
      <PNGAnimation show={animationShown} isMobile={isMobile} />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.65 }}
        className="contact__content contact-content-wrapper flex justify-center items-start relative mx-auto w-full"
        style={{
          columnGap: isMobile ? 0 : 500,
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "center" : "flex-start",
        }}
      >
        {}
        {!isMobile && (
          <motion.div
            ref={headingRef}
            variants={leftBlockVariants}
            className="contact-left-block"
            style={{
              position: "absolute",
              left: -1100,
              top: 700,
              width: 780,
              maxWidth: 780,
              color: "#ffffff",
              fontFamily: "Furore, Arial, sans-serif",
              fontWeight: 400,
              textAlign: "left",
              lineHeight: 1.25,
              fontSize: "2rem",
              transform: "rotate(-5deg)",
              pointerEvents: "none",
              perspective: "800px",
              transformStyle: "preserve-3d",
              x: smoothHeadingTiltY,
              y: smoothHeadingTiltX,
              rotateX: smoothHeadingTiltX,
              rotateY: smoothHeadingTiltY,
              scale: headingScale,
            }}
            animate={{
              scale: [1, 1.04, 1],
              transition: { duration: 8, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            {}
            <div
              style={{
                fontFamily: "Furore, Arial, sans-serif",
                textTransform: "uppercase",
                pointerEvents: "none",
                textAlign: "center",
              }}
            >
              {}
              <motion.div
                animate={{ scale: [1, 1.06, 1] }}
                transition={{
                  duration: 7.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0,
                }}
              >
                <div
                  className="text-adaptive-hero-xl text-accent font-furore uppercase"
                  style={{
                    marginBottom: "0.1em",
                    lineHeight: 1,
                    transform: "translateX(280px) rotate(15deg)",
                    letterSpacing: "2px",
                  }}
                >
                  СБОРКУ
                </div>
              </motion.div>
              {}
              <motion.div
                animate={{ scale: [1, 1.04, 1] }}
                transition={{
                  duration: 8.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.1,
                }}
              >
                <div
                  className="text-adaptive-hero-xl text-accent font-furore uppercase"
                  style={{
                    marginBottom: "0.35em",
                    lineHeight: 1,
                    transform: "translateX(-170px) rotate(-7deg)",
                    letterSpacing: "2px",
                  }}
                >
                  ЗАКАЗАТЬ
                </div>
              </motion.div>
            </div>

            {}
            <motion.div
              animate={{ scale: [1, 1.03, 1] }}
              transition={{
                duration: 6.7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.7,
              }}
              style={{
                color: "#6a7677",
                fontFamily: "Furore, Arial, sans-serif",
                textAlign: "center",
                margin: "0 0 1.4rem",
                lineHeight: 1,
                x: smoothPhraseTiltY,
                y: smoothPhraseTiltX,
                rotateX: smoothPhraseTiltX,
                rotateY: smoothPhraseTiltY,
                scale: phraseScale,
                pointerEvents: "none",
              }}
            >
              <div className="text-2xl md:text-3xl font-furore">
                мы сделаем всё остальное
              </div>
            </motion.div>

            {}
            <motion.ul
              className="text-left mb-8 space-y-8"
              variants={bulletContainerVariants}
              style={{ pointerEvents: "none", transformStyle: "preserve-3d" }}
            >
              <motion.li
                className="flex items-center gap-6 text-white font-furore text-2xl md:text-3xl"
                variants={bulletItemVariants}
                style={{
                  x: itemTransforms[0].x,
                  y: itemTransforms[0].y,
                  rotateX: itemTransforms[0].rotateX,
                  rotateY: itemTransforms[0].rotateY,
                  transformStyle: "preserve-3d",
                }}
              >
                <span className="icon-container">
                  <Image
                    src="/images/icons/draw.png"
                    alt="Договор"
                    className={`icon-shield${
                      activeBounceBullet === 0 ? " bounce-check" : ""
                    }`}
                    width={48}
                    height={48}
                  />
                </span>
                <motion.span
                  animate={{ scale: [1, 1.07, 1] }}
                  transition={{
                    duration: 7.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.2,
                  }}
                  style={{ display: "inline-block" }}
                >
                  ЗАПОЛНИТЕ ФОРМУ СПРАВА И ПОЛУЧИТЕ ДОГОВОР НА СБОРКУ ВАШЕЙ
                  МЕБЕЛИ БЕЗ ЛИШНИХ ХЛОПОТ.
                </motion.span>
              </motion.li>
              <motion.li
                className="flex items-center gap-6 text-white font-furore text-2xl md:text-3xl"
                variants={bulletItemVariants}
                style={{
                  x: itemTransforms[1].x,
                  y: itemTransforms[1].y,
                  rotateX: itemTransforms[1].rotateX,
                  rotateY: itemTransforms[1].rotateY,
                  transformStyle: "preserve-3d",
                }}
              >
                <span className="icon-container">
                  <Image
                    src="/images/icons/customer.png"
                    alt="Свяжемся"
                    className={`icon-alarm${
                      activeBounceBullet === 1 ? " bounce-check" : ""
                    }`}
                    width={48}
                    height={48}
                  />
                </span>
                <motion.span
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{
                    duration: 8.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.3,
                  }}
                  style={{ display: "inline-block" }}
                >
                  МЫ СВЯЖЕМСЯ С ВАМИ, ЧТОБЫ УТОЧНИТЬ ДЕТАЛИ И ВЫБРАТЬ УДОБНОЕ
                  ВРЕМЯ.
                </motion.span>
              </motion.li>
              <motion.li
                className="flex items-center gap-6 text-white font-furore text-2xl md:text-3xl"
                variants={bulletItemVariants}
                style={{
                  x: itemTransforms[2].x,
                  y: itemTransforms[2].y,
                  rotateX: itemTransforms[2].rotateX,
                  rotateY: itemTransforms[2].rotateY,
                  transformStyle: "preserve-3d",
                }}
              >
                <span className="icon-container">
                  <Image
                    src="/images/icons/organic.png"
                    alt="Мастера"
                    className={`icon-hammer${
                      activeBounceBullet === 2 ? " bounce-check" : ""
                    }`}
                    width={48}
                    height={48}
                  />
                </span>
                <motion.span
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{
                    duration: 7.1,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.8,
                  }}
                  style={{ display: "inline-block" }}
                >
                  ОПЫТНЫЕ МАСТЕРА ПРИЕДУТ СО ВСЕМ НЕОБХОДИМЫМ ИНСТРУМЕНТОМ,
                  АККУРАТНО СОБЕРУТ МЕБЕЛЬ И УБЕРУТ УПАКОВКУ.
                </motion.span>
              </motion.li>
              <motion.li
                className="flex items-center gap-6 text-white font-furore text-2xl md:text-3xl"
                variants={bulletItemVariants}
                style={{
                  x: itemTransforms[3].x,
                  y: itemTransforms[3].y,
                  rotateX: itemTransforms[3].rotateX,
                  rotateY: itemTransforms[3].rotateY,
                  transformStyle: "preserve-3d",
                }}
              >
                <span className="icon-container">
                  <Image
                    src="/images/icons/kiss.png"
                    alt="Наслаждайтесь"
                    className={`icon-ruble${
                      activeBounceBullet === 3 ? " bounce-check" : ""
                    }`}
                    width={48}
                    height={48}
                  />
                </span>
                <motion.span
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{
                    duration: 9.1,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.7,
                  }}
                  style={{ display: "inline-block" }}
                >
                  ВАМ ОСТАНЕТСЯ ЛИШЬ НАСЛАЖДАТЬСЯ ОБНОВЛЁННЫМ ПРОСТРАНСТВОМ И
                  ДЕЛИТЬСЯ ВПЕЧАТЛЕНИЯМИ С ДРУЗЬЯМИ.
                </motion.span>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}

        {}
        <motion.div
          variants={blockVariants}
          className="contract-hover contact-contract-block"
          style={{
            marginTop: isMobile ? 24 : 500,
            ...(isMobile
              ? {
                  width: "100%",
                  maxWidth: "100%",
                  marginLeft: 0,
                  marginRight: 0,
                }
              : {}),
          }}
        >
          <div
            style={
              isMobile
                ? { width: "100%" }
                : {
                    position: "relative",
                    width: "100%",
                    height:
                      1200 * (screenWidth > 0 ? screenWidth / 1000 : 0.38),
                    overflow: "hidden",
                  }
            }
          >
            <div
              style={
                !isMobile
                  ? {
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: 1000,
                      height: 1200,
                      transform: `scale(${
                        screenWidth > 0 ? screenWidth / 1000 : 0.38
                      })`,
                      transformOrigin: "top left",
                    }
                  : undefined
              }
            >
              <CartoonContract
                lastName={
                  showStamp && submittedValues
                    ? submittedValues.lastName || ""
                    : form.watch("lastName") || ""
                }
                firstName={
                  showStamp && submittedValues
                    ? submittedValues.firstName
                    : form.watch("firstName") || ""
                }
                middleName={
                  showStamp && submittedValues
                    ? submittedValues.middleName || ""
                    : form.watch("middleName") || ""
                }
                onMouseEnter={handleContractMouseEnter}
                onMouseLeave={handleContractMouseLeave}
                glowActive={
                  isContractHovered || Object.values(focus).some(Boolean)
                }
                isMobile={isMobile}
              >
                <div
                  style={{
                    position: isMobile ? "relative" : "absolute",
                    bottom: isMobile ? undefined : 40,
                    left: isMobile ? undefined : 129,
                    width: isMobile ? "100%" : 420,
                    maxWidth: isMobile ? "100%" : undefined,
                    boxSizing: "border-box",
                    background: "transparent",
                    borderRadius: 12,
                    padding: isMobile ? "12px 12px 48px" : 16,
                    zIndex: 2,
                  }}
                >
                  <style>{`
                @font-face {
                  font-family: 'Slavic-Regular';
                  src: url('/fonts/Slavic-Regular.ttf') format('truetype');
                  font-weight: normal;
                  font-style: normal;
                }
                .slavic-input::placeholder {
                  font-family: 'Slavic-Regular', Arial, sans-serif;
                  padding-top: 6px;
                  position: relative;
                  top: 3px;
                }
                .slavic-input {
                  cursor: text !important;
                }
                .slavic-input input {
                  cursor: text !important;
                }
                .slavic-input:focus {
                    border-color: #ffc700 !important;
                    box-shadow: 0 0 0 3px #ffe06680 !important;
                  outline: none !important;
                    transition: border-color 0.25s, box-shadow 0.25s;
                    cursor: text !important;
                }
                .tablet-border {
                  border: 3px solid transparent;
                  border-radius: 32px;
                  transition: border-color 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s cubic-bezier(0.4,0,0.2,1);
                }
                @keyframes bounceBorder {
                  0%, 100% { box-shadow: 0 0 0 0 #ffc70099, 0 0 0 0 #ffc700; border-color: #ffc700; }
                  20% { box-shadow: 0 0 12px 4px #ffc70099, 0 0 0 0 #ffc700; border-color: #ffc700; }
                  40% { box-shadow: 0 0 0 0 #ffc70099, 0 0 12px 4px #ffc700; border-color: #ffc700; }
                  60% { box-shadow: 0 0 0 0 #ffc70099, 0 0 0 0 #ffc700; border-color: #ffc700; }
                }
                .bounce-border {
                  border-color: #ffc700 !important;
                  box-shadow: 0 0 12px 4px #ffc70099;
                  animation: pulseBorder 1.2s 1;
                }
                @keyframes pulseBorder {
                  0% {
                    box-shadow: 0 0 0 0 #ffc70099, 0 0 0 0 #ffc700;
                    border-color: #ffc700;
                  }
                  50% {
                    box-shadow: 0 0 16px 8px #ffc70099, 0 0 0 0 #ffc700;
                    border-color: #ffc700;
                  }
                  100% {
                    box-shadow: 0 0 0 0 #ffc70099, 0 0 0 0 #ffc700;
                    border-color: #ffc700;
                  }
                }
              `}</style>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="w-full flex flex-col items-center gap-3 contract-form"
                    >
                      <div
                        className="input-group-hover"
                        style={{
                          marginBottom: 16,
                          boxSizing: "border-box",
                          display: "flex",
                          flexDirection: "column",
                          gap: 10,
                          padding: 4,
                          width: isMobile ? "100%" : 436,
                          maxWidth: "100%",
                          margin: "0 auto",
                          background: "transparent",
                        }}
                      >
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field, fieldState }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder={placeholders.lastName}
                                  {...field}
                                  maxLength={25}
                                  className={cn(
                                    "placeholder:text-accent",
                                    "slavic-input",
                                    "tablet-border",
                                    !showStamp &&
                                      bounceActive &&
                                      bounceFields[activeBounceInput ?? -1] ===
                                        "lastName" &&
                                      "bounce-border",
                                    !showStamp &&
                                      fieldState.error &&
                                      "border-destructive text-destructive placeholder:text-destructive"
                                  )}
                                  style={{
                                    background: "transparent",
                                    border: "1.5px solid #000",
                                    fontFamily:
                                      "Slavic-Regular, Arial, sans-serif",
                                    color: "#5f5e5f",
                                    width: isMobile ? "100%" : "420px",
                                    maxWidth: "100%",
                                    textTransform: focus.lastName
                                      ? "none"
                                      : "uppercase",
                                    textAlign: "center",
                                    fontSize: "1.5rem",
                                    fontWeight: 700,
                                    boxShadow: fieldState.error
                                      ? "0 0 12px 4px #ff333399"
                                      : hoveredField === "lastName"
                                      ? "0 0 8px 2px #ffc70066"
                                      : undefined,
                                    transform:
                                      hoveredField === "lastName"
                                        ? "scale(1.02)"
                                        : "scale(1)",
                                    transition: "all 0.2s ease",
                                    cursor: "text",
                                  }}
                                  onFocus={(
                                    _e: React.FocusEvent<HTMLInputElement>
                                  ) => {
                                    setPlaceholders((ph) => ({
                                      ...ph,
                                      lastName: "ВАША ФАМИЛИЯ",
                                    }));
                                    handleInputFocus("lastName");
                                  }}
                                  onBlur={() => handleInputBlur("lastName")}
                                  onMouseEnter={() =>
                                    setHoveredField("lastName")
                                  }
                                  onMouseLeave={() => setHoveredField(null)}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field, fieldState }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder={placeholders.firstName}
                                  {...field}
                                  maxLength={25}
                                  className={cn(
                                    "placeholder:text-accent",
                                    "slavic-input",
                                    "tablet-border",
                                    !showStamp &&
                                      bounceActive &&
                                      bounceFields[activeBounceInput ?? -1] ===
                                        "firstName" &&
                                      "bounce-border",
                                    !showStamp &&
                                      fieldState.error &&
                                      "border-destructive text-destructive placeholder:text-destructive"
                                  )}
                                  style={{
                                    background: "transparent",
                                    border: "1.5px solid #000",
                                    fontFamily:
                                      "Slavic-Regular, Arial, sans-serif",
                                    color: "#5f5e5f",
                                    width: isMobile ? "100%" : "420px",
                                    maxWidth: "100%",
                                    textTransform: focus.firstName
                                      ? "none"
                                      : "uppercase",
                                    textAlign: "center",
                                    fontSize: "1.5rem",
                                    fontWeight: 700,
                                    boxShadow: fieldState.error
                                      ? "0 0 12px 4px #ff333399"
                                      : hoveredField === "firstName"
                                      ? "0 0 8px 2px #ffc70066"
                                      : undefined,
                                    transform:
                                      hoveredField === "firstName"
                                        ? "scale(1.02)"
                                        : "scale(1)",
                                    transition: "all 0.2s ease",
                                    cursor: "text",
                                  }}
                                  onFocus={(
                                    _e: React.FocusEvent<HTMLInputElement>
                                  ) => {
                                    setPlaceholders((ph) => ({
                                      ...ph,
                                      firstName: "ВАШЕ ИМЯ",
                                    }));
                                    handleInputFocus("firstName");
                                  }}
                                  onBlur={() => handleInputBlur("firstName")}
                                  onMouseEnter={() =>
                                    setHoveredField("firstName")
                                  }
                                  onMouseLeave={() => setHoveredField(null)}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="middleName"
                          render={({ field, fieldState }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder={placeholders.middleName}
                                  {...field}
                                  maxLength={25}
                                  className={cn(
                                    "placeholder:text-accent",
                                    "slavic-input",
                                    "tablet-border",
                                    !showStamp &&
                                      bounceActive &&
                                      bounceFields[activeBounceInput ?? -1] ===
                                        "middleName" &&
                                      "bounce-border",
                                    !showStamp &&
                                      fieldState.error &&
                                      "border-destructive text-destructive placeholder:text-destructive"
                                  )}
                                  style={{
                                    background: "transparent",
                                    border: "1.5px solid #000",
                                    fontFamily:
                                      "Slavic-Regular, Arial, sans-serif",
                                    color: "#5f5e5f",
                                    width: isMobile ? "100%" : "420px",
                                    maxWidth: "100%",
                                    textTransform: focus.middleName
                                      ? "none"
                                      : "uppercase",
                                    textAlign: "center",
                                    fontSize: "1.5rem",
                                    fontWeight: 700,
                                    boxShadow: fieldState.error
                                      ? "0 0 12px 4px #ff333399"
                                      : hoveredField === "middleName"
                                      ? "0 0 8px 2px #ffc70066"
                                      : undefined,
                                    transform:
                                      hoveredField === "middleName"
                                        ? "scale(1.02)"
                                        : "scale(1)",
                                    transition: "all 0.2s ease",
                                    cursor: "text",
                                  }}
                                  onFocus={(
                                    _e: React.FocusEvent<HTMLInputElement>
                                  ) => {
                                    setPlaceholders((ph) => ({
                                      ...ph,
                                      middleName: "ВАШЕ ОТЧЕСТВО",
                                    }));
                                    handleInputFocus("middleName");
                                  }}
                                  onBlur={() => handleInputBlur("middleName")}
                                  onMouseEnter={() =>
                                    setHoveredField("middleName")
                                  }
                                  onMouseLeave={() => setHoveredField(null)}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field, fieldState }) => (
                            <FormItem>
                              <FormControl>
                                <InputMask
                                  mask={"+7 (___) ___-__-__"}
                                  replacement={{ _: /\d/ }}
                                  value={field.value}
                                  onChange={field.onChange}
                                  onBlur={(e) => {
                                    field.onBlur();
                                    handleInputBlur("phone");
                                  }}
                                  onMouseEnter={() => setHoveredField("phone")}
                                  onMouseLeave={() => setHoveredField(null)}
                                  component={Input}
                                  type="tel"
                                  placeholder={placeholders.phone}
                                  className={cn(
                                    "placeholder:text-accent",
                                    "slavic-input",
                                    "tablet-border",
                                    !showStamp &&
                                      bounceActive &&
                                      bounceFields[activeBounceInput ?? -1] ===
                                        "phone" &&
                                      "bounce-border",
                                    !showStamp &&
                                      fieldState.error &&
                                      "border-destructive text-destructive placeholder:text-destructive"
                                  )}
                                  style={{
                                    background: "transparent",
                                    border: "1.5px solid #000",
                                    fontFamily:
                                      "Slavic-Regular, Arial, sans-serif",
                                    color: "#5f5e5f",
                                    width: isMobile ? "100%" : "420px",
                                    maxWidth: "100%",
                                    textTransform: focus.phone
                                      ? "none"
                                      : "uppercase",
                                    textAlign: "center",
                                    fontSize: "1.5rem",
                                    fontWeight: 700,
                                    boxShadow: fieldState.error
                                      ? "0 0 12px 4px #ff333399"
                                      : hoveredField === "phone"
                                      ? "0 0 8px 2px #ffc70066"
                                      : undefined,
                                    transform:
                                      hoveredField === "phone"
                                        ? "scale(1.02)"
                                        : "scale(1)",
                                    transition: "all 0.2s ease",
                                    cursor: "text",
                                  }}
                                  onFocus={(
                                    _e: React.FocusEvent<HTMLInputElement>
                                  ) => {
                                    setPlaceholders((ph) => ({
                                      ...ph,
                                      phone: "ВАШ ТЕЛЕФОН",
                                    }));
                                    handleInputFocus("phone");
                                    if (!field.value) {
                                      form.setValue("phone", "+7 (");
                                    }
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      {}
                      <div
                        style={{
                          height: 4,
                          width: isMobile ? "100%" : 420,
                          maxWidth: "100%",
                          margin: "25px auto 0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {(() => {
                          const firstName = form.watch("firstName");
                          const phone = form.watch("phone");
                          const firstNameValid =
                            firstName && !form.formState.errors.firstName;
                          const phoneDigits = (phone.match(/\d/g) || []).length;

                          const phoneValid =
                            phone &&
                            !form.formState.errors.phone &&
                            phoneDigits === 11;

                          return (
                            <motion.div
                              style={{
                                display: "inline-block",
                                width: "100%",
                                height: isMobile ? 52 : 64,
                                transform: isMobile
                                  ? "none"
                                  : "translate(-700px, -200px)",
                              }}
                              animate={{ y: [-4, 4, -4] }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            >
                              <Button
                                type="submit"
                                className="btn btn--primary block"
                                style={{
                                  width: isMobile ? "100%" : 430,
                                  maxWidth: "100%",
                                  height: isMobile ? 52 : 64,
                                  fontSize: isMobile ? "1.1rem" : "1.35rem",
                                  borderRadius: 140,
                                  fontFamily: "Furore, Arial, sans-serif",
                                  fontWeight: 700,
                                  letterSpacing: 1,
                                }}
                                disabled={
                                  showStamp ||
                                  !(firstNameValid && phoneValid) ||
                                  form.formState.isSubmitting
                                }
                                onClick={form.handleSubmit(onSubmit)}
                              >
                                {form.formState.isSubmitting
                                  ? "Отправка..."
                                  : showStamp
                                  ? "Готово"
                                  : "Заказать сборку"}
                              </Button>
                            </motion.div>
                          );
                        })()}
                      </div>
                    </form>
                    {showStamp && (
                      <Image
                        src="/images/accept.PNG"
                        alt="ПРИНЯТО В РАБОТУ"
                        width={200}
                        height={100}
                        style={{
                          position: "absolute",
                          left: "50%",
                          top: "40%",
                          transform: "translate(-50%, -50%) rotate(-30deg)",
                          width: 233,
                          zIndex: 10,
                          pointerEvents: "none",
                          filter: "drop-shadow(0 2px 16px rgba(0,0,0,0.18))",
                        }}
                      />
                    )}
                  </Form>
                </div>
              </CartoonContract>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
