'use client';

import { useMemo, useState } from 'react';

type RequestStatus = '새 번역사 요청' | '수정승인요청' | '수정승인완료';

type TranslatorRequest = {
  id: number;
  translatorName: string;
  level: string;
  area: string;
  subArea: string;
  status: RequestStatus;
  summary: string;
  detail: string;
};

const initialRequests: TranslatorRequest[] = [
  {
    id: 1,
    translatorName: '김번역',
    level: 'A',
    area: '법률',
    subArea: '민사법',
    status: '새 번역사 요청',
    summary: '민사/상사 전문 신규 번역가 등록 요청',
    detail:
      '민사/상사 소송 서류, 계약서 번역 경력 8년입니다. 대형 로펌 근무 경력과 해외 로스쿨 석사 학위 보유하고 있습니다.',
  },
  {
    id: 2,
    translatorName: '이나라',
    level: 'A',
    area: '법률',
    subArea: '형사법',
    status: '새 번역사 요청',
    summary: '형사사건 관련 통역/번역 신규 등록',
    detail:
      '형사사건 피의자/피고인 면담 통역 및 조서 번역 경험 5년입니다. 경찰/검찰기관 수행 이력 포함됩니다.',
  },
  {
    id: 3,
    translatorName: '박글로벌',
    level: 'B',
    area: '경영',
    subArea: '영업',
    status: '새 번역사 요청',
    summary: 'IR/사업계획서 전문 번역가 등록 요청',
    detail:
      '다국적 기업 IR 자료, 영문 사업계획서 번역 경험 6년입니다. 투자자 대상 프레젠테이션 제작 경험도 있습니다.',
  },
  {
    id: 4,
    translatorName: '최정밀',
    level: 'B',
    area: 'IT',
    subArea: '특허',
    status: '수정승인요청',
    summary: '전문 분야에 "반도체/특허" 세부 카테고리 추가 요청',
    detail:
      '최근 3년간 반도체 장비 특허 명세서 번역 프로젝트 40건 이상 수행하여, 세부 분야에 반도체/특허를 추가 요청드립니다.',
  },
  {
    id: 5,
    translatorName: '오세무',
    level: 'C',
    area: '세무',
    subArea: '세무정산',
    status: '수정승인요청',
    summary: '레벨 C → B 승급 및 긴급 작업 가능 시간 추가 요청',
    detail:
      '세무조정 보고서 번역 누적 120건을 달성하여 레벨 승급을 요청드립니다. 또한 평일 야간 긴급 작업 가능으로 설정 변경을 요청합니다.',
  },
  {
    id: 6,
    translatorName: '정헬스',
    level: 'B',
    area: '의료',
    subArea: '임상기록',
    status: '수정승인요청',
    summary: '의료 기록 번역에서 임상시험 관련 추가 전문분야 승인 요청',
    detail:
      '임상시험 프로토콜 및 CSR 번역 경험 30건 이상으로, 임상시험 전문 카테고리 추가 승인을 요청드립니다.',
  },
  {
    id: 7,
    translatorName: '한국제',
    level: 'A',
    area: '국제거래',
    subArea: '계약',
    status: '수정승인완료',
    summary: '국제계약 통역 추가 승인 완료 (기존: 번역 전용)',
    detail:
      '2024-05-12에 국제계약 회의 통역 서비스가 승인되었습니다. 현재 통역/번역 동시 제공 가능합니다.',
  },
  {
    id: 8,
    translatorName: '서리서치',
    level: 'C',
    area: '마케팅',
    subArea: '리서치',
    status: '수정승인완료',
    summary: '시장조사 리포트 요약/편집 기능 추가 승인',
    detail:
      '2024-03-01에 요약/편집 옵션이 승인되어 현재 번역 + 요약 패키지 제공 중입니다.',
  },
  {
    id: 9,
    translatorName: '류컨설트',
    level: 'D',
    area: '취업',
    subArea: '해외취업',
    status: '수정승인완료',
    summary: '해외 취업용 이력서/자소서 템플릿 제공 기능 승인',
    detail:
      '2024-04-20에 템플릿 제공 기능이 승인되었습니다. 현재 3종의 권장 템플릿을 제공 중입니다.',
  },
  {
    id: 10,
    translatorName: '문세심',
    level: 'B',
    area: '학술',
    subArea: '논문',
    status: '수정승인완료',
    summary: '논문 교정 서비스(에디팅) 추가 승인',
    detail:
      '2024-02-15에 논문 교정(에디팅) 서비스가 승인되어, 현재 번역 + 교정 패키지로 판매 중입니다.',
  },
];

