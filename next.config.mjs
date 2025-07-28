import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev, isServer }) => {
    // 개발 환경에서만 캐시 최적화
    if (dev) {
      config.cache = {
        type: "filesystem",
        buildDependencies: {
          config: [__filename],
        },
        cacheDirectory: resolve(__dirname, ".next/cache"),
        compression: "gzip",
        maxMemoryGenerations: 1,
        // 성능 최적화 설정 추가
        store: "pack",
        version: "1.0.0",
        // 큰 문자열 직렬화 최적화
        allowCollectingMemory: true,
        memoryCacheUnaffected: true,
        // 추가 최적화 설정
        maxAge: 172800000, // 2일
        compression: "gzip",
        hashAlgorithm: "md4",
        idleTimeout: 60000,
        idleTimeoutForInitialStore: 5000,
      };
    }
    return config;
  },
};

export default nextConfig;
