document.addEventListener("DOMContentLoaded", () => {
  const pilihBuku = document.getElementById("pilihBuku");
  const hargaInput = document.getElementById("harga");
  const totalInput = document.getElementById("totalHarga");
  const form = document.getElementById("checkoutForm");
  const btnKembali = document.getElementById("btnKembali");

  // Pastikan data.js sudah ada
  if (typeof dataKatalogBuku === "undefined") {
    alert("⚠️ File data.js belum dimuat atau path-nya salah!");
    return;
  }

  // 1️⃣ Isi dropdown buku dari data.js
  dataKatalogBuku.forEach((buku) => {
    const option = document.createElement("option");
    option.value = buku.kodeBarang;
    option.textContent = `${buku.namaBarang} - ${buku.harga}`;
    option.dataset.harga = buku.harga.replace(/[^\d]/g, ""); // Simpan angka saja
    pilihBuku.appendChild(option);
  });

  // 2️⃣ Tambahkan input jumlah buku (qty)
  const qtyDiv = document.createElement("div");
  qtyDiv.classList.add("mb-3");
  qtyDiv.innerHTML = `
    <label for="jumlahBuku" class="form-label">Jumlah Buku</label>
    <input type="number" id="jumlahBuku" class="form-control" min="1" value="1" required>
  `;
  form.insertBefore(qtyDiv, totalInput.parentElement);

  // 3️⃣ Saat user pilih buku, tampilkan harga
  pilihBuku.addEventListener("change", () => {
    const selectedOption = pilihBuku.options[pilihBuku.selectedIndex];
    const harga = parseInt(selectedOption.dataset.harga || 0);
    hargaInput.value = `Rp ${harga.toLocaleString("id-ID")}`;
    const qty = parseInt(document.getElementById("jumlahBuku").value);
    totalInput.value = `Rp ${(harga * qty).toLocaleString("id-ID")}`;
  });

  // 4️⃣ Saat ubah jumlah buku, update total
  form.addEventListener("input", (e) => {
    if (e.target.id === "jumlahBuku" || e.target.id === "pilihBuku") {
      const selectedOption = pilihBuku.options[pilihBuku.selectedIndex];
      const harga = parseInt(selectedOption.dataset.harga || 0);
      const qty = parseInt(document.getElementById("jumlahBuku").value);
      totalInput.value = `Rp ${(harga * qty).toLocaleString("id-ID")}`;
    }
  });

  // 5️⃣ Saat user submit form
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nama = document.getElementById("namaPemesan").value.trim();
    const lokasi = document.getElementById("lokasi").value.trim();
    const bukuDipilih = pilihBuku.options[pilihBuku.selectedIndex].text;
    const total = totalInput.value;

    if (!nama || !lokasi || !bukuDipilih || !total) {
      alert("⚠️ Harap isi semua data!");
      return;
    }

    alert(`✅ Pesanan Berhasil Dikirim!
Nama: ${nama}
Buku: ${bukuDipilih}
Lokasi: ${lokasi}
Total: ${total}`);

    form.reset();
    hargaInput.value = "";
    totalInput.value = "";
  });

  // 6️⃣ Tombol kembali ke dashboard
  btnKembali.addEventListener("click", () => {
    window.location.href = "dashboard.html";
  });
});
