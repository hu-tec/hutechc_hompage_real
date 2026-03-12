'use client';

import { useMemo, useState } from 'react';

type SettingsTab = 'common' | 'pages';

type PageConfig = {
  key: string;
  name: string;
  path: string;
  status: '준비중' | '적용중' | '미적용';
};

type CategoryTree = Record<string, Record<string, string[]>>;

const MOCK_PAGES: PageConfig[] = [
  { key: 'admin-dashboard', name: '관리자 홈', path: '/admin/dashboard', status: '적용중' },
  { key: 'admin-exams', name: '시험 관리', path: '/admin/exams', status: '준비중' },
  { key: 'admin-data', name: '데이터 관리', path: '/admin/data', status: '준비중' },
  { key: 'admin-ui', name: '사용자 UI 관리', path: '/admin/ui', status: '준비중' },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('common');
  const [isEditingCommon, setIsEditingCommon] = useState(false);
  const [activeCommonTool, setActiveCommonTool] = useState<'none' | 'category' | 'checkbox'>('none');
  const [categoryTitle, setCategoryTitle] = useState<string>('카테고리 트리 설정 (대/중/소)');
  const [checkboxTitle, setCheckboxTitle] = useState<string>('체크박스 설정');
  const [pageQuery, setPageQuery] = useState('');

  // 공통 데이터 설정에서 사용할 카테고리 트리 (대/중/소)
  const [categoryTree, setCategoryTree] = useState<CategoryTree>({});
  const [selectedLargeCategory, setSelectedLargeCategory] = useState<string | null>(null);
  const [selectedMidCategory, setSelectedMidCategory] = useState<string | null>(null);

  // 공통 데이터 설정 - "추가하기" 플로우용 모달 상태
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  type CheckboxItem = {
    id: string;
    label: string;
    defaultChecked: boolean;
  };
  const [checkboxItems, setCheckboxItems] = useState<CheckboxItem[]>([]);

  // 어떤 블록을 화면에 보여줄지 여부 (카테고리, 체크박스는 여러 번 추가하는 대신 각 1세트씩 켜고 끄는 구조)
  const [showCategoryBlock, setShowCategoryBlock] = useState(false);
  const [showCheckboxBlock, setShowCheckboxBlock] = useState(false);

  const filteredPages = useMemo(() => {
    const q = pageQuery.trim().toLowerCase();
    if (!q) return MOCK_PAGES;
    return MOCK_PAGES.filter((p) => {
      return p.name.toLowerCase().includes(q) || p.path.toLowerCase().includes(q);
    });
  }, [pageQuery]);

  const largeCategories = Object.keys(categoryTree);
  const midCategories = selectedLargeCategory
    ? Object.keys(categoryTree[selectedLargeCategory] ?? {})
    : [];
  const smallCategories =
    selectedLargeCategory && selectedMidCategory
      ? categoryTree[selectedLargeCategory]?.[selectedMidCategory] ?? []
      : [];

  const handleAddLargeCategory = () => {
    if (!isEditingCommon) {
      window.alert('카테고리를 추가하려면 먼저 "수정하기"를 눌러 편집 모드로 전환하세요.');
      return;
    }
    const name = window.prompt('대 카테고리 이름을 입력하세요');
    if (!name?.trim()) return;
    const key = name.trim();
    setCategoryTree((prev) => {
      if (prev[key]) return prev;
      return { ...prev, [key]: {} };
    });
    setSelectedLargeCategory(key);
    setSelectedMidCategory(null);
  };

  const handleAddMidCategory = () => {
    if (!isEditingCommon) {
      window.alert('카테고리를 추가하려면 먼저 "수정하기"를 눌러 편집 모드로 전환하세요.');
      return;
    }
    if (!selectedLargeCategory) {
      alert('먼저 대 카테고리를 선택하세요.');
      return;
    }
    const name = window.prompt('중 카테고리 이름을 입력하세요');
    if (!name?.trim()) return;
    const key = name.trim();
    setCategoryTree((prev) => {
      const large = prev[selectedLargeCategory] ?? {};
      return {
        ...prev,
        [selectedLargeCategory]: {
          ...large,
          [key]: [],
        },
      };
    });
    setSelectedMidCategory(key);
  };

  const handleAddSmallCategory = () => {
    if (!isEditingCommon) {
      window.alert('카테고리를 추가하려면 먼저 "수정하기"를 눌러 편집 모드로 전환하세요.');
      return;
    }
    if (!selectedLargeCategory || !selectedMidCategory) {
      alert('먼저 대/중 카테고리를 선택하세요.');
      return;
    }
    const name = window.prompt('소 카테고리 이름을 입력하세요');
    if (!name?.trim()) return;
    const value = name.trim();
    setCategoryTree((prev) => {
      const large = prev[selectedLargeCategory] ?? {};
      const mids = { ...large };
      const smalls = mids[selectedMidCategory] ?? [];
      mids[selectedMidCategory] = [...smalls, value];
      return {
        ...prev,
        [selectedLargeCategory]: mids,
      };
    });
  };

  const hasAnyCategory =
    Object.keys(categoryTree).length > 0 ||
    Object.values(categoryTree).some((mids) => Object.keys(mids).length > 0);
  const hasAnyCheckbox = checkboxItems.length > 0;

  const handleSaveCommon = () => {
    // 처음 누를 때는 "수정하기" → 편집 모드 진입
    if (!isEditingCommon) {
      setIsEditingCommon(true);
      return;
    }

    // 편집 모드에서 다시 누르면 "저장하기" 동작
    if (activeCommonTool === 'category') {
      if (!hasAnyCategory) {
        window.alert('저장할 카테고리가 없습니다. 대/중/소 카테고리를 먼저 추가해주세요.');
        return;
      }

      // TODO: 이후 실제 저장/서버 연동 시 이 부분에서 처리
      window.alert('공통 카테고리 설정이 저장되었습니다. (현재는 화면에만 유지됩니다)');
    } else if (activeCommonTool === 'checkbox') {
      if (!hasAnyCheckbox) {
        window.alert('저장할 체크박스 항목이 없습니다. 항목을 먼저 추가해주세요.');
        return;
      }
      window.alert('체크박스 설정이 저장되었습니다. (현재는 화면에만 유지됩니다)');
    }

    // 저장 후에는 수정모드에서 나가되, 설정 값은 그대로 유지
    setIsEditingCommon(false);
  };

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
                      onClick={handleSaveCommon}
                    >
                      {isEditingCommon ? '저장하기' : '수정하기'}
                    </button>
                  </div>

                  {!((isEditingCommon || hasAnyCategory || hasAnyCheckbox) && (showCategoryBlock || showCheckboxBlock)) && (
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
                  )}

                  {showCategoryBlock && (isEditingCommon || hasAnyCategory) && (
                    <div className="mt-6 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 max-w-xs">
                          {isEditingCommon ? (
                            <input
                              className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm font-semibold text-gray-900 bg-white"
                              value={categoryTitle}
                              onChange={(e) => setCategoryTitle(e.target.value)}
                              placeholder="카테고리 설정 이름을 입력하세요"
                            />
                          ) : (
                            <h3 className="text-sm font-semibold text-gray-900">
                              {categoryTitle || '카테고리 트리 설정 (대/중/소)'}
                            </h3>
                          )}
                        </div>
                        {isEditingCommon && (
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-gray-600 mt-1">
                              대 카테고리를 먼저 추가하고, 각 대 카테고리 안에 중·소 카테고리를 계층적으로 추가하세요.
                            </p>
                            <button
                              type="button"
                              className="px-3 py-1.5 text-xs rounded-md border border-red-200 text-red-700 hover:bg-red-50"
                              onClick={() => {
                                if (!window.confirm('현재 카테고리 설정 전체를 삭제하시겠습니까?')) return;
                                setCategoryTree({});
                                setSelectedLargeCategory(null);
                                setSelectedMidCategory(null);
                                setShowCategoryBlock(false);
                              }}
                            >
                              전체 삭제
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* 대 카테고리 */}
                        <div className="border border-gray-200 rounded-md bg-gray-50">
                          <div className="flex items-center justify-between mb-2 px-3 py-2 bg-indigo-50 rounded-t-md border-b border-indigo-100">
                            <h4 className="text-sm font-semibold text-gray-900">대 카테고리</h4>
                            {isEditingCommon && (
                              <button
                                type="button"
                                className="text-[11px] px-2 py-0.5 rounded-md border border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                                onClick={handleAddLargeCategory}
                              >
                                + 추가
                              </button>
                            )}
                          </div>
                          <div className="p-3 space-y-1 max-h-64 overflow-y-auto">
                            {largeCategories.length === 0 ? (
                              <div className="text-[11px] text-gray-400 py-4 text-center">
                                아직 대 카테고리가 없습니다.
                              </div>
                            ) : (
                              largeCategories.map((name) => {
                                const isActive = selectedLargeCategory === name;
                                return (
                                  <button
                                    key={name}
                                    type="button"
                                    onClick={() => {
                                      setSelectedLargeCategory(name);
                                      setSelectedMidCategory(null);
                                    }}
                                    className={`w-full text-left px-2 py-1 rounded-md text-xs ${
                                      isActive
                                        ? 'bg-indigo-50 text-indigo-700'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                                  >
                                    {name}
                                  </button>
                                );
                              })
                            )}
                          </div>
                        </div>

                        {/* 중 카테고리 */}
                        <div className="border border-gray-200 rounded-md bg-gray-50">
                          <div className="flex items-center justify-between mb-2 px-3 py-2 bg-indigo-50 rounded-t-md border-b border-indigo-100">
                            <h4 className="text-sm font-semibold text-gray-900">중 카테고리</h4>
                            {isEditingCommon && (
                              <button
                                type="button"
                                className="text-[11px] px-2 py-0.5 rounded-md border border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                                onClick={handleAddMidCategory}
                              >
                                + 추가
                              </button>
                            )}
                          </div>
                          <div className="text-[11px] text-gray-500 mb-1 px-3 pt-2">
                            {selectedLargeCategory
                              ? `대 카테고리: ${selectedLargeCategory}`
                              : '먼저 대 카테고리를 선택하세요.'}
                          </div>
                          <div className="px-3 pb-3 space-y-1 max-h-64 overflow-y-auto">
                            {selectedLargeCategory && midCategories.length === 0 ? (
                              <div className="text-[11px] text-gray-400 py-4 text-center">
                                아직 중 카테고리가 없습니다.
                              </div>
                            ) : (
                              midCategories.map((name) => {
                                const isActive = selectedMidCategory === name;
                                return (
                                  <button
                                    key={name}
                                    type="button"
                                    onClick={() => setSelectedMidCategory(name)}
                                    className={`w-full text-left px-2 py-1 rounded-md text-xs ${
                                      isActive
                                        ? 'bg-indigo-50 text-indigo-700'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                                  >
                                    {name}
                                  </button>
                                );
                              })
                            )}
                          </div>
                        </div>

                        {/* 소 카테고리 */}
                        <div className="border border-gray-200 rounded-md bg-gray-50">
                          <div className="flex items-center justify-between mb-2 px-3 py-2 bg-indigo-50 rounded-t-md border-b border-indigo-100">
                            <h4 className="text-sm font-semibold text-gray-900">소 카테고리</h4>
                            {isEditingCommon && (
                              <button
                                type="button"
                                className="text-[11px] px-2 py-0.5 rounded-md border border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                                onClick={handleAddSmallCategory}
                              >
                                + 추가
                              </button>
                            )}
                          </div>
                          <div className="text-[11px] text-gray-500 mb-1 px-3 pt-2">
                            {selectedLargeCategory && selectedMidCategory
                              ? `대: ${selectedLargeCategory} / 중: ${selectedMidCategory}`
                              : '먼저 대/중 카테고리를 선택하세요.'}
                          </div>
                          <div className="px-3 pb-3 space-y-1 max-h-64 overflow-y-auto">
                            {selectedLargeCategory && selectedMidCategory && smallCategories.length === 0 ? (
                              <div className="text-[11px] text-gray-400 py-4 text-center">
                                아직 소 카테고리가 없습니다.
                              </div>
                            ) : (
                              smallCategories.map((name) => (
                                <div
                                  key={name}
                                  className="w-full px-2 py-1 rounded-md text-xs bg-white text-gray-700 border border-gray-200"
                                >
                                  {name}
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 text-[11px] text-gray-500">
                        ※ 현재는 컴포넌트 로컬 상태로만 관리되며, 추후 공통 설정 스키마/저장소와 연결 예정입니다.
                      </div>
                    </div>
                  )}

                  {showCheckboxBlock && (isEditingCommon || hasAnyCheckbox) && (
                    <div className="mt-6 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 max-w-xs">
                          {isEditingCommon ? (
                            <input
                              className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm font-semibold text-gray-900 bg-white"
                              value={checkboxTitle}
                              onChange={(e) => setCheckboxTitle(e.target.value)}
                              placeholder="체크박스 설정 이름을 입력하세요"
                            />
                          ) : (
                            <h3 className="text-sm font-semibold text-gray-900">
                              {checkboxTitle || '체크박스 설정'}
                            </h3>
                          )}
                        </div>
                        {isEditingCommon && (
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-gray-600 mt-1">
                              제목 아래에 노출될 체크박스 항목들을 추가하고, 기본 선택 여부를 설정합니다.
                            </p>
                            <button
                              type="button"
                              className="px-3 py-1.5 text-xs rounded-md border border-red-200 text-red-700 hover:bg-red-50"
                              onClick={() => {
                                if (!window.confirm('현재 체크박스 설정 전체를 삭제하시겠습니까?')) return;
                                setCheckboxItems([]);
                                setShowCheckboxBlock(false);
                              }}
                            >
                              전체 삭제
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="border border-gray-200 rounded-md bg-gray-50 p-4 space-y-3">
                        {checkboxItems.length === 0 ? (
                          <div className="text-xs text-gray-400 text-center py-6">
                            아직 체크박스 항목이 없습니다. 아래 추가하기 버튼으로 항목을 만들어주세요.
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {checkboxItems.map((item, idx) => (
                              <div
                                key={item.id}
                                className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-2 py-1 text-xs md:text-sm w-full sm:w-[48%] md:w-[32%] lg:w-[18%]"
                              >
                                <span className="text-[10px] text-gray-400">{idx + 1}.</span>
                                <label className="flex items-center gap-1 flex-1">
                                  <input
                                    type="checkbox"
                                    className="h-3 w-3 md:h-4 md:w-4"
                                    checked={item.defaultChecked}
                                    onChange={(e) => {
                                      const next = [...checkboxItems];
                                      next[idx] = { ...next[idx], defaultChecked: e.target.checked };
                                      setCheckboxItems(next);
                                    }}
                                  />
                                  {isEditingCommon ? (
                                    <input
                                      className="flex-1 border border-gray-300 rounded-md px-1.5 py-0.5 text-[11px]"
                                      value={item.label}
                                      onChange={(e) => {
                                        const next = [...checkboxItems];
                                        next[idx] = { ...next[idx], label: e.target.value };
                                        setCheckboxItems(next);
                                      }}
                                      placeholder="체크박스 항목 이름"
                                    />
                                  ) : (
                                    <span className="text-xs md:text-sm text-gray-800 truncate">
                                      {item.label}
                                    </span>
                                  )}
                                </label>
                                {isEditingCommon && (
                                  <button
                                    type="button"
                                    className="text-[10px] text-red-600 hover:text-red-800"
                                    onClick={() => {
                                      setCheckboxItems((prev) => prev.filter((x) => x.id !== item.id));
                                    }}
                                  >
                                    삭제
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {isEditingCommon && (
                          <div className="flex justify-end">
                            <button
                              type="button"
                              className="px-3 py-1.5 text-xs rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                              onClick={() => {
                                const label = window.prompt('체크박스 항목 이름을 입력하세요') ?? '';
                                const trimmed = label.trim();
                                if (!trimmed) return;
                                setCheckboxItems((prev) => [
                                  ...prev,
                                  { id: `cb-${Date.now()}-${prev.length}`, label: trimmed, defaultChecked: false },
                                ]);
                              }}
                            >
                              체크박스 항목 추가
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {isEditingCommon && (
                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        className="px-3 py-1.5 text-xs rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                        onClick={() => {
                          setIsAddModalOpen(true);
                        }}
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
      {/* 공통 데이터 설정 - 항목 추가 모달 */}
      {isEditingCommon && isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 text-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">공통 데이터 설정 항목 추가</h2>
              <button
                className="text-xs text-gray-500 hover:text-gray-700"
                onClick={() => setIsAddModalOpen(false)}
              >
                닫기
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-gray-600">먼저 어떤 종류의 공통 설정을 추가할지 선택하세요.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  type="button"
                  className="border border-gray-200 rounded-md p-4 text-left hover:bg-gray-50"
                  onClick={() => {
                      setActiveCommonTool('category');
                      setShowCategoryBlock(true);
                      if (!hasAnyCategory) {
                        setCategoryTitle('카테고리 트리 설정 (대/중/소)');
                        setCategoryTree({});
                        setSelectedLargeCategory(null);
                        setSelectedMidCategory(null);
                      }
                      setIsAddModalOpen(false);
                  }}
                >
                  <div className="font-semibold text-gray-900 mb-1">카테고리 추가</div>
                  <div className="text-xs text-gray-600">
                    시험/가격 등에서 공통으로 사용할 대/중/소 카테고리 구조를 설정합니다.
                  </div>
                </button>
                <button
                  type="button"
                  className="border border-gray-200 rounded-md p-4 text-left hover:bg-gray-50"
                  onClick={() => {
                    setActiveCommonTool('checkbox');
                    setShowCheckboxBlock(true);
                    if (!hasAnyCheckbox) {
                      setCheckboxTitle('체크박스 설정');
                      setCheckboxItems([]);
                    }
                    setIsAddModalOpen(false);
                  }}
                >
                  <div className="font-semibold text-gray-900 mb-1">체크박스 추가</div>
                  <div className="text-xs text-gray-600">
                    제목과 여러 개의 체크박스 항목을 정의하고, 기본 선택 여부를 설정합니다.
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

