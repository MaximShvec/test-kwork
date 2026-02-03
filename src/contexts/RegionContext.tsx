'use client';

import React, { createContext, useContext, useMemo, useState, useEffect, startTransition } from 'react';

export type RegionKey = 'spb' | 'msk';

interface Region {
  id: string;
  key: RegionKey;
  name: string;
  phoneDisplay: string;
  phoneHref: string;
  mobileDisplay?: string;
  mobileHref?: string;
  workingHours: string;
  whatsappDisplay?: string;
  whatsappHref?: string;
  email?: string;
  instagram?: string;
  telegram?: string;
  address?: string;
}

const STORAGE_KEY = 'region';

const REGION_CONFIG: Record<RegionKey, Region> = {
  spb: {
    id: 'spb',
    key: 'spb',
    name: 'Санкт-Петербург',
    phoneDisplay: '+7 (921) 999-22-00',
    phoneHref: 'tel:+79219992200',
    mobileDisplay: '+7 (921) 999-22-00',
    mobileHref: 'tel:+79219992200',
    workingHours: 'Пн-Вс: 9:00-21:00',
    whatsappDisplay: '+7 (921) 999-22-00',
    whatsappHref: 'https://wa.me/79219992200',
    email: 'shelf.sborka.spb@gmail.com',
    instagram: '@shelfsborka',
    telegram: '@shelfsborka_spb',
    address: 'г. Санкт-Петербург, Средний пр. В.О. 99/18',
  },
  msk: {
    id: 'msk',
    key: 'msk',
    name: 'Москва',
    phoneDisplay: '+7 (984) 999-11-99',
    phoneHref: 'tel:+79849991199',
    mobileDisplay: '+7 (984) 999-11-99',
    mobileHref: 'tel:+79849991199',
    workingHours: 'Пн-Вс: 9:00-21:00',
    whatsappDisplay: '+7 (984) 999-11-99',
    whatsappHref: 'https://wa.me/79849991199',
    email: 'Shelf.job.msk@gmail.com',
    instagram: '@shelfsborka',
    telegram: '@shelfsborka_msk',
    address: 'г. Москва, Потаповский переулок 5с3',
  },
};

interface RegionContextValue {
  activeRegion: Region;
  activeKey: RegionKey;
  regions: Region[];
  setActiveRegion: (key: RegionKey) => void;
}

const RegionContext = createContext<RegionContextValue | undefined>(undefined);

export const RegionProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeKey, setActiveKey] = useState<RegionKey>('spb');
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY) as RegionKey | null;
    if (stored === 'spb' || stored === 'msk') {
      setActiveKey(stored);
    }
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !hasHydrated) return;
    window.localStorage.setItem(STORAGE_KEY, activeKey);
  }, [activeKey, hasHydrated]);

  const setActiveRegionWrapped = useMemo(() => (key: RegionKey) => {
    startTransition(() => {
      setActiveKey(key);
    });
  }, []);

  const value = useMemo<RegionContextValue>(() => ({
    activeRegion: REGION_CONFIG[activeKey],
    activeKey,
    regions: Object.values(REGION_CONFIG),
    setActiveRegion: setActiveRegionWrapped,
  }), [activeKey, setActiveRegionWrapped]);

  return (
    <RegionContext.Provider value={value}>
      {children}
    </RegionContext.Provider>
  );
};

export const useRegion = (): RegionContextValue => {
  const context = useContext(RegionContext);
  if (context === undefined) {
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return context;
};
