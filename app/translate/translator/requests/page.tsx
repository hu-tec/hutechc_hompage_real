'use client';

import { useState } from 'react';
import { useTranslator, type WorkingRequest } from '@/lib/translatorContext';

type RequestStatus = '신청대기' | '최종대기' | '진행중' | '완료' | '거절됨';

interface TranslationRequest {
  id: string;
  title: string;
  language: string;
  field: string;
  wordCount: number;
  deadline: string;
  price: number;
  urgent: boolean;
  clientName: string;
  status: RequestStatus;
  createdAt: string;
  aiSettings?: {
    models: string[];
    tone: string;
  };
  description: string;
  matchingType: 'auto' | 'direct'; // 자동매칭 vs 직접선택
}

const mockRequests: TranslationRequest[] = [
  {
    id: 'req-001',
    title: '기술 문서 번역',
    language: '한국어 → 영어',
    field: '기술/IT',
    wordCount: 3200,
    deadline: '2024-12-10',
    price: 480000,
    urgent: true,
    clientName: '테크회사 A',
    status: '신청대기',
    createdAt: '2024-12-04',
    aiSettings: {
      models: ['ChatGPT'],
      tone: '기술적',
    },
    description: '소프트웨어 매뉴얼 한영 번역',
    matchingType: 'auto', // 자동매칭 → 수락 시 바로 진행중
  },
  {
    id: 'req-002',
    title: '법률 계약서 번역',
    language: '영어 → 한국어',
    field: '법률',
    wordCount: 1800,
    deadline: '2024-12-15',
    price: 360000,
    urgent: false,
    clientName: '법률사무소 B',
    status: '신청대기',
    createdAt: '2024-12-04',
    description: '국제 계약서 번역',
    matchingType: 'direct', // 직접선택 → 승인 필요
  },
  {
    id: 'req-003',
    title: '의료 논문 번역',
    language: '한국어 → 영어',
    field: '의료/제약',
    wordCount: 5000,
    deadline: '2024-12-20',
    price: 750000,
    urgent: false,
    clientName: '의료기관 C',
    status: '신청대기',
    createdAt: '2024-12-03',
    description: '의학 논문 번역 (검수 포함)',
    matchingType: 'direct', // 직접선택 → 승인 필요
  },
];

export default function TranslatorRequestsPage() {
  const [requests, setRequests] = useState<TranslationRequest[]>(mockRequests);
  const [filterStatus, setFilterStatus] = useState<RequestStatus | '전체'>('신청대기');
  const { addWorkingRequest } = useTranslator();

  const handleAccept = (id: string) => {
    const request = requests.find((r) => r.id === id);
    if (!request) return;

    const isAutoMatching = request.matchingType === 'auto';
    const newStatus = isAutoMatching ? '진행중' : '최종대기';
    
    setRequests(
      requests.map((req) =>
        req.id === id ? { ...req, status: newStatus as RequestStatus } : req
      )
    );
    
    // 자동매칭이면 working context에 추가
    if (isAutoMatching) {
      const workingRequest: WorkingRequest = {
        id: request.id,
        title: request.title,
        language: request.language,
        field: request.field,
        wordCount: request.wordCount,
        deadline: request.deadline,
        price: request.price,
        urgencyTier: request.urgent ? 'urgent2' : 'normal',
        clientName: request.clientName,
        createdAt: request.createdAt,
        startedAt: new Date().toISOString().split('T')[0],
        progress: 0,
        description: request.description,
      };
      addWorkingRequest(workingRequest);
      alert('자동 매칭되었습니다. 진행 중 페이지로 이동했습니다!');
    } else {
      alert('번역 요청을 수락했습니다. 의뢰자의 최종 승인를 기다리고 있습니다.')
    }
  };

  const handleReject = (id: string) => {
    setRequests(
      requests.map((req) =>
        req.id === id ? { ...req, status: '거절됨' as RequestStatus } : req
      )
    );
    alert('번역 요청을 거절했습니다.');
  };

  const filteredRequests =
    filterStatus === '전체' ? requests : requests.filter((req) => req.status === filterStatus);

  const pendingCount = requests.filter((req) => req.status === '신청대기').length;
  const finalWaitingCount = requests.filter((req) => req.status === '최종대기').length;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">신규 번역 요청</h1>
        <p className="text-gray-600">당신에게 들어온 번역 요청을 확인하세요</p>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">신청 대기</div>
          <div className="text-3xl font-bold text-red-600">{pendingCount}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">최종 대기</div>
          <div className="text-3xl font-bold text-orange-600">{finalWaitingCount}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">거절됨</div>
          <div className="text-3xl font-bold text-gray-600">
            {requests.filter((r) => r.status === '거절됨').length}
          </div>
        </div>
      </div>

      {/* 필터 */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex gap-2 flex-wrap">
          {(['전체', '신청대기', '최종대기', '거절됨'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
              {status === '신청대기' && <span className="ml-2 text-sm">({pendingCount})</span>}
              {status === '최종대기' && <span className="ml-2 text-sm">({finalWaitingCount})</span>}
            </button>
          ))}
        </div>
      </div>

      {/* 요청 목록 */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-4xl mb-2">📭</div>
            <div className="text-gray-600">표시할 요청이 없습니다.</div>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{request.title}</h3>
                    {request.urgent && (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                        🔴 긴급
                      </span>
                    )}
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                      {request.matchingType === 'auto' ? '🤖 자동매칭' : '👤 직접선택'}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        request.status === '신청대기'
                          ? 'bg-yellow-100 text-yellow-700'
                          : request.status === '최종대기'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{request.description}</p>
                </div>
                <div className="text-right ml-4">
                  <div className="text-2xl font-bold text-indigo-600">₩{request.price.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">견적 금액</div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-4 pb-4 border-b border-gray-200">
                <div>
                  <div className="text-xs text-gray-600 mb-1">언어</div>
                  <div className="font-semibold text-gray-900">{request.language}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">분야</div>
                  <div className="font-semibold text-gray-900">{request.field}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">분량</div>
                  <div className="font-semibold text-gray-900">{request.wordCount.toLocaleString()}단어</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">마감일</div>
                  <div className="font-semibold text-gray-900">{request.deadline}</div>
                </div>
              </div>

              {request.aiSettings && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-xs font-semibold text-gray-700 mb-2">AI 번역 설정</div>
                  <div className="text-xs text-gray-600">
                    모델: {request.aiSettings.models.join(', ')} | 톤: {request.aiSettings.tone}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <div className="text-xs text-gray-500">
                  의뢰자: {request.clientName} | 신청 시간: {request.createdAt}
                </div>
              </div>

              {/* 액션 버튼 */}
              {request.status === '신청대기' && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleAccept(request.id)}
                    className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    ✅ 수락
                  </button>
                  <button
                    onClick={() => handleReject(request.id)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-md font-semibold hover:bg-gray-50 transition-colors"
                  >
                    ❌ 거절
                  </button>
                  <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md font-semibold hover:bg-gray-50 transition-colors">
                    상세 보기
                  </button>
                </div>
              )}

              {request.status === '최종대기' && (
                <div className="flex gap-3 mt-4">
                  <div className="flex-1 px-6 py-3 bg-orange-50 text-orange-700 rounded-md font-semibold text-center">
                    ⏳ 의뢰자 최종 승인 대기 중...
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
