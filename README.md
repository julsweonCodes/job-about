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
