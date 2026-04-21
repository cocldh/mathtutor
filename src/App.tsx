// 루트 컴포넌트: 전체 상태 관리 및 화면 분기
import { useState } from 'react';
import type { ExamConfig } from './types/exam';
import { useExamGenerator } from './hooks/useExamGenerator';
import { SettingsPanel } from './components/SettingsPanel';
import { ExamSheet } from './components/ExamSheet';

export default function App() {
  // 시험지 설정 (기본값: 3학년 / 중 / 10문제)
  const [examConfig, setExamConfig] = useState<ExamConfig>({
    grade: 3,
    difficulty: '중',
    count: 10,
  });

  // 교사 모드 (정답/해설 표시 여부)
  const [teacherMode, setTeacherMode] = useState(false);

  // 시험지 생성 훅
  const { result, isLoading, error, generateExam, reset } = useExamGenerator();

  // 시험지 생성 버튼 클릭 시
  const handleGenerate = async () => {
    await generateExam(examConfig);
  };

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-4">
      {result ? (
        <ExamSheet
          result={result}
          teacherMode={teacherMode}
          onReset={reset}
        />
      ) : (
        <SettingsPanel
          config={examConfig}
          onConfigChange={setExamConfig}
          teacherMode={teacherMode}
          onTeacherModeChange={setTeacherMode}
          onGenerate={handleGenerate}
          isLoading={isLoading}
          error={error}
        />
      )}
    </div>
  );
}
