// 학년/난이도/문제수/교사모드 설정 패널
import { Sparkles, Loader2 } from 'lucide-react';
import type {
  ExamConfig,
  Grade,
  Difficulty,
  ProblemCount,
} from '../types/exam';

interface SettingsPanelProps {
  config: ExamConfig;
  onConfigChange: (config: ExamConfig) => void;
  teacherMode: boolean;
  onTeacherModeChange: (value: boolean) => void;
  onGenerate: () => void;
  isLoading: boolean;
  error: string | null;
}

// 학년 후보
const GRADES: Grade[] = [1, 2, 3, 4, 5, 6];
// 난이도 후보
const DIFFICULTIES: Difficulty[] = ['하', '중', '상', '최상'];
// 문제 수 후보
const COUNTS: ProblemCount[] = [5, 10, 15, 20];

// 난이도별 색상 (선택/비선택 상태 모두)
const DIFFICULTY_COLORS: Record<
  Difficulty,
  { active: string; inactive: string; ring: string }
> = {
  '하': {
    active: 'bg-green-500 text-white',
    inactive: 'bg-green-100 text-green-700 hover:bg-green-200',
    ring: 'ring-green-400',
  },
  '중': {
    active: 'bg-blue-500 text-white',
    inactive: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    ring: 'ring-blue-400',
  },
  '상': {
    active: 'bg-orange-500 text-white',
    inactive: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
    ring: 'ring-orange-400',
  },
  '최상': {
    active: 'bg-red-500 text-white',
    inactive: 'bg-red-100 text-red-700 hover:bg-red-200',
    ring: 'ring-red-400',
  },
};

export function SettingsPanel({
  config,
  onConfigChange,
  teacherMode,
  onTeacherModeChange,
  onGenerate,
  isLoading,
  error,
}: SettingsPanelProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg max-w-4xl mx-auto p-8 no-print">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          초등 사고력 수학 시험 출제기
        </h1>
        <p className="text-gray-500">
          AI 가 학년·난이도에 맞는 변별력 있는 문제를 즉시 만들어 드립니다.
        </p>
      </header>

      {/* 학년 선택 */}
      <section className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          학년
        </label>
        <div className="grid grid-cols-6 gap-2">
          {GRADES.map((grade) => {
            const selected = config.grade === grade;
            return (
              <button
                key={grade}
                type="button"
                onClick={() => onConfigChange({ ...config, grade })}
                className={`py-3 rounded-lg font-semibold transition ${
                  selected
                    ? 'bg-indigo-600 text-white ring-2 ring-offset-2 ring-indigo-400'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {grade}학년
              </button>
            );
          })}
        </div>
      </section>

      {/* 난이도 선택 */}
      <section className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          난이도
        </label>
        <div className="grid grid-cols-4 gap-2">
          {DIFFICULTIES.map((level) => {
            const selected = config.difficulty === level;
            const colors = DIFFICULTY_COLORS[level];
            return (
              <button
                key={level}
                type="button"
                onClick={() =>
                  onConfigChange({ ...config, difficulty: level })
                }
                className={`py-3 rounded-lg font-semibold transition ${
                  selected
                    ? `${colors.active} ring-2 ring-offset-2 ${colors.ring}`
                    : colors.inactive
                }`}
              >
                {level}
              </button>
            );
          })}
        </div>
      </section>

      {/* 문제 수 선택 */}
      <section className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          문제 수
        </label>
        <div className="grid grid-cols-4 gap-2">
          {COUNTS.map((count) => {
            const selected = config.count === count;
            return (
              <button
                key={count}
                type="button"
                onClick={() => onConfigChange({ ...config, count })}
                className={`py-3 rounded-lg font-semibold transition ${
                  selected
                    ? 'bg-indigo-600 text-white ring-2 ring-offset-2 ring-indigo-400'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {count}문제
              </button>
            );
          })}
        </div>
      </section>

      {/* 교사 모드 토글 */}
      <section className="mb-8 flex items-center justify-between bg-gray-50 rounded-lg p-4">
        <div>
          <p className="font-semibold text-gray-800">교사 모드</p>
          <p className="text-sm text-gray-500">
            켜면 정답과 해설이 시험지에 함께 표시됩니다.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={teacherMode}
          onClick={() => onTeacherModeChange(!teacherMode)}
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
            teacherMode ? 'bg-indigo-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
              teacherMode ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </section>

      {/* 에러 메시지 */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 font-semibold mb-1">
            오류가 발생했습니다
          </p>
          <p className="text-sm text-red-600 break-words">{error}</p>
        </div>
      )}

      {/* 시험지 생성 버튼 */}
      <button
        type="button"
        onClick={onGenerate}
        disabled={isLoading}
        className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            AI 가 문제를 출제하고 있습니다
            <LoadingDots />
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            시험지 생성
          </>
        )}
      </button>
    </div>
  );
}

// 로딩 중 "..." 애니메이션
function LoadingDots() {
  return (
    <span className="inline-flex w-6">
      <span className="animate-bounce" style={{ animationDelay: '0ms' }}>
        .
      </span>
      <span className="animate-bounce" style={{ animationDelay: '150ms' }}>
        .
      </span>
      <span className="animate-bounce" style={{ animationDelay: '300ms' }}>
        .
      </span>
    </span>
  );
}
