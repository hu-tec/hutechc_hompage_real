'use client';

import { PriceProvider } from '@/lib/priceContext';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PriceProvider>
      {children}
    </PriceProvider>
  );
}
