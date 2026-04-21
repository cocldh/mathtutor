# 초등 사고력 수학 시험 출제기

초등학교 1~6학년 대상의 사고력 수학 시험지를 **Claude AI** 로 자동 생성하는 단일 페이지 웹 애플리케이션입니다. 교사/학부모가 학년·난이도·문제 수를 선택하면 즉시 변별력 있는 시험지가 생성되고, 교사 모드에서는 정답과 해설까지 확인하고 인쇄할 수 있습니다.

## 주요 기능

- 🎯 학년(1~6), 난이도(하/중/상/최상), 문제 수(5/10/15/20) 선택
- 🤖 Claude (`claude-sonnet-4-20250514`) 를 통한 실시간 문제 생성
- 👨‍🏫 교사 모드 토글 → 정답/해설 표시 여부 제어
- 🖨️ 인쇄 최적화 CSS — 바로 프린트 가능
- 🧠 5가지 문제 유형(패턴추론/논리추론/공간감각/연산응용/창의서술) 혼합 출제

## 기술 스택

- React 18 + TypeScript 5
- Tailwind CSS v3
- Vite
- lucide-react (아이콘)
- Anthropic Claude API

## 설치 및 실행

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행
npm run dev

# 3. 브라우저 접속
# http://localhost:5173
```

## 🔑 API 키 설정 (필수)

시험지 생성을 위해서는 Anthropic Claude API 키가 필요합니다.

### 1단계: API 키 발급

- https://console.anthropic.com 에서 API 키를 발급받으세요.

### 2단계: API 키 등록

`src/hooks/useExamGenerator.ts` 파일을 열고 다음 줄을 찾아 본인의 키로 교체하세요:

```typescript
// ⚠️ 실제 배포 시 환경변수(import.meta.env.VITE_ANTHROPIC_API_KEY)로 교체 필요
const API_KEY = 'YOUR_API_KEY_HERE';
```

예시:

```typescript
const API_KEY = 'sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
```

### ⚠️ 보안 주의사항

- 이 프로젝트는 브라우저에서 Claude API 를 직접 호출합니다 (`anthropic-dangerous-direct-browser-calls: true`).
- **개발·학습용으로만** 사용하세요. 실제 서비스 배포 시에는 반드시 백엔드 서버를 경유하거나, 환경변수 + 서버리스 함수를 통해 키를 숨겨야 합니다.
- API 키를 깃에 커밋하지 마세요. (본 저장소의 `.gitignore` 에 `.env*` 가 포함되어 있습니다.)

## 사용 방법

1. 학년, 난이도, 문제 수를 선택합니다.
2. 필요시 **교사 모드**를 켭니다 (정답/해설 표시).
3. **시험지 생성** 버튼을 누르면 수 초 이내에 시험지가 생성됩니다.
4. **인쇄하기** 버튼으로 바로 출력하거나, **다시 생성** 으로 새 시험지를 만들 수 있습니다.

## 프로젝트 구조

```
src/
├── App.tsx                  # 루트 컴포넌트, 전체 상태 관리
├── main.tsx                 # 진입점
├── index.css                # Tailwind 지시문 + 인쇄용 CSS
├── types/
│   └── exam.ts              # 모든 TypeScript 타입 정의
├── hooks/
│   └── useExamGenerator.ts  # Claude API 호출 커스텀 훅 ← API 키 교체 위치
├── components/
│   ├── SettingsPanel.tsx    # 학년/난이도/문제수 선택 UI
│   ├── ExamSheet.tsx        # 시험지 전체 렌더링
│   └── ProblemCard.tsx      # 개별 문제 카드
└── utils/
    └── promptBuilder.ts     # Claude API 프롬프트 생성 유틸
```

## 라이선스

MIT
