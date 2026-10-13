// =========================================================
// GANTI PASSWORD
// =========================================================
function gantiPassword() {
  if (!user) return;
  const lama = document.getElementById('pwLama').value;
  const baru = document.getElementById('pwBaru').value;
  const konfirm = document.getElementById('pwKonfirm').value;
  if (!lama || !baru || !konfirm) return toast('Semua field harus diisi');
  if (baru.length < 6) return toast('Password minimal 6 karakter');
  if (baru !== konfirm) return toast('Konfirmasi tidak cocok');

  if (user.role === 'admin' || user.role === 'musyrif') {
    const u = USERS[user.username];
    if (!u || u.password !== hashPass(lama)) return toast('Password lama salah');
    USERS[user.username].password = hashPass(baru);
    saveUsers();
    toast('Password berhasil diubah');
  } else {
    const s = DB.santri.find(x => x.id === user.santriId);
    if (!s) return toast('Santri tidak ditemukan');
    const field = user.role === 'santri' ? 'passSantri' : 'passWali';
    const current = s[field] || (user.role === 'santri' ? DEFAULT_SANTRI_PASS : DEFAULT_WALI_PASS);
    if (current !== hashPass(lama)) return toast('Password lama salah');
    s[field] = hashPass(baru);
    simpan();
    toast('Password berhasil diubah');
  }
  document.getElementById('pwLama').value = '';
  document.getElementById('pwBaru').value = '';
  document.getElementById('pwKonfirm').value = '';
}
