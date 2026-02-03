'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface SpeedRange {
  startIndex: number; // inclusive, zero-based
  endIndex: number;   // inclusive, zero-based
  multiplier: number; // >1 = faster, <1 = slower
}

interface LoopSegment {
  startIndex: number; // inclusive, zero-based
  endIndex: number;   // inclusive, zero-based


  times: number;
}

interface SmoothFrameAnimationProps {
  images: string[]; // Full paths starting with /
  baseFps?: number; // default 60
  className?: string;
  width?: number | string;  // CSS width (e.g. 40, '2em')
  height?: number | string; // CSS height
  speedRanges?: SpeedRange[];

  loopSegments?: LoopSegment[];
  paused?: boolean; // If true, animation stays on first frame
  frameRange?: { start: number; end: number }; // Optional: limit animation to specific frame range (0-indexed)
  pingPong?: boolean; // If true, animation plays forward then backward (1,2,3,2,1,2,3...)
  playReverseAfterLoop?: boolean; // If true, after loopSegments complete, plays reverse sequence and stops
  onAnimationComplete?: () => void; // Callback when animation completes (for playReverseAfterLoop)
  shouldLoop?: boolean; // If false, animation plays once and stops on last frame (default: true)
}


export const SmoothFrameAnimation: React.FC<SmoothFrameAnimationProps> = ({
  images,
  baseFps = 60,
  className = '',
  width = '1em',
  height = '1em',
  speedRanges = [],
  loopSegments = [],
  paused = false,
  frameRange,
  pingPong = false,
  playReverseAfterLoop = false,
  onAnimationComplete,
  shouldLoop = true,
}) => {
  const TOTAL_FRAMES = images.length;



  const sequenceRef = useRef<number[]>([]);

  useEffect(() => {
    const seq: number[] = [];
    const baseRepeat = 4; // how many times we repeat a normal-speed frame (baseFPS / 4)

    const startFrame = frameRange ? frameRange.start : 0;
    const endFrame = frameRange ? frameRange.end : TOTAL_FRAMES - 1;

    const validSegments = (loopSegments || [])
      .filter(seg => seg && seg.times && seg.times >= 2)
      .map(seg => ({
        startIndex: Math.max(startFrame, Math.min(endFrame, seg.startIndex)),
        endIndex: Math.max(startFrame, Math.min(endFrame, seg.endIndex)),
        times: seg.times,
      }))
      .filter(seg => seg.endIndex >= seg.startIndex);

    for (let i = startFrame; i <= endFrame; i++) {
      const range = speedRanges.find(
        (r) => i >= r.startIndex && i <= r.endIndex,
      );
      const multiplier = range ? range.multiplier : 1;

      const repeat = Math.max(1, Math.round(baseRepeat / multiplier));
      for (let k = 0; k < repeat; k++) seq.push(i);

      const endingSegments = validSegments.filter(seg => seg.endIndex === i);
      if (endingSegments.length > 0) {
        for (const seg of endingSegments) {
          const extraRepeats = seg.times - 1; // we have already played it once in the normal flow
          for (let rep = 0; rep < extraRepeats; rep++) {
            for (let j = seg.startIndex; j <= seg.endIndex; j++) {
              const r2 = speedRanges.find(
                (r) => j >= r.startIndex && j <= r.endIndex,
              );
              const m2 = r2 ? r2.multiplier : 1;
              const repeat2 = Math.max(1, Math.round(baseRepeat / m2));
              for (let k2 = 0; k2 < repeat2; k2++) seq.push(j);
            }
          }
        }
      }
    }

    if (pingPong && seq.length > 1) {

      const reverseSeq = seq.slice(0, -1).reverse();
      sequenceRef.current = [...seq, ...reverseSeq];
    } else {
      sequenceRef.current = seq;
    }
  }, [TOTAL_FRAMES, speedRanges, loopSegments, frameRange, pingPong]);

  const preloadedImages = useRef<Record<number, HTMLImageElement>>({});
  const [allLoaded, setAllLoaded] = useState(false);

  useEffect(() => {
    let loaded = 0;
    const uniqueFrames = Array.from({ length: TOTAL_FRAMES }, (_, i) => i);
    uniqueFrames.forEach((idx) => {
      const img = new Image();
      img.onload = () => {
        loaded++;
        if (loaded === TOTAL_FRAMES) {
          setAllLoaded(true);
        }
      };
      img.src = images[idx];
      preloadedImages.current[idx] = img;
    });
  }, [images, TOTAL_FRAMES]);

  const idxRef = useRef(0);
  const frameRef = useRef<HTMLDivElement>(null);
  const prevTimeRef = useRef<number | null>(null);
  const frameDuration = 1000 / baseFps; // ms per frame at 60fps ~16.67
  const isPlayingReverse = useRef(false);
  const reverseSequence = useRef<number[]>([]);
  const animationComplete = useRef(false);
  const pauseUntilRef = useRef<number | null>(null); // Время до которого нужно держать паузу

  const rafIdRef = useRef<number | null>(null);
  const shouldStartFromReverse = useRef(false); // Флаг для начала idle с реверса

  const propsRef = useRef({ frameRange, playReverseAfterLoop, loopSegments, speedRanges, onAnimationComplete, shouldLoop });
  useEffect(() => {
    propsRef.current = { frameRange, playReverseAfterLoop, loopSegments, speedRanges, onAnimationComplete, shouldLoop };
  }, [frameRange, playReverseAfterLoop, loopSegments, speedRanges, onAnimationComplete, shouldLoop]);

  const imagesRef = useRef(images);
  const frameDurationRef = useRef(1000 / baseFps);
  const baseFpsRef = useRef(baseFps);
  useEffect(() => {
    imagesRef.current = images;
    frameDurationRef.current = 1000 / baseFps;
    baseFpsRef.current = baseFps;
  }, [images, baseFps]);

  const loop = useCallback((time: number) => {

    if (animationComplete.current) {
      return;
    }

    if (pauseUntilRef.current !== null) {
      if (time < pauseUntilRef.current) {
        rafIdRef.current = requestAnimationFrame(loop);
        return;
      } else {

        pauseUntilRef.current = null;
        prevTimeRef.current = time; // Сбрасываем время для корректного продолжения
      }
    }
    
    if (!prevTimeRef.current) prevTimeRef.current = time;
    const delta = time - prevTimeRef.current;
    if (delta >= frameDurationRef.current) {
      prevTimeRef.current = time - (delta % frameDurationRef.current);
      
      if (isPlayingReverse.current) {

        idxRef.current++;
        if (idxRef.current >= reverseSequence.current.length) {

          isPlayingReverse.current = false;
          shouldStartFromReverse.current = true; // Устанавливаем флаг для начала idle с реверса
          if (propsRef.current.onAnimationComplete) {
            propsRef.current.onAnimationComplete();
          }


        } else {
          const frameIdx = reverseSequence.current[idxRef.current];
          if (frameRef.current) {
            frameRef.current.style.backgroundImage = `url(${imagesRef.current[frameIdx]})`;
          }
        }
      } else {

        idxRef.current++;
        if (idxRef.current >= sequenceRef.current.length) {

          if (propsRef.current.playReverseAfterLoop && propsRef.current.loopSegments.length > 0) {

            isPlayingReverse.current = true;
            idxRef.current = 0;

            const startFrame = propsRef.current.frameRange ? propsRef.current.frameRange.start : 0;
            const endFrame = propsRef.current.frameRange ? propsRef.current.frameRange.end : TOTAL_FRAMES - 1;
            const reverse: number[] = [];
            const baseRepeat = 4;
            for (let i = endFrame; i >= startFrame; i--) {
              const range = propsRef.current.speedRanges.find(
                (r) => i >= r.startIndex && i <= r.endIndex,
              );
              const multiplier = range ? range.multiplier : 1;
              const repeat = Math.max(1, Math.round(baseRepeat / multiplier));
              for (let k = 0; k < repeat; k++) reverse.push(i);
            }
            reverseSequence.current = reverse;
            const frameIdx = reverse[0];
            if (frameRef.current) {
              frameRef.current.style.backgroundImage = `url(${imagesRef.current[frameIdx]})`;
            }
          } else if (!propsRef.current.shouldLoop) {

            animationComplete.current = true;
            idxRef.current = sequenceRef.current.length - 1;
            const frameIdx = sequenceRef.current[idxRef.current];
            if (frameRef.current) {
              frameRef.current.style.backgroundImage = `url(${imagesRef.current[frameIdx]})`;
            }
            if (propsRef.current.onAnimationComplete) {
              propsRef.current.onAnimationComplete();
            }
          } else {

            idxRef.current = 0;
            const frameIdx = sequenceRef.current[0];
            if (frameRef.current) {
              frameRef.current.style.backgroundImage = `url(${imagesRef.current[frameIdx]})`;
            }
          }
        } else {
          const frameIdx = sequenceRef.current[idxRef.current];
          if (frameRef.current) {
            frameRef.current.style.backgroundImage = `url(${imagesRef.current[frameIdx]})`;
          }
        }
      }
    }
    rafIdRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    if (!allLoaded) return;

    const initialFrame = propsRef.current.frameRange ? propsRef.current.frameRange.start : 0;
    if (frameRef.current) {
      frameRef.current.style.backgroundImage = `url(${imagesRef.current[initialFrame]})`;
    }

    if (paused) {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      return;
    }

    if (rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(loop);
    }
    
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [allLoaded, paused, loop]);

  useEffect(() => {
    prevTimeRef.current = null;
    isPlayingReverse.current = false;
    animationComplete.current = false;
    reverseSequence.current = [];
    pauseUntilRef.current = null;

    if (shouldStartFromReverse.current && pingPong) {


      const endFrame = propsRef.current.frameRange ? propsRef.current.frameRange.end : TOTAL_FRAMES - 1;

      let startIdx = 0;
      for (let i = 0; i < sequenceRef.current.length; i++) {
        if (sequenceRef.current[i] === endFrame) {
          startIdx = i;
          break;
        }
      }
      idxRef.current = startIdx;
      shouldStartFromReverse.current = false; // Сбрасываем флаг
      const frameIdx = sequenceRef.current[startIdx];
      if (frameRef.current && imagesRef.current[frameIdx]) {
        frameRef.current.style.backgroundImage = `url(${imagesRef.current[frameIdx]})`;
      }
    } else {

      idxRef.current = 0;
      const initialFrame = propsRef.current.frameRange ? propsRef.current.frameRange.start : 0;
      if (frameRef.current && imagesRef.current[initialFrame]) {
        frameRef.current.style.backgroundImage = `url(${imagesRef.current[initialFrame]})`;
      }
    }
  }, [frameRange, pingPong, playReverseAfterLoop, loopSegments]);

  return (
    <div
      ref={frameRef}
      className={className}
      style={{
        width,
        height,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'inline-block',
        opacity: allLoaded ? 1 : 0,
        transition: 'opacity 0.1s ease-in-out',
      }}
    />
  );
}; 