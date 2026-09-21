This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Halaman internal `/simulasi`

Kalkulator skenario proyeksi keuangan ReKain. Seluruh nilai bawaannya diambil dari
Tabel 5.1–5.4 proposal, dan `src/lib/finance/*.test.ts` mengunci baseline itu ke
angka proposal (ROI 378,99%, IRR 71,32%, payback bulan ke-22, BEP Rp96.867.470,
NPV Rp166.785.081).

Halaman ini sengaja tidak tertaut dari navigasi mana pun dan memasang
`noindex, nofollow`. Aksesnya digerbangi satu passphrase yang dibaca dari
environment variable — buat `.env.local` di root proyek:

```bash
SIMULASI_SANDI=ganti-dengan-sandi-anda
```

Tanpa variabel itu gerbangnya menolak semua akses (fail closed), dan halaman akan
memberi tahu bahwa variabelnya belum diset. `.env.local` sudah diabaikan git lewat
aturan `.env*` di `.gitignore`.

Skenario bisa dibagikan lewat query param `?s=` — hanya selisih terhadap baseline
yang disandikan, jadi tautannya tetap pendek.
