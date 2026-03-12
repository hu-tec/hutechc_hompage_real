'use client';

import Link from 'next/link';

type CardProps = {
  href: string;
  icon: string;
  title: string;
  description: string;
  badge?: string;
};

function Card({ href, icon, title, description, badge }: CardProps) {
  return (
    <Link href={href} className="block">
      <div className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="flex items-start justify-between gap-3">
          <div className="text-4xl">{icon}</div>
          {badge ? (
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
              {badge}
            </span>
          ) : null}
        </div>
        <h2 className="text-xl font-bold text-gray-900 mt-3 mb-2">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </Link>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold">통합 플랫폼 관리자</div>
          <div className="text-sm text-gray-500">필수 운영 항목이 먼저 보이도록 정리된 홈</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">플랫폼 홈</h1>
          <p className="text-gray-600">
            사이트(테넌트)를 생성하고, 모듈/플러그인을 조합해서 플랫폼 기능을 확장합니다.
          </p>
        </div>

        {/* 필수: 통합 플랫폼에서 항상 보여야 하는 운영 진입점 */}
        <section className="mb-10">
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">필수</h2>
            <p className="text-sm text-gray-500">
              멀티테넌트 / 모듈 / 플러그인 / 권한(역할) 기반 운영
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card
              href="/admin/sites"
              icon="🏢"
              title="사이트(테넌트) 관리"
              description="사이트 목록, 상태(활성/정지), 도메인 등 기본 운영"
              badge="필수"
            />
            <Card
              href="/admin/sites/new"
              icon="🧙"
              title="사이트 추가(마법사)"
              description="사이트 타입 선택 → 모듈/플러그인 프리셋 적용 → 초기 관리자 생성"
              badge="필수"
            />
            <Card
              href="/admin/modules"
              icon="🧩"
              title="모듈 관리"
              description="A~E 모듈 카탈로그/정책 관리 및 사이트별 활성화(연동 예정)"
              badge="필수"
            />
            <Card
              href="/admin/plugins"
              icon="🔌"
              title="플러그인 관리"
              description="추천 플러그인(F~I) 관리 및 사이트별 적용(연동 예정)"
              badge="필수"
            />
            <Card
              href="/admin/roles"
              icon="🔐"
              title="권한/역할(관리자)"
              description="플랫폼 운영자 계정 및 역할/권한 템플릿(연동 예정)"
              badge="필수"
            />
          </div>
        </section>

        {/* 현재 구현된 기능 / 도메인 운영 기능 */}
        <section>
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">운영 도구</h2>
            <p className="text-sm text-gray-500">현재 레포에 구현돼 있는 기능 진입점</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card
              href="/admin/pricing"
              icon="💰"
              title="가격 및 요금"
              description="번역 서비스 가격 및 할인율 설정"
            />
            <Card
              href="/admin/translators"
              icon="👥"
              title="번역사 관리"
              description="번역사 정보 및 평점 관리"
            />
            <Card
              href="/admin/exams"
              icon="📝"
              title="시험 관리"
              description="시험 템플릿, 일정, 출제자 배정 및 응시 현황 관리"
            />
            <Card
              href="/admin/exams/status"
              icon="✏️"
              title="출제 현황"
              description="출제자에게 배정된 시험과 출제 진행 상태를 확인합니다"
            />
            <Card
              href="/admin/ui"
              icon="🎨"
              title="사용자 UI 관리"
              description="시험·번역 서비스의 사용자별 화면 구성을 관리합니다"
            />
            <Card
              href="/admin/payment-guide"
              icon="🧾"
              title="결제 가이드"
              description="결제/요금 관련 안내 페이지"
            />
            <Card
              href="/admin/members"
              icon="👤"
              title="회원관리"
              description="플랫폼 회원 정보 조회 및 관리"
            />
            <Card
              href="/admin/admins"
              icon="🔑"
              title="관리자 관리"
              description="관리자 계정 생성, 수정 및 권한 관리"
            />
            <Card
              href="/admin/experts"
              icon="🎓"
              title="전문가관리"
              description="전문가 정보 및 자격 관리"
            />
            <Card
              href="/admin/market"
              icon="🛒"
              title="마켓관리"
              description="창작물·활동·정산 정보 및 회원 마켓 관리"
            />
            <Card
              href="/admin/quote"
              icon="📄"
              title="견적서 관리"
              description="견적 정보·내용·조건 및 회원 기본정보 관리"
            />
            <Card
              href="/admin/grading"
              icon="✅"
              title="채점관리"
              description="시험 채점 현황 및 채점자 관리"
            />
            <Card
              href="/admin/prompt-rules"
              icon="📋"
              title="프롬프트 규정 설정"
              description="프롬프트 번역 규정 관리 및 설정"
            />
          </div>
        </section>

        {/* 데이터 관리 */}
        <section className="mt-10">
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">데이터 관리</h2>
            <p className="text-sm text-gray-500">플랫폼 데이터 조회·백업·이관 등</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card
              href="/admin/data"
              icon="🗄️"
              title="데이터 관리"
              description="데이터 조회, 백업, 이관 및 관리"
            />
            <Card
              href="/admin/settings"
              icon="⚙️"
              title="페이지별 설정관리"
              description="공통 데이터 설정 및 페이지별 UI/정책 설정"
              badge="확장"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
