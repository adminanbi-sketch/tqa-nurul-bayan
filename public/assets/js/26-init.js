// =========================================================
// INIT
// =========================================================
document.addEventListener('DOMContentLoaded', async () => {
  renderTajwidGrid();

  const tglHariIni = new Date().toISOString().split('T')[0];
  const absenTgl = document.getElementById('inAbsenTanggal');
  const mutabaahTgl = document.getElementById('inMutabaahTanggal');
  if (absenTgl) absenTgl.value = tglHariIni;
  if (mutabaahTgl) mutabaahTgl.value = tglHariIni;

  /* Cek session user */
  const saved = localStorage.getItem('th_user');
  if (saved) {
    try {
      user = JSON.parse(saved);
    } catch (e) {
      console.warn('Session parse error', e);
      user = null;
    }
  }

  /* Tampilkan login screen dulu */
  const loginScreen = document.getElementById('loginScreen');
  if (user && loginScreen) {
    loginScreen.style.display = 'none';
  }

  /* Load data dari server */
  try {
    await loadAllData();
    console.log('✅ Semua data berhasil di-load');
  } catch (e) {
    console.error('❌ Gagal load data:', e);
    toast('Gagal load data dari server. Cek koneksi internet.', 5000);
    /* Tetap render dengan data kosong */
  }

  resetRoleUI();
  render();
  if (user) applyRole();
  updateInfo();
});