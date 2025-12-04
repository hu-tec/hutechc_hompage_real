import Link from "next/link";

export default function ExhibitionListPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10 text-xs md:text-sm">
      <header className="space-y-2">
        <p className="text-[11px] text-gray-500">홈 &gt; 스마트 가이드 &gt; 전시/가이드</p>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
          당신이 발견하지 못한 감동, 스마트 가이드가 열어 드립니다
        </h1>
        <p className="text-gray-600">
          전문 도슨트의 해설을 통해 작품과 유물 속 숨겨진 이야기를 발견해 보세요.
        </p>
      </header>

      {/* filter bar (간단 버전) */}
      <section className="bg-white border rounded-lg px-4 py-3 flex flex-wrap gap-3 items-center text-[11px]">
        <div className="flex items-center gap-2">
          <span className="font-medium">지역</span>
          <select className="border rounded px-2 py-1">
            <option>전국</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">일정</span>
          <input className="border rounded px-2 py-1 w-28" placeholder="YY.MM.DD" />
          <span>~</span>
          <input className="border rounded px-2 py-1 w-28" placeholder="YY.MM.DD" />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">유형</span>
          <select className="border rounded px-2 py-1">
            <option>박물관</option>
          </select>
        </div>
        <button className="ml-auto border rounded px-3 py-1 text-[11px] bg-gray-900 text-white">
          검색하기
        </button>
      </section>

      {/* Section: 유물 속 숨겨진 이야기 */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <span className="text-lg">💬</span>
          <span>유물 속 숨겨진 이야기 - 추천 벚꽃 핫 문화 예술속으로</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 인기 핫 테마 카드 2개 */}
          {Array.from({ length: 2 }).map((_, idx) => (
            <div
              key={idx}
              className="border rounded-lg bg-white h-44 flex flex-col justify-between p-3"
            >
              <div className="text-gray-400 text-xs flex-1 flex items-center justify-center">
                인기 핫 테마 카드 영역
              </div>
              <div className="flex justify-between items-center text-[11px] text-gray-600">
                <span>제목입니다. 제목입니다. 제목입니다...</span>
                <span>10,000원</span>
              </div>
            </div>
          ))}

          {/* 최신순 리스트 */}
          <div className="border rounded-lg bg-white overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b text-[11px] bg-gray-50">
              <span>최신순</span>
              <button className="text-gray-500">전체 보기 &gt;</button>
            </div>
            <ul className="divide-y">
              {Array.from({ length: 5 }).map((_, idx) => (
                <li key={idx} className="flex items-center justify-between px-3 py-2 hover:bg-gray-50">
                  <div className="space-y-0.5">
                    <p className="text-[11px] text-gray-500">카테고리 &gt; 카테고리 중 &gt; 카테고리 소</p>
                    <p className="text-xs text-gray-800 truncate">제목이 표시되는 영역입니다. 제목이 표시되는...</p>
                  </div>
                  <span className="text-[11px] text-gray-700">10,000</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Another block: 연인과 함께, 50대들 추천 등은 간단한 텍스트 리스트로 표현 */}
      <section className="space-y-6">
        {["연인과 함께 문화 예술 속으로", "50(?)대들을 위한 인생 문화 예술속으로", "죽기전에 가야할 문화 예술속으로", "인기 1-10위 문화 예술속으로"].map(
          (title) => (
            <div key={title} className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <span className="text-lg">💬</span>
                <span>{title}</span>
              </div>
              <ul className="bg-white border rounded-lg divide-y">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <li key={idx} className="flex items-center justify-between px-3 py-2 hover:bg-gray-50">
                    <span className="text-xs text-gray-800 truncate">제목이 표시되는 영역입니다. 제목이 표시되는 영역입니다...</span>
                    <span className="text-[11px] text-gray-700">300</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        )}
      </section>

      <div className="pt-6 border-t flex justify-end gap-3 text-xs">
        <Link href="/exhibition/upload" className="border rounded px-4 py-1 hover:bg-gray-50">
          도슨트 만들기
        </Link>
        <Link href="/exhibition/museum" className="border rounded px-4 py-1 hover:bg-gray-50">
          박물관 템플릿
        </Link>
        <Link href="/exhibition/write" className="border rounded px-4 py-1 hover:bg-gray-50">
          작성하기 화면
        </Link>
      </div>
    </div>
  );
}
