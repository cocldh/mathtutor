// 사고력 수학 시험 관련 타입 정의 모음

// 학년 (1~6학년)
export type Grade = 1 | 2 | 3 | 4 | 5 | 6;

// 난이도 단계
export type Difficulty = '하' | '중' | '상' | '최상';

// 한 회 시험당 문제 수
export type ProblemCount = 5 | 10 | 15 | 20;

// 사고력 수학 문제 유형
export type ProblemType =
  | '패턴추론'
  | '논리추론'
  | '공간감각'
  | '연산응용'
  | '창의서술';

// 개별 문제 인터페이스
export interface Problem {
  id: number;
  type: ProblemType;
  question: string;
  // 객관식이면 보기 4개, 서술/단답형이면 null
  choices: string[] | null;
  answer: string;
  explanation: string;
  difficulty_note: string;
}

// 시험지 생성 시 사용자가 선택한 설정
export interface ExamConfig {
  grade: Grade;
  difficulty: Difficulty;
  count: ProblemCount;
}

// 생성된 시험지 결과
export interface ExamResult {
  config: ExamConfig;
  problems: Problem[];
  generatedAt: Date;
}
