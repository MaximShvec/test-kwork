'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseHeroVideoOptions {
  initialMuted?: boolean;
  initialVolume?: number;
  autoPlay?: boolean;
  isMobile?: boolean;
}

export interface HeroVideoApi {
  videoRef: React.RefObject<HTMLVideoElement>;

  isPlaying: boolean;
  isMuted: boolean;
  isFullscreen: boolean;

  play: () => void;
  pause: () => void;
  togglePlay: () => void;

  mute: () => void;
  unmute: () => void;
  toggleMute: () => void;

  enterFullscreen: () => void;
  exitFullscreen: () => void;
  toggleFullscreen: () => void;
}

export function useHeroVideo({
  initialMuted = true,
  initialVolume = 0.5,
  autoPlay = false,
}: UseHeroVideoOptions = {}): HeroVideoApi {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [isFullscreen, setIsFullscreen] = useState(false);

  

  const play = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const promise = video.play();
    if (promise !== undefined) {
      promise
        .then(() => setIsPlaying(true))
        .catch(() => {

        });
    } else {
      setIsPlaying(true);
    }
  }, []);

  const pause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);

  

  const mute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    setIsMuted(true);
  }, []);

  const unmute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    video.volume = initialVolume;
    setIsMuted(false);
  }, [initialVolume]);

  const toggleMute = useCallback(() => {
    if (isMuted) unmute();
    else mute();
  }, [isMuted, mute, unmute]);

  

  const enterFullscreen = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if ((video as any).webkitRequestFullscreen) {
      (video as any).webkitRequestFullscreen();
    } else if ((video as any).webkitEnterFullscreen) {
      (video as any).webkitEnterFullscreen();
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (isFullscreen) exitFullscreen();
    else enterFullscreen();
  }, [isFullscreen, enterFullscreen, exitFullscreen]);

  

  useEffect(() => {
    const handler = () => {
      const active = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement
      );
      setIsFullscreen(active);
    };

    document.addEventListener('fullscreenchange', handler);
    document.addEventListener('webkitfullscreenchange', handler);

    return () => {
      document.removeEventListener('fullscreenchange', handler);
      document.removeEventListener('webkitfullscreenchange', handler);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = initialMuted;
    video.volume = initialVolume;

    if (autoPlay) {
      play();
    }
  }, [initialMuted, initialVolume, autoPlay, play]);

  return {
    videoRef,

    isPlaying,
    isMuted,
    isFullscreen,

    play,
    pause,
    togglePlay,

    mute,
    unmute,
    toggleMute,

    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
  };
}
