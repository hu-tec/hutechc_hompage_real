'use client';

import Link from 'next/link';
import { adminTranslators } from '@/lib/adminTranslatorsMock';

export default function AdminTranslatorsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">현재 번역사 리스트</h1>
        <p className="text-sm text-gray-600">
          플랫폼에 등록된 번역사 목록을 확인하고, 레벨·전문분야·활동 가능 시간 정보를 한 눈에 볼 수 있습니다.
        </p>
      </div>

      <div className="mt-4 bg-white border border-gray-200 rounded-lg overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500">우선순위</th>
              <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500">이름</th>
              <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500">레벨</th>
              <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500 whitespace-nowrap">전문가 구분</th>
              <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500 whitespace-nowrap">활동 가능 시간</th>
              <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500 whitespace-nowrap">서비스 유형</th>
              <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500 whitespace-nowrap">작업 단위</th>
              <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500 whitespace-nowrap">난이도</th>
              <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500 whitespace-nowrap">전문 영역</th>
              <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500 whitespace-nowrap">평점 / 완료수</th>
            </tr>
          </thead>
          <tbody>
            {adminTranslators.map((t) => (
              <tr key={t.id} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="px-4 py-2 text-xs text-gray-500 text-center">{t.priority}</td>
                <td className="px-4 py-2 font-medium text-purple-700 text-center">
                  <Link
                    href={`/admin/translators/${t.id}`}
                    className="hover:underline"
                  >
                    {t.name}
                  </Link>
                </td>
                <td className="px-4 py-2 text-center">
                  <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-0.5 text-xs font-semibold text-purple-700 whitespace-nowrap">
                    {t.level}
                  </span>
                </td>
                <td className="px-4 py-2 text-gray-700 whitespace-nowrap text-center">{t.expertType}</td>
                <td className="px-4 py-2 text-gray-700 whitespace-nowrap text-center">{t.time}</td>
                <td className="px-4 py-2 text-gray-700 whitespace-nowrap text-center">{t.serviceType}</td>
                <td className="px-4 py-2 text-gray-700 text-center">{t.workUnit}</td>
                <td className="px-4 py-2 text-gray-700 text-center">{t.difficulty}</td>
                <td className="px-4 py-2 text-gray-700 text-center whitespace-nowrap">
                  {t.area} / {t.subArea}
                </td>
                <td className="px-4 py-2 text-gray-700 whitespace-nowrap text-center">
                  <span className="font-semibold text-yellow-600">{t.rating.toFixed(2)}★</span>
                  <span className="ml-1 text-xs text-gray-500">/ {t.completedCount}건</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
