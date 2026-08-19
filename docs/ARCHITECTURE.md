# Arsitektur Code

Dokumen ini menjelaskan tech stack, struktur folder, dan alur data utama aplikasi **MediFlow**.

---

## 1. Tech Stack

| Kategori                 | Teknologi                             | Keterangan                                                        |
| :----------------------- | :------------------------------------ | :---------------------------------------------------------------- |
| **Framework**            | React 19 + Vite 8                     | Build tool cepat dengan HMR.                                      |
| **Bahasa**               | TypeScript 6                          | Type-safe, strict mode aktif.                                     |
| **Styling**              | Tailwind CSS 4                        | Plugin `@tailwindcss/vite`, CSS utility-first.                    |
| **UI Components**        | shadcn/ui (style `base-nova`)         | Berbasis `@base-ui/react`, dipersonalisasi via `components.json`. |
| **Icons**                | lucide-react                          | Set ikon default shadcn.                                          |
| **State Management**     | Zustand 5                             | Global store untuk stok & transfer.                               |
| **Form**                 | React Hook Form 7                     | Manajemen form.                                                   |
| **Routing**              | React Router 7                        | `createBrowserRouter` + layout.                                   |
| **Data Visualization**   | Recharts                              | Grafik tren & analitik.                                           |
| **Formatting / Linting** | Prettier + ESLint (typescript-eslint) | Ditambahkan Husky + lint-staged.                                  |

---

## 2. Struktur Direktori `src/`

```
src/
├── main.tsx                 # Entry point, render <App />
├── App.tsx                  # Menyediakan <RouterProvider>
├── index.css                # Global CSS + Tailwind
│
├── components/
│   ├── layout/              # Navbar, Sidebar, PageWrapper
│   └── ui/                  # Reusable shadcn components (button, card, badge, dialog, ...)
│
├── data/
│   └── index.ts             # Dummy data (obat, rumah sakit, kasus penyakit)
│
├── features/                # Fitur utama (feature-based)
│   ├── dashboard/           # DashboardPage
│   ├── stock-map/           # StockMapPage (peta interaktif RS)
│   ├── transfer/            # TransferPage (transfer stok antar RS)
│   ├── analytics/           # AnalyticsPage
│   └── ai-chat/             # AiChatPage (asisten AI percakapan)
│
├── hooks/                   # Logika terpisah
│   ├── useStockSummary.ts
│   └── useDiseaseDetection.ts
│
├── i18n/                    # Internasionalisasi (dictionary id/en)
│   ├── id.ts, en.ts, index.ts, useI18n.ts
│
├── lib/
│   └── utils.ts             # Utility (cn = clsx + tailwind-merge)
│
├── router/
│   └── index.tsx            # Definisi semua route
│
├── store/                   # Zustand stores
│   ├── stockStore.ts        # Data stok obat
│   ├── transferStore.ts     # Data permintaan transfer
│   └── uiStore.ts           # State UI global
│
├── types/
│   └── index.ts             # Interface/type terpusat
│
└── utils/
    ├── dateHelpers.ts
    └── statusHelpers.ts
```

> **Prinsip:** **Feature-based**. Kode setiap fitur dikelompokkan di folder `features/<fitur>/`. Logika reusable yang dipakai banyak fitur dinaikkan ke `hooks/`, `utils/`, atau `store/`.

---

## 3. Routing

Route didefinisikan di `src/router/index.tsx` menggunakan `createBrowserRouter`. Semua halaman dibungkus `PageWrapper` (layout umum: Navbar + Sidebar).

| Route        | Halaman            | File                                   |
| :----------- | :----------------- | :------------------------------------- |
| `/`          | Dashboard          | `features/dashboard/DashboardPage.tsx` |
| `/stock-map` | Peta Interaktif RS | `features/stock-map/StockMapPage.tsx`  |
| `/transfer`  | Transfer Stok      | `features/transfer/TransferPage.tsx`   |
| `/analytics` | Analitik           | `features/analytics/AnalyticsPage.tsx` |
| `/ai-chat`   | Asisten AI         | `features/ai-chat/AiChatPage.tsx`      |
| `*`          | Redirect ke `/`    | -                                      |

---

## 4. Type & Data

Semua interface terpusat di `src/types/index.ts`:

| Type              | Deskripsi                                                           |
| :---------------- | :------------------------------------------------------------------ |
| `StockStatus`     | `'safe' \| 'low' \| 'critical'`                                     |
| `DiseaseSeverity` | `'normal' \| 'rising' \| 'outbreak'`                                |
| `TransferStatus`  | `'pending' \| 'approved' \| 'shipped' \| 'completed' \| 'rejected'` |
| `Obat`            | Data obat (stok, minimum, pemakaian harian).                        |
| `RumahSakit`      | Data RS (kota, region, koordinat, status stok).                     |
| `KasusPenyakit`   | Data kasus penyakit + tren & severity.                              |
| `TransferRequest` | Permintaan transfer antar RS.                                       |

> Saat menambah fitur baru, **definisikan type di `types/` dulu**, lalu gunakan di seluruh aplikasi agar konsisten.

---

## 5. State Management (Zustand)

Store global ada di `src/store/` dan di-export ulang dari `src/store/index.ts`.

```ts
import { useStockStore } from '@/store'
```

- `useStockStore`: data & operasi stok obat.
- `useTransferStore`: data & operasi permintaan transfer.
- `useUiStore`: state UI global (mis. sidebar, tema, dsb).

> Logika perhitungan/prediksi (mis. sisa hari stok) dipisah ke `hooks/` agar tidak menumpuk di komponen.

---

## 6. Internasionalisasi (i18n)

Support dua bahasa: **Indonesia (`id`)** dan **English (`en`)**.

- Dictionary ada di `src/i18n/id.ts` dan `src/i18n/en.ts`.
- Gunakan hook `useI18n` dari `src/i18n/useI18n.ts` di komponen.
- Saat menambahkan teks baru, **tambahkan di kedua file** (`id` dan `en`) dengan key yang sama.

---

## 7. Aturan Import

- Selalu gunakan alias `@/` untuk import dari `src/` (lihat `SETUP.md`).
- Karena `verbatimModuleSyntax` aktif, pakai `import type` untuk import yang hanya berupa type:

```ts
import type { Obat, TransferStatus } from '@/types'
```
