import type { Metadata } from "next";
import Link from "next/link";
import "../../globals.css";

export const metadata: Metadata = {
  title: "스마트 가이드 | 전시/가이드 플랫폼",
};

export default function ExhibitionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top navigation */}
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between text-sm">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 font-semibold text-gray-900">
              <span className="w-8 h-8 border rounded flex items-center justify-center text-xs">logo</span>
              <span className="text-base">스마트 가이드</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-gray-700">
              <Link href="/exhibition" className="hover:text-black">스마트 가이드</Link>
              <Link href="/exhibition/upload" className="hover:text-black">도슨트 메이커</Link>
              <button className="cursor-default text-gray-400">메뉴 3</button>
              <button className="cursor-default text-gray-400">메뉴 4</button>
              <button className="cursor-default text-gray-400">메뉴 5</button>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-700">
            <button className="hover:text-black">로그인</button>
            <button className="hover:text-black">회원가입</button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t bg-white text-xs text-gray-500">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>CompanyName © 20XX. All rights reserved.</div>
          <div className="flex gap-4">
            <button>이용약관</button>
            <button>개인정보보호정책</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
