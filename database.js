// =========================================================
// DATABASE — SQLite menggunakan better-sqlite3
// =========================================================
const Database = require('better-sqlite3');
const path = require('path');

// Gunakan environment variable untuk Railway volume, atau path lokal
const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, 'tqa.db');
const db = new Database(DB_PATH);

// =========================================================
// HELPER WRAPPER (Agar tetap kompatibel dengan server.js)
// =========================================================
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare(sql);
      const info = stmt.run(...params);
      resolve({ lastID: info.lastInsertRowid, changes: info.changes });
    } catch (err) { reject(err); }
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare(sql);
      const row = stmt.get(...params);
      resolve(row);
    } catch (err) { reject(err); }
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare(sql);
      const rows = stmt.all(...params);
      resolve(rows || []);
    } catch (err) { reject(err); }
  });
}

function exec(sql) {
  return new Promise((resolve, reject) => {
    try {
      db.exec(sql);
      resolve();
    } catch (err) { reject(err); }
  });
}

// =========================================================
// INIT — buat tabel & seed
// =========================================================
async function init() {
  await exec(`
    CREATE TABLE IF NOT EXISTS santri (
      id INTEGER PRIMARY KEY, nama TEXT NOT NULL, username TEXT, halaqah TEXT,
      target INTEGER DEFAULT 30, tglLahir TEXT, namaWali TEXT, hpWali TEXT,
      foto TEXT, kodeId TEXT, passSantri TEXT, passWali TEXT, createdAt TEXT
    );
    CREATE TABLE IF NOT EXISTS setoran (
      id INTEGER PRIMARY KEY, santriId INTEGER NOT NULL, jenis TEXT, juz INTEGER,
      surah TEXT, ayat TEXT, nilai TEXT, tajwid TEXT, catatan TEXT, audio TEXT,
      tanggal TEXT, dariSantri INTEGER DEFAULT 0, diinputOleh TEXT,
      diverifikasi INTEGER DEFAULT 1, diverifikasiOleh TEXT, diverifikasiTanggal TEXT, createdAt TEXT
    );
    CREATE TABLE IF NOT EXISTS absen (
      id INTEGER PRIMARY KEY, santriId INTEGER NOT NULL, tanggal TEXT NOT NULL,
      status TEXT, createdAt TEXT
    );
    CREATE TABLE IF NOT EXISTS mutabaah (
      id INTEGER PRIMARY KEY, santriId INTEGER NOT NULL, tanggal TEXT NOT NULL,
      items TEXT, createdAt TEXT
    );
    CREATE TABLE IF NOT EXISTS halaqah (
      id INTEGER PRIMARY KEY, nama TEXT UNIQUE NOT NULL, musyrif TEXT, createdAt TEXT
    );
    CREATE TABLE IF NOT EXISTS amalan (
      id TEXT PRIMARY KEY, t TEXT NOT NULL, createdAt TEXT
    );
    CREATE TABLE IF NOT EXISTS users (
      username TEXT PRIMARY KEY, password TEXT NOT NULL, role TEXT NOT NULL, nama TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS pengumuman (
      id INTEGER PRIMARY KEY CHECK (id = 1), teks TEXT, updatedAt TEXT
    );
  `);

  const { hashPass } = require('./hash');

  const halaqahCount = await get('SELECT COUNT(*) AS c FROM halaqah');
  if (halaqahCount.c === 0) {
    const now = new Date().toISOString();
    await run('INSERT INTO halaqah (id, nama, musyrif, createdAt) VALUES (?, ?, ?, ?)', [Date.now(), 'Halaqah A', 'musyrif', now]);
    await run('INSERT INTO halaqah (id, nama, musyrif, createdAt) VALUES (?, ?, ?, ?)', [Date.now() + 1, 'Halaqah B', null, now]);
  }

  const amalanCount = await get('SELECT COUNT(*) AS c FROM amalan');
  if (amalanCount.c === 0) {
    const now = new Date().toISOString();
    const defaults = [
      ['subuh', 'Sholat Subuh berjamaah'], ['dzuhur', 'Sholat Dzuhur berjamaah'],
      ['ashar', 'Sholat Ashar berjamaah'], ['maghrib', 'Sholat Maghrib berjamaah'],
      ['isya', 'Sholat Isya berjamaah'], ['tahajud', 'Sholat Tahajud / Witir'],
      ['dhuha', 'Sholat Dhuha'], ['tilawah', "Tilawah Al-Qur'an"],
      ['murojaah', "Muroja'ah hafalan"], ['dzikir', 'Dzikir pagi & petang'],
    ];
    for (const [id, t] of defaults) {
      await run('INSERT INTO amalan (id, t, createdAt) VALUES (?, ?, ?)', [id, t, now]);
    }
  }

  const usersCount = await get('SELECT COUNT(*) AS c FROM users');
  if (usersCount.c === 0) {
    await run('INSERT INTO users (username, password, role, nama) VALUES (?, ?, ?, ?)', ['admin', hashPass('admin123'), 'admin', 'Administrator']);
    await run('INSERT INTO users (username, password, role, nama) VALUES (?, ?, ?, ?)', ['musyrif', hashPass('musyrif123'), 'musyrif', 'Musyrif']);
  }

  const pengCount = await get('SELECT COUNT(*) AS c FROM pengumuman');
  if (pengCount.c === 0) {
    await run('INSERT INTO pengumuman (id, teks, updatedAt) VALUES (1, ?, ?)', ['', new Date().toISOString()]);
  }

  console.log('✅ Database siap');
}

module.exports = { db, run, get, all, exec, init };