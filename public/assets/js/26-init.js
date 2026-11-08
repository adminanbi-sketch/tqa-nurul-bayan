// =========================================================
// INIT
// =========================================================
document.addEventListener('DOMContentLoaded', async () => {
  // 1. Siapkan tampilan form (Tajwid grid)
  renderTajwidGrid();

  // 2. Set tanggal default untuk form
  const tglHariIni = new Date().toISOString().split('T')[0];
  const absenTgl = document.getElementById('inAbsenTanggal');
  const mutabaahTgl = document.getElementById('inMutabaahTanggal');
  if (absenTgl) absenTgl.value = tglHariIni;
  if (mutabaahTgl) mutabaahTgl.value = tglHariIni;

  // 3. Cek sesi login sebelumnya
  const saved = localStorage.getItem('th_user');
  if (saved) {
    try {
      user = JSON.parse(saved);
    } catch (e) {
      console.warn('Session parse error', e);
      user = null;
    }
  }

  // Tampilkan login screen dulu jika user ada
  if (user) {
    const loginScreen = document.getElementById('loginScreen');
    if (loginScreen) loginScreen.style.display = 'none';
  }

  // 4. Ambil data terbaru dari server (Santri, Setoran, dll)
  try {
    await loadAllData();
    console.log('✅ Semua data berhasil di-load');
  } catch (e) {
    console.error('❌ Gagal load data:', e);
    toast('Gagal load data dari server. Cek koneksi internet.', 5000);
  }

  // 5. Atur tampilan sesuai role user
  if (user) {
    applyRole();
  }

  // 6. Gambar semua elemen UI
  render();

  // 7. ✅ PENTING: Panggil pengisian dropdown Halaqah & Musyrif
  // Karena renderHalaqahDropdowns sekarang berjalan secara async (mengambil data API)
  // jika tidak dipanggil di sini, dropdown musyrif akan kosong atau berisi "Memuat..."
  if (typeof renderHalaqahDropdowns === 'function') {
    renderHalaqahDropdowns();
  }

  // 8. Update info sistem (Pengaturan)
  updateInfo();
});