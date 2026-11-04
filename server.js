// =========================================================
// TQA NURUL BAYAN — Server + API + Database (sqlite3)
// =========================================================
const express = require('express');
const path = require('path');
const os = require('os');
const { run, get, all, init } = require('./database');
const { hashPass } = require('./hash');

const app = express();
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

// =========================================================
// MIDDLEWARE
// =========================================================
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use((req, res, next) => {
  if (req.url.startsWith('/api/')) {
    const now = new Date().toLocaleTimeString('id-ID');
    console.log(`[${now}] ${req.method} ${req.url}`);
  }
  next();
});

// Jangan cache API response
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Static files dari public/
app.use(express.static(path.join(__dirname, 'public'), {
  extensions: ['html'],
  setHeaders: (res, filePath) => {
    if (filePath.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff2?)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// =========================================================
// HELPER
// =========================================================
function ok(res, data) { res.json({ ok: true, data }); }
function fail(res, msg, code = 400) { res.status(code).json({ ok: false, error: msg }); }

// Wrapper biar tidak crash kalau ada error
function wrap(fn) {
  return async (req, res) => {
    try {
      await fn(req, res);
    } catch (e) {
      console.error('❌ API Error:', e);
      fail(res, e.message || 'Terjadi kesalahan server', 500);
    }
  };
}

// =========================================================
// API — AUTH
// =========================================================
app.post('/api/login', wrap(async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) return fail(res, 'Data tidak lengkap');

  const u = username.trim().toLowerCase();

  if (role === 'admin' || role === 'musyrif') {
    const user = await get('SELECT * FROM users WHERE username = ?', [u]);
    if (!user) return fail(res, 'Username tidak ditemukan');
    if (user.role !== role && user.role !== 'admin') return fail(res, 'Role tidak sesuai');
    if (user.password !== hashPass(password)) return fail(res, 'Password salah');
    return ok(res, { nama: user.nama, username: user.username, role: user.role, santriId: null });
  }

  if (role === 'santri' || role === 'wali') {
    const s = await get('SELECT * FROM santri WHERE LOWER(username) = ? OR LOWER(nama) = ?', [u, u]);
    if (!s) return fail(res, 'Username tidak ditemukan');
    const field = role === 'santri' ? 'passSantri' : 'passWali';
    const stored = s[field];
    const expected = role === 'santri' ? hashPass('santri123') : hashPass('wali123');
    if (stored && stored !== hashPass(password)) return fail(res, 'Password salah');
    if (!stored && hashPass(password) !== expected) return fail(res, 'Password salah');
    return ok(res, { nama: s.nama, username: s.username, role, santriId: s.id });
  }

  fail(res, 'Role tidak dikenal');
}));

// =========================================================
// API — SANTRI
// =========================================================
app.get('/api/santri', wrap(async (req, res) => {
  ok(res, await all('SELECT * FROM santri ORDER BY nama ASC'));
}));

app.post('/api/santri', wrap(async (req, res) => {
  const s = req.body;
  if (!s.nama) return fail(res, 'Nama wajib diisi');
  const id = Date.now();
  const username = s.username || s.nama.toLowerCase().replace(/[^a-z0-9]/g, '');
  const now = new Date().toISOString();
  await run(`INSERT INTO santri
    (id, nama, username, halaqah, target, tglLahir, namaWali, hpWali, foto, kodeId, passSantri, passWali, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, s.nama, username, s.halaqah, s.target || 30, s.tglLahir || '', s.namaWali || '', s.hpWali || '', s.foto || null, s.kodeId || null, hashPass('santri123'), hashPass('wali123'), now]);
  ok(res, await get('SELECT * FROM santri WHERE id = ?', [id]));
}));

app.put('/api/santri/:id', wrap(async (req, res) => {
  const id = parseInt(req.params.id);
  const s = req.body;
  await run(`UPDATE santri SET nama=?, halaqah=?, target=?, tglLahir=?, namaWali=?, hpWali=?, foto=?, kodeId=? WHERE id=?`,
    [s.nama, s.halaqah, s.target, s.tglLahir, s.namaWali, s.hpWali, s.foto, s.kodeId, id]);
  ok(res, { updated: true });
}));

app.delete('/api/santri/:id', wrap(async (req, res) => {
  const id = parseInt(req.params.id);
  await run('DELETE FROM santri WHERE id = ?', [id]);
  await run('DELETE FROM setoran WHERE santriId = ?', [id]);
  await run('DELETE FROM absen WHERE santriId = ?', [id]);
  await run('DELETE FROM mutabaah WHERE santriId = ?', [id]);
  ok(res, { deleted: true });
}));

// =========================================================
// API — SETORAN
// =========================================================
app.get('/api/setoran', wrap(async (req, res) => {
  const rows = await all('SELECT * FROM setoran ORDER BY tanggal DESC');
  rows.forEach(r => {
    try { r.tajwid = JSON.parse(r.tajwid); } catch (e) { r.tajwid = {}; }
    r.dariSantri = !!r.dariSantri;
    r.diverifikasi = !!r.diverifikasi;
  });
  ok(res, rows);
}));

app.post('/api/setoran', wrap(async (req, res) => {
  const s = req.body;
  const id = Date.now();
  const now = new Date().toISOString();
  await run(`INSERT INTO setoran
    (id, santriId, jenis, juz, surah, ayat, nilai, tajwid, catatan, audio, tanggal, dariSantri, diinputOleh, diverifikasi, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, s.santriId, s.jenis, s.juz, s.surah, s.ayat, s.nilai, JSON.stringify(s.tajwid || {}), s.catatan || '', s.audio || null, s.tanggal || now, s.dariSantri ? 1 : 0, s.diinputOleh || '', s.diverifikasi ? 1 : 0, now]);
  ok(res, { id, ...s });
}));

app.put('/api/setoran/:id/verifikasi', wrap(async (req, res) => {
  const id = parseInt(req.params.id);
  const { oleh } = req.body;
  await run('UPDATE setoran SET diverifikasi=1, diverifikasiOleh=?, diverifikasiTanggal=? WHERE id=?',
    [oleh || 'Admin', new Date().toISOString(), id]);
  ok(res, { verified: true });
}));

app.delete('/api/setoran/:id', wrap(async (req, res) => {
  await run('DELETE FROM setoran WHERE id = ?', [parseInt(req.params.id)]);
  ok(res, { deleted: true });
}));

// =========================================================
// API — ABSEN
// =========================================================
app.get('/api/absen', wrap(async (req, res) => {
  ok(res, await all('SELECT * FROM absen ORDER BY tanggal DESC'));
}));

app.post('/api/absen', wrap(async (req, res) => {
  const items = req.body.items || [];
  const now = new Date().toISOString();
  for (const it of items) {
    await run('DELETE FROM absen WHERE santriId = ? AND tanggal = ?', [it.santriId, it.tanggal]);
    await run('INSERT INTO absen (id, santriId, tanggal, status, createdAt) VALUES (?, ?, ?, ?, ?)',
      [Date.now() + it.santriId, it.santriId, it.tanggal, it.status, now]);
  }
  ok(res, { saved: items.length });
}));

// =========================================================
// API — MUTABAAH
// =========================================================
app.get('/api/mutabaah', wrap(async (req, res) => {
  const rows = await all('SELECT * FROM mutabaah ORDER BY tanggal DESC');
  rows.forEach(r => { try { r.items = JSON.parse(r.items); } catch (e) { r.items = {}; } });
  ok(res, rows);
}));

app.post('/api/mutabaah', wrap(async (req, res) => {
  const m = req.body;
  const now = new Date().toISOString();
  await run('DELETE FROM mutabaah WHERE santriId = ? AND tanggal = ?', [m.santriId, m.tanggal]);
  await run('INSERT INTO mutabaah (id, santriId, tanggal, items, createdAt) VALUES (?, ?, ?, ?, ?)',
    [Date.now(), m.santriId, m.tanggal, JSON.stringify(m.items || {}), now]);
  ok(res, { saved: true });
}));

// =========================================================
// API — HALAQAH
// =========================================================
app.get('/api/halaqah', wrap(async (req, res) => {
  ok(res, await all('SELECT * FROM halaqah ORDER BY nama'));
}));

app.post('/api/halaqah', wrap(async (req, res) => {
  const { nama, musyrif } = req.body;
  if (!nama) return fail(res, 'Nama wajib diisi');
  try {
    const id = Date.now();
    await run('INSERT INTO halaqah (id, nama, musyrif, createdAt) VALUES (?, ?, ?, ?)',
      [id, nama, musyrif || null, new Date().toISOString()]);
    ok(res, { id, nama, musyrif });
  } catch (e) { fail(res, 'Halaqah sudah ada'); }
}));

app.delete('/api/halaqah/:id', wrap(async (req, res) => {
  await run('DELETE FROM halaqah WHERE id = ?', [parseInt(req.params.id)]);
  ok(res, { deleted: true });
}));

// =========================================================
// API — AMALAN
// =========================================================
app.get('/api/amalan', wrap(async (req, res) => {
  ok(res, await all('SELECT * FROM amalan ORDER BY createdAt'));
}));

app.post('/api/amalan', wrap(async (req, res) => {
  const { t } = req.body;
  if (!t) return fail(res, 'Nama amalan wajib');
  const id = 'am_' + Date.now();
  await run('INSERT INTO amalan (id, t, createdAt) VALUES (?, ?, ?)', [id, t, new Date().toISOString()]);
  ok(res, { id, t });
}));

app.delete('/api/amalan/:id', wrap(async (req, res) => {
  await run('DELETE FROM amalan WHERE id = ?', [req.params.id]);
  ok(res, { deleted: true });
}));

// =========================================================
// API — USERS (Musyrif)
// =========================================================
app.get('/api/users', wrap(async (req, res) => {
  ok(res, await all("SELECT username, role, nama FROM users WHERE role = 'musyrif'"));
}));

app.post('/api/users', wrap(async (req, res) => {
  const { username, nama, password } = req.body;
  if (!username || !nama || !password) return fail(res, 'Data tidak lengkap');
  try {
    await run('INSERT INTO users (username, password, role, nama) VALUES (?, ?, ?, ?)',
      [username, hashPass(password), 'musyrif', nama]);
    ok(res, { username, nama });
  } catch (e) { fail(res, 'Username sudah dipakai'); }
}));

app.delete('/api/users/:username', wrap(async (req, res) => {
  await run('DELETE FROM users WHERE username = ?', [req.params.username]);
  ok(res, { deleted: true });
}));

// =========================================================
// API — PENGUMUMAN
// =========================================================
app.get('/api/pengumuman', wrap(async (req, res) => {
  const row = await get('SELECT * FROM pengumuman WHERE id = 1');
  ok(res, { teks: row ? row.teks : '' });
}));

app.post('/api/pengumuman', wrap(async (req, res) => {
  const { teks } = req.body;
  await run('UPDATE pengumuman SET teks = ?, updatedAt = ? WHERE id = 1', [teks || '', new Date().toISOString()]);
  ok(res, { saved: true });
}));

// =========================================================
// API — GANTI PASSWORD
// =========================================================
app.post('/api/ganti-password', wrap(async (req, res) => {
  const { username, role, santriId, lama, baru } = req.body;
  if (!lama || !baru) return fail(res, 'Data tidak lengkap');

  if (role === 'admin' || role === 'musyrif') {
    const u = await get('SELECT * FROM users WHERE username = ?', [username]);
    if (!u || u.password !== hashPass(lama)) return fail(res, 'Password lama salah');
    await run('UPDATE users SET password = ? WHERE username = ?', [hashPass(baru), username]);
    return ok(res, { changed: true });
  }

  if (role === 'santri' || role === 'wali') {
    const field = role === 'santri' ? 'passSantri' : 'passWali';
    const s = await get('SELECT * FROM santri WHERE id = ?', [santriId]);
    if (!s) return fail(res, 'Santri tidak ditemukan');
    const current = s[field] || hashPass(role === 'santri' ? 'santri123' : 'wali123');
    if (current !== hashPass(lama)) return fail(res, 'Password lama salah');
    await run(`UPDATE santri SET ${field} = ? WHERE id = ?`, [hashPass(baru), santriId]);
    return ok(res, { changed: true });
  }

  fail(res, 'Role tidak dikenal');
}));

// =========================================================
// API — BACKUP
// =========================================================
app.get('/api/backup', wrap(async (req, res) => {
  const data = {
    version: 3,
    exported: new Date().toISOString(),
    santri: await all('SELECT * FROM santri'),
    setoran: await all('SELECT * FROM setoran'),
    absen: await all('SELECT * FROM absen'),
    mutabaah: await all('SELECT * FROM mutabaah'),
    halaqah: await all('SELECT * FROM halaqah'),
    amalan: await all('SELECT * FROM amalan'),
    pengumuman: (await get('SELECT * FROM pengumuman WHERE id = 1'))?.teks || '',
  };
  res.setHeader('Content-Disposition', `attachment; filename="tqa_backup_${new Date().toISOString().split('T')[0]}.json"`);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(data, null, 2));
}));

// =========================================================
// FALLBACK
// =========================================================
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// =========================================================
// START
// =========================================================
init().then(() => {
  app.listen(PORT, HOST, () => {
    const interfaces = os.networkInterfaces();
    const addresses = [];
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) addresses.push(iface.address);
      }
    }
    console.log('');
    console.log('=================================================');
    console.log('   TQA NURUL BAYAN — Server + API + Database');
    console.log('=================================================');
    console.log('');
    console.log('   Lokal    : http://localhost:' + PORT);
    addresses.forEach(a => console.log('   Jaringan : http://' + a + ':' + PORT));
    console.log('');
    console.log('   Tekan Ctrl+C untuk stop');
    console.log('');
  });
}).catch(err => {
  console.error('❌ Gagal init database:', err);
  process.exit(1);
});