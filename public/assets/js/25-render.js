
// Dropdown database Al-Qur’an dan autofill informasi surah
function isiDropdownQuran() {
  const surahEl = document.getElementById('inSetoranSurah');
  if (!surahEl || typeof QURAN === 'undefined') return;
  const pilihanLama = surahEl.value;
  surahEl.innerHTML = '<option value="">— Pilih surah —</option>' + QURAN.map(q => `<option value="${q.nomor}">${String(q.nomor).padStart(3,'0')}. ${q.surat}</option>`).join('');
  if (pilihanLama) surahEl.value = pilihanLama;
  if (!surahEl.dataset.autofillBound) {
    surahEl.addEventListener('change', autofillInfoSurah);
    document.getElementById('inSetoranJuz')?.addEventListener('change', filterSurahMenurutJuz);
    surahEl.dataset.autofillBound = '1';
  }
  autofillInfoSurah();
}
function filterSurahMenurutJuz() {
  const juzEl = document.getElementById('inSetoranJuz');
  const surahEl = document.getElementById('inSetoranSurah');
  if (!juzEl || !surahEl) return;
  const juz = Number(juzEl.value);
  const current = Number(surahEl.value);
  const eligible = QURAN.filter(q => !juz || q.juz.includes(juz));
  surahEl.innerHTML = '<option value="">— Pilih surah —</option>' + eligible.map(q => `<option value="${q.nomor}">${String(q.nomor).padStart(3,'0')}. ${q.surat}</option>`).join('');
  if (eligible.some(q => q.nomor === current)) surahEl.value = String(current);
  autofillInfoSurah();
}
function autofillInfoSurah() {
  const surahEl = document.getElementById('inSetoranSurah');
  const juzEl = document.getElementById('inSetoranJuz');
  const ayatEl = document.getElementById('inSetoranAyat');
  const info = document.getElementById('infoSurahSetoran');
  if (!surahEl) return;
  const q = QURAN.find(x => x.nomor === Number(surahEl.value));
  if (!q) { if(info) info.textContent = 'Pilih surah untuk melihat jumlah ayat.'; return; }
  if (info) info.textContent = `${q.surat} · ${q.ayat} ayat · terdapat pada juz ${q.juz.join(', ')}`;
  if (ayatEl) { ayatEl.placeholder = `Rentang ayat, maksimal ${q.ayat}`; ayatEl.setAttribute('aria-label', `Rentang ayat dari surah ${q.surat}, maksimal ${q.ayat}`); }
  // Jika juz kosong atau tidak cocok, pilih juz pertama yang memuat surah tersebut.
  if (juzEl && (!Number(juzEl.value) || !q.juz.includes(Number(juzEl.value)))) {
    juzEl.value = String(q.juz[0]);
  }
}

// =========================================================
// RENDER ALL
// =========================================================
function isiDropdown() {
  const list = santriTerlihat();
  const opt = '<option value="">— Pilih santri —</option>' +
    list.map(s => `<option value="${s.id}">${s.nama}</option>`).join('');
  ['inSetoranSantri','inMutabaahSantri','inLaporanSantri'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    /* ✅ Simpan pilihan lama */
    const oldVal = el.value;
    el.innerHTML = opt;
    /* ✅ Restore kalau masih valid */
    if (oldVal && list.some(s => String(s.id) === oldVal)) {
      el.value = oldVal;
    }
  });
}

function render() {
  isiDropdownQuran();
  renderSantri();
  renderSetoran();
  renderFormAbsen();
  renderRiwayatAbsen();
  renderFormMutabaah();
  renderRiwayatMutabaah();
  isiDropdown();
  renderStat();
  renderHalaqahDropdowns();
  renderAnnounce();
  renderNotif();
  /* ✅ Guard: cek panel ada sebelum akses */
  const panelLaporan = document.getElementById('panel-laporan');
  const panelLeaderboard = document.getElementById('panel-leaderboard');
  const panelHalaqah = document.getElementById('panel-halaqah');
  if (panelLaporan && panelLaporan.classList.contains('on')) {
    tampilLaporan();
    gambarGrafik();
  }
  if (panelLeaderboard && panelLeaderboard.classList.contains('on')) renderLeaderboard();
  if (panelHalaqah && panelHalaqah.classList.contains('on')) tampilLaporanHalaqah();
}