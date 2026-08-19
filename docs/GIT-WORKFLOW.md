# Git Workflow: Commit, Pull Request, Merge Request

Aturan wajib untuk alur kerja Git di project **MediFlow**. Remote repo utama: GitHub (`github.com/jmahiswara1/MediFlow`).

---

## 1. Conventional Commits

Project ini menggunakan **Conventional Commits**. Format pesan commit:

```text
type: short description
```

### Type yang Diizinkan (WAJIB salah satu)

| Type       | Kegunaan                                         | Contoh                            |
| :--------- | :----------------------------------------------- | :-------------------------------- |
| `feat`     | Fitur baru                                       | `feat: add stock transfer form`   |
| `fix`      | Perbaikan bug                                    | `fix: correct chart y-axis scale` |
| `docs`     | Perubahan dokumentasi                            | `docs: add git workflow guide`    |
| `style`    | Perubahan gaya kode / UI (tanpa mengubah logika) | `style: unify button spacing`     |
| `refactor` | Refactor tanpa mengubah perilaku                 | `refactor: extract stock hook`    |

### Aturan Deskripsi

- Singkat, imperatif (perintah), huruf kecil, tanpa tanda titik di akhir.
- Maksimal ±50 karakter (bila lebih, pertimbangkan dipecah jadi beberapa commit).
- Fokus: **apa** yang diubah, bukan bagaimana caranya.

### Contoh

Benar:
feat: add hospital surplus filter
fix: prevent crash on empty stock list
docs: add PR template
style: align sidebar icons
refactor: split transfer store

Salah:
feat (typo type) / update / bikin fitur baru (tidak imperatif)
fix: fix bug (terlalu umum, jelaskan bug apa)
docs: Update README (huruf besar & bukan imperatif)

### Scope (Opsional)

Bisa menambahkan scope dalam kurung untuk memperjelas area yang diubah:

```text
feat(transfer): add multi-hospital request
fix(dashboard): correct trend chart labels
```

---

## 2. Alur Sebelum Commit

1. Cek perubahan:
   ```bash
   git status
   git diff
   ```
2. Pastikan lolos pengecekan:
   ```bash
   pnpm lint
   pnpm format:check
   ```
3. Stage file yang relevan saja (jangan `git add .` asal-asalan):
   ```bash
   git add <file-yang-diubah>
   ```
4. Commit dengan pesan konvensional:
   ```bash
   git commit -m "feat: add transfer form"
   ```

> Husky `pre-commit` akan menjalankan lint-staged otomatis. Jika ada file yang di-_stage_ belum lolos lint/format, commit **ditolak** hingga diperbaiki.

---

## 3. Branch Rules

| Aturan                           | Keterangan                                        |
| :------------------------------- | :------------------------------------------------ |
| Branch utama                     | `main` (production-ready).                        |
| Jangan commit langsung ke `main` | Semua perubahan lewat branch fitur + PR.          |
| Nama branch                      | `feat/...`, `fix/...`, `docs/...`, `refactor/...` |
| Base branch                      | Feature branch dibuat dari `main` (terbaru).      |

Contoh nama branch:

```text
feat/stock-transfer-form
fix/dashboard-crash
docs/git-workflow
refactor/stock-store
```

### Alur Kerja Harian

```bash
git switch main
git pull                       # ambil update terbaru
git switch -c feat/nama-fitur  # buat branch fitur baru
# ...kerjakan perubahan...
git add <file>
git commit -m "feat: ..."
git push -u origin feat/nama-fitur
# buka PR di GitHub
```

---

## 4. Pull Request (PR) Rules: GitHub

Repo utama memakai GitHub, jadi gunakan **Pull Request**.

### Judul PR

Judul PR **mengikuti format conventional commit**:

```text
feat: add stock transfer form
```

### Body PR (Template)

Gunakan struktur berikut pada body PR:

````markdown
## Deskripsi

- Jelaskan perubahan yang dilakukan dan alasannya.

## Perubahan

- Daftar perubahan utama (poin-poin).

## Screenshot (opsional)

[tempel screenshot]

### Checklist Sebelum Merge

- [ ] Branch up-to-date dengan `main` (rebase/pull terbaru).
- [ ] `pnpm lint` lolos.
- [ ] `pnpm format:check` lolos.
- [ ] `pnpm build` berhasil.
- [ ] Sudah di-test manual sesuai langkah di body PR.
- [ ] Minimal **1 reviewer menyetujui** (approve).
- [ ] Tidak ada conflict.

---

## 5. Pesan Commit & Changelog

Karena commit sudah menggunakan format konvensional, riwayat commit otomatis terbaca sebagai changelog:

```text
docs: add git workflow guide
feat(transfer): add multi-hospital request
fix(dashboard): correct trend chart labels
style: unify button spacing
refactor: extract stock hook
```
````
