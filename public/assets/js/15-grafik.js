// =========================================================
// GRAFIK
// =========================================================
let ch1 = null, ch2 = null, ch3 = null;

function gambarGrafik() {
  const id = parseInt(document.getElementById('inLaporanSantri').value);
  if (!id) return;
  /* ✅ Guard: santri mungkin sudah dihapus */
  const santri = DB.santri.find(x => x.id === id);
  if (!santri) return;
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const gridColor = isDark ? '#2f3336' : '#f0f2f5';
  const textColor = isDark ? '#8b98a5' : '#65676b';
  const st = statistik(id);
  const perJuz = {};
  st.setoran.forEach(s => {
    if (!perJuz[s.juz]) perJuz[s.juz] = { lancar: 0, kurang: 0, ulang: 0 };
    if (s.nilai === 'Lancar') perJuz[s.juz].lancar++;
    else if (s.nilai === 'Kurang Lancar') perJuz[s.juz].kurang++;
    else perJuz[s.juz].ulang++;
  });
  const juzKeys = Object.keys(perJuz).sort((a, b) => a - b);

  if (ch1) ch1.destroy();
  ch1 = new Chart(document.getElementById('chartHafalan'), {
    type: 'bar',
    data: {
      labels: juzKeys.length ? juzKeys.map(j => 'Juz ' + j) : ['Belum ada'],
      datasets: [
        { label: 'Lancar', data: juzKeys.map(j => perJuz[j].lancar), backgroundColor: '#2d6a4f' },
        { label: 'Kurang', data: juzKeys.map(j => perJuz[j].kurang), backgroundColor: '#c9a227' },
        { label: 'Ulang', data: juzKeys.map(j => perJuz[j].ulang), backgroundColor: '#c1121f' },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 }, color: textColor } } },
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 10 }, color: textColor }, grid: { color: gridColor } },
        x: { ticks: { font: { size: 10 }, color: textColor }, grid: { display: false } }
      }
    }
  });

  const tjLabels = TAJWID_KATEGORI.map(t => t.label.split(' ')[0]);
  const tjData = TAJWID_KATEGORI.map(t => st.tajwidStats[t.id]);

  if (ch3) ch3.destroy();
  ch3 = new Chart(document.getElementById('chartTajwid'), {
    type: 'bar',
    data: {
      labels: tjLabels,
      datasets: [{ label: 'Frekuensi', data: tjData, backgroundColor: '#c1121f' }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 10 }, color: textColor }, grid: { color: gridColor } },
        x: { ticks: { font: { size: 10 }, color: textColor }, grid: { display: false } }
      }
    }
  });

  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  const absenArr = dates.map(t => st.absen.find(a => a.tanggal === t)?.status === 'Hadir' ? 1 : 0);
  const mutArr = dates.map(t => {
    const m = st.mutabaah.find(x => x.tanggal === t);
    return m ? Math.round(Object.values(m.items).filter(Boolean).length / DB.amalan.length * 100) : 0;
  });
  const labels = dates.map(t => new Date(t).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }));

  if (ch2) ch2.destroy();
  ch2 = new Chart(document.getElementById('chartAktivitas'), {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: 'Hadir', data: absenArr, borderColor: '#2d6a4f', backgroundColor: 'rgba(45,106,79,0.08)', tension: 0.3, fill: true, yAxisID: 'y' },
        { label: 'Mutaba\'ah (%)', data: mutArr, borderColor: '#c9a227', backgroundColor: 'rgba(201,162,39,0.08)', tension: 0.3, fill: true, yAxisID: 'y1' },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 }, color: textColor } } },
      scales: {
        y: { beginAtZero: true, max: 1, ticks: { stepSize: 1, font: { size: 10 }, color: textColor, callback: v => v === 1 ? 'Hadir' : 'Alpa' }, grid: { color: gridColor } },
        y1: { beginAtZero: true, max: 100, position: 'right', ticks: { font: { size: 10 }, color: textColor, callback: v => v + '%' }, grid: { display: false } },
        x: { ticks: { font: { size: 10 }, color: textColor }, grid: { display: false } }
      }
    }
  });
}
