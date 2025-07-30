import { HTTP_METHODS, HttpMethod } from "@/constants/api";
import { SUCCESS_STATUS } from "@/app/lib/server/commonResponse";

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

      return {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
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
    return this.request<T>(urlWithParams, HTTP_METHODS.GET, undefined, headers);
  }

  /**
   * POST 요청
   */
  async post<T = any>(
    url: string,
    data: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, HTTP_METHODS.POST, data, headers);
  }

  /**
   * PUT 요청
   */
  async put<T = any>(
    url: string,
    data: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, HTTP_METHODS.PUT, data, headers);
  }

  /**
   * PATCH 요청
   */
  async patch<T = any>(
    url: string,
    data: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, HTTP_METHODS.PATCH, data, headers);
  }

  /**
   * DELETE 요청
   */
  async delete<T = any>(url: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(url, HTTP_METHODS.DELETE, undefined, headers);
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

// 편의 함수들 - 성공 시에만 data를 반환하는 함수들
export const apiGetData = <T = any>(
  url: string,
  params?: QueryParams,
  headers?: Record<string, string>
) =>
  api
    .get<{ status: string; code: number; message: string; data?: T }>(url, params, headers)
    .then((response) => {
      if (response.data.status === SUCCESS_STATUS) {
        return response.data.data;
      }
      throw new Error(response.data.message || "API call failed");
    });

export const apiPostData = <T = any>(url: string, data: any, headers?: Record<string, string>) =>
  api
    .post<{ status: string; code: number; message: string; data?: T }>(url, data, headers)
    .then((response) => {
      if (response.data.status === SUCCESS_STATUS) {
        return response.data.data;
      }
      throw new Error(response.data.message || "API call failed");
    });

export const apiPutData = <T = any>(url: string, data: any, headers?: Record<string, string>) =>
  api
    .put<{ status: string; code: number; message: string; data?: T }>(url, data, headers)
    .then((response) => {
      if (response.data.status === SUCCESS_STATUS) {
        return response.data.data;
      }
      throw new Error(response.data.message || "API call failed");
    });

export const apiPatchData = <T = any>(url: string, data: any, headers?: Record<string, string>) =>
  api
    .patch<{ status: string; code: number; message: string; data?: T }>(url, data, headers)
    .then((response) => {
      if (response.data.status === SUCCESS_STATUS) {
        return response.data.data;
      }
      throw new Error(response.data.message || "API call failed");
    });

export const apiDeleteData = <T = any>(url: string, headers?: Record<string, string>) =>
  api
    .delete<{ status: string; code: number; message: string; data?: T }>(url, headers)
    .then((response) => {
      if (response.data.status === SUCCESS_STATUS) {
        return response.data.data;
      }
      throw new Error(response.data.message || "API call failed");
    });
