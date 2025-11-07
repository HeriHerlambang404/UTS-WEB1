// Ambil data user yang login
const userLogin = JSON.parse(localStorage.getItem("userLogin"));
const greetingText = document.getElementById("greetingText");

// Jika belum login, arahkan balik ke login
if (!userLogin) {
  window.location.href = "index.html";
}

// Tentukan greeting berdasarkan waktu lokal
function getGreeting() {
  const now = new Date();
  const hour = now.getHours();

  if (hour < 12) return "Selamat pagi";
  else if (hour < 18) return "Selamat siang";
  else return "Selamat sore";
}

// Tampilkan greeting dan nama user
if (userLogin && greetingText) {
  greetingText.textContent = `${getGreeting()}, ${userLogin.nama}! 👋`;
}

// Tombol logout
document.getElementById("logoutBtn").addEventListener("click", function() {
  localStorage.removeItem("userLogin");
  window.location.href = "index.html";
});
