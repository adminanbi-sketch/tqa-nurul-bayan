// =========================================================
// NAVIGASI
// =========================================================
function bukaTab(name) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('on'));
  document.querySelectorAll('[data-tab]').forEach(b => b.classList.remove('on'));
  document.getElementById('panel-' + name).classList.add('on');
  document.querySelectorAll(`[data-tab="${name}"]`).forEach(b => b.classList.add('on'));
  if (name === 'absen') renderFormAbsen();
  if (name === 'mutabaah') renderFormMutabaah();
  if (name === 'laporan') { tampilLaporan(); gambarGrafik(); }
  if (name === 'pengaturan') updateInfo();
  if (name === 'halaqah') tampilLaporanHalaqah();
  if (name === 'leaderboard') renderLeaderboard();
}
