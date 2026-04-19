# LIMCO Next.js Website Redesign

A premium, high-performance corporate website rebuild for LIMCO using Next.js, Tailwind CSS, Framer Motion, and a CMS-ready data layer.

## Stack

- Next.js 14 (App Router)
- Tailwind CSS with custom design tokens
- Framer Motion animations
- CMS adapter supporting local data, Strapi, or PocketBase

## Getting Started

```bash
npm install
npm run dev
```

## CMS Configuration

Set environment variables:

- `CMS_PROVIDER=local|strapi|pocketbase`
- `CMS_BASE_URL=https://your-cms-url`

Programme content is read via `lib/cms.ts` and exposed through API routes under `/api/programmes`.

## Pages

- `/` Home
- `/about`
- `/services`
- `/programmes`
- `/programmes/[slug]`
- `/projects`
- `/contact`
