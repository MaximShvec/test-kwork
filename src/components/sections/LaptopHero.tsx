'use client';

import React, { useEffect, useState } from 'react';
import { Hero } from '@/components/sections/Hero'; // ⚠️ named import - используем тот же Hero

export default function LaptopHero(): JSX.Element {


  const [isLaptop, setIsLaptop] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= 1024 && window.innerWidth <= 1440;
  });

  useEffect(() => {

    const onResize = () => {
      const nowLaptop = window.innerWidth >= 1024 && window.innerWidth <= 1440;
      setIsLaptop(nowLaptop);
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);




  useEffect(() => {
    if (typeof document === 'undefined') return;

    try {
      if (isLaptop) {
        document.body.setAttribute('data-hero-mode', 'laptop');
      } else {

        if (document.body.getAttribute('data-hero-mode') === 'laptop') {
          document.body.removeAttribute('data-hero-mode');
        }
      }
    } catch (err) {



      console.error('LaptopHero: error setting body attribute', err);
    }

    return () => {
      try {
        if (document.body.getAttribute('data-hero-mode') === 'laptop') {
          document.body.removeAttribute('data-hero-mode');
        }
      } catch (err) {

      }
    };
  }, [isLaptop]);

  return (


    <div
      id="laptop-hero"
      className="laptop-hero-wrapper"
      data-hero-mode={isLaptop ? 'laptop' : undefined}
      aria-hidden={isLaptop ? 'false' : 'true'}
    >
      {}
      <Hero startHeroAnimations />
    </div>
  );
}
