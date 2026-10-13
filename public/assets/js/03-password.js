// =========================================================
// PASSWORD
// =========================================================
function hashPass(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; }
  try { return 'h' + Math.abs(h).toString(36) + '_' + btoa(unescape(encodeURIComponent(s))).slice(0, 8); }
  catch (e) { return 'h' + Math.abs(h).toString(36); }
}
const DEFAULT_USERS = {
  admin:   { password: hashPass('admin123'),   role: 'admin',   nama: 'Administrator' },
  musyrif: { password: hashPass('musyrif123'), role: 'musyrif', nama: 'Musyrif' },
};
const DEFAULT_SANTRI_PASS = hashPass('santri123');
const DEFAULT_WALI_PASS = hashPass('wali123');

function loadUsers() {
  try {
    const raw = localStorage.getItem('th_users');
    if (raw) {
      const u = JSON.parse(raw);
      for (const k in DEFAULT_USERS) if (!u[k]) u[k] = DEFAULT_USERS[k];
      return u;
    }
  } catch (e) {}
  return JSON.parse(JSON.stringify(DEFAULT_USERS));
}
function saveUsers() { localStorage.setItem('th_users', JSON.stringify(USERS)); }
let USERS = loadUsers();
