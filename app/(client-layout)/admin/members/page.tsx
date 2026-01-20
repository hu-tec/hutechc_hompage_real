'use client';

import Link from 'next/link';
import { useState } from 'react';

// Mock 회원 데이터
const mockMembers = [
  {
    id: 1,
    memberNo: 'UI240110002',
    siteType: '메타시험',
    memberType: '정식회원',
    subscription: 'Premium',
    name: '홍길동',
    age: 34,
    gender: '남',
    email: 'abce@gmail.com',
    phone: '01012345678',
    address: '서울 강남구',
    groupStatus: true,
    groupName: '삼성',
    joinDate: '24.10.30',
    joinChannel: '네이버',
    firstDevice: 'PC',
    lastLogin: '24.10.10 월 15m 30s',
    notification: '문자, 이메일',
    activityNo: 'XXXXX',
    serviceType: '시험',
    region: '대한민국 서울',
    examDate: '24.01.10 10:00-16:00',
    applicationType: '정시 25년 1차',
    examItem: '번역 전문가 전문1급',
    examSubject: '카테고리(대)/카테고리(중) 카테고리(소)',
    examName: '시험명 표시 영역',
    sourceLang: '한국어',
    targetLang: 'English(US)',
    examType: '시험 유형',
    applicationPeriod: '24.01.10 - 24.01.30',
    applicationStatus: '접수전',
    examStatus: '시험 시작',
    examResult: '미응시',
    resultDate: '24.10.10 월 10:00',
  },
  {
    id: 2,
    memberNo: 'UI240110003',
    siteType: '메타시험',
    memberType: '일반회원',
    subscription: 'Standard',
    name: '김영희',
    age: 28,
    gender: '여',
    email: 'kim@example.com',
    phone: '01023456789',
    address: '서울 서초구',
    groupStatus: false,
    groupName: null,
    joinDate: '24.09.15',
    joinChannel: '카카오',
    firstDevice: '모바일',
    lastLogin: '24.12.19 화 20m 15s',
    notification: '문자, 카카오톡',
    activityNo: 'YYYYY',
    serviceType: '시험',
    region: '대한민국 서울',
    examDate: '24.01.10 10:00-16:00',
    applicationType: '정시 25년 1차',
    examItem: '번역 전문가 전문1급',
    examSubject: '카테고리(대)/카테고리(중)',
    examName: '시험명 표시 영역',
    sourceLang: '한국어',
    targetLang: 'English(US)',
    examType: '시험 유형',
    applicationPeriod: '24.01.10 - 24.01.30',
    applicationStatus: '접수완료',
    examStatus: '시험 완료',
    examResult: '합격',
    score: 80,
    resultDate: '24.10.10 월 10:00',
  },
];

type TabType = '전체' | '회원관리' | '활동관리' | '결제관리' | '1:1문의관리' | '통계';

