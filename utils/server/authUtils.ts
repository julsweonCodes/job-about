import { NextRequest } from "next/server";

// 서버 전용 인증 유틸리티

/**
 * 요청에서 토큰 추출
 */
export const extractTokenFromRequest = (request: NextRequest): string | null => {
  // Authorization 헤더에서 토큰 추출
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  // 쿠키에서 토큰 추출
  const token = request.cookies.get("token")?.value;
  if (token) {
    return token;
  }

  return null;
};

/**
 * 사용자 권한 확인
 */
export const checkUserPermission = (userRole: string, requiredRole: string): boolean => {
  const roleHierarchy = {
    admin: 3,
    manager: 2,
    user: 1,
  };

  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;

  return userLevel >= requiredLevel;
};

/**
 * API 키 검증
 */
export const validateApiKey = (apiKey: string): boolean => {
  // 실제 구현에서는 환경변수나 데이터베이스에서 검증
  const validApiKeys = process.env.VALID_API_KEYS?.split(",") || [];
  return validApiKeys.includes(apiKey);
};

/**
 * 세션 검증
 */
export const validateSession = async (sessionId: string): Promise<boolean> => {
  // 실제 구현에서는 데이터베이스에서 세션 검증
  // 여기서는 예시로 간단한 검증만 수행
  return sessionId.length > 0;
};

/**
 * CORS 헤더 설정
 */
export const getCorsHeaders = (origin?: string) => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"];

  return {
    "Access-Control-Allow-Origin":
      origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
};

/**
 * 보안 헤더 설정
 */
export const getSecurityHeaders = () => {
  return {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  };
};
