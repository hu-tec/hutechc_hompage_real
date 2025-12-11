'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminTranslatorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { name: '현재 번역사 리스트', href: '/admin/translators' },
    { name: '번역사 프로필 요청 리스트', href: '/admin/translators/profile-requests' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 헤더 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold">관리자 대시보드</div>
        </div>
      </header>

      {/* 본문 영역: 왼쪽 사이드바 + 오른쪽 컨텐츠 */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-6">
        {/* 왼쪽 사이드바 */}
        <aside className="w-64 bg-white border border-gray-200 rounded-lg p-4 h-fit">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">번역사 관리</h2>
          <nav>
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                        isActive
                          ? 'bg-purple-50 text-purple-700 font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* 오른쪽 컨텐츠 */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
