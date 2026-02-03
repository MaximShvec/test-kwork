'use client';

import React, { useEffect, useRef, useState } from 'react';

interface SpriteMeta {
  width: number;
  height: number;
  fps: number;
  frames: number;
  frames_per_row: number;
  rows: number;
  image: string; // e.g. "sprite.webp"


  delay_frames?: number;
}

interface SpritePlayerProps {
  metaUrl?: string; // default "/meta.json"
  width?: number; // desired display width per frame (scales sprite)
  height?: number; // desired display height per frame (scales sprite)
  holdFirstMs?: number; // delay before first frame advances
  holdLastMs?: number; // delay when showing last frame
  speedMultiplier?: number; // 1 = normal speed; <1 slower; >1 faster
  pingPong?: boolean; // if true, plays forward then backward (ping-pong mode)
  maxCycles?: number; // max number of ping-pong cycles before stopping (0 = infinite)
  stopAtStart?: boolean; // if true, after maxCycles plays backward to start and stops
  className?: string;
}

const SpritePlayer: React.FC<SpritePlayerProps> = ({
  metaUrl = '/meta.json',
  width,
  height,
  holdFirstMs = 0,
  holdLastMs = 0,
  speedMultiplier = 1,
  pingPong = false,
  maxCycles = 0,
  stopAtStart = false,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [meta, setMeta] = useState<SpriteMeta | null>(null);

  useEffect(() => {
    let isCancelled = false;
    const load = async () => {
      try {
        const res = await fetch(metaUrl, { cache: 'force-cache' });
        if (!res.ok) return;
        const data = (await res.json()) as SpriteMeta;
        if (!isCancelled) setMeta(data);
      } catch {

      }
    };
    load();
    return () => {
      isCancelled = true;
    };
  }, [metaUrl]);

  useEffect(() => {
    if (!meta || !containerRef.current) return;

    const element = containerRef.current;

    const frameWidth = width ?? meta.width;
    const frameHeight = height ?? meta.height;
    const sheetWidth = frameWidth * meta.frames_per_row;
    const sheetHeight = frameHeight * meta.rows;

    element.style.width = `${frameWidth}px`;
    element.style.height = `${frameHeight}px`;

    const lastSlash = metaUrl.lastIndexOf('/');
    const basePath = lastSlash >= 0 ? metaUrl.slice(0, lastSlash) : '';
    const imageUrl = `${basePath}/${meta.image}`.replace(/\\/g, '/').replace(/\/\//g, '/').replace(/\/+/, '/');

    const normalizedUrl = imageUrl.replace(/\/+/, '/').replace(/\/\/+/, '/');
    element.style.backgroundImage = `url(${normalizedUrl})`;
    element.style.backgroundRepeat = 'no-repeat';
    element.style.backgroundSize = `${sheetWidth}px ${sheetHeight}px`;
    element.style.backgroundPosition = '0px 0px';
    element.style.willChange = 'background-position';

    let frameIndex = 0;
    let direction = 1; // 1 = forward, -1 = backward (for ping-pong mode)
    let cycleCount = 0; // count completed ping-pong cycles
    let isFinishing = false; // true when playing final backward sequence
    let isStopped = false; // true when animation should stop
    let lastTime = performance.now();
    let accumulatorMs = 0;
    let holdingMs = 0;
    const effectiveFps = Math.max(0.0001, meta.fps * speedMultiplier);
    const msPerFrame = 1000 / effectiveFps;


    const delayFrames = Math.max(0, (meta as SpriteMeta).delay_frames ?? 0);
    const firstIndex = Math.min(meta.frames - 1, delayFrames);
    const lastIndex = Math.max(firstIndex, meta.frames - 1 - delayFrames);

    const updateBackgroundPosition = (index: number) => {
      const col = index % meta.frames_per_row;
      const row = Math.floor(index / meta.frames_per_row);
      element.style.backgroundPosition = `${-col * frameWidth}px ${-row * frameHeight}px`;
    };

    frameIndex = firstIndex;
    updateBackgroundPosition(frameIndex);

    const loop = (now: number) => {
      const dt = now - lastTime;
      lastTime = now;

      if (isStopped) {
        return;
      }

      if ((frameIndex === firstIndex && holdFirstMs > 0) || (frameIndex === lastIndex && holdLastMs > 0)) {
        holdingMs += dt;
        const target = frameIndex === firstIndex ? holdFirstMs : holdLastMs;
        if (holdingMs < target) {
          rafRef.current = requestAnimationFrame(loop);
          return; // keep showing current frame
        }
        holdingMs = 0; // reset hold once satisfied
      }

      accumulatorMs += dt;
      while (accumulatorMs >= msPerFrame) {
        accumulatorMs -= msPerFrame;
        
        if (pingPong) {

          const nextFrame = frameIndex + direction;

          if (nextFrame > lastIndex) {

            direction = -1;
            frameIndex = lastIndex - 1;
          } else if (nextFrame < firstIndex) {

            if (isFinishing) {

              frameIndex = firstIndex;
              isStopped = true;
              break;
            } else {

              cycleCount++;

              if (maxCycles > 0 && cycleCount >= maxCycles && stopAtStart) {
                isFinishing = true;
                direction = -1; // ensure we go backward
                frameIndex = lastIndex;
              } else if (maxCycles > 0 && cycleCount >= maxCycles) {

                isStopped = true;
                break;
              } else {

                direction = 1;
                frameIndex = firstIndex + 1;
              }
            }
          } else {

            frameIndex = nextFrame;
          }
        } else {

          if (frameIndex >= lastIndex) {
            frameIndex = firstIndex;
          } else {
            frameIndex += 1;
          }
        }
      }
      updateBackgroundPosition(frameIndex);

      if (!isStopped) {
        rafRef.current = requestAnimationFrame(loop);
      }
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [meta, width, height, holdFirstMs, holdLastMs, speedMultiplier, pingPong, maxCycles, stopAtStart, metaUrl]);

  return <div ref={containerRef} className={className} aria-hidden />;
};

export default React.memo(SpritePlayer);


