# Deployment

Panduan build dan deploy aplikasi **MediFlow**. Project ini adalah SPA (React + Vite), jadi tidak butuh server khusus.

---

## 1. Build Produksi (Lokal)

Sebelum deploy, pastikan build produksi berhasil:

```bash
pnpm install
pnpm build
```

Output build ada di folder **`dist/`**. Untuk mengecek hasil build secara lokal:

```bash
pnpm preview
```

> `pnpm build` menjalankan `tsc -b && vite build`. Jadi error TypeScript akan menggagalkan build. Pastikan lolos dulu.

---

## 2. Deploy via Vercel (Dashboard)

1. Masuk ke [vercel.com](https://vercel.com) → **Add New → Project**.
2. Import repository GitHub **MediFlow**.
3. Vercel biasanya mendeteksi framework otomatis (Vite). Jika tidak, atur manual:

| Setting              | Nilai          |
| :------------------- | :------------- |
| **Framework Preset** | `Vite`         |
| **Build Command**    | `pnpm build`   |
| **Output Directory** | `dist`         |
| **Install Command**  | `pnpm install` |
| **Root Directory**   | `/` (default)  |

4. Klik **Deploy**.

> Vercel otomatis mendeteksi `pnpm-lock.yaml` dan menggunakan pnpm sebagai package manager.

---

## 3. Deploy via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel            # deploy preview
vercel --prod     # deploy ke production
```

---

## 4. Auto-Deploy (Recommended)

Jika project sudah dihubungkan ke Vercel, setiap **push ke `main`** akan otomatis memicu deployment production. Push ke branch lain akan membuat **Preview Deployment** (untuk review PR).

---

## 5. SPA Fallback (Rewrite)

Karena aplikasi menggunakan `react-router` dengan `createBrowserRouter`, perlu memastikan Vercel mengarahkan semua route ke `index.html` agar refresh di `/stock-map` (misalnya) tidak 404.

Tambahkan file `vercel.json` di root project:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

> **Catatan:** Tambahkan file ini saat melakukan setup deployment pertama kali di Vercel.

---

## 6. Environment Variables

Jika project ini nanti terhubung ke backend/AI service, simpan secret di:

**Vercel Dashboard** → Project → **Settings → Environment Variables**.

> Jangan pernah menaruh secret di kode atau file yang di-commit. Client-side env (prefix `VITE_`) hanya aman untuk data publik.
