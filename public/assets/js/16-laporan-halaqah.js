// =========================================================
// LAPORAN HALAQAH
// =========================================================
function tampilLaporanHalaqah() {
  const el = document.getElementById('isiLaporanHalaqah');
  const hal = document.getElementById('inLaporanHalaqah').value;
  if (!hal) { el.innerHTML = '<div class="nodata">Pilih halaqah</div>'; return; }

  /* ✅ Guard: musyrif hanya boleh lihat halaqahnya sendiri */
  if (user?.role === 'musyrif') {
    const myHalaqah = DB.halaqah.filter(h => h.musyrif === user.username).map(h => h.nama);
    if (!myHalaqah.includes(hal)) {
      el.innerHTML = '<div class="nodata">Anda tidak punya akses ke halaqah ini</div>';
      return;
    }
  }

  const list = DB.santri.filter(s => s.halaqah === hal);
  if (list.length === 0) { el.innerHTML = '<div class="nodata">Belum ada santri di halaqah ini</div>'; return; }

  let totalSetoran = 0, totalPersenLancar = 0, totalPersenHadir = 0, totalMutabaah = 0;
  const detail = list.map(s => {
    const st = statistik(s.id);
    totalSetoran += st.setoran.length;
    totalPersenLancar += st.persenLancar;
    totalPersenHadir += st.persenHadir;
    totalMutabaah += st.rataMut;
    return { s, st };
  });
  const avgLancar = Math.round(totalPersenLancar / list.length);
  const avgHadir = Math.round(totalPersenHadir / list.length);
  const avgMut = Math.round(totalMutabaah / list.length);
  detail.sort((a, b) => b.st.setoran.length - a.st.setoran.length);

  el.innerHTML = `
    <div style="padding:12px 14px;background:var(--primary-soft);border-radius:6px;margin-bottom:14px;border:1px solid var(--border)">
      <div style="font-size:15px;font-weight:600;color:var(--text)">${hal}</div>
      <div style="font-size:12px;color:var(--text-muted);margin-top:2px">${list.length} santri</div>
    </div>
    <div class="stat-row" style="margin-bottom:14px">
      <div class="stat-box"><div class="n">${totalSetoran}</div><div class="l">Total Setoran</div></div>
      <div class="stat-box"><div class="n">${avgLancar}%</div><div class="l">Rata Lancar</div></div>
      <div class="stat-box"><div class="n">${avgHadir}%</div><div class="l">Rata Hadir</div></div>
      <div class="stat-box"><div class="n">${avgMut}%</div><div class="l">Rata Mutaba'ah</div></div>
    </div>
    <div style="font-size:12.5px;font-weight:600;color:var(--text-muted);margin:14px 0 8px">Peringkat Santri di Halaqah Ini</div>
    ${detail.map((d, i) => `
      <div class="lb-item ${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : ''}">
        <div class="lb-rank">${i + 1}</div>
        <div class="lb-info">
          <div class="lb-name">${d.s.nama}</div>
          <div class="lb-meta">${d.st.juzLancar.length} juz lancar · ${d.st.persenLancar}% lancar · ${d.st.persenHadir}% hadir</div>
        </div>
        <div class="lb-value">${d.st.setoran.length}</div>
      </div>
    `).join('')}
  `;
}
