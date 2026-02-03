import { asset } from "./basePath";

export const animation4Frames: string[] = Array.from({ length: 51 }, (_, i) => {
  const frameNumber = 6664 + i;
  return asset(`/animation4/IMG_${frameNumber}.webp`);
}).filter((_, index) => {
  const frameNumber = 6664 + index;
  return frameNumber < 6680 || frameNumber > 6685;
}); 
