// stok.js
document.addEventListener("DOMContentLoaded", () => {
  if (typeof dataKatalogBuku === "undefined") {
    console.error("dataKatalogBuku tidak ditemukan. Pastikan data.js dimuat sebelum stok.js");
    return;
  }

  const bookList = document.getElementById("bookList");
  const searchInput = document.getElementById("searchInput");
  const tambahForm = document.getElementById("tambahForm");

  // render buku ke DOM
  function renderBooks(list) {
    bookList.innerHTML = "";
    if (!list.length) {
      bookList.innerHTML = `<p class="text-center text-muted">Tidak ada buku.</p>`;
      return;
    }

    list.forEach(item => {
      const col = document.createElement("div");
      col.className = "col-sm-6 col-md-4 col-lg-3";

      // fallback cover jika kosong
      const coverSrc = item.cover && item.cover.trim() !== "" ? item.cover : "img/logo.png";

      col.innerHTML = `
        <div class="card h-100 p-2">
          <div class="book-card d-flex flex-column align-items-center">
            <img src="${coverSrc}" alt="${escapeHtml(item.namaBarang)}" class="w-100 mb-2" />
            <div class="card-body d-flex flex-column">
              <h6 class="fw-bold mb-1">${escapeHtml(item.namaBarang)}</h6>
              <p class="small-muted mb-1">Kode: <span class="stok-badge">${escapeHtml(item.kodeBarang)}</span></p>
              <p class="small-muted mb-1">Jenis: ${escapeHtml(item.jenisBarang)} · Edisi: ${escapeHtml(item.edisi)}</p>
              <p class="mb-1 fw-semibold">Stok: <span class="text-primary">${item.stok}</span></p>
              <p class="mb-2 fw-bold">${escapeHtml(item.harga)}</p>
              <div class="mt-auto d-grid gap-2">
                <button class="btn btn-outline-primary btn-sm btn-pesan" data-kode="${escapeHtml(item.kodeBarang)}">Pesan</button>
                <button class="btn btn-outline-secondary btn-sm btn-edit" data-kode="${escapeHtml(item.kodeBarang)}">Edit</button>
              </div>
            </div>
          </div>
        </div>
      `;
      bookList.appendChild(col);
    });

    // attach event ke tombol Pesan (contoh arahkan ke checkout)
    document.querySelectorAll(".btn-pesan").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const kode = e.currentTarget.dataset.kode;
        // kirim user ke halaman checkout dengan query param kodeBarang
        window.location.href = `checkout.html?kode=${encodeURIComponent(kode)}`;
      });
    });

    // attach event edit (contoh membuka modal tambah dengan prefill sederhana)
    document.querySelectorAll(".btn-edit").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const kode = e.currentTarget.dataset.kode;
        openEditModal(kode);
      });
    });
  }

  // escape sederhana untuk mencegah XSS ketika mengambil data string
  function escapeHtml(text) {
    if (!text && text !== 0) return "";
    return String(text)
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'", "&#039;");
  }

  // fitur search
  searchInput.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase().trim();
    const filtered = dataKatalogBuku.filter(b => {
      return (
        (b.namaBarang && b.namaBarang.toLowerCase().includes(q)) ||
        (b.kodeBarang && b.kodeBarang.toLowerCase().includes(q)) ||
        (b.jenisBarang && b.jenisBarang.toLowerCase().includes(q)) ||
        (b.harga && b.harga.toLowerCase().includes(q))
      );
    });
    renderBooks(filtered);
  });

  // form tambah stok -> tambahkan ke dataKatalogBuku dan re-render
  tambahForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const newItem = {
      kodeBarang: document.getElementById("inputKode").value.trim(),
      namaBarang: document.getElementById("inputNama").value.trim(),
      jenisBarang: document.getElementById("inputJenis").value.trim(),
      edisi: document.getElementById("inputEdisi").value.trim(),
      stok: Number(document.getElementById("inputStok").value) || 0,
      harga: document.getElementById("inputHarga").value.trim(),
      cover: document.getElementById("inputCover").value.trim()
    };

    // minimal validasi
    if (!newItem.kodeBarang || !newItem.namaBarang) {
      alert("Kode dan nama barang wajib diisi.");
      return;
    }

    // cekk duplikat kode
    const exists = dataKatalogBuku.some(b => b.kodeBarang === newItem.kodeBarang);
    if (exists) {
      alert("Kode barang sudah ada. Gunakan kode unik atau edit yang sudah ada.");
      return;
    }

    // masukkan ke array (sementara di memori)
    dataKatalogBuku.push(newItem);

    // reset form & tutup modal
    tambahForm.reset();
    const tambahModalEl = document.getElementById("tambahModal");
    const tambahModal = bootstrap.Modal.getInstance(tambahModalEl) || new bootstrap.Modal(tambahModalEl);
    tambahModal.hide();

    // re-render (tampilkan seluruh data setelah tambah)
    renderBooks(dataKatalogBuku);
  });

  // fungsi buka modal edit sederhana (prefill form agar user bisa edit lalu simpan)
  function openEditModal(kode) {
    const item = dataKatalogBuku.find(b => b.kodeBarang === kode);
    if (!item) return alert("Item tidak ditemukan.");

    // isi form modal (kita pakai modal tambah untuk edit dengan sedikit penyesuaian)
    document.getElementById("inputKode").value = item.kodeBarang;
    document.getElementById("inputNama").value = item.namaBarang;
    document.getElementById("inputJenis").value = item.jenisBarang;
    document.getElementById("inputEdisi").value = item.edisi;
    document.getElementById("inputStok").value = item.stok;
    document.getElementById("inputHarga").value = item.harga;
    document.getElementById("inputCover").value = item.cover;

    // show modal
    const tambahModalEl = document.getElementById("tambahModal");
    const tambahModal = bootstrap.Modal.getOrCreateInstance(tambahModalEl);
    tambahModal.show();

    // override submit handler to perform update (one-time)
    const handler = function(ev) {
      ev.preventDefault();
      // update fields
      item.namaBarang = document.getElementById("inputNama").value.trim();
      item.jenisBarang = document.getElementById("inputJenis").value.trim();
      item.edisi = document.getElementById("inputEdisi").value.trim();
      item.stok = Number(document.getElementById("inputStok").value) || 0;
      item.harga = document.getElementById("inputHarga").value.trim();
      item.cover = document.getElementById("inputCover").value.trim();

      // reset & close
      tambahForm.reset();
      tambahModal.hide();

      // re-render
      renderBooks(dataKatalogBuku);

      // hapus handler setelah dipakai
      tambahForm.removeEventListener("submit", handler);
      // kembalikan handler default (yang menambah) dengan menambahkan kembali listener default
      tambahForm.addEventListener("submit", addNewHandler);
    };

    // simpan handler add baru agar bisa restore nanti
    tambahForm.removeEventListener("submit", addNewHandler);
    tambahForm.addEventListener("submit", handler);
  }

  // store original add handler reference supaya bisa di-remove/restore
  function addNewHandler(e) {
    e.preventDefault();
    // sama implementasi seperti di atas, tapi terpisah supaya bisa direstore
    const newItem = {
      kodeBarang: document.getElementById("inputKode").value.trim(),
      namaBarang: document.getElementById("inputNama").value.trim(),
      jenisBarang: document.getElementById("inputJenis").value.trim(),
      edisi: document.getElementById("inputEdisi").value.trim(),
      stok: Number(document.getElementById("inputStok").value) || 0,
      harga: document.getElementById("inputHarga").value.trim(),
      cover: document.getElementById("inputCover").value.trim()
    };

    if (!newItem.kodeBarang || !newItem.namaBarang) {
      alert("Kode dan nama barang wajib diisi.");
      return;
    }
    const exists = dataKatalogBuku.some(b => b.kodeBarang === newItem.kodeBarang);
    if (exists) {
      alert("Kode barang sudah ada. Gunakan kode unik atau edit yang sudah ada.");
      return;
    }

    dataKatalogBuku.push(newItem);
    tambahForm.reset();
    const tambahModalEl = document.getElementById("tambahModal");
    const tambahModal = bootstrap.Modal.getInstance(tambahModalEl) || new bootstrap.Modal(tambahModalEl);
    tambahModal.hide();
    renderBooks(dataKatalogBuku);
  }

  // pasang handler default add
  tambahForm.addEventListener("submit", addNewHandler);

  // initial render
  renderBooks(dataKatalogBuku);
});
