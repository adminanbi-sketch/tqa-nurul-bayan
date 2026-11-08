// =========================================================
// GANTI PASSWORD — via API
// =========================================================
async function gantiPassword() {
  if (!user) return;
  const lama = document.getElementById('pwLama').value;
  const baru = document.getElementById('pwBaru').value;
  const konfirm = document.getElementById('pwKonfirm').value;
  if (!lama || !baru || !konfirm) return toast('Semua field harus diisi');
  if (baru.length < 6) return toast('Password minimal 6 karakter');
  if (baru !== konfirm) return toast('Konfirmasi tidak cocok');

  try {
    await api.gantiPassword({ username: user.username, role: user.role, santriId: user.santriId, lama, baru });
    toast('Password berhasil diubah');
    document.getElementById('pwLama').value = '';
    document.getElementById('pwBaru').value = '';
    document.getElementById('pwKonfirm').value = '';
  } catch (e) {
    toast('Gagal: ' + e.message);
  }
}