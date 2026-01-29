'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { adminTranslators } from '@/lib/adminTranslatorsMock';

type DataSection =
  | 'curriculum'
  | 'editing'
  | 'prompt-review'
  | 'expert-review'
  | 'translation'
  | 'tesol'
  | 'marketing';

const SIDEBAR_ITEMS: { id: DataSection; label: string }[] = [
  { id: 'curriculum', label: '1. 캉사들 커리큘럼' },
  { id: 'editing', label: '2. 에디팅 모듬' },
  { id: 'prompt-review', label: '3. 프롬프트 감수' },
  { id: 'expert-review', label: '4. 전문가 감수 모음' },
  { id: 'translation', label: '5. 번역 자료 모음' },
  { id: 'tesol', label: '6. 테솔 교사 레슨 자료' },
  { id: 'marketing', label: '7. 마케팅 디비 정리' },
];

const STORAGE_KEY = 'admin-data-management';

// --- 초기 데이터 ---
const INIT_CURRICULUM = [
  { id: 'tesol', name: '테솔', category: '교육', desc: '테솔 과정 커리큘럼' },
  { id: 'prompt', name: '프롬프트', category: '교육', desc: '프롬프트 과정' },
  { id: 'ai-trans', name: 'AI통번역', category: '교육', desc: 'AI 통번역 입문·심화' },
  { id: 'itt', name: 'ITT시험', category: '시험', desc: 'ITT 시험 대비' },
  { id: 'ethics', name: '윤리', category: '교육', desc: '윤리 교육' },
  { id: 'ai-translation', name: 'AI번역', category: '시험', desc: 'AI번역 검정' },
  { id: 'prompt-exam', name: '프롬프트 검정', category: '시험', desc: '프롬프트 시험' },
];

// 에디팅 결과 데이터 (DB)
const INIT_EDITING_DATA = [
  { id: 'ed-1', title: '계약서 문서폼 편집', editorType: '문서폼 에디터', docSummary: '법률 계약 초안 → 최종본', status: '완료', createdAt: '2024-01-10' },
  { id: 'ed-2', title: '뉴스레터 번역문 수정', editorType: '번역에디터', docSummary: '영문 원고 → 한글 배포용', status: '진행중', createdAt: '2024-01-12' },
  { id: 'ed-3', title: '프롬프트 톤 조정', editorType: '프롬프트 에디터', docSummary: '기술 문서용 톤 통일', status: '완료', createdAt: '2024-01-08' },
];

// 프롬프트 감수 데이터 (DB)
const INIT_PROMPT_REVIEW_DATA = [
  { id: 'pr-1', requestId: 'REQ-101', sourceSnippet: 'Please confirm the delivery schedule.', reviewedSnippet: '배송 일정 확인 부탁드립니다.', tone: '공식적인', model: 'ChatGPT', status: '완료', createdAt: '2024-01-11' },
  { id: 'pr-2', requestId: 'REQ-102', sourceSnippet: 'Let\'s grab coffee tomorrow.', reviewedSnippet: '내일 커피 한잔 할까요?', tone: '일상적인', model: 'Clova', status: '완료', createdAt: '2024-01-13' },
  { id: 'pr-3', requestId: 'REQ-103', sourceSnippet: 'API rate limit: 100 req/min.', reviewedSnippet: 'API 호출 제한: 분당 100회.', tone: '기술적', model: 'Gemini', status: '대기', createdAt: '2024-01-14' },
];

// 전문가 감수 의뢰 데이터 (DB)
const INIT_EXPERT_REVIEW_REQUESTS = [
  { id: 'er-1', expertName: '김전문', documentTitle: '의료 논문 초안', status: '완료', requestedAt: '2024-01-05', completedAt: '2024-01-09' },
  { id: 'er-2', expertName: '이감수', documentTitle: '법률 계약서 검토', status: '진행중', requestedAt: '2024-01-10', completedAt: '' },
  { id: 'er-3', expertName: '박교수', documentTitle: '기술 스펙 감수', status: '대기', requestedAt: '2024-01-12', completedAt: '' },
];

// 번역 데이터 (DB) — 원문·번역문 등 실제 번역 결과물
const INIT_TRANSLATION_DATA = [
  { id: 'tr-1', requestId: 'T-1001', sourceText: 'This Agreement is entered into as of the date above.', translatedText: '본 계약은 상기 날짜에 체결된다.', sourceLang: 'en', targetLang: 'ko', field: '법률/계약', status: '완료', createdAt: '2024-01-08', wordCount: 12, clientName: 'A법무사', translatorName: '김영희' },
  { id: 'tr-2', requestId: 'T-1002', sourceText: '부품 번호 및 수량을 확인해 주세요.', translatedText: 'Please confirm the part numbers and quantities.', sourceLang: 'ko', targetLang: 'en', field: '기술/IT', status: '완료', createdAt: '2024-01-09', wordCount: 8, clientName: 'B산업', translatorName: '이철수' },
  { id: 'tr-3', requestId: 'T-1003', sourceText: '마케팅 캠페인 결과 보고서 초안', translatedText: 'Draft report on marketing campaign results', sourceLang: 'ko', targetLang: 'en', field: '마케팅', status: '진행중', createdAt: '2024-01-12', wordCount: 6, clientName: 'C광고', translatorName: '미배정' },
];

