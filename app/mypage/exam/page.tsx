'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 구 경로(/mypage/exam)로 접근 시 새 시험 메인(/exam)으로 리다이렉트
export default function LegacyExamPageRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/exam');
  }, [router]);

  return null;
}
