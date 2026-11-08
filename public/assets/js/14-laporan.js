function statistik(santriId) {
  const setoran = DB.setoran.filter(s => s.santriId === santriId);
  const absen = DB.absen.filter(a => a.santriId === santriId);
  const mutabaah = DB.mutabaah.filter(m => m.santriId === santriId);
  const hadir = absen.filter(a => a.status === 'Hadir').length;
  const persenHadir = absen.length ? Math.round(hadir / absen.length * 100) : 0;
  const lancar = setoran.filter(s => s.nilai === 'Lancar').length;
  const persenLancar = setoran.length ? Math.round(lancar / setoran.length * 100) : 0;

  // ✅ FIX: guard amalan.length === 0
  const totalAmalan = DB.amalan.length || 1;
  const rataMut = mutabaah.length
    ? Math.round(mutabaah.reduce((s, m) => s + Object.values(m.items || {}).filter(Boolean).length, 0) / (mutabaah.length * totalAmalan) * 100)
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