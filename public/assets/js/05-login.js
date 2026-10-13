// =========================================================
// LOGIN
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

function findUser(username, role) {
  const u = username.trim().toLowerCase();
  if (!u) return null;
  if ((role === 'admin' || role === 'musyrif') && USERS[u]) {
    if (USERS[u].role === role || USERS[u].role === 'admin') return { key: u, ...USERS[u] };
  }
  if (role === 'santri' || role === 'wali') {
    const s = DB.santri.find(x => {
      const uname = (x.username || x.nama.toLowerCase().replace(/\s+/g, '')).toLowerCase();
      return uname === u || x.nama.toLowerCase() === u;
    });
    if (s) {
      return {
        key: s.username || s.nama.toLowerCase().replace(/\s+/g, ''),
        password: role === 'santri' ? (s.passSantri || DEFAULT_SANTRI_PASS) : (s.passWali || DEFAULT_WALI_PASS),
        role, nama: s.nama, santriId: s.id,
      };
    }
  }
  return null;
}

function togglePass() {
  const inp = document.getElementById('loginPassword');
  const btn = document.getElementById('togglePassBtn');
  if (!inp || !btn) return;
  if (inp.type === 'password') { inp.type = 'text'; btn.textContent = '🙈'; }
  else { inp.type = 'password'; btn.textContent = '👁'; }
}

function masuk() {
  const usernameEl = document.getElementById('loginUsername');
  const passwordEl = document.getElementById('loginPassword');
  const errEl = document.getElementById('loginError');
  if (!usernameEl || !passwordEl) return;

  const username = usernameEl.value.trim();
  const password = passwordEl.value;
  if (errEl) errEl.style.display = 'none';

  if (!username) { if (errEl) { errEl.textContent = 'Username harus diisi'; errEl.style.display = 'block'; } return; }
  if (!password) { if (errEl) { errEl.textContent = 'Password harus diisi'; errEl.style.display = 'block'; } return; }

  const found = findUser(username, roleLogin);
  if (!found) { if (errEl) { errEl.textContent = 'Username tidak ditemukan untuk role ini'; errEl.style.display = 'block'; } return; }
  if (hashPass(password) !== found.password) { if (errEl) { errEl.textContent = 'Password salah'; errEl.style.display = 'block'; } return; }

  /* Reset dulu — dibungkus try/catch */
  try { resetRoleUI(); } catch (e) { console.warn('resetRoleUI:', e); }

  user = { nama: found.nama, username: found.key, role: found.role, santriId: found.santriId || null };
  try { localStorage.setItem('th_user', JSON.stringify(user)); } catch (e) { console.warn('localStorage:', e); }

  /* Render & applyRole dengan try/catch — jangan sampai gagal login */
  try { render(); } catch (e) { console.error('render error:', e); }
  try { applyRole(); } catch (e) { console.error('applyRole error:', e); }

  /* Sembunyikan login screen — WAJIB berhasil */
  const loginScreen = document.getElementById('loginScreen');
  if (loginScreen) loginScreen.style.display = 'none';
  if (passwordEl) passwordEl.value = '';

  try { toast('Selamat datang, ' + found.nama); } catch (e) {}
}

async function keluar() {
  try {
    const ok = await konfirmasi('Keluar dari aplikasi?', { title: 'Logout', okText: 'Ya, Keluar' });
    if (!ok) return;
  } catch (e) {
    console.warn('konfirmasi error:', e);
  }

  try { localStorage.removeItem('th_user'); } catch (e) {}
  try { resetRoleUI(); } catch (e) { console.warn('resetRoleUI:', e); }

  /* Reset tampilan panel & nav */
  ['santri', 'setoran', 'absen', 'mutabaah', 'halaqah', 'leaderboard', 'laporan', 'pengaturan'].forEach(tab => {
    const panel = document.getElementById('panel-' + tab);
    const navs = document.querySelectorAll(`[data-tab="${tab}"]`);
    if (panel) panel.style.display = '';
    navs.forEach(el => el.style.display = '');
  });

  user = null;

  const loginScreen = document.getElementById('loginScreen');
  if (loginScreen) loginScreen.style.display = 'flex';

  const usernameEl = document.getElementById('loginUsername');
  const passwordEl = document.getElementById('loginPassword');
  const errEl = document.getElementById('loginError');
  if (usernameEl) usernameEl.value = '';
  if (passwordEl) passwordEl.value = '';
  if (errEl) errEl.style.display = 'none';

  roleLogin = 'admin';
  document.querySelectorAll('.role-item').forEach((b, i) => {
    if (i === 0) b.classList.add('active');
    else b.classList.remove('active');
  });
  if (usernameEl) usernameEl.placeholder = 'admin';
}

