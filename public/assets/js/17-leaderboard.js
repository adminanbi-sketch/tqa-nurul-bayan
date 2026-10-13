// =========================================================
// LEADERBOARD
// =========================================================
let lbMode = 'setoran';
function filterLeaderboard(mode, btn) {
  lbMode = mode;
  document.querySelectorAll('#panel-leaderboard .chip').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  renderLeaderboard();
}

function renderLeaderboard() {
  const el = document.getElementById('listLeaderboard');
  const fHal = document.getElementById('filterLbHalaqah')?.value || '';
  let list = santriTerlihat();
  if (fHal) list = list.filter(s => s.halaqah === fHal);
  if (list.length === 0) { el.innerHTML = '<div class="nodata">Belum ada data</div>'; return; }

  const scored = list.map(s => {
    const st = statistik(s.id);
    let value, meta;
    if (lbMode === 'setoran') { value = st.setoran.length; meta = `${st.juzLancar.length} juz lancar`; }
    else if (lbMode === 'kehadiran') { value = st.persenHadir; meta = `${st.absen.filter(a => a.status === 'Hadir').length} hari hadir`; }
    else { value = st.rataMut; meta = `${st.mutabaah.length} hari mutaba'ah`; }
    return { s, value, meta };
  });
  scored.sort((a, b) => b.value - a.value);

  el.innerHTML = scored.map((d, i) => `
    <div class="lb-item ${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : ''}">
      <div class="lb-rank">${i + 1}</div>
      <div class="lb-info">
        <div class="lb-name">${d.s.nama}</div>
        <div class="lb-meta">${d.s.halaqah} · ${d.meta}</div>
      </div>
      <div class="lb-value">${d.value}${lbMode !== 'setoran' ? '%' : ''}</div>
    </div>
  `).join('');
}
