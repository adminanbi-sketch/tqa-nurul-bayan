// =========================================================
// INIT
// =========================================================
document.addEventListener('DOMContentLoaded', async () => {
  // 1. Siapkan form tajwid
  if (typeof renderTajwidGrid === 'function') renderTajwidGrid();

  // 2. Set tanggal default
  const tglHariIni = new Date().toISOString().split('T')[0];
  const absenTgl = document.getElementById('inAbsenTanggal');
  const mutabaahTgl = document.getElementById('inMutabaahTanggal');
  if (absenTgl) absenTgl.value = tglHariIni;
  if (mutabaahTgl) mutabaahTgl.value = tglHariIni;

  // 3. Cek sesi login sebelumnya
  const saved = localStorage.getItem('th_user');
  if (saved) {
    try { user = JSON.parse(saved); } catch (e) { user = null; }
  }

  // Sembunyikan login screen dulu (kalau ada sesi) agar tidak flicker
  if (user) {
    const loginScreen = document.getElementById('loginScreen');
    if (loginScreen) loginScreen.style.display = 'none';
  }

  // 4. Load data
  try {
    await loadAllData();
    console.log('✅ Semua data berhasil di-load');
  } catch (e) {
    console.error('❌ Gagal load data:', e);
    toast('Gagal load data dari server. Cek koneksi internet.', 5000);
  }

  // 5. Render dulu, baru applyRole (agar panel sudah terisi)
  render();
  if (user) applyRole();

  // 6. Dropdown halaqah & musyrif (async)
  if (typeof renderHalaqahDropdowns === 'function') {
    await renderHalaqahDropdowns();
  }

  // 7. Info sistem
  if (typeof updateInfo === 'function') updateInfo();
});