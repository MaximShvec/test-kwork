/**
 * Префикс для путей к статике (для GitHub Pages: /test-kwork).
 * В workflow задаётся NEXT_PUBLIC_BASE_PATH, локально пусто.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return basePath ? `${basePath}${p}` : p;
}
