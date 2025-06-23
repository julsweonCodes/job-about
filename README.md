# 1 nextjs 프로젝트 시작하기

npx create-next-app@14.1.4

# 2. 필요한 패키지 미리 설치

( version issue에 대응하여 특정 버전으로 설치하기 )  
yarn add react-spinners@^0.13.8
yarn add react-icons@^5.0.1
yarn add @supabase/supabase-js@^2.42.0
yarn add @supabase/ssr@^0.1.0
yarn add @supabase/auth-ui-react@^0.4.7
yarn add @supabase/auth-ui-shared@^0.1.8
yarn add cookies-next@^4.1.1

-- @supabase/supabase-js : @supabase/ssr에서 사용하는 모듈, 설치 안하면 타입자동완성이 안된다.

npx supabase gen types typescript --project-id "ffljwadxkmnkczqygftv" --schema public > database.types.ts

# supbase 로그인

npx supabase login
