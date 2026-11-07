// =========================================================
// DATA — Global state (di-load dari API)
// =========================================================
const DB = { santri: [], setoran: [], absen: [], mutabaah: [], halaqah: [], amalan: [], pengumuman: '' };
let user = null;

async function loadAllData() {
  try {
    const [santri, setoran, absen, mutabaah, halaqah, amalan, pengumuman] = await Promise.all([
      api.getSantri(), api.getSetoran(), api.getAbsen(), api.getMutabaah(), api.getHalaqah(), api.getAmalan(), api.getPengumuman()
    ]);
    DB.santri = santri; DB.setoran = setoran; DB.absen = absen; DB.mutabaah = mutabaah; DB.halaqah = halaqah; DB.amalan = amalan; DB.pengumuman = pengumuman.teks || '';
    console.log('✅ Data loaded from server');
  } catch (e) { console.error('❌ Gagal load data:', e); throw e; }
}

function simpan() { console.log('ℹ️ Data auto-save ke server'); }

function toast(msg, ms = 2200) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg; el.classList.add('on');
  clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('on'), ms);
}

const badgeNilai = { 'Lancar': 'tag-green', 'Kurang Lancar': 'tag-yellow', 'Mengulang': 'tag-red' };
const badgeAbsen = { 'Hadir': 'tag-green', 'Sakit': 'tag-yellow', 'Izin': 'tag-blue', 'Alpa': 'tag-red' };
const TAJWID_KATEGORI = [
  { id: 'mad', label: 'Mad' }, { id: 'makhraj', label: 'Makhraj' }, { id: 'sifat', label: 'Sifat huruf' },
  { id: 'ghunnah', label: 'Ghunnah' }, { id: 'waqaf', label: 'Waqaf' }, { id: 'lupa', label: 'Lupa ayat' }
];