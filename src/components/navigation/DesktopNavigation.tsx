'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface NavLink {
  href: string;
  label: string;
}

interface DesktopNavigationProps {
  
  links: NavLink[];
  
  
  navAnimated?: boolean;
  
  
  onLinkClick?: (href: string) => void;
  
  
  className?: string;
  
  
  activationOffset?: number;
}

const WORD_ANIMATION_DELAY_INCREMENT = 0.12;
const WORD_ANIMATION_DURATION = 0.3;


export const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  links,
  navAnimated = true,
  onLinkClick,
  className,
  activationOffset = 100,
}) => {
  const [activeLink, setActiveLink] = useState('');
  const [scrollLocked, setScrollLocked] = useState(false);
  const navRef = useRef<HTMLUListElement>(null);

  useEffect(() => {

    const getSections = () => {
      return links
        .map(link => {
          const id = link.href.substring(1);
          if (id) return document.getElementById(id);
          return null;
        })
        .filter(Boolean) as HTMLElement[];
    };

    const handleScroll = () => {
      if (scrollLocked) return;

      const sections = getSections();
      const offset = window.scrollY;
      let newActiveLink = '';

      const header = document.querySelector('header');
      const headerHeight = header?.clientHeight || 140;
      const checkPoint = offset + headerHeight + activationOffset;

      const heroElement = document.querySelector('.video-hero') as HTMLElement | null;
      if (heroElement && offset < heroElement.offsetHeight * 0.7) {
        newActiveLink = '';
      } else {

        for (let i = sections.length - 1; i >= 0; i--) {
          const section = sections[i];
          if (!section) continue;
          
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;

          const extraOffset = section.id === 'pricing-gallery' ? 500 : 
                             section.id === 'order-form' ? -600 : 0;
          const adjustedSectionTop = sectionTop - extraOffset;

          if (adjustedSectionTop <= checkPoint && (adjustedSectionTop + sectionHeight) > checkPoint) {
            newActiveLink = section.id;
            break;
          }
        }
      }
      
      setActiveLink(newActiveLink);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [links, scrollLocked, activationOffset]);

  const handleScrollTo = useCallback((
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();

    const plainId = targetId.startsWith('#') ? targetId.substring(1) : targetId;

    setActiveLink(plainId);

    setScrollLocked(true);
    setTimeout(() => setScrollLocked(false), 900);

    const targetElement = document.getElementById(plainId);
    if (targetElement) {
      const header = document.querySelector('header');
      const headerHeight = header?.clientHeight || 80;

      const extraOffset = plainId === 'pricing-gallery' ? 500 : 
                         plainId === 'order-form' ? -600 : 0;
      
      window.scrollTo({
        top: targetElement.offsetTop - headerHeight - extraOffset,
        behavior: 'smooth',
      });
    }

    (e.currentTarget as HTMLElement)?.blur();

    if (onLinkClick) {
      onLinkClick(targetId);
    }
  }, [onLinkClick]);

  const renderAnimatedUnit = (text: string, unitGlobalIndex: number) => {
    return (
      <span
        key={`${text}-${unitGlobalIndex}`}
        className={cn('nav__word', navAnimated && 'nav__word--in')}
        style={{
          display: 'inline-block',
          transform: navAnimated ? 'translateY(0)' : 'translateY(-120%)',
          opacity: navAnimated ? 1 : 0,
          transition: `transform ${WORD_ANIMATION_DURATION}s cubic-bezier(.7,0,.3,1), opacity ${WORD_ANIMATION_DURATION}s cubic-bezier(.7,0,.3,1)`,
          transitionDelay: navAnimated ? `${unitGlobalIndex * WORD_ANIMATION_DELAY_INCREMENT}s` : '0s',
        }}
      >
        {text === ' ' ? '\u00A0' : text}
      </span>
    );
  };

  return (
    <nav className={cn('nav nav-adaptive hidden md:flex justify-center items-center', className)}>
      <ul ref={navRef} className="nav__list nav-list-adaptive">
        {links.map((link, linkIdx) => {
          const isActive = activeLink === (link.href.startsWith('#') ? link.href.substring(1) : link.href);

          let cumulativeUnitIndex = 0;
          for (let i = 0; i < linkIdx; i++) {
            const labelParts = links[i].label.split(' ');
            cumulativeUnitIndex += labelParts.length > 1 ? labelParts.length : 1;
          }

          const labelParts = link.label.split(' ');

          return (
            <li key={link.label}>
              <Link
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className={cn(
                  'nav__link nav-link-adaptive',
                  isActive && 'active'
                )}
                tabIndex={navAnimated ? 0 : -1}
                aria-label={link.label}
                aria-current={isActive ? 'page' : undefined}
                style={{ position: 'relative', display: 'inline-block' }}
              >
                {}
                {labelParts.length > 1 ? (
                  labelParts.map((word, wIdx) => (
                    <React.Fragment key={wIdx}>
                      {renderAnimatedUnit(word, cumulativeUnitIndex + wIdx)}
                      {wIdx !== labelParts.length - 1 && ' '}
                    </React.Fragment>
                  ))
                ) : (
                  renderAnimatedUnit(link.label, cumulativeUnitIndex)
                )}

                {}
                <svg
                  className={cn(
                    'svg-border',
                    isActive && 'svg-border--active'
                  )}
                  width="100%"
                  height="100%"
                  viewBox="0 0 120 40"
                  preserveAspectRatio="none"
                  style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    width: '100%', 
                    height: '100%', 
                    pointerEvents: 'none' 
                  }}
                  aria-hidden="true"
                >
                  {}
                  <path
                    className="svg-border__path svg-border__path--left"
                    d="M60 38 L15 38 A12 12 0 0 1 3 26 L3 14 A12 12 0 0 1 15 2 L60 2"
                    pathLength="1"
                  />
                  {}
                  <path
                    className="svg-border__path svg-border__path--right"
                    d="M60 38 L105 38 A12 12 0 0 0 117 26 L117 14 A12 12 0 0 0 105 2 L60 2"
                    pathLength="1"
                  />
                </svg>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default React.memo(DesktopNavigation);
