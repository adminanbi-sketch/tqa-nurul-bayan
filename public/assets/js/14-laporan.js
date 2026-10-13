// =========================================================
// LAPORAN
// =========================================================
function statistik(santriId) {
  const setoran = DB.setoran.filter(s => s.santriId === santriId);
  const absen = DB.absen.filter(a => a.santriId === santriId);
  const mutabaah = DB.mutabaah.filter(m => m.santriId === santriId);
  const hadir = absen.filter(a => a.status === 'Hadir').length;
  const persenHadir = absen.length ? Math.round(hadir / absen.length * 100) : 0;
  const lancar = setoran.filter(s => s.nilai === 'Lancar').length;
  const persenLancar = setoran.length ? Math.round(lancar / setoran.length * 100) : 0;
  const rataMut = mutabaah.length
    ? Math.round(mutabaah.reduce((s, m) => s + Object.values(m.items).filter(Boolean).length, 0) / (mutabaah.length * DB.amalan.length) * 100)
    : 0;
  const juzLancar = [...new Set(setoran.filter(s => s.nilai === 'Lancar').map(s => s.juz))];
  const juzPerlu = [...new Set(setoran.filter(s => s.nilai !== 'Lancar').map(s => s.juz))];

  const tajwidStats = {};
  TAJWID_KATEGORI.forEach(t => tajwidStats[t.id] = 0);
  setoran.forEach(s => {
    if (s.tajwid) TAJWID_KATEGORI.forEach(t => { if (s.tajwid[t.id]) tajwidStats[t.id]++; });
  });
  
  let streak = 0;
  const validDates = setoran
    .map(s => {
      const d = new Date(s.tanggal);
      return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
    })
    .filter(Boolean);
  const dates = [...new Set(validDates)].sort().reverse();
  if (dates.length > 0) {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (dates[0] === today || dates[0] === yesterday) {
      streak = 1;
      for (let i = 1; i < dates.length; i++) {
        const d1 = new Date(dates[i - 1]); const d2 = new Date(dates[i]);
        const diff = Math.round((d1 - d2) / 86400000);
        if (diff === 1) streak++;
        else break;
      }
    }
  }

  return { setoran, absen, mutabaah, persenHadir, persenLancar, rataMut, juzLancar, juzPerlu, tajwidStats, streak };
}

function tampilLaporan() {
  const el = document.getElementById('isiLaporan');
  const id = parseInt(document.getElementById('inLaporanSantri').value);
  if (!id) { el.innerHTML = '<div class="nodata">Pilih santri untuk melihat laporan</div>'; document.getElementById('petaJuz').innerHTML = ''; return; }
  const s = DB.santri.find(x => x.id === id);
  /* ✅ Guard: santri mungkin sudah dihapus */
  if (!s) { el.innerHTML = '<div class="nodata">Data santri tidak ditemukan</div>'; document.getElementById('petaJuz').innerHTML = ''; return; }
  const st = statistik(id);
  el.innerHTML = `
    <div style="padding:12px 14px;background:var(--border-soft);border-radius:6px;margin-bottom:14px;border:1px solid var(--border)">
      <div style="font-size:14.5px;font-weight:600;color:var(--text)">${s.nama}</div>
      <div style="font-size:12px;color:var(--text-muted);margin-top:2px">${s.halaqah} · Target ${s.target} juz</div>
    </div>
    <div class="stat-row" style="margin-bottom:14px">
      <div class="stat-box"><div class="n">${st.setoran.length}</div><div class="l">Setoran</div></div>
      <div class="stat-box"><div class="n">${st.juzLancar.length}</div><div class="l">Juz Lancar</div></div>
      <div class="stat-box"><div class="n">${st.mutabaah.length}</div><div class="l">Mutaba'ah</div></div>
      <div class="stat-box"><div class="n">${st.streak}🔥</div><div class="l">Streak</div></div>
    </div>
    <div class="prog">
      <div class="prog-h"><span>Kehadiran</span><span class="v">${st.persenHadir}%</span></div>
      <div class="prog-bar"><div class="prog-fill" style="width:${st.persenHadir}%;background:var(--primary)"></div></div>
    </div>
    <div class="prog">
      <div class="prog-h"><span>Setoran Lancar</span><span class="v">${st.persenLancar}%</span></div>
      <div class="prog-bar"><div class="prog-fill" style="width:${st.persenLancar}%;background:#1967d2"></div></div>
    </div>
    <div class="prog">
      <div class="prog-h"><span>Rata-rata Mutaba'ah</span><span class="v">${st.rataMut}%</span></div>
      <div class="prog-bar"><div class="prog-fill" style="width:${st.rataMut}%;background:var(--accent)"></div></div>
    </div>
  `;

  const juzEl = document.getElementById('petaJuz');
  const lancarSet = new Set(st.juzLancar);
  const perluSet = new Set(st.juzPerlu.filter(j => !lancarSet.has(j)));
  let petaHtml = '<div class="juz-grid">';
  for (let i = 1; i <= 30; i++) {
    let cls = 'juz-cell';
    if (lancarSet.has(i)) cls += ' done';
    else if (perluSet.has(i)) cls += ' progress';
    petaHtml += `<div class="${cls}">${i}</div>`;
  }
  petaHtml += '</div>';
  petaHtml += `<div style="font-size:12px;color:var(--text-muted);text-align:center">${st.juzLancar.length}/30 Juz Lancar (${Math.round(st.juzLancar.length / 30 * 100)}%)</div>`;
  juzEl.innerHTML = petaHtml;
}