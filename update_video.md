# Cara Menambah Video Portofolio

## 1. Ambil YouTube ID

Dari link YouTube Shorts, misalnya:
```
https://www.youtube.com/shorts/dPOP97WSU3A
                                ^^^^^^^^^^^
                             ini = YouTube ID
```

## 2. Salin template berikut ke `index.html`

Cari bagian `<div class="portfolio-grid">`, lalu tambahkan artikel baru di bawah video terakhir (sebelum `</div>`):

```html
<!-- Video N -->
<article class="card" data-index="N" data-title="Judul Video" data-category="KATEGORI" data-youtube-id="YOUTUBE_ID_DISINI">
  <div class="thumb yt-thumb">
    <img src="https://i.ytimg.com/vi/YOUTUBE_ID_DISINI/maxresdefault.jpg" alt="Judul Video" loading="lazy">
    <div class="yt-play-btn" aria-hidden="true">
      <svg viewBox="0 0 68 48" fill="none"><rect width="68" height="48" rx="10" fill="#FF0000" fill-opacity=".9"/><polygon points="28,16 28,32 46,24" fill="#fff"/></svg>
    </div>
  </div>
  <div class="card-category">KATEGORI</div>
  <h3>Judul Video</h3>
</article>
```

## 3. Isi yang perlu diganti

| Placeholder | Isi dengan |
|---|---|
| `YOUTUBE_ID_DISINI` | ID dari URL YouTube Shorts (2 tempat) |
| `Judul Video` | Judul yang muncul di bawah card |
| `KATEGORI` | Contoh: REVIEW PRODUK, ENDORSE PRODUK, dll |
| `N` pada `data-index` | Nomor urut (0, 1, 2, ...) |

> **Catatan:** `data-index` harus urut dari 0. Jika sudah ada 12 video, video baru pakai `data-index="12"`.
