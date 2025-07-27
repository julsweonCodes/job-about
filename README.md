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

2. Set up Git hooks (for pre-commit checks)

```bash
# 자동 설정 스크립트 실행
./setup-hooks.sh

# 또는 수동으로 설정
mkdir -p .git/hooks
# .git/hooks/pre-commit 파일이 자동으로 생성됩니다
```

3. Set environment variables

Create a Supabase project and add the following to your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Start the development server

```bash
yarn dev
```

## Supabase Client Setup

Initialize the Supabase client in `lib/client/supabase.ts`.

## Example: Login Implementation

- Example login using Supabase Auth can be found in `app/test/components/TestContainer.tsx` and related hooks.

## prisma

`yarn add -D prisma`
`yarn add @prisma/client`

`yarn prisma init`

#### DB 스키마 가져오기

`yarn prisma db pull`
⮕ schema.prisma 업데이트됨
⮕ 자동으로 prisma generate 실행됨

#### code로 DB 스키마 변경하기

`schema.prisma` 수정 후, `yarn prisma db push`
⮕ supabase schema update

---

For more details, see the comments in each file.
