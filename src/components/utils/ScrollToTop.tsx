'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {

      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  useEffect(() => {

    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, [pathname]); // Dependency on pathname ensures scroll on route change

  return null; // This component doesn't render anything visible
}
