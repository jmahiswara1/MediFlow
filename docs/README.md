# MediFlow: Dokumentasi Pengembangan

**Prediksi Stok & Distribusi Medis Berbasis AI**

Dokumen ini adalah referensi pengembangan project **MediFlow**: cara setup, struktur code, konvensi kode, alur Git, dan deployment.

---

## Daftar Isi

| Dokumen                                | Isi                                                                                   |
| :------------------------------------- | :------------------------------------------------------------------------------------ |
| [`SETUP.md`](./SETUP.md)               | Prasyarat, instalasi dependency, dan perintah sehari-hari (dev, build, lint, format). |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Tech stack, struktur folder `src/`, routing, state management, dan alur data.         |
| [`CONVENTIONS.md`](./CONVENTIONS.md)   | Standar gaya kode (Prettier, TypeScript, ESLint).                                     |
| [`GIT-WORKFLOW.md`](./GIT-WORKFLOW.md) | Aturan commit (Conventional Commits) serta rules Pull Request / Merge Request.        |
| [`DEPLOYMENT.md`](./DEPLOYMENT.md)     | Cara build dan deploy ke Vercel.                                                      |

---

## Ringkasan Project

MediFlow adalah platform pemantauan dan distribusi stok obat/alat medis berbasis AI. Sistem memprediksi kebutuhan tiap rumah sakit berdasarkan tren kasus penyakit dan menghubungkan fasilitas kesehatan yang kekurangan stok dengan rumah sakit lain yang memiliki surplus.

### Tech Stack Inti

| Bagian             | Teknologi                           |
| :----------------- | :---------------------------------- |
| Framework          | React 19 + Vite 8                   |
| Bahasa             | TypeScript                          |
| Styling            | Tailwind CSS 4                      |
| UI Components      | shadcn/ui (base-nova), Lucide React |
| State Management   | Zustand                             |
| Form               | React Hook Form                     |
| Routing            | React Router 7                      |
| Data Visualization | Recharts                            |

> Untuk detail lebih lengkap, lihat [`ARCHITECTURE.md`](./ARCHITECTURE.md).

### Mulai Cepat

```bash
pnpm install
pnpm dev
```

Buka `http://localhost:5173` di browser. Panduan lengkap ada di [`SETUP.md`](./SETUP.md).

---

> Dokumentasi ini (`docs/`) diperbarui setiap kali ada perubahan besar pada arsitektur, script, atau alur kerja.
