'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface PriceSettings {
  // 번역 방식별 기본 요금
  translator_text: number;
  translator_voice: number;
  translator_video: number;
  ai_text: number;
  ai_voice: number;
  ai_video: number;
  
  // 분야별 추가 요금
  marketing: number;
  law: number;
  tech: number;
  academic: number;
  medical: number;
  finance: number;
  
  // 긴급도 할증
  urgent1: number;
  urgent2: number;
}

interface PriceContextType {
  prices: PriceSettings;
  updatePrice: (key: keyof PriceSettings, value: number) => void;
  updatePrices: (newPrices: Partial<PriceSettings>) => void;
}

const PriceContext = createContext<PriceContextType | undefined>(undefined);

const DEFAULT_PRICES: PriceSettings = {
  translator_text: 50,
  translator_voice: 3000,
  translator_video: 5000,
  ai_text: 3,
  ai_voice: 500,
  ai_video: 800,
  marketing: 25,
  law: 30,
  tech: 35,
  academic: 38,
  medical: 40,
  finance: 45,
  urgent1: 30,
  urgent2: 50,
};

export function PriceProvider({ children }: { children: React.ReactNode }) {
  const [prices, setPrices] = useState<PriceSettings>(DEFAULT_PRICES);

  // 클라이언트에 저장된 가격 설정(localStorage) 불러오기
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const stored = window.localStorage.getItem('priceSettings');
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<PriceSettings>;
        setPrices((prev) => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      console.error('Failed to load price settings from localStorage', e);
    }
  }, []);

  const persist = (next: PriceSettings) => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('priceSettings', JSON.stringify(next));
      }
    } catch (e) {
      console.error('Failed to save price settings to localStorage', e);
    }
  };

  const updatePrice = (key: keyof PriceSettings, value: number) => {
    setPrices((prev) => {
      const next = { ...prev, [key]: value };
      persist(next);
      return next;
    });
  };

  const updatePrices = (newPrices: Partial<PriceSettings>) => {
    setPrices((prev) => {
      const next = { ...prev, ...newPrices };
      persist(next);
      return next;
    });
  };

  return (
    <PriceContext.Provider value={{ prices, updatePrice, updatePrices }}>
      {children}
    </PriceContext.Provider>
  );
}

export function usePrice() {
  const context = useContext(PriceContext);
  if (!context) {
    throw new Error('usePrice must be used within PriceProvider');
  }
  return context;
}
