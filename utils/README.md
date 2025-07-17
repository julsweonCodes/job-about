# Utils 폴더 구조 가이드

## 📁 폴더 구조

```
utils/
├── client/           # 클라이언트 전용 유틸리티
│   ├── jobTypeUtils.ts
│   ├── formUtils.ts
│   └── uiUtils.ts
├── server/           # 서버 전용 유틸리티
│   ├── authUtils.ts
│   ├── dbUtils.ts
│   └── validationUtils.ts
├── shared/           # 서버/클라이언트 공통 유틸리티
│   ├── dateUtils.ts
│   ├── stringUtils.ts
│   └── constants.ts
└── index.ts          # 메인 export 파일
```

## 🎯 사용 가이드

### 1. 클라이언트 전용 유틸리티 (`utils/client/`)

- 브라우저에서만 실행되는 코드
- DOM 조작, 이벤트 처리, UI 관련 함수
- `"use client"` 지시어 필요

### 2. 서버 전용 유틸리티 (`utils/server/`)

- 서버에서만 실행되는 코드
- 데이터베이스 조작, 인증, 파일 시스템 접근
- API 라우트, Server Components에서 사용

### 3. 공통 유틸리티 (`utils/shared/`)

- 서버/클라이언트 모두에서 사용 가능
- 순수 함수, 타입 정의, 상수
- `"use client"` 지시어 불필요

## 📝 사용 예시

```typescript
// 클라이언트에서 사용
import { getJobTypeName } from "@/utils/client/jobTypeUtils";

// 서버에서 사용
import { validateJobData } from "@/utils/server/validationUtils";

// 공통 사용
import { formatDate } from "@/utils/shared/dateUtils";
```

## ⚠️ 주의사항

1. **클라이언트 유틸리티는 서버에서 import 금지**
2. **서버 유틸리티는 클라이언트에서 import 금지**
3. **공통 유틸리티는 양쪽에서 안전하게 사용 가능**
4. **타입 정의는 shared 폴더에 배치**