export default function AdminMembersPage() {
  const [activeTab, setActiveTab] = useState<TabType>('회원관리');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    memberType: [] as string[],
    gender: [] as string[],
    editorType: [] as string[],
    subscription: [] as string[],
    notification: [] as string[],
  });
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const filteredMembers = mockMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm) ||
      member.memberNo.includes(searchTerm);
    
    const matchesMemberType =
      selectedFilters.memberType.length === 0 ||
      selectedFilters.memberType.includes(member.memberType);
    
    const matchesGender =
      selectedFilters.gender.length === 0 ||
      selectedFilters.gender.includes(member.gender);
    
    const matchesSubscription =
      selectedFilters.subscription.length === 0 ||
      selectedFilters.subscription.includes(member.subscription);
    
    return matchesSearch && matchesMemberType && matchesGender && matchesSubscription;
  });

  const toggleFilter = (category: keyof typeof selectedFilters, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[category];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const toggleMemberSelection = (id: number) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedMembers.length === filteredMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(filteredMembers.map((m) => m.id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '접수완료':
      case '합격':
        return 'bg-green-100 text-green-700';
      case '불합격':
        return 'bg-red-100 text-red-700';
      case '접수전':
      case '미응시':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">홈 &gt; 회원관리</div>
            <h1 className="text-2xl font-bold text-gray-900">회원관리</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              저장
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              검색
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="bg-white border border-gray-200 rounded-lg mb-4">
          <div className="flex border-b border-gray-200">
            {(['전체', '회원관리', '활동관리', '결제관리', '1:1문의관리', '통계'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              선택된 검색조건 {Object.values(selectedFilters).flat().length}
            </h2>
            <button
              onClick={() => {
                setSelectedFilters({
                  memberType: [],
                  gender: [],
                  editorType: [],
                  subscription: [],
                  notification: [],
                });
                setDateRange({ start: '', end: '' });
                setSearchTerm('');
              }}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              필터 초기화
            </button>
          </div>

          <div className="space-y-4">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">회원 유형</label>
                <div className="flex flex-wrap gap-2">
                  {['전체', '정식회원', '일반회원', '전문가'].map((type) => (
                    <label key={type} className="flex items-center gap-1 text-sm">
                      <input
                        type="checkbox"
                        checked={
                          type === '전체'
                            ? selectedFilters.memberType.length === 0
                            : selectedFilters.memberType.includes(type)
                        }
                        onChange={() => toggleFilter('memberType', type)}
                        className="rounded border-gray-300"
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">성별</label>
                <div className="flex flex-wrap gap-2">
                  {['전체', '남', '여'].map((g) => (
                    <label key={g} className="flex items-center gap-1 text-sm">
                      <input
                        type="checkbox"
                        checked={
                          g === '전체'
                            ? selectedFilters.gender.length === 0
                            : selectedFilters.gender.includes(g)
                        }
                        onChange={() => toggleFilter('gender', g)}
                        className="rounded border-gray-300"
                      />
                      <span>{g}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">구독 상태</label>
                <div className="flex flex-wrap gap-2">
                  {['전체', 'Premium', 'Standard', 'Basic', '없음'].map((sub) => (
                    <label key={sub} className="flex items-center gap-1 text-sm">
                      <input
                        type="checkbox"
                        checked={
                          sub === '전체'
                            ? selectedFilters.subscription.length === 0
                            : selectedFilters.subscription.includes(sub)
                        }
                        onChange={() => toggleFilter('subscription', sub)}
                        className="rounded border-gray-300"
                      />
                      <span>{sub}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">알림 설정</label>
                <div className="flex flex-wrap gap-2">
                  {['전체', '문자', '이메일', '카카오톡', '없음'].map((notif) => (
                    <label key={notif} className="flex items-center gap-1 text-sm">
                      <input
                        type="checkbox"
                        checked={
                          notif === '전체'
                            ? selectedFilters.notification.length === 0
                            : selectedFilters.notification.includes(notif)
                        }
                        onChange={() => toggleFilter('notification', notif)}
                        className="rounded border-gray-300"
                      />
                      <span>{notif}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Search and Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="이름, 이메일, 전화번호 검색"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">시작일</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">종료일</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
              엑셀파일생성(간편)
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
              엑셀파일생성(상담이력)
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
              파일올리기
            </button>
          </div>
          <div className="text-sm text-gray-600">
            총 {filteredMembers.length}명
          </div>
        </div>

        {/* Members Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedMembers.length === filteredMembers.length && filteredMembers.length > 0}
                      onChange={selectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">번호</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">회원관리번호</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">사이트구분</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">회원유형</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">구독상태</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">이름</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">나이·성별</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">이메일</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">휴대폰</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">주소</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">그룹여부</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">가입일</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">가입채널</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">최근로그인</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">활동관리번호</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">서비스유형</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">지역</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">시험일</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">접수구분</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">시험종목</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">시험등급</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">접수기간</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">접수상태</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">시험상태</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">시험결과</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">채점점수</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(member.id)}
                        onChange={() => toggleMemberSelection(member.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{member.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Link
                        href={`/admin/members/${member.id}`}
                        className="text-blue-600 hover:underline font-medium whitespace-nowrap"
                      >
                        {member.memberNo}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{member.siteType}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{member.memberType}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                        member.subscription === 'Premium' ? 'bg-purple-100 text-purple-700' :
                        member.subscription === 'Standard' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {member.subscription}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{member.name}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{member.age}세 · {member.gender}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{member.email}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{member.phone}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{member.address}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {member.groupStatus ? '✓' : '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{member.joinDate}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{member.joinChannel}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{member.lastLogin}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{member.activityNo}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{member.serviceType}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{member.region}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{member.examDate}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{member.applicationType}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{member.examItem}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{member.examSubject?.split('/')[0] || '-'}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{member.applicationPeriod}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(member.applicationStatus)}`}>
                        {member.applicationStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{member.examStatus}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {member.examResult && (
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(member.examResult)}`}>
                          {member.examResult}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {member.score ? `${member.score}점` : '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Link
                        href={`/admin/members/${member.id}`}
                        className="text-blue-600 hover:text-blue-800 text-xs whitespace-nowrap"
                      >
                        상세
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="mt-4 flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200">
              선택항목삭제
            </button>
            <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200">
              메일보내기
            </button>
            <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200">
              SMS전송
            </button>
          </div>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
            파일다운로드
          </button>
        </div>
      </main>
    </div>
  );
}
