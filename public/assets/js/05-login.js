// =========================================================
// LOGIN & LOGOUT (FINAL)
// =========================================================
let roleLogin = 'admin';

function pilihRole(r, btn) {
  roleLogin = r;
  document.querySelectorAll('.role-item').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const input = document.getElementById('loginUsername');
  const err = document.getElementById('loginError');
  if (err) err.style.display = 'none';
  if (input) {
    if (r === 'admin') input.placeholder = 'admin';
    else if (r === 'musyrif') input.placeholder = 'musyrif';
    else input.placeholder = 'nama santri (tanpa spasi)';
  }
}

function togglePass() {
  const inp = document.getElementById('loginPassword'); 
  const btn = document.getElementById('togglePassBtn');
  if (!inp || !btn) return;
  if (inp.type === 'password') { inp.type = 'text'; btn.textContent = '🙈'; } 
  else { inp.type = 'password'; btn.textContent = '👁'; }
}

async function masuk() {
  const usernameEl = document.getElementById('loginUsername');
  const passwordEl = document.getElementById('loginPassword');
  const errEl = document.getElementById('loginError');
  if (!usernameEl || !passwordEl) return;

  const username = usernameEl.value.trim();
  const password = passwordEl.value;
  if (errEl) errEl.style.display = 'none';

  if (!username) { if (errEl) { errEl.textContent = 'Username harus diisi'; errEl.style.display = 'block'; } return; }
  if (!password) { if (errEl) { errEl.textContent = 'Password harus diisi'; errEl.style.display = 'block'; } return; }

  const btn = document.querySelector('#loginScreen .btn-main');
  const origText = btn ? btn.textContent : 'Masuk';
  if (btn) { btn.disabled = true; btn.textContent = 'Memproses...'; }

  try {
    const found = await api.login(username, password, roleLogin);
    user = { nama: found.nama, username: found.username, role: found.role, santriId: found.santriId };
    localStorage.setItem('th_user', JSON.stringify(user));
    
    await loadAllData();
    
    const loginScreen = document.getElementById('loginScreen');
    if (loginScreen) loginScreen.style.display = 'none';
    
    if (passwordEl) passwordEl.value = '';
    
    applyRole();
    render();
    if (typeof renderHalaqahDropdowns === 'function') renderHalaqahDropdowns();
    
    toast('Selamat datang, ' + found.nama);
  } catch (e) {
    if (errEl) { errEl.textContent = e.message || 'Login gagal'; errEl.style.display = 'block'; }
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = origText; }
  }
}

// ✅ FUNGSI LOGOUT PAKSA
async function keluar() {
  try {
    const ok = await konfirmasi('Keluar dari aplikasi?', { title: 'Logout', okText: 'Ya, Keluar' });
    if (!ok) return;
  } catch (e) {
    console.warn('Konfirmasi error:', e);
  }

  // 1. Hapus sesi
  localStorage.removeItem('th_user');
  user = null;

  // 2. Tampilkan kembali layar login
  const loginScreen = document.getElementById('loginScreen');
  if (loginScreen) {
    loginScreen.style.display = 'flex';
    loginScreen.style.zIndex = '99999'; // Paksa muncul di paling atas
  }

  // 3. Bersihkan form login
  const usernameEl = document.getElementById('loginUsername');
  const passwordEl = document.getElementById('loginPassword');
  const errEl = document.getElementById('loginError');
  if (usernameEl) usernameEl.value = '';
  if (passwordEl) passwordEl.value = '';
  if (errEl) errEl.style.display = 'none';

  // 4. Reset role ke admin
  roleLogin = 'admin';
  document.querySelectorAll('.role-item').forEach((b, i) => {
    if (i === 0) b.classList.add('active');
    else b.classList.remove('active');
  });
  if (usernameEl) usernameEl.placeholder = 'admin';

  // 5. Sembunyikan semua overlay/modal jika ada yang nyangkut
  document.querySelectorAll('.modal-overlay, .confirm-overlay, .notif-panel').forEach(el => {
    el.classList.remove('on');
  });
}

function applyRole() {
  if (!user) return;
  const { nama, role } = user;

  const setTxt = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  const setDisp = (id, val) => { const el = document.getElementById(id); if (el) el.style.display = val; };

  setTxt('userNama', nama);
  setTxt('userRole', role);
  setTxt('userAv', nama.charAt(0).toUpperCase());

  const subMap = { admin: 'Administrator', musyrif: 'Musyrif halaqah', santri: 'Akun santri', wali: 'Akun wali' };
  setTxt('headerSub', subMap[role]);

  const isEditor = role === 'admin' || role === 'musyrif';
  const isAdmin = role === 'admin';
  const isSantri = role === 'santri';
  const isWali = role === 'wali';

  setDisp('formSantriBox', isEditor ? 'block' : 'none');
  setDisp('formSetoranBox', isEditor || isSantri ? 'block' : 'none');

  const hidePanels = isSantri || isWali;
  ['santri', 'absen', 'mutabaah'].forEach(tab => {
    const panel = document.getElementById('panel-' + tab);
    const navs = document.querySelectorAll(`[data-tab="${tab}"]`);
    if (hidePanels) {
      if (panel) panel.style.display = 'none';
      navs.forEach(el => el.style.display = 'none');
    } else {
      if (panel) panel.style.display = '';
      navs.forEach(el => el.style.display = '');
    }
  });

  setDisp('boxKelolaHalaqah', isAdmin ? 'block' : 'none');
  setDisp('boxKelolaUser', isAdmin ? 'block' : 'none');
  setDisp('boxCustomAmalan', isAdmin ? 'block' : 'none');
  setDisp('boxPengumuman', isAdmin ? 'block' : 'none');
}