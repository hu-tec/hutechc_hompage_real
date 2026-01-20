'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function AdminExpertsPage() {
  const [adminMemo, setAdminMemo] = useState('');
  const [expertStatus, setExpertStatus] = useState('전문가 승인');
  const [priority, setPriority] = useState('1');
  const [expertLevel, setExpertLevel] = useState('A');
  const [matchingStatus, setMatchingStatus] = useState('매칭요청');
  const [refundStatus, setRefundStatus] = useState('환불 요청');

  // 카테고리 데이터
  const [categories, setCategories] = useState([
    { large: '', medium: '', small: '', file: '' },
    { large: '', medium: '', small: '', file: '' },
    { large: '', medium: '', small: '', file: '' },
  ]);

  // 서비스 가능 유형/시간 데이터
  const [services, setServices] = useState([
    { type: false, time: false },
    { type: false, time: false },
    { type: false, time: false },
  ]);

  // 학력 데이터
  const [educations, setEducations] = useState([
    { school: '', major: '', startDate: '', endDate: '', graduation: '', file: '' },
    { school: '', major: '', startDate: '', endDate: '', graduation: '', file: '' },
    { school: '', major: '', startDate: '', endDate: '', graduation: '', file: '' },
  ]);

  // 경력 데이터
  const [careers, setCareers] = useState([
    { company: '', department: '', position: '', startDate: '', endDate: '', file: '' },
    { company: '', department: '', position: '', startDate: '', endDate: '', file: '' },
    { company: '', department: '', position: '', startDate: '', endDate: '', file: '' },
  ]);

  // 해외 거주 경험 데이터
  const [overseas, setOverseas] = useState([
    { location: '', reason: '', startDate: '', endDate: '' },
    { location: '', reason: '', startDate: '', endDate: '' },
    { location: '', reason: '', startDate: '', endDate: '' },
  ]);

  // 저서 및 역서 데이터
  const [books, setBooks] = useState([
    { title: '', publisher: '', date: '', file: '' },
    { title: '', publisher: '', date: '', file: '' },
    { title: '', publisher: '', date: '', file: '' },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Q 검색"
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">관리자</div>
            <button className="text-sm text-gray-600 hover:text-gray-900">로그아웃</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              저장
            </button>
          </div>
        </div>
        <div className="max-w-[1600px] mx-auto px-6 py-2 border-t border-gray-200">
          <div className="text-sm text-gray-500">홈 &gt; 회원관리 &gt; 화면관리 상세</div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">전문가 관리</h1>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 전문가 정보 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 전문가 정보 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">전문가 정보</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 기본 정보 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">전문가 관리 번호</label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm">
                      자동 생성
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">사이트 구분</label>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
                      메타시험
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">회원 유형</label>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm">
                      정식 회원
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">구독 상태</label>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm">
                      Premium
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                    <input
                      type="text"
                      defaultValue="홍길동"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">나이</label>
                    <input
                      type="number"
                      defaultValue="30"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">생년월일</label>
                    <input
                      type="text"
                      placeholder="YYYY.MM.DD"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">성별</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input type="radio" name="gender" value="남" defaultChecked className="border-gray-300" />
                        <span className="text-sm">남</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="gender" value="여" className="border-gray-300" />
                        <span className="text-sm">여</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* 연락처 정보 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">휴대폰</label>
                    <input
                      type="text"
                      defaultValue="01012345678"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">비상 연락처</label>
                    <input
                      type="text"
                      defaultValue="01012345678"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                    <input
                      type="email"
                      defaultValue="abcd@gmail.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">본인인증 - 휴대폰</label>
                    <input
                      type="text"
                      placeholder=""
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">국적</label>
                    <input
                      type="text"
                      defaultValue="대한민국"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
                    <input
                      type="text"
                      defaultValue="서울시 무슨구 무슨동"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">상세주소</label>
                    <input
                      type="text"
                      defaultValue="0000빌딩 000호"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* 가입 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">가입일</label>
                  <input
                    type="text"
                    placeholder="YYYY.MM.DD"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">가입채널</label>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">●</span>
                    <span className="text-sm">카카오</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">최초접근기기</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm">
                    모바일
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">최근 로그인</label>
                  <input
                    type="text"
                    placeholder="YYYY.MM.DD"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">체류시간</label>
                  <input
                    type="text"
                    placeholder="hh:mm:ss"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">사진</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm">
                    모바일
                  </div>
                </div>
              </div>

              {/* 알림 설정 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">알림 설정</label>
                  <div className="flex gap-4">
                    {['문자', '카카오톡', '이메일'].map((notif) => (
                      <label key={notif} className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                        <span className="text-sm">{notif}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">마케팅 알림 설정</label>
                  <div className="flex gap-4">
                    {['문자', '카카오톡', '이메일'].map((notif) => (
                      <label key={notif} className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                        <span className="text-sm">{notif}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* 이력서 및 승인 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이력서</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">filename.docx</span>
                    <button className="text-blue-600 text-sm hover:underline">다운로드</button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">전문가 승인 상태</label>
                  <select
                    value={expertStatus}
                    onChange={(e) => setExpertStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>전문가 승인</option>
                    <option>승인 대기</option>
                    <option>승인 거부</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">승인일</label>
                  <input
                    type="text"
                    placeholder="YY.MM.DD.DOW"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">우선 순위</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">전문가 레벨</label>
                  <select
                    value={expertLevel}
                    onChange={(e) => setExpertLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>A</option>
                    <option>B</option>
                    <option>C</option>
                  </select>
                </div>
              </div>

              {/* 성과 지표 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 pt-6 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">평점</label>
                  <div className="text-lg font-semibold text-gray-900">4.5</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">리뷰</label>
                  <div className="text-lg font-semibold text-gray-900">10</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">활동 횟수</label>
                  <div className="text-lg font-semibold text-gray-900">10</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">매칭 거절</label>
                  <div className="text-lg font-semibold text-gray-900">1</div>
                </div>
              </div>
            </div>

            {/* 카테고리 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">카테고리</h2>
              <div className="space-y-4">
                {categories.map((category, idx) => (
                  <div key={idx} className="grid grid-cols-4 gap-4">
                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>카테고리 대</option>
                    </select>
                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>카테고리 중</option>
                    </select>
                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>카테고리 소</option>
                    </select>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">filename.gif</span>
                      <button className="text-blue-600 text-sm hover:underline">파일</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 서비스 가능 유형 & 시간 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">서비스 가능 유형 & 서비스 가능 시간</h2>
              <div className="space-y-4">
                {services.map((service, idx) => (
                  <div key={idx} className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={service.type}
                        onChange={(e) => {
                          const newServices = [...services];
                          newServices[idx].type = e.target.checked;
                          setServices(newServices);
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">문서 작성</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={service.time}
                        onChange={(e) => {
                          const newServices = [...services];
                          newServices[idx].time = e.target.checked;
                          setServices(newServices);
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">언제든지</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* 학력 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">학력</h2>
              <div className="space-y-4">
                {educations.map((edu, idx) => (
                  <div key={idx} className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <input
                      type="text"
                      placeholder="학교명"
                      value={edu.school}
                      onChange={(e) => {
                        const newEdu = [...educations];
                        newEdu[idx].school = e.target.value;
                        setEducations(newEdu);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="학부/학과"
                      value={edu.major}
                      onChange={(e) => {
                        const newEdu = [...educations];
                        newEdu[idx].major = e.target.value;
                        setEducations(newEdu);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="YYYY.MM.DD"
                      value={edu.startDate}
                      onChange={(e) => {
                        const newEdu = [...educations];
                        newEdu[idx].startDate = e.target.value;
                        setEducations(newEdu);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="YYYY.MM.DD"
                      value={edu.endDate}
                      onChange={(e) => {
                        const newEdu = [...educations];
                        newEdu[idx].endDate = e.target.value;
                        setEducations(newEdu);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex items-center gap-2">
                      <select
                        value={edu.graduation}
                        onChange={(e) => {
                          const newEdu = [...educations];
                          newEdu[idx].graduation = e.target.value;
                          setEducations(newEdu);
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option>졸업 예정</option>
                        <option>졸업</option>
                        <option>중퇴</option>
                      </select>
                      <span className="text-sm text-gray-600">filename.gif</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 경력 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">경력</h2>
              <div className="space-y-4">
                {careers.map((career, idx) => (
                  <div key={idx} className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    <input
                      type="text"
                      placeholder="회사명"
                      value={career.company}
                      onChange={(e) => {
                        const newCareer = [...careers];
                        newCareer[idx].company = e.target.value;
                        setCareers(newCareer);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="부서"
                      value={career.department}
                      onChange={(e) => {
                        const newCareer = [...careers];
                        newCareer[idx].department = e.target.value;
                        setCareers(newCareer);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="직위"
                      value={career.position}
                      onChange={(e) => {
                        const newCareer = [...careers];
                        newCareer[idx].position = e.target.value;
                        setCareers(newCareer);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="YYYY.MM.DD"
                      value={career.startDate}
                      onChange={(e) => {
                        const newCareer = [...careers];
                        newCareer[idx].startDate = e.target.value;
                        setCareers(newCareer);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="YYYY.MM.DD"
                      value={career.endDate}
                      onChange={(e) => {
                        const newCareer = [...careers];
                        newCareer[idx].endDate = e.target.value;
                        setCareers(newCareer);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">filename.gif</span>
                      <button className="text-blue-600 text-sm hover:underline">파일</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 해외 거주 경험 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">해외 거주 경험</h2>
              <div className="space-y-4">
                {overseas.map((oversea, idx) => (
                  <div key={idx} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <input
                      type="text"
                      placeholder="해외 거주지"
                      value={oversea.location}
                      onChange={(e) => {
                        const newOverseas = [...overseas];
                        newOverseas[idx].location = e.target.value;
                        setOverseas(newOverseas);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="거주 이유"
                      value={oversea.reason}
                      onChange={(e) => {
                        const newOverseas = [...overseas];
                        newOverseas[idx].reason = e.target.value;
                        setOverseas(newOverseas);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="YYYY.MM.DD"
                      value={oversea.startDate}
                      onChange={(e) => {
                        const newOverseas = [...overseas];
                        newOverseas[idx].startDate = e.target.value;
                        setOverseas(newOverseas);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="YYYY.MM.DD"
                      value={oversea.endDate}
                      onChange={(e) => {
                        const newOverseas = [...overseas];
                        newOverseas[idx].endDate = e.target.value;
                        setOverseas(newOverseas);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 저서 및 역서 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">저서 및 역서</h2>
              <div className="space-y-4">
                {books.map((book, idx) => (
                  <div key={idx} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <input
                      type="text"
                      placeholder="저서명"
                      value={book.title}
                      onChange={(e) => {
                        const newBooks = [...books];
                        newBooks[idx].title = e.target.value;
                        setBooks(newBooks);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="출판사"
                      value={book.publisher}
                      onChange={(e) => {
                        const newBooks = [...books];
                        newBooks[idx].publisher = e.target.value;
                        setBooks(newBooks);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="YYYY.MM.DD"
                      value={book.date}
                      onChange={(e) => {
                        const newBooks = [...books];
                        newBooks[idx].date = e.target.value;
                        setBooks(newBooks);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">filename.gif</span>
                      <button className="text-blue-600 text-sm hover:underline">파일</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 정산 정보 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">정산 정보</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">환불 관리 번호</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">환불 요청일</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">환불 상태</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">환불 요청 금액</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">환불 금액</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">환불 방법</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">환불 계좌 정보</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-3 text-gray-600">자동 생성</td>
                      <td className="px-4 py-3 text-gray-600">YY.MM.DD.DOW</td>
                      <td className="px-4 py-3">
                        <select
                          value={refundStatus}
                          onChange={(e) => setRefundStatus(e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option>환불 요청</option>
                          <option>환불 완료</option>
                          <option>환불 거부</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-gray-600">100,000</td>
                      <td className="px-4 py-3 font-semibold text-red-600">90,000</td>
                      <td className="px-4 py-3 text-gray-600">계좌 입금</td>
                      <td className="px-4 py-3 text-gray-600">00은행 XXXXXX-XXX-XXXXXX 홍길동</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - 매칭 정보 */}
          <div className="space-y-6">
            {/* 매칭 정보 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">매칭 정보</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">매칭 관리 번호</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm">
                    자동 생성
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">매칭요청일</label>
                  <input
                    type="text"
                    placeholder="YYYY.MM.DD"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">매칭완료일</label>
                  <input
                    type="text"
                    placeholder="YYYY.MM.DD"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">완료희망일</label>
                  <input
                    type="text"
                    placeholder="YY.MM.DD.DOW"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">서비스 완료일</label>
                  <input
                    type="text"
                    placeholder="YY.MM.DD.DOW"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">매칭 상태</label>
                  <select
                    value={matchingStatus}
                    onChange={(e) => setMatchingStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>매칭요청</option>
                    <option>매칭중</option>
                    <option>매칭완료</option>
                    <option>매칭취소</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">매칭방법</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="matchingMethod" value="대면" defaultChecked className="border-gray-300" />
                      <span className="text-sm">대면</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">서비스 유형</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>문서작성</option>
                    <option>번역</option>
                    <option>기타</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">서비스 방법</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>카톡아이디</option>
                    <option>이메일</option>
                    <option>전화</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">채팅</label>
                  <input
                    type="text"
                    defaultValue="XXXXXXXXXXXX"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">활동요청시간</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm">
                    언제든지
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">긴급 여부</label>
                  <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm">
                    긴급
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">지역</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm">
                    대한민국 서울
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">작업분량</label>
                  <input
                    type="text"
                    defaultValue="100,000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">단위</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>글자수</option>
                    <option>단어수</option>
                    <option>페이지</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">완료파일</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">filename.docx</span>
                    <button className="text-blue-600 text-sm hover:underline">다운로드</button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">희망금액</label>
                  <input
                    type="text"
                    defaultValue="100,000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">작업 소요 시간</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm">
                    시험 완료
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">최종 금액</label>
                  <input
                    type="text"
                    defaultValue="200,000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">요청 사항</label>
                  <textarea
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="입력한 텍스트가 모두 표시되는 영역입니다."
                  />
                </div>
              </div>
            </div>

            {/* 관리자 메모 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">관리자 메모</h2>
              <textarea
                rows={8}
                value={adminMemo}
                onChange={(e) => setAdminMemo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="메모 입력"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
