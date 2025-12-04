'use client';

import Link from 'next/link';
import { usePrice, type PriceSettings } from '@/lib/priceContext';
import { useState } from 'react';

export default function AdminPricingPage() {
  const { prices, updatePrices } = usePrice();
  const [saved, setSaved] = useState(false);

  const handleChange = (key: keyof PriceSettings, value: number) => {
    updatePrices({ [key]: value });
    setSaved(false);
  };

  const handleSave = () => {
    alert('가격이 저장되었습니다! (모든 페이지에 반영되었습니다)');
    setSaved(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900 text-sm">
            ← 관리자 대시보드
          </Link>
          <div className="text-2xl font-bold">가격 및 요금 관리</div>
          <div className="w-20"></div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">가격 설정</h1>
          <p className="text-gray-600">번역 서비스의 모든 가격을 관리하세요</p>
        </div>

        <div className="space-y-8">
          {/* 1. 번역 방식별 기본 요금 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-4 border-b">
              1️⃣ 번역 방식별 기본 요금
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  번역사 - 텍스트 (₩/단어)
                </label>
                <input
                  type="number"
                  value={prices.translator_text}
                  onChange={(e) => handleChange('translator_text', Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  번역사 - 음성 (₩/분)
                </label>
                <input
                  type="number"
                  value={prices.translator_voice}
                  onChange={(e) => handleChange('translator_voice', Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  번역사 - 동영상 (₩/분)
                </label>
                <input
                  type="number"
                  value={prices.translator_video}
                  onChange={(e) => handleChange('translator_video', Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AI - 텍스트 (₩/글자)
                </label>
                <input
                  type="number"
                  value={prices.ai_text}
                  onChange={(e) => handleChange('ai_text', Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AI - 음성 (₩/분)
                </label>
                <input
                  type="number"
                  value={prices.ai_voice}
                  onChange={(e) => handleChange('ai_voice', Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AI - 동영상 (₩/분)
                </label>
                <input
                  type="number"
                  value={prices.ai_video}
                  onChange={(e) => handleChange('ai_video', Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* 2. 전문 분야별 추가 요금 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-4 border-b">
              2️⃣ 전문 분야별 추가 요금 (₩/단어)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  마케팅
                </label>
                <input
                  type="number"
                  value={prices.marketing}
                  onChange={(e) => handleChange('marketing', Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  법률
                </label>
                <input
                  type="number"
                  value={prices.law}
                  onChange={(e) => handleChange('law', Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기술/IT
                </label>
                <input
                  type="number"
                  value={prices.tech}
                  onChange={(e) => handleChange('tech', Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  학술/논문
                </label>
                <input
                  type="number"
                  value={prices.academic}
                  onChange={(e) => handleChange('academic', Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  의료/제약
                </label>
                <input
                  type="number"
                  value={prices.medical}
                  onChange={(e) => handleChange('medical', Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  금융
                </label>
                <input
                  type="number"
                  value={prices.finance}
                  onChange={(e) => handleChange('finance', Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* 3. 긴급도 할증 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-4 border-b">
              3️⃣ 긴급도별 할증 (%)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  긴급1 (3일)
                </label>
                <input
                  type="number"
                  value={prices.urgent1}
                  onChange={(e) => handleChange('urgent1', Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">기본 금액 대비 할증 비율</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  긴급2 (1일)
                </label>
                <input
                  type="number"
                  value={prices.urgent2}
                  onChange={(e) => handleChange('urgent2', Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">기본 금액 대비 할증 비율</p>
              </div>
            </div>
          </div>

          {/* 저장 버튼 */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleSave}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              💾 가격 저장
            </button>
            {saved && (
              <div className="text-green-600 font-semibold flex items-center gap-2">
                ✅ 저장되었습니다
              </div>
            )}
          </div>
        </div>

        {/* 미리보기 */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📊 현재 가격표 미리보기</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-4 rounded border border-gray-200">
              <div className="text-xs text-gray-600">번역사 텍스트</div>
              <div className="text-lg font-bold text-purple-600">₩{prices.translator_text}/단어</div>
            </div>
            <div className="bg-white p-4 rounded border border-gray-200">
              <div className="text-xs text-gray-600">AI 텍스트</div>
              <div className="text-lg font-bold text-blue-600">₩{prices.ai_text}/글자</div>
            </div>
            <div className="bg-white p-4 rounded border border-gray-200">
              <div className="text-xs text-gray-600">의료/제약 추가</div>
              <div className="text-lg font-bold text-green-600">+₩{prices.medical}/단어</div>
            </div>
            <div className="bg-white p-4 rounded border border-gray-200">
              <div className="text-xs text-gray-600">긴급1 할증</div>
              <div className="text-lg font-bold text-orange-600">+{prices.urgent1}%</div>
            </div>
            <div className="bg-white p-4 rounded border border-gray-200">
              <div className="text-xs text-gray-600">긴급2 할증</div>
              <div className="text-lg font-bold text-red-600">+{prices.urgent2}%</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
