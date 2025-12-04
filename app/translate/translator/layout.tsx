'use client';

import IconSidebar from '@/components/IconSidebar';
import TranslatorSidebar from '@/components/TranslatorSidebar';
import { TranslatorProvider } from '@/lib/translatorContext';

export default function TranslatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TranslatorProvider>
      <div className="flex">
        <IconSidebar />
        <TranslatorSidebar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </TranslatorProvider>
  );
}
