# 페이지네이션 훅 사용법

## 개요

`usePagination` 훅은 API 호출과 페이지네이션을 위한 공통 로직을 제공합니다.

## 기본 사용법

```typescript
import { usePagination } from "@/hooks/usePagination";

// API 호출 함수 정의
const fetchJobs = async (params: PaginationParams) => {
  const response = await apiGet("/api/jobs", params);
  return {
    data: response.data,
    totalCount: response.totalCount,
    hasMore: response.hasMore,
  };
};

// 훅 사용
const {
  data: jobs,
  pagination,
  loading,
  error,
  isInitialized,
  fetchPage,
  loadMore,
  refresh,
  goToPage,
} = usePagination({
  initialPage: 1,
  initialLimit: 10,
  autoFetch: true,
  fetchFunction: fetchJobs,
});
```

## 반환값

| 속성            | 타입                              | 설명                 |
| --------------- | --------------------------------- | -------------------- |
| `data`          | `T[]`                             | 현재 페이지의 데이터 |
| `pagination`    | `PaginationState`                 | 페이지네이션 상태    |
| `loading`       | `boolean`                         | 로딩 상태            |
| `error`         | `string \| null`                  | 에러 메시지          |
| `isInitialized` | `boolean`                         | 초기화 완료 여부     |
| `fetchPage`     | `(page: number) => Promise<void>` | 특정 페이지 로드     |
| `loadMore`      | `() => Promise<void>`             | 다음 페이지 로드     |
| `refresh`       | `() => Promise<void>`             | 현재 페이지 새로고침 |
| `goToPage`      | `(page: number) => Promise<void>` | 특정 페이지로 이동   |

## PaginationState

```typescript
interface PaginationState {
  currentPage: number; // 현재 페이지
  totalPages: number; // 전체 페이지 수
  totalCount: number; // 전체 아이템 수
  hasMore: boolean; // 더 로드할 데이터가 있는지
}
```

## 컴포넌트에서 사용 예시

```typescript
function JobList() {
  const {
    data: jobs,
    pagination,
    loading,
    error,
    isInitialized,
    loadMore,
    goToPage,
  } = usePagination({
    initialPage: 1,
    initialLimit: 20,
    autoFetch: true,
    fetchFunction: fetchJobs,
  });

  if (!isInitialized) {
    return <JobListSkeleton />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refresh} />;
  }

  return (
    <div>
      {/* 데이터 렌더링 */}
      {jobs.map(job => (
        <JobCard key={job.id} job={job} />
      ))}

      {/* 페이지네이션 */}
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={goToPage}
      />

      {/* 무한 스크롤 */}
      {pagination.hasMore && (
        <button onClick={loadMore} disabled={loading}>
          {loading ? "로딩 중..." : "더 보기"}
        </button>
      )}
    </div>
  );
}
```

## 고급 사용법

### 필터링과 함께 사용

```typescript
function JobListWithFilters() {
  const [filters, setFilters] = useState({});

  const fetchJobsWithFilters = useCallback(async (params: PaginationParams) => {
    const response = await apiGet("/api/jobs", { ...params, ...filters });
    return {
      data: response.data,
      totalCount: response.totalCount,
      hasMore: response.hasMore,
    };
  }, [filters]);

  const {
    data: jobs,
    pagination,
    loading,
    refresh,
  } = usePagination({
    fetchFunction: fetchJobsWithFilters,
  });

  // 필터 변경 시 새로고침
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    refresh();
  };

  return (
    <div>
      <FilterPanel onChange={handleFilterChange} />
      <JobList jobs={jobs} loading={loading} />
    </div>
  );
}
```

### 커스텀 훅으로 래핑

```typescript
// hooks/useJobPosts.ts
export function useJobPosts(filters?: JobFilters) {
  const fetchJobs = useCallback(
    async (params: PaginationParams) => {
      const response = await apiGet("/api/jobs", { ...params, ...filters });
      return {
        data: response.data,
        totalCount: response.totalCount,
        hasMore: response.hasMore,
      };
    },
    [filters]
  );

  return usePagination({
    fetchFunction: fetchJobs,
  });
}

// 컴포넌트에서 사용
function JobList() {
  const { data: jobs, loading, error } = useJobPosts({ status: "active" });
  // ...
}
```

## 장점

1. **코드 중복 제거**: 페이지네이션 로직을 재사용
2. **일관된 API**: 모든 페이지네이션에 동일한 인터페이스
3. **타입 안전성**: TypeScript로 타입 체크
4. **에러 처리**: 통합된 에러 처리 로직
5. **로딩 상태**: 자동 로딩 상태 관리
6. **초기화 추적**: 초기 로딩 완료 여부 추적
