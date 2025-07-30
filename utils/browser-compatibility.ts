/**
 * 브라우저 호환성 및 기능 지원 여부를 확인하는 유틸리티
 */

export interface BrowserCompatibility {
  localStorage: boolean;
  sessionStorage: boolean;
  cookies: boolean;
  isIncognito: boolean;
  isMobile: boolean;
  userAgent: string;
}

/**
 * 브라우저의 기능 지원 여부를 확인
 */
export function checkBrowserCompatibility(): BrowserCompatibility {
  const result: BrowserCompatibility = {
    localStorage: false,
    sessionStorage: false,
    cookies: false,
    isIncognito: false,
    isMobile: false,
    userAgent: navigator.userAgent,
  };

  // localStorage 지원 확인
  try {
    const testKey = "__test_localStorage__";
    localStorage.setItem(testKey, "test");
    localStorage.removeItem(testKey);
    result.localStorage = true;
  } catch (e) {
    result.localStorage = false;
  }

  // sessionStorage 지원 확인
  try {
    const testKey = "__test_sessionStorage__";
    sessionStorage.setItem(testKey, "test");
    sessionStorage.removeItem(testKey);
    result.sessionStorage = true;
  } catch (e) {
    result.sessionStorage = false;
  }

  // 쿠키 지원 확인
  try {
    document.cookie = "__test_cookie__=test; path=/";
    const hasCookie = document.cookie.includes("__test_cookie__");
    document.cookie = "__test_cookie__=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    result.cookies = hasCookie;
  } catch (e) {
    result.cookies = false;
  }

  // 시크릿 모드 감지 (완벽하지 않지만 대부분의 경우 작동)
  try {
    // Chrome 시크릿 모드 감지
    if (
      navigator.userAgent.includes("Chrome") &&
      (window as any).chrome &&
      (window as any).chrome.webstore === undefined
    ) {
      result.isIncognito = true;
    }

    // Firefox 프라이빗 모드 감지
    if (navigator.userAgent.includes("Firefox")) {
      const testKey = "__test_private__";
      localStorage.setItem(testKey, "test");
      if (!localStorage.getItem(testKey)) {
        result.isIncognito = true;
      }
      localStorage.removeItem(testKey);
    }

    // Safari 프라이빗 모드 감지
    if (navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome")) {
      try {
        (window as any).openDatabase(null, null, null, null);
        result.isIncognito = false;
      } catch (e) {
        result.isIncognito = true;
      }
    }
  } catch (e) {
    // 시크릿 모드 감지 실패 시 기본값 유지
  }

  // 모바일 기기 감지
  result.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  return result;
}

/**
 * 인증에 필요한 최소 기능이 지원되는지 확인
 */
export function isAuthSupported(): boolean {
  const compatibility = checkBrowserCompatibility();

  // 최소한 하나의 스토리지 방식이 지원되어야 함
  const hasStorage =
    compatibility.localStorage || compatibility.sessionStorage || compatibility.cookies;

  console.log("Browser compatibility check:", compatibility);
  console.log("Auth supported:", hasStorage);

  return hasStorage;
}

/**
 * 브라우저별 권장사항 제공
 */
export function getBrowserRecommendations(): string[] {
  const compatibility = checkBrowserCompatibility();
  const recommendations: string[] = [];

  if (!compatibility.localStorage && !compatibility.sessionStorage) {
    recommendations.push(
      "스토리지 기능이 비활성화되어 있습니다. 브라우저 설정에서 쿠키와 로컬 스토리지를 활성화해주세요."
    );
  }

  if (compatibility.isIncognito) {
    recommendations.push(
      "시크릿 모드에서는 일부 기능이 제한될 수 있습니다. 일반 모드에서 사용하시면 더 안정적으로 동작합니다."
    );
  }

  if (compatibility.isMobile) {
    recommendations.push("모바일 브라우저에서는 일부 기능이 제한될 수 있습니다.");
  }

  return recommendations;
}
