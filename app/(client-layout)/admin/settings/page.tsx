'use client';

import { useMemo, useState } from 'react';

type SettingsTab = 'common' | 'pages';

type PageConfig = {
  key: string;
  name: string;
  status: '준비중' | '적용중' | '미적용';
};

type CategoryTree = Record<string, Record<string, string[]>>;

type CheckboxItem = {
  id: string;
  label: string;
  defaultChecked: boolean;
};

type CommonBlock =
  | {
      id: string;
      type: 'category';
      title: string;
      tree: CategoryTree;
      selectedLarge: string | null;
      selectedMid: string | null;
    }
  | {
      id: string;
      type: 'checkbox';
      title: string;
      items: CheckboxItem[];
    }
  | {
      id: string;
      type: 'dropdown';
      title: string;
      options: { id: string; label: string }[];
      placeholder?: string;
    };

// 기본 카테고리 구조: 대분류 > 중분류 > 소분류 (입력 데이터 자동 분류용)
const DEFAULT_CATEGORY_TREE: CategoryTree = {
  문서: {
    비즈니스: ['사업계획서', '회사소개', 'PPT', '엑셀', '기획서'],
    법률: ['소송장', '준비서면', '형사', '민사'],
    의료: [],
    특허: [],
    노무: [],
    교재: [],
    논문: [],
    기사: [],
    고전: [],
    기타: [],
  },
  음성: {
    아나운서: [],
    관광가이드: [],
    큐레이터: [],
    안내방송: [],
    교육강의: [],
    실시간: [],
    화상수업: [],
  },
  '영상/SNS': {
    '미디어/장르': ['유튜브', '다큐멘터리', '영화', '드라마', '예능'],
  },
  'IT/개발': {
    '개발/보안': ['AI', '에이전트', 'DB', '빅데이터', '백엔드', '프론트', '프로그램'],
    '디자인/기획': ['웹모바일디자인', '웹기획', '홈페이지UIUX', '콘텐츠'],
  },
  창의적활동: {
    콘텐츠: ['드라마', '웹툰', '웹툰소설', '시', '음악', '미술'],
  },
  번역: {
    통번역방식: ['순차통역', '동시통역', '음성번역', '자가선택'],
  },
  프롬프트: {},
  확장영역: {
    '라이프/전문': [
      '암',
      '요리',
      '재무',
      '주식',
      '부동산',
      '자녀',
      '연애',
      '입시',
      '사주',
      '결혼',
      '영어',
      '직장찾기',
      '운동',
      '사업',
    ],
  },
};

// 급수 기본 카테고리 (프롬프트 / 번역 / 윤리)
const LEVEL_CATEGORY_TREE: CategoryTree = {
  프롬프트: {
    교육: ['1급', '2급', '3급', '4급', '5급', '6급', '7급', '8급'],
    일반: ['1급', '2급', '3급'],
    전문: ['1급', '2급'],
  },
  번역: {
    교육: ['1급', '2급', '3급', '4급', '5급', '6급', '7급', '8급'],
    일반: ['1급', '2급', '3급'],
    전문: ['1급', '2급'],
  },
  윤리: {
    교육: ['1급', '2급', '3급', '4급', '5급', '6급', '7급', '8급'],
    일반: ['1급', '2급', '3급'],
    전문: ['1급', '2급'],
  },
};

