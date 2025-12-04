'use client';

import { useState } from 'react';

type TranslatorLevel = 'new' | 'C' | 'B' | 'A' | 'native';

const LEVEL_INFO: Record<TranslatorLevel, { label: string; desc: string; bonus: string }> = {
  new: { label: '신입', desc: '시험 60점 이상', bonus: '+0%' },
  C: { label: 'C등급', desc: '1년+ 경력, 70점 이상', bonus: '+10%' },
  B: { label: 'B등급', desc: '3년+ 경력, 80점 이상', bonus: '+25%' },
  A: { label: 'A등급', desc: '5년+ 경력, 90점 이상', bonus: '+40%' },
  native: { label: '원어민', desc: '원어민 번역가', bonus: '+50%' },
};

interface TranslatorProfile {
  name: string;
  email: string;
  phone: string;
  bio: string;
  languages: string[];
  requestedLevel: TranslatorLevel;
  currentLevel?: TranslatorLevel;
  approvalStatus: 'pending' | 'approved' | 'rejected'; // pending: 승인대기, approved: 승인됨
  certificates: string[];
  rating: number;
  totalCompleted: number;
}

export default function TranslatorProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<TranslatorProfile>({
    name: '김번역',
    email: 'kim@example.com',
    phone: '010-1234-5678',
    bio: '법률 및 기술 분야 전문 번역가입니다.',
    languages: ['한국어', '영어', '일어'],
    requestedLevel: 'A',
    currentLevel: 'B',
    approvalStatus: 'pending',
    certificates: [],
    rating: 4.9,
    totalCompleted: 128,
  });

  const [tempProfile, setTempProfile] = useState(profile);

  const handleLevelChange = (level: TranslatorLevel) => {
    setTempProfile({ ...tempProfile, requestedLevel: level });
  };

  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // 실제로는 파일 업로드 처리 필요
    setTempProfile({
      ...tempProfile,
      certificates: [...tempProfile.certificates, ...files.map((f) => f.name)],
    });
  };

  const handleSave = () => {
    setProfile(tempProfile);
    setIsEditing(false);
    // 실제로는 서버 저장 필요
    alert('프로필이 저장되었습니다. 관리자 승인을 기다려주세요.');
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-gray-900">내 프로필</h1>
          <button
            onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
            className={`px-6 py-2 rounded-md font-semibold transition-colors ${
              isEditing
                ? 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isEditing ? '취소' : '프로필 수정'}
          </button>
        </div>
        <p className="text-gray-600">번역사 정보를 관리하세요</p>
      </div>

      {/* 기본 정보 카드 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">기본 정보</h2>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
            {isEditing ? (
              <input
                type="text"
                value={tempProfile.name}
                onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <div className="text-gray-900">{profile.name}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
            <div className="text-gray-900">{profile.email}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
            {isEditing ? (
              <input
                type="text"
                value={tempProfile.phone}
                onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <div className="text-gray-900">{profile.phone}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">보유 언어</label>
            <div className="text-gray-900">{profile.languages.join(', ')}</div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">자기소개</label>
          {isEditing ? (
            <textarea
              value={tempProfile.bio}
              onChange={(e) => setTempProfile({ ...tempProfile, bio: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          ) : (
            <div className="text-gray-900">{profile.bio}</div>
          )}
        </div>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
          <div className="text-sm text-gray-600 mb-1">평점</div>
          <div className="text-3xl font-bold text-blue-600">⭐ {profile.rating}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-6">
          <div className="text-sm text-gray-600 mb-1">완료한 번역</div>
          <div className="text-3xl font-bold text-green-600">{profile.totalCompleted}건</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-6">
          <div className="text-sm text-gray-600 mb-1">현재 등급</div>
          <div className="text-2xl font-bold text-purple-600">
            {profile.currentLevel ? LEVEL_INFO[profile.currentLevel].label : '미설정'}
          </div>
        </div>
      </div>

      {/* 등급 설정 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">등급 신청</h2>
          {profile.approvalStatus === 'pending' && (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-semibold rounded-full">
              승인 대기 중
            </span>
          )}
          {profile.approvalStatus === 'approved' && (
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
              승인됨
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-6">희망하는 등급을 선택하세요. 선택 후 증명서를 제출하면 관리자가 검토합니다.</p>

        <div className="grid grid-cols-5 gap-3 mb-6">
          {(Object.entries(LEVEL_INFO) as [TranslatorLevel, any][]).map(([key, info]) => (
            <button
              key={key}
              onClick={() => handleLevelChange(key)}
              disabled={!isEditing}
              className={`p-3 border-2 rounded-lg transition-all ${
                tempProfile.requestedLevel === key
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="font-semibold text-sm mb-1">{info.label}</div>
              <div className="text-xs text-gray-600 mb-1">{info.desc}</div>
              <div className="text-xs font-semibold text-indigo-600">{info.bonus}</div>
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-500 mb-4">
          등급별 기준: {(Object.entries(LEVEL_INFO) as [TranslatorLevel, any][])
            .map(([, info]) => info.desc)
            .join(' | ')}
        </p>
      </div>

      {/* 증명서 업로드 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">증명서 업로드</h2>

        <p className="text-sm text-gray-600 mb-4">
          신청하신 등급을 증명할 수 있는 증명서(학위증, 자격증, 경력증명서 등)를 업로드하세요.
        </p>

        {isEditing ? (
          <div className="mb-6">
            <label className="block">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 cursor-pointer transition-colors">
                <div className="text-2xl mb-2">📄</div>
                <div className="text-sm font-medium text-gray-700 mb-1">파일을 여기에 드래그하거나 클릭</div>
                <div className="text-xs text-gray-500">PDF, JPG, PNG (최대 5MB)</div>
              </div>
              <input
                type="file"
                multiple
                onChange={handleCertificateUpload}
                className="hidden"
                accept=".pdf,.jpg,.png"
              />
            </label>
          </div>
        ) : null}

        {tempProfile.certificates.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700 mb-3">업로드된 파일:</p>
            {tempProfile.certificates.map((cert, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span>📄</span>
                <span className="text-sm text-gray-700">{cert}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 저장 버튼 */}
      {isEditing && (
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md font-semibold hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700"
          >
            저장 및 제출
          </button>
        </div>
      )}
    </div>
  );
}
