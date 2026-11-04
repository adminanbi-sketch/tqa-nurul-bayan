// =========================================================
// KELOLA USER — via API
// =========================================================
async function tambahMusyrif() {
  const uname = document.getElementById('newUserName').value.trim().toLowerCase().replace(/\s+/g, '');
  const nama = document.getElementById('newUserNama').value.trim();
  const pass = document.getElementById('newUserPass').value;
  
  if (!uname || !nama || !pass) return toast('Semua field harus diisi');
  if (pass.length < 6) return toast('Password minimal 6 karakter');

  try {
    // Simpan ke Database via API (password di-hash oleh server)
    await api.addUser({ username: uname, nama, password: pass });
    
    document.getElementById('newUserName').value = '';
    document.getElementById('newUserNama').value = '';
    document.getElementById('newUserPass').value = '';
    
    renderListUsers();
    renderHalaqahAdmin();
    renderHalaqahDropdowns();
    toast('Musyrif ditambahkan ke server');
  } catch (e) {
    toast('Gagal menambahkan: ' + e.message);
  }
}

async function renderListUsers() {
  const el = document.getElementById('listUsers');
  if (!el) return;
  
  try {
    // Ambil data musyrif langsung dari server
    const users = await api.getUsers(); 
    
    if (users.length === 0) { 
      el.innerHTML = '<div style="font-size:12.5px;color:var(--text-muted)">Belum ada akun musyrif tambahan.</div>'; 
      return; 
    }
    
    el.innerHTML = users.map(u => `
      <div class="item" style="padding:10px">
        <div class="item-main">
          <div class="item-name">${u.nama}</div>
          <div class="item-meta">username: <code>${u.username}</code></div>
        </div>
        <button class="btn btn-red" onclick="hapusMusyrif('${u.username}')">Hapus</button>
      </div>
    `).join('');
  } catch (e) {
    el.innerHTML = '<div style="font-size:12.5px;color:var(--danger)">Gagal memuat user: ' + e.message + '</div>';
  }
}

async function tambahMusyrif() {
  const uname = document.getElementById('newUserName').value.trim().toLowerCase().replace(/\s+/g, '');
  const nama = document.getElementById('newUserNama').value.trim();
  const pass = document.getElementById('newUserPass').value;
  
  if (!uname || !nama || !pass) return toast('Semua field harus diisi');
  if (pass.length < 6) return toast('Password minimal 6 karakter');

  try {
    // Simpan ke Database via API
    await api.addUser({ username: uname, nama, password: pass });
    
    document.getElementById('newUserName').value = '';
    document.getElementById('newUserNama').value = '';
    document.getElementById('newUserPass').value = '';
    
    renderListUsers();
    renderHalaqahAdmin();
    renderHalaqahDropdowns();
    toast('Musyrif ditambahkan ke server');
  } catch (e) {
    toast('Gagal menambahkan: ' + e.message);
  }
}

async function hapusMusyrif(uname) {
  const ok = await konfirmasi('Hapus akun musyrif ini?', { title: 'Hapus Akun', okText: 'Ya, Hapus' });
  if (!ok) return;
  
  try {
    await api.deleteUser(uname);
    renderListUsers();
    renderHalaqahAdmin();
    toast('Akun dihapus dari server');
  } catch (e) {
    toast('Gagal menghapus: ' + e.message);
  }
}