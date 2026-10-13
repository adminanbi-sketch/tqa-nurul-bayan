// =========================================================
// PDF & CSV
// =========================================================
function exportPDF() {
  const id = parseInt(document.getElementById('inLaporanSantri').value);
  if (!id) return toast('Pilih santri dulu');
  const s = DB.santri.find(x => x.id === id);
  if (!s) return toast('Data santri tidak ditemukan');
  /* ✅ Guard: pastikan jsPDF sudah loaded */
  if (!window.jspdf || !window.jspdf.jsPDF) return toast('Library PDF belum siap, coba lagi');
  const st = statistik(id);
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 400; canvas.height = 400;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 400, 400);
    ctx.drawImage(img, 0, 0, 400, 400);
    const pngData = canvas.toDataURL('image/png');
    try { doc.addImage(pngData, 'PNG', 18, 12, 20, 20); } catch (e) {}

    doc.setFont('helvetica', 'bold'); doc.setFontSize(14); doc.setTextColor(28);
    doc.text('TQA NURUL BAYAN', 44, 20);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(120);
    doc.text('Rengasdengklok - Karawang', 44, 26);
    doc.setDrawColor(200); doc.line(20, 38, 190, 38);

    doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.setTextColor(30);
    doc.text('RAPORT TAHFIDZ', 105, 50, { align: 'center' });

    doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
    doc.text('Data Santri', 20, 64);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
    doc.text(`Nama       : ${s.nama}`, 20, 73);
    doc.text(`Halaqah    : ${s.halaqah}`, 20, 79);
    doc.text(`Target     : ${s.target} juz`, 20, 85);
    doc.text(`Tanggal    : ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, 20, 91);

    doc.setFont('helvetica', 'bold'); doc.text('Statistik', 20, 105);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total setoran         : ${st.setoran.length}`, 20, 114);
    doc.text(`Juz lancar            : ${st.juzLancar.length} juz`, 20, 120);
    doc.text(`Kehadiran             : ${st.persenHadir}%`, 20, 126);
    doc.text(`Setoran lancar        : ${st.persenLancar}%`, 20, 132);
    doc.text(`Rata-rata mutaba'ah   : ${st.rataMut}%`, 20, 138);
    doc.text(`Streak                : ${st.streak} hari`, 20, 144);

    doc.setFont('helvetica', 'bold'); doc.text('Kesalahan Tajwid Terbanyak', 20, 158);
    doc.setFont('helvetica', 'normal');
    const tjSorted = TAJWID_KATEGORI.map(t => ({ label: t.label, count: st.tajwidStats[t.id] })).sort((a, b) => b.count - a.count);
    let yy = 166;
    tjSorted.slice(0, 6).forEach(t => { doc.text(`${t.label.padEnd(35)}: ${t.count}`, 20, yy); yy += 6; });

    doc.setFont('helvetica', 'bold'); doc.text('Riwayat Setoran (15 terakhir)', 20, yy + 8);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
    let y = yy + 16;
    st.setoran.slice(0, 15).forEach(x => {
      const t = new Date(x.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
      doc.text(`${t} · ${x.jenis} · Juz ${x.juz} ${x.surah}:${x.ayat} · ${x.nilai}`, 20, y);
      y += 6;
    });

    doc.setDrawColor(200); doc.line(20, 282, 190, 282);
    doc.setFontSize(8); doc.setTextColor(120);
    doc.text('Dicetak dari aplikasi Tahfidz TQA Nurul Bayan', 105, 288, { align: 'center' });

    doc.save(`Raport_${s.nama.replace(/\s+/g, '_')}.pdf`);
    toast('Raport berhasil diunduh');
  };
  img.onerror = () => {
    doc.save(`Raport_${s.nama.replace(/\s+/g, '_')}.pdf`);
    toast('Raport diunduh');
  };
  img.src = LOGO_DATA_URL;
}

function exportCSV() {
  const id = parseInt(document.getElementById('inLaporanSantri').value);
  if (!id) return toast('Pilih santri dulu');
  const s = DB.santri.find(x => x.id === id);
  /* ✅ Guard: santri mungkin sudah dihapus */
  if (!s) return toast('Data santri tidak ditemukan');
  const st = statistik(id);
  const rows = [['Tanggal', 'Jenis', 'Juz', 'Surah', 'Ayat', 'Nilai', 'Kesalahan Tajwid', 'Catatan']];
  st.setoran.forEach(x => {
    const tajwidAktif = x.tajwid ? TAJWID_KATEGORI.filter(t => x.tajwid[t.id]).map(t => t.label).join('; ') : '';
    rows.push([
      new Date(x.tanggal).toLocaleDateString('id-ID'),
      x.jenis, x.juz, x.surah, x.ayat, x.nilai, tajwidAktif, x.catatan || ''
    ]);
  });
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `Setoran_${s.nama.replace(/\s+/g, '_')}.csv`;
  a.click();
  toast('CSV berhasil diunduh');
}
