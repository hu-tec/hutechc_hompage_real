'use client';

import { useMemo, useState } from 'react';

type SettingsTab = 'common' | 'pages';

type PageConfig = {
  key: string;
  name: string;
  path: string;
  status: '준비중' | '적용중' | '미적용';
};

const MOCK_PAGES: PageConfig[] = [
  { key: 'admin-dashboard', name: '관리자 홈', path: '/admin/dashboard', status: '적용중' },
  { key: 'admin-exams', name: '시험 관리', path: '/admin/exams', status: '준비중' },
  { key: 'admin-data', name: '데이터 관리', path: '/admin/data', status: '준비중' },
  { key: 'admin-ui', name: '사용자 UI 관리', path: '/admin/ui', status: '준비중' },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('common');
  const [isEditingCommon, setIsEditingCommon] = useState(false);
  const [pageQuery, setPageQuery] = useState('');

  const filteredPages = useMemo(() => {
    const q = pageQuery.trim().toLowerCase();
    if (!q) return MOCK_PAGES;
    return MOCK_PAGES.filter((p) => {
      return p.name.toLowerCase().includes(q) || p.path.toLowerCase().includes(q);
    });
  }, [pageQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold">설정관리</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="grid grid-cols-[220px,minmax(0,1fr)] gap-6 items-start">
          <aside className="bg-white rounded-lg border border-gray-200 p-4 space-y-2 text-sm">
            <button
              type="button"
              onClick={() => setActiveTab('pages')}
              className={`w-full text-left px-3 py-2 rounded-md font-semibold ${
                activeTab === 'pages'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'bg-white text-gray-700 border border-transparent hover:bg-gray-50'
              }`}
            >
              페이지별 설정관리
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('common')}
              className={`w-full text-left px-3 py-2 rounded-md font-semibold ${
                activeTab === 'common'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'bg-white text-gray-700 border border-transparent hover:bg-gray-50'
              }`}
            >
              공통 데이터 설정
            </button>
          </aside>

          <section className="space-y-6">
            {activeTab === 'common' ? (
              <>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">공통 데이터 설정</h2>
                      <p className="text-xs text-gray-600 mt-1">
                        여러 페이지가 공유하는 설정의 기본값을 정의합니다. 이후 페이지별 설정에서 필요한 항목만 오버라이드할 수 있습니다.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-xs px-3 py-1.5 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
                      onClick={() => {
                        if (isEditingCommon) {
                          // TODO: 저장 로직 연결 예정
                          alert('공통 데이터 설정이 (mock) 저장되었습니다.');
                        }
                        setIsEditingCommon((prev) => !prev);
                      }}
                    >
                      {isEditingCommon ? '저장하기' : '수정하기'}
                    </button>
                  </div>

                  <div className="border border-dashed border-gray-200 rounded-lg bg-gray-50 px-6 py-14 text-center">
                    <div className="text-sm font-semibold text-gray-700 mb-1">
                      {isEditingCommon ? '공통 데이터 설정 편집 모드' : '내용 없음'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {isEditingCommon
                        ? '여기에 공통 데이터 설정 항목이 추가될 예정입니다.'
                        : '공통 데이터 설정 항목은 요청 주시면 여기부터 구성하겠습니다.'}
                    </div>
                  </div>

                  {isEditingCommon && (
                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        className="px-3 py-1.5 text-xs rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                        onClick={() => alert('새 공통 설정 항목 추가 (mock)')}
                      >
                        추가하기
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">페이지별 설정관리</h2>
                    <p className="text-xs text-gray-600 mt-1">
                      공통 설정을 기반으로 페이지별로 다른 값이 필요한 항목만 오버라이드합니다.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      value={pageQuery}
                      onChange={(e) => setPageQuery(e.target.value)}
                      placeholder="페이지 검색 (이름/경로)"
                      className="w-64 border border-gray-300 rounded-md px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">페이지</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">경로</th>
                        <th className="px-4 py-3 text-center font-medium text-gray-500">상태</th>
                        <th className="px-4 py-3 text-center font-medium text-gray-500">관리</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {filteredPages.map((p) => {
                        let badgeClass = 'bg-gray-100 text-gray-700 border-gray-200';
                        if (p.status === '적용중') badgeClass = 'bg-green-100 text-green-800 border-green-200';
                        if (p.status === '준비중') badgeClass = 'bg-indigo-100 text-indigo-800 border-indigo-200';
                        return (
                          <tr key={p.key} className="hover:bg-gray-50">
                            <td className="px-4 py-3 align-top">
                              <div className="font-medium text-gray-900">{p.name}</div>
                              <div className="text-xs text-gray-400">key: {p.key}</div>
                            </td>
                            <td className="px-4 py-3 align-top text-gray-700">{p.path}</td>
                            <td className="px-4 py-3 align-top text-center">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeClass}`}
                              >
                                {p.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 align-top text-center">
                              <button
                                type="button"
                                className="px-3 py-1.5 text-xs rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                                onClick={() => alert(`페이지 설정 편집(예정): ${p.path}`)}
                              >
                                설정 편집
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredPages.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-12 text-center text-sm text-gray-500">
                            검색 결과가 없습니다.
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