/* =========================================================
   RESET ROLE UI — Bersihkan semua kondisi khusus role
   ========================================================= */
function resetRoleUI() {
  const selSetoran = document.getElementById('inSetoranSantri');
  if (selSetoran) {
    selSetoran.disabled = false;
    selSetoran.style.opacity = '';
    selSetoran.style.cursor = '';
    selSetoran.selectedIndex = 0;
  }

  const boxSetoran = document.getElementById('formSetoranBox');
  if (boxSetoran) {
    delete boxSetoran.dataset.santriMode;
    const title = boxSetoran.querySelector('.box-title');
    if (title) title.textContent = 'Input Setoran';
  }

  ['inMutabaahSantri', 'inLaporanSantri'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.disabled = false;
      el.style.opacity = '';
      el.style.cursor = '';
      el.selectedIndex = 0;
    }
  });
}

/* =========================================================
   APPLY ROLE — Atur tampilan sesuai role user yang login
   ========================================================= */
function applyRole() {
  if (!user) return;
  const { nama, role, santriId } = user;

  /* Info user di header */
  const userNamaEl = document.getElementById('userNama');
  const userRoleEl = document.getElementById('userRole');
  const userAvEl = document.getElementById('userAv');
  if (userNamaEl) userNamaEl.textContent = nama;
  if (userRoleEl) userRoleEl.textContent = role;
  if (userAvEl) userAvEl.textContent = nama.charAt(0).toUpperCase();

  const isEditor = role === 'admin' || role === 'musyrif';
  const canSubmitSetoran = role === 'admin' || role === 'musyrif' || role === 'santri';
  const isAdmin = role === 'admin';
  const isSantri = role === 'santri';
  const isWali = role === 'wali';

  /* Form tambah santri — hanya admin & musyrif */
  const formSantriBox = document.getElementById('formSantriBox');
  if (formSantriBox) formSantriBox.style.display = isEditor ? 'block' : 'none';

  /* Hide panel & nav untuk santri/wali */
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

  /* Kalau santri/wali, pindah ke tab setoran */
  if (hidePanels) {
    try { if (typeof bukaTab === 'function') bukaTab('setoran'); } catch (e) {}
  }

  /* Form setoran — admin, musyrif, santri */
  const formSetoranBox = document.getElementById('formSetoranBox');
  if (formSetoranBox) formSetoranBox.style.display = canSubmitSetoran ? 'block' : 'none';

  /* Khusus santri — lock dropdown */
  if (isSantri && santriId) {
    const sel = document.getElementById('inSetoranSantri');
    if (sel) {
      sel.value = String(santriId);
      sel.disabled = true;
      sel.style.opacity = '0.7';
      sel.style.cursor = 'not-allowed';
    }
    if (formSetoranBox) {
      formSetoranBox.dataset.santriMode = '1';
      const title = formSetoranBox.querySelector('.box-title');
      if (title) title.innerHTML = 'Input Setoran Mandiri <span class="hint">Akan direview musyrif</span>';
    }
    ['inMutabaahSantri', 'inLaporanSantri'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.value = String(santriId);
        el.disabled = true;
        el.style.opacity = '0.7';
        el.style.cursor = 'not-allowed';
      }
    });
  }

  /* Box khusus admin */
  const boxHalaqah = document.getElementById('boxKelolaHalaqah');
  const boxUser = document.getElementById('boxKelolaUser');
  const boxAmalan = document.getElementById('boxCustomAmalan');
  const boxPengumuman = document.getElementById('boxPengumuman');
  if (boxHalaqah) boxHalaqah.style.display = isAdmin ? 'block' : 'none';
  if (boxUser) boxUser.style.display = isAdmin ? 'block' : 'none';
  if (boxAmalan) boxAmalan.style.display = isAdmin ? 'block' : 'none';
  if (boxPengumuman) boxPengumuman.style.display = isAdmin ? 'block' : 'none';
}