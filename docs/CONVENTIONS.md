# Konvensi Penulisan Kode

Standar gaya kode project ini agar codebase konsisten. Sebagian besar aturan sudah diterapkan otomatis oleh Prettier & ESLint.

---

## 1. Prettier (Formatting)

Konfigurasi di `.prettierrc` (diterapkan otomatis saat commit):

| Aturan          | Nilai                                                           |
| :-------------- | :-------------------------------------------------------------- |
| `semi`          | `false` (tanpa titik koma)                                      |
| `singleQuote`   | `true` (petik tunggal `'`)                                      |
| `trailingComma` | `all` (koma di akhir semua argumen)                             |
| `printWidth`    | `100`                                                           |
| `tabWidth`      | `2`                                                             |
| Plugin          | `prettier-plugin-tailwindcss` (urutkan class Tailwind otomatis) |

Contoh yang benar:

```ts
const message = 'hello'
function greet(name: string) {
  return `Halo, ${name}!`
}
```

> Prettier berjalan otomatis lewat Husky + lint-staged saat `git commit`. File yang diubah dan belum terformat akan diperbaiki otomatis.

---

## 2. TypeScript (Strict)

Konfigurasi di `tsconfig.app.json` menyalakan mode ketat:

- `noUnusedLocals` & `noUnusedParameters`: variabel/parameter tak terpakai = error.
- `verbatimModuleSyntax`: pakai `import type` untuk import type saja:

```ts
// Salah
import { Obat } from '@/types'

// Benar
import type { Obat } from '@/types'
```

- `erasableSyntaxOnly`: tidak memakai enum/dekorator runtime; gunakan union type.
- `allowImportingTsExtensions`: boleh import dengan ekstensi `.ts`/`.tsx`.

### Pedoman Type

- Selalu beri type eksplisit untuk parameter fungsi dan return yang tidak jelas.
- Hindari `any`. Jika tidak tahu typenya, gunakan `unknown` lalu narrow.
- Type terpusat di `src/types/index.ts` (lihat `ARCHITECTURE.md`).

---

## 3. Styling (Tailwind CSS)

- Utility class Tailwind dipakai langsung di JSX. Hindari file CSS custom untuk hal yang bisa dilakukan Tailwind.
- `prettier-plugin-tailwindcss` akan mengurutkan class otomatis.
- Untuk class bersyarat, gunakan utility `cn` dari `@/lib/utils` (menggabungkan `clsx` + `tailwind-merge`):

```tsx
import { cn } from '@/lib/utils'

;<div className={cn('px-4 py-2', isActive && 'bg-blue-500 text-white')}>...</div>
```

---

## 4. Komponen

- Komponen di `components/ui/` adalah hasil shadcn. Sebaiknya tidak diubah manual. Tambah komponen via CLI:
  ```bash
  pnpm dlx shadcn@latest add <component>
  ```
- Komponen yang dipakai berulang dan bukan bagian dari satu fitur ditaruh di `components/`.
- Komponen spesifik fitur ditaruh di dalam folder `features/<fitur>/`.

---

## 5. ESLint & Pengecekan Sebelum Commit

Sebelum `git commit` / push, pastikan lolos semua:

```bash
pnpm lint          # ESLint
pnpm format:check  # Prettier
pnpm build         # Type-check + build
```

Alur otomatis saat commit:

1. Husky `pre-commit` menjalankan `pnpm exec lint-staged`.
2. lint-staged menjalankan ESLint (`--fix`) + Prettier (`--write`) hanya pada file yang di-_stage_.
3. Jika ada error, commit **ditolak**. Perbaiki dulu lalu commit ulang.

---

## 6. Naming Convention

| Elemen                            | Aturan             | Contoh                                |
| :-------------------------------- | :----------------- | :------------------------------------ |
| File `.tsx` (komponen/halaman)    | `PascalCase`       | `DashboardPage.tsx`                   |
| File `.ts` (util/hook/store/type) | `camelCase`        | `stockStore.ts`, `useStockSummary.ts` |
| Komponen React                    | `PascalCase`       | `function Button()`                   |
| Fungsi / variabel                 | `camelCase`        | `handleSubmit`, `isLoading`           |
| Konstanta                         | `UPPER_SNAKE_CASE` | `MAX_RETRY`                           |
| Type / Interface                  | `PascalCase`       | `interface TransferRequest`           |
| Folder fitur                      | `kebab-case`       | `stock-map`, `ai-chat`                |

---

## 7. Hal yang Dihindari

- Menyimpan _secret_ / API key di kode. Gunakan `.env` (pastikan di `.gitignore`).
- Menggunakan `any` tanpa alasan.
- Menghapus/memodifikasi `pnpm-lock.yaml` secara manual.
- Commit hasil `dist/` atau `node_modules` (sudah di `.gitignore`).
- Menambah komentar yang tidak diperlukan (kode bersih > komentar).
