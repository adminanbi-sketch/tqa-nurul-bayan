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

  toast('Menghapus data dari server... Mohon tunggu.', 5000);

  try {
    // ✅ 1. Hapus semua Setoran di Server
    for (const s of DB.setoran) {
      await api.deleteSetoran(s.id);
    }
    
    // ✅ 2. Hapus semua Santri di Server
    for (const s of DB.santri) {
      await api.deleteSantri(s.id);
    }
    
    // ✅ 3. Hapus semua Halaqah di Server
    for (const h of DB.halaqah) {
      await api.deleteHalaqah(h.id);
    }

    // ✅ 4. Hapus Pengumuman
    await api.savePengumuman('');

    // ✅ 5. Kosongkan Data Lokal (Layar)
    DB.santri = []; 
    DB.setoran = []; 
    DB.absen = []; 
    DB.mutabaah = []; 
    DB.halaqah = [];
    DB.pengumuman = '';
    
    // ✅ 6. Refresh Tampilan
    render();
    renderAnnounce();
    
    toast('✅ Semua data berhasil dihapus permanen');
  } catch (e) {
    console.error('Gagal reset data:', e);
    toast('❌ Gagal menghapus: ' + e.message, 5000);
  }
}