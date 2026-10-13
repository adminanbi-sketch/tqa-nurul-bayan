// =========================================================
// KELOLA USER
// =========================================================
function renderListUsers() {
  const el = document.getElementById('listUsers');
  if (!el) return;
  const keys = Object.keys(USERS).filter(k => USERS[k].role === 'musyrif');
  if (keys.length === 0) { el.innerHTML = '<div style="font-size:12.5px;color:var(--text-muted)">Belum ada akun musyrif tambahan.</div>'; return; }
  el.innerHTML = keys.map(k => `
    <div class="item" style="padding:10px">
      <div class="item-main">
        <div class="item-name">${USERS[k].nama}</div>
        <div class="item-meta">username: <code>${k}</code></div>
      </div>
      <button class="btn btn-red" onclick="hapusMusyrif('${k}')">Hapus</button>
    </div>
  `).join('');
}

function tambahMusyrif() {
  const uname = document.getElementById('newUserName').value.trim().toLowerCase().replace(/\s+/g, '');
  const nama = document.getElementById('newUserNama').value.trim();
  const pass = document.getElementById('newUserPass').value;
  if (!uname || !nama || !pass) return toast('Semua field harus diisi');
  if (pass.length < 6) return toast('Password minimal 6 karakter');
  if (USERS[uname]) return toast('Username sudah dipakai');
  USERS[uname] = { password: hashPass(pass), role: 'musyrif', nama };
  saveUsers();
  document.getElementById('newUserName').value = '';
  document.getElementById('newUserNama').value = '';
  document.getElementById('newUserPass').value = '';
  renderListUsers();
  renderHalaqahAdmin();
  renderHalaqahDropdowns();
  toast('Musyrif ditambahkan');
}

async function hapusMusyrif(uname) {
  const ok = await konfirmasi('Hapus akun musyrif ini?', { title: 'Hapus Akun', okText: 'Ya, Hapus' });
  if (!ok) return;
  delete USERS[uname];
  saveUsers();
  renderListUsers();
  renderHalaqahAdmin();
  toast('Akun dihapus');
}
