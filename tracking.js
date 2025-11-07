document.addEventListener("DOMContentLoaded", () => {
  const btnCari = document.getElementById("btnCari");
  const btnKembali = document.getElementById("btnKembali");
  const hasilTracking = document.getElementById("hasilTracking");

  btnCari.addEventListener("click", () => {
    const nomorDO = document.getElementById("nomorDO").value.trim();

    if (nomorDO === "") {
      alert("⚠️ Harap masukkan Nomor DO terlebih dahulu!");
      return;
    }

    // Pastikan dataTracking tersedia
    if (typeof dataTracking === "undefined") {
      alert("⚠️ File data.js belum dimuat atau path-nya salah!");
      return;
    }

    const data = dataTracking[nomorDO];

    if (!data) {
      alert("❌ Nomor DO tidak ditemukan!");
      hasilTracking.style.display = "none";
      return;
    }

    // Tampilkan hasil tracking
    document.getElementById("namaPemesan").textContent = data.nama;
    document.getElementById("status").textContent = data.status;
    document.getElementById("ekspedisi").textContent = data.ekspedisi;
    document.getElementById("tanggalKirim").textContent = data.tanggalKirim;
    document.getElementById("paket").textContent = data.paket;
    document.getElementById("total").textContent = data.total;

    // Hitung progress
    const totalLangkah = data.perjalanan.length;
    const selesai = data.perjalanan.filter(item => item.keterangan.toLowerCase().includes("selesai")).length > 0;
    const persen = selesai ? 100 : Math.min(90, (totalLangkah / 6) * 100); // simulasi progres
    const progressBar = document.getElementById("progressBar");
    progressBar.style.width = `${persen}%`;
    progressBar.textContent = `${persen}%`;

    // Isi detail perjalanan
    const list = document.getElementById("detailPerjalanan");
    list.innerHTML = "";
    data.perjalanan.forEach((item) => {
      const li = document.createElement("li");
      li.className = "list-group-item";
      li.textContent = `${item.waktu} - ${item.keterangan}`;
      list.appendChild(li);
    });

    hasilTracking.style.display = "block";
  });

  // Tombol kembali
  btnKembali.addEventListener("click", () => {
    window.location.href = "dashboard.html";
  });
});
