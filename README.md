# Job About Project

This project is a login example using Next.js, TypeScript, TailwindCSS, and Supabase.

## Tech Stack

- Next.js
- TypeScript
- TailwindCSS
- Supabase

## Required Node.js Version

- Node.js 18.x or higher (LTS recommended)

## Installation & Usage

1. Install dependencies

```bash
yarn install
```

2. Set environment variables

Create a Supabase project and add the following to your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

3. Start the development server

```bash
yarn dev
```

## Supabase Client Setup

Initialize the Supabase client in `lib/client/supabase.ts`.

## Example: Login Implementation

- Example login using Supabase Auth can be found in `app/test/components/TestContainer.tsx` and related hooks.

---

For more details, see the comments in each file.

## setting prisma

yarn add -D prisma
yarn add @prisma/client

yarn prisma init

.env 파일 설정

DB 스키마 가져오기
yarn prisma db pull
⮕ schema.prisma 업데이트됨
⮕ 자동으로 prisma generate 실행됨

prisma/schema.prisma 파일에 model 추가 후,
yarn prisma db push
-> supabase 테이블 자동 생성

+prisma plugin 설치하면 편리함
