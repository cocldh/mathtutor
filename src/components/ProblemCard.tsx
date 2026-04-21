// 개별 문제 카드 컴포넌트
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Problem, ProblemType } from '../types/exam';

interface ProblemCardProps {
  problem: Problem;
  showAnswer: boolean; // 교사 모드 ON 이면 true
  index: number;
}

// 문제 유형별 뱃지 색상
const TYPE_COLORS: Record<ProblemType, string> = {
  '패턴추론': 'bg-purple-100 text-purple-700',
  '논리추론': 'bg-blue-100 text-blue-700',
  '공간감각': 'bg-pink-100 text-pink-700',
  '연산응용': 'bg-amber-100 text-amber-700',
  '창의서술': 'bg-emerald-100 text-emerald-700',
};

export function ProblemCard({ problem, showAnswer, index }: ProblemCardProps) {
  // 정답/해설 펼침 여부 (기본 펼침)
  const [expanded, setExpanded] = useState(true);

  const isMultipleChoice = Array.isArray(problem.choices);
  const typeColor =
    TYPE_COLORS[problem.type] ?? 'bg-gray-100 text-gray-600';

  return (
    <article className="border-b border-gray-200 py-6 last:border-b-0">
      {/* 문제 헤더: 번호 + 유형 뱃지 */}
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl font-bold text-indigo-600 flex-shrink-0 w-10">
          {index + 1}.
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-semibold ${typeColor}`}
            >
              {problem.type}
            </span>
          </div>
          <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">
            {problem.question}
          </p>
        </div>
      </div>

      {/* 보기 or 답안 작성란 */}
      <div className="ml-10">
        {isMultipleChoice && problem.choices ? (
          <ul className="space-y-2 mt-3">
            {problem.choices.map((choice, idx) => (
              <li
                key={idx}
                className="text-gray-700 py-2 px-3 bg-gray-50 rounded-lg"
              >
                {choice}
              </li>
            ))}
          </ul>
        ) : (
          <div
            className="mt-3 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50"
            style={{ height: '80px' }}
            aria-label="답안 작성 영역"
          />
        )}
      </div>

      {/* 교사 모드: 정답/해설 접힘 토글 */}
      {showAnswer && (
        <div className="mt-4 ml-10 teacher-only">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="no-print flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800 mb-2"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4" /> 정답/해설 접기
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" /> 정답/해설 펼치기
              </>
            )}
          </button>
          {expanded && (
            <div className="bg-indigo-50 rounded-lg p-4 space-y-2">
              <div>
                <span className="font-bold text-indigo-700">정답: </span>
                <span className="text-gray-800">{problem.answer}</span>
              </div>
              <div>
                <span className="font-bold text-indigo-700">해설: </span>
                <span className="text-gray-700 whitespace-pre-wrap">
                  {problem.explanation}
                </span>
              </div>
              {problem.difficulty_note && (
                <div className="pt-2 border-t border-indigo-200">
                  <span className="text-xs font-semibold text-indigo-600">
                    ✨ 핵심 사고력:{' '}
                  </span>
                  <span className="text-xs text-gray-600">
                    {problem.difficulty_note}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
