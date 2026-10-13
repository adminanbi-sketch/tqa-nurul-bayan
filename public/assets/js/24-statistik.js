// =========================================================
// STAT & INFO
// =========================================================
function renderStat() {
  const list = santriTerlihat();
  document.getElementById('statSantri').textContent = list.length;
  const visibleIds = list.map(s => s.id);
  const setoran = DB.setoran.filter(s => visibleIds.includes(s.santriId));
  document.getElementById('statSetoran').textContent = setoran.length;
  const absen = DB.absen.filter(a => visibleIds.includes(a.santriId));
  const hd = absen.filter(a => a.status === 'Hadir').length;
  document.getElementById('statHadir').textContent = absen.length ? Math.round(hd / absen.length * 100) + '%' : '0%';

  let best = 0;
  list.forEach(s => { const st = statistik(s.id); if (st.streak > best) best = st.streak; });
  document.getElementById('statStreak').textContent = best;
}

function updateInfo() {
  document.getElementById('infoSantri').textContent = DB.santri.length;
  document.getElementById('infoHalaqah').textContent = DB.halaqah.length;
  document.getElementById('infoSetoran').textContent = DB.setoran.length;
  document.getElementById('infoAbsen').textContent = DB.absen.length;
  document.getElementById('infoMutabaah').textContent = DB.mutabaah.length;
  const kb = new Blob([JSON.stringify(DB)]).size / 1024;
  document.getElementById('infoStorage').textContent = kb.toFixed(1) + ' KB';
  cekMikrofon();
  renderListUsers();
  renderHalaqahAdmin();
  renderHalaqahDropdowns();
  renderListAmalan();
  document.getElementById('inPengumuman').value = DB.pengumuman;
}