const INIT_TESOL = [
  { id: 1, unit: '1단원', title: '언어학 기초', category: '비즈니스', difficulty: '중급', duration: '45분' },
  { id: 2, unit: '2단원', title: '문법 지도법', category: '비즈니스', difficulty: '중급', duration: '50분' },
  { id: 3, unit: '3단원', title: '듣기·말하기 활동', category: '비즈니스', difficulty: '고급', duration: '55분' },
  { id: 4, unit: '4단원', title: '읽기·쓰기 지도', category: '비즈니스', difficulty: '고급', duration: '50분' },
  { id: 5, unit: '5단원', title: '교실 영어', category: '비즈니스', difficulty: '중급', duration: '45분' },
];

// 마케팅 DB 데이터 (타겟별 마케팅 전략 DB)
const INIT_MARKETING_DATA = [
  {
    id: 'mk-1',
    targetGroup: '일반인',
    subTarget: '취업준비생',
    ageGroup: '20~30',
    needs: '차별화',
    situation: '스펙부족',
    purposeOfUse: '취업',
    channel: '인스타그릴스카드',
    operationMethod: '',
    content: '비교콘텐츠',
    exceptionsHeadline: '블로그에만 올릴 것',
    subCopy: 'ai 시대, 꾸준한 자기계발은 필수',
    keyPoint: 'ai 자격증으로 자기계발과 스펙업',
    ai: '자기계발, 스펙업',
    aiTeCoreValue: '제미나이 지피티',
    coreMessage: 'AI 실무능력 검증, AI 실무 자격증',
  },
  {
    id: 'mk-2',
    targetGroup: '일반인',
    subTarget: '이직직장인',
    ageGroup: '25~40',
    needs: '직무확장',
    situation: '커리어정체',
    purposeOfUse: '이직',
    channel: '유튜브숏폼',
    operationMethod: '',
    content: '번역비교',
    exceptionsHeadline: '',
    subCopy: '',
    keyPoint: '',
    ai: '',
    aiTeCoreValue: '',
    coreMessage: '',
  },
  {
    id: 'mk-3',
    targetGroup: '일반인',
    subTarget: 'N잡·부업',
    ageGroup: '20~50',
    needs: '재택',
    situation: '추가수입',
    purposeOfUse: '부업',
    channel: '블로그',
    operationMethod: 'SEO',
    content: '후기정보',
    exceptionsHeadline: '',
    subCopy: '',
    keyPoint: '',
    ai: '번역감수수익, AI 부업 가능',
    aiTeCoreValue: '',
    coreMessage: '',
  },
  {
    id: 'mk-4',
    targetGroup: '일반인',
    subTarget: '주부',
    ageGroup: '30~',
    needs: '',
    situation: '',
    purposeOfUse: '',
    channel: '',
    operationMethod: '',
    content: '',
    exceptionsHeadline: '',
    subCopy: '',
    keyPoint: '',
    ai: '',
    aiTeCoreValue: '',
    coreMessage: '',
  },
  {
    id: 'mk-5',
    targetGroup: '대학생',
    subTarget: '어문계열',
    ageGroup: '20대',
    needs: '실무경험',
    situation: '',
    purposeOfUse: '전공활용',
    channel: '취업',
    operationMethod: '카페',
    content: '정보글',
    exceptionsHeadline: '합격후기',
    subCopy: '',
    keyPoint: '',
    ai: 'AI감수역량, 번역가 미래역량',
    aiTeCoreValue: '',
    coreMessage: '',
  },
  {
    id: 'mk-6',
    targetGroup: '대학생',
    subTarget: '비전공',
    ageGroup: '20대',
    needs: '범용자격',
    situation: '스펙부족',
    purposeOfUse: '스펙',
    channel: '링크드인',
    operationMethod: '전문글',
    content: '트렌드',
    exceptionsHeadline: '',
    subCopy: '',
    keyPoint: '',
    ai: '전공무관, 전공무관 스펙',
    aiTeCoreValue: '',
    coreMessage: '',
  },
  {
    id: 'mk-7',
    targetGroup: '전문가',
    subTarget: '변호사',
    ageGroup: '30~60',
    needs: '정확성',
    situation: '계약검토',
    purposeOfUse: '업무',
    channel: '검색광고',
    operationMethod: '키워드',
    content: '자격증',
    exceptionsHeadline: '',
    subCopy: '',
    keyPoint: '',
    ai: '법률문맥 감수, 법률번역 리스크관리',
    aiTeCoreValue: '',
    coreMessage: '',
  },
  {
    id: 'mk-8',
    targetGroup: '전문가',
    subTarget: '의사',
    ageGroup: '30~60',
    needs: '정확성',
    situation: '논문번역',
    purposeOfUse: '연구',
    channel: '학교제휴',
    operationMethod: '메일',
    content: '단체응시',
    exceptionsHeadline: '',
    subCopy: '',
    keyPoint: '',
    ai: '의학오역 방지, 의학번역 검증',
    aiTeCoreValue: '',
    coreMessage: '',
  },
  {
    id: 'mk-9',
    targetGroup: '전문가',
    subTarget: '연구원',
    ageGroup: '30~60',
    needs: '속도',
    situation: '자료다수',
    purposeOfUse: '연구',
    channel: '기업제휴',
    operationMethod: '교육',
    content: '사내교육',
    exceptionsHeadline: '',
    subCopy: '',
    keyPoint: '',
    ai: 'AI번역 감수, 연구생산성 향상',
    aiTeCoreValue: '',
    coreMessage: '',
  },
];

function loadStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const v = parsed[key];
    return (v !== undefined && v !== null ? v : fallback) as T;
  } catch {
    return fallback;
  }
}

function saveStored(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const prev = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    prev[key] = value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prev));
  } catch {
    /* noop */
  }
}

type CurriculumRow = { id: string; name: string; category: string; desc: string };
type EditingDataRow = { id: string; title: string; editorType: string; docSummary: string; status: string; createdAt: string };
type PromptReviewDataRow = { id: string; requestId: string; sourceSnippet: string; reviewedSnippet: string; tone: string; model: string; status: string; createdAt: string };
type ExpertReviewRequestRow = { id: string; expertName: string; documentTitle: string; status: string; requestedAt: string; completedAt: string };
type TranslationDataRow = { id: string; requestId: string; sourceText: string; translatedText: string; sourceLang: string; targetLang: string; field: string; status: string; createdAt: string; wordCount: number; clientName: string; translatorName: string };
type TesolRow = { id: number; unit: string; title: string; category: string; difficulty: string; duration: string };
type MarketingDataRow = {
  id: string;
  targetGroup: string; // 타겟구분
  subTarget: string; // 세부타겟
  ageGroup: string; // 연령대
  needs: string; // a 니즈
  situation: string; // 상황
  purposeOfUse: string; // 활용 목적
  channel: string; // 채널
  operationMethod: string; // 운영방식
  content: string; // 콘텐츠
  exceptionsHeadline: string; // 예외사항(헤드라인)
  subCopy: string; // 서브카피
  keyPoint: string; // 핵심포인트
  ai: string; // ai
  aiTeCoreValue: string; // AITe 핵심가치
  coreMessage: string; // 핵심메시지
};

