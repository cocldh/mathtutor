// Claude API 에 전달할 시스템/유저 프롬프트를 생성하는 유틸
import type { ExamConfig, Difficulty } from '../types/exam';

// 시스템 프롬프트: Claude 가 JSON 만 반환하도록 엄격하게 지시
export const SYSTEM_PROMPT = `당신은 초등학교 사고력 수학 전문 출제위원입니다.
주어진 조건에 맞는 문제를 반드시 아래 JSON 형식으로만 반환하세요.
JSON 외의 텍스트(인삿말, 설명, 마크다운 코드블록 등)를 절대 포함하지 마세요.

반환 형식:
{
  "problems": [
    {
      "id": 1,
      "type": "패턴추론 | 논리추론 | 공간감각 | 연산응용 | 창의서술 중 하나",
      "question": "문제 내용 (구체적이고 명확하게)",
      "choices": ["① 보기1", "② 보기2", "③ 보기3", "④ 보기4"] 또는 null,
      "answer": "정답",
      "explanation": "단계별 풀이 과정과 핵심 사고법 (2~4문장)",
      "difficulty_note": "이 문제에서 요구되는 핵심 사고력 한 줄 설명"
    }
  ]
}`;

// 난이도별 세부 지침
const DIFFICULTY_GUIDE: Record<Difficulty, string> = {
  '하': '1단계 사고만 필요하며, 힌트가 문제 안에 자연스럽게 내포되어 있어야 합니다.',
  '중': '2단계 사고가 필요하며, 주어진 조건을 분석해야 해결할 수 있어야 합니다.',
  '상': '2~3단계 사고가 필요하며, 역발상 또는 복합 조건을 포함해야 합니다.',
  '최상': '3단계 이상의 사고가 필요하며, 다중 조건과 창의적 접근이 동시에 요구되어야 합니다.',
};

// 사용자 프롬프트 생성 함수
export function buildUserPrompt(config: ExamConfig): string {
  const { grade, difficulty, count } = config;
  const difficultyGuide = DIFFICULTY_GUIDE[difficulty];

  // 객관식/서술형 비율 7:3 계산
  const choiceCount = Math.round(count * 0.7);
  const openCount = count - choiceCount;

  return `초등학교 ${grade}학년 학생을 위한 사고력 수학 문제 ${count}개를 출제해주세요.

[난이도 조건]
- 난이도: ${difficulty}
- ${difficultyGuide}

[출제 조건]
1. 단순 사칙연산 문제는 절대 출제하지 마세요. 오직 사고력 수학 유형으로만 출제하세요.
2. 객관식(choices 있음) ${choiceCount}문제, 단답형/서술형(choices: null) ${openCount}문제 비율로 출제하세요.
3. 문제 유형(패턴추론, 논리추론, 공간감각, 연산응용, 창의서술) 중 최소 3가지 이상을 혼합하세요.
4. 각 문제는 서로 다른 소재를 사용해야 하며 소재가 중복되면 안 됩니다.
5. ${grade}학년 교육과정 수준에 맞는 소재를 사용하세요.
6. id 는 1부터 ${count}까지 순서대로 부여하세요.
7. 모든 문제는 ${difficulty} 난이도 기준을 엄격히 지켜 변별력이 있어야 합니다.

반드시 지정된 JSON 형식으로만 응답하세요.`;
}
