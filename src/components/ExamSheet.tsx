// 시험지 전체를 렌더링하는 컴포넌트
import { Printer, RotateCcw } from 'lucide-react';
import type { ExamResult } from '../types/exam';
import { ProblemCard } from './ProblemCard';

interface ExamSheetProps {
  result: ExamResult;
  teacherMode: boolean;
  onReset: () => void;
}

// 난이도별 표기 색상
const DIFFICULTY_BADGE: Record<string, string> = {
  '하': 'bg-green-100 text-green-700',
  '중': 'bg-blue-100 text-blue-700',
  '상': 'bg-orange-100 text-orange-700',
  '최상': 'bg-red-100 text-red-700',
};

// 날짜 포맷 (YYYY-MM-DD)
function formatDate(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function ExamSheet({ result, teacherMode, onReset }: ExamSheetProps) {
  const { config, problems, generatedAt } = result;
  const badgeColor =
    DIFFICULTY_BADGE[config.difficulty] ?? 'bg-gray-100 text-gray-700';

  return (
    <div className="max-w-4xl mx-auto">
      {/* 상단 액션 버튼 (인쇄 시 숨김) */}
      <div className="flex justify-end gap-2 mb-4 no-print">
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          <Printer className="w-4 h-4" />
          인쇄하기
        </button>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
        >
          <RotateCcw className="w-4 h-4" />
          다시 생성
        </button>
      </div>

      {/* 시험지 본문 */}
      <div className="exam-sheet bg-white rounded-2xl shadow-lg p-10">
        {/* 시험지 헤더 */}
        <header className="border-b-2 border-gray-800 pb-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
            사고력 수학 시험지
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-semibold">
              {config.grade}학년
            </span>
            <span
              className={`px-3 py-1 rounded-full font-semibold ${badgeColor}`}
            >
              난이도 {config.difficulty}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-semibold">
              총 {config.count}문제
            </span>
            <span className="text-gray-500">
              출제일: {formatDate(generatedAt)}
            </span>
          </div>
          {/* 이름/점수 기재란 */}
          <div className="mt-6 flex items-center justify-between text-sm text-gray-700">
            <span>이름: ________________________</span>
            <span>점수: _______ / 100</span>
          </div>
        </header>

        {/* 문제 목록 */}
        <div>
          {problems.map((problem, idx) => (
            <ProblemCard
              key={problem.id ?? idx}
              problem={problem}
              showAnswer={teacherMode}
              index={idx}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