export default function AdminDataPage() {
  const [active, setActive] = useState<DataSection>('curriculum');

  const [curriculum, setCurriculum] = useState<CurriculumRow[]>(() =>
    loadStored('curriculum', INIT_CURRICULUM)
  );
  const [editingData, setEditingData] = useState<EditingDataRow[]>(() =>
    loadStored('editingData', INIT_EDITING_DATA)
  );
  const [promptReviewData, setPromptReviewData] = useState<PromptReviewDataRow[]>(() =>
    loadStored('promptReviewData', INIT_PROMPT_REVIEW_DATA)
  );
  const [expertReviewRequests, setExpertReviewRequests] = useState<ExpertReviewRequestRow[]>(() =>
    loadStored('expertReviewRequests', INIT_EXPERT_REVIEW_REQUESTS)
  );
  const [translationData, setTranslationData] = useState<TranslationDataRow[]>(() =>
    loadStored('translationData', INIT_TRANSLATION_DATA)
  );
  const [tesol, setTesol] = useState<TesolRow[]>(() => loadStored('tesol', INIT_TESOL));
  const [marketingData, setMarketingData] = useState<MarketingDataRow[]>(() =>
    loadStored('marketingData', INIT_MARKETING_DATA)
  );

  const persist = useCallback(() => {
    saveStored('curriculum', curriculum);
    saveStored('editingData', editingData);
    saveStored('promptReviewData', promptReviewData);
    saveStored('expertReviewRequests', expertReviewRequests);
    saveStored('translationData', translationData);
    saveStored('tesol', tesol);
    saveStored('marketingData', marketingData);
  }, [
    curriculum,
    editingData,
    promptReviewData,
    expertReviewRequests,
    translationData,
    tesol,
    marketingData,
  ]);

  useEffect(() => {
    persist();
  }, [persist]);

  const addRow = (
    type:
      | 'curriculum'
      | 'editing'
      | 'promptReview'
      | 'expertReview'
      | 'translation'
      | 'tesol'
      | 'marketing'
  ) => {
    if (type === 'curriculum') {
      setCurriculum((prev) => [
        ...prev,
        { id: `new-${Date.now()}`, name: '', category: '', desc: '' },
      ]);
    }
    if (type === 'editing') {
      setEditingData((prev) => [
        ...prev,
        { id: `ed-${Date.now()}`, title: '', editorType: '', docSummary: '', status: '', createdAt: new Date().toISOString().slice(0, 10) },
      ]);
    }
    if (type === 'promptReview') {
      setPromptReviewData((prev) => [
        ...prev,
        { id: `pr-${Date.now()}`, requestId: '', sourceSnippet: '', reviewedSnippet: '', tone: '', model: '', status: '', createdAt: new Date().toISOString().slice(0, 10) },
      ]);
    }
    if (type === 'expertReview') {
      setExpertReviewRequests((prev) => [
        ...prev,
        { id: `er-${Date.now()}`, expertName: '', documentTitle: '', status: '', requestedAt: '', completedAt: '' },
      ]);
    }
    if (type === 'translation') {
      setTranslationData((prev) => [
        ...prev,
        { id: `tr-${Date.now()}`, requestId: '', sourceText: '', translatedText: '', sourceLang: '', targetLang: '', field: '', status: '', createdAt: new Date().toISOString().slice(0, 10), wordCount: 0, clientName: '', translatorName: '' },
      ]);
    }
    if (type === 'tesol') {
      const maxId = Math.max(0, ...tesol.map((r) => r.id));
      setTesol((prev) => [
        ...prev,
        {
          id: maxId + 1,
          unit: '',
          title: '',
          category: '',
          difficulty: '',
          duration: '',
        },
      ]);
    }
    if (type === 'marketing') {
      setMarketingData((prev) => [
        ...prev,
        {
          id: `mk-${Date.now()}`,
          targetGroup: '',
          subTarget: '',
          ageGroup: '',
          needs: '',
          situation: '',
          purposeOfUse: '',
          channel: '',
          operationMethod: '',
          content: '',
          exceptionsHeadline: '',
          subCopy: '',
          keyPoint: '',
          ai: '',
          aiTeCoreValue: '',
          coreMessage: '',
        },
      ]);
    }
  };

  const removeRow = (
    type:
      | 'curriculum'
      | 'editing'
      | 'promptReview'
      | 'expertReview'
      | 'translation'
      | 'tesol'
      | 'marketing',
    index: number
  ) => {
    if (type === 'curriculum') setCurriculum((prev) => prev.filter((_, i) => i !== index));
    if (type === 'editing') setEditingData((prev) => prev.filter((_, i) => i !== index));
    if (type === 'promptReview') setPromptReviewData((prev) => prev.filter((_, i) => i !== index));
    if (type === 'expertReview') setExpertReviewRequests((prev) => prev.filter((_, i) => i !== index));
    if (type === 'translation') setTranslationData((prev) => prev.filter((_, i) => i !== index));
    if (type === 'tesol') setTesol((prev) => prev.filter((_, i) => i !== index));
    if (type === 'marketing') setMarketingData((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCurriculum = (index: number, patch: Partial<CurriculumRow>) => {
    setCurriculum((prev) =>
      prev.map((r, i) => (i === index ? { ...r, ...patch } : r))
    );
  };
  const updateEditing = (index: number, patch: Partial<EditingDataRow>) => {
    setEditingData((prev) =>
      prev.map((r, i) => (i === index ? { ...r, ...patch } : r))
    );
  };
  const updatePromptReview = (index: number, patch: Partial<PromptReviewDataRow>) => {
    setPromptReviewData((prev) =>
      prev.map((r, i) => (i === index ? { ...r, ...patch } : r))
    );
  };
  const updateExpertReview = (index: number, patch: Partial<ExpertReviewRequestRow>) => {
    setExpertReviewRequests((prev) =>
      prev.map((r, i) => (i === index ? { ...r, ...patch } : r))
    );
  };
  const updateTranslation = (index: number, patch: Partial<TranslationDataRow>) => {
    setTranslationData((prev) =>
      prev.map((r, i) => (i === index ? { ...r, ...patch } : r))
    );
  };
  const updateTesol = (index: number, patch: Partial<TesolRow>) => {
    setTesol((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  };
  const updateMarketing = (index: number, patch: Partial<MarketingDataRow>) => {
    setMarketingData((prev) =>
      prev.map((r, i) => (i === index ? { ...r, ...patch } : r))
    );
  };

  const inputCls =
    'w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold text-gray-900">데이터 관리</div>
            <div className="text-xs text-gray-500">데이터 조회·수정·추가 (변경 시 자동 저장)</div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={persist}
              className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
            >
              저장
            </button>
            <Link href="/admin/dashboard" className="text-sm text-gray-600 hover:underline">
              대시보드
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-6">
        <aside className="w-52 min-w-[13rem] flex-shrink-0 bg-white border border-gray-200 rounded-lg p-3 h-fit sticky top-24">
          <h2 className="text-xs font-semibold text-gray-700 mb-2">데이터 관리</h2>
          <nav>
            <ul className="space-y-0.5">
              {SIDEBAR_ITEMS.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setActive(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      active === item.id
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="flex-1 min-w-0 space-y-6">
          {active === 'curriculum' && (
            <section className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">1. 캉사들 커리큘럼</h2>
                  <p className="text-xs text-gray-500 mt-0.5">커리큘럼 데이터 (과정·시험 DB)</p>
                </div>
                <button
                  type="button"
                  onClick={() => addRow('curriculum')}
                  className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
                >
                  <Plus className="w-4 h-4" /> 추가
                </button>
              </div>
              <div className="p-4 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-medium text-gray-700">ID</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">과정명</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">카테고리</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">설명</th>
                      <th className="w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {curriculum.map((r, i) => (
                      <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                        <td className="py-1 px-2">
                          <input
                            value={r.id}
                            onChange={(e) => updateCurriculum(i, { id: e.target.value })}
                            className={inputCls}
                          />
                        </td>
                        <td className="py-1 px-2">
                          <input
                            value={r.name}
                            onChange={(e) => updateCurriculum(i, { name: e.target.value })}
                            className={inputCls}
                          />
                        </td>
                        <td className="py-1 px-2">
                          <input
                            value={r.category}
                            onChange={(e) => updateCurriculum(i, { category: e.target.value })}
                            className={inputCls}
                          />
                        </td>
                        <td className="py-1 px-2">
                          <input
                            value={r.desc}
                            onChange={(e) => updateCurriculum(i, { desc: e.target.value })}
                            className={inputCls}
                          />
                        </td>
                        <td className="py-1 px-2">
                          <button
                            type="button"
                            onClick={() => removeRow('curriculum', i)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {active === 'editing' && (
            <section className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">2. 에디팅 모듬</h2>
                  <p className="text-xs text-gray-500 mt-0.5">에디팅 결과 데이터 (편집된 문서·컨텐츠 DB)</p>
                </div>
                <button
                  type="button"
                  onClick={() => addRow('editing')}
                  className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
                >
                  <Plus className="w-4 h-4" /> 추가
                </button>
              </div>
              <div className="p-4 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-medium text-gray-700">ID</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">제목</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">에디터 유형</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">요약</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">상태</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">등록일</th>
                      <th className="w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {editingData.map((r, i) => (
                      <tr key={r.id} className="border-b border-gray-100">
                        <td className="py-1 px-2">
                          <input value={r.id} onChange={(e) => updateEditing(i, { id: e.target.value })} className={`${inputCls} font-mono text-xs w-20`} />
                        </td>
                        <td className="py-1 px-2">
                          <input value={r.title} onChange={(e) => updateEditing(i, { title: e.target.value })} className={inputCls} placeholder="제목" />
                        </td>
                        <td className="py-1 px-2">
                          <input value={r.editorType} onChange={(e) => updateEditing(i, { editorType: e.target.value })} className={inputCls} placeholder="에디터" />
                        </td>
                        <td className="py-1 px-2">
                          <input value={r.docSummary} onChange={(e) => updateEditing(i, { docSummary: e.target.value })} className={inputCls} placeholder="요약" />
                        </td>
                        <td className="py-1 px-2">
                          <input value={r.status} onChange={(e) => updateEditing(i, { status: e.target.value })} className={inputCls} placeholder="상태" />
                        </td>
                        <td className="py-1 px-2">
                          <input value={r.createdAt} onChange={(e) => updateEditing(i, { createdAt: e.target.value })} className={inputCls} placeholder="YYYY-MM-DD" />
                        </td>
                        <td className="py-1 px-2">
                          <button type="button" onClick={() => removeRow('editing', i)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {active === 'prompt-review' && (
            <section className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">3. 프롬프트 감수</h2>
                  <p className="text-xs text-gray-500 mt-0.5">프롬프트 감수 데이터 (요청·결과 DB)</p>
                </div>
                <button
                  type="button"
                  onClick={() => addRow('promptReview')}
                  className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
                >
                  <Plus className="w-4 h-4" /> 추가
                </button>
              </div>
              <div className="p-4 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-medium text-gray-700">ID</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">의뢰ID</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">원문 일부</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">감수 후 일부</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">톤</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">모델</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">상태</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">일자</th>
                      <th className="w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {promptReviewData.map((r, i) => (
                      <tr key={r.id} className="border-b border-gray-100">
                        <td className="py-1 px-2">
                          <input value={r.id} onChange={(e) => updatePromptReview(i, { id: e.target.value })} className={`${inputCls} font-mono text-xs w-16`} />
                        </td>
                        <td className="py-1 px-2">
                          <input value={r.requestId} onChange={(e) => updatePromptReview(i, { requestId: e.target.value })} className={inputCls} />
                        </td>
                        <td className="py-1 px-2">
                          <input value={r.sourceSnippet} onChange={(e) => updatePromptReview(i, { sourceSnippet: e.target.value })} className={inputCls} placeholder="원문" />
                        </td>
                        <td className="py-1 px-2">
                          <input value={r.reviewedSnippet} onChange={(e) => updatePromptReview(i, { reviewedSnippet: e.target.value })} className={inputCls} placeholder="감수문" />
                        </td>
                        <td className="py-1 px-2">
                          <input value={r.tone} onChange={(e) => updatePromptReview(i, { tone: e.target.value })} className={inputCls} />
                        </td>
                        <td className="py-1 px-2">
                          <input value={r.model} onChange={(e) => updatePromptReview(i, { model: e.target.value })} className={inputCls} />
                        </td>
                        <td className="py-1 px-2">
                          <input value={r.status} onChange={(e) => updatePromptReview(i, { status: e.target.value })} className={inputCls} />
                        </td>
                        <td className="py-1 px-2">
                          <input value={r.createdAt} onChange={(e) => updatePromptReview(i, { createdAt: e.target.value })} className={inputCls} />
                        </td>
                        <td className="py-1 px-2">
                          <button type="button" onClick={() => removeRow('promptReview', i)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {active === 'expert-review' && (
            <section className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">4. 전문가 감수 모음</h2>
                  <p className="text-xs text-gray-500 mt-0.5">감수 의뢰 데이터 (DB) + 전문가 샘플</p>
                </div>
                <button
                  type="button"
                  onClick={() => addRow('expertReview')}
                  className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
                >
                  <Plus className="w-4 h-4" /> 추가
                </button>
              </div>
              <div className="p-4 space-y-6">
                <div className="overflow-x-auto">
                  <h3 className="text-sm font-medium text-gray-800 mb-2">감수 의뢰 데이터</h3>
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-3 font-medium text-gray-700">ID</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-700">전문가</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-700">문서 제목</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-700">상태</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-700">의뢰일</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-700">완료일</th>
                        <th className="w-10" />
                      </tr>
                    </thead>
                    <tbody>
                      {expertReviewRequests.map((r, i) => (
                        <tr key={r.id} className="border-b border-gray-100">
                          <td className="py-1 px-2">
                            <input value={r.id} onChange={(e) => updateExpertReview(i, { id: e.target.value })} className={`${inputCls} font-mono text-xs w-16`} />
                          </td>
                          <td className="py-1 px-2">
                            <input value={r.expertName} onChange={(e) => updateExpertReview(i, { expertName: e.target.value })} className={inputCls} />
                          </td>
                          <td className="py-1 px-2">
                            <input value={r.documentTitle} onChange={(e) => updateExpertReview(i, { documentTitle: e.target.value })} className={inputCls} />
                          </td>
                          <td className="py-1 px-2">
                            <input value={r.status} onChange={(e) => updateExpertReview(i, { status: e.target.value })} className={inputCls} />
                          </td>
                          <td className="py-1 px-2">
                            <input value={r.requestedAt} onChange={(e) => updateExpertReview(i, { requestedAt: e.target.value })} className={inputCls} />
                          </td>
                          <td className="py-1 px-2">
                            <input value={r.completedAt} onChange={(e) => updateExpertReview(i, { completedAt: e.target.value })} className={inputCls} />
                          </td>
                          <td className="py-1 px-2">
                            <button type="button" onClick={() => removeRow('expertReview', i)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="overflow-x-auto">
                  <h3 className="text-sm font-medium text-gray-800 mb-2">전문가 샘플 (읽기 전용)</h3>
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-3 font-medium text-gray-700">이름</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-700">레벨</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-700">유형</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-700">분야</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-700">채널</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-700">평점</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminTranslators.slice(0, 8).map((e) => (
                        <tr key={e.id} className="border-b border-gray-100">
                          <td className="py-2 px-3 font-medium text-gray-900">{e.name}</td>
                          <td className="py-2 px-3 text-gray-600">{e.level}</td>
                          <td className="py-2 px-3 text-gray-600">{e.expertType}</td>
                          <td className="py-2 px-3 text-gray-600">{e.area} / {e.subArea}</td>
                          <td className="py-2 px-3 text-gray-600">{e.serviceChannels.join(', ')}</td>
                          <td className="py-2 px-3 text-gray-600">{e.rating}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {active === 'translation' && (
            <section className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">5. 번역 자료 모음</h2>
                  <p className="text-xs text-gray-500 mt-0.5">번역 데이터 (원문·번역문 등 번역 결과물 DB)</p>
                </div>
                <button
                  type="button"
                  onClick={() => addRow('translation')}
                  className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
                >
                  <Plus className="w-4 h-4" /> 추가
                </button>
              </div>
              <div className="p-4 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-medium text-gray-700">ID</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">의뢰ID</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">원문 일부</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">번역문 일부</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">원→대상</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">분야</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">상태</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">등록일</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">워드</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">의뢰자</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">번역사</th>
                      <th className="w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {translationData.map((r, i) => (
                      <tr key={r.id} className="border-b border-gray-100">
                        <td className="py-1 px-2">
                          <input value={r.id} onChange={(e) => updateTranslation(i, { id: e.target.value })} className={`${inputCls} font-mono text-xs w-16`} />
                        </td>
                        <td className="py-1 px-2">
                          <input value={r.requestId} onChange={(e) => updateTranslation(i, { requestId: e.target.value })} className={inputCls} />
                        </td>
                        <td className="py-1 px-2 max-w-[140px]">
                          <input value={r.sourceText} onChange={(e) => updateTranslation(i, { sourceText: e.target.value })} className={inputCls} placeholder="원문" />
                        </td>
                        <td className="py-1 px-2 max-w-[140px]">
                          <input value={r.translatedText} onChange={(e) => updateTranslation(i, { translatedText: e.target.value })} className={inputCls} placeholder="번역문" />
                        </td>
                        <td className="py-1 px-2">
                          <div className="flex gap-1 items-center">
                            <input value={r.sourceLang} onChange={(e) => updateTranslation(i, { sourceLang: e.target.value })} className={`${inputCls} w-12 text-xs`} placeholder="원" />
                            <span className="text-gray-400">→</span>
                            <input value={r.targetLang} onChange={(e) => updateTranslation(i, { targetLang: e.target.value })} className={`${inputCls} w-12 text-xs`} placeholder="대상" />
                          </div>
                        </td>
                        <td className="py-1 px-2">
                          <input value={r.field} onChange={(e) => updateTranslation(i, { field: e.target.value })} className={inputCls} />
                        </td>
                        <td className="py-1 px-2">
                          <input value={r.status} onChange={(e) => updateTranslation(i, { status: e.target.value })} className={inputCls} />
                        </td>
                        <td className="py-1 px-2">
                          <input value={r.createdAt} onChange={(e) => updateTranslation(i, { createdAt: e.target.value })} className={inputCls} />
                        </td>
                        <td className="py-1 px-2">
                          <input type="number" value={r.wordCount} onChange={(e) => updateTranslation(i, { wordCount: Number(e.target.value) || 0 })} className={`${inputCls} w-14`} />
                        </td>
                        <td className="py-1 px-2">
                          <input value={r.clientName} onChange={(e) => updateTranslation(i, { clientName: e.target.value })} className={inputCls} />
                        </td>
                        <td className="py-1 px-2">
                          <input value={r.translatorName} onChange={(e) => updateTranslation(i, { translatorName: e.target.value })} className={inputCls} />
                        </td>
                        <td className="py-1 px-2">
                          <button type="button" onClick={() => removeRow('translation', i)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {active === 'tesol' && (
            <section className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">6. 테솔 교사 레슨 자료</h2>
                  <p className="text-xs text-gray-500 mt-0.5">테솔 레슨 자료 데이터 (단원·카테고리 DB)</p>
                </div>
                <button
                  type="button"
                  onClick={() => addRow('tesol')}
                  className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
                >
                  <Plus className="w-4 h-4" /> 추가
                </button>
              </div>
              <div className="p-4 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-medium text-gray-700">단원</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">제목</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">카테고리</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">난이도</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">소요</th>
                      <th className="w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {tesol.map((r, i) => (
                      <tr key={r.id} className="border-b border-gray-100">
                        <td className="py-1 px-2">
                          <input
                            value={r.unit}
                            onChange={(e) => updateTesol(i, { unit: e.target.value })}
                            className={inputCls}
                          />
                        </td>
                        <td className="py-1 px-2">
                          <input
                            value={r.title}
                            onChange={(e) => updateTesol(i, { title: e.target.value })}
                            className={inputCls}
                          />
                        </td>
                        <td className="py-1 px-2">
                          <input
                            value={r.category}
                            onChange={(e) => updateTesol(i, { category: e.target.value })}
                            className={inputCls}
                          />
                        </td>
                        <td className="py-1 px-2">
                          <input
                            value={r.difficulty}
                            onChange={(e) => updateTesol(i, { difficulty: e.target.value })}
                            className={inputCls}
                          />
                        </td>
                        <td className="py-1 px-2">
                          <input
                            value={r.duration}
                            onChange={(e) => updateTesol(i, { duration: e.target.value })}
                            className={inputCls}
                          />
                        </td>
                        <td className="py-1 px-2">
                          <button
                            type="button"
                            onClick={() => removeRow('tesol', i)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {active === 'marketing' && (
            <section className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">7. 마케팅 디비 정리</h2>
                  <p className="text-xs text-gray-500 mt-0.5">타겟별 마케팅 전략 DB (다중선택·블로그 콘텐츠 입력 가능)</p>
                </div>
                <button
                  type="button"
                  onClick={() => addRow('marketing')}
                  className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
                >
                  <Plus className="w-4 h-4" /> 추가
                </button>
              </div>
              <div className="p-4 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-medium text-gray-700 sticky left-0 bg-white z-10">ID</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">타겟구분</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">세부타겟</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">연령대</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">a 니즈</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">상황</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">활용 목적</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">채널</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">운영방식</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">콘텐츠</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">예외사항(헤드라인)</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">서브카피</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">핵심포인트</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">ai</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">AITe 핵심가치</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">핵심메시지</th>
                      <th className="w-10 sticky right-0 bg-white z-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {marketingData.map((r, i) => (
                      <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                        <td className="py-1 px-2 sticky left-0 bg-white z-10">
                          <input value={r.id} onChange={(e) => updateMarketing(i, { id: e.target.value })} className={`${inputCls} font-mono text-xs w-16`} />
                        </td>
                        <td className="py-1 px-2">
                          <input value={r.targetGroup} onChange={(e) => updateMarketing(i, { targetGroup: e.target.value })} className={inputCls} placeholder="일반인, 대학생, 전문가" />
                        </td>
                        <td className="py-1 px-2">
                          <input value={r.subTarget} onChange={(e) => updateMarketing(i, { subTarget: e.target.value })} className={inputCls} placeholder="취업준비생, 이직직장인..." />
                        </td>
                        <td className="py-1 px-2">
                          <input value={r.ageGroup} onChange={(e) => updateMarketing(i, { ageGroup: e.target.value })} className={inputCls} placeholder="20~30" />
                        </td>
                        <td className="py-1 px-2">
                          <input value={r.needs} onChange={(e) => updateMarketing(i, { needs: e.target.value })} className={inputCls} placeholder="차별화, 직무확장..." />
                        </td>
                        <td className="py-1 px-2">
                          <input value={r.situation} onChange={(e) => updateMarketing(i, { situation: e.target.value })} className={inputCls} placeholder="스펙부족, 커리어정체..." />
                        </td>
                        <td className="py-1 px-2">
                          <input value={r.purposeOfUse} onChange={(e) => updateMarketing(i, { purposeOfUse: e.target.value })} className={inputCls} placeholder="취업, 이직, 부업..." />
                        </td>
                        <td className="py-1 px-2">
                          <input value={r.channel} onChange={(e) => updateMarketing(i, { channel: e.target.value })} className={inputCls} placeholder="인스타그릴스카드, 유튜브숏폼..." />
                        </td>
                        <td className="py-1 px-2">
                          <input value={r.operationMethod} onChange={(e) => updateMarketing(i, { operationMethod: e.target.value })} className={inputCls} placeholder="SEO, 키워드, 메일..." />
                        </td>
                        <td className="py-1 px-2">
                          <input value={r.content} onChange={(e) => updateMarketing(i, { content: e.target.value })} className={inputCls} placeholder="비교콘텐츠, 번역비교, 후기정보..." />
                        </td>
                        <td className="py-1 px-2">
                          <input value={r.exceptionsHeadline} onChange={(e) => updateMarketing(i, { exceptionsHeadline: e.target.value })} className={inputCls} placeholder="블로그에만 올릴 것, 합격후기..." />
                        </td>
                        <td className="py-1 px-2">
                          <input value={r.subCopy} onChange={(e) => updateMarketing(i, { subCopy: e.target.value })} className={inputCls} placeholder="ai 시대, 꾸준한 자기계발은 필수" />
                        </td>
                        <td className="py-1 px-2">
                          <input value={r.keyPoint} onChange={(e) => updateMarketing(i, { keyPoint: e.target.value })} className={inputCls} placeholder="ai 자격증으로 자기계발과 스펙업" />
                        </td>
                        <td className="py-1 px-2">
                          <input value={r.ai} onChange={(e) => updateMarketing(i, { ai: e.target.value })} className={inputCls} placeholder="자기계발, 스펙업, 번역감수수익..." />
                        </td>
                        <td className="py-1 px-2">
                          <input value={r.aiTeCoreValue} onChange={(e) => updateMarketing(i, { aiTeCoreValue: e.target.value })} className={inputCls} placeholder="제미나이 지피티" />
                        </td>
                        <td className="py-1 px-2">
                          <input value={r.coreMessage} onChange={(e) => updateMarketing(i, { coreMessage: e.target.value })} className={inputCls} placeholder="AI 실무능력 검증, AI 실무 자격증" />
                        </td>
                        <td className="py-1 px-2 sticky right-0 bg-white z-10">
                          <button type="button" onClick={() => removeRow('marketing', i)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
