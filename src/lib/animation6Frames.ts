import { asset } from "./basePath";

export const animation6Frames: string[] = Array.from({ length: 6855 - 6762 + 1 }, (_, i) => {
  const frameNumber = 6762 + i;
  return asset(`/animation6/IMG_${frameNumber}.webp`);
});


