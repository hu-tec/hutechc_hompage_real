'use client';

import { useMemo, useState } from 'react';
import type {
  ExpertType,
  Nationality,
  Language,
  TranslationLevel,
  AvailableTime,
  Experience,
  WorkType,
  LanguageCertificate,
  CallTime,
  Education,
  OverseasResidence,
  GradeApplication,
} from '@/types/translatorGrade';

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
  gradeApplication?: GradeApplication;
};

// 예시 등급 신청 데이터
const exampleGradeApplication: GradeApplication = {
  id: '1',
  translatorId: '1',
  translatorName: '김번역',
  expertType: '일반전문가',
  expertLevel: { A: 'A레벨', B: 'B레벨', C: 'C레벨' },
  availableLanguages: ['한국어', '영어', '일본어', '중국어', '스페인어', '러시아어', '포르투갈어', '말레이시아어', '태국어', '프랑스어', '인도어', '베트남어', '파키스탄어', '몽골어', '네덜란드어', '그리스어', '히브리어'],
  nationality: ['한국인', '미국인', '영국인', '호주인', '중국인', '일본인', '스페니쉬', '러시아인', '포르투갈인', '말레이시아인', '대국인', '프랑스인', '인도인', '베트인', '파키스탄인', '몽골인', '네덜란드인', '그리스인', '히브리인'],
  translationLevel: ['최상', '상', '중', '하'],
  availableTime: ['언제든', '당장', '하루', '이틀', '3일 이상', '10일 이상'],
  experience: ['신입', '3년이하', '4-10년', '10년이상'],
  workType: ['없음', '일반번역(학생, 프리랜서, 직장인)', '전문번역사', '특수업직장인(반도체, 기계, 공학, 환경, 무역 등)', '전문직(변호사, 의사, 노무사등)', '번역사'],
  languageCertificates: ['없음', '토익', '토플', 'IELTS', 'ITT통번역자격증', '통번역대학원', '해외경험있음', '그외'],
  mtType: ['있음', '없음', '전혀모름'],
  usesTranslationTools: ['있음', '없음', '전혀모름'],
  callTime: ['종일', '오전', '오후', '퇴근후', '주말'],
  education: ['고졸이하', '고졸', '초대졸', '학사', '석사', '박사', '교수'],
  overseasResidence: ['없음', '6개월~1년이면', '1~3년', '4~10년'],
  remarks: '법률 분야 전문 번역 경력이 있습니다.',
  status: 'pending',
  createdAt: new Date().toISOString(),
  requestedLevel: 'A',
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
    gradeApplication: exampleGradeApplication,
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

// 상세 신청서 보기 컴포넌트
function GradeApplicationDetailView({
  request,
  onBack,
  onApprove,
  onReject,
}: {
  request: TranslatorRequest;
  onBack: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const application = request.gradeApplication || exampleGradeApplication;
  const [activeTab, setActiveTab] = useState<ExpertType | '비고'>('일반전문가');

  const LANGUAGES: Language[] = [
    '한국어', '영어', '중국어', '일본어', '스페인어', '러시아어', '포르투갈어',
    '말레이시아어', '태국어', '프랑스어', '인도어', '베트남어', '파키스탄어',
    '몽골어', '네덜란드어', '그리스어', '히브리어',
  ];

  const NATIONALITIES: Nationality[] = [
    '한국인', '미국인', '영국인', '호주인', '중국인', '일본인', '스페니쉬',
    '러시아인', '포르투갈인', '말레이시아인', '대국인', '프랑스인', '인도인',
    '베트인', '파키스탄인', '몽골인', '네덜란드인', '그리스인', '히브리인',
  ];

  const TRANSLATION_LEVELS: TranslationLevel[] = ['최상', '상', '중', '하'];
  const AVAILABLE_TIMES: AvailableTime[] = ['언제든', '당장', '하루', '이틀', '3일 이상', '10일 이상'];
  const EXPERIENCES: Experience[] = ['신입', '3년이하', '4-10년', '10년이상'];
  const WORK_TYPES: WorkType[] = [
    '없음', '일반번역(학생, 프리랜서, 직장인)', '전문번역사',
    '특수업직장인(반도체, 기계, 공학, 환경, 무역 등)',
    '전문직(변호사, 의사, 노무사등)', '번역사',
  ];
  const LANGUAGE_CERTIFICATES: LanguageCertificate[] = [
    '없음', '토익', '토플', 'IELTS', 'ITT통번역자격증',
    '통번역대학원', '해외경험있음', '그외',
  ];
  const CALL_TIMES: CallTime[] = ['종일', '오전', '오후', '퇴근후', '주말'];
  const EDUCATION_LEVELS: Education[] = ['고졸이하', '고졸', '초대졸', '학사', '석사', '박사', '교수'];
  const OVERSEAS_RESIDENCE: OverseasResidence[] = ['없음', '6개월~1년이면', '1~3년', '4~10년'];

  return (
    <div className="mt-4 bg-white border border-gray-200 rounded-lg p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={onBack}
            className="text-sm text-gray-600 hover:text-gray-900 mb-2 inline-block"
          >
            ← 목록으로 돌아가기
          </button>
          <h2 className="text-2xl font-bold text-gray-900">번역사 등급</h2>
          <p className="text-sm text-gray-600 mt-1">번역사: {request.translatorName}</p>
        </div>
        <div className="flex gap-2">
          {request.status !== '수정승인완료' && (
            <>
              <button
                onClick={onReject}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50"
              >
                반려
              </button>
              <button
                onClick={onApprove}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
              >
                저장
              </button>
            </>
          )}
        </div>
      </div>

      {/* 탭 */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {(['일반전문가', '고급전문가', '특수전문가', '비고'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 필터 양식 */}
      <div className="space-y-6">
        {/* 전문가레벨 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">전문가레벨</label>
          <div className="grid grid-cols-3 gap-4">
            {(['A', 'B', 'C'] as const).map((level) => (
              <div key={level} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!application.expertLevel[level]}
                  disabled
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
                />
                <input
                  type="text"
                  value={application.expertLevel[level] || ''}
                  disabled
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder={`레벨 ${level} 입력`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 가능언어 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">가능언어</label>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {LANGUAGES.map((lang) => (
              <label key={lang} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={application.availableLanguages.includes(lang)}
                  disabled
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{lang}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 국적 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">국적</label>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {NATIONALITIES.map((nat) => (
              <label key={nat} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={application.nationality.includes(nat)}
                  disabled
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{nat}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 번역레벨 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">번역레벨</label>
          <div className="flex gap-2">
            {TRANSLATION_LEVELS.map((level) => (
              <label key={level} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={application.translationLevel.includes(level)}
                  disabled
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{level}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 번역가능시간 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">번역가능시간</label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_TIMES.map((time) => (
              <label key={time} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={application.availableTime.includes(time)}
                  disabled
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{time}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 번역경력 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">번역경력</label>
          <div className="flex gap-2">
            {EXPERIENCES.map((exp) => (
              <label key={exp} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={application.experience.includes(exp)}
                  disabled
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{exp}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 작업 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">작업</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {WORK_TYPES.map((work) => (
              <label key={work} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={application.workType.includes(work)}
                  disabled
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{work}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 언어자격증 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">언어자격증</label>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {LANGUAGE_CERTIFICATES.map((cert) => (
              <label key={cert} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={application.languageCertificates.includes(cert)}
                  disabled
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{cert}</span>
              </label>
            ))}
          </div>
        </div>

        {/* MT강형 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">MT강형</label>
          <div className="flex gap-2">
            {(['있음', '없음', '전혀모름'] as const).map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={application.mtType.includes(type)}
                  disabled
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 번역기사용 유무 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">번역기사용 유무</label>
          <div className="flex gap-2">
            {(['있음', '없음', '전혀모름'] as const).map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={application.usesTranslationTools.includes(type)}
                  disabled
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 통화가능시간 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">통화가능시간</label>
          <div className="flex flex-wrap gap-2">
            {CALL_TIMES.map((time) => (
              <label key={time} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={application.callTime.includes(time)}
                  disabled
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{time}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 학력 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">학력</label>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {EDUCATION_LEVELS.map((edu) => (
              <label key={edu} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={application.education.includes(edu)}
                  disabled
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{edu}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 해외거주기간 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">해외거주기간</label>
          <div className="flex gap-2">
            {OVERSEAS_RESIDENCE.map((period) => (
              <label key={period} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={application.overseasResidence.includes(period)}
                  disabled
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{period}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 비고 탭 */}
        {activeTab === '비고' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">비고</label>
            <textarea
              value={application.remarks || ''}
              disabled
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
        )}
      </div>

      {/* 하단 버튼 */}
      {request.status !== '수정승인완료' && (
        <div className="flex justify-end gap-2 mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={onReject}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50"
          >
            반려
          </button>
          <button
            onClick={onApprove}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
          >
            저장
          </button>
        </div>
      )}
    </div>
  );
}

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

      {!selectedId ? (
        // 요청 리스트 화면
        <div className="mt-4 bg-white border border-gray-200 rounded-lg overflow-hidden">
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
                    className="border-b last:border-b-0 hover:bg-gray-50"
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
                        신청서 자세히 보기
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        // 상세 신청서 화면
        <GradeApplicationDetailView
          request={selected!}
          onBack={() => setSelectedId(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}
