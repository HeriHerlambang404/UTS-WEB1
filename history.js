document.addEventListener("DOMContentLoaded", () => {
  // 🔹 Ambil elemen tabel tempat data tracking akan ditampilkan
  const tabel = document.getElementById("tabelHistory");

  if (typeof dataTracking === "undefined") {
    tabel.innerHTML = `<tr><td colspan="6" class="text-danger">Data tracking tidak ditemukan!</td></tr>`;
    return;
  }

  // 🔹 Ambil semua key (misal: "20230012", "20230013") dari object dataTracking
  // karena dataTracking bukan array, jadi kita perlu Object.keys()
  const keys = Object.keys(dataTracking);

  // 🔸 Kalau belum ada data sama sekali, tampilkan pesan kosong
  if (keys.length === 0) {
    tabel.innerHTML = `<tr><td colspan="6">Belum ada data tracking</td></tr>`;
    return;
  }

  // 🔹 Loop semua key di dataTracking
  keys.forEach((key) => {
    const item = dataTracking[key]; // Ambil data tracking berdasarkan key
    const tr = document.createElement("tr"); // Buat elemen <tr> baru (baris tabel)

    //Isi baris tabel dengan data dari masing-masing tracking
    tr.innerHTML = `
      <td>${item.nomorDO}</td>
      <td>${item.nama}</td>
      <td>${item.ekspedisi}</td>
      <td>${item.tanggalKirim}</td>
      <td>${item.status}</td>
      <td>${item.total}</td>
    `;


    tabel.appendChild(tr);
  });
});
