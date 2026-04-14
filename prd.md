Product Requirement Document (PRD): Klinik Hewan Company Profile (Astro SSR)

1. Ikhtisar Proyek

Proyek ini adalah pembuatan situs web profil perusahaan (Company Profile) untuk sebuah klinik hewan. Situs ini menggunakan framework Astro (Mode Server-Side Rendering / SSR) dengan Tailwind CSS dan komponen shadcn/ui (menggunakan React).

Arsitektur aplikasi akan di-deploy ke VPS menggunakan Docker (Node adapter standalone). Data artikel (blog) dan pengiriman form booking akan terhubung (dikonsumsi) dari API Backend eksternal yang sudah ada.

2. Tech Stack & Dependensi

Framework Utama: Astro (versi terbaru)

Mode Render: SSR (output: 'server')

Adapter Server: @astrojs/node (konfigurasi mode: 'standalone')

Styling: Tailwind CSS

UI Components: shadcn/ui (React integrasi) -> Butuh komponen: button, input, label, card, dialog.

API Communication: Native fetch() bawaan Astro/Node.

Environment Variables:

API_BACKEND_URL: Base URL untuk mengambil artikel dan mengirim booking.

API_SECRET_KEY: Token rahasia (Bearer) untuk otorisasi POST request.

3. Struktur Direktori & Rute yang Dibutuhkan

AI harus menghasilkan kode dengan struktur file dan perutean (routing) berikut:

src/
├── components/
│   ├── ui/               (Komponen otomatis dari shadcn/ui)
│   └── BookingModal.jsx  (Pulau interaktif React untuk fitur Booking)
├── layouts/
│   └── MainLayout.astro  (Kerangka global: Navbar, Main slot, Footer)
├── pages/
│   ├── api/
│   │   └── booking.js    (Astro Server Endpoint untuk POST form secara rahasia)
│   ├── artikel/
│   │   ├── [slug].astro  (Halaman detail spesifik artikel)
│   │   └── index.astro   (Daftar artikel - grid view)
│   ├── 404.astro         (Halaman Custom Error: Not Found)
│   ├── 500.astro         (Halaman Custom Error: Server Error)
│   └── index.astro       (Halaman Beranda Statis)


4. Spesifikasi Halaman & Fitur

A. Global Layout (MainLayout.astro)

Memiliki Navbar di bagian atas yang seragam.

Menu navigasi: "Beranda" (/), "Artikel" (/artikel), dan pemanggilan komponen <BookingModal client:load /> di ujung kanan navbar.

Memiliki Footer sederhana di bagian bawah.

Konten spesifik halaman di-render melalui <slot /> dengan kontainer yang terpusat (misal: max-w-7xl mx-auto).

B. Halaman Beranda (index.astro)

Murni HTML/Astro statis dengan styling Tailwind.

Bagian: Hero section (Selamat datang di Klinik Hewan), Ringkasan Layanan, dan tombol Call-to-Action.

C. Fitur Artikel (Konsumsi API)

Daftar Artikel (artikel/index.astro):

Mengambil data live (SSR) dengan fetch dari process.env.API_BACKEND_URL/articles.

Menampilkan data menggunakan komponen <Card> dari shadcn.

Setiap kartu menampilkan: Gambar Thumbnail, Judul, Ringkasan, dan dapat diklik untuk menuju detail artikel.

Detail Artikel (artikel/[slug].astro):

Mengambil slug dari URL parameter (karena SSR, tidak butuh getStaticPaths).

fetch data spesifik dari process.env.API_BACKEND_URL/articles/{slug}.

Menampilkan Judul lengkap, Tanggal, dan konten artikel (HTML).

D. Fitur Booking (Modal React + Astro API Route)

Komponen Klien (BookingModal.jsx):

Dibuat menggunakan komponen <Dialog> shadcn/ui.

State: isOpen, isLoading, status (idle, success, error).

Form field: namaPemilik (text), namaHewan (text), tanggalBooking (date).

Saat disubmit (e.preventDefault()), mengirim payload JSON via fetch POST ke endpoint internal /api/booking.

Memberikan feedback visual (tulisan "Mengirim...", pesan sukses hijau, pesan error merah). Otomatis menutup jika sukses setelah 2 detik.

Astro Server Endpoint (api/booking.js):

Menerima POST request JSON dari React Modal.

Meneruskan data ke eksternal API: fetch POST ke process.env.API_BACKEND_URL/bookings.

Wajib menyisipkan header: Authorization: Bearer process.env.API_SECRET_KEY.

Merespons balik ke React Modal dengan JSON (sukses/gagal) dan HTTP status code yang sesuai (200, 400, 500). Tidak melakukan redirect.

E. Penanganan Error (Custom Error Pages)

Halaman 404 (404.astro):

Ditampilkan saat rute tidak ditemukan atau detail artikel ([slug]) mengembalikan status 404 dari API.

UI menggunakan Tailwind: Ilustrasi lucu (misal siluet anjing/kucing hilang), teks ramah "Ups, halaman yang Anda cari tidak ada atau anjing pelacak kami kehilangan jejak", dan sebuah <Button> shadcn untuk "Kembali ke Beranda".

Halaman 500 (500.astro):

Ditampilkan jika terjadi error server internal atau kegagalan koneksi massal ke Backend API.

Menampilkan pesan teknis minimal namun ramah: "Sistem klinik sedang mengalami gangguan teknis sementara. Tim kami sedang menanganinya." dan tombol kembali ke beranda.

5. Instruksi Khusus untuk AI

Jangan menggunakan metode fetch di komponen React jika tidak benar-benar diperlukan untuk interaktivitas pengguna. Pemanggilan API untuk menampilkan data harus dilakukan di Component Script Astro (di antara ---).

Terapkan implementasi dark mode standar shadcn (jika dikonfigurasi) atau cukup gunakan palet warna terang yang bersih dengan warna utama biru (mewakili kesehatan/medis).

Pastikan konfigurasi Dockerfile (jika diminta) disiapkan untuk lingkungan Node SSR standalone dengan multi-stage build yang memisahkan tahap dependencies, builder, dan runner.