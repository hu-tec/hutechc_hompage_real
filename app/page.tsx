import Link from 'next/link';
import { cookies } from 'next/headers';

export default async function HomePage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('tp_admin')?.value === '1';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          {isAdmin ? (
            <>
              <Link
                href="/admin/dashboard"
                className="px-4 py-2 rounded-lg bg-black text-white text-sm"
              >
                관리자 대시보드
              </Link>
              <Link href="/logout" className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm">
                로그아웃
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg bg-black text-white text-sm"
            >
              관리자 로그인
            </Link>
          )}
        </div>

        <h1 className="text-5xl font-bold text-gray-900 mb-4">통합 플랫폼</h1>
        <p className="text-xl text-gray-600 mb-10">시험, 번역, 전시/가이드를 한 곳에서</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Link
            href="/exam"
            className="block p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="text-5xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">시험</h2>
            <p className="text-gray-600">시험 응시 / 출제자 모드 선택</p>
          </Link>

          <Link
            href="/translate"
            className="block p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="text-5xl mb-4">🌐</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">번역 서비스</h2>
            <p className="text-gray-600">번역 의뢰 및 번역가 관리</p>
          </Link>

          <Link
            href="/exhibition"
            className="block p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="text-5xl mb-4">🏛️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">전시 / 스마트 가이드</h2>
            <p className="text-gray-600">박물관·전시 도슨트 & 여행 가이드</p>
          </Link>

          <Link
            href="/question-bank"
            className="block p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="text-5xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">문제은행</h2>
            <p className="text-gray-600">문제 관리 및 출제</p>
          </Link>

          {isAdmin ? (
            <Link
              href="/admin/dashboard"
              className="block p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <div className="text-5xl mb-4">⚙️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">관리자</h2>
              <p className="text-gray-600">시스템 및 서비스 관리</p>
            </Link>
          ) : (
            <Link
              href="/login"
              className="block p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <div className="text-5xl mb-4">🔐</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">관리자 로그인</h2>
              <p className="text-gray-600">로그인 후 관리자 메뉴가 표시됩니다</p>
            </Link>
          )}

          <Link
            href="/payment-guide"
            className="block p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="text-5xl mb-4">💰</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">결제 시스템 안내</h2>
            <p className="text-gray-600">번역 서비스 요금 산정 방식 안내</p>
          </Link>

          <Link
            href="/expert/apply"
            className="block p-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 text-white"
          >
            <div className="text-5xl mb-4">⭐</div>
            <h2 className="text-2xl font-bold mb-2">전문가 신청</h2>
            <p className="text-purple-100">번역 전문가로 등록하고 프로젝트에 참여하세요</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
