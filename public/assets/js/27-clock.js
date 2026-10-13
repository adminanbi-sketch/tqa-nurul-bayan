// =========================================================
// JAM REAL-TIME DI HEADER
// =========================================================
function updateClock() {
  const el = document.getElementById('headerClock');
  if (!el) return;
  const now = new Date();
  const tgl = now.toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
  const jam = now.toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
  el.textContent = `${tgl} · ${jam} WIB`;
}
updateClock();
setInterval(updateClock, 1000);