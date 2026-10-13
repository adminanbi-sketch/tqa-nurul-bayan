// =========================================================
// DATA — Global state (di-load dari API)
// =========================================================
const DB = {
  santri: [],
  setoran: [],
  absen: [],
  mutabaah: [],
  halaqah: [],
  amalan: [],
  pengumuman: '',
};

let user = null;

// =========================================================
// LOAD SEMUA DATA DARI SERVER
// =========================================================
async function loadAllData() {
  try {
    const [santri, setoran, absen, mutabaah, halaqah, amalan, pengumuman] = await Promise.all([
      api.getSantri(),
      api.getSetoran(),
      api.getAbsen(),
      api.getMutabaah(),
      api.getHalaqah(),
      api.getAmalan(),
      api.getPengumuman(),
    ]);

    DB.santri = santri;
    DB.setoran = setoran;
    DB.absen = absen;
    DB.mutabaah = mutabaah;
    DB.halaqah = halaqah;
    DB.amalan = amalan;
    DB.pengumuman = pengumuman.teks || '';

    console.log('✅ Data loaded from server:', {
      santri: DB.santri.length,
      setoran: DB.setoran.length,
      absen: DB.absen.length,
      mutabaah: DB.mutabaah.length,
      halaqah: DB.halaqah.length,
      amalan: DB.amalan.length,
    });
  } catch (e) {
    console.error('❌ Gagal load data:', e);
    throw e;
  }
}

// =========================================================
// SIMPAN — Fungsi lama dipertahankan sebagai no-op
// (karena sekarang data disimpan per-operasi via API)
// =========================================================
function simpan() {
  /* Data sekarang auto-save ke server per operasi.
     Fungsi ini hanya placeholder supaya kode lama tetap jalan. */
  console.log('ℹ️ simpan() dipanggil — data auto-save ke server');
}

// =========================================================
// TOAST
// =========================================================
function toast(msg, ms = 2200) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('on');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('on'), ms);
}

// =========================================================
// BADGE / KONSTANTA (tidak berubah)
// =========================================================
const badgeNilai = { 'Lancar': 'tag-green', 'Kurang Lancar': 'tag-yellow', 'Mengulang': 'tag-red' };
const badgeAbsen = { 'Hadir': 'tag-green', 'Sakit': 'tag-yellow', 'Izin': 'tag-blue', 'Alpa': 'tag-red' };

const TAJWID_KATEGORI = [
  { id: 'mad', label: 'Mad (panjang-pendek)' },
  { id: 'makhraj', label: 'Makhraj (tempat keluar huruf)' },
  { id: 'sifat', label: 'Sifat huruf' },
  { id: 'ghunnah', label: 'Ghunnah (dengung)' },
  { id: 'waqaf', label: 'Waqaf & Ibtida\'' },
  { id: 'lupa', label: 'Lupa ayat' },
];

const DEFAULT_AMALAN = [
  { id: 'subuh', t: 'Sholat Subuh berjamaah' },
  { id: 'dzuhur', t: 'Sholat Dzuhur berjamaah' },
  { id: 'ashar', t: 'Sholat Ashar berjamaah' },
  { id: 'maghrib', t: 'Sholat Maghrib berjamaah' },
  { id: 'isya', t: 'Sholat Isya berjamaah' },
  { id: 'tahajud', t: 'Sholat Tahajud / Witir' },
  { id: 'dhuha', t: 'Sholat Dhuha' },
  { id: 'tilawah', t: 'Tilawah Al-Qur\'an' },
  { id: 'murojaah', t: 'Muroja\'ah hafalan' },
  { id: 'dzikir', t: 'Dzikir pagi & petang' },
];