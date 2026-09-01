# MediFlow

Platform **prediksi stok dan distribusi obat/alat medis antar rumah sakit**. Frontend-only SPA (React 19 + Vite + TypeScript) yang mengubah manajemen stok rumah sakit dari reaktif menjadi proaktif.

Live demo: **[https://mediflow.gdg.my.id](https://mediflow.gdg.my.id)**

## Daftar Isi

- [Nama Tim](#nama-tim)
- [Anggota Tim](#anggota-tim)
- [Tentang Proyek](#tentang-proyek)
- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Struktur Folder](#struktur-folder)
- [Demo Akun](#demo-akun)
- [Instalasi dan Menjalankan Secara Lokal](#instalasi-dan-menjalankan-secara-lokal)
- [Daftar Perintah](#daftar-perintah)
- [Deployment](#deployment)
- [Sumber Daya Tambahan](#sumber-daya-tambahan)

## Nama Tim

**MENTAI JODER**

## Anggota Tim

| Nama                  | Peran              |
| :-------------------- | :----------------- |
| Krisnado Rizal K.W.   | Team Lead / UI UX  |
| Gadang Jatu Mahiswara | Frontend Developer |

## Tentang Proyek

MediFlow adalah platform web untuk memantau dan mendistribusikan stok obat serta alat medis antar rumah sakit dalam satu jaringan. Aplikasi ini mencegah krisis stok dengan memanfaatkan data tren kasus penyakit per wilayah untuk memprediksi kebutuhan, menampilkan status stok secara real-time, dan memfasilitasi transfer stok antar rumah sakit dengan alur persetujuan yang transparan.

Masalah yang dipecahkan:

- Stok obat masih dicatat manual sehingga keterlambatan deteksi stok kritis sering terjadi.
- Tidak ada jejaring data antar rumah sakit, sehingga satu RS kekurangan sementara RS lain surplus hingga kedaluwarsa.
- Negosiasi transfer dilakukan manual (telepon satu per satu) dan memakan waktu, terutama saat krisis.
- Tidak ada jejak audit transfer (siapa meminta apa, kapan).

Tujuan utama: **tidak ada rumah sakit yang kehabisan stok kritis karena rumah sakit lain punya surplus yang tidak terlihat.**

## Fitur Utama

| Fitur               | Deskripsi                                                                                                     |
| :------------------ | :------------------------------------------------------------------------------------------------------------ |
| Dashboard           | Ringkasan KPI stok, banner insight AI, grafik tren, dan aktivitas transfer terbaru.                           |
| Network Map         | Peta interaktif (Leaflet) dengan indikator warna status stok tiap rumah sakit serta panel detail.             |
| Transfer Stok       | Pengajuan transfer antar rumah sakit satu klik dengan alur approval multi-role (pending, approved, rejected). |
| Analytics           | Grafik tren kasus penyakit per wilayah dan tabel prediksi stok yang dapat diurutkan.                          |
| AI Assistant        | Chat asisten AI rule-based untuk menjawab pertanyaan tentang stok, surplus, prediksi, dan transfer.           |
| Notifikasi Pusat    | Pusat notifikasi untuk seluruh event transfer dengan filter, mark-as-read, dan deep link.                     |
| Mock Login          | Login demo dengan 5 akun preset tanpa password.                                                               |
| Multi-bahasa        | Dukungan bahasa Indonesia (default) dan Inggris.                                                              |
| Tema Terang / Gelap | Light/dark theme yang tersimpan di localStorage.                                                              |
| Responsif           | Layout desktop primary, tetap nyaman dipakai di mobile.                                                       |

## Tech Stack

| Bagian      | Teknologi                               |
| :---------- | :-------------------------------------- |
| Framework   | React 19 + Vite 8                       |
| Bahasa      | TypeScript 6 (strict)                   |
| Styling     | Tailwind CSS 4 + shadcn/ui              |
| State       | Zustand 5 + persist                     |
| Routing     | React Router 7 (`createBrowserRouter`)  |
| Chart       | Recharts 3                              |
| Map         | Leaflet + OpenStreetMap tiles           |
| Form        | React Hook Form 7                       |
| i18n        | Dictionary manual `id` / `en`           |
| Icon        | lucide-react                            |
| Lint/Format | ESLint + Prettier + Husky + lint-staged |
| Deploy      | Vercel (SPA fallback via `vercel.json`) |

## Struktur Folder

```text
MediFlow/
├── docs/                 # Dokumentasi teknis (setup, arsitektur, deployment)
├── PRD/                  # Product Requirements Document
├── public/               # Aset statis (logo)
├── src/
│   ├── components/       # Komponen UI reusable (shadcn/ui + custom)
│   ├── data/             # Mock data (users, hospitals, medicines, dll.)
│   ├── features/         # Halaman & modul per fitur (dashboard, network, analytics, dll.)
│   ├── hooks/            # Custom hooks
│   ├── i18n/             # File terjemahan id / en
│   ├── router/           # Konfigurasi routing
│   ├── store/            # Zustand store
│   ├── types/            # TypeScript types
│   └── utils/            # Helper functions
├── package.json          # Dependency & npm scripts
├── vite.config.ts        # Konfigurasi Vite & alias @/
└── vercel.json           # SPA fallback untuk Vercel
```

## Demo Akun

Login menggunakan mode demo. Pilih salah satu akun berikut tanpa memasukkan password:

| Nama                      | Peran     | Rumah Sakit                  |
| :------------------------ | :-------- | :--------------------------- |
| Rina Wulandari, S.Farm.   | requester | RSUD Dr. Soetomo             |
| Budi Santoso, S.Kep.      | requester | RSUD Dr. M. Soewandhie       |
| Dewi Lestari, A.Md.Far.   | requester | RS Universitas Airlangga     |
| dr. Andi Pratama, Sp.A(K) | approver  | RS Siloam Hospitals Surabaya |
| Siti Rahayu, S.Farm.      | approver  | RS PHC Surabaya              |

## Instalasi dan Menjalankan Secara Lokal

### 1. Prasyarat

Pastikan tool berikut sudah terpasang di mesin Anda:

| Tool                           | Versi Minimum | Cek Versi        |
| :----------------------------- | :------------ | :--------------- |
| [Node.js](https://nodejs.org/) | >= 20         | `node --version` |
| [pnpm](https://pnpm.io/)       | >= 9          | `pnpm --version` |
| [Git](https://git-scm.com/)    | -             | `git --version`  |

> Project ini menggunakan **pnpm** (terdapat `pnpm-lock.yaml`). Menggunakan `npm` atau `yarn` dapat menghasilkan lockfile berbeda dan menyebabkan mismatch dependency.

### 2. Clone Repository

```bash
git clone https://github.com/jmahiswara1/MediFlow.git
cd MediFlow
```

> Jika sudah pernah clone, ambil kode terbaru dengan `git pull`.

### 3. Instalasi Dependency

```bash
pnpm install
```

Perintah ini membaca `pnpm-lock.yaml` sehingga versi dependency selalu konsisten.

### 4. Menjalankan Development Server

```bash
pnpm dev
```

Aplikasi berjalan di **http://localhost:5173** dengan fitur **Hot Module Replacement (HMR)**: setiap perubahan kode langsung terlihat tanpa perlu refresh manual.

### 5. Build dan Preview Produksi (Opsional)

```bash
pnpm build
pnpm preview
```

- `pnpm build` menjalankan type-check (`tsc -b`) lalu menghasilkan build produksi di folder `dist/`.
- `pnpm preview` menjalankan preview lokal dari hasil build `dist/`.

## Daftar Perintah

Semua perintah dijalankan dari root project:

| Perintah            | Deskripsi                                                                 |
| :------------------ | :------------------------------------------------------------------------ |
| `pnpm dev`          | Menjalankan dev server (Vite) dengan HMR.                                 |
| `pnpm build`        | Type-check lalu build produksi ke folder `dist/`.                         |
| `pnpm preview`      | Preview lokal dari hasil build `dist/`.                                   |
| `pnpm lint`         | Menjalankan ESLint di seluruh project.                                    |
| `pnpm lint:fix`     | ESLint dan otomatis memperbaiki error yang bisa diperbaiki.               |
| `pnpm format`       | Memformat seluruh project dengan Prettier.                                |
| `pnpm format:check` | Mengecek apakah semua file sudah sesuai format Prettier (tanpa mengubah). |

### Alur Pengecekan Sebelum Push

```bash
pnpm lint
pnpm format:check
pnpm build
```

## Deployment

Aplikasi di-deploy ke **Vercel** sebagai static SPA.

### Via Vercel Dashboard

1. Buka [vercel.com](https://vercel.com) dan pilih **Add New** lalu **Project**.
2. Import repository GitHub **MediFlow**.
3. Konfigurasi build (biasanya terdeteksi otomatis):

| Setting              | Nilai          |
| :------------------- | :------------- |
| **Framework Preset** | `Vite`         |
| **Build Command**    | `pnpm build`   |
| **Output Directory** | `dist`         |
| **Install Command**  | `pnpm install` |

4. Klik **Deploy**.

### Via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel            # deploy preview
vercel --prod     # deploy ke production
```

> Setiap push ke `main` akan otomatis memicu deployment production. File `vercel.json` berisi SPA fallback (rewrite semua route ke `index.html`) agar refresh halaman tidak menghasilkan 404.

## Sumber Daya Tambahan

- **PRD (Product Requirements Document):** berisi visi, spesifikasi fitur, data model, acceptance criteria, dan roadmap. Lihat [`PRD/README.md`](./PRD/README.md).
- **Dokumentasi Teknis:** setup environment, arsitektur, konvensi kode, git workflow, dan deployment. Lihat [`docs/README.md`](./docs/README.md).
