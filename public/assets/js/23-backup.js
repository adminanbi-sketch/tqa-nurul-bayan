// =========================================================
// BACKUP
// =========================================================
function unduhData() {
  const data = { version: 2, exported: new Date().toISOString(), ...DB, users: USERS };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `tahfidz_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  toast('Backup diunduh');
}

function imporData(e) {
  const f = e.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = async ev => {
    try {
      const d = JSON.parse(ev.target.result);
      const ok = await konfirmasi('Impor data ini? Data saat ini akan diganti.', { title: 'Impor Data', okText: 'Ya, Impor', danger: false });
      if (!ok) { e.target.value = ''; return; }
      DB.santri = d.santri || [];
      DB.setoran = d.setoran || [];
      DB.absen = d.absen || [];
      DB.mutabaah = d.mutabaah || [];
      DB.halaqah = d.halaqah || [];
      DB.amalan = d.amalan || DEFAULT_AMALAN;
      DB.pengumuman = d.pengumuman || '';
      localStorage.setItem('th_pengumuman', DB.pengumuman);
      if (d.users) { USERS = d.users; saveUsers(); }
      simpan();
      render();
      renderAnnounce();
      toast('Data berhasil diimpor');
    } catch (err) { toast('File tidak valid'); }
    e.target.value = '';
  };
  r.readAsText(f);
}

async function resetSemua() {
  const ok1 = await konfirmasi('Hapus SEMUA data? Tindakan ini tidak dapat dibatalkan.', { title: 'Reset Semua Data', okText: 'Lanjut' });
  if (!ok1) return;
  const ok2 = await konfirmasi('Yakin? Semua data santri, setoran, absen, dan mutaba\'ah akan hilang permanen.', { title: 'Konfirmasi Akhir', okText: 'Ya, Hapus Semua' });
  if (!ok2) return;
  DB.santri = []; DB.setoran = []; DB.absen = []; DB.mutabaah = []; DB.halaqah = [];
  DB.pengumuman = '';
  localStorage.setItem('th_pengumuman', '');
  simpan();
  render();
  renderAnnounce();
  toast('Semua data telah dihapus');
}