const statusTabs: RequestStatus[] = ['새 번역사 요청', '수정승인요청', '수정승인완료'];

export default function AdminTranslatorProfileRequestsPage() {
  const [activeStatus, setActiveStatus] = useState<RequestStatus>('새 번역사 요청');
  const [requests, setRequests] = useState<TranslatorRequest[]>(initialRequests);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const filtered = useMemo(
    () => requests.filter((r) => r.status === activeStatus),
    [requests, activeStatus],
  );

  const selected = useMemo(
    () => requests.find((r) => r.id === selectedId) ?? null,
    [requests, selectedId],
  );

  const handleApprove = () => {
    if (!selected) return;
    setRequests((prev) =>
      prev.map((r) =>
        r.id === selected.id
          ? { ...r, status: '수정승인완료', summary: r.summary, detail: r.detail }
          : r,
      ),
    );
    setActiveStatus('수정승인완료');
  };

  const handleReject = () => {
    if (!selected) return;
    // 간단히 반려 시 리스트에서 제거
    setRequests((prev) => prev.filter((r) => r.id !== selected.id));
    setSelectedId(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">번역사 프로필 요청 리스트</h1>
        <p className="text-sm text-gray-600">
          번역사 신규 등록, 프로필 수정 승인 요청을 상태별로 확인하고 승인/반려할 수 있습니다.
        </p>
      </div>

      {/* 상단 상태 탭 */}
      <div className="flex gap-2">
        {statusTabs.map((tab) => {
          const isActive = tab === activeStatus;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveStatus(tab);
                setSelectedId(null);
              }}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* 요청 리스트 */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-600">
              {activeStatus} ({filtered.length}건)
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-sm text-gray-500">해당 상태의 요청이 없습니다.</div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">번역사</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">레벨</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">전문분야</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">요청 요약</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">액션</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((req) => (
                  <tr
                    key={req.id}
                    className={`border-b last:border-b-0 hover:bg-gray-50 ${
                      selectedId === req.id ? 'bg-purple-50/60' : ''
                    }`}
                  >
                    <td className="px-4 py-2 font-medium text-gray-900">{req.translatorName}</td>
                    <td className="px-4 py-2">
                      <span className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700">
                        레벨 {req.level}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {req.area} / {req.subArea}
                    </td>
                    <td className="px-4 py-2 text-gray-700 truncate max-w-xs" title={req.summary}>
                      {req.summary}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        type="button"
                        onClick={() => setSelectedId(req.id)}
                        className="text-xs font-semibold text-purple-600 hover:text-purple-800"
                      >
                        요청 자료 보기
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 우측 상세 영역 */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 min-h-[220px]">
          {!selected ? (
            <div className="h-full flex items-center justify-center text-xs text-gray-500 text-center px-4">
              왼쪽에서 &ldquo;요청 자료 보기&rdquo;를 클릭하면
              <br />
              상세 요청서와 승인/반려 버튼이 여기 표시됩니다.
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-900 mb-1">
                  {selected.translatorName} / {selected.area} · {selected.subArea}
                </h2>
                <p className="text-xs text-gray-500">상태: {selected.status}</p>
              </div>

              <div className="rounded-md bg-gray-50 border border-gray-200 p-3 text-xs text-gray-700 whitespace-pre-line">
                {selected.detail}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 mt-2">
                {selected.status !== '수정승인완료' && (
                  <>
                    <button
                      type="button"
                      onClick={handleReject}
                      className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    >
                      반려 하기
                    </button>
                    <button
                      type="button"
                      onClick={handleApprove}
                      className="rounded-md bg-purple-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-700"
                    >
                      승인하기
                    </button>
                  </>
                )}
                {selected.status === '수정승인완료' && (
                  <span className="text-xs text-green-600 font-medium">이미 승인 완료된 요청입니다.</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