const INITIAL_COMMON_BLOCKS: CommonBlock[] = [
  {
    id: 'cat-default-1',
    type: 'category',
    title: '분야',
    tree: DEFAULT_CATEGORY_TREE,
    selectedLarge: null,
    selectedMid: null,
  },
  {
    id: 'cat-default-2',
    type: 'category',
    title: '급수',
    tree: LEVEL_CATEGORY_TREE,
    selectedLarge: null,
    selectedMid: null,
  },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('common');
  const [isEditingCommon, setIsEditingCommon] = useState(false);
  const [blocks, setBlocks] = useState<CommonBlock[]>(INITIAL_COMMON_BLOCKS);
  const [pages, setPages] = useState<PageConfig[]>([]);
  const [pageQuery, setPageQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  /** 페이지별 설정 화면: 편집 중인 페이지 key (null이면 목록) */
  const [editingPageKey, setEditingPageKey] = useState<string | null>(null);
  /** 페이지별 활성화된 공통 블록 id 목록 (key = 페이지 key) */
  const [pageActiveBlocks, setPageActiveBlocks] = useState<Record<string, string[]>>({});

  const filteredPages = useMemo(() => {
    const q = pageQuery.trim().toLowerCase();
    if (!q) return pages;
    return pages.filter((p) => {
      return p.name.toLowerCase().includes(q) || p.key.toLowerCase().includes(q);
    });
  }, [pageQuery, pages]);

  const nonDropdownBlocks = blocks.filter((b) => b.type !== 'dropdown');
  const dropdownBlocks = blocks.filter((b) => b.type === 'dropdown') as Extract<
    CommonBlock,
    { type: 'dropdown' }
  >[];

  const handleSaveCommon = () => {
    // 수정모드 토글만 담당 (지금은 로컬 상태만 유지)
    setIsEditingCommon((prev) => !prev);
  };

  const addCategoryBlock = () => {
    const id = `cat-${Date.now()}-${blocks.length}`;
    const newBlock: CommonBlock = {
      id,
      type: 'category',
      title: '카테고리 트리 설정 (대/중/소)',
      tree: {},
      selectedLarge: null,
      selectedMid: null,
    };
    setBlocks((prev) => [...prev, newBlock]);
  };

  const addCheckboxBlock = () => {
    const id = `cb-group-${Date.now()}-${blocks.length}`;
    const newBlock: CommonBlock = {
      id,
      type: 'checkbox',
      title: '체크박스 설정',
      items: [],
    };
    setBlocks((prev) => [...prev, newBlock]);
  };

  const addDropdownBlock = () => {
    const id = `dd-${Date.now()}-${blocks.length}`;
    const newBlock: CommonBlock = {
      id,
      type: 'dropdown',
      title: '드롭다운 설정',
      options: [],
      placeholder: '항목을 선택하세요',
    };
    setBlocks((prev) => [...prev, newBlock]);
  };

  const updateBlock = (id: string, updater: (block: CommonBlock) => CommonBlock) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? updater(b) : b)));
  };

  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const renderCategoryBlock = (block: Extract<CommonBlock, { type: 'category' }>) => {
    const largeCategories = Object.keys(block.tree);
    const midCategories = block.selectedLarge ? Object.keys(block.tree[block.selectedLarge] ?? {}) : [];
    const smallCategories =
      block.selectedLarge && block.selectedMid
        ? block.tree[block.selectedLarge]?.[block.selectedMid] ?? []
        : [];

    const handleAddLarge = () => {
      if (!isEditingCommon) return;
      const name = window.prompt('대 카테고리 이름을 입력하세요');
      if (!name?.trim()) return;
      const key = name.trim();
      updateBlock(block.id, (b) => {
        if (b.type !== 'category') return b;
        if (b.tree[key]) return b;
        return {
          ...b,
          tree: { ...b.tree, [key]: {} },
          selectedLarge: key,
          selectedMid: null,
        };
      });
    };

    const handleAddMid = () => {
      if (!isEditingCommon) return;
      if (!block.selectedLarge) {
        window.alert('먼저 대 카테고리를 선택하세요.');
        return;
      }
      const name = window.prompt('중 카테고리 이름을 입력하세요');
      if (!name?.trim()) return;
      const key = name.trim();
      updateBlock(block.id, (b) => {
        if (b.type !== 'category') return b;
        const large = b.tree[block.selectedLarge!] ?? {};
        return {
          ...b,
          tree: {
            ...b.tree,
            [block.selectedLarge!]: {
              ...large,
              [key]: [],
            },
          },
          selectedMid: key,
        };
      });
    };

    const handleAddSmall = () => {
      if (!isEditingCommon) return;
      if (!block.selectedLarge || !block.selectedMid) {
        window.alert('먼저 대/중 카테고리를 선택하세요.');
        return;
      }
      const name = window.prompt('소 카테고리 이름을 입력하세요');
      if (!name?.trim()) return;
      const value = name.trim();
      updateBlock(block.id, (b) => {
        if (b.type !== 'category') return b;
        const large = b.tree[block.selectedLarge!] ?? {};
        const mids = { ...large };
        const smalls = mids[block.selectedMid!] ?? [];
        mids[block.selectedMid!] = [...smalls, value];
        return {
          ...b,
          tree: {
            ...b.tree,
            [block.selectedLarge!]: mids,
          },
        };
      });
    };

    return (
      <div key={block.id} className="mt-6 space-y-4 bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 max-w-xs">
            {isEditingCommon ? (
              <input
                className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm font-semibold text-gray-900 bg-white"
                value={block.title}
                onChange={(e) =>
                  updateBlock(block.id, (b) =>
                    b.type === 'category' ? { ...b, title: e.target.value } : b,
                  )
                }
                placeholder="카테고리 설정 이름을 입력하세요"
              />
            ) : (
              <h3 className="text-sm font-semibold text-gray-900">
                {block.title || '카테고리 트리 설정 (대/중/소)'}
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
                  if (!window.confirm('이 카테고리 설정 전체를 삭제하시겠습니까?')) return;
                  removeBlock(block.id);
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
                  onClick={handleAddLarge}
                >
                  + 추가
                </button>
              )}
            </div>
            <div className="p-3 space-y-1 max-h-64 overflow-y-auto">
              {largeCategories.length === 0 ? (
                <div className="text-[11px] text-gray-400 py-4 text-center">아직 대 카테고리가 없습니다.</div>
              ) : (
                largeCategories.map((name) => {
                  const isActive = block.selectedLarge === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() =>
                        updateBlock(block.id, (b) =>
                          b.type === 'category'
                            ? { ...b, selectedLarge: name, selectedMid: null }
                            : b,
                        )
                      }
                      className={`w-full text-left px-2 py-1 rounded-md text-xs ${
                        isActive ? 'bg-indigo-50 text-indigo-700' : 'bg-white text-gray-700 hover:bg-gray-100'
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
                  onClick={handleAddMid}
                >
                  + 추가
                </button>
              )}
            </div>
            <div className="text-[11px] text-gray-500 mb-1 px-3 pt-2">
              {block.selectedLarge ? `대 카테고리: ${block.selectedLarge}` : '먼저 대 카테고리를 선택하세요.'}
            </div>
            <div className="px-3 pb-3 space-y-1 max-h-64 overflow-y-auto">
              {block.selectedLarge && midCategories.length === 0 ? (
                <div className="text-[11px] text-gray-400 py-4 text-center">아직 중 카테고리가 없습니다.</div>
              ) : (
                midCategories.map((name) => {
                  const isActive = block.selectedMid === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() =>
                        updateBlock(block.id, (b) =>
                          b.type === 'category' ? { ...b, selectedMid: name } : b,
                        )
                      }
                      className={`w-full text-left px-2 py-1 rounded-md text-xs ${
                        isActive ? 'bg-indigo-50 text-indigo-700' : 'bg-white text-gray-700 hover:bg-gray-100'
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
                  onClick={handleAddSmall}
                >
                  + 추가
                </button>
              )}
            </div>
            <div className="text-[11px] text-gray-500 mb-1 px-3 pt-2">
              {block.selectedLarge && block.selectedMid
                ? `대: ${block.selectedLarge} / 중: ${block.selectedMid}`
                : '먼저 대/중 카테고리를 선택하세요.'}
            </div>
            <div className="px-3 pb-3 space-y-1 max-h-64 overflow-y-auto">
              {block.selectedLarge && block.selectedMid && smallCategories.length === 0 ? (
                <div className="text-[11px] text-gray-400 py-4 text-center">아직 소 카테고리가 없습니다.</div>
              ) : (
                smallCategories.map((name, idx) => (
                  <div
                    key={`${name}-${idx}`}
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
    );
  };

  const renderCheckboxBlock = (block: Extract<CommonBlock, { type: 'checkbox' }>) => {
    const hasItems = block.items.length > 0;

    return (
      <div key={block.id} className="mt-6 space-y-4 bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 max-w-xs">
            {isEditingCommon ? (
              <input
                className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm font-semibold text-gray-900 bg-white"
                value={block.title}
                onChange={(e) =>
                  updateBlock(block.id, (b) =>
                    b.type === 'checkbox' ? { ...b, title: e.target.value } : b,
                  )
                }
                placeholder="체크박스 설정 이름을 입력하세요"
              />
            ) : (
              <h3 className="text-sm font-semibold text-gray-900">
                {block.title || '체크박스 설정'}
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
                  if (!window.confirm('이 체크박스 설정 전체를 삭제하시겠습니까?')) return;
                  removeBlock(block.id);
                }}
              >
                전체 삭제
              </button>
            </div>
          )}
        </div>

        <div className="border border-gray-200 rounded-md bg-gray-50 p-4 space-y-3">
          {!hasItems ? (
            <div className="text-xs text-gray-400 text-center py-6">
              아직 체크박스 항목이 없습니다. 아래 추가하기 버튼으로 항목을 만들어주세요.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {block.items.map((item, idx) => (
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
                      onChange={(e) =>
                        updateBlock(block.id, (b) => {
                          if (b.type !== 'checkbox') return b;
                          const next = b.items.map((it) =>
                            it.id === item.id ? { ...it, defaultChecked: e.target.checked } : it,
                          );
                          return { ...b, items: next };
                        })
                      }
                    />
                    {isEditingCommon ? (
                      <input
                        className="flex-1 border border-gray-300 rounded-md px-1.5 py-0.5 text-[11px]"
                        value={item.label}
                        onChange={(e) =>
                          updateBlock(block.id, (b) => {
                            if (b.type !== 'checkbox') return b;
                            const next = b.items.map((it) =>
                              it.id === item.id ? { ...it, label: e.target.value } : it,
                            );
                            return { ...b, items: next };
                          })
                        }
                        placeholder="체크박스 항목 이름"
                      />
                    ) : (
                      <span className="text-xs md:text-sm text-gray-800 truncate">{item.label}</span>
                    )}
                  </label>
                  {isEditingCommon && (
                    <button
                      type="button"
                      className="text-[10px] text-red-600 hover:text-red-800"
                      onClick={() =>
                        updateBlock(block.id, (b) => {
                          if (b.type !== 'checkbox') return b;
                          return { ...b, items: b.items.filter((it) => it.id !== item.id) };
                        })
                      }
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
                  updateBlock(block.id, (b) => {
                    if (b.type !== 'checkbox') return b;
                    const newItem: CheckboxItem = {
                      id: `cb-${Date.now()}-${b.items.length}`,
                      label: trimmed,
                      defaultChecked: false,
                    };
                    return { ...b, items: [...b.items, newItem] };
                  });
                }}
              >
                체크박스 항목 추가
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderDropdownBlock = (block: Extract<CommonBlock, { type: 'dropdown' }>) => {
    const hasOptions = block.options.length > 0;

    return (
      <div className="space-y-4 bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 max-w-xs">
            {isEditingCommon ? (
              <input
                className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm font-semibold text-gray-900 bg-white"
                value={block.title}
                onChange={(e) =>
                  updateBlock(block.id, (b) =>
                    b.type === 'dropdown' ? { ...b, title: e.target.value } : b,
                  )
                }
                placeholder="드롭다운 제목을 입력하세요"
              />
            ) : (
              <h3 className="text-sm font-semibold text-gray-900">
                {block.title || '드롭다운 설정'}
              </h3>
            )}
          </div>
          {isEditingCommon && (
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-600 mt-1">
                드롭다운에 들어갈 옵션들을 추가하고, 제목을 설정합니다.
              </p>
              <button
                type="button"
                className="px-3 py-1.5 text-xs rounded-md border border-red-200 text-red-700 hover:bg-red-50"
                onClick={() => {
                  if (!window.confirm('이 드롭다운 설정 전체를 삭제하시겠습니까?')) return;
                  removeBlock(block.id);
                }}
              >
                전체 삭제
              </button>
            </div>
          )}
        </div>

        <div className="border border-gray-200 rounded-md bg-gray-50 p-4 space-y-3">
          {/* 미리보기: 실제 드롭다운 */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-600">미리보기</span>
            <select
              className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white w-32 sm:w-40 md:w-44"
              defaultValue=""
            >
              <option value="" disabled>
                {block.placeholder || '항목을 선택하세요'}
              </option>
              {block.options.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* 옵션 편집 리스트 */}
          <div className="border border-gray-200 rounded-md bg-white p-3 space-y-2">
            {block.options.length === 0 ? (
              <div className="text-xs text-gray-400 text-center py-4">
                아직 옵션이 없습니다. 아래 버튼으로 옵션을 추가하세요.
              </div>
            ) : (
              block.options.map((opt, idx) => (
                <div
                  key={opt.id}
                  className="flex items-center gap-2 text-xs"
                >
                  <span className="w-5 text-[11px] text-gray-400 text-right">{idx + 1}.</span>
                  {isEditingCommon ? (
                    <input
                      className="flex-1 border border-gray-300 rounded-md px-2 py-1"
                      value={opt.label}
                      onChange={(e) =>
                        updateBlock(block.id, (b) => {
                          if (b.type !== 'dropdown') return b;
                          const next = b.options.map((o) =>
                            o.id === opt.id ? { ...o, label: e.target.value } : o,
                          );
                          return { ...b, options: next };
                        })
                      }
                      placeholder="옵션 이름"
                    />
                  ) : (
                    <span className="flex-1 text-gray-800">{opt.label}</span>
                  )}
                  {isEditingCommon && (
                    <button
                      type="button"
                      className="text-[11px] text-red-600 hover:text-red-800"
                      onClick={() =>
                        updateBlock(block.id, (b) => {
                          if (b.type !== 'dropdown') return b;
                          return {
                            ...b,
                            options: b.options.filter((o) => o.id !== opt.id),
                          };
                        })
                      }
                    >
                      삭제
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {isEditingCommon && (
            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">플레이스홀더</span>
                <input
                  className="border border-gray-300 rounded-md px-2 py-1 text-xs bg-white"
                  value={block.placeholder ?? ''}
                  onChange={(e) =>
                    updateBlock(block.id, (b) =>
                      b.type === 'dropdown' ? { ...b, placeholder: e.target.value } : b,
                    )
                  }
                  placeholder="예: 항목을 선택하세요"
                />
              </div>
              <button
                type="button"
                className="px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  const label = window.prompt('드롭다운 옵션 이름을 입력하세요') ?? '';
                  const trimmed = label.trim();
                  if (!trimmed) return;
                  updateBlock(block.id, (b) => {
                    if (b.type !== 'dropdown') return b;
                    const id = `opt-${Date.now()}-${b.options.length}`;
                    return {
                      ...b,
                      options: [...b.options, { id, label: trimmed }],
                    };
                  });
                }}
              >
                옵션 추가
              </button>
            </div>
          )}
        </div>
      </div>
    );
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
                        여러 페이지가 공유하는 설정의 기본값을 정의합니다. 이후 페이지별 설정에서 필요한 항목만
                        오버라이드할 수 있습니다.
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

                  {blocks.length === 0 && (
                    <div className="border border-dashed border-gray-200 rounded-lg bg-gray-50 px-6 py-14 text-center">
                      <div className="text-sm font-semibold text-gray-700 mb-1">
                        {isEditingCommon ? '공통 데이터 설정 편집 모드' : '내용 없음'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {isEditingCommon
                          ? '여기에 공통 데이터 설정 블록(카테고리, 체크박스 등)을 추가할 수 있습니다.'
                          : '공통 데이터 설정 항목은 요청 주시면 여기부터 구성하겠습니다.'}
                      </div>
                    </div>
                  )}

                  {nonDropdownBlocks.map((block) =>
                    block.type === 'category'
                      ? renderCategoryBlock(block)
                      : renderCheckboxBlock(block as Extract<CommonBlock, { type: 'checkbox' }>),
                  )}

                  {dropdownBlocks.length > 0 && (
                    <div
                      className={`mt-6 ${
                        isEditingCommon ? 'space-y-4' : 'flex flex-wrap gap-4'
                      }`}
                    >
                      {dropdownBlocks.map((block) => (
                        <div
                          key={block.id}
                          className={
                            isEditingCommon
                              ? 'w-full'
                              : 'w-full sm:w-1/2 md:w-1/3 lg:w-1/5'
                          }
                        >
                          {renderDropdownBlock(block)}
                        </div>
                      ))}
                    </div>
                  )}

                  {isEditingCommon && (
                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        className="px-3 py-1.5 text-xs rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsAddModalOpen(true)}
                      >
                        추가하기
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : editingPageKey ? (
              /* 페이지 설정 화면 (설정 편집 진입 시) */
              (() => {
                const page = pages.find((p) => p.key === editingPageKey);
                if (!page) {
                  return (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <p className="text-sm text-gray-500 mb-2">해당 페이지를 찾을 수 없습니다.</p>
                      <button
                        type="button"
                        className="text-sm text-indigo-600 hover:underline"
                        onClick={() => setEditingPageKey(null)}
                      >
                        목록으로 돌아가기
                      </button>
                    </div>
                  );
                }
                const activeIds = pageActiveBlocks[editingPageKey] ?? [];
                const toggleBlock = (blockId: string) => {
                  setPageActiveBlocks((prev) => {
                    const list = prev[editingPageKey] ?? [];
                    const next = list.includes(blockId)
                      ? list.filter((id) => id !== blockId)
                      : [...list, blockId];
                    return { ...prev, [editingPageKey]: next };
                  });
                };
                return (
                  <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-8">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          className="text-sm text-gray-600 hover:text-gray-900"
                          onClick={() => setEditingPageKey(null)}
                        >
                          ← 목록으로
                        </button>
                        <h2 className="text-lg font-semibold text-gray-900">{page.name} 설정</h2>
                      </div>
                    </div>

                    <section>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">공통 데이터 설정</h3>
                      <p className="text-xs text-gray-600 mb-4">
                        공통 데이터 설정에서 저장한 블록을 이 페이지에 불러옵니다. 활성화하면 해당 데이터가 이 페이지에 적용됩니다.
                      </p>
                      <div className="space-y-2">
                        {blocks.length === 0 ? (
                          <div className="text-xs text-gray-400 py-4 border border-dashed border-gray-200 rounded-md text-center">
                            공통 데이터 설정에 블록이 없습니다. 공통 데이터 설정 탭에서 먼저 추가하세요.
                          </div>
                        ) : (
                          blocks.map((b) => {
                            const title = b.type === 'category' ? b.title : b.type === 'checkbox' ? b.title : b.title;
                            const isActive = activeIds.includes(b.id);
                            return (
                              <div
                                key={b.id}
                                className="flex items-center justify-between border border-gray-200 rounded-md px-4 py-3 bg-gray-50"
                              >
                                <div>
                                  <span className="text-sm font-medium text-gray-900">{title}</span>
                                  <span className="ml-2 text-[11px] text-gray-500">
                                    {b.type === 'category' && '카테고리'}
                                    {b.type === 'checkbox' && '체크박스'}
                                    {b.type === 'dropdown' && '드롭다운'}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  className={`px-3 py-1.5 text-xs rounded-md font-medium ${
                                    isActive
                                      ? 'bg-green-600 text-white hover:bg-green-700'
                                      : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                                  }`}
                                  onClick={() => toggleBlock(b.id)}
                                >
                                  {isActive ? '활성화됨' : '활성화'}
                                </button>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </section>

                    <section>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">추가 설정</h3>
                      <p className="text-xs text-gray-600 mb-4">
                        이 페이지만을 위한 추가 설정 항목입니다. (추후 확장)
                      </p>
                      <div className="border border-dashed border-gray-200 rounded-md bg-gray-50 px-4 py-8 text-center text-xs text-gray-400">
                        추가 설정 항목이 없습니다.
                      </div>
                    </section>
                  </div>
                );
              })()
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
                      placeholder="페이지 검색 (이름/key)"
                      className="w-64 border border-gray-300 rounded-md px-3 py-2 text-xs"
                    />
                    <button
                      type="button"
                      className="px-3 py-2 text-xs rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                      onClick={() => {
                        const name = window.prompt('페이지 이름을 입력하세요')?.trim();
                        if (!name) return;
                        const baseKey = name
                          .toLowerCase()
                          .replace(/\s+/g, '-')
                          .replace(/[^a-z0-9가-힣\-]/g, '')
                          .slice(0, 40) || 'page';
                        setPages((prev) => {
                          let key = baseKey;
                          let n = 0;
                          while (prev.some((p) => p.key === key)) {
                            n += 1;
                            key = `${baseKey}-${n}`;
                          }
                          return [...prev, { key, name, status: '준비중' }];
                        });
                      }}
                    >
                      페이지 추가
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">페이지</th>
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
                            </td>
                            <td className="px-4 py-3 align-top text-center">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeClass}`}
                              >
                                {p.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 align-top text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  className="px-3 py-1.5 text-xs rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                                  onClick={() => setEditingPageKey(p.key)}
                                >
                                  설정 편집
                                </button>
                                <button
                                  type="button"
                                  className="px-3 py-1.5 text-xs rounded-md border border-red-200 text-red-700 hover:bg-red-50"
                                  onClick={() => {
                                    if (!window.confirm(`"${p.name}" 페이지를 삭제하시겠습니까?`)) return;
                                    setPages((prev) => prev.filter((page) => page.key !== p.key));
                                  }}
                                >
                                  삭제
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredPages.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-4 py-12 text-center text-sm text-gray-500">
                            등록된 페이지가 없습니다.
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

      {/* 공통 데이터 설정 - 블록 추가 모달 */}
      {isEditingCommon && isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 text-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">공통 데이터 설정 블록 추가</h2>
              <button
                className="text-xs text-gray-500 hover:text-gray-700"
                onClick={() => setIsAddModalOpen(false)}
              >
                닫기
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-gray-600">어떤 종류의 공통 설정 블록을 추가할지 선택하세요.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  type="button"
                  className="border border-gray-200 rounded-md p-4 text-left hover:bg-gray-50"
                  onClick={() => {
                    addCategoryBlock();
                    setIsAddModalOpen(false);
                  }}
                >
                  <div className="font-semibold text-gray-900 mb-1">카테고리 블록 추가</div>
                  <div className="text-xs text-gray-600">
                    시험/가격 등에서 공통으로 사용할 대/중/소 카테고리 구조 블록을 하나 더 만듭니다.
                  </div>
                </button>
                <button
                  type="button"
                  className="border border-gray-200 rounded-md p-4 text-left hover:bg-gray-50"
                  onClick={() => {
                    addCheckboxBlock();
                    setIsAddModalOpen(false);
                  }}
                >
                  <div className="font-semibold text-gray-900 mb-1">체크박스 블록 추가</div>
                  <div className="text-xs text-gray-600">
                    제목과 여러 개의 체크박스를 포함한 설정 블록을 하나 더 만듭니다.
                  </div>
                </button>
                <button
                  type="button"
                  className="border border-gray-200 rounded-md p-4 text-left hover:bg-gray-50"
                  onClick={() => {
                    addDropdownBlock();
                    setIsAddModalOpen(false);
                  }}
                >
                  <div className="font-semibold text-gray-900 mb-1">드롭다운 블록 추가</div>
                  <div className="text-xs text-gray-600">
                    제목과 선택 가능한 옵션 목록을 가진 드롭다운 설정 블록을 추가합니다.
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

