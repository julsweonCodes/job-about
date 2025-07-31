import { HTTP_METHODS, HttpMethod } from "@/constants/api";
import { SUCCESS_STATUS, ERROR_STATUS } from "@/app/lib/server/commonResponse";

interface ApiConfig {
  baseURL?: string;
  headers?: Record<string, string>;
  timeout?: number;
}

interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

// 서버 응답 타입 정의
interface ServerResponse<T> {
  status: typeof SUCCESS_STATUS | typeof ERROR_STATUS;
  code: number;
  message: string;
  data?: T;
}

// 커스텀 에러 클래스
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: number,
    public originalError?: Error
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Query parameter 타입
type QueryParams = Record<string, string | number | boolean | undefined>;

// URL에 query parameter 추가하는 헬퍼 함수
function buildUrlWithParams(url: string, params?: QueryParams): string {
  if (!params || Object.keys(params).length === 0) {
    return url;
  }

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${url}?${queryString}` : url;
}

export class API {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;

  constructor(config: ApiConfig = {}) {
    this.baseURL = config.baseURL || "";
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...config.headers,
    };
    this.timeout = config.timeout || 10000;
  }

  /**
   * 기본 API 호출 메소드
   */
  private async request<T = any>(
    url: string,
    method: HttpMethod = HTTP_METHODS.GET,
    data?: any,
    customHeaders?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const fullUrl = this.baseURL + url;
    const headers = { ...this.defaultHeaders, ...customHeaders };
    const startTime = Date.now();

    const config: RequestInit = {
      method,
      headers,
    };

    if (data && method !== HTTP_METHODS.GET) {
      if (data instanceof FormData) {
        // FormData인 경우 Content-Type 헤더를 제거하고 body를 그대로 사용
        delete headers["Content-Type"];
        config.body = data;
      } else {
        config.body = JSON.stringify(data);
      }
    }

    // 타임아웃 설정
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    config.signal = controller.signal;

    try {
      const response = await fetch(fullUrl, config);
      clearTimeout(timeoutId);

      const responseData = await response.json();
      // const duration = Date.now() - startTime;

      // 로깅
      // console.log(`API ${method} ${url} - ${response.status} (${duration}ms)`, {
      //   request: { url: fullUrl, method, headers: config.headers },
      //   response: { status: response.status, data: responseData },
      // });

      return {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      const duration = Date.now() - startTime;

      // 에러 로깅
      console.error(`API ${method} ${url} failed (${duration}ms):`, error);
      throw error;
    }
  }

  /**
   * 재시도 로직이 포함된 API 호출
   */
  private async requestWithRetry<T = any>(
    url: string,
    method: HttpMethod = HTTP_METHODS.GET,
    data?: any,
    customHeaders?: Record<string, string>,
    maxRetries = 3
  ): Promise<ApiResponse<T>> {
    let lastError: Error;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await this.request<T>(url, method, data, customHeaders);
      } catch (error) {
        lastError = error as Error;

        // 마지막 시도이거나 네트워크 오류가 아닌 경우 재시도하지 않음
        if (i === maxRetries - 1 || !this.isRetryableError(error as Error)) {
          throw lastError;
        }

        // 지수 백오프: 1초, 2초, 4초
        const delay = Math.pow(2, i) * 1000;
        console.log(`Retrying API call in ${delay}ms (attempt ${i + 1}/${maxRetries})`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  /**
   * 재시도 가능한 에러인지 확인
   */
  private isRetryableError(error: Error): boolean {
    // 네트워크 오류, 타임아웃, 5xx 서버 오류는 재시도
    if (error.name === "AbortError") return true;
    if (error.message.includes("fetch")) return true;
    return false;
  }

  /**
   * GET 요청 (query parameter 지원)
   */
  async get<T = any>(
    url: string,
    params?: QueryParams,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const urlWithParams = buildUrlWithParams(url, params);
    return this.requestWithRetry<T>(urlWithParams, HTTP_METHODS.GET, undefined, headers);
  }

  /**
   * POST 요청
   */
  async post<T = any>(
    url: string,
    data: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.requestWithRetry<T>(url, HTTP_METHODS.POST, data, headers);
  }

  /**
   * PUT 요청
   */
  async put<T = any>(
    url: string,
    data: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.requestWithRetry<T>(url, HTTP_METHODS.PUT, data, headers);
  }

  /**
   * PATCH 요청
   */
  async patch<T = any>(
    url: string,
    data: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.requestWithRetry<T>(url, HTTP_METHODS.PATCH, data, headers);
  }

  /**
   * DELETE 요청
   */
  async delete<T = any>(url: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.requestWithRetry<T>(url, HTTP_METHODS.DELETE, undefined, headers);
  }

  /**
   * 헤더 설정
   */
  setHeader(key: string, value: string): void {
    this.defaultHeaders[key] = value;
  }

  /**
   * 헤더 제거
   */
  removeHeader(key: string): void {
    delete this.defaultHeaders[key];
  }

  /**
   * 기본 URL 설정
   */
  setBaseURL(url: string): void {
    this.baseURL = url;
  }

  /**
   * 타임아웃 설정
   */
  setTimeout(timeout: number): void {
    this.timeout = timeout;
  }
}

// 기본 API 인스턴스 생성
export const api = new API({
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

// 편의 함수들 (기존 호환성 유지)
export const apiGet = <T = any>(
  url: string,
  params?: QueryParams,
  headers?: Record<string, string>
) => api.get<T>(url, params, headers);

export const apiPost = <T = any>(url: string, data: any, headers?: Record<string, string>) =>
  api.post<T>(url, data, headers);

export const apiPut = <T = any>(url: string, data: any, headers?: Record<string, string>) =>
  api.put<T>(url, data, headers);

export const apiPatch = <T = any>(url: string, data: any, headers?: Record<string, string>) =>
  api.patch<T>(url, data, headers);

export const apiDelete = <T = any>(url: string, headers?: Record<string, string>) =>
  api.delete<T>(url, headers);

// 편의 함수들 - 성공 시에만 data를 반환하는 함수들
export const apiGetData = <T = any>(
  url: string,
  params?: QueryParams,
  headers?: Record<string, string>
) =>
  api.get<ServerResponse<T>>(url, params, headers).then((response) => {
    if (response.data.status === SUCCESS_STATUS) {
      return response.data.data;
    }
    throw new ApiError(
      response.data.message || "API call failed",
      response.status,
      response.data.code
    );
  });

export const apiPostData = <T = any>(url: string, data: any, headers?: Record<string, string>) =>
  api.post<ServerResponse<T>>(url, data, headers).then((response) => {
    if (response.data.status === SUCCESS_STATUS) {
      return response.data.data;
    }
    throw new ApiError(
      response.data.message || "API call failed",
      response.status,
      response.data.code
    );
  });

export const apiPutData = <T = any>(url: string, data: any, headers?: Record<string, string>) =>
  api.put<ServerResponse<T>>(url, data, headers).then((response) => {
    if (response.data.status === SUCCESS_STATUS) {
      return response.data.data;
    }
    throw new ApiError(
      response.data.message || "API call failed",
      response.status,
      response.data.code
    );
  });

export const apiPatchData = <T = any>(url: string, data: any, headers?: Record<string, string>) =>
  api.patch<ServerResponse<T>>(url, data, headers).then((response) => {
    if (response.data.status === SUCCESS_STATUS) {
      return response.data.data;
    }
    throw new ApiError(
      response.data.message || "API call failed",
      response.status,
      response.data.code
    );
  });

export const apiDeleteData = <T = any>(url: string, headers?: Record<string, string>) =>
  api.delete<ServerResponse<T>>(url, headers).then((response) => {
    if (response.data.status === SUCCESS_STATUS) {
      return response.data.data;
    }
    throw new ApiError(
      response.data.message || "API call failed",
      response.status,
      response.data.code
    );
  });
