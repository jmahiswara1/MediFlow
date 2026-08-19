# Setup & Instalasi

Panduan untuk menyiapkan environment pengembangan **MediFlow** dari awal di mesin lokal.

---

## 1. Prasyarat

Pastikan tool berikut sudah terpasang sebelum mulai:

| Tool                           | Versi Minimum | Versi Teruji | Cek Versi        |
| :----------------------------- | :------------ | :----------- | :--------------- |
| [Node.js](https://nodejs.org/) | ≥ 20          | `v24.18.0`   | `node --version` |
| [pnpm](https://pnpm.io/)       | ≥ 9           | `11.9.0`     | `pnpm --version` |
| [Git](https://git-scm.com/)    | -             | -            | `git --version`  |

> **Catatan:** Project ini menggunakan **pnpm** (ada file `pnpm-lock.yaml`). `npm` atau `yarn` dapat membuat lockfile berbeda dan menyebabkan mismatch dependency.

---

## 2. Clone Repository

```bash
git clone https://github.com/jmahiswara1/MediFlow.git
cd MediFlow
```

> Jika sudah pernah clone, ambil kode terbaru dengan `git pull`.

---

## 3. Instalasi Dependency

```bash
pnpm install
```

Perintah ini membaca `pnpm-lock.yaml` sehingga versi dependency selalu sama.

---

## 4. Menjalankan Development Server

```bash
pnpm dev
```

Server akan berjalan di **`http://localhost:5173`** dengan fitur **Hot Module Replacement (HMR)**: perubahan kode langsung terlihat tanpa refresh manual.

---

## 5. Daftar Perintah (NPM Scripts)

Semua perintah dijalankan dari root project:

| Perintah            | Deskripsi                                                                 |
| :------------------ | :------------------------------------------------------------------------ |
| `pnpm dev`          | Menjalankan dev server (Vite) dengan HMR.                                 |
| `pnpm build`        | Type-check (`tsc -b`) lalu build produksi ke folder `dist/`.              |
| `pnpm preview`      | Menjalankan preview lokal dari hasil build `dist/`.                       |
| `pnpm lint`         | Menjalankan ESLint di seluruh project.                                    |
| `pnpm lint:fix`     | Menjalankan ESLint dan otomatis memperbaiki error yang bisa diperbaiki.   |
| `pnpm format`       | Menformat seluruh project dengan Prettier.                                |
| `pnpm format:check` | Mengecek apakah semua file sudah sesuai format Prettier (tanpa mengubah). |
| `pnpm prepare`      | Setup Husky (dijalankan otomatis saat `pnpm install`).                    |

### Alur Pengecekan Sebelum Push

Jalankan ini sebelum push / membuat PR:

```bash
pnpm lint
pnpm format:check
pnpm build
```

---

## 6. Path Alias

Project menggunakan path alias `@/` yang mengarah ke folder `src/` (dikonfigurasi di `vite.config.ts` dan `tsconfig.app.json`).

```ts
import { Button } from '@/components/ui/button'
import { useStockStore } from '@/store'
```

> Import dari `src/` memakai alias `@/` (bukan relative path seperti `../../src/...`).

---

## 7. Troubleshooting Umum

| Masalah                             | Solusi                                                           |
| :---------------------------------- | :--------------------------------------------------------------- |
| `pnpm: command not found`           | Install pnpm dulu: `npm install -g pnpm`                         |
| Port 5173 sudah terpakai            | Jalankan `pnpm dev --port 3000` atau atur port lain.             |
| Dependency bermasalah / aneh        | Hapus lockfile lokal & `node_modules` lalu `pnpm install` ulang. |
| Error "typescript-eslint" saat lint | Pastikan sudah `pnpm install` (tanpa flag `--production`).       |

---

## 8. File Penting di Root

| File                                                         | Fungsi                                              |
| :----------------------------------------------------------- | :-------------------------------------------------- |
| `package.json`                                               | Daftar dependency & npm scripts.                    |
| `pnpm-lock.yaml`                                             | Lockfile pnpm. Di-commit ke repo dan tidak dihapus. |
| `vite.config.ts`                                             | Konfigurasi Vite & alias `@/`.                      |
| `tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json` | Konfigurasi TypeScript.                             |
| `components.json`                                            | Konfigurasi shadcn/ui.                              |
| `.prettierrc`                                                | Aturan format Prettier.                             |
| `.husky/pre-commit`                                          | Git hook yang menjalankan lint-staged saat commit.  |
