// =========================================================
// STAT & INFO
// =========================================================
function renderStat() {
  const list = santriTerlihat();
  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  setEl('statSantri', list.length);
  const visibleIds = list.map(s => s.id);
  const setoran = DB.setoran.filter(s => visibleIds.includes(s.santriId));
  setEl('statSetoran', setoran.length);
  const absen = DB.absen.filter(a => visibleIds.includes(a.santriId));
  const hd = absen.filter(a => a.status === 'Hadir').length;
  setEl('statHadir', absen.length ? Math.round(hd / absen.length * 100) + '%' : '0%');

  let best = 0;
  list.forEach(s => { const st = statistik(s.id); if (st.streak > best) best = st.streak; });
  setEl('statStreak', best);
}

function updateInfo() {
  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setEl('infoSantri', DB.santri.length);
  setEl('infoHalaqah', DB.halaqah.length);
  setEl('infoSetoran', DB.setoran.length);
  setEl('infoAbsen', DB.absen.length);
  setEl('infoMutabaah', DB.mutabaah.length);
  const kb = new Blob([JSON.stringify(DB)]).size / 1024;
  setEl('infoStorage', kb.toFixed(1) + ' KB');

  if (typeof cekMikrofon === 'function') cekMikrofon();
  if (typeof renderListUsers === 'function') renderListUsers();
  if (typeof renderHalaqahAdmin === 'function') renderHalaqahAdmin();
  if (typeof renderHalaqahDropdowns === 'function') renderHalaqahDropdowns();
  if (typeof renderListAmalan === 'function') renderListAmalan();
  const inp = document.getElementById('inPengumuman');
  if (inp) inp.value = DB.pengumuman;
}