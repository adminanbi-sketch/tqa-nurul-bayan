// =========================================================
// LOGIN
// =========================================================
let roleLogin = 'admin';

function pilihRole(r, btn) {
  roleLogin = r;
  document.querySelectorAll('.role-item').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const input = document.getElementById('loginUsername');
  if (input) input.placeholder = r === 'admin' ? 'admin' : (r === 'musyrif' ? 'musyrif' : 'nama santri');
}

function togglePass() {
  const inp = document.getElementById('loginPassword'); const btn = document.getElementById('togglePassBtn');
  if (!inp || !btn) return;
  if (inp.type === 'password') { inp.type = 'text'; btn.textContent = '🙈'; } else { inp.type = 'password'; btn.textContent = '👁'; }
}

async function masuk() {
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errEl = document.getElementById('loginError');
  errEl.style.display = 'none';
  if (!username || !password) { errEl.textContent = 'Isi username & password'; errEl.style.display = 'block'; return; }

  try {
    const found = await api.login(username, password, roleLogin);
    user = { nama: found.nama, username: found.username, role: found.role, santriId: found.santriId };
    localStorage.setItem('th_user', JSON.stringify(user));
    
    await loadAllData();
    applyRole();
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('loginPassword').value = '';
    render();
    toast('Selamat datang, ' + found.nama);
  } catch (e) {
    errEl.textContent = e.message || 'Login gagal'; errEl.style.display = 'block';
  }
}

async function keluar() {
  const ok = await konfirmasi('Keluar dari aplikasi?', { title: 'Logout', okText: 'Ya' });
  if (!ok) return;
  localStorage.removeItem('th_user');
  user = null;
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('loginUsername').value = ''; document.getElementById('loginPassword').value = '';
}

function applyRole() {
  if (!user) return;
  document.getElementById('userNama').textContent = user.nama;
  document.getElementById('userRole').textContent = user.role;
  document.getElementById('userAv').textContent = user.nama.charAt(0).toUpperCase();
  const isEditor = user.role === 'admin' || user.role === 'musyrif';
  document.getElementById('formSantriBox').style.display = isEditor ? 'block' : 'none';
  document.getElementById('formSetoranBox').style.display = isEditor ? 'block' : 'none';
  const isAdmin = user.role === 'admin';
  document.getElementById('boxKelolaHalaqah').style.display = isAdmin ? 'block' : 'none';
  document.getElementById('boxKelolaUser').style.display = isAdmin ? 'block' : 'none';
}