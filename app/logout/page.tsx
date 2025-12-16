'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    })();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-sm text-gray-600">로그아웃 중...</div>
    </div>
  );
}
