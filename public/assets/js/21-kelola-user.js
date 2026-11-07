// =========================================================
// KELOLA USER — via API
// =========================================================
async function renderListUsers() {
  const el = document.getElementById('listUsers');
  if (!el) return;
  try {
    const users = await api.getUsers(); 
    if (users.length === 0) { el.innerHTML = 'Belum ada musyrif tambahan.'; return; }
    el.innerHTML = users.map(u => `
      <div class="item" style="padding:10px">
        <div class="item-main"><div class="item-name">${u.nama}</div><div class="item-meta">username: <code>${u.username}</code></div></div>
        <button class="btn btn-red" onclick="hapusMusyrif('${u.username}')">Hapus</button>
      </div>
    `).join('');
  } catch (e) { el.innerHTML = 'Gagal memuat user.'; }
}

async function tambahMusyrif() {
  const uname = document.getElementById('newUserName').value.trim().toLowerCase().replace(/\s+/g, '');
  const nama = document.getElementById('newUserNama').value.trim();
  const pass = document.getElementById('newUserPass').value;
  if (!uname || !nama || !pass) return toast('Semua field harus diisi');
  try {
    await api.addUser({ username: uname, nama, password: pass });
    document.getElementById('newUserName').value = ''; document.getElementById('newUserNama').value = ''; document.getElementById('newUserPass').value = '';
    renderListUsers(); toast('Musyrif ditambahkan ke server');
  } catch (e) { toast('Gagal: ' + e.message); }
}

async function hapusMusyrif(uname) {
  if (!await konfirmasi('Hapus akun ini?', { title: 'Hapus', okText: 'Ya' })) return;
  try { await api.deleteUser(uname); renderListUsers(); toast('Akun dihapus'); } catch (e) { toast('Gagal: ' + e.message); }
}