# Loading Components

네트워크 요청 중에 표시할 로딩 컴포넌트들입니다.

## LoadingScreen

전체 화면을 덮는 로딩 오버레이입니다.

### Props

- `message?: string` - 로딩 메시지 (기본값: "Loading...")
- `overlay?: boolean` - 오버레이 모드 여부 (기본값: true)
- `spinnerSize?: "sm" | "md" | "lg" | "xl"` - 스피너 크기 (기본값: "lg")
- `spinnerColor?: "primary" | "white" | "gray"` - 스피너 색상 (기본값: "primary")
- `className?: string` - 추가 CSS 클래스

### 사용 예시

```tsx
import LoadingScreen from "@/components/common/LoadingScreen";

// 기본 사용
{
  isLoading && <LoadingScreen />;
}

// 커스텀 메시지
{
  isLoading && <LoadingScreen message="업로드 중..." />;
}

// 인라인 로딩 (오버레이 없음)
{
  isLoading && <LoadingScreen overlay={false} />;
}

// 작은 스피너
{
  isLoading && <LoadingScreen spinnerSize="sm" />;
}
```

## LoadingSpinner

단독으로 사용할 수 있는 로딩 스피너입니다.

### Props

- `size?: "sm" | "md" | "lg" | "xl"` - 크기 (기본값: "md")
- `color?: "primary" | "white" | "gray"` - 색상 (기본값: "primary")
- `className?: string` - 추가 CSS 클래스

### 사용 예시

```tsx
import LoadingSpinner from "@/components/common/LoadingSpinner";

// 기본 사용
<LoadingSpinner />

// 큰 스피너
<LoadingSpinner size="lg" />

// 흰색 스피너 (다크 배경용)
<LoadingSpinner color="white" />

// 버튼 내부에 사용
<Button disabled={isLoading}>
  {isLoading ? <LoadingSpinner size="sm" color="white" /> : "저장"}
</Button>
```

## 실제 사용 예시

### 네트워크 요청 중 로딩

```tsx
const [isLoading, setIsLoading] = useState(false);

const handleSave = async () => {
  setIsLoading(true);
  try {
    await saveData();
  } finally {
    setIsLoading(false);
  }
};

return (
  <div>
    {isLoading && <LoadingScreen message="저장 중..." />}
    <Button onClick={handleSave} disabled={isLoading}>
      {isLoading ? <LoadingSpinner size="sm" color="white" /> : "저장"}
    </Button>
  </div>
);
```

### 이미지 업로드 중 로딩

```tsx
const [isUploading, setIsUploading] = useState(false);

const handleImageUpload = async (file: File) => {
  setIsUploading(true);
  try {
    await uploadImage(file);
  } finally {
    setIsUploading(false);
  }
};

return (
  <div>
    {isUploading && <LoadingScreen message="이미지 업로드 중..." />}
    <ImageUploadDialog onSave={handleImageUpload} />
  </div>
);
```
