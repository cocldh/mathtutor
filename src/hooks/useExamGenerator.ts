// Claude API 를 호출하여 시험지를 생성하는 커스텀 훅
import { useState, useCallback } from 'react';
import type { ExamConfig, ExamResult, Problem } from '../types/exam';
import { SYSTEM_PROMPT, buildUserPrompt } from '../utils/promptBuilder';

// 사용 모델
const CLAUDE_MODEL = 'claude-sonnet-4-20250514';

// ⚠️ 실제 배포 시 환경변수(import.meta.env.VITE_ANTHROPIC_API_KEY)로 교체 필요
// 현재는 로컬 개발 편의를 위해 직접 입력하도록 함.
const API_KEY = 'YOUR_API_KEY_HERE';

// Claude 응답에서 마크다운 코드블록/주변 텍스트 제거 후 JSON 파싱
function extractJson(raw: string): unknown {
  let text = raw.trim();

  // ```json ... ``` 또는 ``` ... ``` 형태의 코드블록 제거
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    text = fenceMatch[1].trim();
  }

  // JSON 오브젝트 시작~끝 범위만 추출
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    text = text.slice(firstBrace, lastBrace + 1);
  }

  return JSON.parse(text);
}

// 훅 반환 타입
interface UseExamGeneratorReturn {
  problems: Problem[] | null;
  result: ExamResult | null;
  isLoading: boolean;
  error: string | null;
  generateExam: (config: ExamConfig) => Promise<ExamResult | null>;
  reset: () => void;
}

export function useExamGenerator(): UseExamGeneratorReturn {
  const [result, setResult] = useState<ExamResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 시험지 생성 메인 함수
  const generateExam = useCallback(
    async (config: ExamConfig): Promise<ExamResult | null> => {
      setIsLoading(true);
      setError(null);

      try {
        // API 키가 설정되지 않았을 때 사용자에게 명확한 안내
        if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
          throw new Error(
            'Anthropic API 키가 설정되지 않았습니다. src/hooks/useExamGenerator.ts 파일의 API_KEY 상수를 본인의 키로 교체해주세요.'
          );
        }

        // Claude Messages API 호출
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-calls': 'true',
          },
          body: JSON.stringify({
            model: CLAUDE_MODEL,
            max_tokens: 4096,
            system: SYSTEM_PROMPT,
            messages: [
              {
                role: 'user',
                content: buildUserPrompt(config),
              },
            ],
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Claude API 호출 실패 (HTTP ${response.status}): ${errorText}`
          );
        }

        const data = await response.json();

        // Claude 응답에서 텍스트 컨텐츠 추출
        const textBlock = Array.isArray(data.content)
          ? data.content.find((c: { type: string }) => c.type === 'text')
          : null;
        const rawText: string | undefined = textBlock?.text;

        if (!rawText) {
          throw new Error('Claude 응답에 유효한 텍스트 콘텐츠가 없습니다.');
        }

        // JSON 파싱
        const parsed = extractJson(rawText) as { problems?: Problem[] };
        if (!parsed.problems || !Array.isArray(parsed.problems)) {
          throw new Error('응답 JSON 에 problems 배열이 존재하지 않습니다.');
        }

        const examResult: ExamResult = {
          config,
          problems: parsed.problems,
          generatedAt: new Date(),
        };

        setResult(examResult);
        return examResult;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // 상태 초기화 (다시 생성 시 사용)
  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    problems: result?.problems ?? null,
    result,
    isLoading,
    error,
    generateExam,
    reset,
  };
}
